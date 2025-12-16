import { Request, Response } from 'express'
import { Place, Bank, Document } from '../../models/place/placeModel'
import { IPlace } from '../../utils/teamInterface'
import { handleError } from '../../utils/errorHandler'
import {
  queryData,
  deleteItem,
  deleteItems,
  createItem,
} from '../../utils/query'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import { Exam } from '../../models/exam/competitionModel'
import { News } from '../../models/place/newsModel'
import { AcademicLevel } from '../../models/school/academicLevelModel'
import { School } from '../../models/school/schoolModel'

export const cleanPlaces = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    await Place.updateMany({}, [
      {
        $set: {
          landmark: { $trim: { input: '$landmark' } },
          area: { $trim: { input: '$area' } },
          state: { $trim: { input: '$state' } },
          country: { $trim: { input: '$country' } },
          continent: { $trim: { input: '$continent' } },
        },
      },
    ])

    await Document.updateMany({}, [
      {
        $set: {
          country: { $trim: { input: '$country' } },
        },
      },
    ])

    await School.updateMany({}, [
      {
        $set: {
          name: { $trim: { input: '$name' } },
          username: { $trim: { input: '$username' } },
          state: { $trim: { input: '$state' } },
          country: { $trim: { input: '$country' } },
          continent: { $trim: { input: '$continent' } },
        },
      },
    ])
    await News.updateMany({}, [
      {
        $set: {
          state: { $trim: { input: '$state' } },
          country: { $trim: { input: '$country' } },
          continent: { $trim: { input: '$continent' } },
        },
      },
    ])

    await News.updateMany({}, [
      {
        $set: {
          country: { $trim: { input: '$country' } },
          continent: { $trim: { input: '$continent' } },
        },
      },
    ])

    await Exam.updateMany({}, [
      {
        $set: {
          country: { $trim: { input: '$country' } },
          continent: { $trim: { input: '$continent' } },
        },
      },
    ])

    await Bank.updateMany({}, [
      {
        $set: {
          country: { $trim: { input: '$country' } },
          continent: { $trim: { input: '$continent' } },
        },
      },
    ])

    await AcademicLevel.updateMany({}, [
      {
        $set: {
          country: { $trim: { input: '$country' } },
        },
      },
    ])

    res.status(200).json({ message: 'Places updated successfully.' })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//--------------------PLACE-----------------------//
export const createPlace = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Place, 'Country was created successfully')
}

