import {API, graphqlOperation} from "@aws-amplify/api";

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
