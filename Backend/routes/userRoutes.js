import express from "express";
import userAuth from "../Middleware/userAuth.js";
import {getUserData} from "../Controller/userControler.js";

const router = express.Router();

router.get("/userData",userAuth, getUserData);

export default router;