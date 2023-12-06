import React, { useState } from 'react';

const BasketAddPersonel = ({
  setIsBasketAddCustomer,
  setIsBasketAddPersonel,
  addNewPersonel,
  setAddNewPersonel,
  ErrorMessage,
  FormProps,
}) => {
  return (
    <>
      <h1 className='text-2xl font-bold text-center my-4 uppercase'>
        Personel Bilgilerini Ekle
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className='border p-3 mx-4 rounded shadow order-2 md:order-1 flex gap-2 flex-col'>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => alert('Güncellenecek')}
              className='bg-black text-white p-3'
            >
              Kayıtlı Personellerden Seç
            </button>
            {addNewPersonel ? (
              <button
                type='button'
                onClick={() => {
                  // Inputlardaki veriler silinecek
                  setAddNewPersonel(false);
                }}
                className='bg-red-500 text-white p-3'
              >
                İptal Et
              </button>
            ) : (
              <button
                type='button'
                onClick={() => setAddNewPersonel(true)}
                className='bg-black text-white p-3'
              >
                Yeni Personel Kaydı Ekle
              </button>
            )}
          </div>
          {addNewPersonel && (
            <>
              <h1 className='text-center text-lg font-semibold uppercase'>
                Personel Kaydı Ekle
              </h1>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Personel[0].name`}
                  name={`Personel[0].name`}
                  value={FormProps.values.Personel[0].name}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Personelin Adı'
                />
                <ErrorMessage
                  name='Personel[0].name'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Personel[0].surname`}
                  name={`Personel[0].surname`}
                  value={FormProps.values.Personel[0].surname}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Personelin Soyadı'
                />
                <ErrorMessage
                  name='Personel[0].surname'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Personel[0].storeName`}
                  name={`Personel[0].storeName`}
                  value={FormProps.values.Personel[0].storeName}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Mağaza'
                />
                <ErrorMessage
                  name='Personel[0].storeName'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Personel[0].storeAddress`}
                  name={`Personel[0].storeAddress`}
                  value={FormProps.values.Personel[0].storeAddress}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Mağaza Adresi'
                />
                <ErrorMessage
                  name='Personel[0].storeAddress'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Personel[0].phoneNumber`}
                  name={`Personel[0].phoneNumber`}
                  value={FormProps.values.Personel[0].phoneNumber}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Personelin Telefon Numarası'
                />
                <ErrorMessage
                  name='Personel[0].phoneNumber'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
            </>
          )}
        </div>
        <div className='border p-3 mx-4 rounded shadow order-1 md:order-2 h-fit flex justify-center gap-2'>
          <button
            type='button'
            className='bg-green-500 p-3 text-white rounded'
            onClick={() => {
              setIsBasketAddCustomer(true);
              setIsBasketAddPersonel(false);
            }}
          >
            Müşteri Bilgilerini Düzenle
          </button>
          <button
            type='submit'
            className='bg-purple-500 p-3 text-white rounded'
          >
            Teklifi Onayla
          </button>
        </div>
      </div>
    </>
  );
};

export default BasketAddPersonel;
