import { log } from "../shared/logging.js";
import { getAddressForUser } from "../shared/eth.js";
import { getMongo } from "../shared/mongo.js";

const nrOfDumps = process.env.DB_NR_OF_DUMPS || 100;

/**
 * @returns { Array<{
 *  firstName: string,
 *  lastName: string,
 *  birthDate: Date,
 *  cnp: string,
 *  ethAddr: string
 * }> }
 */
function makeUsers() {
  const records = [];
  for (let i = 0; i < nrOfDumps; i++) {
    const firstName = `First${i}`
    const lastName = `Last${i}`
    const birth = new Date
    const birthDate = new Date(`${birth.getUTCFullYear()}-${birth.getUTCMonth() + 1}-${birth.getUTCDate()}`)
    const cnp = `500000000000${i}`
    const ethAddr = getAddressForUser({ firstName, lastName, birthDate, cnp });

    records.push({
      firstName, lastName, birthDate, cnp, ethAddr
    });

    if (i % (nrOfDumps / 10) === 0) {
      log(`@ ${i}`)
    }
  }
  return records;
}

(async function () {
  const Conn = await getMongo();

  log('Dropping previous dumps..')
  await Conn.collection('users').deleteMany({});
  log('Done!')

  log('Creating new dumps..');
  const users = makeUsers();
  log('Done!');

  log(`Inserting new dumps..`)
  await Conn.collection('users').insertMany(users);
  log(`Done! Inserted ${users.length} records`)

  process.exit(0);
})();