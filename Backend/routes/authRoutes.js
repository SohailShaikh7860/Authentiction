import express from 'express';
import { register,login, logOut, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from '../Controller/AuthController.js';
import userAuth from '../Middleware/userAuth.js';


const AuthRoute = express.Router();

AuthRoute.post('/register',register);
AuthRoute.post('/login',login);
AuthRoute.post('/logout',logOut);
AuthRoute.post('/send-verify-otp',userAuth,sendVerifyOtp);
AuthRoute.post('/verify-account',userAuth,verifyEmail);
AuthRoute.post('/is-auth',userAuth,isAuthenticated);

AuthRoute.post('/send-reset-otp',sendResetOtp);
AuthRoute.post('/reset-password',resetPassword);

export default AuthRoute;