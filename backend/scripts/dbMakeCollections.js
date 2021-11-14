import mongoose from "mongoose";
import { log } from "../shared/logging.js";
import { getMongo } from "../shared/mongo.js";

(async function () {
  const Conn = await getMongo();

  log('Dropping previous indexes..')
  try {
    await Conn.collection('users').dropIndexes();
  } catch (e) {
    log(`Warning! ${e}`)
  }
  log('Done!')

  log('Creating new indexes..');
  await Conn.collection('users').createIndex({
    firstName: 1,
    lastName: 1,
    birth: 1,
    cnp: 1,
  });

  await Conn.collection('users').createIndex({ cnp: 1 }, { unique: true });
  await Conn.collection('users').createIndex({ ethAddr: 1 }, { unique: true });
  log('Done!');

  process.exit(0);
})();