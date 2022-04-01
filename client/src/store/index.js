import { createContext, useState} from 'react';
import api from '../api'

export const GlobalStoreContext = createContext({})

export const GlobalStoreActionType = {
    CONNECT: "CONNECT",
    OPERATION: "OPERATION",
    GET_DOC: "GET_DOC"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        clientID: null
    });

    const storeReducer = (action) => {
        const {type, payload} = action;
        switch(type) {
            case GlobalStoreActionType.CONNECT: {
                return setStore({
                    clientID: payload
                })
            }
            case GlobalStoreActionType.OPERATION: {
                return setStore({
                    clientID: store.payload
                })
            }
            case GlobalStoreActionType.GET_DOC: {
                return setStore({
                    clientID: store.payload
                })
            }
            default:
                return store;
        }
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

async function connect(id) {
    let response = await api.connect(id);
    if(response.data.success){
        console.log("Connect Success")
    }
}

async function operations(id,  delta) {
    let response = await api.operation(id, {
        data: [delta]
    });
    if(response.data.success){
        console.log("Operation Success")
    }
}

async function getDoc() {

}

async function getAllDoc() {

}

export {
    connect,
    operations,
    getDoc,
    getAllDoc
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };