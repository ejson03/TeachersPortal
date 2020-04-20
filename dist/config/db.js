"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = {
    Host: String(process.env.DATABASE_HOST || "localhost"),
    Port: Number(process.env.DATABSE_PORT || 5432),
    UserName: String(process.env.DATABASE_USER_NAME || "postgres"),
    Password: String(process.env.DATABASE_PASSWORD || "postgres"),
    DatabaseName: String(process.env.DATABASE_NAME || "teacherportal"),
    SSL: Boolean(String(process.env.DATABSE_SSL) === "true" || false)
};
console.log(exports.DB);
//# sourceMappingURL=db.js.map