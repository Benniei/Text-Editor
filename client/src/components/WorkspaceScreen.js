import React from 'react'
import { useEffect, useState} from 'react'
import { connect, operations } from '../store'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

function WorkspaceScreen() {
    const [value, setValue] = useState('');
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
    }, [id, navigate])
    
  

    function handleChangeText(content, delta, source, editor) {
        setValue(content);
        operations(id, delta);
    }

    return (
        <ReactQuill theme='snow' value={value} modules={modules} onChange={handleChangeText}/>
    );
}

export default WorkspaceScreen;