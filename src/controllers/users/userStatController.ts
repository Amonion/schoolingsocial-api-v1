import { Request, Response } from 'express'
import { UserStatus } from '../../models/users/usersStatMode'
import { io } from '../../app'
import { IUserData } from '../../utils/teamInterface'
import { Chat } from '../../models/message/chatModel'
import { handleError } from '../../utils/errorHandler'
import { startOfMonth, subMonths } from 'date-fns'
import { Model } from 'mongoose'
import { User } from '../../models/users/user'
import { School } from '../../models/school/schoolModel'
import { BioUserState } from '../../models/users/bioUserState'

//-----------------USERS--------------------//
export const updateVisit = async (data: IUserData) => {
  if (!data.ip || data.ip === '') {
    return
  }

  if (data.username) {
    let userStatus = await UserStatus.findOne({ username: data.username })

    // Step 2: Create new doc if not exists
    if (!userStatus) {
      userStatus = new UserStatus({
        username: data.username,
        visitedAt: data.visitedAt,
        online: data.online,
        country: data.country,
        countryCode: data.countryCode,
        bioUserId: data.bioUserId,
        userId: data.userId,
        ips: [data.ip], // start with IP
      })
    } else {
      // Step 3: Normalize ips to an array
      if (!Array.isArray(userStatus.ips)) {
        userStatus.ips = userStatus.ips ? [String(userStatus.ips)] : []
      }

      // Step 4: Add IP if not present
      if (!userStatus.ips.includes(data.ip)) {
        userStatus.ips.push(data.ip)
      }

      // Step 5: Update other fields
      userStatus.visitedAt = data.visitedAt
      userStatus.online = data.online
      userStatus.country = data.country
      userStatus.countryCode = data.countryCode
      userStatus.bioUserId = data.bioUserId
      userStatus.userId = data.userId
    }

    await userStatus.save()
  } else {
    // Case where username is not provided
    let userStatus = await UserStatus.findOne({ ips: { $in: [data.ip] } })

    if (!userStatus) {
      userStatus = new UserStatus({
        visitedAt: new Date(),
        online: true,
        country: data.country,
        countryCode: data.countryCode,
        username: data.username,
        bioUserId: data.bioUserId,
        userId: data.userId,
        ips: [data.ip],
      })
    } else {
      if (!Array.isArray(userStatus.ips)) {
        userStatus.ips = userStatus.ips ? [String(userStatus.ips)] : []
      }

      if (!userStatus.ips.includes(data.ip)) {
        userStatus.ips.push(data.ip)
      }

      userStatus.visitedAt = new Date()
      userStatus.online = true
      userStatus.country = data.country
      userStatus.countryCode = data.countryCode
      userStatus.username = data.username
      userStatus.bioUserId = data.bioUserId
      userStatus.userId = data.userId
    }

    await userStatus.save()
  }

  if (data.bioUserId) {
    updateOnlineStatus(data.bioUserId, data.visitedAt, BioUserState)
  }
  if (data.userId) {
    updateOnlineStatus(data.userId, data.visitedAt, User)
  }
  const visitors = await UserStatus.countDocuments({ online: true })
  const bioUserState = await BioUserState.findOne({ bioUserId: data.bioUserId })
  if (bioUserState) {
    io.emit(`update_state_${bioUserState.bioUserUsername}`, { bioUserState })
  }
}

const updateOnlineStatus = async <T extends Document>(
  userId: string,
  visitedAt: Date,
  model: Model<T>
) => {
  await model.findOneAndUpdate(
    { _id: userId, online: false },
    {
      visitedAt: visitedAt,
      online: true,
    }
  )
  const chats = await Chat.find({
    connection: { $regex: userId },
  })

  for (let i = 0; i < chats.length; i++) {
    const el = chats[i]
    io.emit(el.connection, { action: 'visit' })
  }
}

