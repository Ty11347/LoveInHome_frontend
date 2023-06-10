const state = {
  page: 99,
  loading: false,
  session: {},
}

const mutations = {
  set_page(state, page) {
    state.page = page;
    sessionStorage.setItem("page", page);
  },
  set_loading(state, loading) {
    state.loading = loading;
  },
  set_session(state, session) {
    state.session = session;
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
  session: state => state.session,
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}
