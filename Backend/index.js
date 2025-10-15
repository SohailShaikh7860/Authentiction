import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const port = process.env.PORT || 8001;

app.use(express.json());
app.use(cors({credentials:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

