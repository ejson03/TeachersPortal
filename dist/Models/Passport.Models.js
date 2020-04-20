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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importStar(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const Config = __importStar(require("../config/session"));
const passport_local_1 = require("passport-local");
const Models = __importStar(require("./Models"));
function PassportModelsGenerate(app) {
    const SequelizeSessionStore = require("connect-session-sequelize")(express_session_1.Store);
    const sessionStore = new SequelizeSessionStore({
        db: Models.SequelizeSql,
        checkExpirationInterval: 24 * 60 * 60 * 1000,
        expiration: 10 * 24 * 60 * 60 * 1000
    });
    app.use(express_session_1.default({
        cookie: Config.Session.cookie,
        name: Config.Session.name,
        resave: Config.Session.resave,
        saveUninitialized: Config.Session.saveUninitialized,
        secret: Config.Session.secret,
        store: sessionStore
    }));
    sessionStore.sync();
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use("app", new passport_local_1.Strategy(
    // Name of Parameter Fields
    {
        usernameField: "username",
        passwordField: "pass",
        passReqToCallback: true
    }, (req, name, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!name || !password)
                return done(null, null);
            const user = yield Models.Users.findOne({
                where: {
                    Name: name
                }
            });
            // As No Such User Found
            // Login Failed
            if (!user)
                return done(null, null);
            // Now Compare Passwords for Matching
            // Using bcrypt for Safety
            const match = yield user.ComparePassword(password);
            if (!match)
                return done(null, null);
            return done(null, new Models.UserViewModel(user.id, user.Name, user.Authority));
        }
        catch (error) {
            return done(error, null);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield Models.Users.findByPk(id);
            if (user == null)
                return done(null, undefined);
            else
                return done(null, new Models.UserViewModel(user.id, user.Name, user.Authority));
        }
        catch (error) {
            done(error, undefined);
        }
    }));
}
exports.PassportModelsGenerate = PassportModelsGenerate;
//# sourceMappingURL=Passport.Models.js.map