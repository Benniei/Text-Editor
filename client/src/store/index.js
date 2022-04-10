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
        clientID: null,
        ip: "localhost"
    });

    const storeReducer = (action) => {
        const {type, payload} = action;
        switch(type) {
            case GlobalStoreActionType.CONNECT: {
                return setStore({
                    clientID: payload,
                    ip: store.ip
                })
            }
            case GlobalStoreActionType.OPERATION: {
                return setStore({
                    clientID: store.payload,
                    ip: store.ip
                })
            }
            case GlobalStoreActionType.GET_DOC: {
                return setStore({
                    clientID: store.payload,
                    ip: store.ip
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
    await api.connect(id);
}

async function operations(id,  delta) {
    await api.operation(id, {
        data: delta
    });
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