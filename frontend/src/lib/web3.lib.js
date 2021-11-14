import { get } from "axios";
import truffleContract from "@truffle/contract";
import HDWalletProvider from "@truffle/hdwallet-provider";

/**
 * Returns new wallet provider based on supplied mnemonic.
 *
 * @param {string} mnemonic
 */
export function getProvider(mnemonic) {
  return new HDWalletProvider(
    mnemonic,
    // eslint-disable-next-line no-undef
    RPC_URL
  );
}

/**
 * Initializes Truffle Contracts.
 *
 * @param {HDWalletProvider | undefined} provider
 * @returns {Promise<{string: Object}>} hashmap of contracts
 */
export async function initContracts(provider) {
  if (!provider && !window.ethereum) {
    throw new Error("No provider available");
  }

  const res = await get("/api/contracts");
  const contractsObj = res.data;
  const contracts = {};

  for (const contractObj of contractsObj) {
    try {
      const contractTruffle = truffleContract(contractObj);

      contractTruffle.setProvider(provider || window.ethereum);

      contracts[contractObj.contractName] = await contractTruffle.deployed();
    } catch (e) {
      console.log("Contract error!", e);
    }
  }

  return contracts;
}
