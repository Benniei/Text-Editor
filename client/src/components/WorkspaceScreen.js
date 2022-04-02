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

        // Route to unique client ID
        if(!id){
            let uniq = uniqueID();
            let newurl = "/connect/" + uniq.toString();
            navigate(newurl);
        }
        else {
            // Create a connection to document with unique ID
            connect(id);
        }

        if(!listening) {
            const events = new EventSource('http://' + 'localhost'+ ":4000/api/connect/" + id)
            
            events.onmessage = (event) => {
                const parsedData = JSON.parse(event.data).data;
                let merged = parsedData.flat(1)
                let data = {
                    ops: merged
                }
                console.log(data);
                quill.updateContents(data);
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