import axios from 'axios';
import store from './data/store.js';
import router from './data/router.js';

const app = new Vue({
  router,
  store,
  computed: Vuex.mapState({
    id: state => state.user.id
  }),
  created: function() {
  	if(this.id && this.id != 'undefined' && this.$route.path == '/login') {
  		this.$router.replace('/orders');
  	} else if((!this.id || this.id == 'undefined') && this.$route.path != '/login') {
  		this.$router.replace('/login');
  	} else if(this.$route.path == '/') {
      this.$router.replace('/orders');
    }
  }
}).$mount('#app');