require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const mysql = {
  host: process.env.MYSQL_HOST || "",
  user: process.env.MYSQL_USER || "",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "",
  port: Number(process.env.MYSQL_PORT) || 3306,
};

function isMysqlConfigured() {
  return Boolean(mysql.host && mysql.user && mysql.database);
}

module.exports = {
  port: Number(process.env.PORT) || 4001,
  mongoUri: required("MONGO_URI"),
  jwtSecret: required("JWT_SECRET"),
  corsOrigins,
  mysql,
  isMysqlConfigured,
};
