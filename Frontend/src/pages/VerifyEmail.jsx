import React from 'react'
import { assets } from '../assets/assets'
import { useRef } from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const VerifyEmail = () => {

      const {backendURL, isLoggedIn, userData, getUserData} = useContext(AppContext);

     const inputRefs = useRef([]);

     const navigate = useNavigate();

     const handleInput = (e,index)=>{
       if(e.target.value.length === 1 && index < 5){
        inputRefs.current[index + 1].focus();
       }
     }

     const handleKeyDown = (e, index) => {
      if(e.key === 'Backspace' && index > 0 && e.target.value === ''){
        inputRefs.current[index - 1].focus();
      }
     }

     const handlePaste = (e) => {
      const pasteData = e.clipboardData.getData('Text').slice(0,6).split('');
      pasteData.forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      });
    }

    const onSubmitHandler = async (e) => {
      try {
        e.preventDefault();
        const otpArray = inputRefs.current.map(input => input.value);
        const otp = otpArray.join('');

        console.log("Backend URL:", backendURL);
        console.log("Full URL:", backendURL + '/auth/verify-account');
        
        // Check if user is authenticated first
        console.log("Checking authentication...");
        try {
          const authCheck = await axios.get(backendURL + '/auth/is-auth', {withCredentials: true});
          console.log("Auth check result:", authCheck.data);
          
          if (!authCheck.data.success) {
            toast.error("Please log in first");
            navigate('/login');
            return;
          }
        } catch (authError) {
          console.log("Auth check failed:", authError);
          toast.error("Please log in first");
          navigate('/login');
          return;
        }
        
        const {data} = await axios.post(backendURL + '/auth/verify-account', { otp }, {withCredentials: true});

        if(data && data.success){
            toast.success(data.message);
            await getUserData();
            navigate('/');
        }else{
          toast.error(data?.message || "Verification failed");
        }

      } catch (error) {
        console.error("Error submitting OTP: ", error);
        if (error.response?.status === 404) {
          toast.error("Server not responding. Please check if backend is running.");
        } else if (error.response?.status === 401) {
          toast.error("Please log in first");
          navigate('/login');
        } else {
          toast.error(error.message || "Failed to verify email");
        }
      }
    }

    useEffect(()=>{
      isLoggedIn && userData && userData.isAccountVerified && navigate('/');
    },[isLoggedIn,userData])

  return (
    <div className='flex items-center justify-center min-h-screen sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      
       <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

       <form className='bg-slate-900 p-8 rounded-l shadow-lg w-96 text-sm' onSubmit={onSubmitHandler}>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6 digit OTP sent to your email</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
           {Array(6).fill(0).map((_,index)=>(
            <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md' ref={e => inputRefs.current[index] = e} onInput={(e)=> handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}/>
           ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-900 text-white rounded-full cursor-pointer'>Verify Email</button>
       </form>
    </div>
  )
}

export default VerifyEmail;
