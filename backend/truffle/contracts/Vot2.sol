// SPDX-License-Identifier: ISC
pragma solidity >=0.8.0;

import { MerkleProof } from "./lib/MerkleProof.sol";

contract Vot2 {
  // merkle root with which we will detect if sender address can vote
  bytes32 private _merkleRoot;

  // Holds the actual nr of votes per specimen index
  uint256[20] private _votes;

  // Holds the addresses which voted
  address[] private _voters;

  address private _owner;
  constructor() {
    _owner = msg.sender;
  }

  // Set merkle root and resets the state of contract.
  function setMerkleRoot(bytes32 merkleRoot) public {
    require(msg.sender == _owner, "Only contract creator can transact this method.");

    _merkleRoot = merkleRoot;
    delete _votes;
    delete _voters;
  }

  modifier mustBeInTree(bytes32[] memory merkleProof) {
    require(
      MerkleProof.verify(
        merkleProof,
        _merkleRoot, 
        keccak256(abi.encodePacked(msg.sender))
      ),
      "Address is not registered in system! You cannot vote"
    );

    _;
  }

  modifier mustNotHaveVoted() {
    bool hasVoted;

    for (uint256 i=0; i<_voters.length; i++) {
      if(_voters[i] == msg.sender) {
        hasVoted = true;
        break;
      }
    }

    require(!hasVoted, "You cannot vote twice.");

    _;
  }

  // Vote
  function setVote(bytes32[] memory merkleProof, uint256 specimenIndex) public mustBeInTree(merkleProof) mustNotHaveVoted {
    require(specimenIndex >= 0 && specimenIndex < 20, "Specimen index out of boundaries.");

    _voters.push(msg.sender);
    _votes[specimenIndex]++;
  }

  // Get votes
  function getVotes() public view returns(uint256[20] memory) {
    return _votes;
  }

  function iHaveVoted() public view returns(bool) {
    for(uint256 i=0; i<_voters.length; i++) {
      if(_voters[i] == msg.sender) {
        return true;
      }
    }

    return false;
  }
}