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
exports.getAWallets = exports.getTransactions = exports.createTransaction = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const sendEmail_1 = require("../../utils/sendEmail");
const walletModel_1 = require("../../models/users/walletModel");
const paymentModel_1 = require("../../models/team/paymentModel");
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const txType = req.body.name;
        const tx = req.body;
        if (txType === 'top_up') {
            yield walletModel_1.Wallet.findOneAndUpdate({ userId: tx.userId }, { $inc: { balance: tx.amount, received: tx.amount } }, { new: true, upsert: false } // options
            );
            req.body.received = true;
        }
        const trx = yield paymentModel_1.Transaction.create(req.body);
        yield (0, sendEmail_1.sendEmail)('', tx.email, 'top_up');
        const result = yield (0, query_1.queryData)(paymentModel_1.Transaction, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createTransaction = createTransaction;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(paymentModel_1.Transaction, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getTransactions = getTransactions;
const getAWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(walletModel_1.Wallet, req);
        res.status(200).json({ wallet: result.results[0] });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAWallets = getAWallets;
