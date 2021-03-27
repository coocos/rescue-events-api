export default {
  env: process.env.NODE_ENV ?? "production",
  port: parseInt(process.env.APP_PORT ?? "8000"),
  feed: {
    schedule: process.env.FEED_SCHEDULE ?? "*/2 * * * *",
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
