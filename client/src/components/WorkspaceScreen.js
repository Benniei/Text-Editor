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
            connect(uniq);
        }
        /** else {
                // Create a connection to document with unique ID
                navigate("/connect/" + id);
            * THE ABOVE IS NOT NEEDED. IF AN ID IS PARAMS, THE ROUTER WILL
            * CALL THE CONNECT FUNCTION ANYWAYS
        }*/

        if(!listening) {
            const events = new EventSource('http://' + 'localhost'+ ":4000/api/connect/" + clientID)

            events.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                console.log(parsedData)
                // Case 1: First time connecting
                if (parsedData.content) {
                    console.log()
                    let merged = parsedData.content.flat(1)
                    let data = {
                        ops: merged
                    }
                    quill.setContents(data)
                }
                // Case 2: Getting updates
                else {
                    let merged = parsedData.flat(1)
                    let data = {
                        ops: merged
                    }
                    console.log(data);
                    quill.updateContents(data);
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