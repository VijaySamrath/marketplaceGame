import React, { useState, useCallback, useMemo, useContext } from 'react';
// import { useHistory } from 'react-router-dom'; // Assuming you're using React Router
import { useDropzone } from 'react-dropzone';

import { NFTContext } from '../context/NFTContext';
import images from '../assets';

const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const { nftCurrency, isLoadingNFT, uploadToPinata, createNFT } = useContext(
    NFTContext
  );
  // const history = useHistory();

  const onDrop = useCallback(
    async acceptedFile => {
      const url = await uploadToPinata(acceptedFile[0]);
      setFileUrl(url);
    },
    [uploadToPinata]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(
    () =>
      `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive ? ' border-file-active' : ''}
    ${isDragAccept ? ' border-file-accept' : ''}
    ${isDragReject ? ' border-file-reject' : ''}`,
    [isDragActive, isDragReject, isDragAccept]
  );

  const handleInputChange = (key, value) => {
    setFormInput(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleCreateNFT = () => {
    createNFT(formInput, fileUrl, () => console.log('NFT Created maybe')); // Assuming it redirects to homepage after successful NFT creation
  };

  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <div className="flexCenter w-full my-4">
          <img src={images.loader} alt="loader" width={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">
          Create new item
        </h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload File
          </p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.
                </p>

                <div className="my-12 w-full flex justify-center">
                  <img
                    src={images.upload}
                    alt="file upload"
                    width={100}
                    height={100}
                  />
                </div>

                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  Or browse media on your device
                </p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt="Asset_file" />
                </div>
              </aside>
            )}
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Name
          </p>
          <input
            className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
            placeholder="NFT Name"
            onChange={e => handleInputChange('name', e.target.value)}
          />
        </div>
        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Description
          </p>
          <textarea
            rows={10}
            className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
            placeholder="NFT Description"
            onChange={e => handleInputChange('description', e.target.value)}
          />
        </div>
        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Price
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
            <input
              type="number"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder="NFT Price"
              onChange={e => handleInputChange('price', e.target.value)}
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
              {nftCurrency}
            </p>
          </div>
        </div>

        <div className="mt-7 w-full flex justify-end">
          <button
            type="button"
            className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-white rounded-xl"
            onClick={handleCreateNFT}
          >
            Create NFT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;

// import React, { useState } from 'react';

// const CreateNFTPage = () => {
//   const [file, setFile] = useState(null);
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');

//   const handleSubmit = e => {
//     e.preventDefault();
//     // Here you can implement the logic to handle form submission
//     console.log('Form submitted:', { file, name, description, price });
//   };

//   return (
//     <div className="container">
//       <h1>Create a new NFT</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="image">Image</label>
//           <input
//             type="file"
//             id="image"
//             accept="image/*"
//             onChange={e => setFile(e.target.files[0])}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={e => setName(e.target.value)}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="description">Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={e => setDescription(e.target.value)}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="price">Price</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={e => setPrice(e.target.value)}
//           />
//         </div>
//         <button type="submit">Create NFT</button>
//       </form>
//     </div>
//   );
// };

// export default CreateNFTPage;
