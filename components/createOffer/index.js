'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import LoadingScreen from '@/components/other/loading';
import ListProducts from './listProducts';
import BasketOffer from './basketOffer';
import OrderOffer from './orderOffer';
import { getAPI } from '@/services/fetchAPI';
import FinancialManagementCalculate from '@/functions/others/financialManagementCalculate';
import { BiFilterAlt } from "react-icons/bi";
import { FaFileInvoice } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";

const CreateOfferComponent = () => {
  const [showOrderOffer, setShowOrderOffer] = useState(false);
  const [hiddenBasketBar, setHiddenBasketBar] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productFeatures, setProductFeatures] = useState([]);
  const [showBasketOffer, setShowBasketOffer] = useState(false);
  // Sepetteki ürünleri tuttuğumuz state.
  const [basketData, setBasketData] = useState([]);
  // Sepetteki ürünlerin stok değerlerini tuttuğumuz state.
  const getData = async () => {
    try {
      setIsloading(true);
      const response = await getAPI('/createProduct/createProduct');
      if (!response) {
        throw new Error('Veri çekilemedi 2');
      }

      if (response.status !== 'success') {
        throw new Error('Veri çekilemedi');
      }

      // response.data.createProducts içerisindeki değerleri gez ve "productName" değerlerine göre küçükten büyüğe doğru sırala.
      await response.data.createProducts.sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );
      await Promise.all(
        await response.data.createProducts.map(async (item) => {
          const { result } = await FinancialManagementCalculate(
            item.productPrice
          );
          item.productPrice = result[result.length - 1];
        })
      );
      setProducts(response.data.createProducts);
      setProductFeatures(response.data.productFeatures);
      setIsloading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  async function getAllBasketData() {
    const response = getAPI('/createOffer/basket');
    const [dataResult] = await Promise.all([response]);
    setIsloading(false);
    setBasketData(dataResult.data);
  }

  useEffect(() => {
    getData();
    getAllBasketData();
  }, []);

  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />

      <div
        className={`${
          hiddenBasketBar ? 'hidden' : 'flex'
        } p-0 lg:p-2 w-full justify-between mb-4 items-center shadow-lg lg:px-10 bg-gray-100 gap-2`
      }
      >
        <div className='flex justify-center item-center flex-row lg:flex-row gap-2 px-4 my-2'>
          <button className='bg-green-500 p-4 text-white rounded lg:text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0'>
          <BiFilterAlt size={25}/>
          Filtrele
          </button>
          <button
            onClick={() => setShowOrderOffer(true)}
            className='bg-purple-600 p-4 text-white rounded lg:text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0'
          >
            <FaFileInvoice size={25}/>
            Teklifler
          </button>
        </div>
        {!showBasketOffer && !showOrderOffer ? (
          <div className='justify-end mr-4flex center items-center gap-4 mr-4'>
            <button onClick={() => setShowBasketOffer(true)}>
              <div className='relative py-2 hover:scale-110 transition-all'>
                <div className='t-0 absolute left-3'>
                  <p className='flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-md text-white'>
                    {basketData.length}
                  </p>
                </div>
                <BsCart3 size={25} className='file: mt-4 h-6 w-6'/>
                {/* <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='file: mt-4 h-6 w-6'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg> */}
              </div>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowBasketOffer(false);
              setShowOrderOffer(false);
            }}
            type='button'
            className='bg-red-600 rounded text-white p-4 flex flex-row gap-2 flex-nowrap justify-center items-center hover:cursor-pointer hover:scale-105 transition-all'
          >
            İptal Et
          </button>
        )}
      </div>
      {showOrderOffer && (
        <OrderOffer
          toast={toast}
          showOrderOffer={showOrderOffer}
          setShowOrderOffer={setShowOrderOffer}
          setIsloading={setIsloading}
        />
      )}
      {showBasketOffer && (
        <BasketOffer
          toast={toast}
          basketData={basketData}
          setBasketData={setBasketData}
          isloading={isloading}
          setIsloading={setIsloading}
          productFeatures={productFeatures}
          getAllBasketData={getAllBasketData}
        />
      )}
      {!showBasketOffer && !showOrderOffer && (
        <ListProducts
          getData={getData}
          getAllBasketData={getAllBasketData}
          toast={toast}
          isloading={isloading}
          setIsloading={setIsloading}
          products={products}
          productFeatures={productFeatures}
          setHiddenBasketBar={setHiddenBasketBar}
        />
      )}
    </>
  );
};

export default CreateOfferComponent;
