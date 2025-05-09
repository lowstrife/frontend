/**
 * Custom Plan Loading Error
 * @author jplacht
 *
 * @export
 * @class PlanLoadError
 * @typedef {PlanLoadError}
 * @extends {Error}
 */
export class PlanLoadError extends Error {
	constructor(
		public code:
			| "UNIMPLEMENTED"
			| "MISSING_PLANET_ID"
			| "PLANET_FAILURE"
			| "EMPIRE_FAILURE"
			| "API_FAILURE"
			| "UNKNOWN",
		message: string
	) {
		super(message);
		this.name = "PlanLoadError";
	}
}