export const getPlaceById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const result = await Place.findById(req.params.id)
    if (!result) {
      return res.status(404).json({ message: 'Place not found' })
    }
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getPlaces = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPlace>(Place, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAllPlaces = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.place as string

    const limit = Math.min(Number(req.query.page_size) || 50, 100) // max 100 results
    const skip = Math.max(Number(req.query.page) || 0, 0) // min 0

    const result = await Place.aggregate([
      {
        $match: {
          $or: [
            { country: { $regex: `^${searchTerm}`, $options: 'i' } },
            { state: { $regex: `^${searchTerm}`, $options: 'i' } },
            { area: { $regex: `^${searchTerm}`, $options: 'i' } },
          ],
        },
      },
      {
        $group: {
          _id: '$area', // Group by area
          doc: { $first: '$$ROOT' }, // Keep the first doc in each group
        },
      },
      {
        $replaceRoot: { newRoot: '$doc' },
      },
      { $skip: skip },
      { $limit: limit },
    ])

    res.status(200).json({ results: result })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updatePlace = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req)
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
    }

    const place = await Place.findById(req.params.id)
    const source = req.body.source

    if (source === 'Country') {
      if (place?.country === req.body.country) {
        await Place.updateMany({ country: req.body.country }, req.body)
      } else {
        await Place.updateMany({ country: place?.country }, { $set: req.body })
      }
    } else if (source === 'State') {
      if (place?.state === req.body.state) {
        await Place.updateMany({ state: req.body.state }, req.body)
      } else {
        await Place.updateMany({ state: place?.state }, { $set: req.body })
      }
    } else if (source === 'Area') {
      if (place?.area === req.body.area) {
        await Place.updateMany({ area: req.body.area }, req.body)
      } else {
        await Place.updateMany({ area: place?.area }, { $set: req.body })
      }
    }

    const item = await queryData<IPlace>(Place, req)
    const { page, page_size, count, results } = item
    res.status(200).json({
      message: 'Place was updated successfully',
      results,
      count,
      page,
      page_size,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateState = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req)
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
    }

    const place = await Place.findById(req.params.id)
    const state = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    await Place.updateMany({ state: place?.state }, { $set: req.body })

    const item = await queryData<IPlace>(Place, req)
    const { count, results } = item
    res.status(200).json({
      message: 'The state was updated successfully',
      results,
      count,
      state,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deletePlace = async (req: Request, res: Response) => {
  const result = await Place.findById(req.params.id)
  const existingPlaces = await Place.find({
    country: result?.country,
    $and: [{ countryFlag: { $ne: null } }, { countryFlag: { $ne: '' } }],
  })
  if (existingPlaces.length > 1) {
    await deleteItem(req, res, Place, [], 'Place not found')
  } else {
    await deleteItem(req, res, Place, ['countryFlag'], 'Place not found')
  }
}

export const deletePlaces = async (req: Request, res: Response) => {
  await deleteItems(req, res, Place, ['countryFlag'], 'Place not found')
}

export const searchPlace = async (req: Request, res: Response) => {
  try {
    const places = await Place.aggregate([
      {
        $group: {
          _id: '$country',
        },
      },
    ])
    res.status(200).json({
      results: places,
    })
  } catch (error) {
    console.error('Error fetching unique places:', error)
    throw error
  }
}

export const searchPlaces = async (req: Request, res: Response) => {
  try {
    const country = req.query.country
    const places = await Place.aggregate([
      {
        $match: {
          country: { $regex: country, $options: 'i' },
        },
      },
      {
        $group: {
          _id: '$country',
          countryFlag: { $first: '$countryFlag' },
          continent: { $first: '$continent' },
          countryCode: { $first: '$countryCode' },
          currency: { $first: '$currency' },
          currencySymbol: { $first: '$currencySymbol' },
          countrySymbol: { $first: '$countrySymbol' },
          state: { $first: '$state' },
          area: { $first: '$area' },
          id: { $first: '$_id' },
        },
      },
      {
        $project: {
          _id: 0,
          country: '$_id',
          countryFlag: 1,
          continent: 1,
          currency: 1,
          currencySymbol: 1,
          countrySymbol: 1,
          state: 1,
          area: 1,
          id: 1,
        },
      },
      { $limit: 10 },
    ])

    res.status(200).json({
      results: places,
    })
  } catch (error) {
    console.error('Error fetching unique places:', error)
    throw error
  }
}

export const getUniquePlaces = async (req: Request, res: Response) => {
  try {
    const field = String(req.query.field)
    const limit = parseInt(req.query.page_size as string) || 10

    const page = parseInt(req.query.page as string) || 1
    const sortBy = (req.query.sort as string) || 'country'
    const order = (req.query.order as string) === 'asc' ? -1 : 1

    const skipValue = (page - 1) * limit

    const country = req.query.country
    const state = req.query.state
    const area = req.query.area

    const filters: Record<string, any> = {}
    if (area) {
      filters.area = { $regex: area, $options: 'i' }
    } else if (state) {
      filters.state = { $regex: state, $options: 'i' }
    } else {
      filters.country = { $regex: country, $options: 'i' }
    }

    const matchStage =
      Object.keys(filters).length > 0 ? { $match: filters } : null

    const aggregationPipeline: any[] = []
    if (matchStage) aggregationPipeline.push(matchStage)

    aggregationPipeline.push(
      {
        $group: {
          _id: `$${field}`,
          countryFlag: { $first: '$countryFlag' },
          continent: { $first: '$continent' },
          country: { $first: '$country' },
          countryCode: { $first: '$countryCode' },
          currency: { $first: '$currency' },
          currencySymbol: { $first: '$currencySymbol' },
          countrySymbol: { $first: '$countrySymbol' },
          state: { $first: '$state' },
          stateCapital: { $first: '$stateCapital' },
          stateLogo: { $first: '$stateLogo' },
          area: { $first: '$area' },
          zipCode: { $first: '$zipCode' },
          id: { $first: '$_id' },
        },
      },
      {
        $project: {
          _id: 0,
          [field]: '$_id',
          countryFlag: 1,
          continent: 1,
          countryCode: 1,
          country: 1,
          currency: 1,
          currencySymbol: 1,
          countrySymbol: 1,
          state: 1,
          stateCapital: 1,
          stateLogo: 1,
          area: 1,
          zipCode: 1,
          id: 1,
        },
      },
      { $sort: { [sortBy]: order } },
      { $skip: skipValue },
      { $limit: limit }
    )

    const countPipeline = [...aggregationPipeline].filter(
      (stage) => !('$limit' in stage || '$skip' in stage)
    )

    countPipeline.push({ $count: 'totalCount' })
    const [places, totalCountResult] = await Promise.all([
      Place.aggregate(aggregationPipeline),
      Place.aggregate(countPipeline),
    ])

    const totalCount = totalCountResult.length
      ? totalCountResult[0].totalCount
      : 0

    res.status(200).json({
      message: 'Places fetched successfully',
      results: places,
      count: totalCount,
      page_size: limit,
    })
  } catch (error) {
    console.error('Error fetching unique places:', error)
    throw error
  }
}
