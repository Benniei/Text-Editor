import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalStoreContext, accessMedia, operations, presence } from '../store'
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

    let ip = "209.151.154.192"
    
    const [listening, setListening] = useState(false);

    console.log(auth)
    var name = store.currentDocument ? store.currentDocument.name: "N/A";
    var docid = useParams().docid;
    var loginuser = auth.user ? auth.user.name: "N/A"

    useEffect(() => {
        const toolbarOptions = ['bold', 'italic', 'image'];
        const options = {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions,
            imageUpload: {
                url: 'http://' + ip + '/media/upload', 
                method: 'POST', 
                name: 'file', 
                withCredentials: true, 
                callbackOK: async (serverResponse, next) => {
                    let response = await accessMedia(serverResponse.mediaid);
                    if(response){
                        // var binary = '';
                        // var bytes = new Uint8Array( response.data );
                        // for (var i = 0; i < bytes.byteLength; i++) {
                        //     binary += String.fromCharCode( bytes[ i ] );
                        // }
                        // let bin = 'data:image/png;base64,' + window.btoa( binary );

                        next(response);
                    }
                },
                callbackKO: serverError => {
                    alert(serverError);
                },
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

        function random_rgba() {
            var o = Math.round, r = Math.random, s = 255;
            return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
        }

        var uid;
        var versionData;
        if(!listening) {
            uid = uniqueID()
            const events = new EventSource('http://cloud-peak.cse356.compas.cs.stonybrook.edu/doc/connect/' + docid + '/' + uid)

            events.onmessage = (event) => {
                var parsedData = JSON.parse(event.data); 
                
                console.log(parsedData)
                // First time connecting
                if (Array.isArray(parsedData)) {
                    quill.updateContents(parsedData)
                }
                else if (parsedData.content){
                    versionData = parsedData.version
                    quill.updateContents(parsedData.content);
                }
                // Presence Data
                else if (parsedData.presence) {
                    let presenceData = parsedData.presence
                    let cur_name = presenceData.name? presenceData.name: presenceData.uid
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
                presence(docid, uid, range.index, range.length, name)
            } 
        });

    }, [])
   

    return (
        <div>
            <Stack direction="row" mb={-10} mt={5} ml={9}>
                <h1 style={{ marginleft: '5%'}}>{name} ({docid})</h1>
                <h2>User: {loginuser}</h2>
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