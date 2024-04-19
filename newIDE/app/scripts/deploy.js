const hre = require('hardhat');

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory('NFTMarketplace');
  const marketplace = await NFTMarketplace.deploy();

  await marketplace.waitForDeployment();

  console.log('NFTMarketplace deployed to:', marketplace.target);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
