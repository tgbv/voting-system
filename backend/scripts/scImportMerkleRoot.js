import { initContracts, getWallet } from "../shared/truffle.js";
import { getMerkleTree } from "../shared/mongo.js";
import { log } from "../shared/logging.js";

(async function () {
  const contracts = await initContracts();
  const MT = await getMerkleTree();

  log(`Importing merkle root ${MT.getHexRoot()} ...`)

  const res = await contracts.Vot2.setMerkleRoot.sendTransaction(MT.getHexRoot(), {
    from: getWallet().getAddress(0),
  });

  log('Done!', res);

  process.exit(0);
})();
