import { updateVisit } from '../../controllers/users/userStatController'
import { ISocketData } from '../../utils/teamInterface'

export const UsersSocket = async (data: ISocketData) => {
  switch (data.action) {
    case 'visit':
      updateVisit(data.data)
      break
    default:
      break
  }
}
