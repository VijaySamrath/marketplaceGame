// Making onInstallNFT similiar to onInstallEmptyCustomObject and using nft imageurl for object

// new code not working for private assets

// const onInstallNFT = React.useCallback(
//   async nft => {
//     if (!nft) return false;

//     // const assets = [{
//     //   name: nft.name,
//     //   tokenId: nft.tokenId,
//     //   type:
//     // }];
//     const external_url = 'https://gateway.pinata.cloud/';
//     const imagURL = external_url + nft.image;

//     const nftShortHeader = {
//       animationsCount: 1,
//       dominantColors: [526344],
//       height: 16,
//       id: String(Number(nft.tokenId)),
//       license: 'CC0 (public domain)',
//       maxFramesCount: 1,
//       name: String(nft.name),
//       objectType: 'sprite',
//       previewImageUrls: [String(imagURL)],
//       shortDescription: '',
//       tags: [
//         '16x16 rpg item pack',
//         'side view',
//         'pixel art',
//         'rpg',
//         'weapon',
//         'sword',
//       ],
//       width: 16,
//     };

//     const assets = [
//       {
//         id: String(Number(nft.tokenId)),
//         name: String(nft.name),
//         authors: ["Owner's Assets"],
//         license: 'CC0 (public domain)',
//         shortDescription: '',
//         animationsCount: 1,
//         description: String(nft.description),
//         dominantColors: [526344],
//         gdevelopVersion: '5.0.0-beta100',
//         height: 16,
//         maxFramesCount: 1,
//         objectType: 'sprite',
//         previewImageUrls: [String(imagURL)],
//         tags: [
//           '16x16 rpg item pack',
//           'side view',
//           'pixel art',
//           'rpg',
//           'weapon',
//           'sword',
//         ],
//         version: '1.0.0',
//         width: 16,
//         objectAssets: [
//           {
//             // customizations: [], // This is giving error in below assets
//             object: {
//               adaptCollisionMaskAutomatically: true,
//               animations: [
//                 { name: '', useMultipleDirections: false, directions: [] },
//               ],
//               behaviors: [],
//               effects: [],
//               assetStoreId: '',
//               name: nft.name,
//               type: 'Sprite',
//               updateIfNotVisible: false,
//               variables: [],
//             },
//             requiredExtensions: [],
//             resources: [
//               {
//                 alwaysLoaded: false,
//                 file: String(imagURL),
//                 kind: 'image',
//                 metadata: '',
//                 name: String(nft.name + '.png'),
//                 origin: {
//                   identifier: String(imagURL),
//                   name: 'gdevelop-asset-store',
//                   smoothed: true,
//                   userAdded: false,
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     ];
//     console.log('nft hardcoded asset: ', assets[0]);
//     setIsAssetBeingInstalled(true);

//     try {
//       const isPrivate = isPrivateAsset(nftShortHeader);
//       if (isPrivate) {
//         const canUserInstallPrivateAsset = await canInstallPrivateAsset();
//         if (!canUserInstallPrivateAsset) {
//           await showAlert({
//             title: t`Save your project`,
//             message: t`You need to save this project as a cloud project to install this asset. Please save your project and try again.`,
//           });
//           setIsAssetBeingInstalled(false);
//           return false;
//         }
//       }
//       const asset = assets[0];

//       const requiredExtensionInstallation = await checkRequiredExtensionsUpdateForAssets(
//         {
//           assets,
//           project,
//         }
//       );
//       const shouldUpdateExtension =
//         requiredExtensionInstallation.outOfDateExtensionShortHeaders.length >
//           0 &&
//         (await showExtensionUpdateConfirmation(
//           requiredExtensionInstallation.outOfDateExtensionShortHeaders
//         ));
//       await installRequiredExtensions({
//         requiredExtensionInstallation,
//         shouldUpdateExtension,
//         eventsFunctionsExtensionsState,
//         project,
//       });

//       const installOutput = isPrivate
//         ? await installPrivateAsset({
//             asset,
//             project,
//             objectsContainer,
//           })
//         : await installPublicAsset({
//             asset,
//             project,
//             objectsContainer,
//           });
//       if (!installOutput) {
//         throw new Error('Unable to install private Asset.');
//       }

//       sendAssetAddedToProject({
//         id: asset.id,
//         name: asset.name,
//         assetPackName: asset.name,
//         assetPackTag: asset.tags[0],
//         assetPackId: asset.id,
//         assetPackKind: isPrivate ? 'private' : 'public',
//       });

//       onObjectsAddedFromAssets(installOutput.createdObjects);

