import bcrypt from "bcryptjs";
import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { UserType } from "../../../domain/enums/UserType";

export class CreateUser {
    constructor(private repo: UserRepository) { }

    async execute(data: { name: string; email: string; password: string; userType: UserType }) {
        const hash = await bcrypt.hash(data.password, 10);
        const user = new User(data.name, data.email, hash, data.userType);
        return this.repo.create(user);
    }
}
