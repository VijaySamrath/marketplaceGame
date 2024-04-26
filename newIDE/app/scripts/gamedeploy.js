const hre = require('hardhat');

async function main() {
  const GameMarketplace = await hre.ethers.getContractFactory('GameMarketplace');
  const gameMarketplace = await GameMarketplace.deploy();

  await gameMarketplace.waitForDeployment();

  console.log('GameMarketplace deployed to:', gameMarketplace.target);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
