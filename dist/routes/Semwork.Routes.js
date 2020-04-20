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
exports.Semwork = express_1.Router();
function GetUploadJson(file) {
    if (file == null)
        return {
            id: "nullish",
            swdate: "",
            swt: "",
            swcol: "",
            swnd: "",
            swtype: ""
        };
    return {
        id: file.id,
        swdate: file.swdate,
        swt: file.swt,
        swcol: file.swcol,
        swnd: file.swnd,
        swtype: file.swtype
    };
}
exports.Semwork.post("/semwork", Common_Routes_1.RoutesCommon.IsNotAdmin, Common_Routes_1.RoutesCommon.upload.array('swcerti'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const swdate = String(params.swdate);
        const swt = String(params.swt);
        const swcol = String(params.swcol);
        const swnd = String(params.swnd);
        const swtype = String(params.swtype);
        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = Common_Routes_1.RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null) {
            yield Models.Semwork.create({
                UserID: userId,
                Location: pathToFiles,
                swdate: swdate,
                swt: swt,
                swcol: swcol,
                swnd: swnd,
                swtype: swtype,
            });
        }
        else {
            yield Models.Semwork.update({
                swdate: swdate,
                swt: swt,
                swcol: swcol,
                swnd: swnd,
                swtype: swtype,
            }, { where: { id: id, UserID: userId } });
            if (pathToFiles != null)
                yield Models.Semwork.update({
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
exports.Semwork.get("/semwork", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('semwork.ejs', GetUploadJson(null));
});
exports.Semwork.get("/semwork/files", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const files = yield Models.Semwork.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Semwork.get("/semwork/files/:userId", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = yield Models.Semwork.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Semwork.get("/semwork/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = yield Models.Semwork.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('semwork.ejs', GetUploadJson(file));
}));
exports.Semwork.get("/semwork/file-viewer/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Semwork.findOne({
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
exports.Semwork.get("/admin/semwork/file-viewer/:id", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = yield Models.Semwork.findOne({
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
exports.Semwork.delete("/semwork/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Semwork.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) {
        return res.json({ success: false });
    }
}));
//# sourceMappingURL=Semwork.Routes.js.map