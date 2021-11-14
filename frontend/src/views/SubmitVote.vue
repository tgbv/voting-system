<style scoped>
.pointer {
  cursor: pointer;
}
</style>
<template>
  <v-container>
    <template v-if="contractsAreLoaded">
      <h2>Vote please</h2>
      <v-row>
        <v-col v-for="(choice, index) in votingChoices" :key="choice">
          <v-card class="pa-6 pointer" @click="setVote(index)"
            >{{ choice }} ({{ getChoiceVotes(index) }} votes)</v-card
          >
        </v-col>
      </v-row>
    </template>

    <h2 v-else>Please wait until contracts are loaded..</h2>
  </v-container>
</template>
<script>
import VotingChoices from "../assets/choices.json";
import { getProvider, initContracts } from "../lib/web3.lib";

export default {
  name: "Home",

  data() {
    return {
      contracts: {},

      contractsAreLoaded: false,

      iHaveVoted: false,

      votesCount: [],
    };
  },

  mounted() {
    initContracts(getProvider(this.$store.state.mnemonic)).then(
      async (contracts) => {
        this.contracts = contracts;
        this.contractsAreLoaded = true;

        this.iHaveVoted = await contracts.Vot2.iHaveVoted.call();

        await this.updateVotes();
      }
    );
  },

  computed: {
    votingChoices() {
      return VotingChoices;
    },
  },

  methods: {
    async setVote(index) {
      if (this.iHaveVoted) {
        alert("Already voted! Cannot vote again");
        return;
      }

      this.contractsAreLoaded = false;

      try {
        const res = await this.contracts.Vot2.setVote.sendTransaction(
          this.$store.state.merkleProof,
          index,
          {
            from: getProvider(this.$store.state.mnemonic).getAddress(),
          }
        );

        if (res.tx) {
          alert("Success!");
        } else {
          alert(res.receipt.stack);
        }

        console.log(res);

        this.updateVotes();
      } catch (e) {
        alert(e.message);
      }
      
      this.contractsAreLoaded = true;
    },

    async updateVotes() {
      this.votesCount = await this.contracts.Vot2.getVotes.call();
    },

    getChoiceVotes(index) {
      if (this.votesCount[index]) {
        return this.votesCount[index].toString();
      }

      return "N/A";
    },
  },
};
</script>
