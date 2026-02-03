import express, { type Application } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import httpStatus from "http-status";
import config from "./config/config";
import morgan from "./config/morgan";
import { jwtStrategy } from "./config/passport";
import { authLimiter } from "./middlewares/rateLimiter";
import hpp from "hpp";
import { requestIdMiddleware } from "./middlewares/requestId";
import { xssSanitizer, mongoSanitizer } from "./middlewares/sanitize";
import routes from "./routes/v1";
import { errorConverter, errorHandler } from "./middlewares/error";
import ApiError from "./utils/ApiError";
import healthRoute from "./routes/health.route";

const app: Application = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// health check
app.use("/health", healthRoute);

// set security HTTP headers
app.use(helmet());

// request id and tracing
app.use(requestIdMiddleware);

// prevent http parameter pollution
app.use(hpp());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xssSanitizer);
app.use(mongoSanitizer);

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
// app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
app.use("/v1", routes);



// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
