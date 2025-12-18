import {
  IUserData,
  updateVisit,
} from '../../controllers/users/userStatController'

export interface ISocketData {
  to: string
  action: string
  type: string
  postId: string
  data: IUserData
  content: string
  createdAt: Date
  media: File[]
  types: string[]
}

export const UsersSocket = async (data: ISocketData) => {
  switch (data.action) {
    case 'visit':
      updateVisit(data.data)
      break
    default:
      break
  }
}
