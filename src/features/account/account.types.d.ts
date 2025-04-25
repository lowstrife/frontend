declare namespace Account {
	interface ILoginPayload {
		username: string;
		password: string;
	}

	interface ILoginResponse {
		access_token: string;
		refresh_token: string;
	}
}
