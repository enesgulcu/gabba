'use client';
import React, { useState, useEffect } from 'react';
import { getAPI } from '@/services/fetchAPI';
import Card from './Card';

const OrderOffer = ({ setIsloading }) => {
  const [orderData, setOrderData] = useState([]);
  const getAllOrderData = async () => {
    const response = await getAPI('/createOrder/order');
    setOrderData(response.data);
    setIsloading(false);
  };

  useEffect(() => {
    setIsloading(true);
    getAllOrderData();
  }, []);

  return (
    <>
      <Card orderData={orderData} setOrderData={setOrderData} />
    </>
  );
};

export default OrderOffer;
