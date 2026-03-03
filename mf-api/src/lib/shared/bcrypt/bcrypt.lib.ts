import bcrypt from 'bcrypt';

class BcryptLib {
    private readonly saltRounds: number = Number(process.env.SALT_ROUNDS) ?? 10;

    /**
     * Asynchronously hashes a given password string using bcrypt algorithm.
     * @param {string} password - The plaintext password string to be hashed.
     * @returns {Promise<string>} A promise that resolves to the hashed password string.
     */
    public hashPassword = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(this.saltRounds);
        return await bcrypt.hash(password, salt);
    }

    /**
     * Compares a plain text password with a hashed password to determine if they match.
     * @param {string} password - The plain text password to be compared.
     * @param {string} hash - The hashed password to compare against.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the passwords match.
     */
    public comparePassword = async (password: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    }
}

export default BcryptLib;