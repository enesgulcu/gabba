import React from 'react';
import Image from 'next/image';
const Card = ({ orderData, setOrderData }) => {
  console.log(orderData);
  return (
    <div className='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3'>
      {orderData &&
        orderData.length > 0 &&
        orderData.map((item) => (
          <div
            key={item.Orders.id}
            className='border rounded-lg shadow bg-gray-800 border-gray-700'
          >
            <div className='flex flex-col items-center pt-4'>
              <Image
                className='w-24 h-24 mb-3 rounded-full shadow-lg'
                src='/invoice-blue.png'
                width={100}
                height={100}
                alt='Invoice icon'
              />

              <h5 class='my-2 text-md font-medium text-white'>
                {item.orderCode}
              </h5>
              <ul className='divide-y divide-gray-700 text-gray-300'>
                <li className='py-2'>
                  Oluşturma Tarihi:{' '}
                  {item.Orders.map(
                    (orders, index) =>
                      index != 1 &&
                      orders.createdAt
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('.')
                  )}
                </li>
                <li className='py-2'>Firma İsmi: Ceday Holding</li>
                <li className='py-2'>
                  Fiyat:{' '}
                  {item.Orders.reduce((total, order) => {
                    return (
                      total +
                      (order.productPrice + order.productFeaturePrice) *
                        order.stock
                    );
                  }, 0)}
                </li>
              </ul>
              <div className='flex mt-4 gap-2'>
                <Image
                  className='w-10 h-10 mb-3 rounded-full shadow-lg'
                  src='/en_flag.svg'
                  width={100}
                  height={100}
                  alt='Invoice icon'
                />
                <Image
                  className='w-10 h-10 mb-3 rounded-full shadow-lg'
                  src='/ua_flag.svg'
                  width={100}
                  height={100}
                  alt='Invoice icon'
                />
                <Image
                  className='w-10 h-10 mb-3 rounded-full shadow-lg'
                  src='/tr_flag.svg'
                  width={100}
                  height={100}
                  alt='Invoice icon'
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Card;