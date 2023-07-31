"use client"
import React, { useState, useEffect } from 'react';
import { MdOutlineKeyboardArrowDown, MdDone } from "react-icons/md";
import Image from 'next/image';
import {postAPI} from '@/services/fetchAPI';

const sendData = async (data) =>{
  try {
    const responseData = await postAPI("/createProduct/createProduct",{data:data, processType:"post"});
    if(!responseData || responseData.status !== "success"){
        throw new Error("Veri eklenemedi");
    }
    // await setIsloading(false);
    // toast.success("Veri başarıyla silindi");

  } catch (error) {
      // toast.error(error.message);
      console.log(error);
  }
}

const DynamicTable = ({ data }) => {
  const objectKey = Object.keys(data)[0];
  const responseData = data[objectKey];

  //responseData içerisine yeni bir başlık ekle
  responseData["Extra"] = [
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue1: "",
    }
  ];

  const [selectedFeature, setSelectedFeature] = useState("Ölçüler");
  const [checkboxValues, setCheckboxValues] = useState([]);

  useEffect(() => {
    console.log(checkboxValues);
  }, [checkboxValues])
  

  const handleCheckboxChange = (index, feature, id, targetValue, checked, value) => {
    // Değişen checkbox değerini yeni bir nesne olarak hazırla
    const newValue = {
      index,
      feature,
      id,
      targetValue,
      checked,
      value,
    };

    // Eski arrayi yeni değerle birleştir ve state'i güncelle
    setCheckboxValues((prevValues) => {
      // Eğer önceki değer zaten varsa ve feature değeri aynı ise, onu sil ve yeni değeri ekle
      const filteredValues = prevValues.filter(
        (value) => !(value.index === index && value.feature === feature)
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
    'turkish', 'ukrainian', 'english', 'fabricTypeTurkish', 'fabricTypeUkrainian', 'fabricTypeEnglish',
    'fabricDescriptionTurkish', 'fabricDescriptionUkrainian', 'fabricDescriptionEnglish',
    'fabricSwatchTurkish', 'fabricSwatchUkrainian', 'fabricSwatchEnglish',
    'colourTypeTurkish', 'colourTypeUkrainian', 'colourTypeEnglish',
    'colourDescriptionTurkish', 'colourDescriptionUkrainian', 'colourDescriptionEnglish'
  ] : [];

  const handleFeatureSelect = (feature) => setSelectedFeature(feature);

  const getFeatureItems = () => Object.keys(responseData);

  const renderCell = (key, value) => (
    key === 'image' && value && value.length > 0 ?
      <div className='flex justify-center item-center'>
        <Image width={150} height={150} src={value} alt="Image" className="h-35 w-35 object-cover hover:scale-150 transition-all hover:border-2 border-gray-600 hover:rounded" />
      </div>
      : value
  );

  const renderTable = () => {
    if (selectedFeature === null) return null;
    const selectedResponseData = responseData[selectedFeature];

    const filteredData = selectedResponseData.map(item => {
      const filteredItem = {};
      Object.entries(item).forEach(([key, value]) => {
        if (!cancelKeys.includes(key)) filteredItem[key] = value;
      });
      return filteredItem;
    });

    const headerMappings = {
      // Ölçü
      firstValue: "1. Ölçü",
      secondValue: "2. Ölçü",
      unit: "Birim",

      // Renkler
      colourType: "Renk Tipi",
      colourDescription: "Renk Açıklaması",
      colourHex: "Renk Kodu",

      // Kumaş
      fabricType: "Kumaş Tipi",
      fabricDescription: "Kumaş Açıklaması",
      fabricSwatch: "Kartela",
      image: "Resim",

      // Metal
      metalType: "Metal Tipi",
      metalDescription: "Metal Açıklaması",
      image: "Resim",

      // Extra
      extraValue1: "Ekstra",
      extraValue2: "Açıklama",

    };

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
                // tablo başlıklarının listelendiği bölüm
                header != "id" &&
                <th key={header} className="p-3 text-white bg-blue-600 border-l border-white font-bold">
                  {headerMappings[header] || header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              // tablo satırlarının listelendiği bölüm
              <tr key={index} 
              // eğer checkboxlardan herhangi biri seçilmişs ise bu satırı bg-green-200 yap.
              className={checkboxValues && checkboxValues.some(
                (value) =>
                  value.index === index &&
                  value.feature === selectedFeature &&
                  value.checked === true
              ) ? "bg-blue-50 " : ""}

              >
                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100 ">
                {/* eğer checkboxlardan herhangi biri seçilmiş ise bu veriyi tik şareti yap. */}
                  <div className='h-full flex  justify-center items-center gap-2'>
                    {checkboxValues && checkboxValues.some((value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.checked === true) && 
                        <MdDone size={25} color='green' className="" />
                    }

                    {index + 1}
                  </div>
                </td>

                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                  <input type="checkbox" name="standard" value="standard" className='scale-150 cursor-pointer'

                    checked={checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "standard"
                    )}


                    onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "standard", e.target.checked)
                    }}
                  />
                  
                </td>
                <td className="p-2 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100 ">
                  <input type="checkbox" name="plus" value="plus" className='scale-150 cursor-pointer'
                  checked={checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "plus"
                    )}
                  onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "plus", e.target.checked)
                    }}
                  />

                  { checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "plus"
                    ) ?
                    <input type="number"
                    defaultValue={0}
                    placeholder='322'
                    min={1}
                    className="w-20 h-10 border border-gray-300 rounded-md ml-0 sm:ml-4 text-center"
                    onChange={(e) => {
                      e.target.value > 0 &&
                      handleCheckboxChange(index, selectedFeature, item.id, "plus",true, e.target.value)

                    }}
                  />
                  : null
                  }
                </td>
                <td className="p-2 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                  <input type="checkbox" name="minus" value="minus" className='scale-150 cursor-pointer'
                  checked={checkboxValues && checkboxValues.some(
                    (value) =>
                      value.index === index &&
                      value.feature === selectedFeature &&
                      value.targetValue === "minus"
                  )}
                  onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "minus", e.target.checked)
                    }}
                  />

                    { checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "minus"
                    ) ?
                    <input type="number"
                    defaultValue={0}
                    min={1}
                    placeholder='145'
                    className="w-20 h-10 border border-gray-300 rounded-md ml-0 sm:ml-4 text-center"
                    onChange={(e) => {
                      e.target.value > 0 &&
                      handleCheckboxChange(index, selectedFeature, item.id, "minus",true, (-1 * e.target.value))
                    }}
                  />
                  : null
                  }
                </td>

                {Object.entries(item).map(([key, value]) => (
                  key != "id" && key === "extraValue1" ? 
                  
                  <td key={key}  className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                    <input type="text"
                    placeholder='Ekstra değer'
                    className="p-2 border border-gray-300 rounded-md ml-4 text-center w-full lg:w-2/3 "
                    onChange={(e) => {
                      e.target.value.length > 0 &&
                      handleCheckboxChange(index, selectedFeature, item.id, "minus",true, e.target.value)
                    }}
                  />
                  </td> :                   
                  key != "id" &&
                  <td key={key} className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                    {key === "colourHex" ? (
                      <div style={{backgroundColor: value}}
                      className='p-4 rounded flex justify-center items-center text-white'
                      >{renderCell(key, value)}</div>
                      )

                      : renderCell(key, value)
                    }
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
      <ul className="flex space-x-2 w-full p-4 justify-center item-center h-full flex-wrap gap-2">
        {getFeatureItems().map(featureItem => (
          <li
            key={featureItem}
            onClick={() => handleFeatureSelect(featureItem)}
            className={`cursor-pointer py-2 px-4 ml-2 rounded-md flex flex-row flex-nowrap gap-2 justify-center items-center
            ${selectedFeature === featureItem ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
            ${ featureItem == "Ölçüler" && "order-first ml-0"}`}
          >
            {featureItem}
          </li>
        ))}
        {/* sendData */}
      </ul>
      {renderTable()}
      <div className='w-full flex justify-around items-center p-4'>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setCheckboxValues([])}>
          Tümünü Temizle
        </button>
        <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={()=>sendData(checkboxValues)}>
          Ürünü Kaydet
        </button>
      </div>
      
    </div>
  );
};

export default DynamicTable;



