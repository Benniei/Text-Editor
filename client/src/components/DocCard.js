import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem';

import { Typography } from '@mui/material';


/*
    
*/
function DocCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { docID, docName } = props;

    let dateModified = "your mom"

    /** BOX 1: NAME
     *  BOX 2: LIKE, DISLIKE (only shows if logged in), DELETE (only shows if logged in user owns list)
     */
    let cardElement =
        <ListItem
            id={docID}
            shape={{borderRadius: 8}}
            style={{
                width: '100%',
                borderCollapse: 'separate',
                border: '1px solid black'
            }} 
        >
            <Box sx={{width: '100%'}}>{docName}</Box>
            <Box sx={{width: '100%'}}><Button
                    onClick={function(){/* Function to delete collection*/}}>
                Delete
            </Button></Box>
            <Box sx={{width: '100%'}}>Last modified {dateModified}</Box>
            
        </ListItem>

    return (
        cardElement
    );
}

export default DocCard;