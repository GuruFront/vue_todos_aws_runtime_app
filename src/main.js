import Vue from 'vue'
import App from './App.vue'


//Amplify
import { Amplify} from 'aws-amplify';
import * as gen from './api'
Amplify.configure(gen.config)

// Vuetify
import vuetify from '@/plugins/vuetify' // path to vuetify export


Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')
