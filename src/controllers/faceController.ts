import { Request, Response } from 'express'
import path from 'path'

const tf = require('@tensorflow/tfjs')
import * as faceapi from 'face-api.js'
const { createCanvas, loadImage } = require('canvas')

async function loadModels() {
  const modelBasePath = path.resolve(__dirname, '../models/face')

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(
    path.join(modelBasePath, 'ssd_mobilenetv1')
  )
  await faceapi.nets.faceLandmark68Net.loadFromDisk(
    path.join(modelBasePath, 'face_landmark_68')
  )
  await faceapi.nets.faceExpressionNet.loadFromDisk(
    path.join(modelBasePath, 'face_expression')
  )

  console.log('Models loaded')
}
loadModels()

export const detectFace = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const files = req.files as Express.Multer.File[] | undefined
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image file uploaded' })
    }
    const imgFile = files[0]
    const img = await loadImage(imgFile.buffer)
    const canvas = createCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    const detections = await faceapi
      .detectAllFaces(canvas)
      .withFaceLandmarks()
      .withFaceExpressions()

    res.json({ faces: detections })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to process image' })
  }
}

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
