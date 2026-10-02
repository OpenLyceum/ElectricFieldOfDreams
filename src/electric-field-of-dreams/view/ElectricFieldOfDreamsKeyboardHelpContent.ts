/**
 * ElectricFieldOfDreamsKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 * Composed from the standard scenery-phet help sections so every row stays in
 * sync with the real interaction model: a slider section for the adjustable
 * controls and the basic-actions section for tab navigation and buttons.
 */

import {
  BasicActionsKeyboardHelpSection,
  MoveDraggableItemsKeyboardHelpSection,
  SliderControlsKeyboardHelpSection,
  TimeControlsKeyboardHelpSection,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";

export class ElectricFieldOfDreamsKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    // Left: dragging particles and the external-field pad (arrows/WASD, Shift for fine moves)
    // and the slider. Right: play/pause and Tab/button navigation.
    super(
      [new MoveDraggableItemsKeyboardHelpSection(), new SliderControlsKeyboardHelpSection()],
      [new TimeControlsKeyboardHelpSection(), new BasicActionsKeyboardHelpSection()],
    );
  }
}
