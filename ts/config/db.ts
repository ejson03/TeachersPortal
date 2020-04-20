require('dotenv').config()

export const DB = {
  Host: String(process.env.DATABASE_HOST || "localhost"),
  Port: Number(process.env.DATABASE_PORT || 5432),
  UserName: String(process.env.DATABASE_USER_NAME || "postgres"),
  Password: String(process.env.DATABASE_PASSWORD || "postgres"),
  DatabaseName: String(process.env.DATABASE_NAME || "teacherportal"),
  SSL: Boolean(String(process.env.DATABASE_SSL) === "true" || false)
};

console.log(DB);
