import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import { config } from '../state/config'

const {
  GRAPH_NFT_API_URL,
  GRAPH_FACTORY_API_URL,
  GRAPH_REGISTRY_API_URL,
} = config

const FACTORY_QUERY=`
    query{
        logs(first: 1000, orderBy: created, orderDirection:desc, where: {event_in: ["createDAO"]}) {
            id
            standard
            version
            event
            created
            contractId
            did
            status
            deposit
            summoner
        }
    }
`
const REGISTRY_QUERY = `
query{
    accounts{
        id
        log
    }
}
`
const USER_NFTS = gql`
    query GetTokensByOwner($owner: String!) {
        nftMints(where: {owner_id_in: [$owner]}) {
            id
            blockTime
            owner_id
            token_ids
        }
    }
`

const ALL_BUILDINGS = `
query{
    nftMints{
        id
        blockTime
        owner_id
        token_ids
    }
}
`

const ALL_SPACES = `
query{
    putIdDIDs(where: {type_in: ["space"]}){
        id
        did
        identifier
        type
        registered
    }
}
`

const BUILDING_SPACES = gql`
    query GetSpacesByBuilding($buildingId: String!) {
        putIdDIDs(where: {identifier_in: [$buildingId]}) {
            id
            blockTime
            identifier
            did
        }
    }
`
const ALL_MINTS = `
query{
    ftmints(){
        id
        blockTime
        action
        amount
        token
        to
    }
}
`

const ALL_TRANSFERS = `
query{
    transfers(){
        id
        blockTime
        action
        amount
        transferFrom
        transferTo
    }
}
`

const factoryClient = new ApolloClient({
    uri: GRAPH_FACTORY_API_URL,
    cache: new InMemoryCache(),
})

const registryClient = new ApolloClient({
    uri: GRAPH_REGISTRY_API_URL,
    cache: new InMemoryCache(),
})

const nftClient = new ApolloClient({
    uri: GRAPH_NFT_API_URL,
    cache: new InMemoryCache(),
})


    

export default class Queries {

    async getCommunities(){
        const communities = await factoryClient.query({query: gql(FACTORY_QUERY)})
        return communities
    }

    async getTokens(owner){
        const tokens = await nftClient.query({query: USER_NFTS, variables: {
            owner: owner
        }})
        return tokens
    }

    async getAllBuildings(){
        const buildings = await nftClient.query({query: gql(ALL_BUILDINGS)})
        return buildings
    }

    async getAllSpaces(){
        const spaces = await registryClient.query({query: gql(ALL_SPACES)})
        return spaces
    }

    async getBuildingSpaces(buildingId){
        const spaces = await registryClient.query({query: BUILDING_SPACES, variables: {
            buildingId: buildingId
        }})
        return spaces
    }

}

export const queries = new Queries();