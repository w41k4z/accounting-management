import "reflect-metadata";
import "dotenv/config";

import { AppDataSource } from "./data-source";
import server from "./server/server";
import env from "./util/validate-env";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    server.listen(env.PORT, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
