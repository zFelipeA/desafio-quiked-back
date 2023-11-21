import Email from "../infra/email.js";

import Session from "../modules/session.js";
import Commentary from "../modules/commentary.js";
import Publication from "../modules/publication.js";

import newError from "../utils/error.js";
import validator from "../utils/validator.js";

export default class Comment {
    constructor() {
        this.path = "/api/comment";
        this.email = new Email();
        this.session = new Session();
        this.commentary = new Commentary();
        this.publication = new Publication();
    }

    post = async (request, response, body) => {
        const secureBodyValues = validator(body, { post_id: "required", text: "required" });
        const session = await this.session.valid(request);
        await this.publication.getFromID(secureBodyValues.post_id);

        const comment = await this.commentary.create(secureBodyValues.post_id, session.user_id, secureBodyValues.text);
        const json = JSON.stringify({
            success: true,
            publication: comment.post,
        });

        await this.email.send(
            comment.post.user.email,
            "Alguém comentou em sua publicação.",
            `O usuário ${comment.post.user.name} comentou "${secureBodyValues.text}" em sua publicação, entre em nossa rede social e visualize o comentário.`
        );

        response.writeHead(201);
        return response.end(json);
    };

    patch = async (request, response, body) => {
        const secureBodyValues = validator(body, { id: "required", text: "required" });
        const session = await this.session.valid(request);
        const comment = await this.commentary.getFromID(secureBodyValues.id);
        if (comment.user_id !== session.user_id) {
            throw new newError({
                statusCode: 401,
                message: "Você não possui permissão para editar esse comentário.",
                errorLocationCode: "API:COMMENT:PATCH:NOT_HAS_PERMISSION",
            });
        }

        if (comment.deleted) {
            throw new newError({
                statusCode: 400,
                message: "Esse comentário foi excluido e não pode ser modificado.",
                errorLocationCode: "API:COMMENT:PATCH:COMMENT_IS_DELETED",
            });
        }

        await this.commentary.update(comment.id, secureBodyValues.text);
        const publication = await this.publication.getFromID(comment.post_id);
        const json = JSON.stringify({
            success: true,
            publication: publication,
        });

        response.writeHead(200);
        return response.end(json);
    };

    delete = async (request, response, body) => {
        const secureBodyValues = validator(body, { id: "required" });
        const session = await this.session.valid(request);
        const comment = await this.commentary.getFromID(secureBodyValues.id);
        if (comment.deleted) {
            throw new newError({
                statusCode: 400,
                message: "Esse comentário foi excluido e não pode ser modificado.",
                errorLocationCode: "API:COMMENT:DELETE:COMMENT_IS_ALREADY_DELETED",
            });
        }

        const postOwnerID = comment.post.user_id;
        const commentOwnerID = comment.user_id;
        if (postOwnerID !== session.user_id && commentOwnerID !== session.user_id) {
            throw new newError({
                statusCode: 401,
                message: "Você não possui permissão para excluir esse comentário.",
                errorLocationCode: "API:COMMENT:DELETE:NOT_ALLOWED",
            });
        }

        let description = "• Esse comentário foi excluido pelo usuário.";
        if (session.user_id !== commentOwnerID) {
            description = "• Esse comentário foi excluido pelo proprietário da postagem.";
        }

        await this.commentary.delete(secureBodyValues.id, description);
        const publication = await this.publication.getFromID(comment.post_id);
        const json = JSON.stringify({
            success: true,
            publication: publication,
        });

        response.writeHead(200);
        return response.end(json);
    };

    init = () => {
        return {
            POST: this.post,
            PATCH: this.patch,
            DELETE: this.delete,
        };
    };
}
