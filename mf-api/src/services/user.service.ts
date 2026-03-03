import PrismaClient from '../prisma';

class UserService {
    /**
     * An asynchronous function to find a user by their unique identifier.
     * @param {number} id - The unique identifier of the user to be retrieved.
     */
    public findUser = async (id: number) => {
        try {
            const user = await PrismaClient.user.findUnique({ where: { id } });
            if (!user) throw new Error(`User not found for id: ${id}`);
            return user;

        } catch (error) {
            console.error(`Error to login user: ${error}`);
            throw error;
        }
    }
}

export default UserService;