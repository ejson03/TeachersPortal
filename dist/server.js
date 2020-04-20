"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 3000;
app_1.app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});
process.on("SIGINT", function () {
    console.log("App Shutting Down");
});
//# sourceMappingURL=server.js.map