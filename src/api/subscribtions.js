import {API, graphqlOperation} from "@aws-amplify/api";

export const subscribeDoc = /* GraphQL */ `
    subscription Subscribe($author: String!) {
        subscribe(author: $author) {
            id
            title
            author
            status
        }
    }
`

export const subscribeUpdateDoc = /* GraphQL */ `
    subscription subscribeUpdate($author: String!) {
      subscribeUpdate(author: $author) {
        id
        title
        author
        status
      }
    }
`

export const subscribeDeleteDoc = /* GraphQL */ `
    subscription subscribeDelete($author: String!) {
      subscribeDelete(author: $author) {
        id
        title
        author
        status
      }
    }
`

export function subscribe(author, next, error) {
    return API.graphql(graphqlOperation(subscribeDoc, {author})).subscribe({
        next: ({provider, value}) => {
            next(value.data.subscribe, provider, value)
        },
        error: error || console.log,
    })
}

export function subscribeUpdate(author, next, error) {
    return API.graphql(graphqlOperation(subscribeUpdateDoc, {author})).subscribe({
        next: ({value}) => {
            next(value)
        },
        error: error || console.log,
    })
}

export function subscribeDelete(author, next, error) {
    return API.graphql(graphqlOperation(subscribeDeleteDoc, {author})).subscribe({
        next: ({value}) => {
            next(value)
        },
        error: error || console.log,
    })
}