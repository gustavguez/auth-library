import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AuthAccessTokenModel } from './auth-access-token.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	// Models
	private isRefreshingToken: boolean = false;
	private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

	constructor(
		private authService: AuthService) { }

	// Intercep method
	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Pass on the cloned request instead of the original request.
		return next.handle(req)
			.pipe(
				catchError((error: any) => {
					// Check error type
					if (error instanceof HttpErrorResponse) {
						switch (error.status) {
						case 400:
							return this.handle400Error(error);
						case 401:
							return this.handle401Error(error, req, next);
						case 403:
							return this.handle403Error(error);
						default:
							return throwError(error);
						}
					}
					return new Observable<HttpEvent<any>>();
				})
			) as any;
	}

	// Add authorization header to requests
	private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
		return req.clone({
			setHeaders: {
				Authorization: 'Bearer ' + token
			}
		});
	}

	// Helper function when the refresh token doesnt work
	private logout(error: string): Observable<any> {
		// logout users, redirect to login page
		this.authService.logout();
		return throwError(error);
	}

	// Handle 403 error
	private handle403Error(error: HttpErrorResponse): Observable<any> {
		return this.logout(error.message);
	}

	// Hanfle 401 error
	private handle401Error(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
		// @@TODO: find a way to configure it
		// Ignore 401 status when the url are Oauth
		if (req.url.includes('/oauth')) {
			return throwError(error);
		}

		// Check if is refreshing token
		if (!this.isRefreshingToken) {
			this.isRefreshingToken = true;

			// Reset here so that the following requests wait until the token
			// comes back from the refreshToken call.
			this.tokenSubject.next(null);

			return this.authService.refreshToken()
				.pipe(
					switchMap((newToken: AuthAccessTokenModel) => {
						if (newToken instanceof AuthAccessTokenModel) {
							this.tokenSubject.next(newToken.token);
							return next.handle(this.addToken(req, newToken.token));
						}

						// If we don't get a new token, we are in trouble so logout.
						return this.logout('Cant get a new token.');
					}),
					catchError((errorCatched: any) => this.logout(errorCatched.message)),
					finalize(() => this.isRefreshingToken = false)
				);
		}

		// Take the token and release requests
		return this.tokenSubject
			.pipe(
				filter((token: any) => token !== null),
				take(1),
				switchMap((token: any) => next.handle(this.addToken(req, token)))
			);
	}

	// Handle 400 error
	private handle400Error(error: HttpErrorResponse): Observable<any> {
		if (error instanceof HttpErrorResponse
			&& error.status === 400
			&& 'error' in error
			&& error.error.error === 'invalid_grant') {
			// If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
			return this.logout(error.message);
		}

		// Normal flow
		return throwError(error);
	}
}
