import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import system from "./modules/system"
// import dbData from "./modules/dbData"
// import map from './modules/map'
// import homePages from './modules/homePages'

export default new Vuex.Store({
    modules: {
        system
    }
});
