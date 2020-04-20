"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("./config/server"));
const app_1 = require("./app");
app_1.app.listen(config.Server.Port, config.Server.Name, () => {
    console.log("Default Login Screen", config.Server.Name + ':' + config.Server.Port);
});
process.on("SIGINT", function () {
    console.log("App Shutting Down");
});
//# sourceMappingURL=server.js.map