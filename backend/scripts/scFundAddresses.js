import { getWallet } from "../shared/truffle.js";
import { getMongo } from "../shared/mongo.js";
import { log } from "../shared/logging.js";
import Web3 from "web3";

/**
 * Amount of ether to send to registered wallets
 * 
 * @type {string}
 */
const amountOfEth = process.env.SC_FUND_ETH_AMOUNT || "0.004"

/**
 * Nr of remaining wallets waiting for their TXs to be confirmed by the block.
 */
let remainingWallets = 0;

/**
 * Callback invoked after TX is confirmed on block
 * 
 * @param {TX METADATA} meta 
 */
function handleMeta(meta) {
  if (meta.status) {
    log(`TX registered in block ${meta.blockNumber}!`)
  } else {
    log(`Warning! Unknown status. Please check meta:`, meta)
  }

  remainingWallets--;

  if (remainingWallets === 0) {
    log('All addresses funded!')
    process.exit(0)
  }
}

(async function () {
  const Conn = await getMongo();

  log('Get addresses..')
  const addresses = await Conn.collection('users').aggregate([{
    $project: {
      _id: false,
      ethAddr: true,
    }
  }]).toArray();

  addresses.forEach((obj, index) => {
    addresses[index] = obj.ethAddr;
  });
  remainingWallets = addresses.length;
  log('Done!');

  log('Funding addresses..')
  const Wallet = getWallet();
  const W3 = new Web3(Wallet)

  for (const addr of addresses) {
    try {
      W3.eth.sendTransaction({
        from: Wallet.getAddress(),
        to: addr,
        value: Web3.utils.toWei(amountOfEth, 'ether'),
      }).then(handleMeta)

      log(`Sent ${amountOfEth}ETH to ${addr}`)
    } catch (e) {
      log(`ERROR for address ${addr}:`, e)
    }
  }

  log(`Waiting for TXs to be registered in blocks. Their meta will be posted shortly, DO NOT close the window....`)
})();
