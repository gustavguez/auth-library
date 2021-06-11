import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService, AuthUserModel }  from '../../projects/gustavguez/ngx-auth/src/public-api';
import { ApiService } from '@gustavguez/ngx-api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	// Models
	authUser: AuthUserModel;
	imageUrl: string;

	// Inject services
	constructor(
		private apiService: ApiService,
		private authService: AuthService
	) { }

	// On component init
	ngOnInit() {
		// Load image url
		this.imageUrl = environment.api.URL_IMAGES;

		// Load url to all api service calls
		this.apiService.setApiURL(environment.api.URL);

		// Load auth config
		this.authService.setConfig({
			grantType: environment.oauth.GRANT_TYPE,
			grantTypeRefresh: environment.oauth.GRANT_TYPE_REFRESH,
			clientId: environment.oauth.CLIENT_ID,
			clientSecret: environment.oauth.CLIENT_SECRET,
			accessTokenLsKey: environment.ls.ACCESS_TOKEN,
			lastMeAvatarLsKey: environment.ls.LAST_AVATAR,
			lastMeUsernameLsKey: environment.ls.LAST_USER,
			oauthUri: environment.api.OAUTH_URI,
			oauthRefreshUri: environment.api.OAUTH_URI,
			oauthMeUri: environment.api.ME_URI
		});

		// Watch state
		this.authService.getOnSessionStateChange().subscribe(() => {
			// Load me
			this.authUser = this.authService.getUser();
		});

		// Load previous session
		this.authService.loadSession().subscribe((result: boolean) => {
			console.log(result);
		});
	}

	// Custom events
	onLoginSuccess(): void {
		console.log('SUCCESS');
	}

	onLoginError(error: HttpErrorResponse): void {
		console.log(error);
	}

	onLogout() {
		this.authService.logout();
	}
}
