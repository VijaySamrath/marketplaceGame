import React, { useRef } from 'react';

import images from '../../../../assets';

const Modal = ({ header, body, footer, handleClose }) => {
  const modalRef = useRef(null);

  const handleClickOutside = e => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        style={{
          width: '50%',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '10px',
          }}
        >
          <div
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            onClick={handleClose}
          >
            <img
              src={images.cross}
              alt="Close"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2
            style={{
              fontFamily: 'Poppins',
              fontSize: '1.5rem',
              color: '#000000',
            }}
          >
            {header}
          </h2>
        </div>
        <div
          style={{
            borderTop: '1px solid #ddd',
            borderBottom: '1px solid #ddd',
            padding: '20px 0',
          }}
        >
          {body}
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>{footer}</div>
      </div>
    </div>
  );
};

export default Modal;
