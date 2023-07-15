"use client"
import React, { useState } from 'react';

/*  veri yapısındaki key değerleri
[
    "id",
    "firstValue",
    "secondValue",
    "unit",
    "oneRangeEnabled",
    "twoRangeEnabled",
    "manuelDefined",
    "translateEnabled",
    "turkish",
    "ukrainian",
    "english",
    "createdAt",
    "updatedAt"
]
*/

const DataTable = ({ measurementsData }) => {
    
    const renderHead = () => {
        const tableHeaders = ["Sıra","Ölçüler","Türkçe","Ukraynaca","İngilizce","İşlemler"]
        return (
            <tr className=''>
                {tableHeaders.map((header, index) => (
                    <th key={index} scope="col" class=" text-center py-4 border-l border-white last:bg-gray-700">
                        {header}
                    </th>
                ))}
            </tr>
        );
    };

    const renderData = () => {
        return measurementsData.map((measurement, index) => (
            <tr key={index} className='border-b'>
                <td className='text-center py-2 border-r flex justify-center items-center h-full mt-2'>
                    <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>{index + 1}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    {   measurement.oneRangeEnabled ?
                        <div>{measurement.firstValue + " " + measurement.unit}</div>
                        : measurement.twoRangeEnabled ?
                        <div>{measurement.firstValue + " - " + measurement.secondValue + " " + measurement.unit}</div>
                        : measurement.manuelDefined &&
                        <div>{measurement.firstValue}</div>
                    } 
                </td> 
                <td className='text-center py-2 border-r'>
                    <div>{measurement.turkish}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    <div>{measurement.ukrainian}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    <div>{measurement.english}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    <div className='flex center justify-center items-center gap-4'>
                        <button className='shadow-md bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-md min-w-[50px]'>
                            Düzenle
                        </button>
                        <button className='shadow-md bg-red-500 hover:bg-red-700 text-white font-bold p-2  rounded-md min-w-[50px]'>
                            Sil
                        </button>
                    </div>
                </td>
                 
   
            </tr>
        ));
    }

    return (
      <>
        <div className="relative overflow-x-auto w-full">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
              {renderHead()}{" "}
              {/* Tablo başlık kısmını renderHeaders fonksiyonu ile oluşturur */}
            </thead>
            <tbody>
                {renderData()}{" "}  
              {/* Tablo içerik kısmını renderData fonksiyonu ile oluşturur */}
            </tbody>
          </table>
        </div>
      </>
    );
};

export default DataTable;
