"use client"
import React, { useState } from 'react';
import Image from 'next/image';


const DynamicTable = ({ data }) => {
  const objectKey = Object.keys(data)[0];
  const responseData = data[objectKey];

  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };
  
    let cancelKeys = [];

  // İzin verilen anahtarları belirle
  if(objectKey === "furniture"){
    cancelKeys = [
        'createdAt',
        'updatedAt',
        'id',
        'translateEnabled',
        'colourPickerEnabled',
        'addSwatchEnabled',
        'oneRangeEnabled',
        'twoRangeEnabled',
        'manuelDefined',

        'metalTypeTurkish',
        'metalTypeUkrainian',
        'metalTypeEnglish',
        'metalDescriptionTurkish',
        'metalDescriptionUkrainian',
        'metalDescriptionEnglish',
        

        'turkish',
        'ukrainian',
        'english',


        'fabricTypeTurkish',
        'fabricTypeUkrainian',
        'fabricTypeEnglish',
        'fabricDescriptionTurkish',
        'fabricDescriptionUkrainian',
        'fabricDescriptionEnglish',
        'fabricSwatchTurkish',
        'fabricSwatchUkrainian',
        'fabricSwatchEnglish',

        'colourTypeTurkish',
        'colourTypeUkrainian',
        'colourTypeEnglish',
        'colourDescriptionTurkish',
        'colourDescriptionUkrainian',
        'colourDescriptionEnglish',

    ];
}

  const getMenuItems = () => {
    return Object.keys(responseData);
  };

  const renderCell = (key, value) => {
    if (key === 'image' && value && value.length > 0) {
        return <div className='flex justify-center item-center'>
        <Image width={100} height={100} src={value} alt="Image" className="h-30 w-30 object-cover" />
      </div>
    }

    return value;
  };

  const renderTable = () => {
    if (selectedMenu === null) return null;

    const selectedresponseData = responseData[selectedMenu];

    // Filtreleme işlemi: Sadece izin verilen anahtarları içeren yeni bir nesne oluştur
    const filteredData = selectedresponseData.map((item) => {
      const filteredItem = {};
      Object.entries(item).forEach(([key, value]) => {
        if (!cancelKeys.includes(key) || !cancelKeys) {
          filteredItem[key] = value;
        }
      });
      return filteredItem;
    });

    return (
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-300">
          <thead>
            <tr>
                <th className="p-3 text-white bg-blue-600 font-bold">Sıra</th>
              {Object.keys(filteredData[0]).map((header) => (
                <th key={header} className="p-3 text-white bg-blue-600 border-l border-white font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}> 
              <td className="p-3 border-t border-gray-300 border-l border-r text-center">
              {index +1}
              </td>
                {Object.entries(item).map(([key, value]) => (
                  <td key={key} className="p-3 border-t border-gray-300 border-l border-r text-center">
                    {renderCell(key, value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <ul className="flex space-x-2 w-full p-4 justify-center item-center">
        {getMenuItems().map((menuItem) => (
          <li
            key={menuItem}
            onClick={() => handleMenuSelect(menuItem)}
            className={`cursor-pointer py-2 px-4 rounded-md ${
              selectedMenu === menuItem ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {menuItem}
          </li>
        ))}
      </ul>
      {renderTable()}
    </div>
  );
};

export default DynamicTable;



