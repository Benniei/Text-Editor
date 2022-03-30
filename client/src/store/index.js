import { createContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'

export const GlobalStoreContext = createContext({})

export const GlobalStoreActionType = {
    CONNECT: "CONNECT",
    OPERATION: "OPERATION",
    GET_DOC: "GET_DOC"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentList: null
    });
    const navigate = useNavigate();

    const storeReducer = (action) => {
        const {type, payload} = action;
        switch(type) {
            case GlobalStoreActionType.CONNECT: {
                return setStore({
                    currentList: payload
                })
            }
            case GlobalStoreActionType.OPERATION: {
                return setStore({
                    currentList: store.payload
                })
            }
            case GlobalStoreActionType.GET_DOC: {
                return setStore({
                    currentList: store.payload
                })
            }
            default:
                return store;
        }
    }

    async function getAllList() {
        
    }

    async function connect() {

    }

    async function operation() {

    }

    async function getDoc() {

    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}



export default GlobalStoreContext;
export { GlobalStoreContextProvider };