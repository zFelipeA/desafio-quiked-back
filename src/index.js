import Server from "./infra/server.js";

const server = new Server();
await server.init();
