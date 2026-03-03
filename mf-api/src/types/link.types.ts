/**
 * Interface representing a shortened link structure.
 *
 * This interface defines the properties required to represent and manage
 * the original long URL for a shortened link.
 *
 * @interface IShortenLink
 */
export interface IShortenLink {
    originalLink: string;
}

/**
 * Interface representing the structure of a redirection object containing
 * information necessary to direct a user from a shortened link to its original link.
 *
 * This interface is commonly used in URL shortening services to retrieve and
 * handle original links associated with provided short links.
 */
export interface IRedirectToOriginalLink {
    shortCode: string;
}