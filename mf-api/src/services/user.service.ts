import PrismaClient from '../prisma';
import { ApiError } from '../utils/errors/ApiError';
import { StatusCodes } from 'http-status-codes';

class UserService {
    /**
     * An asynchronous function to find a user by their unique identifier.
     * @param {string} id - The unique identifier of the user to be retrieved.
     */
    // region FIND USER
    public findUser = async (id: string) => {
        try {
            const user = await PrismaClient.user.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            posts: true,
                            comments: true,
                            likes: true
                        }
                    }
                }
            });
            if (!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, `User not found for id: ${id}`);
            }
            return user;

        } catch (error) {
            console.error(`Error to find user: ${error}`);
            throw error;
        }
    }
}

export default UserService;