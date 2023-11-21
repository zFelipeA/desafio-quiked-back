import Account from "../modules/account.js";
import Password from "../modules/password.js";
import validator from "../utils/validator.js";

export default class User {
    constructor() {
        this.path = "/api/user";
        this.account = new Account();
        this.password = new Password();
    }

    post = async (_, response, body) => {
        const secureBodyValues = validator(body, { name: "required", password: "required", email: "required" });
        await this.account.isEmailAlreadyUsed(secureBodyValues.email);

        const passwordHash = await this.password.hash(secureBodyValues.password);
        const result = await this.account.create(secureBodyValues.name, passwordHash, secureBodyValues.email);
        const json = JSON.stringify({
            success: true,
            id: result.id,
            name: result.name,
            email: result.email,
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
