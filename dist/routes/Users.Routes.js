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
const express_1 = require("express");
const Model = __importStar(require("../Models/Users.Model"));
const crypto_1 = require("crypto");
const passport_1 = __importDefault(require("passport"));
const Common_Routes_1 = require("./Common.Routes");
const Updation_Routes_1 = require("./Updation.Routes");
exports.Users = express_1.Router();
exports.Users.get("/login/", (req, res) => {
    if (req.isUnauthenticated())
        return res.render("login.html");
    return res.redirect("/");
});
// This is the Uri
// By default when Post Request is Made
// Authenticate if this is an actual user
// If not, Perform Redirection
exports.Users.post("/login/", passport_1.default.authenticate("app", { failureRedirect: "/" }), (req, res) => {
    if (req.user.Authority === "ADMIN")
        return res.redirect("/admin");
    else if (req.user.Authority === "NORMAL")
        return res.redirect("/index");
});
// Uri for Logout
exports.Users.all("/logout/", Common_Routes_1.RoutesCommon.IsAuthenticated, (req, res) => {
    req.logout();
    return res.redirect("/");
});
// Users.get("/list/", RoutesCommon.IsAdmin, async (req, res) => {
//   return RoutesCommon.NoCaching(res).render("userlist.html");
// });
// This is the Uri for Registration of a new user
exports.Users.post("/add/", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const name = String(params.name);
        if (name == null)
            return res.json({ success: false, password: null });
        if (name === "")
            return res.json({ success: false, password: null });
        const count_users = yield Model.Users.count({ where: { Name: name } });
        if (count_users !== 0)
            return res.json({ success: false, password: null });
        // Generate Random Pass Key
        const pass_key = crypto_1.randomBytes(10).toString("hex");
        const authority = "NORMAL";
        const new_user = yield Model.Users.create({
            Name: name,
            Password: pass_key,
            Authority: authority
        });
        if (!new_user)
            return res.json({ success: false, password: null });
        return res.json({ success: true, password: pass_key });
    }
    catch (error) {
        return res.json({ success: false, password: null });
    }
}));
exports.Users.post("/newpassword", Common_Routes_1.RoutesCommon.IsAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const old_pass = String(params.OldPassword);
        const new_pass = String(params.NewPassword);
        const user = yield Model.Users.findOne({ where: { id: id } });
        // Check if User Exists
        if (!user)
            return res.json({ success: false });
        // Check if Password Entered is Correct
        const match = yield user.ComparePassword(old_pass);
        if (!match)
            return res.json({ success: false });
        const [count] = yield Model.Users.update({ Password: new_pass }, { where: { id: id } });
        if (count !== 1)
            return res.json({ success: false });
        return res.json({ success: true });
    }
    catch (error) {
        return res.json({ success: false });
    }
}));
// This is Uri to access List of Non Admin Users
exports.Users.get("/", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Model.Users.findAll({
            where: { Authority: "NORMAL" }
        });
        const list = [];
        users.forEach(user => {
            const user_details = Updation_Routes_1.GetUserJson(user);
            list.push(user_details);
        });
        return res.json(list);
    }
    catch (error) {
        return res.json([]);
    }
}));
exports.Users.delete("/:id", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const count = yield Model.Users.destroy({
            where: { id: id, Authority: "NORMAL" }
        });
        if (count !== 0)
            return res.json({ success: true });
    }
    catch (error) {
    }
    return res.json({
        success: false
    });
}));
exports.Users.get("/:id", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const user = yield Model.Users.findOne({
            attributes: ["id", "Name"],
            where: { id: id, Authority: "NORMAL" }
        });
        if (!user)
            return res.json({
                success: false,
                data: { id: null, name: null }
            });
        return res.json({
            success: true,
            data: { id: user.id, name: user.Name }
        });
    }
    catch (error) {
        return res.json({
            success: false,
            data: { id: null, name: null }
        });
    }
}));
//# sourceMappingURL=Users.Routes.js.map