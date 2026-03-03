/**
 * Represents a standard interface for a response object.
 *
 * @interface IResponse
 *
 * @property {boolean} success Indicates whether the operation was successful.
 * @property {string} message Contains additional information about the operation or response.
 */
export interface IResponse {
    success: boolean;
    message: string;
}

/**
 * Represents a response object that includes payload data.
 * This interface extends the base IResponse interface and adds a generic property for including data in the response.
 *
 * @template T The type of the payload contained in the response.
 * @extends IResponse
 */
export interface IResponseWithPayload<T> extends IResponse {
    data: T;
}

/**
 * Represents a response structure that extends the base IResponse interface to include a message property.
 * This interface is typically used to convey additional information or context about the response
 * in the form of a textual message.
 *
 * It combines the standard response structure defined in the IResponse interface and augments it with
 * a `message` property, which provides a brief message or feedback related to the operation.
 *
 * @interface IResponseWithMessage
 * @extends {IResponse} The base response interface.
 * @property {string} message A descriptive message providing further details about the response.
 */
export interface IResponseWithMessage extends IResponse {
    message: string;
}

/**
 * Interface representing a response that contains a message and payload data.
 * Extends the `IResponseWithPayload` to include an additional `message` property.
 *
 * @template T - The type of the payload data.
 *
 * @property {string} message - A descriptive message associated with the response.
 * @property {T} data - The payload data returned by the response.
 */
export interface IResponseWithPayloadAndMessage<T> extends IResponseWithPayload<T> {
    message: string;
    data: T;
}

/**
 * Interface representing a paginated response with a payload and pagination details.
 *
 * @template T The type of the payload in the response.
 *
 * @extends IResponseWithPayload<T>
 *
 * @property {number} total The total number of items available.
 * @property {number} page The current page number in the paginated response.
 * @property {number} limit The maximum number of items per page.
 */
export interface IResponseWithPagination<T> extends IResponseWithPayload<T> {
    total: number;
    page: number;
    limit: number;
}