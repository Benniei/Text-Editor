import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { GlobalStoreContext, operations } from '../store'
import { useNavigate, useParams } from 'react-router-dom'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';


function WorkspaceScreen() {
    const {store} = useContext(GlobalStoreContext);

    let ip = store.ip
    const [listening, setListening] = useState(false);
    // Used to navigate to other links
    const navigate = useNavigate();
    const {uid} = useParams();
    useEffect(() => {
        

        // if(!listening) {
        //     const events = new EventSource('http://' + ip + ':4000/doc/connect/' + clientID)

        //     events.onmessage = (event) => {
        //         var parsedData = JSON.parse(event.data); 

        //         console.log(parsedData)
        //         // Case 1: First time connecting
        //         if (parsedData.content) {
        //             quill.setContents(parsedData.content)
        //         }
        //         // Case 2: Getting updates
        //         else {
        //             quill.updateContents(parsedData);
        //         }
        //     }

        //     setListening(true);
        // }

        const toolbarOptions = ['bold', 'italic', 'image'];
        const options = {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions,
        }
        };
        let quill = new Quill('#editor', options);

        quill.on('text-change', function (delta, oldDelta, source) {
            if (source !== 'user') return;
            operations(uid, delta);
        });

    }, [navigate])
    
   

    return (
        <div style={{ margin: '5%', border: '1px solid' }}>
            <div id='editor'></div>
        </div>
    );
}

export default WorkspaceScreen;