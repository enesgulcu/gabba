"use client"
import React from 'react'
import {postAPI, getAPI} from '@/services/fetchAPI';
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import Image from 'next/image';
import LoadingScreen from '@/components/other/loading';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState , useEffect} from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline } from "react-icons/io5";
//import ListComponent from '@/components/createProduct/fabricsComponent/listComponent'
import FabricsValidationSchema from './formikData';
//import EditComponent from '@/components/createProduct/fabricsComponent/editComponent';

 const FabricsComponent = () => {

  const initialValues = {
    fabrics: [
      {
        fabricType: "",
        fabricDescription: "",
        fabricSwatch: "yok",
        
        translateEnabled: false,
        addSwatchEnabled: false,

        fabricTypeTurkish: "",
        fabricTypeUkrainian: "",
        fabricTypeEnglish: "",

        fabricDescriptionTurkish: "",
        fabricDescriptionUkrainian: "",
        fabricDescriptionEnglish: "",

        fabricSwatchTurkish:"",
        fabricSwatchUkrainian:"",
        fabricSwatchEnglish:"",
      },
    ],
  };

  const getData = async () => {
    // try {
    //   setIsloading(true);
    //   const response = await getAPI('/createProduct/fabrics');

    //   if(!response){
    //     throw new Error("Veri çekilemedi 2");
    //   }

    //   if(response.status !== "success"){
    //     throw new Error("Veri çekilemedi 3");
    //   }
    //   setNewData(response.data);
    //   setIsloading(false);

    // } catch (error) {
    //   setIsloading(false);

    //   toast.error(error.message);
    //   console.log(error);
    // }
  }
  
  const [isloading, setIsloading] = useState(false);
  const [NewData , setNewData] = useState("");
  const [isUpdateActive, setIsUpdateActive] = useState(false);
  const [updateData , setUpdateData] = useState("");


  useEffect(() => {
    getData();
  }, [])
  

  useEffect(() => {
    // "updateData" state'i değiştiğinde çalışır.
    if(updateData){
      setIsUpdateActive(true);
    }
    else{
      setIsUpdateActive(false);
    }
    getData();
  }, [updateData])


  const keyMappings = {
    fabricType: "Kumaş Tipi",
    fabricDescription: "Ek Açıklama",
    fabricSwatch: "Kartela",
    turkish: "Türkçe",
    ukrainian: "Ukraynaca",
    english: "İngilizce",
  };
  

  const filteredData = Object.keys(updateData).reduce((acc, key) => {
    if (
      updateData[key] !== "" &&
      updateData[key] !== null &&
      updateData[key] !== false &&
      keyMappings[key]
    ) {
      acc[key] = updateData[key];
    }
    return acc;
  }, {});

  return (
    <>
  
      {isloading && <LoadingScreen isloading={isloading} />}
    
    
      {/* // UPDATE EKRANI Aşağıdadır */}
      {isUpdateActive && updateData && (
        <div className=" cursor-default w-screen absolute bg-black bg-opacity-90 z-50 py-4 min-h-screen">
          <div className="flex-col w-full h-full flex justify-center items-center">
            <div className='w-auto p-2 flex justify-center items-center flex-col font-bold'>
              
            
            {/* // UPDATE EKRANI VERİ BİLGİSİ Aşağıdadır*/}
              <div className="container mx-auto px-4 py-2 sm:px-6 md:px-8">
                <div className="bg-white overflow-hidden shadow-md rounded-lg">
                
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                      Eski Veri
                    </h3>
                    <div className="mt-5 flex flex-row flex-wrap justify-center items-center gap-4">
                      {Object.keys(filteredData).map((key) => (
                        <div
                          key={key}
                          className={`bg-gray-100 px-4 py-2 rounded-lg ${
                            filteredData[key] === true ? "seçili" : ""
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-500">
                            {keyMappings[key]}
                          </p>
                          <p className="mt-1 text-sm text-gray-900">{
                          filteredData[key].toString() === "true" ? "Aktif" : filteredData[key].toString() === "false" ? "Pasif" : filteredData[key]
                          }</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            {/* // UPDATE EKRANI VERİ BİLGİSİ Yukarıdadır*/}

  
            </div>
            <div className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
            onClick={()=>{setUpdateData("");}}
            >
            <IoClose color="white" size={40} />
            </div>

            {/* <EditComponent updateData={updateData} setUpdateData={setUpdateData}/> */}

          </div>
        </div>
      )}
      {/* // UPDATE EKRANI Yukarıdadır */}


      <div
        className={`w-full ${
          isloading ? " blur max-h-screen overflow-hidden" : " blur-none"
        } ${isUpdateActive && "blur-sm max-h-screen overflow-hidden"}`}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={FabricsValidationSchema}
          onSubmit={async (value) => {
            setIsloading(true);
            const responseData = await postAPI("/createProduct/fabrics",value);

            if (
              responseData.status !== "success" ||
              responseData.status == "error"
            ) {
              setIsloading(false);
              toast.error(responseData.error);
            } else {
              // veriyi çek ve state'e at
              getData();
              setIsloading(false);
              toast.success("Tüm Veriler Başarıyla Eklendi!");

              // form verilerini sıfırla.
              value.fabrics = [
                {
                  fabricType: "",
                  fabricDescription: "",
                  fabricSwatch: "yok",
                  
                  translateEnabled: false,

                  fabricTypeTurkish: "",
                  fabricTypeUkrainian: "",
                  fabricTypeEnglish: "",

                  fabricDescriptionTurkish: "",
                  fabricDescriptionUkrainian: "",
                  fabricDescriptionEnglish: "",

                  fabricSwatchTurkish:"",
                  fabricSwatchUkrainian:"",
                  fabricSwatchEnglish:"",
                },
              ];

              // arayüzdeki input içindeki değerleri sil ve sıfırla.
              document.getElementById(`fabrics[${0}].fabricType`).value ="";
              document.getElementById(`fabrics[${0}].fabricDescription`).value ="";
              document.getElementById(`fabrics[${0}].fabricSwatch`).value ="yok";
              document.getElementById(`fabrics[${0}].fabricTypeTurkish`).value ="";
              document.getElementById(`fabrics[${0}].fabricTypeUkrainian`).value ="";
              document.getElementById(`fabrics[${0}].fabricTypeEnglish`).value ="";
              document.getElementById(`fabrics[${0}].fabricDescriptionTurkish`).value ="";
              document.getElementById(`fabrics[${0}].fabricDescriptionUkrainian`).value ="";
              document.getElementById(`fabrics[${0}].fabricDescriptionEnglish`).value ="";
              document.getElementById(`fabrics[${0}].fabricSwatchTurkish`).value ="";
              document.getElementById(`fabrics[${0}].fabricSwatchUkrainian`).value ="";
              document.getElementById(`fabrics[${0}].fabricSwatchEnglish`).value ="";
              
            }
          }}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <FieldArray name="fabrics">
                {({ insert, push, remove }) => (
                  <div>
                    <div>
                      {props.values.fabrics.map((measurement, index) => (
                        <div key={index}
                          className={` lg:px-10 hover:bg-yellow-400 py-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-between justify-center item-center xl:items-start gap-4 ${
                            index % 2 ? "bg-white" : "bg-gray-100"
                          }`}
                        >
                          {/* Kumaş kaldırma butonu aşağıdadır. */}
                          <div className="flex justify-center items-center gap-4">
                            <button
                              className="hover:scale-110 hover:rotate-6 transition-all"
                              type="button"
                              onClick={() => {
                                if (props.values.fabrics.length > 1) {
                                  // burada Kumaş birimini sileceğiz.
                                  const newPropsValues =
                                    props.values.fabrics.filter(
                                      // tıklanan değeri sil diğerlerini listelemeye deva met demektir...
                                      (item, i) => i !== index
                                    );
                                  props.setFieldValue(
                                    "fabrics",
                                    newPropsValues
                                  );
                                }
                              }}
                            >
                              <p className="bg-red-600 text-white p-2 rounded-md">
                                {" "}
                                <MdOutlineCancel size={25} />{" "}
                              </p>
                            </button>

                            <label
                              htmlFor={`measure-${index}`}
                              className="whitespace-nowrap font-semibold flex justify-center items-center"
                            >
                              <div className="flex justify-start items-center flex-row gap-2">
                                  <span className="flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white">
                                    {`${index + 1}`}
                                  </span>{" "}
                                  - Kumaş Ekle
                                </div>
                            </label>
                          </div>
                          {/* Kumaş kaldırma butonu yukarıdadır. */}



                          {/* fabricType - fabricDescription inputları aşağıdadır. */}
                          <div className=" flex flex-col lg:flex-row flex-wrap lg:flex-nowrap gap-4 justify-center item-center lg:items-start">
                            {/* fabricDescription input aşağıdadır.*/}
                            <div className="flex flex-col justify-center items-center ">
                              <Field
                                onChange={props.handleChange}
                                id={`fabrics[${index}].fabricType`}
                                name={`fabrics[${index}].fabricType`}
                                value={props.values.fabrics[index].fabricType}
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
                                type="text"
                                placeholder="Kumaş tipini giriniz."
                              />

                              <ErrorMessage
                                name={`fabrics[${index}].fabricType`}
                                component="div"
                                className="field-error text-red-600 m-1"
                              />
                            </div>
                            <div className="flex flex-col justify-center items-center ">
                              <Field
                                onChange={props.handleChange}
                                id={`fabrics[${index}].fabricDescription`}
                                name={`fabrics[${index}].fabricDescription`}
                                value={props.values.fabrics[index].fabricDescription}
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
                                type="text"
                                placeholder="Kumaş açıklamasını giriniz."
                              />

                              <ErrorMessage
                                name={`fabrics[${index}].fabricDescription`}
                                component="div"
                                className="field-error text-red-600 m-1"
                              />
                            </div>
                            <div className="flex flex-col justify-center items-center ">
                              {/* (Kartela Seç - yok-2 - yok-3) seçme yapısı aşağıadadır. */}
                              <Field
                                as="select"
                                defaultValue="yok"
                                value={props.values.fabricSwatch}
                                onChange={props.handleChange}
                                id={`fabrics[${index}].fabricSwatch`}
                                name={`fabrics[${index}].fabricSwatch`}
                                
                                className="h-10 hover:scale-105 transition-all cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="Kartela Seç-1">Kartela Seç</option>
                                <option value="yok-2">yok-2</option>
                                <option value="yok-3">yok-3</option>
                              </Field>
                            </div>

                            <div className='flex flex-col justify-center items-center'>
                            <div className={`flex justify-center items-center gap-2 flex-col lg:flex-row`}>
                              <h3 className='lg:mr-2'>Veya</h3>
                              <button className='p-2 bg-green-600 text-white rounded-md flex flex-row justify-center items-center gap-2'
                              onClick={ () => {
                                  props.setFieldValue(`fabrics[${index}].addSwatchEnabled`, !props.values.fabrics[index].addSwatchEnabled)
                                  console.log(props.values.fabrics[index].addSwatchEnabled)
                              }
                              }
                              >
                                <IoAddOutline size={20}/> <h4 className='whitespace-nowrap'>Kartela Ekle</h4>
                              </button>

                              <div className={`${props.values.fabrics[index].addSwatchEnabled ? "block" : "hidden"}`}>
                                <Field
                                    onChange={props.handleChange}
                                    id={`fabrics[${index}].fabricSwatch`}
                                    name={`fabrics[${index}].fabricSwatch`}
                                    value=""
                                    className={`hover:scale-105 transition-all border border-green-600 rounded-md p-2 w-[250px]`}
                                    type="text"
                                    placeholder="Yeni Kartela Adı Giriniz."
                                />
                              </div>
                            </div>
                            <p className={`${props.values.fabrics[index].addSwatchEnabled ? "block" : "hidden"} text-white w-full text-center text-sm p-1 bg-gray-700 rounded-md m-2`}>Kaydı tamamladıktan sonra kartela bilgisi sisteme kayıt edilecektir.</p>
                            </div>
                            

                          </div>
                          {/* fabricDescription - fabric Description inputları yukarıdadır. */}


                            {/* ÇEVİRİ eklendiği bölüm aşağıdadır */}
                          <div className="flex flex-row flex-wrap justify-center xl:justify-around gap-2 items-center cursor-pointer">
                          <div className="flex justify-center items-center gap-2 max-w-[%90]">
                                <div className="flex justify-center items-center flex-row gap-2">
                                  {
                                    <div className="flex justify-center items-center flex-row gap-2 rounded-lg">
                                      {props.values.fabrics[index].fabricTypeTurkish != "" && props.values.fabrics[index].fabricTypeTurkish && (
                                        <Image
                                          className="cursor-default rounded-full"
                                          src="/tr_flag.svg"
                                          height={25}
                                          width={25}
                                          alt="TrFlag"
                                        />
                                      )}
                                      {props.values.fabrics[index].fabricTypeUkrainian != "" && props.values.fabrics[index].fabricTypeUkrainian && (
                                        <Image
                                          className="cursor-default rounded-full"
                                          src="/ua_flag.svg"
                                          height={25}
                                          width={25}
                                          alt="TrFlag"
                                        />
                                      )}
                                      {props.values.fabrics[index].fabricTypeEnglish != "" && props.values.fabrics[index].fabricTypeEnglish && (
                                        <Image
                                          className="cursor-default rounded-full"
                                          src="/en_flag.svg"
                                          height={25}
                                          width={25}
                                          alt="TrFlag"
                                        />
                                      )}
                                    </div>
                                  }

                                  <Image
                                    onClick={() => {
                                      props.setFieldValue(
                                        `fabrics[${index}].translateEnabled`,
                                        true
                                      );
                                    }}
                                    className="hover:scale-105 transition-all cursor-pointer"
                                    src="/translate.svg"
                                    height={30}
                                    width={40}
                                    alt="TrFlag"
                                  />
                                </div>

                                {props.values.fabrics[index].translateEnabled && (
                                  <div className=" cursor-default absolute w-screen h-[1600px] lg:h-screen z-10 left-0 top-0 bg-black bg-opacity-90">
                                    <div className="relative top-0 left-0 w-screen h-screen z-20 flex justify-center items-center">
                                      <div className="p-2 bg-white rounded-lg relative pt-10 lg:pt-2">

                                        {props.values.fabrics[index].fabricTypeTurkish == "" &&
                                        props.values.fabrics[index].fabricTypeUkrainian == "" &&
                                        props.values.fabrics[index].fabricTypeEnglish == "" &&
                                        props.values.fabrics[index].fabricDescriptionTurkish == "" &&
                                        props.values.fabrics[index].fabricDescriptionUkrainian == "" &&
                                        props.values.fabrics[index].fabricDescriptionEnglish == "" &&
                                        props.values.fabrics[index].fabricSwatchTurkish == "" &&
                                        props.values.fabrics[index].fabricSwatchUkrainian == "" &&
                                        props.values.fabrics[index].fabricSwatchEnglish == "" ? (

                                          <div className="w-full flex justify-center items-center relative">
                                            <div
                                              onClick={() => {
                                                props.setFieldValue(
                                                  `fabrics[${index}].translateEnabled`,
                                                  false
                                                );
                                              }}
                                              className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center"
                                            >
                                              <IoClose
                                                color="white"
                                                size={40}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-full flex justify-center items-center relative">
                                            <div
                                              onClick={() => {
                                                props.setFieldValue(
                                                  `fabrics[${index}].translateEnabled`,
                                                  false
                                                );
                                              }}
                                              className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center"
                                            >
                                              <IoCheckmarkDoneSharp
                                                color="white"
                                                size={40}
                                              />
                                            </div>
                                          </div>
                                        )}

                                        
                                          <h2 className="text-xl font-semibold p-2 bg-blue-600 text-white rounded-lg w-full text-center">
                                            {`${index + 1}`} - Kumaş Ekle (Çeviri İşlemleri)
                                          </h2>
                                          <h2 className="text-center w-full m-2">
                                              Girilen Orjinal Değer
                                            </h2>
                                          <div className="flex flex-col gap-2 md:gap-2 justify-center items-center ">
                                            
                                            {props.values.fabrics[index].fabricType && (
                                              <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                                                <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Kumaş Tipi :</h3>
                                                {props.values.fabrics[index].fabricType}
                                              </div>
                                            )}
                                            {props.values.fabrics[index].fabricDescription && (
                                              <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                                                <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Açıklama :</h3>
                                                {props.values.fabrics[index].fabricDescription}
                                              </div>
                                            )}
                                            {props.values.fabrics[index].fabricSwatch && (
                                              <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                                                <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Kartela Adı :</h3>
                                                {props.values.fabrics[index].fabricSwatch}
                                              </div>
                                            )}
                                            </div>
                                            {/* Türkçe çeviri alanı */}
                                            <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                                              
                                                <Image
                                                  className="hover:scale-105 transition-all"
                                                  src="/tr_flag.svg"
                                                  height={40}
                                                  width={40}
                                                  alt="TrFlag"
                                                />

                                                <Field
                                                  onChange={props.handleChange}
                                                  id={`fabrics[${index}].fabricTypeTurkish`}
                                                  name={`fabrics[${index}].fabricTypeTurkish`}
                                                  value={ props.values.fabrics[index].fabricTypeTurkish }
                                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                  type="text"
                                                  placeholder="Kumaş Tipi Türkçe"
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

                                                <Field
                                                  onChange={props.handleChange}
                                                  id={`fabrics[${index}].fabricDescriptionTurkish`}
                                                  name={`fabrics[${index}].fabricDescriptionTurkish`}
                                                  value={ props.values.fabrics[index].fabricDescriptionTurkish }
                                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                  type="text"
                                                  placeholder="Açıklama Türkçe"
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
                                                <Field
                                                  onChange={props.handleChange}
                                                  id={`fabrics[${index}].fabricSwatchTurkish`}
                                                  name={`fabrics[${index}].fabricSwatchTurkish`}
                                                  value={ props.values.fabrics[index].fabricSwatchTurkish }
                                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                  type="text"
                                                  placeholder="Kartela Adı Türkçe"
                                                />
                                            </div>

                                            {/* Ukrayna çeviri alanı */}
                                            <div className="bg-gray-100 pl-1 rounded-t w-full flex justify-center item-center flex-row flex-nowrap gap-2">
                                              <Image
                                                className="hover:scale-105 transition-all"
                                                src="/ua_flag.svg"
                                                height={40}
                                                width={40}
                                                alt="TrFlag"
                                              />

                                              <Field
                                                onChange={props.handleChange}
                                                id={`fabrics[${index}].fabricTypeUkrainian`}
                                                name={`fabrics[${index}].fabricTypeUkrainian`}
                                                value={ props.values.fabrics[index].fabricTypeUkrainian }
                                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                type="text"
                                                placeholder="Kumaş Tipi Ukraynaca"
                                              />
                                              </div>
                                              <div className="bg-gray-100 pl-1 w-full flex justify-center item-center flex-row flex-nowrap gap-2">
                                              <Image
                                                className="hover:scale-105 transition-all"
                                                src="/ua_flag.svg"
                                                height={40}
                                                width={40}
                                                alt="TrFlag"
                                              />
                                              <Field
                                                onChange={props.handleChange}
                                                id={`fabrics[${index}].fabricDescriptionUkrainian`}
                                                name={`fabrics[${index}].fabricDescriptionUkrainian`}
                                                value={ props.values.fabrics[index].fabricDescriptionUkrainian }
                                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                type="text"
                                                placeholder="Açıklama Ukraynaca"
                                              />
                                            </div>
                                            <div className="bg-gray-100 rounded-b pl-1 w-full flex justify-center item-center flex-row flex-nowrap gap-2">
                                              <Image
                                                className="hover:scale-105 transition-all"
                                                src="/ua_flag.svg"
                                                height={40}
                                                width={40}
                                                alt="TrFlag"
                                              />
                                              <Field
                                                onChange={props.handleChange}
                                                id={`fabrics[${index}].fabricSwatchUkrainian`}
                                                name={`fabrics[${index}].fabricSwatchUkrainian`}
                                                value={ props.values.fabrics[index].fabricSwatchUkrainian }
                                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                type="text"
                                                placeholder="Kartela Adı Ukraynaca"
                                              />
                                            </div>



                                            {/* English çeviri alanı */}
                                            <div className="w-full pl-1 flex justify-center item-center flex-row flex-nowrap gap-2">
                                              <Image
                                                className="hover:scale-105 transition-all"
                                                src="/en_flag.svg"
                                                height={40}
                                                width={40}
                                                alt="TrFlag"
                                              />

                                              <Field
                                                onChange={props.handleChange}
                                                id={`fabrics[${index}].fabricTypeEnglish`}
                                                name={`fabrics[${index}].fabricTypeEnglish`}
                                                value={ props.values.fabrics[index].fabricTypeEnglish }
                                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                type="text"
                                                placeholder="Kumaş Tipi İngilizce"
                                              />
                                            </div>

                                            <div className="w-full pl-1 flex justify-center item-center flex-row flex-nowrap gap-2">
                                              <Image
                                                className="hover:scale-105 transition-all"
                                                src="/en_flag.svg"
                                                height={40}
                                                width={40}
                                                alt="TrFlag"
                                              />
                                              <Field
                                                onChange={props.handleChange}
                                                id={`fabrics[${index}].fabricDescriptionEnglish`}
                                                name={`fabrics[${index}].fabricDescriptionEnglish`}
                                                value={ props.values.fabrics[index].fabricDescriptionEnglish }
                                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                type="text"
                                                placeholder="Açıklama İngilizce"
                                              />
                                            </div>

                                            <div className="w-full pl-1 flex justify-center item-center flex-row flex-nowrap gap-2">
                                              <Image
                                                className="hover:scale-105 transition-all"
                                                src="/en_flag.svg"
                                                height={40}
                                                width={40}
                                                alt="TrFlag"
                                              />
                                              <Field
                                                onChange={props.handleChange}
                                                id={`fabrics[${index}].fabricSwatchEnglish`}
                                                name={`fabrics[${index}].fabricSwatchEnglish`}
                                                value={ props.values.fabrics[index].fabricSwatchEnglish }
                                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                                type="text"
                                                placeholder="Kartela Adı İngilizce"
                                              />
                                          </div>

                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                          </div>
                            {/* ÇEVİRİ eklendiği bölüm yukarıdadır */}

                        </div>
                      ))}
                    </div>

                    <div className="w-full flex justify-center items-center gap-6 my-6 ">
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            fabricType: "",
                            fabricDescription: "",
                            fabricSwatch: "yok",
                            turkish: "",
                            ukrainian: "",
                            english: "",
                          })
                        }
                        className="px-3 py-2 rounded-md bg-blue-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg"
                      >
                        Yeni Kumaş Ekle
                      </button>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-green-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg"
                      >
                        Gönder
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
        <div className="w-full mt-6 flex-row flex-wrap justify-center items-center">
          {/* verileri aşağıdakicomponent içerisinde listeleriz. */}
          <div className="w-full border-t-4 border-gray-700">
            {/* <ListComponent NewData={NewData} setUpdateData={setUpdateData} /> */}
          </div>
        </div>
      </div>
      
    </>
  );
}

export default FabricsComponent;
