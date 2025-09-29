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
exports.BioUserState = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BioUserStateSchema = new mongoose_1.Schema({
    activeOffice: { type: Object, default: {} },
    pendingOffice: { type: Object, default: {} },
    bioUserUsername: { type: String, default: '' },
    bioUserId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    examAttempts: { type: Number, default: 0 },
    isAccountOpen: { type: Boolean, default: false },
    isAccountSet: { type: Boolean, default: false },
    isBio: { type: Boolean, default: false },
    isContact: { type: Boolean, default: false },
    isDocument: { type: Boolean, default: false },
    isEducation: { type: Boolean, default: false },
    isEducationDocument: { type: Boolean, default: false },
    isEducationHistory: { type: Boolean, default: false },
    hasPastSchool: { type: Boolean, default: false },
    processingOffice: { type: Boolean, default: false },
    isOnVerification: { type: Boolean, default: false },
    isOrigin: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    isRelated: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    numberOfOffices: { type: Number, default: 0 },
    offices: { type: Array, default: [] },
    verifyingAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.BioUserState = mongoose_1.default.model('BioUserState', BioUserStateSchema);
