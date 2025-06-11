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
