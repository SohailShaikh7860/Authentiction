import express from 'express';
import { register,login, logOut, sendVerifyOtp, verifyEmail } from '../Controller/AuthController.js';
import userAuth from '../Middleware/userAuth.js';


const AuthRoute = express.Router();

AuthRoute.post('/register',register);
AuthRoute.post('/login',userAuth,login);
AuthRoute.post('/logout',userAuth,logOut);
AuthRoute.post('/send-verify-otp',userAuth,sendVerifyOtp);
AuthRoute.post('/verify-account',userAuth,verifyEmail);


export default AuthRoute;