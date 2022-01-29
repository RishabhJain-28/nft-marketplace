import "../styles/globals.css";
import Link from "next/link";
import {
  PencilAltIcon,
  HomeIcon,
  CollectionIcon,
  ShoppingCartIcon,
} from "@heroicons/react/solid";

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-nowrap w-full h-[100vh] relative bg-black">
      <nav className=" bg-gradient-to-r from-gray-700 via-gray-900 to-black  text-white w-[300px]">
        <p className="text-2xl font-bold m-5">Metaverse NFTs Galaxy</p>
        <div className="flex flex-col mt-4">
          <LinkComp
            label={"Home"}
            url={"/"}
            Icon={<HomeIcon className="w-4 h-4 m-2" />}
          />
          <LinkComp
            Icon={<ShoppingCartIcon className="w-4 h-4 m-2" />}
            label={"Sell Digital Asset"}
            url={"/createItem"}
          />
          <LinkComp
            Icon={<CollectionIcon className="w-4 h-4 m-2" />}
            label={"My Digital Collection"}
            url={"/userCollection"}
          />
          <LinkComp
            Icon={<PencilAltIcon className="w-4 h-4 m-2" />}
            label={"Created by me "}
            url={"/userCreated"}
          />
        </div>
      </nav>
      <div className="p-10 w-full">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

const LinkComp = ({ label, url, Icon }) => {
  return (
    <Link href={url}>
      <div className="flex items-center m-5 cursor-pointer">
        {Icon}
        <a className="">{label}</a>
      </div>
    </Link>
  );
};

export default MyApp;
