## Voting system

---

Decentralized voting system built on top of Ethereum network.
It's a prototype which can be used by governments as a starting point in regards to better democracy. The beauty of it is it's decentralized at core and difficult to forge.

I would not use it in production supporting >=10k active voters. While the space/time complexity of app would handle them without issues, I can't speak for Ethereum network itself. For that amount of transactions I'd use some L2 wrapper like Polygon.

### Abstract

I started from the idea that a government has a database with all it's citizens. For each citizen an Ethereum wallet is generated, with a unique mnemonic phrase. Citizens can claim access to that wallet via a web interface. Then citizens can vote the desired candidate via a transaction to a smart contract, which accepts TXs only from addresses present in a merkle tree (that is, the addresses of the wallets assigned to the citizens).

Citizens don't need to import the mnemonic phrase into Metamask, because most are not tech-savvy. They should be able to vote only once. The vote is not necessarily anonymous.

### Full flow:

1. There is a database with citizens data (first/last name, personal number, birth date).

2. I deterministically generate a mnemonic phrase of 12 words for each citizen from its personal data. These mnemonics will be used to derive hierarchical deterministic Ethereum wallets for each citizen. The derivation path is: m/44'/60'/0'/0/0

3. I built a Solidity contract which handles the votes. I migrate the contract on Ethereum network.

4. I compute the merkle root of all first ETH addresses derived from mnemonic wallets, using keccak256. I set the merkle root on the voting contract. That way, only addresses which are part of the merkle tree can submit votes to the contract.

5. I fund with 0.004ETH all ETH addresses derived from mnemonics. All ETH addresses are required to hold funds in order to send TXs, thus to submit votes.

6. Citizen opens the web platform and inputs its personal data

7. If personal data fully matches with the one from database, it receives the private mnemonic and the merkle proofs for contract's merkle tree check.

8. Citizen submits the vote: chosen candidate and merkle's proof are sent to the smart contract.

For steps 6, 7, 8 citizen does not deal with any sort of technical details. All that is already done in background.

### Deployment

The app does by itself many things under hood but to get it running you will need:

1. Docker
2. An ethereum wallet with funds depending on how many voters you wish your system to hold, and the mnemonic of that wallet
3. An ethereum RPC provider. I've used Infura on Ropsten testnet without issues.
4. At least 4GB of free RAM for containers expansion.

Once conditions are met, clone this repository somewhere and set up a ".env" file at its root, where "docker-compose.yml" is. You have an exaplained sample in ".env.example". Then run

```
docker-compose up
```

Images should be built, containers created, and app should be live at http://localhost:80. But it won't be live right after containers are started. Post-build tasks will continue for a while: DB seeds, contracts migrations, contracts setup, etc. Follow the logs and the bash entrypoints.

After first deployment is done, don't forget to modify the switch variables from ".env" file accordingly so they won't affect the app on next run.
