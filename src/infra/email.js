import nodemailer from "nodemailer";

import newError from "../utils/error.js";

export default class Email {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    send = async (to, subject, text) => {
        const content = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        };

        try {
            await this.transporter.sendMail(content);
        } catch (error) {
            throw new newError({
                message: error.message,
                action: "Verifique se o serviço de emails está disponível.",
                errorLocationCode: "INFRA:EMAIl:SEND",
            });
        }
    };
}