export const getUsersStat = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const now = new Date()
    const currentMonthStart = startOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))

    const onlineUsers = await UserStatus.countDocuments({ online: true })
    const verifyingUsers = await BioUserState.countDocuments({
      isOnVerification: true,
    })
    const verifiedUsers = await User.countDocuments({
      isVerified: true,
    })
    const totalUsers = await User.countDocuments()
    const thisMonthOnline = await UserStatus.countDocuments({
      online: true,
      createdAt: { $gte: currentMonthStart },
    })
    const thisMonthOnVerification = await User.countDocuments({
      isOnVerification: true,
      verifyingAt: { $gte: currentMonthStart },
    })
    const thisMonthUsers = await User.countDocuments({
      createdAt: { $gte: currentMonthStart },
    })
    const thisMonthVerifiedUsers = await User.countDocuments({
      isVerified: true,
      createdAt: { $gte: currentMonthStart },
    })

    const lastMonthOnline = await UserStatus.countDocuments({
      online: true,
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    })
    const lastMonthOnVerification = await User.countDocuments({
      isOnVerification: true,
      verifyingAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    })
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    })
    const lastMonthVerifiedUsers = await User.countDocuments({
      isVerified: true,
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    })

    let onlineIncrease = 0
    if (lastMonthOnline > 0) {
      onlineIncrease =
        ((thisMonthOnline - lastMonthOnline) / lastMonthOnline) * 100
    } else if (thisMonthOnline > 0) {
      onlineIncrease = 100
    }

    let verificationIncrease = 0
    if (lastMonthOnVerification > 0) {
      verificationIncrease =
        ((thisMonthOnVerification - lastMonthOnVerification) /
          lastMonthOnVerification) *
        100
    } else if (thisMonthOnVerification > 0) {
      verificationIncrease = 100
    }

    let totalUsersIncrease = 0
    if (lastMonthUsers > 0) {
      totalUsersIncrease =
        ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
    } else if (thisMonthUsers > 0) {
      totalUsersIncrease = 100
    }

    let verifiedUsersIncrease = 0
    if (lastMonthVerifiedUsers > 0) {
      verifiedUsersIncrease =
        ((thisMonthVerifiedUsers - lastMonthVerifiedUsers) /
          lastMonthVerifiedUsers) *
        100
    } else if (thisMonthVerifiedUsers > 0) {
      verifiedUsersIncrease = 100
    }

    res.status(200).json({
      onlineUsers,
      onlineIncrease,
      verifiedUsers,
      verifiedUsersIncrease,
      verifyingUsers,
      verificationIncrease,
      totalUsers,
      totalUsersIncrease,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------Schools--------------------//
export const getSchoolStat = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const now = new Date()
    const currentMonthStart = startOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))

    const totalSchools = await School.countDocuments()
    const thisMonthTotalSchools = await School.countDocuments({
      createdAt: { $gte: currentMonthStart },
    })
    const lastMonthTotalSchools = await School.countDocuments({
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    })

    const verifiedSchools = await School.countDocuments({
      isVerified: true,
    })
    const thisMonthVerifiedSchools = await School.countDocuments({
      isVerified: true,
      createdAt: { $gte: currentMonthStart },
    })
    const lastMonthVerifiedSchools = await School.countDocuments({
      isVerified: true,
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    })

    const newSchools = await School.countDocuments({ isNew: true })
    const thisMonthNewSchools = await School.countDocuments({
      isNew: true,
      createdAt: { $gte: currentMonthStart },
    })
    const lastMonthNewSchools = await School.countDocuments({
      isNew: true,
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    })

    const recordedSchools = await School.countDocuments({ isRecorded: true })
    const thisMonthRecordedSchools = await School.countDocuments({
      isRecorded: true,
      createdAt: { $gte: currentMonthStart },
    })
    const lastMonthRecordedSchools = await School.countDocuments({
      isRecorded: true,
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    })

    let totalSchoolIncrease = 0
    if (lastMonthTotalSchools > 0) {
      totalSchoolIncrease =
        ((thisMonthTotalSchools - lastMonthTotalSchools) /
          lastMonthTotalSchools) *
        100
    } else if (thisMonthTotalSchools > 0) {
      totalSchoolIncrease = 100
    }

    let verifiedSchoolIncrease = 0
    if (lastMonthVerifiedSchools > 0) {
      verifiedSchoolIncrease =
        ((thisMonthVerifiedSchools - lastMonthVerifiedSchools) /
          lastMonthVerifiedSchools) *
        100
    } else if (thisMonthVerifiedSchools > 0) {
      verifiedSchoolIncrease = 100
    }

    let newSchoolIncrease = 0
    if (lastMonthNewSchools > 0) {
      newSchoolIncrease =
        ((thisMonthNewSchools - lastMonthNewSchools) / lastMonthNewSchools) *
        100
    } else if (thisMonthNewSchools > 0) {
      newSchoolIncrease = 100
    }

    let recordedSchoolIncrease = 0
    if (lastMonthRecordedSchools > 0) {
      recordedSchoolIncrease =
        ((thisMonthRecordedSchools - lastMonthRecordedSchools) /
          lastMonthRecordedSchools) *
        100
    } else if (thisMonthRecordedSchools > 0) {
      recordedSchoolIncrease = 100
    }

    res.status(200).json({
      totalSchools,
      totalSchoolIncrease,
      verifiedSchools,
      verifiedSchoolIncrease,
      newSchools,
      newSchoolIncrease,
      recordedSchools,
      recordedSchoolIncrease,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
