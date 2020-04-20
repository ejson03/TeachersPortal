require('dotenv').config()

export const DB = {
  Host: String(process.env.DATABASE_HOST),
  Port: Number(process.env.DATABASE_PORT),
  UserName: String(process.env.DATABASE_USER_NAME),
  Password: String(process.env.DATABASE_PASSWORD),
  DatabaseName: String(process.env.DATABASE_NAME),
  SSL: Boolean(process.env.DATABASE_SSL)
};

console.log(DB);
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");