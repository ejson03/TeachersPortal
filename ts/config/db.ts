require('dotenv').config()

export const DB = {
  Host: String("localhost" || process.env.DATABASE_HOST),
  Port: Number(5432 || process.env.DATABASE_PORT),
  UserName: String("postgres" || process.env.DATABASE_USER_NAME),
  Password: String("postgres" || process.env.DATABASE_PASSWORD),
  DatabaseName: String( "teacherportal" || process.env.DATABASE_NAME),
  SSL: Boolean(false || String(process.env.DATABASE_SSL) === "true")
};

console.log(DB);
console.log("####################################");