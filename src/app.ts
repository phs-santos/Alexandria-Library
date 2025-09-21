import express from "express";
import morgan from "morgan";
import { responseHandler } from "./presentation/middlewares/responseHandler";
import { errorHandler } from "./presentation/middlewares/errorHandler";

import routes from "./presentation/routes";
import metricsRouter, {
    metricsMiddleware,
} from "./infrastructure/metrics/metrics";

const app = express();

app.use(express.json());
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
);

// aplica middlewares globais
app.use(responseHandler);
app.use(metricsMiddleware);

// rotas
app.use("/api", routes);
app.use(metricsRouter);

// captura erros no final
app.use(errorHandler);

export default app;
