const hre = require("hardhat");

async function main() {
 
  const HawqToken = await hre.ethers.getContractFactory("HawqToken");
  const hawqToken = await HawqToken.deploy();

  await hawqToken.deployed();

  console.log("hawq token contract deployed to:", hawqToken.address);

  const StakingContract = await hre.ethers.getContractFactory("StakingContract");
  const stakingContract = await StakingContract.deploy();

  await stakingContract.deployed();

  console.log("staking contract deployed to:", stakingContract.address);

  const AirdropContract = await hre.ethers.getContractFactory("AirdropContract");
  const airdropContract = await AirdropContract.deploy();

  await airdropContract.deployed();

  console.log("airdrop contract deployed to:", airdropContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });