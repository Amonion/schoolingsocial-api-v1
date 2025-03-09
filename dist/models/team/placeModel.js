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
exports.Bank = exports.Ad = exports.Place = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PlaceSchema = new mongoose_1.Schema({
    landmark: { type: String, default: "" },
    area: { type: String },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    countryCapital: { type: String, default: "" },
    stateCapital: { type: String, default: "" },
    stateLogo: { type: String, default: "" },
    continent: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    currency: { type: String, default: "" },
    currencySymbol: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Place = mongoose_1.default.model("Place", PlaceSchema);
const AdSchema = new mongoose_1.Schema({
    category: { type: String, default: "" },
    picture: { type: String, default: "" },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    postNumber: { type: Number, default: 0 },
    continent: { type: String, default: "" },
    country: { type: String, default: "" },
    currency: { type: String, default: "" },
    currencySymbol: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    placeId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Ad = mongoose_1.default.model("Ad", AdSchema);
const BankSchema = new mongoose_1.Schema({
    category: { type: String, default: "" },
    picture: { type: String, default: "" },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    username: { type: String, default: "" },
    continent: { type: String, default: "" },
    country: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    placeId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Bank = mongoose_1.default.model("Bank", BankSchema);
