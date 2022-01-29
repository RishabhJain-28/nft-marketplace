const networkConfig = {
  mainnet: {
    jsonrpcEndpoint: "",
  },
  testnet: {
    jsonrpcEndpoint: "https://rpc-mumbai.maticvigil.com",
  },
  localhost: {
    jsonrpcEndpoint: "http://localhost:8545",
  },
};

const getConfig = () => {
  const network = process.env.NEXT_PUBLIC_NETWORK;
  return networkConfig[network];
};

export default getConfig;
