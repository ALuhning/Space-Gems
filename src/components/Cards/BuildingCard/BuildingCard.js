import React, { useState, useEffect, useContext } from 'react'
import * as nearAPI from 'near-api-js'
import { Link } from 'react-router-dom'
import { appStore, onAppMount } from '../../../state/app'
import { ceramic } from '../../../utils/ceramic'
import { signal } from '../../../state/near'
import { queries } from '../../../utils/graphQueries'
import SpacesCard from '../SpacesCard/spacesCard'
import ImageLoader from '../../common/ImageLoader/imageLoader'

// Material UI Components
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import { LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { Grid } from '@mui/material'
import { Typography } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import { List } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { Stack } from '@mui/material'
import { Badge } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const useStyles = makeStyles((theme) => ({
    pos: {
        marginTop: 0,
    },
    card: {
      minWidth: '200px',
      maxWidth: '200px',
      verticalAlign: 'middle',
      margin: '10px 10px 10px 10px',
      padding: '2px'
    },
    cardMobile: {
      minWidth: '100%',
      verticalAlign: 'middle',
      margin: '10px 10px 10px 10px',
      padding: '2px'
    },
    square: {
      float: 'left',
      marginRight: '10px',
      marginTop: '5px',
    }
  }));

const imageName = require('../../../img/placeholder-logo.png') // default no-image avatar
const sortDown = require('../../../img/sortdown.png')
const sortUp = require('../../../img/sortup.png')

export default function BuildingCard(props) {

  const { state, dispatch, update } = useContext(appStore);

    const [date, setDate] = useState()
   
    const [logo, setLogo] = useState(imageName)
    const [purpose, setPurpose] = useState('')
    const [category, setCategory] = useState('')
    const [owner, setOwner] = useState('')
    const [editDaoClicked, setEditDaoClicked] = useState(false)
    const [purposeClicked, setPurposeClicked] = useState(false)
    const [claimed, setClaimed] = useState(false)
    const [curDaoIdx, setCurDaoIdx] = useState()
    const [display, setDisplay] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null)
    const [anchorE2, setAnchorE2] = useState(null)
    const [finished, setFinished] = useState(false)
    const [created, setCreated] = useState()
    const [detailsClicked, setDetailsClicked] = useState(false) 
    const [memberStatus, setMemberStatus] = useState() 
    const [memberIcon, setMemberIcon] = useState(<NotInterestedIcon />)
    const [verified, setVerified] = useState(false)
    const [daoPlatform, setDaoPlatform] = useState('')
    const [daoPlatformLink, setDaoPlatformLink] = useState('')
    const [daoDid, setDaoDid] = useState('')
    const [spaces, setSpaces] = useState([])

    const [currentLikes, setCurrentLikes] = useState([])
    const [currentDisLikes, setCurrentDisLikes] = useState([])
    const [currentNeutrals, setCurrentNeutrals] = useState([])

    const [expanded, setExpanded] = useState(false)

    const classes = useStyles();
  
    const { 
      buildingId,
      address,
      amenities,
      buildingType,
      floorplan,
      name,
      status,
      makeSearchBuildings,
   } = props
 
   const {
     accountId, 
     appIdx,
     isUpdated,
     near,
     didRegistryContract,
     factoryContract,
     admin,
     currentBuildings,
     currentSpaces
   } = state

    useEffect(
      () => {

      async function fetchData() {
        if(isUpdated){}
        if(buildingId){
          try{
            let verificationStatus = await didRegistryContract.getVerificationStatus({accountId: buildingId})
            if(verificationStatus != 'null'){
              setVerified(verificationStatus)
            }
          } catch (err) {
            console.log('error retrieving verification status', err)
          }
          let theseSpaces = []
          for(let i = 0; i < currentSpaces.length; i++){
            if(currentSpaces[i].building[0].tokenId == buildingId && currentSpaces[i].building[0].status == 'active'){
              theseSpaces.push(currentSpaces[i])
            }
          }
          setSpaces(theseSpaces)
        }
        return true
      }

      let mounted = true
        if(mounted){
        fetchData()
          .then((res) => {
            setFinished(true)
            makeSearchBuildings(res)
          })
        return () => mounted = false
        }

  }, [isUpdated]
  )

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }  

  const handleEditDaoClick = () => {
    handleExpanded()
    handleEditDaoClickState(true)
  }
  const handleDetailsClick= () => {
    handleExpandedDetails()
    handleDetailsClickedState(true)
  }

  function handleDetailsClickedState(property){
    setDetailsClicked(property)
  }

  function handleEditDaoClickState(property){
    setEditDaoClicked(property)
  }

  const handlePurposeClick = () => {
    handleExpanded()
    handlePurposeClickState(true)
  }

  function handlePurposeClickState(property){
    setPurposeClicked(property)
  }

  function handleExpanded() {
    setAnchorEl(null)
  }

  function handleExpandedDetails(){
    setAnchorE2(null)
  }

  async function handleSignal(sig){
    await signal(sig, appIdx, accountId, 'building')
    update('', {isUpdated: !isUpdated})
  }
  
  function formatDate(timestamp) {
    let stringDate = timestamp.toString()
    let options = {year: 'numeric', month: 'long', day: 'numeric'}
    return new Date(parseInt(stringDate.slice(0,13))).toLocaleString('en-US', options)
  }

    return(
        <>
        {!display ? <LinearProgress /> : 
                    
          finished ? 
          (
            <>
            <ListItem alignItems="flex-start">
            <ListItemText
              primary={
                <Grid container spacing={1} justifyContent="space-between" alignItems="center"> 
                  <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                  <Link to={`/building-profiles/${buildingId}`}>  
                    <div style={{width: 'auto', 
                        height: '75px',
                        backgroundImage: `url(${logo})`, 
                        backgroundSize: 'contain',
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat',
                        backgroundOrigin: 'content-box'
                    }}>
                    </div>
                    </Link>
                  </Grid>
                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10} align="center">   
                    <Typography variant="h5">{name != '' ? name : buildingId}</Typography>
                  </Grid>  
                </Grid>
                }
              secondary={
                <Grid container spacing={1} justifyContent="space-between" alignItems="center">
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                          Spaces
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{spaces.length} Spaces Available</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={0} style={{padding: '20px', marginBottom: '5px', marginLeft: '0px'}} alignItems="center" justifyContent="space-evenly">
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                            <ImageLoader image={floorplan} style={{width:'95%'}} />
                          </Grid>
                          <Grid item xs={9} sm={9} md={9} lg={9} xl={9} align="left">
                          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                          {spaces && spaces.length > 0 ? 
                            (<>
                              
                            {spaces.map(({identifier, name, spaceType, status, characteristics, description, floor, tokenId}, i) => {
                                console.log('spaces', spaces)
                                return ( 
                                    <SpacesCard
                                        key={i}
                                        identifier={identifier}
                                        name={name}
                                        spaceType={spaceType}
                                        status={status}
                                        characteristics={characteristics}
                                        description={description}
                                        floor={floor}
                                        spaceId={tokenId}
                                    />
                               )
                            }
                            )}
                       
                            </>)
                        : 'no available spaces in this location'
                        }
                
                        </List>
                          </Grid>
                         
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              }
            />
            </ListItem>
            <Grid container spacing={1} justifyContent="space-between" alignItems="center" style={{paddingLeft: '10px', paddingRight:'10px'}}>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3} >
                {purpose ? (<Button variant="outlined" style={{textAlign: 'center', fontSize: '80%', marginTop:'5px'}} onClick={handlePurposeClick}>Purpose</Button>) : null}
              </Grid>
              <Grid item xs={9} sm={9} md={9} lg={9} xl={9} >
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                
              </Grid>
            </Grid>
            <Divider variant="middle" style={{marginTop: '15px', marginBottom: '15px'}}/>
          </>
            ) 
          : null
        }
          
          
        </>
       
    )
}

// {detailsClicked ? <BuildingProfileDisplay
//   state={state}
//   handleDetailsClickedState={handleDetailsClickedState}
//   did={did}
//   /> : null }