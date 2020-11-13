export class AuthUserModel {

	constructor(
		public id?: number,
		public username?: string,
		public name?: string,
		public lastName?: string,
		public profileImage?: string,
		public data?: any
	) { }

	public fromJSON(json: any): void {
		if (json) {
			this.id = json.id;
			this.username = json.username;
			this.name = json.name ? json.name : '';
			this.lastName = json.lastName ? json.lastName : '';
			this.profileImage = json.profileImage ? json.profileImage : '';
		}
	}
}
