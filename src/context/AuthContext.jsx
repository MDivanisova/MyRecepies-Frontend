import { createContext, useContext, useEffect, useState } from "react";


export const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(()=>{
       const localStorageToken = localStorage.getItem("token");
       const localStorageUser = JSON.parse(localStorage.getItem("user"));

       if(localStorageToken){
        setToken(localStorageToken);
       }
       if(localStorageUser){
        setUser(localStorageUser);
       }

       setAuthLoading(false);
       
    },[]);

    useEffect(()=>{
        if(token){
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        }
        else{
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    },[token, user])

    function login(newToken, newUser){
        
        setToken(newToken);
        setUser(newUser);
    }

    function logout(){
        setToken(null);
        setUser(null);
    }

    const value = {
        token,
        user,
        login,
        logout,
        isAuth: !!token,
        authLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>)
}
