import { UserType } from "../enums/UserType";

export class User {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly passwordHash: string,
        public readonly userType: UserType,
        public readonly registrationDate: Date = new Date()
    ) { }
}
