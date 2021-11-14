import { log } from "../shared/logging.js";
import { getMerkleTree } from "../shared/mongo.js";

(async function () {
  const tree = await getMerkleTree();

  log(`Hex merkle root: ${tree.getHexRoot()}`)

  process.exit(0);
})();