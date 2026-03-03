/**
 * Interface representing the structure of a user registration object.
 * This interface is used to define the required properties for registering a new user.
 *
 * Properties:
 * - email: The email address of the user, used as a unique identifier.
 * - password: The password associated with the user, used for authentication.
 * - role: The role assigned to the user, which determines access and permissions.
 */
export interface IRegisterUser {
    email: string;
    password: string;
}

/**
 * Represents the data required to log in a user.
 * This interface defines the structure for user credentials.
 */
export interface ILoginUser {
    email: string;
    password: string;
}