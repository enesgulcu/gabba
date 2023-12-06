import React, { useState } from 'react';

const BasketAddCustomer = ({
  setIsBasketAddCustomer,
  setIsBasketAddPersonel,
  addNewCustomer,
  setAddNewCustomer,
  FormProps,
  ErrorMessage,
}) => {
  return (
    <>
      <h1 className='text-2xl font-bold text-center my-4 uppercase'>
        Müşteri Bilgilerini Ekle
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='border p-3 mx-4 rounded shadow order-2 md:order-1 flex gap-2 flex-col'>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => alert('Güncellenecek')}
              className='bg-black text-white p-3'
            >
              Kayıtlı Müşterilerden Seç
            </button>
            {addNewCustomer ? (
              <button
                type='button'
                onClick={() => {
                  // Inputlardaki veriler silinecek
                  setAddNewCustomer(false);
                }}
                className='bg-red-500 text-white p-3'
              >
                İptal Et
              </button>
            ) : (
              <button
                type='button'
                onClick={() => setAddNewCustomer(true)}
                className='bg-blue-500 text-white p-3'
              >
                Yeni Müşteri Kaydı Ekle
              </button>
            )}
          </div>
          {addNewCustomer && (
            <>
              <h1 className='text-center text-lg font-semibold uppercase'>
                Müşteri Kaydı Ekle
              </h1>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Customer[0].companyName`}
                  name={`Customer[0].companyName`}
                  value={FormProps.values.Customer[0].companyName}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Firma İsmi'
                />
                <ErrorMessage
                  name='Customer[0].companyName'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Customer[0].name`}
                  name={`Customer[0].name`}
                  value={FormProps.values.Customer[0].name}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Müşterinin Adı'
                />
                <ErrorMessage
                  name='Customer[0].name'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Customer[0].surname`}
                  name={`Customer[0].surname`}
                  value={FormProps.values.Customer[0].surname}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Müşterinin Soyadı'
                />
                <ErrorMessage
                  name='Customer[0].surname'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Customer[0].address`}
                  name={`Customer[0].address`}
                  value={FormProps.values.Customer[0].address}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Müşterinin Adresi'
                />
                <ErrorMessage
                  name='Customer[0].address'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Customer[0].mailAddress`}
                  name={`Customer[0].mailAddress`}
                  value={FormProps.values.Customer[0].mailAddress}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Müşterinin Mail Adresi'
                />
                <ErrorMessage
                  name='Customer[0].mailAddress'
                  component='div'
                  className='field-error text-red-600 m-1'
                />
              </div>
              <div className='input-group'>
                <input
                  onChange={FormProps.handleChange}
                  id={`Customer[0].phoneNumber`}
                  name={`Customer[0].phoneNumber`}
                  value={FormProps.values.Customer[0].phoneNumber}
                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
                  type='text'
                  placeholder='Müşterinin Telefon Numarası'
                />
                <ErrorMessage
                  name='Customer[0].phoneNumber'
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
            onClick={() => setIsBasketAddCustomer(false)}
          >
            Sepeti Güncelle
          </button>
          <button
            type='button'
            className='bg-blue-500 p-3 text-white rounded'
            onClick={() => {
              setIsBasketAddPersonel(true);
              setIsBasketAddCustomer(false);
            }}
          >
            Personel Bilgilerini Ekle
          </button>
        </div>
      </div>
    </>
  );
};

export default BasketAddCustomer;
