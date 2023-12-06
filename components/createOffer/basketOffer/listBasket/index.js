'use client';
import React, { useState } from 'react';
import { postAPI } from '@/services/fetchAPI';
import Image from 'next/image';
import BasketAddCustomer from './multiStepForm/BasketAddCustomer';
import BasketAddPersonel from './multiStepForm/BasketAddPersonel';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';

const ListBasket = ({
  toast,
  isloading,
  setIsloading,
  setBasketData,
  basketData,
  productFeatures,
}) => {
  const [isBasketAddCustomer, setIsBasketAddCustomer] = useState(false);
  const [addNewCustomer, setAddNewCustomer] = useState(false);
  const [isBasketAddPersonel, setIsBasketAddPersonel] = useState(false);
  const [addNewPersonel, setAddNewPersonel] = useState(false);

  console.log('basketData', basketData);

  const deleteBasketItem = async (itemId) => {
    setIsloading(true);
    const response = await postAPI('/createOffer/basket', {
      processType: 'delete',
      id: itemId,
    });

    if (!response || response.status !== 'success') {
      throw new Error('Veri silinemedi');
    } else {
      setIsloading(false);
      toast.success(response.message);
      const newBasketData = basketData.filter((item) => item.id !== itemId);
      setBasketData(newBasketData);
    }
  };

  const handleChangeStock = async (itemId, stock) => {
    console.log(stock);
    if(stock < 1){
      return toast.error('Stok değeri 1 den küçük olamaz!');
    }
    setBasketData((prevBasketData) => {
      const newBasketData = [...prevBasketData];
      const itemIndex = newBasketData.findIndex((item) => item.id === itemId);
      newBasketData[itemIndex].Stock = stock;
      return newBasketData;
    });
    const response = await postAPI('/createOffer/basket', {
      processType: 'update',
      id: itemId,
      stock,
    });
  };
  return (
    <Formik
      //validationSchema={FinancialManagementValidationSchema}
      initialValues={{
        orderNote: '',
        Customer: [
          {
            name: '',
            surname: '',
            phoneNumber: '',
            address: '',
            mailAddress: '',
            role: 'customer',
          },
        ],
        Personel: [
          {
            name: '',
            surname: '',
            phoneNumber: '',
            storeName: '',
            storeAddress: '',
            role: 'personel',
          },
        ],
      }}
      onSubmit={async (values, { resetForm }) => {
        setIsloading(true);
        const response = await postAPI('/createOrder/order', {
          basketData,
          values,
        });
        if (response.status !== 'success' || response.status == 'error') {
          setIsloading(false);
          toast.error(response.error);
        } else {
          setIsloading(false);
          toast.success(response.message);
          setBasketData([]);
          setIsBasketAddCustomer(false);
          setIsBasketAddPersonel(false);
          setShowBasketOffer(false);
        }
      }}
    >
      {(FormProps) => (
        <Form onSubmit={FormProps.handleSubmit}>
          <div className='flex flex-col justify-center items-center'>
            {isBasketAddCustomer ? (
              <BasketAddCustomer
                FormProps={FormProps}
                ErrorMessage={ErrorMessage}
                setIsBasketAddCustomer={setIsBasketAddCustomer}
                setIsBasketAddPersonel={setIsBasketAddPersonel}
                addNewCustomer={addNewCustomer}
                setAddNewCustomer={setAddNewCustomer}
              />
            ) : isBasketAddPersonel ? (
              <BasketAddPersonel
                FormProps={FormProps}
                ErrorMessage={ErrorMessage}
                setIsBasketAddCustomer={setIsBasketAddCustomer}
                setIsBasketAddPersonel={setIsBasketAddPersonel}
                addNewPersonel={addNewPersonel}
                setAddNewPersonel={setAddNewPersonel}
              />
            ) : (
              <>
                <h1 className='text-2xl font-bold text-center my-4 uppercase'>
                  Sepet
                </h1>
                {basketData.length === 0 ? (
                  <div className='grid grid-cols-1 w-full'>
                    <div className='border p-3 mx-4 rounded shadow order-2 md:order-1'>
                      <p className='text-2xl font-bold text-center my-4 text-red-500'>
                        Sepetinizde ürün bulunmamakta!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2'>
                    <div className='border p-3 mx-4 rounded shadow order-2 md:order-1'>
                      {basketData.map((item) => (
                        <div
                          key={item.id}
                          className='flex flex-col mb-4 border p-3'
                        >
                          <div className='flex flex-row gap-4'>
                            <div>
                              {productFeatures.map(
                                (productFeature, index) =>
                                  productFeature.productId ===
                                    item.Product.id &&
                                  productFeature.feature.includes(
                                    'Image' || 'image'
                                  ) && (
                                    <div
                                      key={index}
                                      className='lg:p-2 p-0 m-1 lg:m-2'
                                    >
                                      <Image
                                        width={150}
                                        height={200}
                                        src={
                                          productFeature.imageValue
                                            ? productFeature.imageValue
                                            : '/no-image.jpg'
                                        }
                                        alt={`image${index}`}
                                        className='rounded hover:scale-125 transition duration-300 ease-in-out cursor-pointer'
                                      />
                                    </div>
                                  )
                              )}
                            </div>
                            <div className='flex flex-col w-full'>
                              <p className='font-semibold text-center uppercase'>
                                {item.Product.productName}
                              </p>
                              <div className='flex gap-2 mt-2 items-center justify-between'>
                                <div className='flex gap-2 mt-2 items-center'>
                                  <button
                                    type='button'
                                    className='w-8 h-8 bg-blue-500 rounded-full text-white'
                                    onClick={() =>
                                      handleChangeStock(item.id, item.Stock + 1)
                                    }
                                  >
                                    +
                                  </button>

                                  <p>{item.Stock}</p>
                                  <button
                                    type='button'
                                    className='w-8 h-8 bg-blue-500 rounded-full text-white'
                                    onClick={() =>
                                      handleChangeStock(item.id, item.Stock - 1)
                                    }
                                  >
                                    -
                                  </button>
                                </div>
                                <p className='mr-4 font-semibold text-red-600'>
                                  {parseInt(
                                    item.ProductPrice + item.ProductFeaturePrice
                                  ) * item.Stock}
                                </p>
                              </div>
                              <div className='flex gap-2'>
                                <p className='mt-4 bg-blue-600 rounded text-center p-2 text-white cursor-pointer'>
                                  Tüm Özellikleri Göster
                                </p>
                                <button
                                  type='button'
                                  onClick={() => deleteBasketItem(item.id)}
                                  className='mt-4 bg-red-600 rounded text-center p-2 text-white cursor-pointer'
                                >
                                  Ürünü Sepetten Kaldır
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='border p-3 mx-4 rounded shadow order-1 md:order-2 h-fit flex flex-col gap-2 justify-center'>
                      <textarea
                        id='orderNote'
                        name='orderNote'
                        value={FormProps.values.orderNote}
                        onChange={FormProps.handleChange}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                        placeholder='Sepetteki ürünleriniz için genel bir not bölümü ekleyin...'
                      ></textarea>

                      <button
                        type='button'
                        onClick={() => setIsBasketAddCustomer(true)}
                        className='bg-blue-500 p-3 text-white rounded'
                      >
                        Müşteri Bilgilerini Ekle
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ListBasket;