//       await resourceManagementProps.onFetchNewlyAddedResources();
//       setIsAssetBeingInstalled(false);
//       return true;
//     } catch (error) {
//       console.error('Error while installing the NFT:', error);
//       showAlert({
//         title: t`Could not install the asset`,
//         message: t`There was an error while installing the asset "${
//           nftShortHeader.name
//         }". Verify your internet connection or try again later.`,
//       });
//       setIsAssetBeingInstalled(false);
//       return false;
//     }
//   },
//   [
//     project,
//     showExtensionUpdateConfirmation,
//     eventsFunctionsExtensionsState,
//     installPrivateAsset,
//     objectsContainer,
//     onObjectsAddedFromAssets,
//     resourceManagementProps,
//     canInstallPrivateAsset,
//     showAlert,
//   ]
// );

// Old code working but image not showing
// const onInstallNFT = React.useCallback(
//   async nft => {
//     if (!nft) return false;

//     // const assets = [{
//     //   name: nft.name,
//     //   tokenId: nft.tokenId,
//     //   type:
//     // }];
//     const external_url = 'https://gateway.pinata.cloud/';
//     const imagURL = external_url + nft.image;

//     const assets = [
//       {
//         id: String(Number(nft.tokenId)),
//         name: String(nft.name),
//         authors: ["Owner's Assets"],
//         license: 'CC0 (public domain)',
//         shortDescription: '',
//         animationsCount: 1,
//         description: String(nft.description),
//         dominantColors: [526344],
//         gdevelopVersion: '5.0.0-beta100',
//         height: 16,
//         maxFramesCount: 1,
//         objectType: 'sprite',
//         previewImageUrls: [String(imagURL)],
//         tags: [
//           '16x16 rpg item pack',
//           'side view',
//           'pixel art',
//           'rpg',
//           'weapon',
//           'sword',
//         ],
//         version: '1.0.0',
//         width: 16,
//         objectAssets: [
//           {
//             // customizations: [], // This is giving error in below assets
//             object: {
//               adaptCollisionMaskAutomatically: true,
//               animations: [
//                 { name: '', useMultipleDirections: false, directions: [] },
//               ],
//               behaviors: [],
//               effects: [],
//               assetStoreId: '',
//               name: nft.name,
//               type: 'Sprite',
//               updateIfNotVisible: false,
//               variables: [],
//             },
//             requiredExtensions: [],
//             resources: [
//               {
//                 alwaysLoaded: false,
//                 file: String(imagURL),
//                 kind: 'image',
//                 metadata: '',
//                 name: String(nft.name + '.png'),
//                 origin: {
//                   identifier: String(imagURL),
//                   name: 'gdevelop-asset-store',
//                   smoothed: true,
//                   userAdded: false,
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     ];

//     setIsAssetBeingInstalled(true);

//     try {
//       const asset = assets[0];

//       const requiredExtensionInstallation = await checkRequiredExtensionsUpdateForAssets(
//         {
//           assets,
//           project,
//         }
//       );
//       const shouldUpdateExtension =
//         requiredExtensionInstallation.outOfDateExtensionShortHeaders.length >
//           0 &&
//         (await showExtensionUpdateConfirmation(
//           requiredExtensionInstallation.outOfDateExtensionShortHeaders
//         ));
//       await installRequiredExtensions({
//         requiredExtensionInstallation,
//         shouldUpdateExtension,
//         eventsFunctionsExtensionsState,
//         project,
//       });

//       const installOutput = await installPublicAsset({
//         asset,
//         project,
//         objectsContainer,
//       });
//       if (!installOutput) {
//         throw new Error('Unable to install private Asset.');
//       }

//       sendAssetAddedToProject({
//         id: asset.id,
//         name: asset.name,
//         assetPackName: asset.name,
//         assetPackTag: asset.tags[0],
//         assetPackId: null,
//         assetPackKind: 'public',
//       });

//       onObjectsAddedFromAssets(installOutput.createdObjects);

//       await resourceManagementProps.onFetchNewlyAddedResources();
//       setIsAssetBeingInstalled(false);
//       return true;
//     } catch (error) {
//       console.error('Error while installing the NFT:', error);
//       setIsAssetBeingInstalled(false);
//       return false;
//     }
//   },
//   [
//     setIsAssetBeingInstalled,
//     project,
//     showExtensionUpdateConfirmation,
//     eventsFunctionsExtensionsState,
//     objectsContainer,
//     resourceManagementProps,
//     onObjectsAddedFromAssets,
//   ]
// );
