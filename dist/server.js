"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.app.listen(8000, () => {
    console.log("Server is started......");
});
process.on("SIGINT", function () {
    console.log("App Shutting Down");
});
//# sourceMappingURL=server.js.map