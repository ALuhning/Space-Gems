import React, { useState, useEffect, useContext } from 'react'

import * as nearAPI from 'near-api-js'
import { appStore, onAppMount } from '../../state/app'
import { useForm, useFieldArray } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { ceramic } from '../../utils/ceramic'
import { nft } from '../../utils/nft'
import { 
    mint,
    generateId,
    KeyPair,
    SPACE_CREATED,
    nftFactoryContractName,
    IPFS_PROVIDER } from '../../state/near'
import FileUpload from '../common/IPFSUpload/fileUpload'
import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js'
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { get, set, del } from '../../utils/storage'
const { create } = require('ipfs-http-client')
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import NonFungibleTokens from '../../utils/nonFungibleTokens'
import { queries } from '../../utils/graphQueries'
import ImageLoader from '../common/ImageLoader/imageLoader'

// Material UI components
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import InfoIcon from '@mui/icons-material/Info'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Input from '@mui/material/Input'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { buildingMetadataSchema } from '../../schemas/buildingMetadata'
import { InputAdornment, LinearProgress } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { CircularProgress } from '@mui/material'

const useStyles = makeStyles((theme) => ({
 
  }));

const ipfsApi = create('https://infura-ipfs.io:5001')

export default function AddSpace(props) {

  const { state, dispatch, update } = useContext(appStore);

  const {
    account,
    accountId,
    currentTokensList,
    didRegistryContract,
    nftContract,
    near,
    curUserIdx,
    appIdx
  } = state

  const tokenId = 'MC44NzU0ODE1MjI0NTA1MjAx'

  const classes = useStyles()

  const { 
    register, 
    handleSubmit, 
    watch, 
    errors, 
    control, 
    reset, 
    setValue, 
    getValues 
  } = useForm()

  const [finished, setFinished] = useState(false)

  // NEAR on chain data (also replicated in Ceramic)
      const [spaceId, setSpaceId] = useState('')
      const spaceTypes = ['office','parking']
      // refers to decentralized identifier (did) on Ceramic
      const [spaceReference, setSpaceReference] = useState()
      const [spaceReferenceHash, setSpaceReferenceHash] = useState()
      const [buildings, setBuildings] = useState([])
      const [floorplan, setFloorplan] = useState('')
      const [floor, setFloor] = useState(0)
      const [identifier, setIdentifier] = useState('')
  // Ceramic metadata (editable)
      const [metadata, setMetaData] = useState({})
      const [ceramicMetadata, setCeramicMetaData] = useState({})
      const [spaceType, setSpaceType] = useState('')
      const [spaceName, setSpaceName] = useState('')
      const [spaceCapacity, setSpaceCapacity] = useState(0)
      const [spaceCharacteristics, setSpaceCharacteristics] = useState([])
      const [spaceDescription, setSpaceDescription] = useState(EditorState.createEmpty())
      
      const [building, setBuilding] = useState({})
      const [buildingData, setBuildingData] = useState([])
      const [spaceImages, setSpaceImages] = useState([])
      const [attachedImageFiles, setAttachedImageFiles] = useState([])
      const [addedImageFileHash, setAddedImageFileHash] = useState('QmZsKcVEwj9mvGfA7w7wUS1f2fLqcfzqdCnEGtdq6MBR7P')
      
      const [spaceMedia, setSpaceMedia] = useState([])
      const [attachedMediaFiles, setAttachedMediaFiles] = useState([])
      const [addedMediaFileHash, setAddedMediaFileHash] = useState('QmZsKcVEwj9mvGfA7w7wUS1f2fLqcfzqdCnEGtdq6MBR7P')
  
      const [spaceCopies, setSpaceCopies] = useState(0)
      const [spaceCreated, setSpaceCreated] = useState()
      const [spaceExpires, setSpaceExpires] = useState()
      const [spaceStarts, setSpaceStarts] = useState()
      const [spaceUpdated, setSpaceUpdated] = useState()
      const [addressValue, setAddressValue] = useState(null)

      const [curNFTIdx, setCurNFTIdx] = useState()


    const [confirm, setConfirm] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [creator, setCreator] = useState()
    const [essentials, setEssentials] = useState(false)
    const [currentFTAccount, setCurrentFTAccount] = useState()
    
    const [FTContract, setFTContract] = useState()
    const [tokenIcon, setTokenIcon] = useState()
    const [tokenIconUrl, setTokenIconUrl] = useState()

    

    const {
      fields: characteristicsFields,
      append: characteristicsAppend,
      remove: characteristicsRemove} = useFieldArray({
     name: "characteristics",
     control
    })

    const {
      fields: imageFields,
      append: imageFieldsAppend,
      remove: imageFieldsRemove} = useFieldArray({
     name: "images",
     control
    })

    const {
        fields: mediaFields,
        append: mediaFieldsAppend,
        remove: mediaFieldsRemove} = useFieldArray({
       name: "media",
       control
    })

    const characteristics = watch('characteristics', characteristicsFields)

    const images = watch('images', imageFields)
    let controlledImageFields = imageFields.map((image, index) => {
      return {
        ...image,
        ...image[index]
      }
    })

    const media = watch('media', mediaFields)
    let controlledMediaFields = mediaFields.map((image, index) => {
      return {
        ...media,
        ...media[index]
      }
    })

    useEffect(
      () => {
        async function getBuildingData(){
         
          if(nftContract && accountId && appIdx){
            let queryTokens = await queries.getTokens(accountId)
            console.log('querytokens', queryTokens)
            let buildingsArray = []
            for(let i = 0; i < queryTokens.data.nftMints.length; i++){
              let tokenMeta = await nftContract.nft_token({token_id: queryTokens.data.nftMints[i].token_ids})
              console.log('tokenMeta', tokenMeta)
              let tokenDid = tokenMeta.metadata.reference
              console.log('tokendid', tokenDid)
              let tokenData = await appIdx.get('buildingProfile', tokenMeta.metadata.reference)
              console.log('tokenData', tokenData)
              if(tokenData){
                  buildingsArray.push(tokenData)
              }
            }
            setBuildings(buildingsArray)
          }
        }

    
        getBuildingData()
          .then((res) => {

          })
      }, [appIdx, nftContract, accountId]
    )

    function handleTokenFileHash(hash) {
      setTokenIcon(IPFS_PROVIDER + hash)
    }

    function setCreateTrigger(tokenId, ceramicMetadata, did) {
      // set trigger for created space to update metadata on success
      let created = get(SPACE_CREATED, [])
      created.push({tokenId: tokenId, did: did, ceramicMetadata: ceramicMetadata, init: true })
      set(SPACE_CREATED, created)
    }

    async function prepForMetadata(){
      const keyPair = KeyPair.fromRandom('ed25519')
      let publicKey = keyPair.getPublicKey().toString().split(':')[1]
      console.log('publicKey', publicKey)
      let newNFTIdx = await ceramic.getIDX(keyPair.secretKey, appIdx)
      console.log('newNFTIdx', newNFTIdx)
      setCurNFTIdx(newNFTIdx)
      setMetaData({...metadata, 'reference': newNFTIdx.id})

      let nftKeys = await ceramic.downloadKeysSecret(curUserIdx, 'accountsKeys')
      
      let tokenId = generateId()
      setSpaceId(tokenId)

      nftKeys.push({
          tokenId: tokenId,
          type: 'space',
          key: keyPair.secretKey, 
          publicKey: publicKey,
          owner: accountId, 
          keyStored: Date.now()
      })

      let curObject = {
        NFTIdx: newNFTIdx,
        metadata: {'reference': newNFTIdx.id},
        spaceId: tokenId
      }

      try{
          await ceramic.storeKeysSecret(curUserIdx, nftKeys, 'accountsKeys')
          return curObject
      } catch (err) {
          console.log('problem storing space seed', err)
          return false
      }
    }
      
      

    const handleSpaceNameChange = (event) => {
      setSpaceName(event.target.value)
      setMetaData({...metadata, 'title': event.target.value})
    }

    const handleSpaceCapacityChange = (event) => {
      setSpaceCapacity(event.target.value)
    }

    const handleSpaceTypeChange = (event) => {
      setSpaceType(event.target.value)
      setMetaData({...metadata, 'spaceType': event.target.value})
    }

    const handleBuildingChange = (event) => {
      setBuilding(event.target.value)
      console.log('building id', event.target.value)
      let thisBuilding = []
      for(let i = 0; i < buildings.length; i++){
        if(event.target.value == buildings[i].tokenId){
          thisBuilding.push(buildings[i])
          setBuildingData(thisBuilding)
          setFloorplan(buildings[i].floorplanURL)
        }
      }
      setMetaData({...metadata, 'building': event.target.value})
    }


    const handleSpaceDescriptionChange = (editorState) => {
        setSpaceDescription(editorState)
    }

    const handleFloorChange = (event) => {
      setFloor(parseInt(event.target.value))
    }

    const handleIdentifierChange = (event) => {
      setIdentifier(event.target.value)
    }

    const handleBuildingIdChange = (event) => {
      setBuilding(...building, '')
    }

    // Attached Image File Handlers

    function handleImageFileHash(hash, name) {
      let fullHash = IPFS_PROVIDER + hash
      let newAttachedImageFiles = { name: name, hash: fullHash }
      attachedImageFiles.push(newAttachedImageFiles)
      setSpaceImages(attachedImageFiles)
    }
  
    const captureImageFile = (i) => {
      console.log('here', i)
        event.stopPropagation()
        event.preventDefault()
        //const file = event.target.files[0]
        const file = controlledImageFields[i].hash[0]
        let name = controlledImageFields[i].hash[0].name
        let reader = new window.FileReader()
        reader.onloadend = () => saveImageToIpfs(reader, name)
        reader.readAsArrayBuffer(file)
    }

    const saveImageToIpfs = (reader, name) => {
        let ipfsId
        const buffer = Buffer.from(reader.result)
        ipfsApi.add(buffer)
        .then((response) => {
        ipfsId = response.path
        console.log('ipfsId', ipfsId)
        setAddedImageFileHash(ipfsId)
        handleImageFileHash(ipfsId, name)
        }).catch((err) => {
        console.error(err)
        })
    }

    // Attached Media File Handlers
    
    function handleMediaFileHash(hash, name) {
      let fullHash = IPFS_PROVIDER + hash
      let newAttachedMediaFiles = { name: name, hash: fullHash }
      attachedMediaFiles.push(newAttachedMediaFiles)
      setSpaceMedia(attachedMediaFiles)
    }
  
    const captureMediaFile = (i) => {
      console.log('here', i)
        event.stopPropagation()
        event.preventDefault()
        //const file = event.target.files[0]
        const file = controlledMediaFields[i].hash[0]
        let name = controlledMediaFields[i].hash[0].name
        let reader = new window.FileReader()
        reader.onloadend = () => saveMediaToIpfs(reader, name)
        reader.readAsArrayBuffer(file)
    }

    const saveMediaToIpfs = (reader, name) => {
        let ipfsId
        const buffer = Buffer.from(reader.result)
        ipfsApi.add(buffer)
        .then((response) => {
        ipfsId = response.path
        console.log('ipfsId', ipfsId)
        setAddedMediaFileHash(ipfsId)
        handleMediaFileHash(ipfsId, name)
        }).catch((err) => {
        console.error(err)
        })
    }
  

    const onSubmit = async (values) => {
      setClicked(true)
      let curObject = await prepForMetadata()
      console.log('curObject', curObject)
      console.log('curNFTIdx', curObject.NFTIdx)
      setCreateTrigger(curObject.buildingId, ceramicMetadata, curObject.NFTIdx.id)
      

      let record = {
        tokenId: curObject.spaceId,
        name: spaceName,
        description: draftToHtml(convertToRaw(spaceDescription.getCurrentContent())),
        characteristics: characteristics,
        spaceType: spaceType,
        building: buildingData,
        status: 'available',
        floor: floor,
        identifier: identifier
      }

      try{
        let result = await curObject.NFTIdx.set('spaceProfile', record)
        await didRegistryContract.putIdDID({id: curObject.spaceId, did: curObject.NFTIdx.id, type:'space'})
       // await mint(curObject.spaceId, curObject.metadata, accountId, nftContract)
      } catch (err) {
          console.log('problem registering space', err)
      }
    }
 console.log('buildings array', buildings)
      return (
        <>
      
        <Grid container spacing={1} justifyContent="center" alignItems="center" style={{padding: '10px'}}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginTop: '20px', marginBottom: '20px'}}>
            <Typography variant="h5">Define a Space</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <FormControl>
              <InputLabel id="language-label">Choose Building</InputLabel>
              <Select
                className={classes.input}
                label = "Building"
                id = "building"
                value = {building.tokenId}
                onChange = {handleBuildingChange}
                input={<Input />}
                >
                {buildings.map(({tokenId, name}) => (
                    <MenuItem key={tokenId} value={tokenId}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
               
              <FormHelperText>Select your building to define spaces for.</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginTop: '20px', marginBottom:'20px'}}>
            <ImageLoader image={floorplan} style={{width: '95%'}}/>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <TextField
              fullWidth
              margin="dense"
              id="spaceName"
              variant="outlined"
              name="spaceName"
              label="Space Name"
              required={true}
              value={spaceName}
              onChange={handleSpaceNameChange}
              inputRef={register({
                  required: true
              })}
              placeholder="The Atrium"
              InputProps={{
                endAdornment: <>
                <Tooltip TransitionComponent={Zoom} title="Name your space according to the floorplan.">
                    <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                </Tooltip>
                </>
              }}
              style={{marginBottom: '10px'}}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <FormControl>
              <InputLabel id="language-label">Space Type</InputLabel>
              <Select
                className={classes.input}
                label = "Space Type"
                id = "space-type"
                value = {spaceType}
                onChange = {handleSpaceTypeChange}
                input={<Input />}
                >
                {spaceTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              <FormHelperText>What kind of space is this?</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <FormControl>
              <TextField
                className={classes.input}
                label = "Capacity Limit"
                id = "space-capacity"
                type = "number"
                value = {spaceCapacity}
                onChange = {handleSpaceCapacityChange}
                
                />
              <FormHelperText>What is the capacity limit of this space?</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <FormControl>
              <TextField
                className={classes.input}
                label = "Floor"
                id = "space-floor"
                type = "number"
                value = {floor}
                onChange = {handleFloorChange}
                
                />
              <FormHelperText>What floor of the building is this space found on?</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <FormControl>
              <TextField
                className={classes.input}
                label = "Identifier"
                id = "space-identifier"
                value = {identifier}
                onChange = {handleIdentifierChange}
                />
              <FormHelperText>Does the space have an office/cubicle number or other identifier?</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Typography variant="body1">Describe the space:</Typography>
            <Paper style={{padding: '5px'}}>
            <Editor
              name="spaceDescription"
              editorState={spaceDescription}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                image: { inDropdown: true },
                history: { inDropdown: true },
              }}
              onEditorStateChange={handleSpaceDescriptionChange}
              editorStyle={{minHeight:'200px'}}
            />
            </Paper>
            {errors.details && <p style={{color: 'red'}}>Please describe the space you have available.</p>}
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1}>
          <Typography variant="body1" style={{marginTop: '10px', marginBottom:'10px'}}>Space Inclusions</Typography>
          {
            characteristicsFields.map((field, index) => {
            return(
              
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
              <TextField
                margin="dense"
                id={`characteristics[${index}].name`}
                variant="outlined"
                name={`characteristics[${index}].name`}
                defaultValue={field.name}
                label="Inclusion Name:"
                InputProps={{
                  endAdornment: <div>
                  <Tooltip TransitionComponent={Zoom} title="Short name of inclusion.">
                      <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                  </Tooltip>
                  </div>
                }}
                inputRef={register({
                    required: true                              
                })}
              />
              {errors[`characteristics${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide an amenity name.</p>}
              
              <Button type="button" onClick={() => characteristicsRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                <DeleteForeverIcon />
              </Button>
              </Grid>
              
            )
          }) 
          }
          {!characteristicsFields || characteristicsFields.length == 0 ?
            <Typography variant="body1" style={{marginLeft: '5px'}}>No inclusions added yet.</Typography>
          : null }
            <Button
              type="button"
              onClick={() => characteristicsAppend({name: ''})}
              startIcon={<AddBoxIcon />}
            >
              Add Inclusion
            </Button>
          </Grid>
        </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} align="center">
            {!clicked ? <Button
              disabled={clicked}
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}>
                ADD SPACE
              </Button>
              : <LinearProgress />
            }
          </Grid>
      </Grid>
        </>
    )
  
}