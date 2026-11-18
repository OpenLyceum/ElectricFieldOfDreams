/**
 * Fleet-standard memory-leak regression suite.
 * Creates an ElectricFieldOfDreamsModel, steps it, resets, drops the reference.
 * ParticleNode is created and removed with each particle; its cases run against a live model
 * whose particles (and their position Properties) outlive the node.
 */

import { Vector2 } from "scenerystack/dot";
import { ModelViewTransform2 } from "scenerystack/phetcommon";
import { describe, expect, it } from "vitest";
import { TimeModel } from "../src/common/TimeModel.js";
import { ElectricFieldOfDreamsModel } from "../src/electric-field-of-dreams/model/ElectricFieldOfDreamsModel.js";
import type { Particle } from "../src/electric-field-of-dreams/model/Particle.js";
import { FieldGridNode } from "../src/electric-field-of-dreams/view/FieldGridNode.js";
import { ParticleNode } from "../src/electric-field-of-dreams/view/ParticleNode.js";
import { StringManager } from "../src/i18n/StringManager.js";
import { describeDisposalLeaks, expectNoListenerGrowth, forceGC } from "./helpers/memoryLeak.js";

function createAndDropModel(): WeakRef<object> {
  const model = new ElectricFieldOfDreamsModel();
  model.externalFieldProperty.value = new Vector2(5, 0);
  const particle = model.addParticle(1, 1);
  particle.setPositionXY(model.center.x, model.center.y);
  model.stepOnce();
  model.reset();
  return new WeakRef<object>(model);
}

describe("Memory leak regression", () => {
  it("ElectricFieldOfDreamsModel is collected after drop", async () => {
    const ref = createAndDropModel();
    await forceGC(ref);
    expect(ref.deref()).toBeUndefined();
  });

  it("repeated create/drop cycles leave no survivors", async () => {
    const refs: WeakRef<object>[] = [];
    for (let i = 0; i < 10; i++) {
      refs.push(createAndDropModel());
    }
    await forceGC(refs);
    expect(refs.filter((r) => r.deref() !== undefined).length).toBe(0);
  });
});

describeDisposalLeaks([
  { name: "TimeModel", create: () => new TimeModel(), idempotentDispose: true },
  {
    name: "FieldGridNode",
    create: () => {
      const model = new ElectricFieldOfDreamsModel();
      const transform = ModelViewTransform2.createIdentity();
      return new FieldGridNode(model, transform, model.bounds);
    },
  },
]);

// ── ParticleNode against a live model ────────────────────────────────────────
const liveModel = new ElectricFieldOfDreamsModel();
const liveTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
  Vector2.ZERO,
  new Vector2(400, 300),
  40,
);
const positiveParticle = liveModel.addParticle(1, 1);
const negativeParticle = liveModel.addParticle(-1, 1);
const a11yControls = StringManager.getInstance().getA11yStrings().controls;

const particleNodeDependencies = (particle: Particle): readonly object[] => [
  particle.positionProperty,
  particle.isDraggingProperty,
  a11yControls.positiveChargeStringProperty,
  a11yControls.negativeChargeStringProperty,
  a11yControls.particleHelpStringProperty,
];

describeDisposalLeaks([
  {
    name: "ParticleNode (positive)",
    create: () => new ParticleNode(positiveParticle, liveModel, liveTransform),
    keepAlive: () => [liveModel, positiveParticle, ...particleNodeDependencies(positiveParticle)],
  },
  {
    name: "ParticleNode (negative)",
    create: () => new ParticleNode(negativeParticle, liveModel, liveTransform),
    keepAlive: () => [liveModel, negativeParticle, ...particleNodeDependencies(negativeParticle)],
  },
]);

describe("ParticleNode add/remove cycles", () => {
  /**
   * Mirror ElectricFieldOfDreamsScreenView's particle wiring on a fresh live model: one node per
   * particle, disposed when the particle leaves model.particles.
   */
  function mirrorParticles(model: ElectricFieldOfDreamsModel): Map<Particle, ParticleNode> {
    const nodes = new Map<Particle, ParticleNode>();
    model.particles.elementAddedEmitter.addListener((particle) => {
      nodes.set(particle, new ParticleNode(particle, model, liveTransform));
    });
    model.particles.elementRemovedEmitter.addListener((particle) => {
      nodes.get(particle)?.dispose();
      nodes.delete(particle);
    });
    return nodes;
  }

  it("removed particle nodes are collected while their particles stay reachable", async () => {
    const model = new ElectricFieldOfDreamsModel();
    const nodes = mirrorParticles(model);
    const removedParticles: Particle[] = []; // outlive their nodes, like a drag in progress would
    const cycle = (): WeakRef<object>[] => {
      const refs: WeakRef<object>[] = [];
      for (let i = 0; i < 3; i++) {
        const particle = model.addParticle(i % 2 === 0 ? 1 : -1, 1);
        refs.push(new WeakRef<object>(nodes.get(particle)!));
        particle.setPositionXY(model.center.x, model.center.y);
        model.stepOnce();
        removedParticles.push(particle);
        model.removeParticle();
      }
      return refs;
    };
    const refs = [...cycle(), ...cycle()];
    await forceGC(refs);
    expect(refs.filter((ref) => ref.deref() !== undefined).length, "removed ParticleNodes retained").toBe(0);
    expect(nodes.size).toBe(0);
    expect(removedParticles).toHaveLength(6);
  });

  it("add/remove cycles keep a11y string listener counts flat", async () => {
    const model = new ElectricFieldOfDreamsModel();
    const nodes = mirrorParticles(model);
    await expectNoListenerGrowth(
      [
        a11yControls.positiveChargeStringProperty,
        a11yControls.negativeChargeStringProperty,
        a11yControls.particleHelpStringProperty,
      ],
      () => {
        model.addParticle(1, 1);
        model.addParticle(-1, 1);
        model.removeParticle();
        model.removeParticle();
      },
    );
    expect(nodes.size).toBe(0);
  });

  it("dragging then removing a node leaves the particle's Properties unlinked", async () => {
    await expectNoListenerGrowth(particleNodeDependencies(positiveParticle).slice(0, 2), () => {
      const node = new ParticleNode(positiveParticle, liveModel, liveTransform);
      positiveParticle.isDraggingProperty.value = true;
      positiveParticle.setPositionXY(liveModel.center.x + 1, liveModel.center.y);
      positiveParticle.isDraggingProperty.value = false;
      node.dispose();
    });
  });
});
