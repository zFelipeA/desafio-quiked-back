import Account from "../modules/account.js";
import Session from "../modules/session.js";
import Password from "../modules/password.js";
import validator from "../utils/validator.js";

export default class Authentication {
    constructor() {
        this.path = "/api/auth";
        this.account = new Account();
        this.session = new Session();
        this.password = new Password();
    }

    get = async (request, response) => {
        const session = await this.session.valid(request);
        const json = JSON.stringify({
            success: true,
            id: session.user_id,
            name: session.user.name,
            email: session.user.email,
        });

        response.writeHead(200);
        return response.end(json);
    };

    post = async (_, response, body) => {
        const secureBodyValues = validator(body, { password: "required", email: "required" });
        const account = await this.account.getFromEmail(secureBodyValues.email);
        await this.password.compare(secureBodyValues.password, account.password);

        const session = await this.session.create(account.id);
        const json = JSON.stringify({
            success: true,
            token: session.token,
            user_id: session.user_id,
        });

        response.setHeader("Set-Cookie", `session_id=${session.token}; Secure; HttpOnly; Path=/; Expires=${session.expires_at}`);
        response.writeHead(201);
        return response.end(json);
    };

    delete = async (request, response) => {
        const session = await this.session.valid(request);
        await this.session.delete(session.id);

        const json = JSON.stringify({
            success: true,
        });

        response.setHeader("Set-Cookie", `session_id=; Secure; HttpOnly; Path=/; Expires=0`);
        response.writeHead(200);
        return response.end(json);
    };

    init = () => {
        return {
            GET: this.get,
            POST: this.post,
            DELETE: this.delete,
        };
    };
}
