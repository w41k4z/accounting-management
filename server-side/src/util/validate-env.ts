import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  POSTGRES_HOST: str(),
  POSTGRES_PORT: port(),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DATABASE: str(),
  PORT: port(),
});
