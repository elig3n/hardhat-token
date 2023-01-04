const fs = require("fs");

const initialSupply = "1000000" + "0".repeat(18);

async function main() {
  const accounts = await ethers.getSigners();

  console.log("Deploying contracts with the account:", accounts[0].address);

  console.log("Account balance:", (await accounts[0].getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(initialSupply);

  console.log("Token address:", token.address);
  const abi = JSON.parse(token.interface.format("json"));
  const data = {
    address: token.address,
    abi: abi,
    accounts: accounts.slice(1).map((account) => account.address),
  }
  fs.writeFileSync("frontend/src/Token.json", JSON.stringify(data, null, 2));
  fs.writeFileSync("scripts/verify_token.bat", "npx hardhat verify --network testnet " + token.address + " " + initialSupply);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });