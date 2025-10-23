import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

axios.defaults.withCredentials = true;

// Add interceptor to include Authorization header if token exists in localStorage
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
}); 

export const AppProvider = (props) => {
 
    const backendURL = import.meta.env.VITE_API_URL
   
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userData, setUserData] = useState(null);

    const getAuthState = async ()=>{
        try {
            const {data} = await axios.get(backendURL + '/auth/is-auth', {withCredentials: true});

            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(backendURL + '/user/userData', {withCredentials: true});
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const value = {
        backendURL,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}