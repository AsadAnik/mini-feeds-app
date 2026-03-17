import PrismaClient from '../prisma';
import { ApiError } from '../utils/errors/ApiError';
import { StatusCodes } from 'http-status-codes';

class FriendService {
    /**
     * Get all users to explore (excluding self, existing friends, and pending requests)
     * @param userId 
     * @param query 
     * @returns 
     */
    // region Explore People
    public explorePeople = async (userId: string, query?: string) => {
        try {
            // Get friends and pending requests to exclude them
            const friendships = await PrismaClient.friendship.findMany({
                where: { userId }
            });
            const friendIds = friendships.map(f => f.friendId);

            const sentRequests = await PrismaClient.friendRequest.findMany({
                where: { senderId: userId, status: 'PENDING' }
            });
            const sentRequestUserIds = sentRequests.map(r => r.receiverId);

            const receivedRequests = await PrismaClient.friendRequest.findMany({
                where: { receiverId: userId, status: 'PENDING' }
            });
            const receivedRequestUserIds = receivedRequests.map(r => r.senderId);

            const excludeIds = [userId, ...friendIds, ...sentRequestUserIds, ...receivedRequestUserIds];

            const whereClause: any = {
                id: { notIn: excludeIds }
            };

            if (query) {
                whereClause.OR = [
                    { fullName: { contains: query, mode: 'insensitive' } },
                    { username: { contains: query, mode: 'insensitive' } }
                ];
            }

            const people = await PrismaClient.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    fullName: true,
                    username: true,
                    email: true,
                    avatarConfig: true,
                },
                take: 50
            });

            // For now, return basic list. Mutual friends calculation could be added here
            return people.map(p => ({ ...p, mutual: 0 })); // Simplified mutual friends
        } catch (error) {
            console.error(`Error in explorePeople: ${error}`);
            throw error;
        }
    };

    /**
     * Get all friends
     * @param userId 
     * @param query 
     * @returns 
     */
    // region Get Friends
    public getFriends = async (userId: string, query?: string) => {
        try {
            const friendships = await PrismaClient.friendship.findMany({
                where: { userId },
                include: {
                    friend: {
                        select: {
                            id: true,
                            fullName: true,
                            username: true,
                            email: true,
                            avatarConfig: true,
                        }
                    }
                }
            });

            let friends = friendships.map(f => f.friend);

            if (query) {
                const lowerQuery = query.toLowerCase();
                friends = friends.filter(f =>
                    f.fullName.toLowerCase().includes(lowerQuery) ||
                    f.username.toLowerCase().includes(lowerQuery)
                );
            }

            return friends.map(f => ({ ...f, mutual: 0 }));
        } catch (error) {
            console.error(`Error in getFriends: ${error}`);
            throw error;
        }
    };

    /**
     * Send a friend request
     * @param senderId 
     * @param receiverId 
     * @returns 
     */
    // region Send Request
    public sendFriendRequest = async (senderId: string, receiverId: string) => {
        try {
            if (senderId === receiverId) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Cannot send friend request to yourself");
            }

            // Check if already friends
            const existingFriendship = await PrismaClient.friendship.findUnique({
                where: {
                    userId_friendId: { userId: senderId, friendId: receiverId }
                }
            });

            if (existingFriendship) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Already friends");
            }

            // Check if request already exists
            let existingRequest = await PrismaClient.friendRequest.findFirst({
                where: {
                    OR: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                }
            });

            if (existingRequest) {
                if (existingRequest.status === 'PENDING') {
                    throw new ApiError(StatusCodes.BAD_REQUEST, "Friend request already pending");
                } else if (existingRequest.status === 'ACCEPTED') {
                    throw new ApiError(StatusCodes.BAD_REQUEST, "Already friends");
                } else {
                    // if rejected, update to pending
                    if (existingRequest.senderId === senderId) {
                        return await PrismaClient.friendRequest.update({
                            where: { id: existingRequest.id },
                            data: { status: 'PENDING' }
                        });
                    } else {
                        // They sent it earlier and it was rejected, so we update the direction
                        await PrismaClient.friendRequest.delete({ where: { id: existingRequest.id } });
                    }
                }
            }

            const request = await PrismaClient.friendRequest.create({
                data: {
                    senderId,
                    receiverId,
                    status: 'PENDING'
                }
            });

            // Send notification
            await PrismaClient.notification.create({
                data: {
                    type: 'friend_request',
                    content: 'sent you a friend request',
                    userId: receiverId,
                    senderId: senderId,
                }
            });

            return request;
        } catch (error) {
            console.error(`Error in sendFriendRequest: ${error}`);
            throw error;
        }
    };

    /**
     * Accept friend request
     * @param receiverId 
     * @param requestId 
     * @returns 
     */
    // region Accept Request
    public acceptFriendRequest = async (receiverId: string, requestId: string) => {
        try {
            const request = await PrismaClient.friendRequest.findUnique({
                where: { id: requestId }
            });

            if (!request) {
                throw new ApiError(StatusCodes.NOT_FOUND, "Friend request not found");
            }
            if (request.receiverId !== receiverId) {
                throw new ApiError(StatusCodes.FORBIDDEN, "Not authorized to accept this request");
            }
            if (request.status === 'ACCEPTED') {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Already accepted");
            }

            await PrismaClient.$transaction([
                PrismaClient.friendRequest.update({
                    where: { id: requestId },
                    data: { status: 'ACCEPTED' }
                }),
                PrismaClient.friendship.create({
                    data: { userId: request.senderId, friendId: request.receiverId }
                }),
                PrismaClient.friendship.create({
                    data: { userId: request.receiverId, friendId: request.senderId }
                }),
                PrismaClient.notification.create({
                    data: {
                        type: 'friend_accept',
                        content: 'accepted your friend request',
                        userId: request.senderId,
                        senderId: request.receiverId,
                    }
                })
            ]);

            return { success: true };
        } catch (error) {
            console.error(`Error in acceptFriendRequest: ${error}`);
            throw error;
        }
    };

    /**
     * Reject friend request
     * @param receiverId 
     * @param requestId 
     * @returns 
     */
    // region Reject Request
    public rejectFriendRequest = async (receiverId: string, requestId: string) => {
        try {
            const request = await PrismaClient.friendRequest.findUnique({
                where: { id: requestId }
            });

            if (!request) {
                throw new ApiError(StatusCodes.NOT_FOUND, "Friend request not found");
            }
            if (request.receiverId !== receiverId) {
                throw new ApiError(StatusCodes.FORBIDDEN, "Not authorized to reject this request");
            }

            return await PrismaClient.friendRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });
        } catch (error) {
            console.error(`Error in rejectFriendRequest: ${error}`);
            throw error;
        }
    };

    /**
     * Remove friend
     * @param userId 
     * @param friendId 
     * @returns 
     */
    // region Remove Friend
    public removeFriend = async (userId: string, friendId: string) => {
        try {
            await PrismaClient.$transaction([
                PrismaClient.friendship.delete({
                    where: { userId_friendId: { userId, friendId } }
                }),
                PrismaClient.friendship.delete({
                    where: { userId_friendId: { userId: friendId, friendId: userId } }
                }),
                PrismaClient.friendRequest.deleteMany({
                    where: {
                        OR: [
                            { senderId: userId, receiverId: friendId },
                            { senderId: friendId, receiverId: userId }
                        ]
                    }
                })
            ]);

            return { success: true };
        } catch (error) {
            console.error(`Error in removeFriend: ${error}`);
            throw error;
        }
    };

    /**
     * Get pending friend requests
     * @param userId 
     * @returns 
     */
    // region Pending Requests
    public getPendingRequests = async (userId: string) => {
        try {
            return await PrismaClient.friendRequest.findMany({
                where: { receiverId: userId, status: 'PENDING' },
                include: {
                    sender: {
                        select: {
                            id: true,
                            fullName: true,
                            username: true,
                            email: true,
                            avatarConfig: true,
                        }
                    }
                }
            });
        } catch (error) {
            console.error(`Error in getPendingRequests: ${error}`);
            throw error;
        }
    };
}

export default FriendService;
