"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Config = __importStar(require("../config/db"));
const pg_1 = require("pg");
const Users_Model_1 = require("./Users.Model");
const Conference_Models_1 = require("./Conference.Models");
const Fdp_Models_1 = require("./Fdp.Models");
const Journal_Models_1 = require("./Journal.Models");
const Mrg_Models_1 = require("./Mrg.Models");
const Progatt_Models_1 = require("./Progatt.Models");
const Semwork_Models_1 = require("./Semwork.Models");
const Sttp_Models_1 = require("./Sttp.Models");
const Op = sequelize_typescript_1.Sequelize.Op;
const operatorsAliases = {
    $eq: Op.eq,
    $like: Op.like,
    $ilike: Op.iLike
};
// Create the Connection
exports.SequelizeSql = new sequelize_typescript_1.Sequelize({
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
function CreateDatabaseIfNotExists(db_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool({
            // host: Config.DB.Host,
            // user: Config.DB.UserName,
            // password: Config.DB.Password,
            // port: Config.DB.Port,
            // database: Config.DB.DatabaseName
            connectionString: "postgres://imbjvirpczaeqz:54c2ab61ed83dd1b1c382acf8a1ee28e624eb8f383c7c3539ec0889c5da3f7bb@ec2-52-200-119-0.compute-1.amazonaws.com:5432/d7ra2glp760kah",
            ssl: true
        });
        const client = yield pool.connect();
        const query = "SELECT COUNT(*) AS cnt FROM pg_database where datname" +
            "='" +
            db_name +
            "'" +
            " AND datistemplate = false;";
        const res = yield client.query(query);
        const rowCount = Number(res.rows[0].cnt);
        if (rowCount === 0) {
            // Create the Database Now
            yield client.query("CREATE DATABASE " + db_name);
        }
        client.release();
        yield pool.end();
    });
}
function RunSynchronisation() {
    return __awaiter(this, void 0, void 0, function* () {
        // First End up Creating the Database
        // In admin Database
        yield CreateDatabaseIfNotExists(Config.DB.ProjectName);
        // Authenticate if Entered Information is correct
        yield exports.SequelizeSql.authenticate();
        exports.SequelizeSql.addModels([Users_Model_1.Users, Conference_Models_1.Conference, Fdp_Models_1.Fdp, Journal_Models_1.Journal, Mrg_Models_1.Mrg, Progatt_Models_1.Progatt, Semwork_Models_1.Semwork, Sttp_Models_1.Sttp]);
        // End up creating the Table
        // If it does not exist
        yield Users_Model_1.Users.sync({ force: false });
        // Insert the Default Value for User if not already present
        yield Users_Model_1.Users.InsertIfNotExists(Users_Model_1.Users.DefaultUser);
        yield Conference_Models_1.Conference.sync({ force: false });
        yield Fdp_Models_1.Fdp.sync({ force: false });
        yield Journal_Models_1.Journal.sync({ force: false });
        yield Mrg_Models_1.Mrg.sync({ force: false });
        yield Sttp_Models_1.Sttp.sync({ force: false });
        yield Progatt_Models_1.Progatt.sync({ force: false });
        yield Semwork_Models_1.Semwork.sync({ force: false });
    });
}
exports.RunSynchronisation = RunSynchronisation;
//# sourceMappingURL=Sequelize.js.map