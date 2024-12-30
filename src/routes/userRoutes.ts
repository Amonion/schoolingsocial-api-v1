import { Router } from "express";
import { getUsers } from "../controllers/userController";

const router: Router = Router();

router.get("/", getUsers);

export default router;
