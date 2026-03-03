import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';


class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService = new AuthService()) {
        this.authService = authService;
    }

    /**
     * ---- Register Controller ----
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} _next 
     */
    public register = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const createUser = await this.authService.register({ email, password });
            if (!createUser) throw new Error(`Can not create User`);

            res.status(200).json({
                success: true,
                message: 'Register',
                createdUser: createUser
            });

        } catch (error) {
            res.json({ success: false, error });
        }
    }

    /**
     * ---- Login Controller ----
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next
     */
    public login = async (req: Request, res: Response | any, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const loggedInUser = await this.authService.loginUser({ email, password });

            res.status(200).json({
                message: 'LoggedIn Successfully',
                success: true,
                data: loggedInUser,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- User Logout ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public logout = async (req: Request | any, res: Response | any, next: NextFunction) => {
        try {
            res.status(200).json({
                message: 'Logout'
            });

        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;