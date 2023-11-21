import bcryptjs from "bcryptjs";

import newError from "../utils/error.js";

export default class Password {
    constructor() {}

    hash = async (password) => {
        return await bcryptjs.hash(password, 10);
    };

    compare = async (providedPassword, storedPassword) => {
        const result = await bcryptjs.compare(providedPassword, storedPassword);
        if (!result) {
            throw new newError({
                statusCode: 401,
                message: "A senha informada não confere com a senha do usuário.",
                action: "Verifique se a senha informada está correta e tente novamente.",
                errorLocationCode: "MODULES:PASSWORD:COMPARE_PASSWORDS:PASSWORD_MISMATCH",
            });
        }
    };
}
