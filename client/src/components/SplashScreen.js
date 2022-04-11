import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function SplashScreen() {

    return (
        <div id="splash-screen">
            <b>Collaborate Text Editor</b>
            <br></br>
            <br></br>
            <Link to='/login/'>
                <Box button className="splash-button-outer">
                    <b className="splash-link">Login</b>
                </Box>
            </Link>
            <Link to='/register/'>
            <Box button className="splash-button-outer" sx={{mt:'10px'}}>
                <b className="splash-link">Create Account</b>
            </Box>
            </Link>
        </div>
    )
}

export default SplashScreen;