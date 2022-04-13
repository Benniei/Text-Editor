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
    const { docid, docName, docTime } = props;

    /** BOX 1: NAME
     *  BOX 2: LIKE, DISLIKE (only shows if logged in), DELETE (only shows if logged in user owns list)
     */
    let d = new Date(docTime);
    const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
    ]
    let date = months[d.getMonth()] + " " + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    
    const classlist = "list-item " + docid;
    let cardElement =
        <ListItem
            id={docid}
            shape={{borderRadius: 8}}
            style={{
                width: '100%',
                borderCollapse: 'separate',
                border: '1px solid black'
            }}
            className={classlist}
            onClick={function(event) {
                if(!event.target.disabled) {
                    store.setCurrentDocument(docid)
                }
            }}
        >
            <Box sx={{width: '150%'}}>Name: {docName} (ID: {docid})</Box>
            <Box sx={{width: '200%'}}>Last modified: {date}</Box>
            <Box sx={{width: '70%'}}><Button
                    onClick={function() {store.deleteDocument(docid)}}>
                Delete
            </Button></Box>
            
        </ListItem>

    return (
        cardElement
    );
}

export default DocCard;