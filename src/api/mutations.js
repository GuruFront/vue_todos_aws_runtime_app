import {API, graphqlOperation} from "@aws-amplify/api";

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

export async function addTodo(author, data) {
    return await API.graphql(graphqlOperation(addTodoDoc, {author, data}))
}

export async function updateTodo(id, status, author) {
    return await API.graphql(graphqlOperation(updateTodoDoc, {id, status, author}))
}

export async function deleteTodo(id, author) {
    return await API.graphql(graphqlOperation(deleteTodoDoc, {id, author}))
}