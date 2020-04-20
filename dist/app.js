"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const Models = __importStar(require("./Models/Sequelize"));
const Routes = __importStar(require("./routes/Routes"));
const cors = __importStar(require("cors"));
const Passport_Models_1 = require("./Models/Passport.Models");
exports.app = express_1.default();
require('dotenv').config();
// app.use(bodyParser.json());
// middleware for parsing application/x-www-form-urlencoded
exports.app.use(bodyParser.urlencoded({ extended: true }));
// Use this to Render HTML
// Specify Path of Website Static Contents
exports.app.engine('.html', require('ejs').renderFile);
exports.app.set("views", "./Views");
exports.app.set('view engine', 'ejs');
exports.app.use("/", express_1.default.static("./Website"));
Models.RunSynchronisation().then(() => { });
Passport_Models_1.PassportModelsGenerate(exports.app);
exports.app.use(cors.default());
// middleware for json body parsing
exports.app.use(bodyParser.json());
// middleware for parsing application/x-www-form-urlencoded
exports.app.use(bodyParser.urlencoded({ extended: true }));
// middleware for json body parsing
exports.app.use(bodyParser.json({ limit: "20mb" }));
// Route via this as Path to Users
exports.app.use("/user", Routes.Users);
// Route via this as Path to Admin
exports.app.use("/admin", Routes.Admin);
// Route via this as Path to Updation
exports.app.use("/", Routes.Updation);
// Route via this as Path to Conference
exports.app.use("/", Routes.Conference);
exports.app.use("/", Routes.Fdp);
exports.app.use("/", Routes.Sttp);
exports.app.use("/", Routes.Journal);
exports.app.use("/", Routes.Progatt);
exports.app.use("/", Routes.Semwork);
exports.app.use("/", Routes.Mrg);
//# sourceMappingURL=app.js.map