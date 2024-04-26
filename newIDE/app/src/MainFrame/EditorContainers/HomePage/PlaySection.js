// @flow
import * as React from 'react';
import { Trans } from '@lingui/macro';
import SectionContainer, { SectionRow } from './SectionContainer';
import GDevelopThemeContext from '../../../UI/Theme/GDevelopThemeContext';
import PlaceHolderLoader from '../../../UI/PlaceholderLoader';
import ErrorBoundary from '../../../UI/ErrorBoundary';
import { useResponsiveWindowSize } from '../../../UI/Responsive/ResponsiveWindowMeasurer';
import RaisedButton from '../../../UI/RaisedButton';
import Add from '../../../UI/CustomSvgIcons/Add';
import GameNft from '../../../pages/game-nft';

const styles = {
  iframe: {
    border: 0,
  },
};

const PlaySection = () => {
  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  const paletteType = gdevelopTheme.palette.type;
  const [iframeHeight, setIframeHeight] = React.useState(null);
  const [showGameForm, setShowGameForm] = React.useState(false); // Add state for showing CreateNFT
  const { windowSize, isMobile, isLandscape } = useResponsiveWindowSize();
  
  window.addEventListener('message', event => {
    if (
      event.origin === 'https://gd.games' &&
      event.data.id === 'set-embedded-height'
    ) {
      setIframeHeight(event.data.height);
    }
  });

  return (
    <SectionContainer
      title={<Trans>Play!</Trans>}
      flexBody
      subtitleText={<Trans>Explore games made by others</Trans>}
    >
               {/* Render RaisedButton conditionally */}
               <RaisedButton
        primary
        fullWidth= {false}
        label={
          isMobile ? (
            <Trans>Publish</Trans>
          ) : (
            <Trans>Publish a Game</Trans>
          )
        }
        onClick={() => {
          showGameForm ? setShowGameForm(false) : setShowGameForm(true);
        }}
        icon={<Add fontSize="small" />}
        id="play-publish-game-button"
      />
      {/* Render CreateNFT conditionally */}
      {showGameForm && <GameNft/>}
      {/* <SectionRow expand>
        <iframe
          src={`https://gd.games/embedded/${paletteType}`}
          title="gdgames"
          style={{ ...styles.iframe, height: iframeHeight }}
          scrolling="no" // This is deprecated, but this is the only way to disable the scrollbar.
        />
        {!iframeHeight && <PlaceHolderLoader />}
      </SectionRow> */}
    </SectionContainer>
  );
};

const PlaySectionWithErrorBoundary = () => (
  <ErrorBoundary
    componentTitle={<Trans>Play section</Trans>}
    scope="start-page-play"
  >
    <PlaySection />
  </ErrorBoundary>
);

export default PlaySectionWithErrorBoundary;
