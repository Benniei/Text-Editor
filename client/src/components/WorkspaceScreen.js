import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { GlobalStoreContext, connect, operations } from '../store'
import AuthContext from '../auth/index.js'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { ImageUpload } from 'quill-image-upload';


function WorkspaceScreen() {
    const {store} = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    let ip = store.ip
    
    const [listening, setListening] = useState(false);

    var docid = store.currentDocument.docid
    var uid = store.currentDocument.uid

    Quill.register('modules/imageUpload', ImageUpload);

    useEffect(() => {

        if(!listening) {
            const events = new EventSource('http://' + ip + ':4000/doc/connect/' + docid + '/' + uid)

            events.onmessage = (event) => {
                var parsedData = JSON.parse(event.data); 

                console.log(parsedData)
                // Case 1: First time connecting
                if (parsedData.content) {
                    quill.setContents(parsedData.content)
                }
                // Case 2: Getting updates
                else {
                    quill.updateContents(parsedData);
                }
            }

            setListening(true);
        }

        const toolbarOptions = ['bold', 'italic', 'image'];
        const options = {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions,
            imageUpload: {
                url: '', 
                method: 'POST', 
                name: 'image', 
                withCredentials: true, 
                callbackOK: (serverResponse, next) => {
                    next(serverResponse);
                },
                callbackKO: serverError => {
                    alert(serverError);
                }
            }
        }
        };
        let quill = new Quill('#editor', options);

        quill.on('text-change', function (delta, oldDelta, source) {
            if (source !== 'user') return;
            operations(docid, uid, delta);
        });

    }, [])
   

    return (
        <div>
            <Stack direction="row" mb={-10} mt={5} ml={9}>
                <h1 style={{ marginleft: '5%'}}>{store.currentDocument.name} ({store.currentDocument.docid}) ({uid})</h1>
                <h2>User: {auth.user.name}</h2>
                <Button id="create-doc-button"
                            onClick={function(){store.loadAllList()}}>
                        Back
                    </Button>
                
            </Stack>
            
            <div style={{ margin: '5%', border: '1px solid' }}>
                <div id='editor'></div>
            </div>
        </div>
    );
}

export default WorkspaceScreen;