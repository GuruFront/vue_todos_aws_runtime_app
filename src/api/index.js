import {subscribe, subscribeDelete, subscribeUpdate} from "@/api/subscribtions";
import {getTodos} from "@/api/queries";
import {addTodo, deleteTodo, updateTodo} from "@/api/mutations";

const api = {
    subscribtions: {
        subscribe,
        subscribeDelete,
        subscribeUpdate
    },
    queries: {
        getTodos
    },
    mutations: {
        addTodo,
        updateTodo,
        deleteTodo,
    }
}

export default api
