import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Quill from 'quill/core'


function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);

    var quill = new Quill('#editor-container', {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                ['image']
            ]
        },
        placeholder: 'The loathsome Dung Eater',
        theme: 'snow'
    })

    return (
        <h1>
            return quill
        </h1>
    )
}

export default WorkspaceScreen;