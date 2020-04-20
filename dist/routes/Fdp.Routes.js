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
exports.Fdp = express_1.Router();
function GetUploadJson(file) {
    if (file == null)
        return {
            id: "nullish",
            fdpdate: "",
            fdpt: "",
            fdpcol: "",
            fdpnd: "",
            fdptype: ""
        };
    return {
        id: file.id,
        fdpdate: file.fdpdate,
        fdpt: file.fdpt,
        fdpcol: file.fdpcol,
        fdpnd: file.fdpnd,
        fdptype: file.fdptype
    };
}
exports.Fdp.post("/fdp", Common_Routes_1.RoutesCommon.IsNotAdmin, Common_Routes_1.RoutesCommon.upload.array('fdpcerti'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const fdpdate = String(params.fdpdate);
        const fdpt = String(params.fdpt);
        const fdpcol = String(params.fdpcol);
        const fdpnd = String(params.fdpnd);
        const fdptype = String(params.fdptype);
        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = Common_Routes_1.RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null) {
            yield Models.Fdp.create({
                UserID: userId,
                Location: pathToFiles,
                fdpdate: fdpdate,
                fdpt: fdpt,
                fdpcol: fdpcol,
                fdpnd: fdpnd,
                fdptype: fdptype,
            });
        }
        else {
            yield Models.Fdp.update({
                fdpdate: fdpdate,
                fdpt: fdpt,
                fdpcol: fdpcol,
                fdpnd: fdpnd,
                fdptype: fdptype,
            }, { where: { id: id, UserID: userId } });
            if (pathToFiles != null)
                yield Models.Fdp.update({
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
exports.Fdp.get("/fdp", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('fdp.ejs', GetUploadJson(null));
});
exports.Fdp.get("/fdp/files", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const files = yield Models.Fdp.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Fdp.get("/fdp/files/:userId", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = yield Models.Fdp.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Fdp.get("/fdp/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = yield Models.Fdp.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('fdp.ejs', GetUploadJson(file));
}));
exports.Fdp.get("/fdp/file-viewer/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Fdp.findOne({
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
exports.Fdp.get("/admin/fdp/file-viewer/:id", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = yield Models.Fdp.findOne({
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
exports.Fdp.delete("/fdp/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Fdp.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) {
        return res.json({ success: false });
    }
}));
//# sourceMappingURL=Fdp.Routes.js.map