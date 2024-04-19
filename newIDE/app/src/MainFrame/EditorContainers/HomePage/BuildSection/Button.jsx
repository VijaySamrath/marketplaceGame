import React from 'react';
import FlatButton from '../../../../UI/FlatButton';

const Button = ({ btnName, classStyles, handleClick }) => (
  <FlatButton
    type="button"
    style={
      {
        // backgroundImage: 'linear-gradient(135deg, #6933FF 0%, #AF29FF 100%)',
        // fontSize: '1rem',
        // padding: '0.5rem 1rem',
        // fontFamily: 'Poppins',
        // fontWeight: '600',
        // color: '#FFFFFF',
        // borderRadius: '0.375rem',
        // border: 'none',
        // cursor: 'pointer',
        // ...classStyles, // allow for custom styles to be passed
      }
    }
    onClick={handleClick}
  >
    {btnName}
  </FlatButton>
);

export default Button;
