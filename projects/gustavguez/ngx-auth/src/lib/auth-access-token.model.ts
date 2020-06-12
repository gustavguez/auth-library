export class AuthAccessTokenModel {

	constructor(
		public token: string,
		public refreshToken: string,
		public expiration: Date) {
	}
}
