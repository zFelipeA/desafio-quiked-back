import { createServer } from "node:http";

import web from "../utils/web.js";
import color from "../utils/color.js";
import dirname from "../utils/dirname.js";
import loadFolder from "../utils/loader.js";

export default class Server {
    constructor() {
        this.port = 1337;
        this.routes = {};
        this.receive_body = ["POST", "DELETE", "PATCH"];
        this.http = createServer(this.listener);
    }

    listener = async (request, response) => {
        try {
            web.setCortsRequest(request, response);
            if (request.method === "OPTIONS") {
                response.writeHead(200);
                response.end();
                return;
            }

            const url = new URL(request.url, `http://${request.headers.host}`).pathname;
            const isValidRoute = this.routes[url];
            if (!isValidRoute) {
                response.writeHead(404);
                return response.end("Route not found");
            }

            const methodHandler = isValidRoute[request.method];
            if (!methodHandler) {
                response.writeHead(400);
                return response.end("Method not allowed");
            }

            request.headers.cookies = web.cookies(request);

            const isMethodNeedBody = this.receive_body.includes(request.method);
            if (isMethodNeedBody) {
                const body = await web.parseRequestBody(request);
                return await methodHandler(request, response, body);
            }

            await methodHandler(request, response);
        } catch (error) {
            const statusCode = error.status_code || 500;
            const json = JSON.stringify({
                success: false,
                error: error.message,
                action: error.action,
                status_code: statusCode,
            });

            response.writeHead(statusCode);
            return response.end(json);
        }
    };

    load = async () => {
        const path = dirname(import.meta);
        const files = await loadFolder(`${path}/../routes`);
        for (const file of files) {
            const route = new file.content.default();
            this.routes[route.path] = route.init();
            console.log(`${color.fg.blue}○${color.reset} Route ${color.bright}${route.path}${color.reset} was loaded.`);
        }
    };

    start = async () => {
        await new Promise((resolve) => {
            this.http.listen(this.port, () => {
                console.log(`${color.fg.green}✓${color.reset} Server started in ${color.underscore}0.0.0.0:${this.port}${color.reset}`);
                resolve();
            });
        });
    };

    init = async () => {
        await this.load();
        await this.start();
    };
}
