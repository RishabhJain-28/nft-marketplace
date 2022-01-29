# NFT Galaxy

## NFT Galaxy is a simple nft marketplace running on Polygon PoS chain.

<br />

# Technologies Used

- NextJS for building the frontend application
- EthersJs for connecting the frontend to the blockchain
- Solidity for writing smart contracts for ethereum
- Hardhat for testing and deployment of the smart contracts
- ipfs for uploading token meta data

Infura is used for deploying the smart contract on the testnet.
The NFT smart contract implements ERC20 token standard using open zepplin.

```shell
yarn comile
yarn build
yarn deploy:local
yarn deploy:mumbai
yarn node:local
```

https://nft-marketplace-umber.vercel.app/
<br />
This deployment is done using vercel for demo purposes.
The smart contract is deployed on polygon mumbai testnet.

todo : implement go image tranformation server, make ui responsive :')
