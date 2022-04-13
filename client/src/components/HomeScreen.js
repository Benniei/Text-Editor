import React, { useState } from 'react'
import {useContext, useEffect} from 'react'
import {GlobalStoreContext, createCollection} from '../store'
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
        store.loadAllList();
    }, []);

    let name = auth.userLoggedIn().loggedIn ? auth.user.name : "owo" // For testing purposes
    let docCards = "";
    console.log(store.allDocuments);
    if (store) {
        docCards = 
            <Box sx={{}}> 
            {
                store.allDocuments.map((doc) => (
                   <DocCard 
                        docID={doc.id}
                        docName={doc.name}
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
                        onClick={function(){createCollection({name: text})}}>
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