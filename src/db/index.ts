import knex from "knex";
import config from "../config";

export default knex({
  client: "postgres",
  connection: {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
  },
});
