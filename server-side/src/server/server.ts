import "reflect-metadata";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import createHttpError, { isHttpError } from "http-errors";

import chartOfAccountRoute from "../routes/chartOfAccount";
import journalCodeRoute from "../routes/journalCode";
import journalRoute from "../routes/journal";
import referenceDocumentRoute from "../routes/referenceDocument";
import societyRoute from "../routes/society";
import thirdPartyChartOfAccountRoute from "../routes/thirdPartyChartOfAccount";
import userRoute from "../routes/user";
import currencyRoute from "../routes/currency";

/* SERVER INIT */
const server = express();

/* MIDDLEWARES */
server.use(cors());
server.use(express.json());

/* ROUTES */
server.use("/api/chart-of-account", chartOfAccountRoute);
server.use("/api/currency", currencyRoute);
server.use("/api/journal-code", journalCodeRoute);
server.use("/api/journal", journalRoute);
server.use("/api/reference-document", referenceDocumentRoute);
server.use("/api/society", societyRoute);
server.use("/api/third-party-chart-of-account", thirdPartyChartOfAccountRoute);
server.use("/api/user", userRoute);

/* RESSOURCE NOT FOUND */
server.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

/* ERROR HANDLER */
server.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: unknown, req: Request, res: Response, next: NextFunction) => {
    let errorMessage =
      error instanceof Error ? error.message : "An unknown error has occurred";
    let status = 500;
    if (isHttpError(error)) {
      errorMessage = error.message;
      status = error.status;
    }
    res.status(status).json({ message: errorMessage });
  }
);

export default server;
