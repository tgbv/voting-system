import Express from "express";
import compression from "compression";
import { readdirSync, readFileSync } from "fs";
import { log } from "../shared/logging.js";
import BodyParser from "body-parser"
import { getMongo, getMerkleTree } from "../shared/mongo.js";
import { getMnemonicForUser } from "../shared/eth.js"
import keccak256 from "keccak256";

(async function () {
  const Conn = await getMongo();
  log('Got mongo..')

  const MT = await getMerkleTree();
  log(`Got merkle tree ${MT.getHexRoot()}`);

  const App = new Express();
  App.use(compression())
  App.use('*', (req, res, next) => {
    log(req.method, req.originalUrl)
    next();
  })

  /**
   * Get all compiled contracts as JSON.
   */
  App.get('/contracts', (req, res) => {
    const contractsFname = readdirSync('./truffle/build/contracts');
    let toReturn = "[";

    for (const contractFname of contractsFname) {
      toReturn += readFileSync(`./truffle/build/contracts/${contractFname}`).toString();
      toReturn += ","
    }

    toReturn = toReturn.slice(0, -1)
    toReturn += "]";

    res.header("Content-Type", "application/json")
      .send(toReturn)
      .end();
  });

  /**
   * Retrieve wallet data based on request input.
   */
  App.post('/fetch-wallet', BodyParser.json(), async (req, res, next) => {
    const { firstName, lastName, birthDate, cnp } = req.body;

    const user = await Conn.collection('users').findOne({
      cnp,
      firstName: new RegExp(`^${firstName}$`, 'i'),
      lastName: new RegExp(`^${lastName}$`, 'i'),
      birthDate: new Date(birthDate)
    });

    if (user) {
      res.send({
        mnemonic: getMnemonicForUser(user),
        proof: MT.getHexProof(keccak256(user.ethAddr))
      })
    } else {
      res.status(404).end();
    }
  });

  App.listen(process.env.API_LISTEN_PORT || 3000, log("Started listening.."))
})();

