import Session from "../modules/session.js";
import Reaction from "../modules/reaction.js";
import validator from "../utils/validator.js";
import Publication from "../modules/publication.js";

export default class Feedback {
    constructor() {
        this.path = "/api/feedback";
        this.session = new Session();
        this.reaction = new Reaction();
        this.publication = new Publication();
    }

    post = async (request, response, body) => {
        const secureBodyValues = validator(body, { post_id: "required", reaction: "required" });
        const session = await this.session.valid(request);
        const userReaction = await this.reaction.isUserReactionInPublication(secureBodyValues.post_id, session.user_id);
        if (userReaction) {
            await this.reaction.remove(userReaction.id, userReaction.type);
            if (userReaction.type === secureBodyValues.reaction) {
                const publication = await this.publication.getFromID(secureBodyValues.post_id);
                const json = JSON.stringify({
                    sucess: true,
                    publication: publication,
                });

                response.writeHead(201);
                return response.end(json);
            }
        }

        const publication = await this.reaction.add(secureBodyValues.post_id, session.user_id, secureBodyValues.reaction);
        const json = JSON.stringify({
            sucess: true,
            publication: publication.post,
        });

        response.writeHead(201);
        return response.end(json);
    };

    init = () => {
        return {
            POST: this.post,
        };
    };
}
