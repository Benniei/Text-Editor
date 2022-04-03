import React from 'react'
import { useEffect, useState} from 'react'
import { connect, operations } from '../store'
import { useNavigate, useParams } from 'react-router-dom'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function WorkspaceScreen() {
    const [listening, setListening] = useState(false);
    // Used to navigate to other links
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        function uniqueID() {
            return Math.floor(Math.random() * Date.now())
        }

        let clientID = id;
        // Route to unique client ID
        if(!id){
            let uniq = uniqueID();
            clientID = uniq;
            let newurl = "/connect/" + uniq.toString();
            navigate(newurl);
            window.location.reload();
            connect(uniq);
        }

        if(!listening) {
            const events = new EventSource('http://' + 'localhost'+ ":4000/api/connect/" + clientID)

            events.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                // Case 1: First time connecting
                if (parsedData.content) {
                    console.log(parsedData.content.ops)
                    quill.setContents(parsedData.content.ops)
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
        }
        };
        let quill = new Quill('#editor', options);

        quill.on('text-change', function (delta, oldDelta, source) {
            if (source !== 'user') return;
            operations(id, delta);
        });

    }, [id, navigate])
    
   

    return (
        <div style={{ margin: '5%', border: '1px solid' }}>
            <div id='editor'></div>
        </div>
    );
}

export default WorkspaceScreen;