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
    authorityName: { type: String, default: '' },
    authorityLevel: { type: Number, default: 0 },
    bioUserDisplayName: { type: String, default: '' },
    bioUserIntro: { type: String, default: '' },
    bioUserMedia: { type: String, default: '' },
    bioUserPicture: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    dateOfBirth: { type: Date, default: null },
    documents: { type: Array, default: [] },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'A user with this email already exists'],
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    firstName: { type: String, default: '' },
    gender: { type: String, default: '' },
    homeAddress: { type: String, default: '' },
    homeArea: { type: String, default: '' },
    homeContinent: { type: String, default: '' },
    homeCountry: { type: String, default: '' },
    homeCountrySymbol: { type: String, default: '' },
    homePlaceId: { type: String, default: '' },
    homeState: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    lastName: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
    middleName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    nextKinName: { type: String, default: '' },
    nextKinPhoneNumber: { type: String, default: '' },
    notificationToken: { type: String, default: '' },
    occupation: { type: String, default: '' },
    passport: { type: String, default: '' },
    phone: { type: String, default: '' },
    residentAddress: { type: String, default: '' },
    residentArea: { type: String, default: '' },
    residentContinent: { type: String, default: '' },
    residentCountry: { type: String, default: '' },
    residentCountrySymbol: { type: String, default: '' },
    residentPlaceId: { type: String, default: '' },
    residentState: { type: String, default: '' },
    signupCountry: { type: Object, default: {} },
    signupLocation: { type: Object, default: {} },
    signupDevice: { type: String, default: '' },
    signupIp: { type: String, default: '' },
    signupOS: { type: String, default: '' },
    verificationLocation: { type: Object, default: {} },
}, {
    timestamps: true,
});
exports.BioUser = mongoose_1.default.model('BioUser', BioUserSchema);
