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
exports.deletePayment = exports.updatePayment = exports.getPayments = exports.getPaymentById = exports.createPayment = void 0;
const paymentModel_1 = require("../../models/team/paymentModel");
const query_1 = require("../../utils/query");
//--------------------PAYMENTS-----------------------//
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, paymentModel_1.Payment, 'Payments was created successfully');
});
exports.createPayment = createPayment;
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, paymentModel_1.Payment, 'Payment was not found');
});
exports.getPaymentById = getPaymentById;
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItems)(req, res, paymentModel_1.Payment);
});
exports.getPayments = getPayments;
const updatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, paymentModel_1.Payment, ['logo'], ['Payment not found', 'Payment was updated successfully']);
});
exports.updatePayment = updatePayment;
const deletePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, paymentModel_1.Payment, ['logo'], 'Payment not found');
});
exports.deletePayment = deletePayment;
