export class AuthConfigModel {

	constructor(
		public grantType?: string,
		public grantTypeRefresh?: string,
		public clientId?: string,
		public clientSecret?: string,
		public accessTokenLsKey?: string,
		public lastMeAvatarLsKey?: string,
		public lastMeUsernameLsKey?: string,
		public oauthUri?: string,
		public oauthRefreshUri?: string,
		public oauthMeUri?: string,
		public oauthType?: string,
	) { }
}
