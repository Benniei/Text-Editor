import { createContext, useContext, useState} from 'react';
import { useHistory } from 'react-router-dom'
import api from '../api'

export const GlobalStoreContext = createContext({})

export const GlobalStoreActionType = {
    CONNECT: "CONNECT",
    OPERATION: "OPERATION",
    GET_GAME: "GET_GAME"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentList: null
    });
    const history = useHistory();

    const storeReducer = (action) => {
        const {type, payload} = action;
        switch(type) {
            case GlobalStoreActionType.CONNECT: {
                return setStore({

                })
            }
            default:
                return store;
        }
    }
}