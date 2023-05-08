<template>
  <v-app>
    <v-main>
      <v-theme-provider root :dark="isDark">
        <v-container>
          <v-row justify="center" class="ma-5">
            <v-col xs="12" sm="8">
              <v-card>
                <v-toolbar color="blue darken-4" dark>
                  <v-toolbar-title class="headline">Vue real time todo app</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon @click="isDark = !isDark" v-on="on">
                        <v-icon v-model="isDark">{{ !isDark ? 'mdi-weather-night' : 'mdi-weather-cloudy' }}</v-icon>
                      </v-btn>
                    </template>
                    <span>
                      {{ isDark ? 'light mode' : 'dark mode' }}
                    </span>
                  </v-tooltip>
                </v-toolbar>
                <v-list two-line subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field v-model="newTodo" id="newTodo" name="newTodo" label="Type your task"
                                    @keyup.enter="addTodo" :hint="todoExists" persistent-hint>
                        <template v-slot:append v-if="newTodo.length">
                          <v-icon color="green" @click="addTodo">
                            mdi-plus
                          </v-icon>
                        </template>
                      </v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-list subheader two-line flat>
                  <v-subheader class="subheading" v-if="todos.length === 0">
                    {{ todos.length ? "Your Tasks" : "You have 0 Tasks, add some" }}
                  </v-subheader>
                  <v-list-item-group>
                    <v-list-item v-for="todo in todos" :key="todo.title">
                      <v-list-item-content
                          @click="updateTodo(todo.id, `${todo.status === 'true' ? 'false' : 'true'}`, channel)">
                        <v-list-item-title :class="{ done: todo.status === 'true'}">
                          <v-icon right>
                            {{ todo.status === 'true' ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}
                          </v-icon>
                          {{ todo.title }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-btn fab ripple small color="red" v-if="todo.status === 'true'"
                             @click="removeTodo(todo.id, todo.author)">
                        <v-icon class="white--text">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-theme-provider>
    </v-main>
  </v-app>

</template>

<script>
import api from './api'

export default {
  name: 'App',
  data() {
    return {
      channel: "Todos",
      updateTodo: api.mutations.updateTodo,
      isDark: false,
      show: true,
      newTodo: "",
      todos: [],
      isTodoExist: false
    };
  },
  computed: {
    todoExists() {
      return this.isTodoExist
          ? "todo is already in the list add another one"
          : "";
    },
  },
  mounted() {
    this.getTodos();
    this.onAddSubscribe();
    this.onUpdateSubscribe();
    this.onDeletedSubscribe();
  },
  methods: {
    onAddSubscribe() {
      api.subscribtions.subscribe(this.channel, ({title, status, id}) => {
        this.todos.push({
          id,
          title,
          status: status === 'true' ? 'true' : 'false'
        })
      })
    },
    onUpdateSubscribe() {
      api.subscribtions.subscribeUpdate(this.channel, ({data}) => {
        this.todos = this.todos.map(i => {
          if (i.id === data.subscribeUpdate.id) {
            i.status = data.subscribeUpdate.status === 'true' ? 'true' : 'false'
          }
          return i
        })
      })
    },
    onDeletedSubscribe() {
      api.subscribtions.subscribeDelete(this.channel, ({data}) => {
        this.todos = this.todos.filter(i => {
          return i.id !== data.subscribeDelete.id
        })
      })
    },
    async getTodos() {
      const data = await api.queries.getTodos()
      this.todos = [...this.todos, ...data.data.getTodos]
    },
    async addTodo() {
      this.isTodoExist = false;
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      const isTodoExists = this.todos.find((todo) => todo.title === value);
      if (!isTodoExists) {
        await api.mutations.addTodo(this.channel, JSON.stringify({title: this.newTodo, author: this.channel}))
        this.newTodo = "";
        return
      }
      this.isTodoExist = true;
    },
    removeTodo(id) {
      api.mutations.deleteTodo(id, this.channel)
    },
  }
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>
