import path from "path";
import config from "./src/config";

export default {
  client: "postgresql",
  connection: {
    host: config.database.host,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
  },
  migrations: {
    directory: path.join("db", "migrations"),
    tableName: "migrations",
  },
};
