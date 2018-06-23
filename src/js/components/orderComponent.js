import axios from 'axios';
import swal from 'sweetalert';
import orderTemplate from './templates/orderTemplate.js';
import getMap from './map.js';

const orderComponent = {
	data: function() {
		return {
			order: {},
			textComplain: '',
      loading: false
		}
	},
	template: orderTemplate,
  computed: Vuex.mapState({
    id: state => state.user.id,
    name: state => state.user.name
  }),
	created() {
	  this.loading = true;
    axios.post('/php/connect.php', {
      type: 'order',
      data: {
        id: this.id,
        order_id: this.$route.params.id
      }
    }).then((response) => {
      //console.log(response.data);
      this.order = response.data;
      this.loading = false;
      //console.log(this.order);
      axios.post('/php/connect.php', {
        type: 'gps',
        data: {order: 'o:'+this.order.id}
      }).then((response) => {
        response.data.forEach((elem) => {
          elem.lat = parseFloat(elem.lat);
          elem.lng = parseFloat(elem.lng);
        });
        getMap({
          from: {
            addr: this.order.addr_from,
            coords: {
              lat: parseFloat(this.order.lat_from),
              lng: parseFloat(this.order.lon_from)
            }
          },
          to: {
            addr: this.order.addr_to,
            coords: {
              lat: parseFloat(this.order.lat_to),
              lng: parseFloat(this.order.lon_to)
            }
          },
          coords: response.data
        });
      });
    });
	},
	methods: {
		complain() {
			if(this.textComplain) {
				let letter = `<div><b><i>Информация о заказе</i></b></div><br>`;
				letter += `<div><b>ID:</b> ${this.order.id}</div>`;
				if(this.order.cost) letter += `<div><b>Стоимость:</b> ${this.order.cost}</div>`;
				if(this.order.date_begin) letter += `<div><b>Заказ на время:</b> ${this.order.date_begin}</div>`;
				if(this.order.date_arrival) letter += `<div><b>Подача авто:</b> ${this.order.date_arrival}</div>`;
				if(this.order.date_end) letter += `<div><b>Завершение:</b> ${this.order.date_end}</div>`;
				if(this.order.duration || this.order.route_length != '0.0') {
					letter += `<div><b>Время/расстояние:</b> `;
					if(this.order.duration) letter += `${this.order.duration} мин.`;
					if(this.order.duration && this.order.route_length != '0.0')	letter += ', ';
					if(this.order.route_length != '0.0')	letter += `${this.order.route_length} км`;
					letter += '</div>';			
				}
				if(this.order.addr_from) letter += `<div><b>Адрес подачи:</b> ${this.order.addr_from}</div>`;
				if(this.order.addr_to) letter += `<div><b>Адрес завершения:</b> ${this.order.addr_to}</div>`;
				if(this.order.client_name) letter += `<div><b>Заказал:</b> ${this.order.client_name}</div>`;
				if(this.order.car_number) letter += `<div><b>Борт:</b> ${this.order.car_number}</div>`;
				letter += `
          <br>
          <div><b><i>Пользователь</i></b></div>
          <br>
          <div><b>ID:</b> ${this.id}</div>
          <div><b>Имя:</b> ${this.name}</div>
          <br>
          <div><b><i>Жалоба</i></b><p>${this.textComplain}<p></div>
        `;

				axios.post('/php/mail.php', {
	  			content: letter
	  		}).then((response) => {
	  			console.log(response);
	  			if(response.data.substr(response.data.length - 7) == 'success') {
	  				swal('Успех!', 'Письмо отправлено. Ожидайте ответа.', "success");
	  			} else {
	  				swal('Ошибка!', 'Что-то пошло не так, попробуйте позже.', "error");
	  			}
	  		});
			} else {
				swal('Ошибка!', 'Заполните поле с жалобой', 'info');
			}
		}
	}
};

export default orderComponent;