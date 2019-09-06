import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, split, Observable } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import App from './App'

const httpLink = new HttpLink({ uri: 'https://api.stage.pomona.id/graphql' })

const wsLink = new WebSocketLink({
  uri: '',
  options: {
    reconnect: true,
    lazy: true
  }
})

const request = async operation => {
  const token = localStorage.getItem('token')
  operation.setContext({
    headers: {
      authorization: token
    }
  })
}

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) handle.unsubscribe()
      }
    })
)

const terminatingLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

// eslint-disable-next-line new-cap
const link = new ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      // eslint-disable-next-line no-console
      console.log('graphQLErrors', graphQLErrors)
    }
    if (networkError) {
      // eslint-disable-next-line no-console
      console.log('networkError', networkError)
    }
  }),
  requestLink,
  terminatingLink
])

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache: cache.restore(window.__APOLLO_STATE__),
  fetchOptions: {
    credentials: 'include'
  }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
)
