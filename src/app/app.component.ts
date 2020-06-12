import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthConfigModel, AuthService, AuthUserModel } from 'projects/gustavguez/ngx-auth/src/lib';
import { ApiService } from '@gustavguez/ngx-core';

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
		this.authService.setConfig(new AuthConfigModel(
			environment.oauth.GRANT_TYPE,
			environment.oauth.GRANT_TYPE_REFRESH,
			environment.oauth.CLIENT_ID,
			environment.oauth.CLIENT_SECRET,
			environment.ls.ACCESS_TOKEN,
			environment.ls.LAST_AVATAR,
			environment.ls.LAST_USER,
			environment.api.OAUTH_URI,
			environment.api.OAUTH_URI,
			environment.api.ME_URI
		));

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
