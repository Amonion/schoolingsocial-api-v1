import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { queryData } from '../../utils/query'
import { Office } from '../../models/utility/officeModel'
import {
  IOfficialMessage,
  OfficialMessage,
} from '../../models/message/officialMessageModel'
import { OfficeMessageTemplate } from '../../models/message/officeMessageTemplateModel'
import { sendOfficialMessage } from '../../utils/sendMessage'

export const readOfficeMessages = async (req: Request, res: Response) => {
  try {
    const ids = req.body.ids ? JSON.parse(req.body.ids) : []
    await OfficialMessage.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          unread: false,
        },
      }
    )
    const unread = await OfficialMessage.countDocuments({
      receiverUsername: req.query.username,
      unread: true,
    })
    res.status(200).json({
      unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getOfficialMessages = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IOfficialMessage>(OfficialMessage, req)
    const unread = await OfficialMessage.countDocuments({
      receiverUsername: req.query.senderUsername,
      unread: true,
    })

    res.status(200).json({
      page: result.page,
      page_size: result.page_size,
      results: result.results,
      count: result.count,
      unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getOfficialMessage = async (req: Request, res: Response) => {
  try {
    const result = await OfficialMessage.findById(req.params.id)

    res.status(200).json({
      data: result,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const sendOfficesMessage = async (req: Request, res: Response) => {
  try {
    const selectedStaffs = req.body.selectedStaffs
    const message = req.body.message
    const office = await Office.findOne({ username: req.body.officeUsername })
    for (let i = 0; i < selectedStaffs.length; i++) {
      const el = selectedStaffs[i]
      const officialMessage = await sendOfficialMessage({
        greetings: message.greetings.replace(
          '[Receiver]',
          el.bioUserDisplayName
        ),
        title: message.title,
        senderUsername: office.username,
        receiverUsername: el.bioUserUsername,
        senderName: office.name,
        receiverName: el.bioUserDisplayName,
        senderPicture: office.logo,
        receiverPicture: el.bioUserPicture,
        senderAddress: office.address,
        senderArea: office.area,
        senderState: office.state,
        senderCountry: office.country,
        receiverAddress: el.residentAddress,
        receiverArea: el.residentArea,
        receiverState: el.residentState,
        receiverCountry: el.residentCountry,
        content: message.content,
        unread: true,
      })
      console.log(el, message)
    }

    res.status(200).json({
      message: 'The message has been successfully sent to the users',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
