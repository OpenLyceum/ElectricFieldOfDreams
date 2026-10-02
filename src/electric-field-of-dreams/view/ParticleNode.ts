/**
 * ParticleNode.ts
 *
 * A draggable charged particle: a filled, outlined circle with a +/- glyph showing the
 * sign of its charge. Dragging detaches it from the physics (via isDraggingProperty)
 * and repositions it, clamped to the play-area bounds. Ported from `views/particle.js`.
 */

import { Dimension2, Vector2 } from "scenerystack/dot";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Circle, Node, RichDragListener } from "scenerystack/scenery";
import { MinusNode, PlusNode } from "scenerystack/scenery-phet";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import Constants from "../../ElectricFieldOfDreamsConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";
import type { Particle } from "../model/Particle.js";

/** Plus/minus glyph size as fractions of the particle radius. */
const SYMBOL_LENGTH_FACTOR = 1.2;
const SYMBOL_THICKNESS_FACTOR = 0.28;

// Outline width (view pixels) of the particle circle.
const STROKE_WIDTH = 3;

export class ParticleNode extends Node {
  public readonly particle: Particle;

  public constructor(particle: Particle, model: ElectricFieldOfDreamsModel, modelViewTransform: ModelViewTransform2) {
    const a11y = StringManager.getInstance().getA11yStrings();
    super({
      cursor: "pointer",
      tagName: "div",
      focusable: true,
      accessibleName:
        particle.charge >= 0 ? a11y.controls.positiveChargeStringProperty : a11y.controls.negativeChargeStringProperty,
      accessibleHelpText: a11y.controls.particleHelpStringProperty,
    });
    this.particle = particle;

    const radius = modelViewTransform.modelToViewDeltaX(Constants.PARTICLE_RADIUS);

    const circle = new Circle(radius, {
      fill: ElectricFieldOfDreamsColors.particleFillProperty,
      stroke: ElectricFieldOfDreamsColors.particleStrokeProperty,
      lineWidth: STROKE_WIDTH,
    });

    // The same plus/minus glyphs as the control panel's charge buttons, sized to the particle.
    const glyphSize = new Dimension2(radius * SYMBOL_LENGTH_FACTOR, radius * SYMBOL_THICKNESS_FACTOR);
    const symbolOptions = {
      size: glyphSize,
      fill: ElectricFieldOfDreamsColors.particleSymbolProperty,
      center: Vector2.ZERO,
    };
    const symbol = particle.charge >= 0 ? new PlusNode(symbolOptions) : new MinusNode(symbolOptions);

    this.children = [circle, symbol];

    // Particle nodes are created and destroyed as charges are added/removed. Node.dispose()
    // only *removes* children — it does not unlink manually-added Property links, remove
    // input listeners, or dispose children — so each of those is torn down explicitly below
    // (see the disposeEmitter handler) to avoid leaking a node per add/remove.
    const updateTranslation = (position: Vector2): void => {
      this.translation = modelViewTransform.modelToViewPosition(position);
    };
    particle.positionProperty.link(updateTranslation);

    const startDrag = (): void => {
      particle.isDraggingProperty.value = true;
    };
    const endDrag = (): void => {
      particle.isDraggingProperty.value = false;
    };

    // Idiomatic positionProperty + transform; mapPosition clamps to the play area
    // (closestPointTo) the same way the previous hand-rolled drag did.
    const dragListener = new RichDragListener({
      positionProperty: particle.positionProperty,
      transform: modelViewTransform,
      mapPosition: (point) => model.bounds.closestPointTo(point),
      start: startDrag,
      end: endDrag,
      dragListenerOptions: {},
      keyboardDragListenerOptions: {
        dragSpeed: 80,
        shiftDragSpeed: 30,
      },
    });
    this.addInputListener(dragListener);

    this.disposeEmitter.addListener(() => {
      particle.positionProperty.unlink(updateTranslation);
      // Remove before disposing so hotkeyManager drops its reference to this node (the
      // RichDragListener's keyboard hotkeys otherwise keep the disposed node reachable).
      this.removeInputListener(dragListener);
      dragListener.dispose();
      circle.dispose();
      symbol.dispose();
    });
  }
}
