import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/errors/ApiError';
import FriendService from '../services/friend.service';

class FriendController {
    private friendService: FriendService;

    constructor() {
        this.friendService = new FriendService();
    }

    public explorePeople = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const query = req.query.q as string | undefined;

            const people = await this.friendService.explorePeople(userId, query);

            res.status(StatusCodes.OK).json({
                message: "Explore people fetched successfully",
                data: people
            });
        } catch (error) {
            next(error);
        }
    }

    public getFriends = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const query = req.query.q as string | undefined;

            const friends = await this.friendService.getFriends(userId, query);

            res.status(StatusCodes.OK).json({
                message: "Friends fetched successfully",
                data: friends
            });
        } catch (error) {
            next(error);
        }
    }

    public sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const senderId = (req as any).user.id;
            const { receiverId } = req.body;

            if (!receiverId) throw new ApiError(StatusCodes.BAD_REQUEST, "receiverId is required");

            const request = await this.friendService.sendFriendRequest(senderId, receiverId);

            res.status(StatusCodes.CREATED).json({
                message: "Friend request sent successfully",
                data: request
            });
        } catch (error) {
            next(error);
        }
    }

    public getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;

            const requests = await this.friendService.getPendingRequests(userId);

            res.status(StatusCodes.OK).json({
                message: "Pending requests fetched successfully",
                data: requests
            });
        } catch (error) {
            next(error);
        }
    }

    public acceptFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const requestId = req.params.requestId as string;

            if (!requestId) throw new ApiError(StatusCodes.BAD_REQUEST, "requestId is required");

            const result = await this.friendService.acceptFriendRequest(userId, requestId);

            res.status(StatusCodes.OK).json({
                message: "Friend request accepted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    public rejectFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const requestId = req.params.requestId as string;

            if (!requestId) throw new ApiError(StatusCodes.BAD_REQUEST, "requestId is required");

            const result = await this.friendService.rejectFriendRequest(userId, requestId);

            res.status(StatusCodes.OK).json({
                message: "Friend request rejected successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    public unfriend = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const friendId = req.params.friendId as string;

            if (!friendId) throw new ApiError(StatusCodes.BAD_REQUEST, "friendId is required");

            const result = await this.friendService.removeFriend(userId, friendId);

            res.status(StatusCodes.OK).json({
                message: "Unfriended successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

export default FriendController;
