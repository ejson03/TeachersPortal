import { Sequelize } from "sequelize-typescript";

import * as Config from "../config/db";

import { Pool } from "pg";

import { Users } from "./Users.Model";
import { Conference } from "./Conference.Models";
import { Fdp } from "./Fdp.Models";
import { Journal } from "./Journal.Models";
import { Mrg } from "./Mrg.Models";
import { Progatt } from "./Progatt.Models";
import { Semwork } from "./Semwork.Models";
import { Sttp } from "./Sttp.Models";

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $like: Op.like,
  $ilike: Op.iLike
};

// Create the Connection
export const SequelizeSql = new Sequelize({
  host: Config.DB.Host,
  username: Config.DB.UserName,
  password: Config.DB.Password,
  port: Config.DB.Port,
  database: Config.DB.ProjectName,
  dialect: Config.DB.Dialect,
  // Set logging to False to disable logging
  logging: true,
  operatorsAliases: operatorsAliases
});

async function CreateDatabaseIfNotExists(db_name: string) {
  const pool = new Pool({
    // host: Config.DB.Host,
    // user: Config.DB.UserName,
    // password: Config.DB.Password,
    // port: Config.DB.Port,
    // database: Config.DB.DatabaseName
    connectionString: "postgres://imbjvirpczaeqz:54c2ab61ed83dd1b1c382acf8a1ee28e624eb8f383c7c3539ec0889c5da3f7bb@ec2-52-200-119-0.compute-1.amazonaws.com:5432/d7ra2glp760kah",
  ssl: true
    
  });
  const client = await pool.connect();

  const query: string =
    "SELECT COUNT(*) AS cnt FROM pg_database where datname" +
    "='" +
    db_name +
    "'" +
    " AND datistemplate = false;";
  const res = await client.query(query);
  const rowCount = Number(res.rows[0].cnt);
  if (rowCount === 0) {
    // Create the Database Now
    await client.query("CREATE DATABASE " + db_name);
  }
  client.release();
  await pool.end();
}

export async function RunSynchronisation() {
  // First End up Creating the Database
  // In admin Database
  await CreateDatabaseIfNotExists(Config.DB.ProjectName);
  // Authenticate if Entered Information is correct
  await SequelizeSql.authenticate();

  SequelizeSql.addModels([Users, Conference, Fdp, Journal, Mrg, Progatt, Semwork, Sttp]);
  // End up creating the Table
  // If it does not exist
  await Users.sync({ force: false });
  // Insert the Default Value for User if not already present
  await Users.InsertIfNotExists(Users.DefaultUser);

  await Conference.sync({ force: false });
  await Fdp.sync({ force: false });
  await Journal.sync({ force: false });
  await Mrg.sync({ force: false });
  await Sttp.sync({ force: false });
  await Progatt.sync({ force: false });
  await Semwork.sync({ force: false });
}
