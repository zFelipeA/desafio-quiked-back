import Joi from "joi";
import newError from "./error.js";

export default (object, keys) => {
    try {
        object = JSON.parse(JSON.stringify(object));
    } catch (error) {
        throw new newError({
            message: "Não foi possível interpretar o valor enviado.",
            action: "Verifique se o valor enviado é um JSON válido.",
            errorLocationCode: "UTILS:VALIDATOR:ERROR_PARSING_JSON",
        });
    }

    let finalSchema = Joi.object().required().min(1).messages({
        "object.base": `Body enviado deve ser do tipo Object.`,
        "object.min": `Objeto enviado deve ter no mínimo uma chave.`,
    });

    for (const key of Object.keys(keys)) {
        const keyValidationFunction = schemas[key];
        finalSchema = finalSchema.concat(keyValidationFunction());
    }

    const { error, value } = finalSchema.validate(object, {
        escapeHtml: true,
        stripUnknown: true,
        context: {
            required: keys,
        },
    });

    if (error) {
        throw new newError({
            statusCode: 400,
            message: error.details[0].message,
            errorLocationCode: "UTILS:VALIDATOR:FINAL_SCHEMA",
        });
    }

    return value;
};

const schemas = {
    id: function () {
        return Joi.object({
            id: Joi.number().integer().min(1).max(1000000).when("$required.id", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                "any.required": `"id" é um campo obrigatório.`,
                "string.empty": `"id" não pode estar em branco.`,
                "number.base": `"id" deve ser do tipo Number.`,
                "number.integer": `"id" deve ser um Inteiro.`,
                "number.min": `"id" deve possuir um valor mínimo de 1.`,
                "number.max": `"id" deve possuir um valor máximo de 1000000.`,
                "number.unsafe": `"id" deve possuir um valor máximo de 1000000.`,
            }),
        });
    },

    user_id: function () {
        return Joi.object({
            user_id: Joi.number().integer().min(1).max(1000000).when("$required.user_id", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                "any.required": `"user_id" é um campo obrigatório.`,
                "string.empty": `"user_id" não pode estar em branco.`,
                "number.base": `"user_id" deve ser do tipo Number.`,
                "number.integer": `"user_id" deve ser um Inteiro.`,
                "number.min": `"user_id" deve possuir um valor mínimo de 1.`,
                "number.max": `"user_id" deve possuir um valor máximo de 1000000.`,
                "number.unsafe": `"user_id" deve possuir um valor máximo de 1000000.`,
            }),
        });
    },

    name: function () {
        return Joi.object({
            name: Joi.string().alphanum().min(3).max(30).trim().invalid(null).when("$required.name", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                "any.required": `"usuário" é um campo obrigatório.`,
                "string.empty": `"usuário" não pode estar em branco.`,
                "string.base": `"usuário" deve ser do tipo String.`,
                "string.alphanum": `"usuário" deve conter apenas caracteres alfanuméricos.`,
                "string.min": `"usuário" deve conter no mínimo {#limit} caracteres.`,
                "string.max": `"usuário" deve conter no máximo {#limit} caracteres.`,
                "any.invalid": `"usuário" possui o valor inválido "null".`,
            }),
        });
    },

    password: function () {
        return Joi.object({
            password: Joi.string().min(8).max(72).trim().invalid(null).when("$required.password", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                "any.required": `"senha" é um campo obrigatório.`,
                "string.empty": `"senha" não pode estar em branco.`,
                "string.base": `"senha" deve ser do tipo String.`,
                "string.min": `"senha" deve conter no mínimo {#limit} caracteres.`,
                "string.max": `"senha" deve conter no máximo {#limit} caracteres.`,
                "any.invalid": `"senha" possui o valor inválido "null".`,
            }),
        });
    },

    email: function () {
        return Joi.object({
            email: Joi.string()
                .email()
                .min(7)
                .max(254)
                .lowercase()
                .trim()
                .invalid(null)
                .when("$required.email", { is: "required", then: Joi.required(), otherwise: Joi.optional() })
                .messages({
                    "any.required": `"email" é um campo obrigatório.`,
                    "string.empty": `"email" não pode estar em branco.`,
                    "string.base": `"email" deve ser do tipo String.`,
                    "string.email": `"email" deve conter um email válido.`,
                    "any.invalid": `"email" possui o valor inválido "null".`,
                }),
        });
    },

    session_id: function () {
        return Joi.object({
            session_id: Joi.string().length(96).alphanum().when("$required.session_id", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                "any.required": `"session_id" é um campo obrigatório.`,
                "string.empty": `"session_id" não pode estar em branco.`,
                "string.base": `"session_id" deve ser do tipo String.`,
                "string.length": `"session_id" deve possuir {#limit} caracteres.`,
                "string.alphanum": `"session_id" deve conter apenas caracteres alfanuméricos.`,
            }),
        });
    },

    expires_at: function () {
        return Joi.object({
            expires_at: Joi.date().allow(null).when("$required.expires_at", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                "any.required": `"expires_at" é um campo obrigatório.`,
                "string.empty": `"expires_at" não pode estar em branco.`,
                "string.base": `"expires_at" deve ser do tipo Date.`,
            }),
        });
    },

    post_id: function () {
        return Joi.object({
            post_id: Joi.number().integer().min(1).max(1000000).when("$required.post_id", { is: "required", then: Joi.required(), otherwise: Joi.optional() }).messages({
                "any.required": `"post_id" é um campo obrigatório.`,
                "string.empty": `"post_id" não pode estar em branco.`,
                "number.base": `"post_id" deve ser do tipo Number.`,
                "number.integer": `"post_id" deve ser um Inteiro.`,
                "number.min": `"post_id" deve possuir um valor mínimo de 1.`,
                "number.max": `"post_id" deve possuir um valor máximo de 1000000.`,
                "number.unsafe": `"post_id" deve possuir um valor máximo de 1000000.`,
            }),
        });
    },

    title: function () {
        return Joi.object({
            title: Joi.string()
                .replace(/^(\s|\p{C}|\u2800|\u034f|\u115f|\u1160|\u17b4|\u17b5|\u3164|\uffa0)+|(\s|\p{C}|\u2800|\u034f|\u115f|\u1160|\u17b4|\u17b5|\u3164|\uffa0)+$|\u0000/gu, "")
                .allow(null)
                .min(1)
                .max(255)
                .when("$required.title", { is: "required", then: Joi.required(), otherwise: Joi.optional() })
                .messages({
                    "any.required": `"title" é um campo obrigatório.`,
                    "string.empty": `"title" não pode estar em branco.`,
                    "string.base": `"title" deve ser do tipo String.`,
                    "string.min": `"title" deve conter no mínimo {#limit} caracteres.`,
                    "string.max": `"title" deve conter no máximo {#limit} caracteres.`,
                }),
        });
    },

    description: function () {
        return Joi.object({
            description: Joi.string()
                .pattern(/^(\s|\p{C}|\u2800|\u034f|\u115f|\u1160|\u17b4|\u17b5|\u3164|\uffa0).*$/su, { invert: true })
                .replace(/(\s|\p{C}|\u2800|\u034f|\u115f|\u1160|\u17b4|\u17b5|\u3164|\uffa0)+$|\u0000/gsu, "")
                .min(1)
                .max(20000)
                .invalid(null)

                .when("$required.description", { is: "required", then: Joi.required(), otherwise: Joi.optional() })
                .messages({
                    "any.required": `"description" é um campo obrigatório.`,
                    "string.empty": `"description" não pode estar em branco.`,
                    "string.base": `"description" deve ser do tipo String.`,
                    "string.min": `"description" deve conter no mínimo {#limit} caracteres.`,
                    "string.max": `"description" deve conter no máximo {#limit} caracteres.`,
                    "any.invalid": `"description" possui o valor inválido "null".`,
                    "string.pattern.invert.base": `"description" deve começar com caracteres visíveis.`,
                }),
        });
    },

    image_url: function () {
        return Joi.object({
            image_url: Joi.string()
                .allow(null)
                .replace(/\u0000/g, "")
                .trim()
                .max(2000)
                .pattern(/^https?:\/\/([-\p{Ll}\d_]{1,255}\.)+[-a-z0-9]{2,24}(:[0-9]{1,5})?([\/?#]\S*)?$/u)
                .when("$required.image_url", { is: "required", then: Joi.required(), otherwise: Joi.optional() })
                .messages({
                    "any.required": `"image_url" é um campo obrigatório.`,
                    "string.empty": `"image_url" não pode estar em branco.`,
                    "string.base": `"image_url" deve ser do tipo String.`,
                    "string.max": `"image_url" deve conter no máximo {#limit} caracteres.`,
                    "any.invalid": `"image_url" possui o valor inválido "null".`,
                    "string.pattern.base": `"image_url" deve possuir uma URL válida e utilizando os protocolos HTTP ou HTTPS.`,
                }),
        });
    },

    text: function () {
        return Joi.object({
            text: Joi.string()
                .replace(/(\s|\p{C}|\u2800|\u034f|\u115f|\u1160|\u17b4|\u17b5|\u3164|\uffa0)+$|\u0000/gsu, "")
                .max(5000)
                .invalid(null)
                .allow("")
                .when("$required.text", { is: "required", then: Joi.required(), otherwise: Joi.optional() })
                .messages({
                    "any.required": `"text" é um campo obrigatório.`,
                    "string.base": `"text" deve ser do tipo String.`,
                    "string.max": `"text" deve conter no máximo {#limit} caracteres.`,
                    "any.invalid": `"text" possui o valor inválido "null".`,
                }),
        });
    },

    reaction: function () {
        return Joi.object({
            reaction: Joi.string()
                .trim()
                .valid("liked", "disliked")
                .invalid(null)
                .when("$required.reaction", { is: "required", then: Joi.required(), otherwise: Joi.optional() })
                .messages({
                    "any.required": `"reaction" é um campo obrigatório.`,
                    "string.empty": `"reaction" não pode estar em branco.`,
                    "string.base": `"reaction" deve ser do tipo String.`,
                    "any.invalid": `"reaction" possui o valor inválido "null".`,
                    "any.only": `"reaction" deve possuir um dos seguintes valores: "liked" e "disliked".`,
                }),
        });
    },
};
