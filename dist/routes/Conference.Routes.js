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
exports.Conference = express_1.Router();
function GetUploadJson(file) {
    if (file == null)
        return {
            id: "nullish",
            ci: "",
            cma: "",
            cissn: "",
            cdate: "",
            ct: "",
            crpt: "",
            cdui: ""
        };
    return {
        id: file.id,
        ci: file.ci,
        cma: file.cma,
        cissn: file.cissn,
        cdate: file.cdate,
        ct: file.ct,
        crpt: file.crpt,
        cdui: file.cdui
    };
}
exports.Conference.post("/conference", Common_Routes_1.RoutesCommon.IsNotAdmin, Common_Routes_1.RoutesCommon.upload.array('ccerti'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const ci = String(params.ci);
        const cma = String(params.cma);
        const cissn = String(params.cissn);
        const cdate = String(params.cdate);
        const ct = String(params.ct);
        const crpt = String(params.crpt);
        const cdui = String(params.cdui);
        let pathToFiles = null;
        // ID Nullish is Used for First time Upload
        if (files != null && files.length !== 0)
            pathToFiles = Common_Routes_1.RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null) {
            yield Models.Conference.create({
                UserID: userId,
                Location: pathToFiles,
                ci: ci,
                cma: cma,
                cissn: cissn,
                cdate: cdate,
                ct: ct,
                crpt: crpt,
                cdui: cdui,
            });
        }
        else {
            yield Models.Conference.update({
                ci: ci,
                cma: cma,
                cissn: cissn,
                cdate: cdate,
                ct: ct,
                crpt: crpt,
                cdui: cdui,
            }, { where: { id: id, UserID: userId } });
            if (pathToFiles != null)
                yield Models.Conference.update({
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
exports.Conference.get("/conference", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('conference.ejs', GetUploadJson(null));
});
exports.Conference.get("/conference/files", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const files = yield Models.Conference.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Conference.get("/conference/files/:userId", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = yield Models.Conference.findAll({
        where: { UserID: userId }
    });
    const files_json = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
}));
exports.Conference.get("/conference/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const params = Common_Routes_1.RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = yield Models.Conference.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('conference.ejs', GetUploadJson(file));
}));
exports.Conference.get("/conference/file-viewer/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Conference.findOne({
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
exports.Conference.get("/admin/conference/file-viewer/:id", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = yield Models.Conference.findOne({
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
exports.Conference.delete("/conference/:id", Common_Routes_1.RoutesCommon.IsNotAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = yield Models.Conference.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) {
        return res.json({ success: false });
    }
}));
//# sourceMappingURL=Conference.Routes.js.map