import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    USER_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    ERROR_CODE: "ERROR_CODE",
    SET_LOGGED_OUT: "SET_LOGGED_OUT"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        error: null
    });

    useEffect(() => {
        auth.userLoggedIn();
    }, []);

    const navigate = useNavigate();

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.USER_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                });
            }
            case AuthActionType.ERROR_CODE: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorCode: payload.errorCode
                });
            }
            case AuthActionType.SET_LOGGED_OUT: {
                return setAuth({
                    loggedIn: false
                })
            }
            default:
                return auth;
        }
    }

    auth.userLoggedIn = async function () {
        const response = await api.userLoggedIn();
        if (response.data.status !== "ERROR") {
            console.log(response.data.user)
            authReducer({
                type: AuthActionType.USER_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userData, store) {
        const response = await api.signup(userData);  
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            navigate('/login',  {replace: true});
        }
        else if(response.status === 400) {
            auth.setErrorCode(response.data.errorMessage);
        }
    }

    auth.loginUser = async function(userData, store) {
        const response = await api.loginUser(userData);
        if (response.data.status !== "ERROR") {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            navigate('/home',  {replace: true})
        }
        // Store.get all list
        else if(response.status === 400) {
            auth.setErrorCode(response.data.errorMessage);
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            console.log(response)
            authReducer({
                type: AuthActionType.SET_LOGGED_OUT,
                payload: {
                    loggedIn: !response.data.loggedIn,
                    user: response.data.user
                }
            });
            navigate('/',  {replace: true})
        }
    }

    auth.setErrorCode = async function(code) {
        authReducer({
            type: AuthActionType.ERROR_CODE,
            payload: {
                user: auth.user,
                loggedIn: auth.loggedIn,
                errorCode: code
            }
        })
    }

    auth.getErrorCode = function() {
        return auth.errorCode;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };