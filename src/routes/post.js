import Session from "../modules/session.js";
import Publication from "../modules/publication.js";

import newError from "../utils/error.js";
import validator from "../utils/validator.js";

export default class Post {
    constructor() {
        this.path = "/api/post";
        this.session = new Session();
        this.publication = new Publication();
    }

    get = async (request, response) => {
        const pageID = new URL(`${request.headers.host}${request.url}`).searchParams.get("page");
        const secureBodyValues = validator({ id: pageID }, { id: "required" });
        await this.session.valid(request);

        const publicationsIds = [];
        const totalPublications = await this.publication.count();
        const publications = await this.publication.getAllFormated(secureBodyValues.id);
        for (const index in publications) {
            const publication = publications[index];
            publicationsIds.push(publication.id);
            publication.views_count++;
        }

        await this.publication.updateViewsCount(publicationsIds);

        const json = JSON.stringify({
            publications: publications,
            total_publications: totalPublications,
        });

        response.writeHead(200);
        return response.end(json);
    };

    post = async (request, response, body) => {
        const secureBodyValues = validator(body, { title: "required", description: "required", image_url: "optional" });
        const session = await this.session.valid(request);
        const publication = await this.publication.create(session.user_id, secureBodyValues.title, secureBodyValues.description, secureBodyValues.image_url);
        const json = JSON.stringify({
            success: true,
            id: publication.id,
            title: publication.title,
            description: publication.description,
            views_count: publication.views_count,
        });

        response.writeHead(201);
        return response.end(json);
    };

    patch = async (request, response, body) => {
        const secureBodyValues = validator(body, { post_id: "required", title: "optional", description: "optional", image_url: "optional" });
        const bodyValuesLength = Object.keys(secureBodyValues).length;
        if (bodyValuesLength <= 1) {
            throw new newError({
                statusCode: 400,
                message: "Você não informou nenhum valor para ser atualizado.",
                errorLocationCode: "API:POST:PATCH:NOT_VALUES_VALID",
            });
        }

        const session = await this.session.valid(request);
        const publication = await this.publication.getFromID(secureBodyValues.post_id);
        if (publication.user_id !== session.user_id) {
            throw new newError({
                statusCode: 401,
                message: "Você não possui permissão para editar essa postagem.",
                errorLocationCode: "API:POST:PATCH:NOT_ALLOWED",
            });
        }

        await this.publication.update(secureBodyValues.post_id, publication, secureBodyValues);

        const publicationUpdated = await this.publication.getFromID(secureBodyValues.post_id);
        const json = JSON.stringify({
            success: true,
            publication: publicationUpdated,
        });

        response.writeHead(200);
        return response.end(json);
    };

    delete = async (request, response, body) => {
        const secureBodyValues = validator(body, { post_id: "required" });
        const session = await this.session.valid(request);
        const publication = await this.publication.getFromID(secureBodyValues.post_id);
        if (publication.user_id !== session.user_id) {
            throw new newError({
                statusCode: 401,
                message: "Você não possui permissão para excluir essa postagem.",
                errorLocationCode: "API:POST:DELETE:NOT_ALLOWED",
            });
        }

        await this.publication.delete(secureBodyValues.post_id);

        const json = JSON.stringify({
            success: true,
            post_id: secureBodyValues.post_id,
        });

        response.writeHead(200);
        return response.end(json);
    };

    init = () => {
        return {
            GET: this.get,
            POST: this.post,
            PATCH: this.patch,
            DELETE: this.delete,
        };
    };
}
