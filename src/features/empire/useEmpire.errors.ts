/**
 * Custom Empire Loading Error
 * @author jplacht
 *
 * @export
 * @class PlanLoadError
 * @typedef {EmpireLoadError}
 * @extends {Error}
 */
export class EmpireLoadError extends Error {
	constructor(
		public code: "NO_EMPIRES" | "INVALID_UUID" | "API_FAILURE" | "UNKNOWN",
		message: string
	) {
		super(message);
		this.name = "EmpireLoadError";
	}
}
