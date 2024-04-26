// @flow
import * as React from 'react';
import { type FiltersState, useFilters } from '../../UI/Search/FiltersChooser';
import { type Filters } from '../../Utils/GDevelopServices/Filters';
import {
  useSearchStructuredItem,
  type SearchMatch,
} from '../../UI/Search/UseSearchStructuredItem';
import { useSearchItem } from '../../UI/Search/UseSearchItem';
import {
  listListedPrivateGameTemplates,
  type PrivateGameTemplateListingData,
} from '../../Utils/GDevelopServices/Shop';
import { capitalize } from 'lodash';
import { type NavigationState } from '../AssetStoreNavigator';
import { getPrivateGameTemplateListingDataFromUserFriendlySlug } from '../AssetStoreUtils';
import useAlertDialog from '../../UI/Alert/useAlertDialog';
import { t } from '@lingui/macro';
import { sendGameTemplateInformationOpened } from '../../Utils/Analytics/EventSender';
import { PRIVATE_GAME_TEMPLATES_FETCH_TIMEOUT } from '../../Utils/GlobalFetchTimeouts';
import { NFTContext } from '../../context/NFTContext';

const defaultSearchText = '';
const excludedTiers = new Set(); // No tiers for game templates.
const firstGameTemplateIds = [];

const getPrivateGameTemplateListingDataSearchTerms = (
  privateGameTemplate: PrivateGameTemplateListingData
) =>
  privateGameTemplate.name +
  '\n' +
  privateGameTemplate.description +
  '\n' +
  privateGameTemplate.categories.join('\n');

type PrivateGameTemplateStoreState = {|
  gameTemplateFilters: ?Filters,
  fetchGameTemplates: () => void,
  privateGameTemplateListingDatas: ?Array<PrivateGameTemplateListingData>,
  error: ?Error,
  shop: {
    privateGameTemplateListingDatasSearchResults: ?Array<PrivateGameTemplateListingData>,
    searchText: string,
    setSearchText: string => void,
    filtersState: FiltersState,
    setInitialGameTemplateUserFriendlySlug: string => void,
  },
  exampleStore: {
    privateGameTemplateListingDatasSearchResults: ?Array<{|
      item: PrivateGameTemplateListingData,
      matches: SearchMatch[],
    |}>,
    searchText: string,
    setSearchText: string => void,
    filtersState: FiltersState,
  },
|};

export const initialPrivateGameTemplateStoreState: PrivateGameTemplateStoreState = {
  gameTemplateFilters: null,
  fetchGameTemplates: () => {},
  privateGameTemplateListingDatas: null,
  error: null,
  shop: {
    privateGameTemplateListingDatasSearchResults: null,
    searchText: '',
    setSearchText: () => {},
    filtersState: {
      chosenFilters: new Set(),
      addFilter: () => {},
      removeFilter: () => {},
      chosenCategory: null,
      setChosenCategory: () => {},
    },
    setInitialGameTemplateUserFriendlySlug: (
      initialGameTemplateUserFriendlySlug: string
    ) => {},
  },
  exampleStore: {
    privateGameTemplateListingDatasSearchResults: null,
    searchText: '',
    setSearchText: () => {},
    filtersState: {
      chosenFilters: new Set(),
      addFilter: () => {},
      removeFilter: () => {},
      chosenCategory: null,
      setChosenCategory: () => {},
    },
  },
};

export const PrivateGameTemplateStoreContext = React.createContext<PrivateGameTemplateStoreState>(
  initialPrivateGameTemplateStoreState
);

type PrivateGameTemplateStoreStateProviderProps = {|
  shopNavigationState: NavigationState,
  children: React.Node,
|};

