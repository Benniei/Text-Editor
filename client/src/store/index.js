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
        ip: "209.151.154.192",
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
            let allList = response.data;
            console.log(allList)
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
            store.loadAllList()
        }
    }

    store.deleteDocument = async function (docid) {
        const response = await api.deleteCollection({docid: docid});
        if(response.status === 200) {
            store.loadAllList()
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

async function operations(docid, uid, delta, versionData) {
    const data = {
        version: versionData,
        op: delta.ops 
    }
    await api.operation(docid, uid, data);
}

async function presence(docid, uid, index, length, name) {
    const payload = {
        index: index,
        length: length,
        name: name
    }
    await api.presence(docid, uid, payload);
}

async function accessMedia(id) {
    console.log(id)
    let response = await api.accessMedia(id);
    console.log(response.data)
    if(response.status === 200) return response.data.image;
}

export {
    connect,
    operations,
    presence,
    accessMedia
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };