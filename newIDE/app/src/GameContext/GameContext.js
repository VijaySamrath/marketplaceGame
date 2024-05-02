import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { Buffer } from 'buffer';
import { GameMarketAddress, GameMarketAddressABI } from './constants';
export const GameContext = React.createContext();

const ethers = require('ethers');

const fetchContract = signerorProvider =>
  new ethers.Contract(
    GameMarketAddress,
    GameMarketAddressABI,
    signerorProvider
  );

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.API_KEY_SECRET;
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  'base64'
)}`;

export const GameProvider = ({ children }) => {
  console.log('auth: ', auth);
  const client = useRef({});
  console.log('client: ', client);
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  //   const [file, setFile] = useState(null);
  //   const [image, setImage] = useState(null);
  //   const [name, setName] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [imageURL, setImageURL] = useState('');
  //   const [description, setDescription] = useState('');
  const nftCurrency = 'ETH';

  const handleFileUpload = async file => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const subdomain = 'https://gateway.pinata.cloud';

    const JWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjMzJkMGViNy05MmEwLTQ3OTctODgxNi0wMTMzZTI3M2I3MjYiLCJlbWFpbCI6InZpc2hhbGR1YmV5ODEzMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMmViMzY5ZjE2YmIwY2RhN2UyZjQiLCJzY29wZWRLZXlTZWNyZXQiOiJmNGUzNTYzODllNmM4NGRjYjY1OGNkZGJkNmNiOTAwNzRiMGVmNDE1NGU1YThjNTEwMzQ2NTM4ZTJkODU4YTcyIiwiaWF0IjoxNzE0MDM3MDQ4fQ.zhaM6JNFaVIWN2smCdRzPHviMEO8IFMklO9Vl2S8G5s';

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      const url = `${subdomain}/ipfs/${response.data.IpfsHash}`;
      console.log('File URL:', url);
      setFileURL(url);
    } catch (error) {
      console.error('Error uploading file:', error.response.data);
    }
  };

  const handleImageUpload = async image => {
    const formData = new FormData();
    formData.append('file', image, image.name);
    const subdomain = 'https://gateway.pinata.cloud';

    const JWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjMzJkMGViNy05MmEwLTQ3OTctODgxNi0wMTMzZTI3M2I3MjYiLCJlbWFpbCI6InZpc2hhbGR1YmV5ODEzMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMmViMzY5ZjE2YmIwY2RhN2UyZjQiLCJzY29wZWRLZXlTZWNyZXQiOiJmNGUzNTYzODllNmM4NGRjYjY1OGNkZGJkNmNiOTAwNzRiMGVmNDE1NGU1YThjNTEwMzQ2NTM4ZTJkODU4YTcyIiwiaWF0IjoxNzE0MDM3MDQ4fQ.zhaM6JNFaVIWN2smCdRzPHviMEO8IFMklO9Vl2S8G5s';

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      const url = `${subdomain}/ipfs/${response.data.IpfsHash}`;
      console.log('Image URL:', url);
      setImageURL(url);
    } catch (error) {
      console.error('Error uploading image:', error.response.data);
    }
  };

  const handleSubmit = async (name, description) => {
    // Handle form submission to Pinata IPFS
    // Combine finalImageURL, finalFileURL, name, and description into JSON object
    const formData = {
      name: name,
      fileURL: fileURL,
      imageURL: imageURL,
      description: description,
    };
    // e.preventDefault();
    const subdomain = 'https://gateway.pinata.cloud';

    const JWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjMzJkMGViNy05MmEwLTQ3OTctODgxNi0wMTMzZTI3M2I3MjYiLCJlbWFpbCI6InZpc2hhbGR1YmV5ODEzMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMmViMzY5ZjE2YmIwY2RhN2UyZjQiLCJzY29wZWRLZXlTZWNyZXQiOiJmNGUzNTYzODllNmM4NGRjYjY1OGNkZGJkNmNiOTAwNzRiMGVmNDE1NGU1YThjNTEwMzQ2NTM4ZTJkODU4YTcyIiwiaWF0IjoxNzE0MDM3MDQ4fQ.zhaM6JNFaVIWN2smCdRzPHviMEO8IFMklO9Vl2S8G5s';

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        formData,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      const finalURL = `${subdomain}/ipfs/${response.data.IpfsHash}`;
      console.log('Final URL:', finalURL);
      return finalURL;
    } catch (error) {
      console.error('Error submitting form data:', error.response.data);
    }
  };

  const createGameNft = async (accessId, finalURL, formInputPrice) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    console.log('connection: ', connection);
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();

    const price = ethers.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);

    const transaction = await contract.publishNFT(accessId, price, finalURL);

    setIsLoadingNFT(true);
    await transaction.wait();
  };

  return (
    <GameContext.Provider
      value={{
        isLoadingNFT,
        handleImageUpload,
        handleFileUpload,
        handleSubmit,
        createGameNft,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
