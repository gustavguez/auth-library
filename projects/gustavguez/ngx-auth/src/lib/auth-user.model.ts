export class AuthUserModel {

	constructor(
		public id?: number,
		public username?: string,
		public firstName?: string,
		public lastName?: string,
		public profileImage?: string,
		public data?: any
	) { }

	public fromJSON(json: any): void {
		if (json) {
			this.id = json.id;
			this.username = json.username;
			this.firstName = json.firstName;
			this.lastName = json.lastName;
			this.profileImage = json.profileImage;
		}
	}
}
