import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService, ApiResponseModel } from '@gustavguez/ngx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthConfigModel } from './auth-config.model';
import { AuthUserModel } from './auth-user.model';
import { AuthLastUserModel } from './auth-last-user.model';
import { AuthAccessTokenModel } from './auth-access-token.model';

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	// Models
	private user: AuthUserModel;
	private meJsonResponse: any;
	private config: AuthConfigModel;
	private lastUser: AuthLastUserModel;
	private accessToken: AuthAccessTokenModel;

	// User session events emitters
	private onSessionStateChange: EventEmitter<boolean>;
	private onUserParsed: EventEmitter<any>;
	private onUserChanged: EventEmitter<AuthUserModel>;

	// Service constructure
	constructor(
		private storageService: LocalStorageService,
		private apiService: ApiService) {
		// Create event emitters
		this.onSessionStateChange = new EventEmitter<boolean>();
		this.onUserChanged = new EventEmitter<AuthUserModel>();
		this.onUserParsed = new EventEmitter<any>();

		// Default values
		this.config = new AuthConfigModel();
	}

	// Methods
	public setConfig(config: AuthConfigModel): void {
		this.config = config;
	}

	public getLastUser(): AuthLastUserModel {
		return this.lastUser;
	}

	public getAccessToken(): AuthAccessTokenModel {
		return this.accessToken;
	}

	public getUser(): AuthUserModel {
		return this.user;
	}

	public getMeJsonResponse(): any {
		return this.meJsonResponse;
	}

	public isLogged(): boolean {
		return !!this.user;
	}

	public getOnSessionStateChange(): Observable<boolean> {
		return this.onSessionStateChange;
	}

	public getOnUserChanged(): Observable<AuthUserModel> {
		return this.onUserChanged;
	}

	public getOnUserParsed(): Observable<any> {
		return this.onUserParsed;
	}

	// Generate a access token
	public login(loginUsername: string, loginPassword: string): Observable<boolean> {
		// Create an observable
		const obs = new Observable<boolean>((observer: any) => {
			// Set root strategy
			this.apiService.changeApiResponseStrategy('root');

			// Request token
			this.apiService.createObj(this.config.oauthUri, {
				username: loginUsername,
				password: loginPassword,
				grant_type: this.config.grantType,
				client_id: this.config.clientId,
				client_secret: this.config.clientSecret
			}).pipe(
				map((response: ApiResponseModel) => {
					// Save token to Local storage
					if (response.data) {
						this.storageService.set(this.config.accessTokenLsKey, response.data);
					}

					// Creates the access token model
					return this.parseAccessToken(response.data);
				})
			).subscribe((response: AuthAccessTokenModel) => {
				// Load accesstoken
				this.accessToken = response;

				// Load to apiService to
				this.apiService.setAccessToken(this.accessToken.token);

				// Check meUrl
				if (this.config.oauthMeUri) {
					// Request me info
					this.requestMe().subscribe(
						() => {
							// Notify user state
							this.checkAndNotifyMeState();

							// Restore
							this.apiService.restoreApiResponseStrategy();

							// Load response
							observer.next(true);
							observer.complete();
						},
						() => {
							// Rise error
							observer.error(response);
						}
					);
				} else {
					// Restore
					this.apiService.restoreApiResponseStrategy();

					// Complete subscribe
					observer.next(true);
					observer.complete();
				}
			}, (response: HttpErrorResponse) => {
				// Rise error
				observer.error(response);
			});
		});
		return obs;
	}

	// Generate a access token
	public requestMe(): Observable<AuthUserModel> {
		// Set root strategy
		this.apiService.changeApiResponseStrategy('data');

		// Do request
		return this.apiService.fetchData(this.config.oauthMeUri).pipe(
			map((response: ApiResponseModel) => {
				// Load userLogged
				this.user = new AuthUserModel();
				this.user.fromJSON(response.data.me);

				// Load me response
				this.meJsonResponse = response.data;

				// Emit parsed and changed
				this.onUserParsed.emit(response.data);
				this.onUserChanged.emit(this.user);

				// Load user logged
				this.lastUser = new AuthLastUserModel();
				this.lastUser.avatar = this.user.profileImage;
				this.lastUser.username = this.user.username;

				// Save to LS
				this.storageService.set(this.config.lastMeAvatarLsKey, this.user.profileImage);
				this.storageService.set(this.config.lastMeUsernameLsKey, this.user.username);

				// Restore
				this.apiService.restoreApiResponseStrategy();
				return this.user;
			})
		);
	}

	public refreshToken(): Observable<AuthAccessTokenModel> {
		// Get refresh token
		const refreshToken: string = this.accessToken instanceof AuthAccessTokenModel ? this.accessToken.refreshToken : '';

		// Set root strategy
		this.apiService.changeApiResponseStrategy('root');

		// Request token
		return this.apiService.createObj(this.config.oauthUri, {
			refresh_token: refreshToken,
			grant_type: this.config.grantTypeRefresh,
			client_id: this.config.clientId
		}).pipe(
			map((response: ApiResponseModel) => {
				// Check response
				if (response.data) {
					// Load the refresh token
					response.data.refresh_token = refreshToken;

					// Save to LS
					this.storageService.set(this.config.accessTokenLsKey, response.data);
				}

				// Creates the access token model
				this.accessToken = this.parseAccessToken(response.data);

				// Load to apiService to
				this.apiService.setAccessToken(this.accessToken.token);

				// Restore
				this.apiService.restoreApiResponseStrategy();
				return this.accessToken;
			})
		);
	}

	public loadSession(): Observable<boolean> {
		// Create an observable
		const obs = new Observable<boolean>((observer: any) => {
			const accessTokenLs: any = this.storageService.get(this.config.accessTokenLsKey);
			const lastMeAvatar: string = this.storageService.get(this.config.lastMeAvatarLsKey);
			const lastMeUsername: string = this.storageService.get(this.config.lastMeUsernameLsKey);
			const completeObservable: Function = (result: boolean) => {
				observer.next(result);
				observer.complete();
			};

			// Load last user
			if (lastMeUsername || lastMeUsername) {
				this.lastUser = new AuthLastUserModel(
					lastMeUsername,
					lastMeAvatar
				);
			} else {
				this.lastUser = null;
			}

			// Check access token getted from ls
			if (accessTokenLs) {
				// Creat access token
				this.accessToken = this.parseAccessToken(accessTokenLs);

				// Check token
				if (this.accessToken instanceof AuthAccessTokenModel) {
					// Has configured me
					if (this.config.oauthMeUri) {
						// Load to apiService to
						this.apiService.setAccessToken(this.accessToken.token);

						// Request me info
						this.requestMe().subscribe(
							() => {
								// Notify user state
								this.checkAndNotifyMeState();

								// Finish load
								completeObservable(true);
							},
							() => {
								// Finish load
								completeObservable(false);
							}
						);
					} else {
						// Load success without me
						completeObservable(true);
					}
				} else {
					// Finish load
					completeObservable(false);
				}
			} else {
				// Finish load
				completeObservable(false);
			}
		});
		return obs;
	}

	public logout(): void {
		// Clear Local storage
		this.storageService.remove(this.config.accessTokenLsKey);

		// Clear data in memory
		this.user = null;
		this.accessToken = null;

		// Emit state change
		this.checkAndNotifyMeState();
	}

	public checkAndNotifyMeState(): void {
		if (this.user instanceof AuthUserModel && this.accessToken instanceof AuthAccessTokenModel) {
			// Emit login event
			this.onSessionStateChange.emit(true);
		} else {
			// Emit login event
			this.onSessionStateChange.emit(false);
		}
	}

	public updateUser(user: AuthUserModel): void {
		this.user = user;

		// Emit change
		this.onUserChanged.emit(user);
	}

	// Private methods
	private parseAccessToken(json: any): AuthAccessTokenModel {
		let accessToken: AuthAccessTokenModel = null;

		// Check access token
		if (json && json.access_token) {
			// parse expiration date
			const expiration: Date = new Date();
			const expiresIn: number = json.expires_in / 60;
			expiration.setMinutes(expiration.getMinutes() + expiresIn);

			// Creates the access token model
			accessToken = new AuthAccessTokenModel(
				json.access_token,
				json.refresh_token,
				expiration
			);
		}
		return accessToken;
	}
}
