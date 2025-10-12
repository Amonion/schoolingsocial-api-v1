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
exports.BioUser = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BioUserSchema = new mongoose_1.Schema({
    authorityName: { type: String },
    authorityLevel: { type: Number, default: 0 },
    bioUserDisplayName: { type: String },
    bioUserIntro: { type: String },
    bioUserMedia: { type: String },
    bioUserPicture: { type: String },
    bioUserUsername: { type: String },
    createdAt: { type: Date, default: Date.now },
    dateOfBirth: { type: Date },
    documents: { type: Array },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'A user with this email already exists'],
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    firstName: { type: String },
    gender: { type: String },
    homeAddress: { type: String },
    homeArea: { type: String },
    homeContinent: { type: String },
    homeCountry: { type: String },
    homeCountrySymbol: { type: String },
    homePlaceId: { type: String },
    homeState: { type: String },
    isVerified: { type: Boolean, default: false },
    lastName: { type: String },
    maritalStatus: { type: String },
    middleName: { type: String },
    motherName: { type: String },
    nextKinName: { type: String },
    nextKinPhoneNumber: { type: String },
    notificationToken: { type: String },
    occupation: { type: String },
    passport: { type: String },
    phone: { type: String },
    residentAddress: { type: String },
    residentArea: { type: String },
    residentContinent: { type: String },
    residentCountry: { type: String },
    residentCountrySymbol: { type: String },
    residentPlaceId: { type: String },
    residentState: { type: String },
    signupCountry: { type: String },
    signupDevice: { type: String },
    signupIp: { type: String },
    signupOS: { type: String },
    lng: { type: Number },
    lat: { type: Number },
}, {
    timestamps: true,
});
exports.BioUser = mongoose_1.default.model('BioUser', BioUserSchema);
