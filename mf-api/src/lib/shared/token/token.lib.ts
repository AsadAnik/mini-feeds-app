import * as jwt from 'jsonwebtoken';

class TokenLib {
    private readonly jwtSecret: string = process.env.JWT_SECRET ?? 'SECRET';

    /**
     * Generates a JSON Web Token (JWT) using the provided payload and expiration time.
     * @param {any} payload - The data to be encoded within the token. Typically contains user-specific or session-specific information.
     * @param {string} [time='15m'] - Optional. The expiration time for the token. Defaults to '15m' (15 minutes). Can be specified in string formats like '1h', '2d', etc.
     * @returns {string} The generated JWT as a string.
     */
    public generateToken = (payload: any, time: string = '15m') => {
        // @ts-ignore
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: time
        });
    }

    /**
     * Verifies and decodes a given JSON Web Token (JWT) using the secret key.
     * @param {string} token - The JWT string to be verified and decoded.
     * @returns {Object|string} - The decoded payload of the JWT if verification is successful.
     * @throws {Error} - Throws an error if the token is invalid or verification fails.
     */
    public verifyToken = (token: string) => {
        return jwt.verify(token, this.jwtSecret);
    }
}

export default TokenLib;