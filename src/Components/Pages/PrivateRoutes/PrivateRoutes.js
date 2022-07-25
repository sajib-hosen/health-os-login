
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useFirebase from '../../Hooks/useFirebase';


const PrivateRoutes = ({children, ...rest}) => {

    const { theUser } = useFirebase();
    const location = useLocation();
    const isLogin = localStorage.getItem('login');


    if( isLogin === null){
        return <Navigate to="/" replace state={{from: location }} />
    };

    if( Boolean(isLogin) && !theUser?.email ){
        return <p>Loading . . .</p>
    };

    if( theUser?.email ){
        return children;
    };

};

export default PrivateRoutes;