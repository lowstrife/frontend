declare namespace Account {
	interface ILoginPayload {
		username: string;
		password: string;
	}

	interface IRefreshPayload {
		refresh_token: string;
	}

	interface ITokenResponse {
		access_token: string;
		refresh_token: string;
	}
}
