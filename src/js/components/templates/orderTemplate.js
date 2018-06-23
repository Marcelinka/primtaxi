const orderTemplate = `
	<div class="order">
		<article class="message order__info" :class="{loading: loading}">
		  <div class="message-header">
		    <p>Информация по заказу</p>
		  </div>
		  <div class="message-body">
		    <div>
		    	<span class="order__column">ID заказа</span>
		    	<span class="order__column">{{order.id}}</span>
		    </div>
		    <div v-if="order.cost">
		    	<span class="order__column">Стоимость</span>
			    <span class="order__column">{{order.cost}}</span>
			  </div>
		    <div>
		    	<span class="order__column">Тариф</span>
			    <span class="order__column"></span>
			  </div>
		    <div v-if="order.date_begin">
		    	<span class="order__column">Заказ на время</span>
		    	<span class="order__column">{{order.date_begin}}</span>
		    </div>
		    <div v-if="order.date_arrival">
		    	<span class="order__column">Подача авто</span>
		    	<span class="order__column">{{order.date_arrival}}</span>
				</div>
		    <div v-if="order.date_end">
		    	<span class="order__column">Завершение</span>
		    	<span class="order__column">{{order.date_end}}</span>
		    </div>
		    <div v-if="order.duration || order.route_length != '0.0'">
		    	<span class="order__column">Время/расстояние</span>
			    <span class="order__column">
			    	<span v-if="order.duration">{{order.duration}} мин.</span>
			    	<span v-if="order.duration && order.route_length != '0.0'">, </span>
			    	<span v-if="order.route_length != '0.0'">{{order.route_length}} км</span>
			    </span>
			  </div>
		    <div v-if="order.addr_from">
		    	<span class="order__column">Адрес подачи</span>
			    <span class="order__column">{{order.addr_from}}</span>
			  </div>
		    <div v-if="order.addr_to">
		    	<span class="order__column">Адрес завершения</span>
			    <span class="order__column">{{order.addr_to}}</span>
			  </div>
		    <div v-if="order.client_name">
		    	<span class="order__column">Заказал</span>
			    <span class="order__column">{{order.client_name}}</span>
			  </div>
		    <div v-if="order.car_number">
		    	<span class="order__column">Борт</span>
			    <span class="order__column">{{order.car_number}}</span>
			  </div>
				
				<textarea v-model="textComplain" class="textarea order__area" placeholder="Оставьте в заявке ваши контактные данные"></textarea>
		    <button @click="complain" class="button order__button">Пожаловаться</button>
		  </div>
		</article>
		<div class="order__map" id="order-map"></div>
	</div>
`;

export default orderTemplate;