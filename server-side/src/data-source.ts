import { DataSource } from "typeorm";
import env from "./util/validate-env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  entities: ["./src/entities/**/*.ts"],
  synchronize: true,
});
