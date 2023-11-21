import newError from "../utils/error.js";
import database from "../infra/database.js";

export default class Account {
    constructor() {}

    create = async (name, password, email) => {
        const result = await database.user.create({
            data: {
                name: name,
                password: password,
                email: email,
            },
        });

        return result;
    };

    getFromID = async (id) => {
        const result = await database.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!result) {
            throw new newError({
                statusCode: 404,
                message: "O id não foi encontrado no sistema.",
                action: 'Verifique se o "id" está digitado corretamente.',
                errorLocationCode: "MODULES:ACCOUNT:GET_FROM_ID:NOT_FOUND",
            });
        }

        return result;
    };

    getFromEmail = async (email) => {
        const result = await database.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!result) {
            throw new newError({
                statusCode: 404,
                message: "O email não foi encontrado no sistema.",
                action: 'Verifique se o "email" está digitado corretamente.',
                errorLocationCode: "MODULES:ACCOUNT:GET_FROM_EMAIL:NOT_FOUND",
            });
        }

        return result;
    };

    isEmailAlreadyUsed = async (email) => {
        const result = await database.user.findUnique({
            where: {
                email: email,
            },
        });

        if (result) {
            throw new newError({
                statusCode: 400,
                message: "Esse email já esta sendo utilizado no sistema.",
                action: "Tente novamente com outro email.",
                errorLocationCode: "ROUTE:USER:VALIDATOR:EMAIL_USED",
            });
        }
    };
}
