/**
 * Fleet-standard memory-leak regression suite.
 * Creates an ElectricFieldOfDreamsModel, steps it, resets, drops the reference.
 */

import { Vector2 } from "scenerystack/dot";
import { describe, expect, it } from "vitest";
import { TimeModel } from "../src/common/TimeModel.js";
import { ElectricFieldOfDreamsModel } from "../src/electric-field-of-dreams/model/ElectricFieldOfDreamsModel.js";
import { describeDisposalLeaks, forceGC } from "./helpers/memoryLeak.js";

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

describeDisposalLeaks([{ name: "TimeModel", create: () => new TimeModel(), idempotentDispose: true }]);
