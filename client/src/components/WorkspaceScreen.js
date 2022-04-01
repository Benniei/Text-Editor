import React from 'react'
import { useContext, useEffect } from 'react'
import { GlobalStoreContext, connect, operations } from '../store'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const navigate = useNavigate()
    const modules = {
        toolbar: [
          ['bold', 'italic'],
          ['image']
        ]
    }
    const {id} = useParams()

    useEffect(() => {
        function uniqueID() {
            return Math.floor(Math.random() * Date.now())
        }
    
        if(!id){
            let uniq = uniqueID()
            let newurl = "/connect/" + uniq.toString()
            navigate(newurl)
        }
        else {
            connect(id);
        }
    }, [id, navigate])
    
  

    function handleChangeText(content, delta, source, editor) {
        operations(id, delta)
    }

    return (
        <ReactQuill theme='snow' modules={modules} onChange={handleChangeText}/>
    );
}

export default WorkspaceScreen;