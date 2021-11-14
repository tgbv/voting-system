import { entropyToMnemonic, mnemonicToSeed, HDNode } from "@ethersproject/hdnode";
import { wordlists } from "@ethersproject/wordlists";
import { createHash } from "crypto"
import { log } from "./logging.js";

/**
 * Get mnemonic seed for a user object.
 * 
 * @param {{
 *  firstName: string,
 *  lastName: string,
 *  birth: Date,
 *  cnp: string
 * }} userObj 
 * @returns {string}
 */
export function getMnemonicForUser(userObj) {
  const { firstName, lastName, birth, cnp } = userObj;

  const Hash = createHash('sha256');
  Hash.update(Buffer.from(`${firstName}${lastName}${birth}${cnp}`));

  return entropyToMnemonic(Hash.digest().slice(0, 16));
}

/**
 * Get ethereum address for a user. 
 * 
 * It's derived from HD node, which is derived from mnemonic, 
 * which is derived from user's personal data.
 * 
 * @param {{
 *  firstName: string,
 *  lastName: string,
 *  birth: Date,
 *  cnp: string
 * }} userObj 
 * @returns {string}
 */
export function getAddressForUser(userObj) {
  return getHDNodeForUser(userObj).address;
}

/**
 * Get hierarchical deterministic node for user.
 * 
 * @param {{
 *  firstName: string,
 *  lastName: string,
 *  birth: Date,
 *  cnp: string
 * }} userObj 
 * @returns {HDNode}
 */
export function getHDNodeForUser(userObj) {
  return HDNode
    .fromMnemonic(getMnemonicForUser(userObj))

    // this derivation path is compatible with MetaMask
    .derivePath(`m/44'/60'/0'/0/0`)
}