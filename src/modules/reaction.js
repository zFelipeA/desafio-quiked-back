import database from "../infra/database.js";

export default class Reaction {
    constructor() {}

    add = async (postID, userID, type) => {
        if (type === "liked") {
            const result = await database.liked.create({
                data: {
                    user_id: userID,
                    post_id: postID,
                },
                include: {
                    post: {
                        select: {
                            id: true,
                            user_id: true,
                            title: true,
                            description: true,
                            image_url: true,
                            views_count: true,
                            created_at: true,
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                            comments: {
                                select: {
                                    id: true,
                                    user_id: true,
                                    description: true,
                                    created_at: true,
                                    deleted: true,
                                    user: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                            _count: {
                                select: {
                                    likeds: true,
                                    dislikeds: true,
                                },
                            },
                        },
                    },
                },
            });

            return result;
        }

        const result = await database.disliked.create({
            data: {
                user_id: userID,
                post_id: postID,
            },
            include: {
                post: {
                    select: {
                        id: true,
                        user_id: true,
                        title: true,
                        description: true,
                        image_url: true,
                        views_count: true,
                        created_at: true,
                        user: {
                            select: {
                                name: true,
                            },
                        },
                        comments: {
                            select: {
                                id: true,
                                user_id: true,
                                description: true,
                                created_at: true,
                                deleted: true,
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: {
                                likeds: true,
                                dislikeds: true,
                            },
                        },
                    },
                },
            },
        });

        return result;
    };

    remove = async (id, type) => {
        if (type === "liked") {
            const result = await database.liked.delete({
                where: {
                    id: id,
                },
            });

            return result;
        }

        const result = await database.disliked.delete({
            where: {
                id: id,
            },
        });

        return result;
    };

    isUserReactionInPublication = async (postID, userID) => {
        const likedResult = await database.liked.findFirst({
            where: {
                post_id: postID,
                user_id: userID,
            },
        });

        if (likedResult) {
            return { ...likedResult, type: "liked" };
        }

        const dislikedResult = await database.disliked.findFirst({
            where: {
                post_id: postID,
                user_id: userID,
            },
        });

        if (dislikedResult) {
            return { ...dislikedResult, type: "disliked" };
        }
    };
}
