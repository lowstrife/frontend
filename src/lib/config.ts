class Config {
	public readonly APP_VERSION: string;
	public readonly API_BASE_URL: string;

	constructor() {
		this.API_BASE_URL =
			import.meta.env.VITE_API_BASE_URL || "https://api.prunplanner.org";
		this.APP_VERSION = import.meta.env.VITE_APP_VERSION || "undefined";
	}
}

const config = new Config();
export default config;
