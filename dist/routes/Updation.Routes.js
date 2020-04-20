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
const express_1 = require("express");
const Common_Routes_1 = require("./Common.Routes");
const Models = __importStar(require("../Models/Models"));
exports.Updation = express_1.Router();
exports.Updation.get("/newpassword", Common_Routes_1.RoutesCommon.IsAuthenticated, (req, res) => {
    return res.render("changepassword.html");
});
exports.Updation.get("/upload", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render("documents.ejs");
});
function EmptyUndef(key) {
    if (key == null || key === "undefined")
        return "";
    return key;
}
function GetUserJson(user) {
    return {
        data: {
            id: user.id,
            Name: user.Name,
            title: EmptyUndef(user.title),
            firstname: EmptyUndef(user.firstname), middlename: EmptyUndef(user.middlename), lastname: EmptyUndef(user.lastname),
            fname: EmptyUndef(user.fname), mname: EmptyUndef(user.mname),
            gender: EmptyUndef(user.gender), bdate: EmptyUndef(user.bdate), address: EmptyUndef(user.address), phone: EmptyUndef(user.phone), email: EmptyUndef(user.email),
            dept: EmptyUndef(user.dept), aos: EmptyUndef(user.aos),
            upgyear: EmptyUndef(user.ugpyear), uggrade: EmptyUndef(user.uggrade), ugu: EmptyUndef(user.ugu), ugi: EmptyUndef(user.ugi), ugr: EmptyUndef(user.ugr),
            pgyear: EmptyUndef(user.pgyear), pggrade: EmptyUndef(user.pggrade), pgu: EmptyUndef(user.pgu), pgi: EmptyUndef(user.pgi), pgr: EmptyUndef(user.pgr),
            spyear: EmptyUndef(user.spyear), spgrade: EmptyUndef(user.spgrade), spu: EmptyUndef(user.spu), spi: EmptyUndef(user.spi), spr: EmptyUndef(user.spr),
            tduration: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.tduration)), tinstitute: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.tinstitute)), tpost: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.tpost)),
            iduration: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.iduration)), iinstitute: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.iinstitute)), ipost: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.ipost)),
            oduration: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.oduration)), oinstitute: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.oinstitute)), opost: Common_Routes_1.RoutesCommon.ToArrayFromJsonString(EmptyUndef(user.opost))
        }
    };
}
exports.GetUserJson = GetUserJson;
function GetUserDetails(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Models.Users.findOne({
            where: { id: userId }
        });
        if (user == null)
            return {};
        return GetUserJson(user);
    });
}
exports.GetUserDetails = GetUserDetails;
exports.Updation.get("/updated", Common_Routes_1.RoutesCommon.IsAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const details = yield GetUserDetails(userId);
    return res.render("update.ejs", details);
}));
exports.Updation.get("/index", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const details = yield GetUserDetails(userId);
    return res.render("index.ejs", details);
}));
exports.Updation.get("/details", Common_Routes_1.RoutesCommon.IsAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const details = yield GetUserDetails(userId);
    return res.json(details);
}));
exports.Updation.get("/details/:id", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    if (params == null)
        return res.status(404);
    const userId = Number(params.id);
    const details = yield GetUserDetails(userId);
    return res.json(details);
}));
exports.Updation.get("/profileupdate", Common_Routes_1.RoutesCommon.IsAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const file = yield Models.Users.findOne({
            where: { id: userId }
        });
        if (!file)
            return res.redirect("/images/doraemon.png");
        const image = file.ImagePath;
        if (image === "")
            return res.redirect("/images/doraemon.png");
        return res.download(image);
    }
    catch (err) {
        console.log(err);
    }
    return res.redirect("/images/doraemon.png");
}));
exports.Updation.post("/updated", Common_Routes_1.RoutesCommon.IsAuthenticated, Common_Routes_1.RoutesCommon.upload.single('profile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    if (params == null)
        return res.status(422).send("Upload Failed");
    const title = String(params.title);
    const firstname = String(params.firstname);
    const middlename = String(params.middlename);
    const lastname = String(params.lastname);
    const fname = String(params.fname);
    const mname = String(params.mname);
    const gender = String(params.gender);
    const bdate = String(params.bdate);
    const address = String(params.address);
    const phone = String(params.phone);
    const email = String(params.email);
    const dept = String(params.dept);
    const aos = String(params.aos);
    const upgyear = String(params.upgyear);
    const uggrade = String(params.uggrade);
    const ugu = String(params.ugu);
    const ugi = String(params.ugi);
    const ugr = String(params.ugr);
    const pgyear = String(params.pgyear);
    const pggrade = String(params.pggrade);
    const pgu = String(params.pgu);
    const pgi = String(params.pgi);
    const pgr = String(params.pgr);
    const spyear = String(params.spyear);
    const spgrade = String(params.spgrade);
    const spu = String(params.spu);
    const spi = String(params.spi);
    const spr = String(params.spr);
    const tduration = Common_Routes_1.RoutesCommon.ToArray(params.tduration);
    const tinstitute = Common_Routes_1.RoutesCommon.ToArray(params.tinstitute);
    const tpost = Common_Routes_1.RoutesCommon.ToArray(params.tpost);
    const iduration = Common_Routes_1.RoutesCommon.ToArray(params.iduration);
    const iinstitute = Common_Routes_1.RoutesCommon.ToArray(params.iinstitute);
    const ipost = Common_Routes_1.RoutesCommon.ToArray(params.ipost);
    const oduration = Common_Routes_1.RoutesCommon.ToArray(params.oduration);
    const oinstitute = Common_Routes_1.RoutesCommon.ToArray(params.oinstitute);
    const opost = Common_Routes_1.RoutesCommon.ToArray(params.opost);
    const userId = Number(req.user.id);
    yield Models.Users.update({
        title: title,
        firstname: firstname, middlename: middlename, lastname: lastname,
        fname: fname, mname: mname,
        dept: dept, aos: aos,
        gender: gender, bdate: bdate, address: address, phone: phone, email: email,
        ugpyear: upgyear, uggrade: uggrade, ugu: ugu, ugi: ugi, ugr: ugr,
        pgyear: pgyear, pggrade: pggrade, pgu: pgu, pgi: pgi, pgr: pgr,
        spyear: spyear, spgrade: spgrade, spu: spu, spi: spi, spr: spr,
        tduration: JSON.stringify(tduration), tinstitute: JSON.stringify(tinstitute), tpost: JSON.stringify(tpost),
        iduration: JSON.stringify(iduration), iinstitute: JSON.stringify(iinstitute), ipost: JSON.stringify(ipost),
        oduration: JSON.stringify(oduration), oinstitute: JSON.stringify(oinstitute), opost: JSON.stringify(opost)
    }, { where: { id: userId } });
    if (req.file != null) {
        const imagePath = req.file.path;
        yield Models.Users.update({
            ImagePath: imagePath
        }, { where: { id: userId } });
    }
    return res.redirect("/");
}));
exports.Updation.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Authority === "ADMIN")
            return res.redirect("/admin");
        if (req.user.Authority === "NORMAL")
            return res.redirect("/index");
    }
    console.log("###################################");
    return res.render("login.html");
});
//# sourceMappingURL=Updation.Routes.js.map