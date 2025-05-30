import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;