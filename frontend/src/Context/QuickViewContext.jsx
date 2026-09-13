import React, { createContext, useContext, useState } from 'react';
import QuickView from '../Components/QuickView/QuickView';

const QuickViewContext = createContext();

export const useQuickView = () => {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
};

export const QuickViewProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);

  const openQuickView = (productData) => {
    setProduct(productData);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setProduct(null);
  };

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView, isOpen, product }}>
      {children}
      <QuickView 
        isOpen={isOpen} 
        onClose={closeQuickView} 
        product={product} 
      />
    </QuickViewContext.Provider>
  );
};
