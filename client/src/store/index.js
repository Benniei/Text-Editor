import { createContext, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import api from '../api'

export const GlobalStoreContext = createContext({})

export const GlobalStoreActionType = {
    CURRENT_DOC: "CURRENT_DOC",
    ALL_LIST: "ALL_LIST"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        ip: "localhost",
        allDocuments: [],
        currentDocument: null
    });

    const navigate = useNavigate();

    const storeReducer = (action) => {
        const {type, payload} = action;
        switch(type) {
            case GlobalStoreActionType.CURRENT_DOC: {
                return setStore({
                    ip: store.ip,
                    allDocuments: store.allDocuments,
                    currentDocument: payload
                })
            }
            case GlobalStoreActionType.ALL_LIST: {
                return setStore({
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

    store.homePage = async function () {
        navigate("/home", {replace: true});
        storeReducer({
            type: GlobalStoreActionType.ALL_LIST,
            payload: store.allDocuments
        })
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

    

    store.setCurrentDocument = async function (docid) {
        // Create UID
        let currDoc = store.allDocuments.find(x => x.docid === docid)
        // Set to Workspace Screen
        navigate("/doc/edit/" + docid, {replace: true})
        storeReducer({
            type: GlobalStoreActionType.CURRENT_DOC,
            payload: currDoc
        })
        
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

async function connect(docid, uid) {
    console.log(docid, uid)
    await api.connect(docid, uid);
}

async function operations(docid, uid, delta) {
    await api.operation(docid, uid, delta.ops);
}

export {
    connect,
    operations
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };