import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { GlobalStoreContext, connect, operations, presence } from '../store'
import AuthContext from '../auth/index.js'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import QuillCursors from 'quill-cursors';
import { ImageUpload } from 'quill-image-upload';

Quill.register('modules/cursors', QuillCursors);
Quill.register('modules/imageUpload', ImageUpload);

function WorkspaceScreen() {
    const {store} = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    let ip = store.ip
    
    const [listening, setListening] = useState(false);
    const [user, setUser] = useState("");

    var docid = store.currentDocument.docid

    

    useEffect(() => {
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
            },
            cursors:{
                transformOnTextChange: true,
              }
        }
        };
        
        let quill = new Quill('#editor', options);

        function uniqueID() {
            return Math.floor(Math.random() * Date.now())
        }

        // function random_rgba() {
        //     var o = Math.round, r = Math.random, s = 255;
        //     return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
        // }

        var uid;
        var versionData;
        if(!listening) {
            uid = uniqueID()
            setUser(uid)
            const events = new EventSource('http://' + ip + '/doc/connect/' + docid + '/' + uid)

            events.onmessage = (event) => {
                var parsedData = JSON.parse(event.data); 
                
                console.log(parsedData)
                // First time connecting
                if (parsedData.first) {
                    versionData = parsedData.version
                    quill.setContents(parsedData.content)
                }
                else if (!parsedData.first){
                    versionData = parsedData.version
                    quill.updateContents(parsedData.content);
                }
                // Presence Data
                else if (parsedData.presence) {
                    let presenceData = parsedData.presence
                    let cur_name = presenceData.name? presenceData.name: presenceData.uid
                    // console.log(cur_name)
                    // if(cursor[presenceData.uid]){
                        
                    // }
                    // else{
                        // const cursor = quill.getModule('cursors');
                        // cursor.createCursor('cursor', cur_name, 'red');
                        // setTimeout(() => cursor.moveCursor('cursor', presenceData.index), 1000);
                    // }
                }
                // Getting updates
                
            }

            setListening(true);
        }

        

        quill.on('text-change', function (delta, oldDelta, source) {
            if (source !== 'user') return;
            console.log(versionData)
            operations(docid, uid, delta, versionData);
        });

        quill.on('selection-change', function(range, oldRange, source) {
            if (range) {
                presence(docid, uid, range.index, range.length, auth.user.name)
            } 
        });

    }, [])
   

    return (
        <div>
            <Stack direction="row" mb={-10} mt={5} ml={9}>
                <h1 style={{ marginleft: '5%'}}>{store.currentDocument.name} ({store.currentDocument.docid})</h1>
                <h2>User: {auth.user.name}</h2>
                <h2>{user}</h2>
                <Button id="create-doc-button"
                            onClick={function(){store.homePage()}}>
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