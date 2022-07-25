/////////////////////////////////////////////
// Author: Sajib Hosen //////////////////////
// Date: 25.07.2022 /////////////////////////
// Email: sajib.201h@gmail.com //////////////
/////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import firebaseInit from './firebaseConfig/firebase.init';
import { createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, getIdToken, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

firebaseInit();
const useFirebase = () => {
    const [theUser, setTheUser] = useState({});
    const [idToken, setIdToken] = useState('');
    const [isLoading, setIsLoading]= React.useState(false);
    const [isVerifyEmailSend, setIsVerifyEmailSend ] = useState(false);
    
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();



    // sign in with google - POPUP ==========================
    const googleSignIn =( navigate )=>{
        setIsLoading(true);
        signInWithPopup(auth, googleProvider)
        .then((result)=>{
            if(result.user.email ){
                navigate('/home');
                localStorage.setItem('login', 'true');
            }
        })
        .catch((error)=>{
            alert(error.message)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }



    // sign in with facebook - POPUP =========================
    const facebookSignIn = ( navigate )=>{
        setIsLoading(true)
        signInWithPopup( auth, facebookProvider)
        .then((result)=>{
            navigate('/home');
            localStorage.setItem('login', 'true');
        })
        .catch((error)=>{
            alert(error.message)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }



    // registration new user with email and password =======
    const registerUser = (name, email, password, navigate) =>{
        setIsLoading(true)
        createUserWithEmailAndPassword( auth, email, password)
        .then((result) =>{
            const user = result.user;
            verifyEmail( navigate ) // send a Email for email verification
            navigate('/');
        })
        .catch((error)=>{
            alert(error.message)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }





    // verifing email -> used in registerUser function
    const verifyEmail = ( )=>{ 
        setIsLoading(true)
        sendEmailVerification(auth.currentUser)
        .then(()=>{
            alert('Email send for verification')
            setIsVerifyEmailSend(true)
        })
        .catch((error)=>{
            alert(error.message);
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }




    //login with email and password ========================
    const loginWithPassword= ( email, password, navigate, location)=>{
        setIsLoading(true)
        signInWithEmailAndPassword( auth, email, password)
        .then((result)=>{
            const destination = location.state?.from?.pathname || '/home';
            navigate(destination, {replace: true});
            localStorage.setItem('login', 'true');
        })
        .catch((error)=>{
            alert( error.message )
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }




    // logOut user ========================================
    const logOutUser = ( navigate )=>{
        signOut(auth)
        .then(()=>{
            setTheUser({});
            localStorage.clear();
            navigate('/')
        })
        .catch((error)=>{
            alert(error.message)
        })

    }


    // logOut user ========================================
    const logOutUserUnverified = ()=>{
        setIsLoading(true)
        signOut(auth)
        .then(()=>{
            localStorage.clear();
            // setCurrentUser({});
        })
        .catch((error)=>{
            alert(error.message)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }


    

    // Reset user password ===============================
    const resetPassword = (email)=>{
        setIsLoading(true)
        sendPasswordResetEmail(auth, email)
        .then(()=>{
            alert('Email send, Reset password via email');
        })
        .catch((error)=>{
            alert(error.message);
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }


    //current user observer =========================
    useEffect(()=>{  
        const unsubscribed = onAuthStateChanged(auth ,( user ) =>{
                if(user?.email){
                    getIdToken(user)
                    .then((token) =>{
                        setIdToken(token)
                    });
                    const cUser = {
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        emailVerified: user.emailVerified,
                    }
                    setTheUser( cUser );
                }
                // else if(!user?.emailVerified){
                //     logOutUserUnverified()
                //     setCurrentUser({});
                // }
                else{
                    console.log('No user avalable')
                }
            })
        return () => unsubscribed;
    },[auth]);


    
    return {
        googleSignIn,
        facebookSignIn,
        registerUser,
        loginWithPassword,
        logOutUser,
        resetPassword,
        theUser,
        isLoading,
    };
};

export default useFirebase;