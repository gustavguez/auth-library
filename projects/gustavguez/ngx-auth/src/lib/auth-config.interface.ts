export interface AuthConfigInterface {
	grantType?: string,
	grantTypeRefresh?: string,
	clientId?: string,
	clientSecret?: string,
	accessTokenLsKey?: string,
	lastMeAvatarLsKey?: string,
	lastMeUsernameLsKey?: string,
	oauthUri?: string,
	oauthRefreshUri?: string,
	oauthMeUri?: string,
	oauthType?: string,
}
