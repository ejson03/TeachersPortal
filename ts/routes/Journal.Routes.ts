
// Generated using generate.py
import { RoutesCommon } from "./Common.Routes";
import { Router } from "express";
import * as Models from "../Models/Models";
export const Journal = Router();

function GetUploadJson(file: any) {
	if (file==null)
		return {
			id:"nullish",
			jdate: "",
			jt: "",
			jrpt: "",
			jissn: "",
			ji: "",
			jma: "",
			jdui: ""
		};
	return {
			id:file.id,
			jdate: file.jdate,
			jt: file.jt,
			jrpt: file.jrpt,
			jissn: file.jissn,
			ji: file.ji,
			jma: file.jma,
			jdui: file.jdui
		};
}


Journal.post("/journal", RoutesCommon.IsNotAdmin,
RoutesCommon.upload.array('jcerti'), async (req, res) => {
    try {
        const params = RoutesCommon.GetParameters(req);
        if (params == null)
            return res.status(422).send("Upload Failed");
        const userId = Number(req.user!.id);
        const id = String(params.id);
        const files = req.files as any[];
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
            pathToFiles = RoutesCommon.FilesToPathString(files);
        if (id === "nullish" && pathToFiles != null){
            await Models.Journal.create({
                UserID: userId,
                Location: pathToFiles,
                jdate:jdate,
                jt:jt,
                jrpt:jrpt,
                jissn:jissn,
                ji:ji,
                jma:jma,
                jdui:jdui,
            });
        }
        else{
            await Models.Journal.update({
                    jdate:jdate,
                    jt:jt,
                    jrpt:jrpt,
                    jissn:jissn,
                    ji:ji,
                    jma:jma,
                    jdui:jdui,
                },
                { where: { id: id, UserID: userId } }
            );
            if (pathToFiles != null)
                    await Models.Journal.update({
                        Location: pathToFiles
                    },
                    { where: { id: id, UserID: userId } }
                    );
            }
    return res.status(200).redirect('/');
}
catch (error) {
    console.error(error);
    return res.status(422).send("Upload Failed");
}
});
Journal.get("/journal", RoutesCommon.IsNotAdmin, (req, res) => {
    return res.render('journal.ejs', GetUploadJson(null));
});
Journal.get("/journal/files", RoutesCommon.IsNotAdmin, async (req, res) => {
    const userId = Number(req.user!.id);
    const files = await Models.Journal.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Journal.get("/journal/files/:userId", RoutesCommon.IsAdmin, async (req, res) => {
    const params = RoutesCommon.GetParameters(req);
    if (params == null)
        return res.json([]);
    const userId = params.userId;
    const files = await Models.Journal.findAll({
        where: { UserID: userId }
    });
    const files_json: any[] = [];
    files.forEach(file => {
        files_json.push(GetUploadJson(file));
    });
    return res.json(files_json);
});
Journal.get("/journal/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    const userId = Number(req.user!.id);
    const params = RoutesCommon.GetParameters(req);
    const id = params.id;
    const file = await Models.Journal.findOne({
        where: { UserID: userId, id: id }
    });
    return res.render('journal.ejs', GetUploadJson(file));
});
Journal.get("/journal/file-viewer/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Journal.findOne({
            where: { UserID: userId, id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload: string[] = file.FileLocationsAsArray();

        if (filesToDownload.length === 0)
            return res.sendStatus(404);

        if (filesToDownload.length === 1)
            return res.download(filesToDownload[0]);

        await RoutesCommon.ZipFileGenerator(res, filesToDownload);
    }
    catch (err) { console.log(err); }
    return res.status(404);
});
Journal.get("/admin/journal/file-viewer/:id", RoutesCommon.IsAdmin, async (req, res) => {
    try {
        const params = RoutesCommon.GetParameters(req);
        const id = Number(params.id);
        const file = await Models.Journal.findOne({
            where: { id: id }
        });
        if (!file)
            return res.sendStatus(404);
        const filesToDownload: string[] = file.FileLocationsAsArray();

        if (filesToDownload.length === 0)
            return res.sendStatus(404);

        if (filesToDownload.length === 1)
            return res.download(filesToDownload[0]);

        await RoutesCommon.ZipFileGenerator(res, filesToDownload);
    }
    catch (err) { console.log(err); }
    return res.status(404);
});
Journal.delete("/journal/:id", RoutesCommon.IsNotAdmin, async (req, res) => {
    try {
        const userId = Number(req.user!.id);
        const params = RoutesCommon.GetParameters(req);
        const id = params.id;
        const file = await Models.Journal.destroy({
            where: { UserID: userId, id: id }
        });
        const success = (file !== 0);
        return res.json({ success: success });
    }
    catch (err) { 
        return res.json({ success: false });
    }
});
