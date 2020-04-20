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
const crypto_1 = require("crypto");
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const path_1 = require("path");
const multer = __importStar(require("multer"));
const Path = __importStar(require("path"));
const process = __importStar(require("process"));
const Archiver = __importStar(require("archiver"));
var RoutesCommon;
(function (RoutesCommon) {
    function EmptyUndef(key) {
        if (key == null || key === "undefined")
            return "";
        return key;
    }
    RoutesCommon.EmptyUndef = EmptyUndef;
    const storage = multer.diskStorage({
        destination: (request, file, callback) => __awaiter(this, void 0, void 0, function* () {
            const dir = Path.resolve(String(process.env.INIT_CWD), 'uploads');
            yield RoutesCommon.CreateDirectoryIfNotExistsAsync(dir);
            callback(null, dir);
        }),
        filename: (request, file, callback) => {
            let fileName = "";
            while (true) {
                const name = crypto_1.randomBytes(12).toString("hex");
                const ext = path_1.extname(file.originalname);
                fileName = name + ext;
                if (!fs.existsSync(fileName))
                    break;
            }
            callback(null, fileName);
        }
    });
    RoutesCommon.upload = multer.default({
        storage: storage,
        // Set File Size Limit of 25 MB
        limits: { fileSize: 1024 * 1024 * 25 }
    });
    function CreateDirectoryIfNotExistsAsync(location) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.promises.access(location, fs.constants.R_OK).then(() => {
                    resolve();
                    // Do Nothing if Exists
                }).catch(() => {
                    fs_1.promises.mkdir(location)
                        .then(() => { resolve(); })
                        .catch((err) => { reject(err); });
                });
            });
        });
    }
    RoutesCommon.CreateDirectoryIfNotExistsAsync = CreateDirectoryIfNotExistsAsync;
    function NoCaching(res) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        return res;
    }
    RoutesCommon.NoCaching = NoCaching;
    function RemoveFileAsync(location) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.unlink(location);
        });
    }
    RoutesCommon.RemoveFileAsync = RemoveFileAsync;
    function FilesToPathString(Files) {
        const paths = [];
        Files.forEach(file => {
            paths.push(file.path);
        });
        return JSON.stringify(paths);
    }
    RoutesCommon.FilesToPathString = FilesToPathString;
    function RemoveFilesAsync(locations) {
        const removalAsyncs = [];
        for (const location of locations) {
            removalAsyncs.push(RemoveFileAsync(location));
        }
        return Promise.all(removalAsyncs);
    }
    RoutesCommon.RemoveFilesAsync = RemoveFilesAsync;
    function ListOfFiles(location) {
        return new Promise((resolve, reject) => {
            fs.readdir(location, (err, files) => {
                if (err)
                    reject(err);
                else {
                    // Convert to Absolute paths
                    files = files.map(file => Path.resolve(location, file));
                    resolve(files);
                }
            });
        });
    }
    RoutesCommon.ListOfFiles = ListOfFiles;
    // Downloads Files from Given URL
    function ZipFileGenerator(res, filesToDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            const archive = Archiver.create("zip");
            archive.on('error', function (err) {
                archive.abort(); //not always useful but might save trouble
                console.log(err);
                throw err;
            });
            //set the archive name
            res.attachment('details.zip').type('zip');
            //this is the streaming magic
            archive.pipe(res);
            filesToDownload.forEach(file => {
                archive.file(file, { name: Path.basename(file) });
            });
            yield archive.finalize();
        });
    }
    RoutesCommon.ZipFileGenerator = ZipFileGenerator;
    // Check if Authentication is Correct
    function IsAuthenticated(req, res, next) {
        if (req.isAuthenticated())
            return next();
        return res.redirect("/");
    }
    RoutesCommon.IsAuthenticated = IsAuthenticated;
    // Check if User is Admin
    function IsAdmin(req, res, next) {
        if (req.isAuthenticated() && req.user.Authority === "ADMIN")
            return next();
        return res.redirect("/");
    }
    RoutesCommon.IsAdmin = IsAdmin;
    // Check if User is Not Admin
    function IsNotAdmin(req, res, next) {
        if (req.isAuthenticated() && req.user.Authority !== "ADMIN")
            return next();
        return res.redirect("/");
    }
    RoutesCommon.IsNotAdmin = IsNotAdmin;
    function IsNotEmptyAny(object) {
        return object && Object.keys(object).length !== 0;
    }
    function GetParameters(req) {
        if (IsNotEmptyAny(req.body))
            return req.body;
        if (IsNotEmptyAny(req.query))
            return req.query;
        if (IsNotEmptyAny(req.params))
            return req.params;
        return null;
    }
    RoutesCommon.GetParameters = GetParameters;
    function ToArrayFromJsonString(data) {
        if (!data.includes("["))
            data = "[\"" + data + "\"]";
        return JSON.parse(data);
    }
    RoutesCommon.ToArrayFromJsonString = ToArrayFromJsonString;
    // Convert Given Data as Array of Type
    function ToArray(data) {
        // If Null, Return Empty Array
        if (data == null || data == "") {
            return [];
        }
        // If it's already an array perform type conversion
        else if (Array.isArray(data)) {
            return data.map(String);
        }
        else {
            // If it's Element, send as first value
            const value = String(data);
            return [value];
        }
    }
    RoutesCommon.ToArray = ToArray;
})(RoutesCommon = exports.RoutesCommon || (exports.RoutesCommon = {}));
//# sourceMappingURL=Common.Routes.js.map