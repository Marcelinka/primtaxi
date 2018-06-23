const ordersTemplate = `
	<div class="container orders">
		<header class="level orders__header">
			<div class="level-left orders__form">
				<div class="level-item orders__period">Период</div>
				<div class="field has-addons orders__inputs">
					<div class="control has-icons-left">
						<input type="date" class="input orders__input" name="begin" v-model="limit.from">
						<span class="icon is-left orders__label">
				      с:
				    </span>
					</div>
					<div class="control has-icons-left">
						<input type="date" class="input orders__input" name="end" v-model="limit.to">
						<span class="icon is-left">
				      по:
				    </span>
					</div>
					<div class="control">
						<button @click="limitOrders" class="button is-dark">Выбрать</button>
					</div>
				</div>
			</div>
			<div class="level-right orders__right">
				<a href="#" class="orders__company level-item title">
					{{name}}
				</a>
				<div class="level-item">
					<button href="#" class="button is-dark orders__button" @click="exit">Выйти</button>
				</div>
			</div>
		</header>
		
		<div class="tabs">
		  <ul>
		    <li @click="getActual" :class="{'is-active': (active == 'actual')}"><a>Актуальные заказы</a></li>
		    <li @click="getArchive" :class="{'is-active': (active == 'archive')}"><a>Архивные заказы</a></li>
		  </ul>
		</div>

		<section class="orders__table-wrapper" :class="{'loading': loading}">
			<table class="table orders__table">
				<thead>
					<tr>
						<th>№</th>
						<th>Заказ на время</th>
						<th>Подача авто</th>
						<th>Завершение</th>
						<th>Адрес подачи</th>
						<th>Адрес завершения</th>
						<th>Заказал</th>
						<th>Стоимость</th>
						<th>Борт</th>
						<th v-if="active == 'archive'">Статус</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(order, number) in ordersPage" 
							class="orders__row"
							@click="$router.push('/orders/'+order.id)">
						<th>{{(current - 1) * 20 + number + 1}}</th>
						<td>{{order.date_begin}}</td>
						<td>{{order.date_arrival}}</td>
						<td>{{order.date_end}}</td>
						<td>{{order.addr_from}}</td>
						<td>{{order.addr_to}}</td>
						<td>{{order.client_name}}</td>
						<td>{{order.cost}}</td>
						<td>{{order.car_number}}</td>
						<td v-if="active == 'archive'" class="orders__status">
							<i class="fas fa-check orders__ok" v-if="order.id_closed_result == 1"></i>
							<i class="fas fa-times orders__cancel" v-else></i>
						</td>
					</tr>
				</tbody>
			</table>
			
			<nav class="pagination is-centered" role="navigation" aria-label="pagination" v-if="all > 1">
        <a class="pagination-previous" @click="$store.commit('prev')" :disabled="current <= 1">Назад</a>
        <a class="pagination-next" @click="$store.commit('next')" :disabled="current >= all">Вперед</a>
        <ul class="pagination-list">
          <li v-if="current > 2"><a class="pagination-link" @click="$store.commit('currentPage', 1)">1</a></li>
          <li v-if="current > 3"><span class="pagination-ellipsis">&hellip;</span></li>
          <li v-if="current > 1">
            <a class="pagination-link" @click="$store.commit('prev')">
              {{ current - 1 }}
            </a>
          </li>
          <li v-if="all > 2">
            <a class="pagination-link is-current">
              {{ current }}
            </a>
          </li>
          <li v-if="all > 2 && current < all">
            <a class="pagination-link" @click="$store.commit('next')">
              {{ current + 1 }}
            </a>
          </li>
          <li v-if="all > 5 && current < all - 2">
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li v-if="all > 2 && current < all - 1">
            <a class="pagination-link" @click="$store.commit('currentPage', all)">{{all}}</a>
          </li>
        </ul>
      </nav>
		</section>
	</div>
`;

export default ordersTemplate;