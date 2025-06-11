export interface IUserLoginPayload {
	username: string;
	password: string;
}

export interface IUserRefreshPayload {
	refresh_token: string;
}

export interface IUserTokenResponse {
	access_token: string;
	refresh_token: string;
}

export interface IUserProfile {
	user_id: number;
	username: string;
	email: string | null;
	email_verified: boolean;
	fio_apikey: string | null;
	prun_username: string | null;
	last_login?: Date;
	last_action?: Date;
}
