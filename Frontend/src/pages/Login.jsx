import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

      const navigate = useNavigate();

      const {backendURL,setIsLoggedIn, getUserData} = useContext(AppContext);

     const [state, setState] = useState('Sign Up');
     const [name, setName] = useState('');
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');

     const onsubmitHandler = async (e) => {
      try {
        e.preventDefault();

        axios.defaults.withCredentials = true; 


        if(state === 'Sign Up'){
         const {data} = await axios.post(backendURL + '/auth/register',{name, email, password});

         if(data.success){
          setIsLoggedIn(true);
          setTimeout(async() => {
           await getUserData();
            navigate('/');
          }, 100);
         }else{
          toast.error(data.message);
         }
        }else{
           const {data} = await axios.post(backendURL + '/auth/login',{ email, password});

         if(data.success){
          setIsLoggedIn(true);
          
          setTimeout(async () => {
           await getUserData();
            navigate('/');
          }, 100);
         }else{
          toast.error(data.message);
         }
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong. Please try again later.");
      }
     }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>

        <p className='text-center mb-6 text-sm'>{state === 'Sign Up' ? 'Create an account' : 'Login to your account'}</p>

        <form onSubmit={onsubmitHandler}>
          {state === 'Sign Up' && (
             <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
                <img src={assets.person_icon} alt="" />
                <input onChange={e => setName(e.target.value)} value = {name} type="text" placeholder='Full Name' className='text-white bg-transparent outline-none' required/>
            </div>
          )}
           

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
                <img src={assets.mail_icon} alt="" />
                <input onChange={e => setEmail(e.target.value)} value = {email}  type="email" placeholder='Email Address' className='text-white bg-transparent outline-none' required/>
            </div>

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
                <img src={assets.lock_icon} alt="" />
                <input onChange={e => setPassword(e.target.value)} value = {password} type="password" placeholder='Password' className='text-white bg-transparent outline-none' required/>
            </div>


            <p className='mb-4 text-indigo-500 cursor-pointer' onClick={()=> navigate('/reset-password')}>Forgot Password?</p>

            <button className='w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>{state}</button>

            {state === 'Sign Up' ? (
                <p className='text-center mt-4 cursor-pointer text-gray-400 text-xs'>Already have an account?{' '} <span className='text-blue-400 underline' onClick={()=> setState('Login')}>Login here</span></p>
            ) : (
               <p className='text-center mt-4 cursor-pointer text-gray-400 text-xs'>Don't have an account{' '} <span className='text-blue-400 underline' onClick={()=> setState('Sign Up')}>Sign up</span></p>
            )}

          
        </form>
      </div>
    </div>
  )
}

export default Login
