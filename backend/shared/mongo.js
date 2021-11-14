import mongoose from "mongoose";
import { MerkleTree } from "merkletreejs"
import keccak256 from "keccak256"
import { log } from "./logging.js"

let mongoConn;

/**
 * Get mongodb connection.
 * 
 * @returns {mongoose.Connection}
 */
export async function getMongo() {
  if (!mongoConn) {
    mongoConn = mongoose.createConnection();

    await mongoConn.openUri(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/vot')

    log('Connected to db!')
  }

  return mongoConn;
}

/**
 * Retrieve the merkle tree of all ethereum addresses registered in system.
 * 
 * @returns {MerkleTree}
 */
export async function getMerkleTree() {
  const conn = await getMongo();

  const addresses = await conn.collection('users').aggregate([{
    $project: {
      _id: false,
      ethAddr: true,
    }
  }]).toArray();

  addresses.forEach((obj, index) => {
    addresses[index] = obj.ethAddr;
  });

  return new MerkleTree(addresses, keccak256, {
    hashLeaves: true,
    sortPairs: true
  });
}