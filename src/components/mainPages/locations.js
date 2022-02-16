import React, { useState, useEffect, useContext } from 'react'
import { appStore, onAppMount } from '../../state/app'
import Fuse from 'fuse.js'
import BuildingCard from '../Cards/BuildingCard/BuildingCard'
import SearchBar from '../common/SearchBar/search'

// Material UI components
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import List from '@mui/material/List'

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    },
    featureDAO: {
        minHeight: '200px',
        backgroundColor:'#eff3fb',
        padding: '20px',
    },
    paper: {
        padding: '5px',
        textAlign: 'center',
    },
    menuButton: {
      marginRight: '5px',
    },
    title: {
      flexGrow: 1,
      textAlign: 'left'
    },
    drawer: {
        marginTop: '5px'
    }
  }));

  
export default function Locations(props) {
   
    const [buildings, setBuildings] = useState([])
    const [buildingCount, setBuildingCount] = useState(0)

    const [membersOnly, setMembersOnly] = useState(false)
    const [activeOnly, setActiveOnly] = useState(true)
    const [resources, setResources] = useState(0)
    const [searchBuildings, setSearchBuildings] = useState([])
    const [contractId, setContractId] = useState('')
    const [daoPlatform, setDaoPlatform] = useState('')
    
    const [anchorEl, setAnchorEl] = useState(null)
   
    const classes = useStyles()

    const { state, dispatch, update } = useContext(appStore)

    const {
      currentBuildings,
      accountId,
      near,
      isUpdated,
      did,
      didRegistryContract,
      nearPrice,
      appIdx
    } = state

    const matches = useMediaQuery('(max-width:500px)')

    let sortedBuildings

    useEffect(
        () => {
            if(isUpdated){}
            console.log('currentBuildings', currentBuildings)
            async function fetchData() {
                if(currentBuildings && near){
                    setBuildingCount(currentBuildings.length)
                    sortedBuildings = _.sortBy(currentBuildings, 'issuedAt').reverse()
                    setBuildings(sortedBuildings)                
                }
            }

        let mounted = true
        if(mounted){
        fetchData()
          .then((res) => {
         
          })
        return () => mounted = false
        }

    }, [currentBuildings, near, isUpdated]
    )

    function handleExpanded() {
        setAnchorEl(null)
    }

    function makeSearchBuildings(building){
       let i = 0
        let exists
        let someBuildings = []
        if(building != false && searchBuildings.length > 0){
            while(i < searchBuildings.length){
                if(searchBuildings[i].tokenId == building.tokenId){
                    exists = true
                }
                i++
            }
            if(!exists){
                someBuildings.push(building)
                setSearchBuildings(someBuildings)
            }
        }
    }

    const searchData = (pattern) => {
        if (!pattern) {
            let sortedBuildings = _.sortBy(currentBuildings, 'issuedAt').reverse()
            setBuildings(sortedBuildings)
            return
        }
        
        const fuse = new Fuse(searchBuildings, {
            keys: ['tokenId']
        })
     

        const result = fuse.search(pattern)

        const matches = []
        if (!result.length) {
            setBuildings([])
        } else {
            result.forEach(({item}) => {
                matches.push(item)
        })
            setBuildings(matches)
        }
    }
  

    return (
        <>
        <div className={classes.root}>
        {!matches ? (<>
            <Grid container alignItems="center" justifyContent="space-evenly" spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <Typography variant="h5" style={{marginTop: '20px'}}>Pick a Workspace</Typography>
                </Grid>
            </Grid>
        </>
        ) : (<>
            <Grid container alignItems="center" justifyContent="space-evenly" spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <Typography variant="h5" style={{marginTop: '20px'}}>Pick a Workspace</Typography>
                </Grid>
            </Grid>
            </>

        )}
        
        <Grid container alignItems="center" justifyContent="space-between" spacing={0} >
            <Grid item xs={1} sm={1} md={3} lg={3} xl={3}>
            </Grid>
            <Grid item xs={10} sm={10} md={6} lg={6} xl={6}>
            <SearchBar
                placeholder="Search"
                onChange={(e) => searchData(e.target.value)}
            />
            </Grid>
            <Grid item xs={1} sm={1} md={3} lg={3} xl={3}>
            </Grid>
        </Grid>
        <Grid container spacing={0} justifyContent="center" alignItems="center" style={{paddingLeft:'10px', paddingRight:'10px'}}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {buildings && buildingCount > 0 ? 
            (<>
              
            {buildings.map(({tokenId, address, amenities, buildingType, description, floorplanURL, name, status}, i) => {
                console.log('buildings', buildings)
                return ( 
                    <BuildingCard
                        key={i}
                        buildingId={tokenId}
                        address={address}
                        amenities={amenities}
                        buildingType={buildingType}
                        description={description}
                        floorplan={floorplanURL}
                        name={name}
                        makeSearchBuildings={makeSearchBuildings}
                        status={status}
                    />
               )
            }
            )}
       
            </>)
        : null
        }

        </List>
        </Grid>
       
        </div>
    
        </>
    )
}