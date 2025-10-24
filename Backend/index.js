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
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true, 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.use('/auth',AuthRoute);
app.use('/user',userRouter);

connectDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

