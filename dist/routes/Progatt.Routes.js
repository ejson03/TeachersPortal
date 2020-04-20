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
// Generated using generate.py
const Common_Routes_1 = require("./Common.Routes");
const express_1 = require("express");
const Models = __importStar(require("../Models/Models"));
exports.Progatt = express_1.Router();
function GetUploadJson(file) {
    if (file == null)
        return {
            id: "nullish",
            patdate: "",
            patype: "",
            pat: "",
            patcol: "",
            patspon: "",
            patnd: ""
        };
    return {
        id: file.id,
        patdate: file.patdate,
        patype: file.patype,
        pat: file.pat,
        patcol: file.patcol,
        patspon: file.patspon,
        patnd: file.patnd
    };
}
exports.Progatt.post("/progatt", Common_Routes_1.RoutesCommon.IsNotAdmin, Common_Routes_1.RoutesCommon.upload.array('patcerti'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user.id);
        const id = String(params.id);
        const files = req.files;
        // ID Nullish is Used for First time Upload
        if (id === "nullish" && (files == null || files.length === 0))
            return res.status(422).send("Upload Failed");
        const patdate = String(params.patdate);
        const patype = String(params.patype);
        const pat = String(params.pat);
        const patcol = String(params.patcol);
        const patspon = String(params.patspon);
        const patnd = String(params.patnd);
        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = Common_Routes_1.RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null) {
            yield Models.Progatt.create({
                UserID: userId,
                Location: pathToFiles,
                patdate: patdate,
                patype: patype,
                pat: pat,
                patcol: patcol,
                patspon: patspon,
                patnd: patnd,
            });
        }
        else {
            yield Models.Progatt.update({
                patdate: patdate,
                patype: patype,
                pat: pat,
                patcol: patcol,
                patspon: patspon,
                patnd: patnd,
            }, { where: { id: id, UserID: userId } });
            if (pathToFiles != null)
                yield Models.Progatt.update({
                    Location: pathToFiles
                }, { where: { id: id, UserID: userId } });
        }
        return res.status(200).redirect('/');
    }
    catch (error) {
        console.error(error);
        return res.status(422).send("Upload Failed");
    }
}));
exports.Progatt.get("/progatt", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('progatt.ejs', GetUploadJson(null));
});
exports.Progatt.get("/progatt/files", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const files = yield Models.Progatt.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Progatt.get("/progatt/files/:userId", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = yield Models.Progatt.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Progatt.get("/progatt/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = yield Models.Progatt.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('progatt.ejs', GetUploadJson(file));
}));
exports.Progatt.get("/progatt/file-viewer/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Progatt.findOne({
            where: { UserID: userId, id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload = file.FileLocationsAsArray();
        if (filesToDownload.length === 0)
            return res.sendStatus(404);
        if (filesToDownload.length === 1)
            return res.download(filesToDownload[0]);
        yield Common_Routes_1.RoutesCommon.ZipFileGenerator(res, filesToDownload);
    }
    catch (err) {
        console.log(err);
    }
    return res.status(404);
}));
exports.Progatt.get("/admin/progatt/file-viewer/:id", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = yield Models.Progatt.findOne({
            where: { id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload = file.FileLocationsAsArray();
        if (filesToDownload.length === 0)
            return res.sendStatus(404);
        if (filesToDownload.length === 1)
            return res.download(filesToDownload[0]);
        yield Common_Routes_1.RoutesCommon.ZipFileGenerator(res, filesToDownload);
    }
    catch (err) {
        console.log(err);
    }
    return res.status(404);
}));
exports.Progatt.delete("/progatt/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Progatt.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) {
        return res.json({ success: false });
    }
}));
//# sourceMappingURL=Progatt.Routes.js.map