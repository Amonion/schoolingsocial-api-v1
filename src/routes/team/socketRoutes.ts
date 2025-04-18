import { updateVisit } from "../../controllers/team/statController";
import { ISocketData } from "../../utils/teamInterface";

export const TeamSocket = async (data: ISocketData) => {
  switch (data.action) {
    case "visit":
      updateVisit(data.data);
      break;
    default:
      break;
  }
};
