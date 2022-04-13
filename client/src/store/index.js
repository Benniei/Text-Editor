import { createContext, useState} from 'react';
import api from '../api'

export const GlobalStoreContext = createContext({})

export const GlobalStoreActionType = {
    CURRENT_DOC: "CURRENT_DOC",
    ALL_LIST: "ALL_LIST"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        clientID: null,
        ip: "localhost",
        allDocuments: [],
        currentDocument: null
    });

    const storeReducer = (action) => {
        const {type, payload} = action;
        switch(type) {
            case GlobalStoreActionType.CURRENT_DOC: {
                return setStore({
                    clientID: store.payload,
                    ip: store.ip,
                    allDocuments: [],
                    currentDocument: payload
                })
            }
            case GlobalStoreActionType.ALL_LIST: {
                return setStore({
                    clientID: store.payload,
                    ip: store.ip,
                    allDocuments: payload,
                    currentDocument: null
                })
            }
            default:
                return store;
        }
    }

    store.loadAllList = async function() {
        const response = await api.listCollection();
        if(response.status === 200) {
            let allList = JSON.parse(response.data.substring(5));
            storeReducer({
                type:GlobalStoreActionType.ALL_LIST,
                payload: allList
            })
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
    await api.operation(id, delta.ops);
}

async function createCollection(name) {
    await api.createCollection(name);
}

async function getDoc() {

}

async function getAllDoc() {

}

export {
    connect,
    operations,
    createCollection,
    getDoc,
    getAllDoc
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };