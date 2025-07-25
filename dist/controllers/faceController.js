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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFace = void 0;
const path_1 = __importDefault(require("path"));
const tf = require('@tensorflow/tfjs');
const faceapi = __importStar(require("face-api.js"));
const { createCanvas, loadImage } = require('canvas');
function loadModels() {
    return __awaiter(this, void 0, void 0, function* () {
        const modelBasePath = path_1.default.resolve(__dirname, '../models/face');
        yield faceapi.nets.ssdMobilenetv1.loadFromDisk(path_1.default.join(modelBasePath, 'ssd_mobilenetv1'));
        yield faceapi.nets.faceLandmark68Net.loadFromDisk(path_1.default.join(modelBasePath, 'face_landmark_68'));
        yield faceapi.nets.faceExpressionNet.loadFromDisk(path_1.default.join(modelBasePath, 'face_expression'));
        console.log('Models loaded');
    });
}
loadModels();
const detectFace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        const imgFile = files[0];
        const img = yield loadImage(imgFile.buffer);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const detections = yield faceapi
            .detectAllFaces(canvas)
            .withFaceLandmarks()
            .withFaceExpressions();
        res.json({ faces: detections });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process image' });
    }
});
exports.detectFace = detectFace;
// import { Request, Response } from 'express'
// import path from 'path'
// import * as faceapi from 'face-api.js'
// import canvas from 'canvas'
// const { Canvas, Image, ImageData, createCanvas, loadImage } = canvas
// // ✅ Patch the environment to use Node.js canvas types
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData } as any)
// // ✅ Load face-api.js models from disk
// async function loadModels() {
//   const modelBasePath = path.resolve(__dirname, '../models/face')
//   await faceapi.nets.ssdMobilenetv1.loadFromDisk(
//     path.join(modelBasePath, 'ssd_mobilenetv1')
//   )
//   await faceapi.nets.faceLandmark68Net.loadFromDisk(
//     path.join(modelBasePath, 'face_landmark_68')
//   )
//   await faceapi.nets.faceExpressionNet.loadFromDisk(
//     path.join(modelBasePath, 'face_expression')
//   )
//   console.log('Models loaded')
// }
// loadModels()
// // ✅ Express controller to detect faces
// export const detectFace = async (
//   req: Request,
//   res: Response
// ): Promise<Response | void> => {
//   try {
//     const files = req.files as Express.Multer.File[] | undefined
//     if (!files || files.length === 0) {
//       return res.status(400).json({ error: 'No image file uploaded' })
//     }
//     const imgFile = files[0]
//     const img = await loadImage(imgFile.buffer)
//     console.log('loaded img:', img)
//     const canvas = createCanvas(img.width, img.height)
//     const ctx = canvas.getContext('2d')
//     ctx.drawImage(img, 0, 0)
//     const detections = await faceapi
//       .detectAllFaces(canvas as unknown as any)
//       .withFaceLandmarks()
//       .withFaceExpressions()
//     res.json({ faces: detections })
//   } catch (error) {
//     console.error('Face detection error:', error)
//     res.status(500).json({ error: 'Failed to process image' })
//   }
// }
