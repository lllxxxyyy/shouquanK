import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {
    imgSrc: '/static/mock/img/',
    detailId: sessionStorage.getItem('detailId'),
}
const mutations = {
    detailIds(state, detailId) {
        sessionStorage.setItem('detailId', detailId);
        state.detailId = detailId
    },
}

export default new Vuex.Store({
    state,
    mutations
})