import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { createItem, queryData, search } from '../../utils/query'
import { IOffice, Office } from '../../models/utility/officeModel'
import {
  IOfficeMessageTemplate,
  OfficeMessageTemplate,
} from '../../models/message/officeMessageTemplateModel'
import { BioUserState } from '../../models/users/bioUserState'
import { io } from '../../app'
import { StaffPosition } from '../../models/school/staffPositionModel'
import {
  AcademicLevel,
  StaffSubject,
} from '../../models/school/academicLevelModel'
import { BioUserSchoolInfo } from '../../models/users/bioUserSchoolInfo'
import { School } from '../../models/school/schoolModel'

export const getOffices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const results = await queryData<IOffice>(Office, req)
    res.status(200).json(results)
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getOfficeMessageTemplateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await OfficeMessageTemplate.findById(req.params.id)
    res.status(200).json({ data })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateOfficeMessageTemplateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await OfficeMessageTemplate.findByIdAndUpdate(req.params.id, req.body)
    const results = await queryData<IOfficeMessageTemplate>(
      OfficeMessageTemplate,
      req
    )
    res.status(200).json(results)
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getOfficeByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await Office.findOne({
      username: req.params.username,
      bioUserUsername: req.query.bioUserUsername,
    })
    res.status(200).json({ data })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const assignStaffRole = async (req: Request, res: Response) => {
  try {
    const staffPositions = req.body.staffPositions
    const selectedStaffs = req.body.selectedStaffs
    const staffType = req.body.staffType

    for (let i = 0; i < selectedStaffs.length; i++) {
      const staff = selectedStaffs[i]

      for (let x = 0; x < staffPositions.length; x++) {
        const position = staffPositions[x]
        await StaffPosition.findOneAndUpdate(
          {
            officeUsername: req.query.username,
            bioUserUsername: staff.bioUserUsername,
            level: position.index + 1,
            levelName: position.name,
            arm: position.arm,
          },
          {
            officeUsername: req.query.username,
            bioUserUsername: staff.bioUserUsername,
            bioUserDisplayName: staff.bioUserDisplayName,
            bioUserPicture: staff.bioUserPicture,
            level: position.index + 1,
            levelName: position.name,
            arm: position.arm,
          },
          { upsert: true }
        )
      }

      const office = await Office.findOne({
        bioUserUsername: staff.bioUserUsername,
        username: staff.username,
        userType: staffType,
      })

      const bioUserState = await BioUserState.findOneAndUpdate(
        {
          bioUserUsername: staff.bioUserUsername,
          'offices.username': office.username,
        },
        {
          $set: {
            'activeOffice.position': staffType,
            'offices.$.position': staffType,
          },
        },
        { new: true }
      )

      io.emit(`school_staff_${staff.bioUserUsername}`, {
        bioUserState,
        office,
        action: 'role_assignment',
      })
    }

    const results = await queryData<IOffice>(Office, req)
    res.status(200).json({
      ...results,
      message: 'The positions has been assigned successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const assignSubjects = async (req: Request, res: Response) => {
  try {
    const selectedSubjects = req.body.selectedSubjects
    const selectedStaffs = req.body.selectedStaffs

    for (let i = 0; i < selectedStaffs.length; i++) {
      const staff = selectedStaffs[i]

      for (let x = 0; x < selectedSubjects.length; x++) {
        const subject = selectedSubjects[x]
        await StaffSubject.findOneAndUpdate(
          {
            officeUsername: req.query.username,
            bioUserUsername: staff.bioUserUsername,
            level: subject.level,
            levelName: subject.levelName,
            name: subject.name,
          },
          {
            officeUsername: req.query.username,
            bioUserUsername: staff.bioUserUsername,
            level: subject.level,
            bioUserDisplayName: staff.bioUserDisplayName,
            levelName: subject.levelName,
            curriculumTitle: subject.curriculumTitle,
            description: subject.description,
            name: subject.name,
            subjectCode: subject.subjectCode,
            staffPicture: subject.picture,
          },
          { upsert: true }
        )
      }
    }

    const results = await queryData<IOffice>(Office, req)
    res.status(200).json({
      ...results,
      message: 'The positions has been assigned successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const assignClass = async (req: Request, res: Response) => {
  try {
    const selectedClass = req.body.selectedClass
    const selectedStudents = req.body.selectedStudents
    const school = await School.findOne({ username: req.query.username })
    const academicLevel = await AcademicLevel.findOne({
      levelName: selectedClass.name,
    })

    for (let i = 0; i < selectedStudents.length; i++) {
      const student = selectedStudents[i]

      await Office.findByIdAndUpdate(student._id, {
        bioUserUsername: student.bioUserUsername,
        schoolLevel: selectedClass.index + 1,
        schoolLevelName: selectedClass.name,
        arm: selectedClass.arm,
      })

      const bioUserState = await BioUserState.findOneAndUpdate(
        {
          bioUserUsername: student.bioUserUsername,
          'offices.username': student.username,
        },
        {
          $set: {
            'activeOffice.position': 'Student',
            'offices.$.position': 'Student',
          },
        },
        { new: true }
      )

      const bioUserSchoolInfo = await BioUserSchoolInfo.findOneAndUpdate(
        {
          bioUserUsername: student.bioUserUsername,
        },
        {
          $set: {
            admittedAt: new Date(),
            inSchool: true,
            isAdvanced: false,
            isSchoolVerified: true,
            schoolAcademicLevel: academicLevel,
            schoolArea: school.area,
            schoolArm: selectedClass.arm,
            schoolClass: selectedClass.name,
            schoolClassLevel: selectedClass.index + 1,
            schoolContinent: school.continent,
            schoolCountry: school.country,
            schoolCountryFlag: school.countryFlag,
            schoolCountrySymbol: school.countrySymbol,
            schoolId: school._id.toString(),
            schoolLogo: school.logo,
            schoolName: school.name,
            schoolPicture: school.picture,
            schoolPlaceId: school.placeId,
            schoolState: school.state,
            schoolUsername: school.username,
          },
        },
        { new: true }
      )

      io.emit(`school_student_${student.bioUserUsername}`, {
        bioUserState,
        bioUserSchoolInfo,
        student,
        action: 'role_assignment',
      })
    }

    const result = await queryData<IOffice>(Office, req)
    res.status(200).json({
      results: result.results,
      count: result.count,
      message: 'The positions has been assigned successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchOffice = (req: Request, res: Response) => {
  return search(Office, req, res)
}

export const createOfficeMessageTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(
    req,
    res,
    OfficeMessageTemplate,
    'The notification template was created successfully'
  )
}

export const getOfficeMessageTemplates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const results = await queryData<IOfficeMessageTemplate>(
      OfficeMessageTemplate,
      req
    )
    res.status(200).json(results)
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}
