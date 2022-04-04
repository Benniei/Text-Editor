import React from 'react'
import { useEffect, useState} from 'react'
import { connect, operations } from '../store'
import { useNavigate, useParams } from 'react-router-dom'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';


function WorkspaceScreen() {
    let ip = '209.151.155.105'
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
            let newurl = "/client/" + uniq.toString();
            navigate(newurl);
            window.location.reload();
            connect(uniq);
        }

        if(!listening) {
            const events = new EventSource('http://' + ip + ':4000/connect/' + clientID)

            events.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                // Case 1: First time connecting
                if (parsedData.content) {
                    console.log(parsedData)
                    quill.setContents(parsedData.content)
                }
                // Case 2: Getting updates
                else {
                    console.log(parsedData.data.ops)
                    let oper = parsedData.data.ops
                    quill.updateContents(oper);
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