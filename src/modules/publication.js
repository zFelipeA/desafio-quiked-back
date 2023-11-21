import newError from "../utils/error.js";
import database from "../infra/database.js";

export default class Publication {
    constructor() {
        this.per_page_post = 3;
    }

    create = async (userID, title, description, imageURL = "none") => {
        const result = await database.post.create({
            data: {
                user_id: userID,
                title: title,
                description: description,
                image_url: imageURL,
            },
        });

        return result;
    };

    delete = async (id) => {
        const result = await database.post.delete({
            where: {
                id: id,
            },
        });

        return result;
    };

    update = async (id, oldValues, newValues) => {
        const updateValues = { ...oldValues, ...newValues };
        const result = await database.post.update({
            where: {
                id: id,
            },
            data: {
                title: updateValues.title,
                description: updateValues.description,
                image_url: updateValues.image_url,
            },
        });

        return result;
    };

    updateViewsCount = async (postIds) => {
        const result = await database.post.updateMany({
            where: {
                id: {
                    in: postIds,
                },
            },
            data: {
                views_count: {
                    increment: 1,
                },
            },
        });

        return result;
    };

    count = async () => {
        return await database.post.count();
    };

    getAll = async () => {
        return await database.post.findMany({});
    };

    getAllFromSummary = async () => {
        const result = await database.post.findMany({
            select: {
                id: true,
                title: true,
                views_count: true,
                _count: {
                    select: {
                        comments: true,
                        likeds: true,
                        dislikeds: true,
                    },
                },
            },
        });

        return result;
    };

    getAllFormated = async (page) => {
        const skipAmount = (page - 1) * this.per_page_post;
        const result = await database.post.findMany({
            take: this.per_page_post,
            skip: skipAmount,
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
            orderBy: {
                created_at: "desc",
            },
        });

        return result;
    };

    getFromID = async (id) => {
        const result = await database.post.findUnique({
            where: {
                id: id,
            },
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
        });

        if (!result) {
            throw new newError({
                statusCode: 404,
                message: "O id não foi encontrado no sistema.",
                action: 'Verifique se o "id" está digitado corretamente.',
                errorLocationCode: "MODULES:PUBLICATION:GET_FROM_ID:NOT_FOUND",
            });
        }

        return result;
    };
}
