import { env } from "./env.config.ts";

export const mySqlConfig = {
  hostname: env.DB_HOST,
  username: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  db: env.MYSQL_DATABASE,
}
