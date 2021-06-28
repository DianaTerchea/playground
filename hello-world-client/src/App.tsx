import React from 'react';
import './App.css';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, from} from "@apollo/client";
import {WebSocketLink} from 'apollo-link-ws';
import Register from "./pages/Register";
import AuthLayout from "./components/common/AuthLayout";
import Login from "./pages/Login";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Home from "./pages/Home";
import PrivateRoute from "./components/common/PrivateRoute";
import Company from "./pages/Company";
import { getMainDefinition } from '@apollo/client/utilities';
import { split } from 'apollo-link';

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/subscriptions',
    options: {
        reconnect: true
    }
})

const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: localStorage.getItem('token') || null,
        }
    }));

    return forward(operation);
})
const link = split(
    ({query}) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink as any,
    httpLink as any
)
const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000",
    link: from([
        authMiddleware,
        link as any
    ])
})

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                    <Switch>
                        <Route exact path={['/login', '/register']}>
                           <AuthLayout>
                               <Route exact path={'/register'} component={Register}/>
                               <Route exact path={'/login'} component={Login}/>
                           </AuthLayout>
                        </Route>
                        <Route exact path={['/', '/company/:companyId']}>
                            <PrivateRoute exact path="/" component={Home}/>
                            <PrivateRoute exact path="/company/:id" component={Company}/>
                        </Route>
                    </Switch>
            </Router>
        </ApolloProvider>
    );
}

export default App;
