import "reflect-metadata";

import express from "express";

/* SERVER INIT */
const server = express();

/* MIDDLEWARES */
server.use(express.json());

/* ROUTES */

export default server;
