"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoipMiddleware = geoipMiddleware;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const geoip2_node_1 = require("@maxmind/geoip2-node");
const dbPath = path_1.default.join(__dirname, '../utils/GeoLite2-Country.mmdb');
const dbBuffer = fs_1.default.readFileSync(dbPath);
const reader = geoip2_node_1.Reader.openBuffer(dbBuffer);
function geoipMiddleware(req, res, next) {
    var _a, _b, _c;
    let ip;
    const forwarded = req.headers['x-forwarded-for'];
    console.log(`Forwarded is: ${forwarded}`);
    if (typeof forwarded === 'string') {
        ip = forwarded.split(',')[0];
    }
    else if (Array.isArray(forwarded)) {
        ip = forwarded[0];
    }
    else {
        ip = ((_a = req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress) || undefined;
    }
    if (ip === null || ip === void 0 ? void 0 : ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    console.log(`IP is: ${ip}`);
    try {
        const response = reader.country(ip || '');
        req.country = ((_c = (_b = response.country) === null || _b === void 0 ? void 0 : _b.names) === null || _c === void 0 ? void 0 : _c.en) || 'Nigeria';
        req.ipAddress = ip || '';
    }
    catch (_d) {
        ;
        req.country = 'Nigeria';
        req.ipAddress = ip || '';
    }
    next();
}
