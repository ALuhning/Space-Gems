import React, {useState, useEffect, useContext} from 'react'
import { appStore, onAppMount } from '../../../state/app'
import { Link } from 'react-router-dom'
import LeftSideDrawer from '../LeftSideDrawer/leftSideDrawer'
import LogoutButton from '../LogoutButton/logoutButton'
import LoginButton from '../LogInButton/loginButton'
import AccountInfo from '../AccountInfo/accountInfo'
import ImageLoader from '../ImageLoader/imageLoader'
import Logo from '../Logo/logo'
import logo from '../../../img/space-gem-logo-2.png'
//import NotificationCard from '../Notifications/notifications'
import {ceramic} from '../../../utils/ceramic'

// Material UI
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import DiamondIcon from '@mui/icons-material/Diamond';

import Popover from '@mui/material/Popover'
import '../../../global.css'

const Header = ({ state, handleUpdate }) => {
    const [newNotifications, setNewNotifications] = useState(0)
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const { update } = useContext(appStore);

    const {
        wallet,
        appIdx,
        isUpdated,
        accountId
    } = state

    useEffect(
        () => {
        async function fetchData(){
            if(isUpdated){}
            if(accountId){
                //get the list of all notifications for all accounts
       
                let result = await ceramic.downloadKeysSecret(appIdx, 'notifications')
                if(result){

                    //convert the object from ceramic to map in order to more easily
                    //return notifications associated with current account
                    if(result[0]){
                        let notificationMap = new Map(Object.entries(result[0])) 

                        let notifications = 0;

                        //loop thorugh all notifications for user, if the read flag is false, increase the count
                        //for the notification badge
                        if(notificationMap.get(accountId)){
                            for(let i = 0; i < notificationMap.get(accountId).length; i++){
                                if(notificationMap.get(accountId)[i].read == false){
                                    notifications++;
                                }
                            }
                        }
                    

                    //set the counter for the badge to the amount of unread notifications
                    setNewNotifications(notifications)
                    }
                }
            }
        }
        fetchData()
        .then((res) => {
        
        })
    }, [accountId, isUpdated])

    const matches = useMediaQuery('(max-width:500px)')

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        update('', {isUpdated: !isUpdated})
        setPopoverOpen(true)

    }

    const handleClose = () => {
        setAnchorEl(null);
        update('', {isUpdated: !isUpdated})
        setPopoverOpen(false)
    }
    
    return (
        <div>
        <Grid container justifyContent="space-between" alignItems="center" spacing={1} style={{paddingRight: '10px', paddingLeft: '10px', backgroundColor: 'black'}}>
            
            {wallet && wallet.signedIn ? 
                (
                    <>
                    <Grid item>
                        <LeftSideDrawer
                        state={state}                        
                        />
                        <Link to="/"> 
                            <ImageLoader image={logo} style={{maxWidth: '150px'}}/>
                        </Link>
                    </Grid>
                    <Grid item >
                        {wallet && !wallet.signedIn ? <LoginButton style={{marginTop: '-5px'}}/> :   <LogoutButton style={{marginTop: '-5px'}}/> }
                    </Grid>
                    </>
                ) 
            :  
            wallet && !wallet.signedIn ? 
                !matches ? (
                    <>
                    <Grid item>
                    <Link to="/"> 
                        <ImageLoader image={logo} style={{maxWidth: '150px'}}/>
                    </Link>
                    </Grid>
                    <Grid item>
                        {wallet && !wallet.signedIn ? <LoginButton style={{marginTop: '-5px'}}/> : <LogoutButton style={{marginTop: '-5px'}}/> }
                    </Grid>
                    </>
                ) : (
                    <>
                    <Grid item>
                        <LeftSideDrawer
                            state={state}
                        
                        />
                        <Link to="/"> 
                            <ImageLoader image={logo} style={{maxWidth: '150px'}}/>
                        </Link>
                    </Grid>
                    <Grid item>
                        {wallet && !wallet.signedIn ? <LoginButton /> :   <LogoutButton/> }
                    </Grid>
                    </>
                ) 
            : null
        }
            
        </Grid>
        </div>
    )
}

export default Header