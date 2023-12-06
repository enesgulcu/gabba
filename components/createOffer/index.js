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
        } p-0 lg:p-2 w-full justify-between mb-4 items-center shadow-lg lg:px-10 bg-gray-100 gap-2 pr-4`
      }
      >
        <div className='flex justify-center item-center flex-row lg:flex-row gap-2 px-4 my-2'>
          <button className='bg-green-500 p-4 text-white rounded lg:text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0'>
          <BiFilterAlt size={25}/>
          Filtrele
          </button>
          <button
            onClick={() => {
              setShowOrderOffer(true);
              setShowBasketOffer(false);
            }}
            className='bg-purple-600 p-4 text-white rounded lg:text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0'
          >
            <FaFileInvoice size={25}/>
            Teklifler
          </button>
        </div>
        {!showBasketOffer && !showOrderOffer ? (
          <div className='justify-end mr-4 flex center items-center gap-4'>
            <button onClick={() => setShowBasketOffer(true)}>
              <div className='relative py-2 hover:scale-110 transition-all'>
                <div className='t-0 absolute left-3'>
                  <p className='flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-md text-white'>
                    {basketData.length}
                  </p>
                </div>
                <BsCart3 size={25} className='file: mt-4 h-6 w-6'/>
   
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
            className='bg-green-600 rounded text-white p-4 flex flex-row gap-2 flex-nowrap justify-center items-center hover:cursor-pointer hover:scale-105 transition-all'
          >
            
            Teklif Oluştur
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
