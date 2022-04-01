import React from 'react'
import { useContext } from 'react'
import { GlobalStoreContext, connect, operations } from '../store'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const modules = {
        toolbar: [
          ['bold', 'italic'],
          ['image']
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        },
      }
  

    function handleChangeText(content, delta, source, editor) {
        console.log(delta)
    }

    return (
        <ReactQuill theme='snow' modules={modules} onChange={handleChangeText}/>
    );
}

export default WorkspaceScreen;