export const PrivateGameTemplateStoreStateProvider = ({
  shopNavigationState,
  children,
}: PrivateGameTemplateStoreStateProviderProps) => {
  const [
    gameTemplateFilters,
    setGameTemplateFilters,
  ] = React.useState<?Filters>(null);
  const [error, setError] = React.useState<?Error>(null);
  const [
    privateGameTemplateListingDatas,
    setPrivateGameTemplateListingDatas,
  ] = React.useState<?Array<PrivateGameTemplateListingData>>(null);
  const [
    initialGameTemplateUserFriendlySlug,
    setInitialGameTemplateUserFriendlySlug,
  ] = React.useState<?string>(null);
  const initialGameTemplateOpened = React.useRef<boolean>(false);

  const isLoading = React.useRef<boolean>(false);
  const { showAlert } = useAlertDialog();

  const [shopSearchText, setShopSearchText] = React.useState(defaultSearchText);
  const [exampleStoreSearchText, setExampleStoreSearchText] = React.useState(
    defaultSearchText
  );
  const filtersStateForExampleStore = useFilters();

  // Gola-k Start
  const { fetchNFTs } = React.useContext(NFTContext);
  const [nfts, setNfts] = React.useState([]);
  const [nftsCopy, setNftsCopy] = React.useState([]);
  // Gola-k End

  React.useEffect(() => {
    fetchNFTs().then(items => {
      console.log('items: ', items);
      setNfts(items);
      setNftsCopy(items);
    });
  }, []);

  const fetchGameTemplates = React.useCallback(
    () => {
      // If the game templates are already loaded, don't load them again.
      if (isLoading.current || privateGameTemplateListingDatas) return;

      (async () => {
        setError(null);
        isLoading.current = true;

        try {
          const fetchedPrivateGameTemplateListingDatas = await listListedPrivateGameTemplates();
          const external_urls = 'https://gateway.pinata.cloud/';
          console.info(
            `Loaded ${
              fetchedPrivateGameTemplateListingDatas
                ? fetchedPrivateGameTemplateListingDatas.length
                : 0
            } game templates from the store.`
          );

          // console.log(
          //   `fetchedPrivateGameTemplateListingDatas:`,
          //   fetchedPrivateGameTemplateListingDatas
          // );
          console.log('nft in privateGameTemplateStoreContext.js: ', nfts);
          // Create an array to store all corresponding templates
          const correspondingGameTemplates = [];

          // Iterate over each NFT object
          nfts.forEach((nftItem, index) => {
            // Check if there's a corresponding template in fetchedPrivateGameTemplateListingDatas
            if (index < fetchedPrivateGameTemplateListingDatas.length) {
              const correspondingGameTemplate = {
                ...fetchedPrivateGameTemplateListingDatas[index],
              };
              // Update the corresponding template with the data from the NFT
              // correspondingGameTemplate.id = nftItem.tokenId;
              correspondingGameTemplate.thumbnailUrls = [
                external_urls + nftItem.image,
              ];
              correspondingGameTemplate.name = nftItem.name;
              correspondingGameTemplate.description = nftItem.description;
              correspondingGameTemplate.prices.value = nftItem.price; // cannot change the value of value
              console.log(`change:${index}: $`, correspondingGameTemplate);
              // Update other properties as needed
              correspondingGameTemplates.push(correspondingGameTemplate);
            }
          });

          // Add remaining templates from fetchedPrivateGameTemplateListingDatas to correspondingGameTemplates
          for (
            let i = nfts.length;
            i < fetchedPrivateGameTemplateListingDatas.length;
            i++
          ) {
            correspondingGameTemplates.push({
              ...fetchedPrivateGameTemplateListingDatas[i],
            });
          }

          // // Iterate over each NFT object
          // nfts.forEach((nftItem, index) => {
          //   // If there are corresponding templates left in fetchedPrivateGameTemplateListingDatas
          //   if (index < fetchedPrivateGameTemplateListingDatas.length) {
          //     const correspondingGameTemplate =
          //       fetchedPrivateGameTemplateListingDatas[index];
          //     // Update the values in fetchedPrivateGameTemplateListingDatas using the values from the NFT
          //     correspondingGameTemplate.id = nftItem.tokenId;
          //     correspondingGameTemplate.thumbnailUrls = nftItem.tokenURI;
          //     correspondingGameTemplate.name = nftItem.name;
          //     correspondingGameTemplate.description = nftItem.description;
          //     correspondingGameTemplate.prices.value = nftItem.price;
          //     // Update other properties as needed
          //   } else {
          //     // If there are no more corresponding templates in fetchedPrivateGameTemplateListingDatas,
          //     // create a new one based on the last template
          //     const lastTemplate =
          //       fetchedPrivateGameTemplateListingDatas[
          //         fetchedPrivateGameTemplateListingDatas.length - 1
          //       ];
          //     const newTemplate = { ...lastTemplate }; // Copy the last template
          //     newTemplate.id = nftItem.tokenId;
          //     newTemplate.thumbnailUrls = nftItem.tokenURI;
          //     newTemplate.name = nftItem.name;
          //     newTemplate.description = nftItem.description;
          //     newTemplate.prices.value = nftItem.price;
          //     // Add the new template to fetchedPrivateGameTemplateListingDatas
          //     fetchedPrivateGameTemplateListingDatas.push(newTemplate);
          //   }
          // });

          // // Remove the remaining templates in fetchedPrivateGameTemplateListingDatas if NFT array has fewer items
          // if (nfts.length < fetchedPrivateGameTemplateListingDatas.length) {
          //   fetchedPrivateGameTemplateListingDatas.splice(nfts.length);
          // }

          // console.log('changed: ', correspondingGameTemplates);

          // Iterate over each NFT object
          // let correspondingGameTemplate;
          // nfts.forEach(nftItem => {
          //   // Find the corresponding game template in fetchedPrivateGameTemplateListingDatas
          //   correspondingGameTemplate = fetchedPrivateGameTemplateListingDatas.find(
          //     template => template.id == '0e17c0d3-1004-428b-9ccd-746693e0d3c3' // template.appStoreProductId === nftItem.tokenId.toString()
          //   );

          //   // If a corresponding game template is found
          //   if (correspondingGameTemplate) {
          //     // Update the values in fetchedPrivateGameTemplateListingDatas using the values from the NFT
          //     correspondingGameTemplate.thumbnailUrls =
          //       external_urls + nftItem.image;
          //     // You can update other properties similarly
          //     correspondingGameTemplate.name = nftItem.name;
          //     correspondingGameTemplate.description = nftItem.description;
          //     correspondingGameTemplate.prices = nftItem.unformattedPrice;
          //     // Update other properties as needed
          //   }
          // });

          // change the data of fetchedPrivateGameTemplateListingDatas with data of nfts in Gola-k Start which are the values of token ID, name, description, thumbnailUrls and prices both of credit and stripe with the values of nfts prices in ethers and image url of ipfs pinata.
          // Assuming fetchedPrivateGameTemplateListingDatas is an array of objects
          // console.log('nfts in shop.js: ', nfts);
          // const external_urls = 'https://gateway.pinata.cloud/';
          // fetchedPrivateGameTemplateListingDatas.map(template => {
          //   return {
          //     appStoreProductId: nft.tokenId,
          //     thumbnailUrls: external_urls + nft.image,
          //     name: nft.name,
          //     description: nft.description,
          //     price: nft.price,
          //   };
          // });
          // const updatedPrivateGameTemplateListingDatas = fetchedPrivateGameTemplateListingDatas.map(template => {
          //   // Update the fields with NFT data
          //   return {
          //       tokenID: /* NFT token ID */,
          //       name: /* NFT name */,
          //       description: /* NFT description */,
          //       thumbnailUrls: /* NFT thumbnail URLs */,
          //       prices: {
          //           credit: /* NFT price in credits */,
          //           stripe: /* NFT price in stripe */,
          //       },
          //       // Add more fields as needed
          //   };
          // });

          setPrivateGameTemplateListingDatas(correspondingGameTemplates);
          // console.log('after change: ', correspondingGameTemplates);
          const defaultTags = correspondingGameTemplates.reduce(
            (allCategories, privateGameTemplateListingData) => {
              return allCategories.concat(
                privateGameTemplateListingData.categories.map(category =>
                  capitalize(category)
                )
              );
            },
            []
          );
          const uniqueDefaultTags = Array.from(new Set(defaultTags));
          const gameTemplateFilters: Filters = {
            allTags: [],
            defaultTags: uniqueDefaultTags,
            tagsTree: [],
          };
          setGameTemplateFilters(gameTemplateFilters);
        } catch (error) {
          console.error(
            `Unable to load the game templates from the store:`,
            error
          );
          setError(error);
        }

        isLoading.current = false;
      })();
    },
    [nfts, privateGameTemplateListingDatas]
  );

  // When the game templates are loaded,
  // open the game template with the slug that was asked to be initially loaded.
  React.useEffect(
    () => {
      if (
        !initialGameTemplateUserFriendlySlug ||
        initialGameTemplateOpened.current
      ) {
        // If there is no initial game template or
        // if the game template was already opened, don't re-open it again even
        // if the effect run again.
        return;
      }

      if (
        privateGameTemplateListingDatas &&
        initialGameTemplateUserFriendlySlug
      ) {
        initialGameTemplateOpened.current = true;

        // Open the information page of a the game template.
        const privateGameTemplateListingData = getPrivateGameTemplateListingDataFromUserFriendlySlug(
          {
            privateGameTemplateListingDatas,
            userFriendlySlug: initialGameTemplateUserFriendlySlug,
          }
        );

        if (privateGameTemplateListingData) {
          sendGameTemplateInformationOpened({
            gameTemplateName: privateGameTemplateListingData.name,
            gameTemplateId: privateGameTemplateListingData.id,
            source: 'web-link',
          });
          shopNavigationState.openPrivateGameTemplateInformationPage({
            privateGameTemplateListingData,
            previousSearchText: shopSearchText,
          });
          initialGameTemplateOpened.current = false; // Allow to open the game template again if the effect run again.
          setInitialGameTemplateUserFriendlySlug(null);
          return;
        }

        showAlert({
          title: t`Game template not found`,
          message: t`The link to the game template you've followed seems outdated. Why not take a look at the other templates in the store?`,
        });
      }
    },
    [
      privateGameTemplateListingDatas,
      shopNavigationState,
      showAlert,
      initialGameTemplateUserFriendlySlug,
      shopSearchText,
    ]
  );

  React.useEffect(
    () => {
      if (isLoading.current) return;

      const timeoutId = setTimeout(() => {
        console.info('Pre-fetching game templates from the store...');
        fetchGameTemplates();
      }, PRIVATE_GAME_TEMPLATES_FETCH_TIMEOUT);
      return () => clearTimeout(timeoutId);
    },
    [fetchGameTemplates]
  );

  const privateGameTemplateListingDatasById = React.useMemo(
    () => {
      if (!privateGameTemplateListingDatas) {
        return null;
      }
      const privateGameTemplateListingDatasById = {};
      privateGameTemplateListingDatas.forEach(
        privateGameTemplateListingData => {
          const id = privateGameTemplateListingData.id;
          if (privateGameTemplateListingDatasById[id]) {
            console.warn(
              `Multiple private game templates with the same id: ${id}`
            );
          }
          privateGameTemplateListingDatasById[
            id
          ] = privateGameTemplateListingData;
        }
      );
      return privateGameTemplateListingDatasById;
    },
    [privateGameTemplateListingDatas]
  );

  const currentPage = shopNavigationState.getCurrentPage();

  const privateGameTemplateListingDatasSearchResultsForExampleStore: ?Array<{|
    item: PrivateGameTemplateListingData,
    matches: SearchMatch[],
  |}> = useSearchStructuredItem(privateGameTemplateListingDatasById, {
    searchText: exampleStoreSearchText,
    chosenCategory: filtersStateForExampleStore.chosenCategory,
    chosenFilters: filtersStateForExampleStore.chosenFilters,
    excludedTiers,
    defaultFirstSearchItemIds: firstGameTemplateIds,
    shuffleResults: false,
  });

  const privateGameTemplateListingDatasSearchResultsForShop: ?Array<PrivateGameTemplateListingData> = useSearchItem(
    privateGameTemplateListingDatasById,
    getPrivateGameTemplateListingDataSearchTerms,
    shopSearchText,
    currentPage.filtersState.chosenCategory,
    currentPage.filtersState.chosenFilters
  );

  const PrivateGameTemplateStoreState = React.useMemo(
    () => ({
      privateGameTemplateListingDatas,
      error,
      gameTemplateFilters,
      fetchGameTemplates,
      shop: {
        privateGameTemplateListingDatasSearchResults: privateGameTemplateListingDatasSearchResultsForShop,
        searchText: shopSearchText,
        setSearchText: setShopSearchText,
        filtersState: currentPage.filtersState,
        setInitialGameTemplateUserFriendlySlug,
        setNfts,
      },
      exampleStore: {
        privateGameTemplateListingDatasSearchResults: privateGameTemplateListingDatasSearchResultsForExampleStore,
        searchText: exampleStoreSearchText,
        setSearchText: setExampleStoreSearchText,
        filtersState: filtersStateForExampleStore,
      },
    }),
    [
      privateGameTemplateListingDatas,
      error,
      gameTemplateFilters,
      fetchGameTemplates,
      privateGameTemplateListingDatasSearchResultsForExampleStore,
      privateGameTemplateListingDatasSearchResultsForShop,
      shopSearchText,
      exampleStoreSearchText,
      currentPage.filtersState,
      filtersStateForExampleStore,
    ]
  );

  return (
    <PrivateGameTemplateStoreContext.Provider
      value={PrivateGameTemplateStoreState}
    >
      {children}
    </PrivateGameTemplateStoreContext.Provider>
  );
};
