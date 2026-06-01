import { DoubleCodeApiServer } from "./app.ts";
import { config } from "./config.ts";

const server = new DoubleCodeApiServer().createHttpServer();

server.listen(config.port, () => {
    console.log(`DoubleCode feedback API listening on http://localhost:${config.port}`);
});
