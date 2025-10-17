import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const user = process.env.SMPT_LOGIN;
const pass = process.env.SMPT_KEY;

if (!user || !pass) {
  throw new Error('Missing SMTP credentials in environment (SMTP_LOGIN, SMTP_KEY).');
}

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