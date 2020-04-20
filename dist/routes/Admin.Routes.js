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
const Common_Routes_1 = require("./Common.Routes");
const express_1 = require("express");
const Model = __importStar(require("../Models/Models"));
const Updation_Routes_1 = require("./Updation.Routes");
exports.Admin = express_1.Router();
exports.Admin.get("/", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => {
    res.render("admin.ejs");
});
exports.Admin.get("/createuser", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => {
    res.render("createuser.ejs");
});
exports.Admin.get("/newpassword", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => {
    return res.render("adminpassword.ejs");
});
exports.Admin.get("/report", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => {
    return res.render("report.ejs");
});
function ExtractInformation(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let mrg = [];
        let conference = [];
        let journal = [];
        let semwork = [];
        let fdp = [];
        let sttp = [];
        let progatt = [];
        const user_list = {};
        const params = Common_Routes_1.RoutesCommon.GetParameters(req);
        if (params != null) {
            const ruser = Common_Routes_1.RoutesCommon.ToArray(params.ruser).map(Number);
            const dept = String(params.rdept);
            const ri = String(params.ri);
            const rtype = String(params.rcat);
            const rspon = String(params.rspon);
            const ryear = String(params.ryear);
            const users = yield Model.Users.findAll({
                where: {
                    Authority: "NORMAL",
                    dept: {
                        $ilike: "%" + dept + "%"
                    }
                }
            });
            let userIds = users.map((val) => { return val.id; }).map(Number);
            if (ruser != null && ruser.length !== 0) {
                userIds.push(...ruser);
                userIds = userIds.filter(function (itm, i) {
                    return userIds.lastIndexOf(itm) == i && userIds.indexOf(itm) != i;
                });
            }
            if (users.length !== 0) {
                if (rtype === "fdp" || rtype === "") {
                    fdp = yield Model.Fdp.findAll({
                        where: {
                            UserID: userIds,
                            fdptype: {
                                $ilike: "%" + rspon + "%"
                            },
                            fdpdate: {
                                $ilike: "%/" + ryear + "%"
                            },
                        }
                    });
                }
                if (rtype === "sttp" || rtype === "") {
                    sttp = yield Model.Sttp.findAll({
                        where: {
                            UserID: userIds,
                            sttptype: {
                                $ilike: "%" + rspon + "%"
                            },
                            sttpdate: {
                                $ilike: "%/" + ryear + "%"
                            },
                        }
                    });
                }
                if (rtype === "progatt" || rtype === "") {
                    progatt = yield Model.Progatt.findAll({
                        where: {
                            UserID: userIds,
                            patspon: {
                                $ilike: "%" + rspon + "%"
                            },
                            patdate: {
                                $ilike: "%/" + ryear + "%"
                            },
                        }
                    });
                }
                if (rtype === "conference" || rtype === "") {
                    conference = yield Model.Conference.findAll({
                        where: {
                            UserID: userIds,
                            ci: {
                                $ilike: "%" + ri + "%"
                            },
                            cdate: {
                                $ilike: "%/" + ryear + "%"
                            },
                        }
                    });
                }
                if (rtype === "journal" || rtype === "") {
                    journal = yield Model.Journal.findAll({
                        where: {
                            UserID: userIds,
                            ji: {
                                $ilike: "%" + ri + "%"
                            },
                            jdate: {
                                $ilike: "%/" + ryear + "%"
                            },
                        }
                    });
                }
                if (rtype === "semwork" || rtype === "") {
                    semwork = yield Model.Semwork.findAll({
                        where: {
                            UserID: userIds,
                            swdate: {
                                $ilike: "%/" + ryear + "%"
                            },
                        }
                    });
                }
                if (rtype === "mrg" || rtype === "") {
                    mrg = yield Model.Mrg.findAll({
                        where: {
                            UserID: userIds,
                            mrgya: ryear
                        }
                    });
                }
                const users = yield Model.Users.findAll({
                    where: { Authority: "NORMAL", id: userIds }
                });
                users.forEach(user => {
                    const user_details = Updation_Routes_1.GetUserJson(user);
                    user_list[user_details.data.id] = user_details;
                });
            }
        }
        return { mrg, conference, journal, semwork, fdp, sttp, progatt, user_list };
    });
}
function ExtractPaths(input) {
    const value = [];
    input.forEach((element) => {
        value.push(...element.FileLocationsAsArray());
    });
    return value;
}
exports.Admin.post("/report/files", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mrg, conference, journal, semwork, fdp, sttp, progatt, user_list } = yield ExtractInformation(req);
    const locations = [];
    locations.push(...ExtractPaths(mrg));
    locations.push(...ExtractPaths(conference));
    locations.push(...ExtractPaths(journal));
    locations.push(...ExtractPaths(semwork));
    locations.push(...ExtractPaths(fdp));
    locations.push(...ExtractPaths(sttp));
    locations.push(...ExtractPaths(progatt));
    if (locations.length === 0)
        return res.status(404);
    yield Common_Routes_1.RoutesCommon.ZipFileGenerator(res, locations);
}));
exports.Admin.post("/report", Common_Routes_1.RoutesCommon.IsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mrg, conference, journal, semwork, fdp, sttp, progatt, user_list } = yield ExtractInformation(req);
    ;
    // Remove Location Parameter as it is local to our computer
    journal.forEach(value => delete value.dataValues.Location);
    fdp.forEach(value => delete value.dataValues.Location);
    sttp.forEach(value => delete value.dataValues.Location);
    progatt.forEach(value => delete value.dataValues.Location);
    conference.forEach(value => delete value.dataValues.Location);
    semwork.forEach(value => delete value.dataValues.Location);
    mrg.forEach(value => delete value.dataValues.Location);
    const json = {
        "mrg": mrg,
        "conference": conference,
        "journal": journal,
        "semwork": semwork,
        "fdp": fdp,
        "sttp": sttp,
        "progatt": progatt,
        "users": user_list
    };
    return res.json(json);
}));
//# sourceMappingURL=Admin.Routes.js.map