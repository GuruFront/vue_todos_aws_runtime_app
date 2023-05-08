<template>
  <v-app>
    <v-main>
      <v-theme-provider root :dark="isDark">
        <v-container>
          <v-row justify="center" class="ma-5">
            <v-col xs="12" sm="8">
              <v-card>
                <v-toolbar color="blue darken-4" dark>
                  <v-toolbar-title class="headline">Todo App</v-toolbar-title>
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
                  <v-subheader class="headline">{{ day }}, {{ date }}{{ ord }} {{ year }}</v-subheader>
                  <p class="mx-12 text-right"><b>{{ todos.length }}</b> Tasks</p>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>

                        <v-text-field v-model="newTodo" id="newTodo" name="newTodo" label="Type your task"
                                      @keyup.enter="addTodo" :hint="todoExists" persistent-hint/>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-list subheader two-line flat>
                  <v-subheader class="subheading" v-if="todos.length === 0">You have 0 Tasks, add some</v-subheader>
                  <v-subheader class="subheading" v-else-if="todos.length === 1">Your Tasks</v-subheader>
                  <v-list-item-group>
                    <v-list-item v-for="(todo) in todos" :key="todo.title">
                      <v-list-item-content
                          @click="updateTodo(todo.id, `${todo.status === 'true' ? 'false' : 'true'}`, channel)">
                        <v-list-item-title :class="{ done: todo.status === 'true'}">
                          {{ capitalize(todo.title) }}
                          <v-icon right v-show="todo.status === 'true'"> mdi-checkbox-marked-circle</v-icon>
                        </v-list-item-title>
                        <v-list-item-subtitle>Added on: {{ date }}{{ ord }} {{ day }} {{
                            year
                          }}
                        </v-list-item-subtitle>
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
import * as gen from './api'
import {updateTodo} from "./api";

export default {
  name: 'App',
  data() {
    return {
      channel: "Todos",
      updateTodo: updateTodo,
      isDark: true,
      show: true,
      newTodo: "",
      todos: [],
      day: this.todoDay(),
      date: new Date().getDate(),
      ord: this.nth(new Date().getDate()),
      year: new Date().getFullYear(),
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
    this.darkThemeHandler();
    this.getTodos();
    this.onAddSubscribe();
    this.onUpdateSubscribe();
    this.onDeletedSubscribe();
  },
  methods: {
    onAddSubscribe() {
      gen.subscribe(this.channel, ({title, status, id}) => {
        this.todos.push({
          id,
          title,
          status: status === 'true' ? 'true' : 'false'
        })
      })
    },
    onUpdateSubscribe() {
      gen.subscribeUpdate(this.channel, ({data}) => {
        this.todos = this.todos.map(i => {
          if (i.id === data.subscribeUpdate.id) {
            i.status = data.subscribeUpdate.status === 'true' ? 'true' : 'false'
          }
          return i
        })
      })
    },
    onDeletedSubscribe() {
      gen.subscribeDelete(this.channel, ({data}) => {
        this.todos = this.todos.filter(i => {
          return i.id !== data.subscribeDelete.id
        })
      })
    },
    async getTodos() {
      const data = await gen.getTodos()
      this.todos = [...this.todos, ...data.data.getTodos]
    },
    darkThemeHandler() {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      this.isDark = darkThemeMq.matches
      darkThemeMq.addListener(e => this.isDark = e.matches);
    },
    async addTodo() {
      this.isTodoExist = false;
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      const isTodoExists = this.todos.find((todo) => todo.title === value);
      if (!isTodoExists) {
        await gen.addTodo(this.channel, JSON.stringify({title: this.newTodo, author: this.channel}))

        this.newTodo = "";
      }
      if (isTodoExists) {
        this.isTodoExist = true;
      }
    },
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    removeTodo(id) {
      gen.deleteTodo(id, this.channel)
    },
    todoDay() {
      const d = new Date();
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      return days[d.getDay()];
    },

    nth(d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }
  }
}
</script>


<style scoped>
.done {
  text-decoration: line-through;
}
</style>
