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
    BUILDING_CREATED,
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

// Material UI components
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
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
import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'
import { InputAdornment, LinearProgress } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { CircularProgress } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  square: {
    width: '175px',
    height: 'auto'
  },
  large: {
    width: '175px',
    height: 'auto',
    textAlign: 'center'
  }, 
  formControl: {
    margin: '5px',
  },
  hide: {
    display: 'none'
  },
  }));

const ipfsApi = create('https://infura-ipfs.io:5001')

export default function AddBuilding(props) {

  const { state, dispatch, update } = useContext(appStore);

  const {
    accountId,
    currentTokensList,
    didRegistryContract,
    nftContract,
    near,
    curUserIdx,
    appIdx
  } = state

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
      const [buildingId, setBuildingId] = useState('')
      const buildingTypes = ['office','house','restaurant']
      const [metadata, setMetaData] = useState('')

      // refers to decentralized identifier (did) on Ceramic
      const [buildingReference, setBuildingReference] = useState()
      const [buildingReferenceHash, setBuildingReferenceHash] = useState()

  // Ceramic metadata (editable)
      const [ceramicMetadata, setCeramicMetaData] = useState({})
      const [buildingType, setBuildingType] = useState('')
      const [buildingName, setBuildingName] = useState('')
      const [buildingFloorplan, setBuildingFloorplan] = useState('')
      const [buildingDescription, setBuildingDescription] = useState(EditorState.createEmpty())
      
     
      const [attachedImageFiles, setAttachedImageFiles] = useState([])
      const [addedImageFileHash, setAddedImageFileHash] = useState('QmZsKcVEwj9mvGfA7w7wUS1f2fLqcfzqdCnEGtdq6MBR7P')

      const [attachedMediaFiles, setAttachedMediaFiles] = useState([])
      const [addedMediaFileHash, setAddedMediaFileHash] = useState('QmZsKcVEwj9mvGfA7w7wUS1f2fLqcfzqdCnEGtdq6MBR7P')
  
      const [buildingCopies, setBuildingCopies] = useState(1)
      const [buildingCreated, setBuildingCreated] = useState()
      const [buildingExpires, setBuildingExpires] = useState()
      const [buildingStarts, setBuildingStarts] = useState()
      const [buildingUpdated, setBuildingUpdated] = useState()
      const [addressValue, setAddressValue] = useState(null)

      const [curNFTIdx, setCurNFTIdx] = useState()


    const [confirm, setConfirm] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [owner, setOwner] = useState()
    
    const [buildingIcon, setBuildingIcon] = useState()
    const [buildingIconUrl, setBuildingIconUrl] = useState()
    const [avatarLoaded, setAvatarLoaded] = useState(true)
    const [photoLoaded, setPhotoLoaded] = useState(true)
    const [mediaLoaded, setMediaLoaded] = useState(true)
    const [progress, setProgress] = useState(false)
  
       
   const {
      fields: buildingMedia,
      append: buildingMediaAppend,
      remove: buildingMmediaRemove} = useFieldArray({
     name: "media",
     control
    })

    const {
      fields: buildingImages,
      append: buildingImagesAppend,
      remove: buildingImagesRemove} = useFieldArray({
     name: "buildingImages",
     control
    })

    const {
      fields: amenitiesFields,
      append: amenitiesAppend,
      remove: amenitiesRemove} = useFieldArray({
     name: "amenities",
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

    const amenities = watch('amenities', amenitiesFields)

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
        async function processTriggers(){
        
        }

    
        processTriggers()
          .then((res) => {

          })
  

      }, []
    )

    function handleFloorplanFileHash(hash) {
      setBuildingFloorplan(IPFS_PROVIDER + hash)
    }
  

    function setCreateTrigger(tokenId, ceramicMetadata, did) {
      // set trigger for created space to update metadata on success
      let created = get(BUILDING_CREATED, [])
      created.push({tokenId: tokenId, did: did, ceramicMetadata: ceramicMetadata, init: true })
      set(BUILDING_CREATED, created)
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
      setBuildingId(tokenId)

      nftKeys.push({
          tokenId: tokenId,
          type: 'building',
          key: keyPair.secretKey, 
          publicKey: publicKey,
          owner: accountId, 
          keyStored: Date.now()
      })

      let curObject = {
        NFTIdx: newNFTIdx,
        metadata: {'reference': newNFTIdx.id},
        buildingId: tokenId
      }

      try{
          await ceramic.storeKeysSecret(curUserIdx, nftKeys, 'accountsKeys')
          return curObject
      } catch (err) {
          console.log('problem storing building seed', err)
          return false
      }
    }
      

    const handleBuildingNameChange = (event) => {
      setBuildingName(event.target.value)
      setCeramicMetaData({...ceramicMetadata, 'name': event.target.value})
    }

    const handleBuildingTypeChange = (event) => {
      setBuildingType(event.target.value)
      setCeramicMetaData({...ceramicMetadata, 'buildingType': event.target.value})
    }

    const handleBuildingDescriptionChange = (editorState) => {
      setBuildingDescription(editorState)
      setCeramicMetaData({...ceramicMetadata, 'description': editorState})
    }

    function handleAvatarLoaded(property){
      setAvatarLoaded(property)
    }
    function handlePhotoLoaded(property){
      setPhotoLoaded(property)
    }
    function handlePhotoLoaded(property){
      setPhotoLoaded(property)
    }
    function handleMediaLoaded(property){
      setMediaLoaded(property)
    }
    // Attached Image File Handlers

    function handleImageFileHash(hash, name) {
      let fullHash = IPFS_PROVIDER + hash
      let newAttachedImageFiles = { name: name, hash: fullHash }
      attachedImageFiles.push(newAttachedImageFiles)
      buildingImagesAppend(newAttachedImageFiles)

      setCeramicMetaData({...ceramicMetadata, 'images': buildingImages})
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
      buildingMediaAppend(newAttachedMediaFiles) 

      setCeramicMetaData({...ceramicMetadata, 'media': buildingMedia})
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
        tokenId: curObject.buildingId,
        name: buildingName,
        description: draftToHtml(convertToRaw(buildingDescription.getCurrentContent())),
        amenities: amenities,
        images: buildingImages,
        media: buildingMedia,  
        floorplanURL: buildingFloorplan,
        buildingType: buildingType,
        address: addressValue,
        status: 'active',
        issuedAt: Date.now()
      }

      try{
          let result = await curObject.NFTIdx.set('buildingProfile', record)
          await mint(curObject.buildingId, curObject.metadata, accountId, nftContract)
      } catch (err) {
          console.log('problem minting building', err)
      }
    }
 
      return (
        <>
      
        <Grid container spacing={1} justifyContent="center" alignItems="center" style={{padding: '10px'}}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{marginTop: '20px'}}>
            <Typography variant="h5" style={{marginBottom: '20px'}}>Add a Building</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <FormControl>
              <InputLabel id="language-label">Building Type</InputLabel>
              <Select
                className={classes.input}
                label = "Building Type"
                id = "building-type"
                value = {buildingType}
                onChange = {handleBuildingTypeChange}
                input={<Input />}
                >
                {buildingTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              <FormHelperText>Select the type of building to add.</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <TextField
              fullWidth
              margin="dense"
              id="buildingName"
              variant="outlined"
              name="buildingName"
              label="Building Name"
              required={true}
              value={buildingName}
              onChange={handleBuildingNameChange}
              inputRef={register({
                  required: true
              })}
              placeholder="Carling #6"
              InputProps={{
                endAdornment: <>
                <Tooltip TransitionComponent={Zoom} title="Give your building a unique name.">
                    <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                </Tooltip>
                </>
              }}
              style={{marginBottom: '10px'}}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{textAlign: 'center'}}>
            <GooglePlacesAutocomplete
              apiKey={process.env.REACT_APP_GOOGLE_KEY}
              selectProps={{
                addressValue,
                onChange: setAddressValue
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Typography variant="body1">Describe the building:</Typography>
            <Paper style={{padding: '5px'}}>
            <Editor
              name="buildingDescription"
              editorState={buildingDescription}
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
              onEditorStateChange={handleBuildingDescriptionChange}
              editorStyle={{minHeight:'200px'}}
            />
            </Paper>
            {errors.details && <p style={{color: 'red'}}>Please describe the building you have available.</p>}
          </Grid>
          <Paper style={{padding: '5px', marginTop: '20px', width: '95%', marginLeft: '5px'}}>
            <Grid container spacing={1} style={{marginBottom: '5px'}}>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Avatar
                alt={accountId}
                src={buildingFloorplan}
                variant="square"
                className={avatarLoaded ? classes.square : classes.hide}
                imgProps={{
                  onLoad:(e) => { handleAvatarLoaded(true) }
                }}  
              />
              {progress ?
                <CircularProgress />
              : null }
            </Grid>
            <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
              <Typography variant="h6">Add Floorplan</Typography><br></br>
              <FileUpload handleFileHash={handleFloorplanFileHash} handleAvatarLoaded={handleAvatarLoaded}/>
            </Grid>
        </Grid>
          </Paper>

          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper style={{padding: '5px', marginTop: '20px'}}>
            <Grid container justifyContent="space-between" alignItems="flex-end" spacing={1} style={{padding: '5px'}}>
            <Typography variant="body1" style={{marginTop: '10px', marginBottom:'10px'}}>Building Amenities</Typography>
            {
              amenitiesFields.map((field, index) => {
              return(
                
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={field.id}>
                <TextField
                  margin="dense"
                  id={`amenities[${index}].name`}
                  variant="outlined"
                  name={`amenities[${index}].name`}
                  defaultValue={field.name}
                  label="Amenity Name:"
                  InputProps={{
                    endAdornment: <div>
                    <Tooltip TransitionComponent={Zoom} title="Short name of amenity.">
                        <InfoIcon fontSize="small" style={{marginLeft:'5px', marginTop:'-3px'}} />
                    </Tooltip>
                    </div>
                  }}
                  inputRef={register({
                      required: true                              
                  })}
                />
                {errors[`amenities${index}.name`] && <p style={{color: 'red', fontSize:'80%'}}>You must provide an amenity name.</p>}
                
                <Button type="button" onClick={() => amenitiesRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                  <DeleteForeverIcon />
                </Button>
                </Grid>
                
              )
            }) 
            }
            {!amenitiesFields || amenitiesFields.length == 0 ?
              <Typography variant="body1" style={{marginTop: '10px', marginLeft: '5px'}}>No amenities added yet.</Typography>
            : null }
              <Button
                type="button"
                onClick={() => amenitiesAppend({name: ''})}
                startIcon={<AddBoxIcon />}
              >
                Add Amenity
              </Button>
            </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Paper style={{padding: '5px', marginTop: '20px'}}>
              <Grid container direction='column' justifyContent="space-between" alignItems="flex-start"  style={{padding: '5px'}}>
              
                  <Typography variant="h6">Add Photos</Typography><br></br>
                  {
                  //list photos, have logic for removing them
                  buildingImages.map((field, index) => {
                  return(
                  <Grid container>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>      
                    {/* return the name of each file added with an icon */}
                      <Avatar
                      src={field.hash}
                      variant="square"
                      className={photoLoaded ? classes.square : classes.hide}
                      imgProps={{
                        onLoad:(e) => { handlePhotoLoaded(true) }
                      }}  
                    />

                    {
                      progress ?
                    <CircularProgress />
                    : null }
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Button type="button" onClick={() => buildingImagesRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                      <DeleteForeverIcon />
                    </Button>
                    </Grid>
                  </Grid>
                    )
                  }) 
                  }
                  <FileUpload handleFileHash={handleImageFileHash} handleAvatarLoaded={handlePhotoLoaded}/>

               
                </Grid>
            </Paper>
            </Grid>
          
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Paper style={{padding: '5px', marginTop: '20px'}}>
              <Grid container direction='column' justifyContent="space-between" alignItems="flex-start"  style={{padding: '5px'}}>
              
                  <Typography variant="h6">Add Media</Typography><br></br>
                  {
                  //list media + way to remove them
                  buildingMedia.map((field, index) => {
                  return(
                  <Grid container>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>      
                    {/* return the name of each file added with an icon */}
                      <Avatar
                      src={field.hash}
                      variant="square"
                      className={mediaLoaded ? classes.square : classes.hide}
                      imgProps={{
                        onLoad:(e) => { handleMediaLoaded(true) }
                      }}  
                    />

                    {
                      progress ?
                    <CircularProgress />
                    : null }
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Button type="button" onClick={() => buildingMmediaRemove(index)} style={{float: 'right', marginLeft:'10px'}}>
                      <DeleteForeverIcon />
                    </Button>
                    </Grid>
                  </Grid>
                    )
                  }) 
                  }
                  <FileUpload handleFileHash={handleMediaFileHash} handleAvatarLoaded={handleMediaLoaded}/>

               
                </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} align="center">
            {!clicked ? <Button
            disabled={clicked}
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}>
              ADD BUILDING
            </Button>
            : <LinearProgress />
            }
          </Grid>
      </Grid>
        </>
      
    )
  
}