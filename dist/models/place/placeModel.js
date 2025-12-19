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
exports.Document = exports.Bank = exports.AdCategory = exports.Place = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PlaceSchema = new mongoose_1.Schema({
    landmark: { type: String },
    area: { type: String },
    state: { type: String },
    country: { type: String },
    countryCapital: { type: String },
    stateCapital: { type: String },
    stateLogo: { type: String },
    continent: { type: String },
    countryFlag: { type: String },
    zipCode: { type: String },
    countryCode: { type: String },
    countrySymbol: { type: String },
    currency: { type: String },
    currencySymbol: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Place = mongoose_1.default.model('Place', PlaceSchema);
const AdCategorySchema = new mongoose_1.Schema({
    category: { type: String },
    picture: { type: String },
    name: { type: String },
    description: { type: String },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    postNumber: { type: Number, default: 0 },
    continent: { type: String },
    country: { type: String },
    currency: { type: String },
    currencySymbol: { type: String },
    countrySymbol: { type: String },
    placeId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.AdCategory = mongoose_1.default.model('AdCategory', AdCategorySchema);
const BankSchema = new mongoose_1.Schema({
    category: { type: String },
    picture: { type: String },
    name: { type: String },
    description: { type: String },
    username: { type: String },
    continent: { type: String },
    country: { type: String },
    countryFlag: { type: String },
    placeId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Bank = mongoose_1.default.model('Bank', BankSchema);
const DocumentSchema = new mongoose_1.Schema({
    name: { type: String },
    picture: { type: String },
    required: { type: Boolean, default: false },
    country: { type: String },
    placeId: { type: String },
    countryFlag: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Document = mongoose_1.default.model('Document', DocumentSchema);
