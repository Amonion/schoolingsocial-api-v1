import { Request, Response } from 'express'
import { IStaff } from '../../utils/teamInterface'
import { Staff } from '../../models/team/staffModel'
import { handleError } from '../../utils/errorHandler'
import { queryData, updateItem } from '../../utils/query'
import { User } from '../../models/users/user'

export const getStaffById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' })
    }
    res.status(200).json(staff)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getStaffs = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IStaff>(Staff, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' })
    }
    const user = await User.findOne({ _id: staff.userId })
    req.body.staffPositions = req.body.duties
    await User.findByIdAndUpdate(user?._id, req.body)
    updateItem(
      req,
      res,
      Staff,
      [],
      ['Staff not found', 'Staff was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
