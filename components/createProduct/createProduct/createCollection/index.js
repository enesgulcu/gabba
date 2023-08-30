"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import {postAPI, getAPI} from '@/services/fetchAPI';

const CreateCollection = ({chooseProducts}) => {

  const [addTypeEnabled, setAddTypeEnabled] = useState(false);
  const [collectionTypes, setCollectionTypes] = useState("");

  const [collectionName , setCollectionName] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [languageIsEnabled, setLanguageIsEnabled] = useState(false);


  const [collectionNameTR , setCollectionNameTR] = useState("");
  const [collectionTypeTR, setCollectionTypeTR] = useState("");
  const [collectionCategoryTR, setCollectionCategoryTR] = useState("");
  const [collectionDescriptionTR, setCollectionDescriptionTR] = useState("");

  const [collectionNameEN , setCollectionNameEN] = useState("");
  const [collectionTypeEN, setCollectionTypeEN] = useState("");
  const [collectionCategoryEN, setCollectionCategoryEN] = useState("");
  const [collectionDescriptionEN, setCollectionDescriptionEN] = useState("");

  const [collectionNameUA , setCollectionNameUA] = useState("");
  const [collectionTypeUA, setCollectionTypeUA] = useState("");
  const [collectionCategoryUA, setCollectionCategoryUA] = useState("");
  const [collectionDescriptionUA, setCollectionDescriptionUA] = useState("");

  useEffect(() => {
    // enes burada kaldın api oluşturulacak veriler çekilecek...
    //getData();

  }, []);


  const getData = async () => {
    try {
      //setIsloading(true);
      const response = await getAPI('/createProduct/createProduct/createCollection');
  
      if(!response || response.status !== "success"){
        throw new Error("Veri çekilemedi JJKY7TB");
      }

      setCollectionTypes(response.data.createProducts);
      //setIsloading(false);
  
    } catch (error) {
      //setIsloading(false);
  
      //toast.error(error.message);
      console.log(error);
    }
  } 


  return (
    <div className='w-full p-2'>
        <div className='w-full bg-gray-100 border-4 border-purple-600 p-2 lg:my-10 my-4 flex flex-col lg:flex-row flex-wrap gap-4 justify-center item-center rounded-md'>
        <div className='w-full flex justify-center items-center'>
          <h3 className='text-lg md:text-2xl font-bold bg-purple-600 p-4 rounded text-white'>Koleksiyon Oluşturma</h3>
        </div>
        <div className="flex flex-col justify-center items-center ">
          <h3 className='text-xl font-semibold text-gray-700 my-2'> Koleksiyon Adı </h3>
          <input
            type="text"
            placeholder="Koleksiyon Adı"
            value={collectionName}
            className="hover:scale-105 transition-all border border-gray-600 rounded-md p-2 mx-4 "
            onChange={(e) => {
              setCollectionName(e.target.value);
            }}
          />

        </div>
        <div className="flex flex-col justify-center items-center ">
          <h3 className='text-xl font-semibold text-gray-700 my-2'> Koleksiyon Açıklaması </h3>
          <input
            type="text"
            placeholder="Koleksiyon Açıklaması"
            value={collectionDescription}
            className="hover:scale-105 transition-all border border-gray-600 rounded-md p-2 mx-4 "
            onChange={(e) => {
              setCollectionDescription(e.target.value);
            }}
          />

        </div>
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-xl font-semibold text-gray-700 my-2'> Koleksiyon Tipi </h3>
          <div className='flex lg:flex-row gap-4 flex-col'>
            <div className="flex flex-col justify-center items-center ">
                
                {/* (Koleksiyon Tipi Seç - yok-2 - yok-3) seçme yapısı aşağıadadır. */}
                <select 
                  onChange={(e) => {!addTypeEnabled && setCollectionType(e.target.value)}}
                  type="select"
                  disabled={addTypeEnabled ? true : false}
                  value={!addTypeEnabled ? collectionType : ""}
                  id={`collectionType`}
                  name={`collectionType`}              
                  className="h-10 hover:scale-105 transition-all cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  
                  <option value="">Koleksiyon Tipi Seç</option>
                  {
                    collectionTypes && collectionTypes.length > 0 && collectionTypes.map((item, index) => (
                    // collectionType içi boş olanları eklemiyoruz.
                    item.collectionType != "" && item.collectionType &&

                    // aynı değere sahip olanlardan sadece birini ekliyoruz.
                    !collectionTypes.slice(0, index).some((item2) => item2.collectionType === item.collectionType) &&

                    <option key={index} value={item.collectionType}>{item.collectionType}</option>
                                            
                    ))
                  }
                </select>
              </div>             
              <div className='flex flex-col justify-center items-center'>
                <div className={`flex justify-center items-center gap-2 flex-col lg:flex-row`}>
                  <button
                    type='button'
                    onClick={ () => {setAddTypeEnabled(!addTypeEnabled)}}
                  >
                    {
                    addTypeEnabled ?
                    <div 
                    onClick={() => {setCollectionType("")}}
                    className='hover:scale-105 transition-all p-2 bg-red-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                      <IoCloseOutline size={20}/> <h4 className='whitespace-nowrap'>İptal</h4>
                    </div>
                    :
                    <div className='hover:scale-105 transition-all p-2 bg-green-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                      <IoAddOutline size={20}/> <h4 className='whitespace-nowrap'>Koleksiyon Tipi Ekle</h4>
                    </div>
                    }                    
                  </button>
                                    
                  <div className={`${addTypeEnabled ? "block" : "hidden"}`}>
                    <input
                      onChange={(e) => {addTypeEnabled && setCollectionType(e.target.value)}}
                      id={`collectionType`}
                      name={`collectionType`}
                      value={collectionType}
                      className={`hover:scale-105 transition-all border border-gray-600 rounded-md p-2 mx-4 `}
                      type="text"
                      placeholder="Yeni Koleksiyon Tipi Adı Giriniz."
                    />
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="flex flex-col justify-end items-center hover:scale-110 transition-all hover:cursor-pointer"
        onClick={()=>setLanguageIsEnabled(!languageIsEnabled)}>
          <Image src="/translate.svg" width={40} height={40} alt="image"/>
        </div>

        {languageIsEnabled && (
          <div className=" cursor-default fixed min-h-screen w-full h-full  lg:h-screen z-50 left-0 top-0 bg-black bg-opacity-90">
            <div className="relative top-2 left-0 w-screen h-screen z-20 flex lg:justify-center lg:items-center justify-center items-start">
              <div className="p-2 bg-white rounded-lg relative lg:pt-2 w-full lg:w-auto lg:mt-10 scale-90 lg:scale-100">

                {/* çeviri kapatma iconu */}
                <div>
                {collectionNameTR || collectionTypeTR || collectionCategoryTR || collectionDescriptionTR   ?
                  <div className="w-full flex justify-center items-center relative"
                    onClick={() => setLanguageIsEnabled(false)} 
                  >
                    <div className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all lg:absolute bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center">

                      <IoCheckmarkDoneSharp color="white" size={40} />

                    </div>
                  </div>
                 :
                  <div className="w-full flex justify-center items-center relative"
                    onClick={() => setLanguageIsEnabled(false)} 
                  >
                    <div className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center">
                      <IoClose color="white" size={40} />
                    </div>
                  </div>
                }
                </div>


                {/* çeviri başlığı */}
                <div>
                  {(collectionName || collectionType || collectionDescription) &&
                    <h2 className="text-center w-full m-2">
                      Girilen Orjinal Değer
                    </h2>
                  }
                                          
                  <div className="flex flex-col gap-2 md:gap-2 justify-center items-center w-full ">
                                              
                    {collectionName && collectionName.trim().length > 0 && (
                      <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                        <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Koleksiyon Adı :</h3>
                          {collectionName}
                      </div>
                    )}
                    {
                      collectionDescription && collectionDescription.trim().length > 0 && (
                        <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                        <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Koleksiyon Açıklaması :</h3>
                          {collectionDescription}
                      </div>
                      )
                    }
                    {collectionType && collectionType.trim().length > 0 && (
                      <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                        <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Koleksiyon Tipi :</h3>
                        {collectionType}
                      </div>
                    )}
                  </div>
                </div>

                {/* çeviri inputları */}

                {/* Türkçe çeviri alanı */}
                <div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                      className="hover:scale-105 transition-all"
                      src="/tr_flag.svg"
                      height={40}
                      width={40}
                      alt="TrFlag"
                    />

                    <input
                      onChange={(e) =>  setCollectionNameTR(e.target.value)}
                      id={`CollectionNameTR`}
                      name={`CollectionNameTR`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {collectionNameTR}
                      placeholder="Koleksiyon Adı Türkçe"
                    />
                  </div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                        className="hover:scale-105 transition-all"
                        src="/tr_flag.svg"
                        height={40}
                        width={40}
                        alt="TrFlag"
                      />

                      <input
                        onChange={(e) =>  setCollectionDescriptionTR(e.target.value)}
                        id={`collectionDescriptionTR`}
                        name={`collectionDescriptionTR`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionDescriptionTR}
                        placeholder="Koleksiyon Açıklaması Türkçe"
                      />
                  </div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                      className="hover:scale-105 transition-all"
                      src="/tr_flag.svg"
                      height={40}
                      width={40}
                      alt="TrFlag"
                    />
                    <input
                      onChange={(e) =>  setCollectionTypeTR(e.target.value)}
                      id={`collectionTypeTR`}
                      name={`collectionTypeTR`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {collectionTypeTR}
                      placeholder="Koleksiyon Tipi Türkçe"
                    />
                  </div>
                </div>

                {/* Ukraynaca çeviri alanı */}
                <div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                      className="hover:scale-105 transition-all"
                      src="/ua_flag.svg"
                      height={40}
                      width={40}
                      alt="TrFlag"
                    />

                    <input
                      onChange={(e) => setCollectionNameUA(e.target.value)}
                      id={`CollectionNameUA`}
                      name={`CollectionNameUA`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {collectionNameUA}
                      placeholder="Koleksiyon Adı Ukraynaca"
                    />
                  </div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                        className="hover:scale-105 transition-all"
                        src="/ua_flag.svg"
                        height={40}
                        width={40}
                        alt="TrFlag"
                      />

                      <input
                        onChange={(e) =>  setCollectionDescriptionUA(e.target.value)}
                        id={`collectionDescriptionUA`}
                        name={`collectionDescriptionUA`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionDescriptionUA}
                        placeholder="Koleksiyon Açıklaması Ukraynaca"
                      />
                  </div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                      className="hover:scale-105 transition-all"
                      src="/ua_flag.svg"
                      height={40}
                      width={40}
                      alt="TrFlag"
                    />
                    <input
                      onChange={(e) => setCollectionTypeUA(e.target.value)}
                      id={`collectionTypeUA`}
                      name={`collectionTypeUA`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {collectionTypeUA}
                      placeholder="Koleksiyon Tipi Ukraynaca"
                    />
                  </div>
                </div>

                {/* İngilizce çeviri alanı */}
                <div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                      className="hover:scale-105 transition-all"
                      src="/en_flag.svg"
                      height={40}
                      width={40}
                      alt="TrFlag"
                    />

                    <input
                      onChange={(e) => setCollectionNameEN(e.target.value)}
                      id={`CollectionNameEN`}
                      name={`CollectionNameEN`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {collectionNameEN}
                      placeholder="Koleksiyon Adı İngilizce"
                    />
                  </div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                        className="hover:scale-105 transition-all"
                        src="/en_flag.svg"
                        height={40}
                        width={40}
                        alt="TrFlag"
                      />

                      <input
                        onChange={(e) =>  setCollectionDescriptionEN(e.target.value)}
                        id={`collectionDescriptionEN`}
                        name={`collectionDescriptionEN`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionDescriptionEN}
                        placeholder="Koleksiyon Açıklaması İngilizce"
                      />
                  </div>
                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                    <Image
                      className="hover:scale-105 transition-all"
                      src="/en_flag.svg"
                      height={40}
                      width={40}
                      alt="TrFlag"
                    />
                    <input
                      onChange={(e) => setCollectionTypeEN(e.target.value)}
                      id={`collectionTypeEN`}
                      name={`collectionTypeEN`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {collectionTypeEN}
                      placeholder="Koleksiyon Tipi İngilizce"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}


      </div>

      {true  &&
      <div className='bg-gray-900 p-2 rounded inline-block'>
        
        <h3 className='text-white text-xl'>
          Toplam seçilen Ürün : <span className={`${ chooseProducts.length ? "text-green-600" : "text-red-600"} font-bold text-xl`}> {chooseProducts.length} </span> 
        </h3>
      </div>
      }
    </div>
  )
}

export default CreateCollection;
