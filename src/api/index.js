import {graphqlOperation, API} from '@aws-amplify/api'

export const config = {
    "aws_appsync_graphqlEndpoint": "https://6fh2we4l5fbilkhgoa5n3uonqu.appsync-api.eu-central-1.amazonaws.com/graphql",
    "aws_appsync_region": "eu-central-1",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "da2-sa3mpes6b5by7oeictgj56rwau",
}

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
    subscription MySubscription($author: String!) {
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

export const updateTodoDoc = /* GraphQL */ `
    mutation updateTodoStatus($id: ID!, $status: String, $author: String) {
      updateTodo(id: $id, status: $status, author: $author) {
        id
        title
        author
        status
      }
    }
`

export const deleteTodoDoc = /* GraphQL */ `
    mutation deleteTodo($id: ID!, $author: String!) {
        deleteTodo(id: $id, author: $author) {
            id
            title
            author
            status
        }
    }
`
export const addTodoDoc = /* GraphQL */ `
    mutation addTodo($data: AWSJSON!, $author: String!) {
        addTodo(data: $data, author: $author) {
            id
            title
            author
            status
        }
    }
`

export const getAllTodosDoc = /* GraphQL */ `
    query {
        getTodos {
            id
            author
            status
            title
        }
    }
`


export async function getTodos() {
    return await API.graphql(graphqlOperation(getAllTodosDoc))
}

export async function addTodo(author, data) {
    return await API.graphql(graphqlOperation(addTodoDoc, {author, data}))
}

export async function updateTodo(id, status, author) {
    return await API.graphql(graphqlOperation(updateTodoDoc, {id, status, author}))
}


export async function deleteTodo(id, author) {
    return await API.graphql(graphqlOperation(deleteTodoDoc, {id, author}))
}

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
