#!/bin/bash

if [ "$S_DB_IMPORT_DUMPS" == true ]; then
  npm run scripts/dbMakeCollections --prefix="/app"
  npm run scripts/dbInsertDumps --prefix="/app"
fi

if [ "$S_SC_MIGRATE" == true ]; then
  npm run truffle/migrate --prefix="/app" -- --network="production"
fi

if [ "$S_SC_IMPORT_MERKLE_ROOT" == true ]; then
  npm run scripts/scImportMerkleRoot --prefix="/app"
fi

if [ "$S_SC_FUND_ETH_ADDRESSES" == true ]; then
  npm run scripts/scFundAddresses --prefix="/app"
fi

npm run server/start --prefix="/app"