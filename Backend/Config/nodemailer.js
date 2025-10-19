import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth:{
        user: process.env.SMPT_LOGIN,
        pass: process.env.SMPT_KEY
    }
})


export default transporter;