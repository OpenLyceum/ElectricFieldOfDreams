/**
 * electricFieldOfDreamsQueryParameters.ts
 *
 * Sim-specific startup query parameters. This is the single place where every
 * sim-specific query parameter is declared and documented. Public-facing
 * parameters (intended for end users / sharing links) must set `public: true`.
 *
 * ── How to add a query parameter ──────────────────────────────────────────────
 * 1. Add an entry below with a `type`, `defaultValue`, and (if user-facing)
 *    `public: true`. Add `isValidValue` to bound numeric ranges.
 * 2. If it should also be user-editable at runtime, surface it as a preference
 *    in ElectricFieldOfDreamsPreferencesModel (initialize that Property from this query parameter).
 *
 * Usage: append e.g. `?fieldLatticeWidth=10` to the sim URL.
 */

import { logGlobal } from "scenerystack/phet-core";
import { QueryStringMachine } from "scenerystack/query-string-machine";
import Constants from "../ElectricFieldOfDreamsConstants.js";
import ElectricFieldOfDreamsNamespace from "../ElectricFieldOfDreamsNamespace.js";

const electricFieldOfDreamsQueryParameters = QueryStringMachine.getAll({
  /** Width of the field-sampling lattice (grid discreteness). */
  fieldLatticeWidth: {
    type: "number" as const,
    defaultValue: Constants.DISCRETENESS_DEFAULT,
    isValidValue: (value: number) =>
      Number.isInteger(value) && value >= Constants.DISCRETENESS_RANGE.min && value <= Constants.DISCRETENESS_RANGE.max,
    public: true,
  },
});

ElectricFieldOfDreamsNamespace.register("electricFieldOfDreamsQueryParameters", electricFieldOfDreamsQueryParameters);

// Log query parameters (for the console / PhET-iO).
logGlobal("phet.chipper.queryParameters");

export default electricFieldOfDreamsQueryParameters;
