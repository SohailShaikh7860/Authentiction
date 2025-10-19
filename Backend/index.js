import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './DB/DataBase.js';
import AuthRoute from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 8001;

app.use(express.json());
app.use(cors({credentials:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.use('/auth',AuthRoute);
app.use('/user',userRouter);

connectDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

