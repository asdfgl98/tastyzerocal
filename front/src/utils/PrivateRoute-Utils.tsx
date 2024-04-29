import { ReactElement } from "react";
import { Navigate, Outlet} from "react-router-dom";

interface PrivateRouteProps {
    authentication: boolean
    accessToken: string
}


const PrivateRoute =({authentication, accessToken}: PrivateRouteProps, ):React.ReactElement | null =>{
    if(authentication){
       return accessToken === "" ? <Navigate to='/user'/> : <Outlet/>     
    }
    else{
        return accessToken !== "" ? <Navigate to='/'/> : <Outlet/> 
    }
}

export default PrivateRoute