import loginTemplate from './templates/loginTemplate.js';
import axios from "axios/index";

const loginComponent = {
	data: function() {
		return {
			login: '',
			password: '',
			errors: {
				log: '',
				psw: ''
			},
			loading: false
		}
	},
	template: loginTemplate,
	methods: {
		authorize() {
			this.errors.log = '';
			this.errors.psw = '';
			if(this.login && this.password) {
				//console.log('Проверка пройдена');
				this.loading = true;
				//this.$parent.auth(this.login, this.password);
        axios.post('/php/connect.php', {
          type: 'auth',
          data: {
            login: this.login,
            password: this.password
          }
        }).then((response) => {
          response = response.data;
          console.log(response);
          if(response == 'login error') {
            this.errors.log = 'Логин не верен';
            this.loading = false;
          } else if(response == 'password error') {
            this.errors.psw = 'Пароль не верен';
            this.loading = false;
          } else {
            /*this.user.id = response.id;
            this.user.name = response.name;*/
            console.log(this.$store);
            this.$store.commit('user', {id: response.id, name: response.name});
            console.log(this.$router);
            this.$router.push('/orders');
          }
        });
			}
		}
	}
};

export default loginComponent;