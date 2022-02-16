import React from 'react'
import { Link } from 'react-router-dom'
import ImageLoader from '../ImageLoader/imageLoader'
import poweredLogo from '../../../img/powered-by.png'
import projectLogo from '../../../img/pistolshrimp.png'
import './footer.css'

import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'

const Footer = ({}) => {
    const matches = useMediaQuery('(max-width:500px)')

    return (
    !matches ? 
        <div className="footer">
            <div className="left">
                <a href="https://vitalpoint.ai">
                    <ImageLoader image={projectLogo} style={{height: "4em", marginTop: '8px'}} /><br></br>
                    <Typography variant="body2" style={{fontSize: '90%'}}>by Pistol Shrimp</Typography>
                </a>
            
                <div className="footertext">
                <Typography variant="body2" style={{fontSize: '90%'}}>by Pistol Shrimp<br></br>
                    Open Web Devs<br></br>
                    <a href="mailto:a.luhning@vitalpoint.ai">Contact</a></Typography>
                
                </div>
            </div>
            <div align="center">
                <Link to="/">
                <ImageLoader image={poweredLogo} style={{height: "6em", marginLeft: '-90px'}} />
                </Link>
            </div>
            <div className="footerright">
            <Typography variant="body2" style={{fontSize: '90%'}}>Space Gem<br></br>
            Open-source/as is.<br></br>Use at own risk.<br></br>
            <span className="blue">Privacy<span className="black"> | </span>TOS</span></Typography>
        </div>
        </div>
        :
        <>
        <div className="footer-mobile">
        <div className="left">
            <a href="https://vitalpoint.ai">
                <ImageLoader image={projectLogo} style={{height: "4em", marginTop: '-8px'}} />
            </a>
            <br></br>
            <Typography variant="body2" style={{fontSize: '90%'}}>by Pistol Shrimp</Typography>
        
           
        </div>
        <div align="center">
            <Link to="/">
            <ImageLoader image={poweredLogo} style={{height: '3.5em', marginTop:'8px'}} />
            </Link>
        </div>
        <div className="footerright">
            <Typography variant="body2" style={{fontSize: '90%'}}>Space Gem<br></br>
            Open-source/as is.<br></br>
            Use at own risk.</Typography>
        </div>
        </div>
        </>
    )
}

export default Footer