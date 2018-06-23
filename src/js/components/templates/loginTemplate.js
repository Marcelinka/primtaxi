const loginTemplate = `
	<div class="center-container">
		<article class="message login">
			<div class="message-header">
				Авторизация
			</div>
			<div class="message-body">
				<form @submit.prevent="authorize">
					<div class="field">
						<label for="login" class="label">Логин</label>
						<div class="control has-icons-left">
							<input type="text" class="input" :class="{'is-danger': errors.log}" required v-model="login">
							<span class="icon is-left">
				      	<i class="fas fa-user"></i>
					    </span>
					    <p class="help is-danger" v-show="errors.log">{{errors.log}}</p>
						</div>
					</div>
					<div class="field">
						<label for="password" class="label">Пароль</label>
						<div class="control has-icons-left">
							<input type="password" class="input" :class="{'is-danger': errors.psw}" required v-model="password">
							<span class="icon is-left">
				      	<i class="fas fa-unlock"></i>
					    </span>
					    <p class="help is-danger" v-show="errors.psw">{{errors.psw}}</p>
						</div>
					</div>
					<!-- Добавить класс is-loading при отправке запроса -->
					<button type="submit" class="button is-dark login__button" :class="{'is-loading': loading}">Отправить</button>
				</form>
			</div>
		</article>
	</div>
`;

export default loginTemplate;