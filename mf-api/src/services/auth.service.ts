import PrismaClient from '../prisma';
import { IRegisterUser, ILoginUser } from '../types/user.types';
import { BcryptLib } from '../lib/shared';
import { TokenLib } from '../lib/shared';

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
            if (!user) throw new Error(`User not found for email: ${userInfo.email}`);

            // Compare Password
            const comparedPassword = await this.bcryptLib.comparePassword(userInfo.password, user.password);
            if (!comparedPassword) throw new Error(`Invalid password for email: ${userInfo.email}`);

            // Generate Access Token
            const accessToken: string = this.tokenLib.generateToken({ id: user.id, email: user.email }, '1d');

            return {
                id: user.id,
                email: user.email,
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
            // Hash Password
            userInfo.password = await this.bcryptLib.hashPassword(userInfo.password);

            // Create User DB
            const createUser = await PrismaClient.user.create({ data: userInfo });
            if (!createUser) throw new Error(`Error while creating user : ${createUser}`);

            return { email: userInfo.email };

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
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