import React from 'react'
import { Link } from 'react-router-dom'
import ImageLoader from '../common/ImageLoader/imageLoader'
import spaceGemLogo from '../../img/space-gem-logo-3.png'
import office from '../../img/office.png'
import parking from '../../img/parking.png'
import { login } from '../../state/near'

// Material UI Components
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      },
    center: {
        textAlign: 'center',
        fontWeight: 700,
        paddingTop: 30, 
        paddingBottom: 60, 
    },
    button: {
        width: '80%',
        fontSize: '40px'
    }
}));

const LandingNotSignedIn = () => {
    const classes = useStyles()
    const matches = useMediaQuery('(max-width:500px)')

    return(
    <>
   {!matches ?
        <Grid container justifyContent="center" alignItems="center" spacing={3} >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginTop: '50px', marginBottom: '25px'}}>
                <ImageLoader image={spaceGemLogo} style={{width:'70%'}}/>
            </Grid> 
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h5" align="center">
                   Find Your Space.
                </Typography>
                <Typography variant="h4" align="center" style={{marginBottom: '20px'}}>
                   Claim your Gem.
                </Typography><br></br>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={login}
                >
                    <Typography variant="body1" style={{fontSize: '40px'}}>
                        Get Started
                    </Typography>
                </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{marginTop: '40px', paddingLeft: '40px'}} align="center">
                <Typography variant="body1" align="center">
                    Space Gem directly connects space owners with people needing space for work or parking.  No middle person.  No fuss.
                </Typography>
            </Grid>
        </Grid>
    :
        <Grid container justifyContent="center" alignItems="center" spacing={3} >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginTop: '50px', marginBottom: '25px'}}>
        <ImageLoader image={spaceGemLogo} style={{width:'70%'}}/>
        </Grid> 
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="h5" align="center">
            Find Your Space.
            </Typography>
            <Typography variant="h4" align="center" style={{marginBottom: '20px'}}>
            Claim your Gem.
            </Typography><br></br>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={login}
            >
                <Typography variant="body1" style={{fontSize: '40px'}}>
                    Get Started
                </Typography>
            </Button>

        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{marginTop: '40px', paddingLeft: '40px'}} align="center">
            <Typography variant="body1" align="center">
                Space Gem directly connects space owners with people needing space for work or parking.  No middle person.  No fuss.
            </Typography>
        </Grid>
        </Grid>
    }    
    </>
    )
}

export default LandingNotSignedIn