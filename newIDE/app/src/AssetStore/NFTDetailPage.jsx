
// NFTDetailPage.jsx

import React from 'react';

const NFTDetailPage = ({ nft, onClose }) => {
  const external_url = 'https://gateway.pinata.cloud/';
  return (
    <div>
      <h2>NFT Detail Page</h2>
      <p>NFT Name: {nft.name}</p>
      <p>NFT Description: {nft.description}</p>
      <p>NFT Image: <img src={external_url + nft.image} alt={nft.name} /></p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default NFTDetailPage;


// new code to fetch image 

// import React, { useContext, useEffect, useState } from 'react';
// import { NFTContext } from '../context/NFTContext';

// const NFTDetailPage = ({ tokenId }) => {
//   const { fetchMyNFTs } = useContext(NFTContext);
//   const [nft, setNFT] = useState(null);

//   useEffect(() => {
//     const fetchNFTDetail = async () => {
//       try {
//         const myNFTs = await fetchMyNFTs();
//         const foundNFT = myNFTs.find((item) => item.tokenId === tokenId);
//         setNFT(foundNFT);
//       } catch (error) {
//         console.error('Error fetching NFT details:', error);
//       }
//     };

//     fetchNFTDetail();
//   }, [tokenId, fetchMyNFTs]);

//   if (!nft) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <img src={nft.image} alt={nft.name} />
//       <h2>{nft.name}</h2>
//       <p>{nft.description}</p>
//       <p>Price: {nft.price} ETH</p>
//       {/* Add more details if needed */}
//     </div>
//   );
// };

// export default NFTDetailPage;
