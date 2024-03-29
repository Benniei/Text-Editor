import React, { useState } from 'react'
import {useContext, useEffect} from 'react'
import {GlobalStoreContext} from '../store'
import AuthContext from '../auth/index.js'
import DocCard from './DocCard.js'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function HomeScreen() {
    const {store} = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    const [text, setText] = useState("");

    useEffect(() => {
        auth.getLoggedIn();
        store.loadAllList();
    }, []);

    let name = auth.user.name// For testing purposes
    let docCards = "";
    if (store) {
        docCards = 
            <Box sx={{}}> 
            {
                store.allDocuments.map((doc) => (
                   <DocCard 
                        key={doc.docid}
                        docid={doc.docid}
                        docName={doc.name}
                        docTime={doc.time} 
                    />  
                ))
            }
            </Box>
        
    }

    return(
        <div id="doc-homescreen">
            <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', 
                            justifyContent: 'space-between', width: '100%'}}>
                <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                    Welcome, {name}!
                </Typography>
                <Button sx={{}}
                        onClick={function(){auth.logoutUser()}}>
                    Logout
                </Button>
            </Box>
            <Divider />
            <Box sx={{height: '110%'}}>
                <Typography variant="h5">
                    Create a New Document Here: 
                </Typography>
                Document Name: 
                <TextField id="doc-name-textfield"
                           onChange={function(e) {setText(e.target.value)}}></TextField>
                <Button id="create-doc-button"
                        onClick={function(){
                            if(text !== "")
                                store.createDocument(text)}}>
                    Create Document
                </Button>
            </Box>
            <Divider />
            <Box id="modify-doc-box">
                <Typography variant="h5">
                    10 Most Recently Modified Documents:
                </Typography>
                {docCards}
            </Box>
        </div>
    );
}

export default HomeScreen;