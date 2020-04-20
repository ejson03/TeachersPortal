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
exports.Journal = express_1.Router();
function GetUploadJson(file) {
    if (file == null)
        return {
            id: "nullish",
            jdate: "",
            jt: "",
            jrpt: "",
            jissn: "",
            ji: "",
            jma: "",
            jdui: ""
        };
    return {
        id: file.id,
        jdate: file.jdate,
        jt: file.jt,
        jrpt: file.jrpt,
        jissn: file.jissn,
        ji: file.ji,
        jma: file.jma,
        jdui: file.jdui
    };
}
exports.Journal.post("/journal", Common_Routes_1.RoutesCommon.IsNotAdmin, Common_Routes_1.RoutesCommon.upload.array('jcerti'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const jdate = String(params.jdate);
        const jt = String(params.jt);
        const jrpt = String(params.jrpt);
        const jissn = String(params.jissn);
        const ji = String(params.ji);
        const jma = String(params.jma);
        const jdui = String(params.jdui);
        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = Common_Routes_1.RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null) {
            yield Models.Journal.create({
                UserID: userId,
                Location: pathToFiles,
                jdate: jdate,
                jt: jt,
                jrpt: jrpt,
                jissn: jissn,
                ji: ji,
                jma: jma,
                jdui: jdui,
            });
        }
        else {
            yield Models.Journal.update({
                jdate: jdate,
                jt: jt,
                jrpt: jrpt,
                jissn: jissn,
                ji: ji,
                jma: jma,
                jdui: jdui,
            }, { where: { id: id, UserID: userId } });
            if (pathToFiles != null)
                yield Models.Journal.update({
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
exports.Journal.get("/journal", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('journal.ejs', GetUploadJson(null));
});
exports.Journal.get("/journal/files", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const files = yield Models.Journal.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Journal.get("/journal/files/:userId", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = yield Models.Journal.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Journal.get("/journal/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = yield Models.Journal.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('journal.ejs', GetUploadJson(file));
}));
exports.Journal.get("/journal/file-viewer/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Journal.findOne({
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
exports.Journal.get("/admin/journal/file-viewer/:id", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = yield Models.Journal.findOne({
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
exports.Journal.delete("/journal/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Journal.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) {
        return res.json({ success: false });
    }
}));
//# sourceMappingURL=Journal.Routes.js.map