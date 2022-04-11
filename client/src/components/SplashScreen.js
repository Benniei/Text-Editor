import React from 'react'
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

function SplashScreen() {

    return (
        <div id="splash-screen">
            <b>Google Docs Clone</b>
            <br></br>
            <div style={{fontSize:'2vw'}}>
                Your favorite rip-off 
                <div style={{fontSize:'1vw'}}>collaborative text editor.</div>
            </div>
            <br></br>
            <Box button className="splash-button-outer">
                <Box className="splash-button-inner">
                    <Link to='/register/' className="splash-link"><b>Create Account</b></Link>
                </Box>
            </Box>
            <Box button className="splash-button-outer">
                <Box className="splash-button-inner">
                    <Link to='/login/' className="splash-link"><b>Login</b></Link>
                </Box>
            </Box>
        </div>
    )
}

export default SplashScreen;