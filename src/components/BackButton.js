// src/components/BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
      ← Back
    </button>
  );
};

export default BackButton;
