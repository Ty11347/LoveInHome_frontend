const state = {
  page: 99,
  loading: false,
}

const mutations = {
  set_page(state, page) {
    state.page = page;
  },
  set_loading(state, loading) {
    state.loading = loading;
  }
}

const actions = {
  login({ commit }, logininfo) {
    commit('set_loading', true);
    //------------
    commit('set_loading', false);
    commit('set_userinfo', logininfo);
  },
  OutLgoin({ commit }) {
    commit('set_userinfo', undefined);
  }
}

const getters = {
  page: state => state.page,
  loading: state => state.loading,
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}
