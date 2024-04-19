import { useContext } from 'react';
import { NFTContext } from '../../../../context/NFTContext';
import FlatButton from '../../../../UI/FlatButton';
import { Trans } from '@lingui/macro';
import Loader from './Loader';
import './NFTCard.css';

const shortenAddress = address =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

// const shortenAddress = address => {
//   // Check if address is a string
//   if (typeof address !== 'string') {
//     // If address is not a string, return an empty string
//     return '';
//   }
//   // If address is a string, proceed with shortening it
//   return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
// };

const NFTCard = ({ nft, onProfilePage }) => {
  const { nftCurrency, buyNFT, isLoadingNFT } = useContext(NFTContext);
  const external_urls = 'https://gateway.pinata.cloud/';

  const handleBuy = async () => {
    await buyNFT(nft);
  };

  return (
    <div className="nft-card">
      <div className="image-container">
        <img
          src={external_urls + nft.image}
          className="image"
          alt={`nft${nft.i}`}
        />
      </div>
      <div className="details">
        <p className="name">{nft.name}</p>
        <div className="price-address">
          <p className="price">
            {nft.price} <span className="currency">{nftCurrency}</span>
          </p>
          <p className="address">
            {shortenAddress(onProfilePage ? nft.owner : nft.seller)}
          </p>
        </div>
      </div>
      <div className="price">
        {/* Create a button to buy the NFT */}
        <FlatButton label={<Trans>Buy</Trans>} onClick={handleBuy} />
      </div>

      {isLoadingNFT && (
        <div className="flexCenter flex-col text-center">
          <div className="relative w-52 h-52">
            <Loader />
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
