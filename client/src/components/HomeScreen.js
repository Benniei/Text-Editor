import React from 'react'
import {useContext} from 'react'
import {GlobalStoreContext, connect} from '../store'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function HomeScreen() {
    const {store} = useContext(GlobalStoreContext);

    let listCards = "";
    if (store) {
        // listCards = store.docIDs.map((id) => (
        //     <Box sx={{}} 
        //          onClick={function() {/* Insert function that leads to WorkspaceScreen */}}>
        //          <Typography>
        //             {id}
        //          </Typography>
        //     </Box>
        // ))
    }

    return(
        <div>
        </div>
    );
}

export default HomeScreen;