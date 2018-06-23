const store = new Vuex.Store({
  state: {
    user: {
      id: window.sessionStorage.getItem('id'),
      name: window.sessionStorage.getItem('name')
    },
    archive: {
      active: '',
      orders: [],
      currentPage: 1
    }
  },
  getters: {
    ordersPage: state => {
      let count = state.archive.currentPage * 20;
      let active = 0;
      let page = state.archive.orders.filter(function(order) {
        if(!order.hide) {
          active++;
          return active > count - 20 && active <= count;
        } else return false;
      });
      return page;
    },
    allPages: state => {
      state.archive.currentPage = 1;
      return Math.ceil(state.archive.orders.filter((el) => {return !el.hide}).length / 20);
    }
  },
  mutations: {
    user (state, user) {
      state.user.id = user.id;
      state.user.name = user.name;
      window.sessionStorage.setItem('id', state.user.id);
      window.sessionStorage.setItem('name', state.user.name);
    },
    resetUser (state) {
      state.user.id = '';
      state.user.name = '';
      window.sessionStorage.setItem('id', '');
      window.sessionStorage.setItem('name', '');
      state.archive.active = '';
      state.archive.orders = [];
      state.archive.pages.current = 1;
    },
    active (state) {
      if(state.archive.active == 'actual') state.archive.active = 'archive';
      else state.archive.active = 'actual';
    },
    orders (state, arr) {
      state.archive.orders = arr;
    },
    prev (state) {
      if(state.archive.currentPage > 1) {
        state.archive.currentPage--;
      }
    },
    next (state) {
      if(state.archive.currentPage < store.getters.allPages) {
        state.archive.currentPage++;
      }
    },
    currentPage (state, page) {
      if(page >= 1 && page <= store.getters.allPages) {
        state.archive.currentPage = page;
      }
    }
  }
});

export default store;