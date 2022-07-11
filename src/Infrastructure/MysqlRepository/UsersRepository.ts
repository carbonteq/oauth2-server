import Users from "../Database/Models/Users";
import {dataSource} from "../Database/mysqlConnections";

class UsersRepository {
    static async findAccount(ctx, id: string) {
        const usersRepository = dataSource.getRepository(Users);
        // This would ideally be just a check whether the account is still in your storage
        const account = await usersRepository.findOne({where: {userId: id}});
        if (!account) {
            return undefined;
        }

        return {
            accountId: id,
            // and this claims() method would actually query to retrieve the account claims
            async claims() {
                return {
                    sub: id,
                    email: account.email,
                    email_verified: account.emailVerified
                };
            }
        };
    }

    // This can be anything you need to authenticate a user
    static async authenticate(email: string, password) {
        try {
            const usersRepository = dataSource.getRepository(Users);

            const lowercased = String(email).toLowerCase();
            const account = await usersRepository.findOne({where: {email: lowercased}});

            return account.userId;
        } catch (err) {
            return undefined;
        }
    }
}

export default UsersRepository;