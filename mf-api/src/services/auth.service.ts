import PrismaClient from '../prisma';
import { IRegisterUser, ILoginUser } from '../types/user.types';
import { BcryptLib } from '../lib/shared';
import { TokenLib } from '../lib/shared';
import { ApiError } from '../utils/errors/ApiError';
import { StatusCodes } from 'http-status-codes';

class AuthService {
    private readonly bcryptLib: BcryptLib;
    private readonly tokenLib: TokenLib;

    constructor() {
        this.bcryptLib = new BcryptLib();
        this.tokenLib = new TokenLib();
    }

    /**
     * USER LOGIN SERVICE
     * @param userInfo @Object - { emaiL: string, password: string }
     * @return Promise<{ any }>
     */
    // region Login Service
    public async loginUser(userInfo: ILoginUser): Promise<any> {
        try {
            const user = await PrismaClient.user.findUnique({ where: { email: userInfo.email } });
            if (!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, `User not found for email: ${userInfo.email}`);
            }

            // Compare Password
            const comparedPassword = await this.bcryptLib.comparePassword(userInfo.password, user.password);
            if (!comparedPassword) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, `Invalid password for account: ${userInfo.email}`);
            }

            // Generate Access Token
            const accessToken: string = this.tokenLib.generateToken({ id: user.id, email: user.email }, '1d');

            return {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                username: user.username,
                avatarConfig: user.avatarConfig,
                accessToken,
            };

        } catch (error) {
            console.error(`Error to login user: ${error}`);
            throw error;
        }
    }


    /**
     * USER REGISTRATION SERVICE
     * @param userInfo
     */
    // region Registration Service
    public async register(userInfo: IRegisterUser): Promise<any> {
        try {
            // Check if user already exists
            const existingUser = await PrismaClient.user.findFirst({
                where: {
                    OR: [
                        { email: userInfo.email },
                        { username: userInfo.username }
                    ]
                }
            });

            if (existingUser) {
                if (existingUser.email === userInfo.email) {
                    throw new ApiError(StatusCodes.CONFLICT, `User with email: ${userInfo.email} already exists`);
                }
                if (existingUser.username === userInfo.username) {
                    throw new ApiError(StatusCodes.CONFLICT, `User with username: ${userInfo.username} already exists`);
                }
            }

            // Hash Password
            userInfo.password = await this.bcryptLib.hashPassword(userInfo.password);

            // Create User DB
            const createUser = await PrismaClient.user.create({
                data: userInfo,
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    username: true,
                    createdAt: true
                }
            });
            if (!createUser) throw new Error(`Error while creating user`);

            return createUser;

        } catch (error) {
            console.error(`Error occurred while register user: ${error}`);
            throw error;
        }
    }


    /**
     * USER LOGOUT
     * Own logout feature service
     */
    // region User Logout
    public async logoutUser(refreshToken: string): Promise<any> {
        try {
            return { success: true, message: 'Logout User' }

        } catch (error) {
            console.error(`Error occured while do logout: ${error}`);
            throw error;
        }
    }
}

export default AuthService;