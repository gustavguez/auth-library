// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	api: {
		URL: 'http://api.gustavorodriguez.com.uy',
		URL_IMAGES: 'http://api.gustavorodriguez.com.uy/uploads/images/',
		OAUTH_URI: '/oauth',
		ME_URI: '/finances/me'
	},
	oauth: {
		CLIENT_ID: '',
		CLIENT_SECRET: '',
		GRANT_TYPE: 'password',
		GRANT_TYPE_REFRESH: 'refresh_tocken'
	},
	ls: {
		ACCESS_TOKEN: 'access_token',
		LAST_AVATAR: 'last_avatar',
		LAST_USER: 'last_user'
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
