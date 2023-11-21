import database from "../infra/database.js";

export default class Commentary {
    constructor() {}

    create = async (postID, userID, description) => {
        const result = await database.comment.create({
            data: {
                user_id: userID,
                post_id: postID,
                description: description,
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
                                email: true,
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

    delete = async (id, description) => {
        const result = await database.comment.update({
            where: {
                id: id,
            },
            data: {
                deleted: true,
                description: description,
            },
        });

        return result;
    };

    update = async (id, description) => {
        const result = await database.comment.update({
            where: {
                id: id,
            },
            data: {
                description: description,
            },
        });

        return result;
    };

    getFromID = async (id) => {
        const result = await database.comment.findUnique({
            where: {
                id: id,
            },
            include: {
                post: {
                    select: {
                        user_id: true,
                    },
                },
            },
        });

        return result;
    };
}
