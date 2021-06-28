import { ApolloServer } from 'apollo-server'
import { securedSchema } from './schema'
import {createContext} from "./context";


const server = new ApolloServer({
    schema: securedSchema,
    context: createContext,
    subscriptions: {
        path: "/subscriptions",
        onConnect(_, _1, _2){
            console.log("Connected")
        },
        onDisconnect(_,_1){
            console.log("Disconnected")
        }
    }
})


server.listen().then(async ({ url , subscriptionsUrl}) => {
    console.log(`Server running at: ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
