import Web3 from "web3";
import truffleContract from "@truffle/contract"
import HDWalletProvider from "@truffle/hdwallet-provider"
import { readdirSync, readFileSync } from "fs";
import { log } from "./logging.js";

/**
 * Get wallet provider for env mnemonic.
 * 
 * @returns {HDWalletProvider}
 */
export function getWallet() {
  return new HDWalletProvider(process.env.MNEMONIC, process.env.RPC_URL)
}

/**
 * Initializes contracts to interact with.
 * 
 * @returns {{string: ContractObject}}
 */
export async function initContracts() {
  const wallet = getWallet();
  const web3Provider = new Web3(wallet);

  const contracts = {};
  const contractsOnDisk = readdirSync('./truffle/build/contracts');

  for (const contractFname of contractsOnDisk) {
    try {
      const contractObj = JSON.parse(readFileSync(`./truffle/build/contracts/${contractFname}`));

      const tContract = truffleContract(contractObj)
      tContract.setProvider(web3Provider.currentProvider)

      contracts[contractObj.contractName] = await tContract.deployed()

      log(`Initiated contract ${contractObj.contractName}`)
    } catch (e) {
      log(`ERROR! Could not initiate contract ${contractFname}`, e)
    }

  }

  return contracts;
}