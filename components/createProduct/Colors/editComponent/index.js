"use client"

import React from 'react'
import {postAPI} from '@/services/fetchAPI';
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import Image from 'next/image';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IoClose, IoCheckmarkDoneSharp } from "react-icons/io5";
import ColorsValidationSchema from './formikData';


 const EditComponent = ({updateData, setUpdateData, isloading, setIsloading}) => {



  
  const initialValues = {
    colors: [
      updateData ||
      {
        colourType: "",
        colourDescription: "",
        
        translateEnabled: false,

        colourTypeTurkish: "",
        colourTypeUkrainian: "",
        colourTypeEnglish: "",

        colourDescriptionTurkish: "",
        colourDescriptionUkrainian: "",
        colourDescriptionEnglish: "",
      },
    ],
  };

    

  const index = 0;


  return (
    <div className='w-full'>
      <div className={`w-full ${isloading ? " blur max-h-screen overflow-hidden" : " blur-none"}`}>
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
          validationSchema={ColorsValidationSchema}
          onSubmit={async (value) => {
            setIsloading(true);
            const responseData = await postAPI("/createProduct/colors",{data:value, processType:"update"});
            if (
              responseData.status !== "success" ||
              responseData.status == "error"
            ) {
              setIsloading(false);
              toast.error(responseData.error);
            } else {
              setIsloading(false);
              toast.success("Tüm Veriler Başarıyla Güncellendi!");
              setUpdateData("");

              // form verilerini sıfırla.
              value.colors = [
                {
                  colourType: "",
                  colourDescription: "",
                  
                  translateEnabled: false,
          
                  colourTypeTurkish: "",
                  colourTypeUkrainian: "",
                  colourTypeEnglish: "",
          
                  colourDescriptionTurkish: "",
                  colourDescriptionUkrainian: "",
                  colourDescriptionEnglish: "",
                },
                
              ];
              

              // arayüzdeki input içindeki değerleri sil ve sıfırla.
              document.getElementById(`colors[${0}].colourType`).value ="";
              document.getElementById(`colors[${0}].colourDescription`).value ="";
              document.getElementById(`colors[${0}].colourTypeTurkish`).value ="";
              document.getElementById(`colors[${0}].colourTypeUkrainian`).value ="";
              document.getElementById(`colors[${0}].colourTypeEnglish`).value ="";
              document.getElementById(`colors[${0}].colourDescriptionTurkish`).value ="";
              document.getElementById(`colors[${0}].colourDescriptionUkrainian`).value ="";
              document.getElementById(`colors[${0}].colourDescriptionEnglish`).value ="";
              
            }
          }}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <FieldArray name="colors">
                {({ insert, push, remove }) => (
                  <div>
                    <div>
                      {props.values.colors.map((colour, index) => (
                        <div key={index}
                          className={` lg:px-4 hover:bg-yellow-400 py-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-center justify-center item-center xl:items-center gap-4 ${
                            index % 2 ? "bg-white" : "bg-gray-100"
                          }`}
                        >

                          {/* colourType - colourDescription inputları aşağıdadır. */}
                          <div className=" flex flex-col gap-4 justify-center item-center">
                            <div className='flex flex-col lg:flex-row flex-wrap gap-4 justify-center item-center '>
                              {/* colourDescription input aşağıdadır.*/}
                              <div className="flex flex-col justify-center items-center ">
                                <h3>Renk tipini giriniz.</h3>
                                <Field
                                  onChange={props.handleChange}
                                  id={`colors[${index}].colourType`}
                                  name={`colors[${index}].colourType`}
                                  value={props.values.colors[index].colourType}
                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full lg:w-[200px]`}
                                  type="text"
                                  placeholder="Renk tipini giriniz."
                                />

                                <ErrorMessage
                                  name={`colors[${index}].colourType`}
                                  component="div"
                                  className="field-error text-red-600 m-1"
                                />
                              </div>
                              <div className="flex flex-col justify-center items-center ">
                                <h3>Renk açıklamasını giriniz.</h3>
                                <Field
                                  onChange={props.handleChange}
                                  id={`colors[${index}].colourDescription`}
                                  name={`colors[${index}].colourDescription`}
                                  value={props.values.colors[index].colourDescription}
                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full lg:w-[200px]`}
                                  type="text"
                                  placeholder="Renk açıklamasını giriniz."
                                />

                                <ErrorMessage
                                  name={`colors[${index}].colourDescription`}
                                  component="div"
                                  className="field-error text-red-600 m-1"
                                />
                              </div>

                              <div className="flex justify-center items-center flex-row gap-2">
                                    {
                                      <div className="flex justify-center items-center flex-row gap-2 rounded-lg">
                                        {props.values.colors[index].colourTypeTurkish != "" && props.values.colors[index].colourTypeTurkish && (
                                          <Image
                                            className="cursor-default rounded-full"
                                            src="/tr_flag.svg"
                                            height={25}
                                            width={25}
                                            alt="TrFlag"
                                          />
                                        )}
                                        {props.values.colors[index].colourTypeUkrainian != "" && props.values.colors[index].colourTypeUkrainian && (
                                          <Image
                                            className="cursor-default rounded-full"
                                            src="/ua_flag.svg"
                                            height={25}
                                            width={25}
                                            alt="TrFlag"
                                          />
                                        )}
                                        {props.values.colors[index].colourTypeEnglish != "" && props.values.colors[index].colourTypeEnglish && (
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
                                          `colors[${index}].translateEnabled`,
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
                            </div>

                            {/* translateEnabled true ise çeviri alanı açılır. */}
                            <div>
                            {props.values.colors[index].translateEnabled && (
                            <div className="p-2 bg-white rounded-lg relative pt-10 lg:pt-2">

                              {props.values.colors[index].colourTypeTurkish == "" &&
                              props.values.colors[index].colourTypeUkrainian == "" &&
                              props.values.colors[index].colourTypeEnglish == "" &&
                              props.values.colors[index].colourDescriptionTurkish == "" &&
                              props.values.colors[index].colourDescriptionUkrainian == "" &&
                              props.values.colors[index].colourDescriptionEnglish == "" ? (

                                <div
                                    onClick={() => {
                                      props.setFieldValue(
                                        `colors[${index}].translateEnabled`,
                                        false
                                      );
                                    }}
                                    className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center"
                                  >
                                    <IoClose
                                      color="white"
                                      size={40}
                                    />
                                  </div>
                              ) : (
                                <div className="w-full flex justify-center items-center">
                                  <div
                                    onClick={() => {
                                      props.setFieldValue(
                                        `colors[${index}].translateEnabled`,
                                        false
                                      );
                                    }}
                                    className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center"
                                  >
                                    <IoCheckmarkDoneSharp
                                      color="white"
                                      size={40}
                                    />
                                  </div>
                                </div>
                              )}


                                <h2 className="text-xl font-semibold p-2 bg-blue-600 text-white rounded-lg w-full text-center">
                                  {`${index + 1}`} - Renk Ekle (Çeviri İşlemleri)
                                </h2>
                                <h2 className="text-center w-full m-2">
                                    Girilen Orjinal Değer
                                  </h2>
                                <div className="flex flex-col gap-2 md:gap-2 justify-center items-center ">
                                  
                                  {props.values.colors[index].colourType && (
                                    <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                                      <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Renk Tipi :</h3>
                                      {props.values.colors[index].colourType}
                                    </div>
                                  )}
                                  {props.values.colors[index].colourDescription && (
                                    <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                                      <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Açıklama :</h3>
                                      {props.values.colors[index].colourDescription}
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
                                        id={`colors[${index}].colourTypeTurkish`}
                                        name={`colors[${index}].colourTypeTurkish`}
                                        value={ props.values.colors[index].colourTypeTurkish }
                                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                        type="text"
                                        placeholder="Renk Tipi Türkçe"
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
                                        id={`colors[${index}].colourDescriptionTurkish`}
                                        name={`colors[${index}].colourDescriptionTurkish`}
                                        value={ props.values.colors[index].colourDescriptionTurkish }
                                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                        type="text"
                                        placeholder="Açıklama Türkçe"
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
                                      id={`colors[${index}].colourTypeUkrainian`}
                                      name={`colors[${index}].colourTypeUkrainian`}
                                      value={ props.values.colors[index].colourTypeUkrainian }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Renk Tipi Ukraynaca"
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
                                      id={`colors[${index}].colourDescriptionUkrainian`}
                                      name={`colors[${index}].colourDescriptionUkrainian`}
                                      value={ props.values.colors[index].colourDescriptionUkrainian }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Açıklama Ukraynaca"
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
                                      id={`colors[${index}].colourTypeEnglish`}
                                      name={`colors[${index}].colourTypeEnglish`}
                                      value={ props.values.colors[index].colourTypeEnglish }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Renk Tipi İngilizce"
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
                                      id={`colors[${index}].colourDescriptionEnglish`}
                                      name={`colors[${index}].colourDescriptionEnglish`}
                                      value={ props.values.colors[index].colourDescriptionEnglish }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Açıklama İngilizce"
                                    />
                                  </div>
                              </div>                           
                            )}
                            </div>            
                          </div>
                          
                          
                          
                          {/* colourDescription - colour Description inputları yukarıdadır. */}
                        </div>
                      ))}
                    </div>

                    <div className="w-full flex justify-center items-center gap-6 my-6 ">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-purple-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg"
                      >
                        Güncelle
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EditComponent;
