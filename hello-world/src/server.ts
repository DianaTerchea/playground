import { ApolloServer } from 'apollo-server'
import { securedSchema } from './schema'
import {createContext} from "./context";


const server = new ApolloServer({
    schema: securedSchema,
    context: createContext,
})

server.listen().then(async ({ url }) => {
    console.log(`Server running at: ${url}`)
})
