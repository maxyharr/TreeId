import React, { createContext, useState } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]); // [{uri: '...', location: {coords: { latitude: ..., longitude: ... }}}]

  return (
    <ImageContext.Provider value={{ images, setImages }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext;
