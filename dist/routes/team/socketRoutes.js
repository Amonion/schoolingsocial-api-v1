"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSocket = void 0;
const statController_1 = require("../../controllers/team/statController");
const TeamSocket = (data) => __awaiter(void 0, void 0, void 0, function* () {
    switch (data.action) {
        case "visit":
            (0, statController_1.updateVisit)(data.data);
            break;
        case "left":
            (0, statController_1.visitorLeft)(data.data);
            break;
        default:
            break;
    }
});
exports.TeamSocket = TeamSocket;
