import React from 'react';

import images from '../../../../assets';

const Loader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: '1rem',
    }}
  >
    <img
      src={images.loader}
      alt="Loader"
      style={{ width: '100px', objectFit: 'contain' }}
    />
  </div>
);

export default Loader;
