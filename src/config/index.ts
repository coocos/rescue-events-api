export default {
  env: process.env.NODE_ENV ?? "production",
  port: parseInt(process.env.APP_PORT ?? "8000"),
};
