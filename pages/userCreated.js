import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftmarketaddress, nftaddress } from "../contractAddresses";

import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import { RefreshIcon } from "@heroicons/react/outline";

export default function UserCreated() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCreatedNFTs();
  }, []);
  async function fetchCreatedNFTs() {
    try {
      setLoading(true);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      const data = await marketContract.fetchItemsCreated();

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            image: meta.data.image,
            name: meta.data.name,
          };
          return item;
        })
      );
      const soldItems = items.filter((i) => i.sold);
      const created = items.filter((i) => !i.sold);
      setSold(soldItems);
      setNfts(created);
    } catch (err) {
      alert("some error occured :/ ");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  console.log("sold", sold);
  if (loading) {
    return (
      <div className="text-[#0cafa9] flex h-full justify-center items-center">
        <RefreshIcon className="w-20 h-20 animate-spin" />
      </div>
    );
  }
  if (!nfts.length && !sold.length)
    return (
      <h1 className="  text-[#0cafa9] px-20 py-10 text-3xl">
        No nfts created :/
      </h1>
    );
  return (
    <div>
      {nfts.length !== 0 && (
        <div className="p-4">
          <h2 className="text-2xl py-2  text-[#0cafa9]">Items Created</h2>
          <div className="grid grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div
                key={i}
                className="rounded-lg border-2 bg-[#0cafa9]  border-[#0cafa9] overflow-hidden relative flex flex-col"
              >
                <img src={nft.image} className="rounded-t-lg " />
                <div className="w-full text-center p-2 my-auto  backdrop-blur-sm  bottom-0 flex justify-between">
                  <p className="text-lg  ">{nft.name}</p>
                  <p className="text-lg  ">{nft.price} Matic</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4">
        {sold.length !== 0 && (
          <div>
            <h2 className="text-2xl py-2  text-[#0cafa9]">Items sold</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {sold.map((nft, i) => (
                <div
                  key={i}
                  className="rounded-lg border-2 bg-[#0cafa9]  border-[#0cafa9] overflow-hidden relative flex flex-col"
                >
                  <img src={nft.image} className="rounded-t-lg " />
                  <div className="w-full text-center p-2 my-auto  backdrop-blur-sm  bottom-0 flex justify-between">
                    <p className="text-lg  ">{nft.name}</p>
                    <p className="text-lg  ">{nft.price} Matic</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
