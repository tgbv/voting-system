import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mnemonic: "",
    merkleProof: [],
  },
  mutations: {
    setMnemonic(s, p) {
      s.mnemonic = p;
    },
    setMerkleProof(s, p) {
      s.merkleProof = p;
    },
  },
  actions: {},
  modules: {},
});
