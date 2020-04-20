"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Generated using generator.py
const sequelize_typescript_1 = require("sequelize-typescript");
const fs_1 = require("fs");
const Users_Model_1 = require("./Users.Model");
let Sttp = class Sttp extends sequelize_typescript_1.Model {
    static CheckFileExistence(File) {
        const locations = JSON.parse(File.Location);
        locations.forEach(location => {
            if (!fs_1.existsSync(location))
                throw "File Not Exists at " + File.Location;
        });
    }
    FileLocationsAsArray() {
        return JSON.parse(this.Location);
    }
};
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Sttp.prototype, "Location", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => Users_Model_1.Users),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sttp.prototype, "UserID", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Sttp.prototype, "sttpdate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Sttp.prototype, "sttpt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Sttp.prototype, "sttpcol", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Sttp.prototype, "sttpnw", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Sttp.prototype, "sttptype", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Sttp]),
    __metadata("design:returntype", void 0)
], Sttp, "CheckFileExistence", null);
Sttp = __decorate([
    sequelize_typescript_1.Table
], Sttp);
exports.Sttp = Sttp;
//# sourceMappingURL=Sttp.Models.js.map