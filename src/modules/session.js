import crypto from "node:crypto";

import newError from "../utils/error.js";
import database from "../infra/database.js";
import validator from "../utils/validator.js";

export default class Session {
    constructor() {}

    create = async (accountID) => {
        const date = new Date();
        const token = crypto.randomBytes(48).toString("hex");
        date.setDate(date.getDate() + 30);

        const result = await database.session.create({
            data: {
                token: token,
                user_id: accountID,
                expires_at: date,
            },
        });

        return result;
    };

    delete = async (id) => {
        const result = await database.session.delete({
            where: {
                id: id,
            },
        });

        return result;
    };

    valid = async (request) => {
        const sessionID = request.headers.cookies.session_id;
        if (!sessionID) {
            throw new newError({
                statusCode: 401,
                message: `Você não está autenticado.`,
                action: `Realize o login para realizar essa ação.`,
                errorLocationCode: "MODULES:SESSION:VALID:NOT_HAS_OOKIE",
            });
        }

        const secureBodyValues = validator({ session_id: sessionID }, { session_id: "required" });
        return await this.getFromToken(secureBodyValues.session_id);
    };

    getFromToken = async (token) => {
        const result = await database.session.findFirst({
            where: {
                token: token,
            },
            include: {
                user: true,
            },
        });

        if (!result) {
            throw new newError({
                statusCode: 401,
                message: `Sessão inválida.`,
                action: `Sessão inválida, tente novamente.`,
                errorLocationCode: "MODULES:SESSION:GET_FROM_TOKEN:INVALID",
            });
        }

        const date = new Date();
        if (result.expires_at <= date) {
            throw new newError({
                statusCode: 401,
                message: `Sessão inválida.`,
                action: `Sessão inválida, tente novamente.`,
                errorLocationCode: "MODULES:SESSION:GET_FROM_TOKEN:TOKEN_EXPIRED",
            });
        }

        return result;
    };
}
