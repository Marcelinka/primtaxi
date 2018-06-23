import ordersTemplate from './templates/ordersTemplate.js';
import axios from "axios/index";

const ordersComponent = {
	data() {
		return {
			loading: false,
      limit: {
			  to: '',
        from: ''
      }
		}
	},
  computed: Vuex.mapState({
    id: state => state.user.id,
    name: state => state.user.name,
    active: state => state.archive.active,
    orders: state => state.archive.orders,
    current: state => state.archive.currentPage,
    ordersPage() { return this.$store.getters.ordersPage },
    all() { return this.$store.getters.allPages }
  }),
	template: ordersTemplate,
	created() {
		if(!this.active) {
      this.getActual();
    }
	},
	methods: {
		exit() {
      this.$store.commit('resetUser');
      this.$router.push('/login');
		},
		getArchive() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        if (this.active != 'archive') this.$store.commit('active');
        axios.post('/php/connect.php', {
          type: 'archive',
          data: {
            id: this.id
          }
        }).then((response) => {
          //console.log(response.data);
          response.data.forEach((element) => {
            element.hide = false;
          });
          this.$store.commit('orders', response.data);
          this.loading = false;
          resolve(true);
        });
      });
		},
		getActual() {
      this.loading = true;
      if(this.active != 'actual') this.$store.commit('active');
      axios.post('/php/connect.php', {
        type: 'actual',
        data: {
          id: this.id
        }
      }).then((response) => {
        this.$store.commit('orders', response.data);
        this.loading = false;
      });
		},
    formatDate(str) {
      let strArr = str.split(' ')[0].split('.');
      let strDate = strArr[2] + '-' + strArr[1] + '-' + strArr[0];
      return new Date(Date.parse(strDate));
    },
    limitOrders() {
			if(this.limit.from && this.limit.to) {
        if(this.active != 'archive') {
          this.getArchive().then(
              response => this.filterOrders()
          );
        } else {
          this.filterOrders();
        }
			}
		},
    filterOrders() {
      let fromDate = new Date(Date.parse(this.limit.from));
      let toDate = new Date(Date.parse(this.limit.to));
      let orders = this.orders.map((element) => {
        let elemFrom = this.formatDate(element.date_begin);
        let elemTo = this.formatDate(element.date_end);
        element.hide = !(elemFrom >= fromDate && elemTo <= toDate);
        return element;
      });
      this.$store.commit('orders', orders);
    }
	}
};

export default ordersComponent;