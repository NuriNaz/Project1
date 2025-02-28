import React from 'react';
import './style.css';

const FirstnameIcon = ({ firstName }) => {
  // Generate a random color
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  // Define a style object with the random color
  const iconStyle = {
    backgroundColor: randomColor,
    color: 'white', // Set text color to white for better visibility
  };

  return (
    <div>
      <div className="firstname-icon" style={iconStyle}>
        {firstName.charAt(0)}
      </div>
    </div>
  );
};

export default FirstnameIcon;
