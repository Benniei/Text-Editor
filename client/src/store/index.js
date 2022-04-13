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

    store.loadAllList = async function () {
        const response = await api.listCollection();
        if(response.status === 200) {
            let allList = JSON.parse(response.data.substring(5));
            storeReducer({
                type:GlobalStoreActionType.ALL_LIST,
                payload: allList
            })
        }
    }

    store.createDocument = async function (name) {
        const response = await api.createCollection({name: name});
        if(response.status === 200) {
            let list = store.allDocuments
            list.unshift(response.data)
            storeReducer({
                type:GlobalStoreActionType.ALL_LIST,
                payload: list
            })
        }
    }

    store.deleteDocument = async function (docid) {
        const response = await api.deleteCollection({docid: docid});
        if(response.status === 200) {
            let list = store.allDocuments
            list = list.filter(function(value, index, arr){
                return value.docid !== docid
            })
            storeReducer({
                type:GlobalStoreActionType.ALL_LIST,
                payload: list
            })
        }
    }

    function uniqueID() {
        return Math.floor(Math.random() * Date.now())
    }

    store.setCurrentDocument = async function (docid) {
        // Create UID
        let uid = uniqueID();
        // Send to backend
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

async function operations(id,  delta) {
    await api.operation(id, delta.ops);
}

export {
    operations
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };