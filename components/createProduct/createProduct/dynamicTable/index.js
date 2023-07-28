"use client"
import React, { useState, useEffect } from 'react';
import { MdOutlineKeyboardArrowDown, MdDone } from "react-icons/md";
import Image from 'next/image';

const DynamicTable = ({ data }) => {
  const objectKey = Object.keys(data)[0];
  const responseData = data[objectKey];

  const [selectedMenu, setSelectedMenu] = useState("Renkler");
  const [checkboxValues, setCheckboxValues] = useState([]);

  useEffect(() => {
    console.log(checkboxValues);
  }, [checkboxValues])
  

  const handleCheckboxChange = (index, menu, id, targetValue, checked, value) => {
    // Değişen checkbox değerini yeni bir nesne olarak hazırla
    const newValue = {
      index,
      menu,
      id,
      targetValue,
      checked,
      value,
    };

    // Eski arrayi yeni değerle birleştir ve state'i güncelle
    setCheckboxValues((prevValues) => {
      // Eğer önceki değer zaten varsa ve menu değeri aynı ise, onu sil ve yeni değeri ekle
      const filteredValues = prevValues.filter(
        (value) => !(value.index === index && value.menu === menu)
      );

      // checked değeri false ise onu sil
      if (!newValue.checked) return filteredValues;
    
      // Yeni değeri ekleyip güncellenmiş arrayi döndür
      return [...filteredValues, newValue];
    });
  };

  const cancelKeys = objectKey === "furniture" ? [
    'createdAt', 'updatedAt', 'translateEnabled', 'colourPickerEnabled',
    'addSwatchEnabled', 'oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined',
    'metalTypeTurkish', 'metalTypeUkrainian', 'metalTypeEnglish',
    'metalDescriptionTurkish', 'metalDescriptionUkrainian', 'metalDescriptionEnglish',
    'turkish', 'ukrainian', 'english',
    'fabricTypeTurkish', 'fabricTypeUkrainian', 'fabricTypeEnglish',
    'fabricDescriptionTurkish', 'fabricDescriptionUkrainian', 'fabricDescriptionEnglish',
    'fabricSwatchTurkish', 'fabricSwatchUkrainian', 'fabricSwatchEnglish',
    'colourTypeTurkish', 'colourTypeUkrainian', 'colourTypeEnglish',
    'colourDescriptionTurkish', 'colourDescriptionUkrainian', 'colourDescriptionEnglish'
  ] : [];

  const handleMenuSelect = (menu) => setSelectedMenu(menu);

  const getMenuItems = () => Object.keys(responseData);

  const renderCell = (key, value) => (
    key === 'image' && value && value.length > 0 ?
      <div className='flex justify-center item-center'>
        <Image width={100} height={100} src={value} alt="Image" className="h-30 w-30 object-cover" />
      </div>
      : value
  );

  const renderTable = () => {
    if (selectedMenu === null) return null;
    const selectedResponseData = responseData[selectedMenu];

    const filteredData = selectedResponseData.map(item => {
      const filteredItem = {};
      Object.entries(item).forEach(([key, value]) => {
        if (!cancelKeys.includes(key)) filteredItem[key] = value;
      });
      return filteredItem;
    });

    return (
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-3 text-white bg-blue-600 font-bold border-l border-white">Sıra</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">Standart</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">+ ücret</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">- ücret</th>
              {Object.keys(filteredData[0]).map(header => (
                header != "id" &&
                <th key={header} className="p-3 text-white bg-blue-600 border-l border-white font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} 
              // eğer checkboxlardan herhangi biri seçilmişs ise bu satırı bg-green-200 yap.
              className={checkboxValues && checkboxValues.some(
                (value) =>
                  value.index === index &&
                  value.menu === selectedMenu &&
                  value.checked === true
              ) ? "bg-blue-50" : ""}

              >
                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100 flex flex-row flex-nowrap gap-2 justify-center items-center">
                {/* eğer checkboxlardan herhangi biri seçilmiş ise bu veriyi tik şareti yap. */}
                  {checkboxValues && checkboxValues.some((value) =>
                      value.index === index &&
                      value.menu === selectedMenu &&
                      value.checked === true) && <MdDone size={25} color='green' className="" />
                  }

                  {index + 1}
                </td>

                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                  <input type="checkbox" name="standard" value="standard" className='scale-150 cursor-pointer'

                    checked={checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.menu === selectedMenu &&
                        value.targetValue === "standard"
                    )}


                    onChange={(e) => {
                      handleCheckboxChange(index, selectedMenu, item.id, "standard", e.target.checked)
                    }}
                  />
                  
                </td>
                <td className="p-2 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100 ">
                  <input type="checkbox" name="plus" value="plus" className='scale-150 cursor-pointer'
                  checked={checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.menu === selectedMenu &&
                        value.targetValue === "plus"
                    )}
                  onChange={(e) => {
                      handleCheckboxChange(index, selectedMenu, item.id, "plus", e.target.checked)
                    }}
                  />

                  { checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.menu === selectedMenu &&
                        value.targetValue === "plus"
                    ) ?
                    <input type="number"
                    defaultValue={0}
                    placeholder='322'
                    min={0}
                    className="w-20 h-10 border border-gray-300 rounded-md ml-4 text-center"
                    onChange={(e) => {
                      handleCheckboxChange(index, selectedMenu, item.id, "plus",true, e.target.value)
                    }}
                  />
                  : null
                  }
                </td>
                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                  <input type="checkbox" name="minus" value="minus" className='scale-150 cursor-pointer'
                  checked={checkboxValues && checkboxValues.some(
                    (value) =>
                      value.index === index &&
                      value.menu === selectedMenu &&
                      value.targetValue === "minus"
                  )}
                  onChange={(e) => {
                      handleCheckboxChange(index, selectedMenu, item.id, "minus", e.target.checked)
                    }}
                  />

                    { checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.menu === selectedMenu &&
                        value.targetValue === "minus"
                    ) ?
                    <input type="number"
                    defaultValue={0}
                    min={0}
                    placeholder='145'
                    className="w-20 h-10 border border-gray-300 rounded-md ml-4 text-center"
                    onChange={(e) => {
                      handleCheckboxChange(index, selectedMenu, item.id, "minus",true, (-1 * e.target.value))
                    }}
                  />
                  : null
                  }
                </td>

                {Object.entries(item).map(([key, value]) => (
                  key != "id" &&
                  <td key={key} className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
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
        {getMenuItems().map(menuItem => (
          <li
            key={menuItem}
            onClick={() => handleMenuSelect(menuItem)}
            className={`cursor-pointer py-2 px-4 ml-2 rounded-md flex flex-row flex-nowrap gap-2 justify-center items-center
            ${selectedMenu === menuItem ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
            ${ menuItem == "Ölçüler" && "order-first ml-0"}`}
          >
            {menuItem}
          </li>
        ))}
      </ul>
      {renderTable()}
      <div className='w-full flex justify-end items-center p-4'>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setCheckboxValues([])}>
          Tümünü Temizle
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;



