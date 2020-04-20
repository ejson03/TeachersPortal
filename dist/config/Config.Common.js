"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
function GetIP() {
    const interfaces = os_1.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal)
                return alias.address;
        }
    }
    return "localhost";
}
exports.GetIP = GetIP;
//# sourceMappingURL=Config.Common.js.map