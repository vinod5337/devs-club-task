import React, { createContext, useReducer } from 'react';
import AppReducer from './appReducer';
import { setUserToken } from './appActions';

const initialState = {
    token: '',
    API_URL: 'http://localhost:8000/api/'
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    function setToken(data) {
        dispatch(setUserToken(data));
    }

    return (
        <GlobalContext.Provider
            value={{
                token: state.token,
                setToken,
                API_URL: state.API_URL,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};