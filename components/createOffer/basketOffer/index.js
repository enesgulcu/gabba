'use client';
import React from 'react';
import ListBasket from './listBasket';
const BasketOffer = ({
  toast,
  isloading,
  setIsloading,
  productFeatures,
  basketData,
  setBasketData,
  getAllBasketData,
}) => {
  return (
    <>
      <ListBasket
        toast={toast}
        basketData={basketData}
        setBasketData={setBasketData}
        getAllBasketData={getAllBasketData}
        productFeatures={productFeatures}
        isloading={isloading}
        setIsloading={setIsloading}
      />
    </>
  );
};

export default BasketOffer;
