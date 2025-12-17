"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PastSchool = exports.BioUserSchoolInfo = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BioUserSchoolInfoSchema = new mongoose_1.Schema({
    admittedAt: { type: Date },
    bioUserDisplayName: { type: String },
    bioUserPicture: { type: String },
    bioUserUsername: { type: String },
    bioUserId: { type: String },
    createdAt: { type: Date, default: Date.now },
    graduatedAt: { type: Date },
    inSchool: { type: Boolean },
    hasPastSchool: { type: Boolean },
    isAdvanced: { type: Boolean },
    isSchoolVerified: { type: Boolean },
    isVerified: { type: Boolean },
    schoolLevel: { type: Object },
    schoolLevelName: { type: Object },
    schoolArea: { type: String },
    schoolArm: { type: String },
    schoolCertificate: { type: String },
    schoolClass: { type: String },
    schoolClassLevel: { type: String },
    schoolContinent: { type: String },
    schoolCountry: { type: String },
    schoolCountryFlag: { type: String },
    schoolCountrySymbol: { type: String },
    schoolDepartment: { type: String },
    schoolDepartmentId: { type: String },
    schoolDepartmentUsername: { type: String },
    schoolFaculty: { type: String },
    schoolFacultyId: { type: String },
    schoolFacultyUsername: { type: String },
    schoolId: { type: String },
    schoolLogo: { type: String },
    schoolName: { type: String },
    schoolPicture: { type: String },
    schoolPlaceId: { type: String },
    schoolState: { type: String },
    schoolUsername: { type: String },
    schoolYear: { type: String },
}, {
    timestamps: true,
});
exports.BioUserSchoolInfo = mongoose_1.default.model('BioUserSchoolInfo', BioUserSchoolInfoSchema);
const PastSchoolSchema = new mongoose_1.Schema({
    admittedAt: { type: Date },
    bioUserDisplayName: { type: String },
    bioUserPicture: { type: String },
    bioUserUsername: { type: String },
    bioUserId: { type: String },
    createdAt: { type: Date, default: Date.now },
    graduatedAt: { type: Date },
    isAdvanced: { type: Boolean },
    isSchoolVerified: { type: Boolean },
    isVerified: { type: Boolean },
    schoolArea: { type: String },
    schoolArm: { type: String },
    schoolCertificate: { type: String },
    schoolClass: { type: String },
    schoolLevel: { type: String },
    schoolLevelName: { type: String },
    schoolClassLevel: { type: String },
    schoolContinent: { type: String },
    schoolCountry: { type: String },
    schoolCountryFlag: { type: String },
    schoolCountrySymbol: { type: String },
    schoolDepartment: { type: String },
    schoolDepartmentId: { type: String },
    schoolDepartmentUsername: { type: String },
    schoolFaculty: { type: String },
    schoolFacultyId: { type: String },
    schoolFacultyUsername: { type: String },
    schoolId: { type: String },
    schoolLogo: { type: String },
    schoolName: { type: String },
    schoolPicture: { type: String },
    schoolPlaceId: { type: String },
    schoolState: { type: String },
    schoolUsername: { type: String },
    schoolYear: { type: String },
}, {
    timestamps: true,
});
exports.PastSchool = mongoose_1.default.model('PastSchool', PastSchoolSchema);
