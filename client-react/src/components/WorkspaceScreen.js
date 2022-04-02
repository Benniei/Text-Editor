import React from 'react'
import { useEffect, useState} from 'react'
import { connect, operations } from '../store'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

function WorkspaceScreen() {
    const [value, setValue] = useState('');
    const [listening, setListening] = useState(false);
    // Used to navigate to other links
    const navigate = useNavigate();
    const modules = {
        toolbar: [
          ['bold', 'italic'],
          ['image']
        ]
    };
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
                console.log(data)
                setValue(data)
            }

            setListening(true);
        }
    }, [id, navigate])
    
  

    function handleChangeText(content, delta, source, editor) {
        if(source !== 'user') return;
        setValue(content);
        operations(id, delta);
    }

    return (
        <ReactQuill theme='snow' value={value} modules={modules} onChange={handleChangeText}/>
    );
}

export default WorkspaceScreen;