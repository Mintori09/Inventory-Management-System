import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { corsOptions } from "./config/cors";
import { swaggerSpec } from "./config/swagger";
import routes from "./routes";
import { errorMiddleware } from "./common/middlewares/error.middleware";
import { notFoundMiddleware } from "./common/middlewares/not-found.middleware";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
