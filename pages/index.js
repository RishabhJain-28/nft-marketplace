import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3modal from "web3modal";
import axios from "axios";

import { nftaddress, nftmarketaddress } from "../contractAddresses";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import getNetwork from "../util/getNetwork";
import { RefreshIcon } from "@heroicons/react/outline";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const network = getNetwork();
  async function fetchNFTs() {
    try {
      setLoading(true);
      const provider = new ethers.providers.JsonRpcProvider(
        network.jsonrpcEndpoint
      );

      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        provider
      );

      const data = await marketContract.fetchMarketItems();
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          const price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        })
      );

      setNfts(items);
    } catch (err) {
      alert("some error occured :/ ");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function buyNft(nft) {
    const web3modal = new Web3modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.itemId,
      {
        value: price,
      }
    );
    await transaction.wait();
    fetchNFTs();
  }

  if (loading) {
    return (
      <div className="text-[#0cafa9] flex h-full justify-center items-center">
        <RefreshIcon className="w-20 h-20 animate-spin" />
      </div>
    );
  }
  if (!nfts.length)
    return (
      <h1 className="  text-[#0cafa9] px-20 py-10 text-3xl">
        The market is empty :')
      </h1>
    );

  return (
    <div className="flex justify-center ">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="shine shadow-lg text-[#0cafa9] rounded-lg border-2 border-[#0cafa9] overflow-hidden relative"
            >
              <div className="h-[200px] m-2 shadow-xl ">
                <img
                  src={nft.image}
                  className=" object-cover h-[200px] w-full"
                />
              </div>
              <div className=" ">
                <div className="px-4 ">
                  <p className="text-2xl text-center font-semibold my-4">
                    {nft.name}
                  </p>
                  <div>
                    <p className="text-[#0cafa9] overflow-hidden h-[70px]">
                      {nft.description}
                    </p>
                  </div>
                </div>
                <div className="p-2 flex justify-center items-center">
                  <button
                    className="w-[75%] mb-2 text-center  bg-[#0cafa9] text-white font-bold py-2 px-12 rounded z-10"
                    onClick={() => buyNft(nft)}
                  >
                    Buy for {nft.price} Matic
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
