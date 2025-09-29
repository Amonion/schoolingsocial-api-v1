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
exports.School = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SchoolSchema = new mongoose_1.Schema({
    resultPointSystem: { type: Number, default: 0.0 },
    document: { type: String },
    idCard: { type: String },
    logo: { type: String },
    levels: { type: Array },
    institutions: { type: Array, default: [] },
    grading: {
        type: Array,
        default: [
            { name: 'A', min: 70, max: 100, remark: 'Excelent' },
            { name: 'B', min: 60, max: 69.99, remark: 'Very Good' },
        ],
    },
    bioUserUsername: { type: String, default: '' },
    bioUserId: { type: String, default: '' },
    userId: { type: String, default: '' },
    createdLocation: { type: Object, default: {} },
    lng: { type: Number },
    lat: { type: Number },
    academicSession: { type: Object, default: {} },
    name: { type: String, default: '' },
    username: { type: String, default: '' },
    area: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    reasone: { type: String, default: '' },
    continent: { type: String, default: '' },
    placeId: { type: String, default: '' },
    studentRegistration: { type: Boolean, default: false },
    staffRegistration: { type: Boolean, default: false },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    media: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    picture: { type: String, default: '' },
    officeId: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isApplied: { type: Boolean, default: false },
    isRecorded: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.School = mongoose_1.default.model('School', SchoolSchema);
