import React from 'react'
import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [value, setValue] = useState('');

    return (
        <ReactQuill theme='snow' value={value} onChange={setValue}/>
    );
}

export default WorkspaceScreen;