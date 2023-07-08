import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { ModalOverlay, ModalPic } from 'components/Modal/Modal.styled';

const Modal = ({ image, onClose }) => {
  const handleKeyDown = useCallback(
    event => {
      if (event.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const handleOverlayClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const onKeyDown = handleKeyDown;
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalPic src={image} alt="" />
    </ModalOverlay>
  );
};

Modal.propTypes = {
  image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
