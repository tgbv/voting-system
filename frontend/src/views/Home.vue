<template>
  <v-container>
    <v-row>
      <v-col v-for="choice in votingChoices" :key="choice">
        <v-card class="pa-6">{{ choice }}</v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VotingChoices from "../assets/choices.json";

export default {
  name: "Home",

  components: {},

  mounted() {
    this.$nextTick(async () => {
      console.log(this.$$contracts);
    });
  },

  computed: {
    votingChoices() {
      return VotingChoices;
    },
  },
};
</script>
