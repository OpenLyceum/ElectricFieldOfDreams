import { Color, ProfileColorProperty } from "scenerystack/scenery";
import ElectricFieldOfDreamsNamespace from "./ElectricFieldOfDreamsNamespace.js";

const { BLACK, WHITE } = Color;

// ── Panel fills ───────────────────────────────────────────────────────────────
// Near-black / near-white neutral fills so panels contrast with both themes.
const PANEL_FILL_DARK = new Color(40, 40, 40);
const PANEL_FILL_LIGHT = new Color(240, 240, 240);

// Semi-transparent borders (40 % opacity) that stay visible on either fill.
const PANEL_STROKE_DARK = "rgba(255, 255, 255, 0.4)";
const PANEL_STROKE_LIGHT = "rgba(0, 0, 0, 0.4)";

// White overlay used for the external-field drag pad, at different opacities so
// it reads clearly on both themes.
const PAD_FILL_DARK = "rgba(255, 255, 255, 0.12)";
const PAD_FILL_LIGHT = "rgba(255, 255, 255, 0.65)";

const ElectricFieldOfDreamsColors = {
  backgroundColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "background", {
    default: BLACK,
    projector: WHITE,
  }),
  foregroundColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "foreground", {
    default: WHITE,
    projector: BLACK,
  }),

  panelFillProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "panelFill", {
    default: PANEL_FILL_DARK,
    projector: PANEL_FILL_LIGHT,
  }),
  panelStrokeProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "panelStroke", {
    default: PANEL_STROKE_DARK,
    projector: PANEL_STROKE_LIGHT,
  }),
  padFillProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "padFill", {
    default: PAD_FILL_DARK,
    projector: PAD_FILL_LIGHT,
  }),

  // The bounding box around the play area.
  boundsStrokeProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "boundsStroke", {
    default: "rgba(255, 255, 255, 0.35)",
    projector: "rgba(0, 0, 0, 0.25)",
  }),

  // Particles — mid steel-blue body with a dark navy outline; projector uses deeper
  // tones so the body stays distinct on white.
  particleFillProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "particleFill", {
    default: "#7986A6",
    projector: "#5a6a8a",
  }),
  particleStrokeProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "particleStroke", {
    default: "#21366B",
    projector: "#152447",
  }),
  particleSymbolProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "particleSymbol", {
    default: WHITE,
    projector: BLACK,
  }),

  // Electric-field sample arrows (the lattice grid). Lighter on the dark theme so the
  // navy stays visible; the original navy is used in projector mode.
  fieldArrowProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "fieldArrow", {
    default: "#6FA8DC",
    projector: "#21366B",
  }),

  // The user-draggable external-field arrow — a warm accent so it is clearly distinct
  // from the field-sample arrows.
  externalFieldArrowProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "externalFieldArrow", {
    default: "#F4B860",
    projector: "#B06A00",
  }),

  // Particle-control panel buttons: green for positive/add, red for negative/remove,
  // blue for the mass (light/heavy) selectors — deeper projector fills for white chrome.
  positiveButtonColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "positiveButton", {
    default: "#A5D6A7",
    projector: "#66BB6A",
  }),
  negativeButtonColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "negativeButton", {
    default: "#EF9A9A",
    projector: "#E57373",
  }),
  massButtonColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "massButton", {
    default: "#B3E0FF",
    projector: "#64B5F6",
  }),

  // Fleet-standard aliases for shared Panel + ButtonOptions modules.
  panelBackgroundColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "panelBackground", {
    default: PANEL_FILL_DARK,
    projector: PANEL_FILL_LIGHT,
  }),
  panelBorderColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "panelBorder", {
    default: PANEL_STROKE_DARK,
    projector: PANEL_STROKE_LIGHT,
  }),
  textColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "text", {
    default: WHITE,
    projector: BLACK,
  }),

  // ── Light control surfaces ───────────────────────────────────────────────────
  // White chrome (combo boxes, flat push buttons, editable input fields) stays light
  // in both profiles; its text stays dark.

  /** Fill of light control surfaces: combo-box button/list, editable input fields. */
  controlSurfaceColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "controlSurface", {
    default: "#ffffff",
    projector: "#ffffff",
  }),

  /** Fill of a disabled control surface (grayed-out editable input field). */
  controlSurfaceDisabledColorProperty: new ProfileColorProperty(
    ElectricFieldOfDreamsNamespace,
    "controlSurfaceDisabled",
    { default: "#cccccc", projector: "#cccccc" },
  ),

  /** Text on light control surfaces: combo items, flat-button labels, field values, preferences. */
  controlSurfaceTextColorProperty: new ProfileColorProperty(ElectricFieldOfDreamsNamespace, "controlSurfaceText", {
    default: "#1a1a1a",
    projector: "#1a1a1a",
  }),
};

export default ElectricFieldOfDreamsColors;
