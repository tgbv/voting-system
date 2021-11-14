<template>
  <v-container>
    <h2>Please input your personal info</h2>
    <v-text-field
      v-model="personalInfo.firstName"
      label="First Name"
    ></v-text-field>
    <v-text-field
      v-model="personalInfo.lastName"
      label="Last Name"
    ></v-text-field>
    <v-text-field
      v-model="personalInfo.birthDate"
      label="Birth date (YYYY-MM-DD)"
    ></v-text-field>
    <v-text-field
      v-model="personalInfo.cnp"
      label="CNP (5123456789012)"
    ></v-text-field>

    <v-btn elevation="3" @click="goNext()" :disabled="isProcessing">Next</v-btn>
    <span v-if="isProcessing">Processing, please wait...</span>
  </v-container>
</template>

<script>
import { post } from "axios";

const now = new Date();

export default {
  data() {
    return {
      personalInfo: {
        firstName: "First0",
        lastName: "Last0",
        cnp: "5000000000000",
        birthDate: `${now.getUTCFullYear()}-${
          now.getUTCMonth() + 1
        }-${now.getUTCDate()}`,
      },

      isProcessing: false,
    };
  },

  methods: {
    async goNext() {
      post("/api/fetch-wallet", this.personalInfo)
        .then((res) => {
          const { mnemonic, proof } = res.data;

          this.$store.commit("setMnemonic", mnemonic);
          this.$store.commit("setMerkleProof", proof);

          this.isProcessing = true;

          this.$router.push({ name: "SubmitVote" });
        })

        .catch((err) => {
          switch (err.response.status) {
            case 404: {
              alert(
                "Invalid data! Make sure birth date is written in correct form: YYYY-MM-DD"
              );
              break;
            }

            default: {
              alert("Server error occurred. Make sure API is working.");
            }
          }
        });
    },
  },
};
</script>
