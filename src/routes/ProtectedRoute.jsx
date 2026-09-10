import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Spinner from "../components/Spiner";

export default function ProtectedRoute(){
    const {isAuth, authLoading} = useAuth();

    if (authLoading) {
        return (
            <div style={{display:"flex", justifyContent:'center', width:'100%', margin:'0px', alignItems: "center", height: '100vh'}}>
                <Spinner w={200} h={200}/>  
            </div>
        )
    }
    if(!isAuth){
        return <Navigate to='/login' replace />
    }
    else{
        return <Outlet />
    }
}