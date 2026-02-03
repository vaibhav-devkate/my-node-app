import mongoose from "mongoose";
import app from "./app";
import logger from "./config/logger";
import config from "./config/config";

let server: import("http").Server | undefined;

mongoose.connect(config.mongoose.url).then(() => {
  logger.info("Connected to MongoDB");
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = (): void => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      mongoose.connection.close(false).then(() => {
        logger.info("MongoDB connection closed");
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown): void => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      mongoose.connection.close(false).then(() => {
        logger.info("MongoDB connection closed");
      });
    });
  }
});

process.on("SIGINT", () => {
  logger.info("SIGINT received");
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      mongoose.connection.close(false).then(() => {
        logger.info("MongoDB connection closed");
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
});
