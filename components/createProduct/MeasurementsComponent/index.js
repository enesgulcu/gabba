"use client"
import React from 'react'
import {postAPI, getAPI} from '@/services/fetchAPI';
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import LoadingScreen from '@/components/other/loading';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState , useEffect} from 'react';
import { MdOutlineCancel } from "react-icons/md";
import Table from '@/components/table';
import MeasurementsValidationSchema from './formikData';

 const MeasurementsComponent = () => {

  // veri tabanından çekilen verilerin tutulacağı state.
  const [listData, setListData] = useState();  
  
  // veri tabanından verileri çekme işlemini yapan fonksiyon.
  const fetchData = async () => {
    const responseData = await getAPI("/createProduct/measurements");
    if (!responseData || responseData.status !== "success" || responseData.status == "error") {
      return "VERİ YOK!";
    } else {
      setListData(responseData.data);
    }
  }

  useEffect(() => {

    // didMount anında -> veri tabanından verileri çekme işlemini başlat.
    fetchData();

  }, [])
    

  const initialValues = {
    measurements: [
      {
        firstValue: "",
        secondValue: "",
        unit: "cm",
        oneRangeEnabled: false,
        twoRangeEnabled: true,
        manuelDefined: false,
        turkish: "",
        ukrainian: "",
        english: "",
      },
    ],
  };

  const [isloading, setIsloading] = useState(false);

  
  return (
    <>
      { isloading && (<LoadingScreen isloading={isloading}/>) }
      <div className='w-full'>
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

        validationSchema={MeasurementsValidationSchema}

        onSubmit={async (value) => {
          setIsloading(true);
            const responseData = await postAPI("/createProduct/measurements", value);
            if (responseData.status !== "success" || responseData.status == "error") {
              setIsloading(false);
              console.log(responseData.error);
              toast.success(responseData.error + " Bir Hata Oluştu!");
            } else {
              setIsloading(false);
              toast.success(" işlem başarılı!" + responseData.message && responseData.message);

              
            }
        }}
      >

        {(props) => (
          <Form onSubmit={props.handleSubmit}>
             <FieldArray name="measurements">
            {({insert, push, remove }) => (
              
                <div>
                  <div>
                    {props.values.measurements.map((measurement, index) => (
                      <div
                        key={index}
                        className={` lg:px-10 px-2 hover:bg-yellow-400 py-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-between justify-center gap-4 ${
                          index % 2 ? "bg-white" : "bg-gray-100"
                        }`}
                      >
                        
                        
                        <label
                          htmlFor={`measure-${index}`}
                          className="whitespace-nowrap font-semibold flex justify-center items-center"
                        >
                          {
                          props.values.measurements[index].oneRangeEnabled ? 
                          <div className='flex justify-start items-center flex-row gap-2'><span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${index + 1}`}</span> - Tek Ölçü Ekle</div>
                          : props.values.measurements[index].twoRangeEnabled ?
                          <div className='flex justify-start items-center flex-row gap-2'><span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${index + 1}`}</span> - Ölçü Aralığı Ekle</div>
                          :
                          <div className='flex justify-start items-center flex-row gap-2'><span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${index + 1}`}</span> - Özel Ölçü Ekle</div>
                          }
                          </label>

                        <div className=' flex flex-row flex-wrap lg:flex-nowrap gap-4 justify-center items-start'>
                          <div className='flex flex-col justify-center items-center'>    
                            <Field 
                              defaultValue={measurement.firstValue}
                              id={`measurements[${index}].firstValue`}
                              name={`measurements[${index}].firstValue`}
                              type={`${props.values.measurements[index].manuelDefined ? "text" : "number"}`}
                              className={`border border-gray-300 rounded-md p-2 `}
                              placeholder={`${
                                props.values.measurements[index].manuelDefined ? "örnek: Soldan Kapak Çıkar" : "örnek: 124"   
                              } `}
                              value={props.values.firstValue}
                              onChange={props.handleChange}
                            />
                            <ErrorMessage
                              name={`measurements[${index}].firstValue`}
                              component="div"
                              className="field-error text-red-600 m-1 font-bold"
                            />
                          </div> 
                          <div className={`flex flex-col justify-center items-center ${
                              props.values.measurements[index].twoRangeEnabled
                                ? "block"
                                : "hidden"
                            }`}>
                          <Field 
                            type="number"
                            placeholder="örnek: 238"
                            onChange={props.handleChange}
                            value={props.values.secondValue}
                            defaultValue={measurement.secondValue}
                            id={`measurements[${index}].secondValue`}
                            name={`measurements[${index}].secondValue`}
                            className={`border border-gray-300 rounded-md p-2`}

                          />
                          <ErrorMessage
                              name={`measurements[${index}].secondValue`}
                              component="div"
                              className="field-error text-red-600 m-1 font-bold"
                          />
                          </div>
                        </div>
                          <div className="flex flex-row flex-wrap justify-center xl:justify-around gap-4 items-center cursor-pointer">
                            
                            <Field 
                                as="select"
                                defaultValue="cm"
                                value={props.values.unit}
                                onChange={props.handleChange}
                                id={`measurements[${index}].unit`}
                                name={`measurements[${index}].unit`}
                                disabled={props.values.measurements[index].manuelDefined}
                                className={`${props.values.measurements[index].manuelDefined ? " opacity-30" : "block"} cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                              >
                                <option value="cm">cm</option>
                                <option value="mm">mm</option>
                                <option value="m">m</option>
                            </Field>
                            <ErrorMessage
                              name={`measurements[${index}].unit`}
                              component="div"
                              className="field-error text-red-600 m-1 font-bold"
                          />
                            
                            <div 
                            onClick={
                              () => {
                                props.setFieldValue(`measurements[${index}].oneRangeEnabled`, true)
                                props.setFieldValue(`measurements[${index}].manuelDefined`, false)
                                props.setFieldValue(`measurements[${index}].twoRangeEnabled`, false)

                                // initialValues içindeki eşleştiği index değerini sıfırla
                                props.setFieldValue(`measurements[${index}].secondValue`, "")

                                // kullanıcı ara yüzündeki değeri sıfırla (input içi dolu duruyor yoksa)
                                document.getElementById(`measurements[${index}].secondValue`).value = '';
                              }
                            }
                              className={`${props.values.measurements[index].oneRangeEnabled ? "bg-blue-200 text-black" : "bg-white cursor-pointer"} cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}                              
                            > 
                              <label
                                  className="inline-block whitespace-nowrap cursor-pointer"
                                  htmlFor={`measure-${index}`}
                                > Tek Ölçü:
                              </label>
                                
                                <Field 
                                  readOnly={true}
                                  type="checkbox"
                                  onChange={props.handleChange}
                                  id={`measurements[${index}].oneRangeEnabled`}
                                  name={`measurements[${index}].oneRangeEnabled`}
                                  className="border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer"
                                />
                                <ErrorMessage
                                  name={`measurements[${index}].oneRangeEnabled`}
                                  component="div"
                                  className="field-error text-red-600 m-1 font-bold"
                                />
                              </div>
                              <div 
                              onClick={
                                () => {
                                  props.setFieldValue(`measurements[${index}].twoRangeEnabled`, true)
                                  props.setFieldValue(`measurements[${index}].manuelDefined`, false)
                                  props.setFieldValue(`measurements[${index}].oneRangeEnabled`, false)
                                }
                              }
                                className={`${props.values.measurements[index].twoRangeEnabled ? "bg-blue-200 text-black" : "bg-white cursor-pointer"} cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}
                                >  
                                <label
                                  className="inline-block whitespace-nowrap cursor-pointer"
                                  htmlFor={`measure-${index}`}
                                > Ölçü Aralığı:
                                </label>

                                <Field 
                                  readOnly={true}
                                  type="checkbox"
                                  onChange={props.handleChange}
                                  id={`measurements[${index}].twoRangeEnabled`}
                                  name={`measurements[${index}].twoRangeEnabled`}
                                  className="border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer"                                
                                />
                                <ErrorMessage
                                    name={`measurements[${index}].twoRangeEnabled`}
                                    component="div"
                                    className="field-error text-red-600 m-1 font-bold"
                                />
                              </div>
                              <div 
                              onClick={
                                () => {
                                  props.setFieldValue(`measurements[${index}].manuelDefined`, true)
                                  props.setFieldValue(`measurements[${index}].twoRangeEnabled`, false)
                                  props.setFieldValue(`measurements[${index}].oneRangeEnabled`, false)

                                  // initialValues içindeki eşleştiği index değerini sıfırla
                                  props.setFieldValue(`measurements[${index}].secondValue`, "")
                                  props.setFieldValue(`measurements[${index}].unit`, "")

                                  // kullanıcı ara yüzündeki değeri sıfırla (input içi dolu duruyor yoksa)
                                  document.getElementById(`measurements[${index}].secondValue`).value = '';
                                  
                                }
                              }
                              className={`${props.values.measurements[index].manuelDefined ? "bg-blue-200 text-black" : "bg-white"} cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}                        
                              > 
                              <label
                                className="inline-block whitespace-nowrap cursor-pointer"
                                htmlFor={`measure-${index}`}
                              >Özel Ölçü
                              </label>

                              <Field 
                                readOnly={true}
                                type="checkbox"                                
                                onChange={props.handleChange}
                                id={`measurements[${index}].manuelDefined`}
                                name={`measurements[${index}].manuelDefined`}
                                className="border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer"
                              />
                              <ErrorMessage
                                  name={`measurements[${index}].manuelDefined`}
                                  component="div"
                                  className="field-error text-red-600 m-1 font-bold"
                              />
                              </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (index !== 0) {
                                  remove(index);
                                }
                              }}
                            >
                              <p className="bg-red-600 text-white p-2 rounded-md">
                                {" "}
                                <MdOutlineCancel size={25} />{" "}
                              </p>
                            </button>
                          
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full flex justify-center items-center gap-10 my-6 scale-125">
                    <button
                      type="button"
                      onClick={() => push(
                        {
                          firstValue: "",
                          secondValue: "",
                          unit: 'cm',
                          oneRangeEnabled: false,
                          twoRangeEnabled: true,
                          manuelDefined: false,
                          turkish: '',
                          ukrainian: '',
                          english: '',
                        }
                      )}
                      className="px-3 py-2 rounded-md bg-blue-500 text-white hover:rotate-2 hover:scale-105 transition-all"
                    >
                      Yeni Ölçü Ekle
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md bg-green-500 text-white hover:rotate-2 hover:scale-105 transition-all"
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
      <div className='w-full mt-6 flex-row flex-wrap justify-center items-center'>
        <div className='w-full flex justify-center items-center p-2 bg-black text-white font-bold text-xl'>
          <h4>Ölçü Listesi</h4>
        </div>

        <Table/>                     
        {/* <div>
        {
          listData && listData.map((item, index) => (
            <div key={index} className={`p-4 ${index % 2 ? "bg-white" : "bg-gray-100"}`}>
              {index+1} - <span className='ml-4 bg-blue-100 p-2 rounded-lg'>{item.firstValue}  {item.secondValue && " - " + item.secondValue} {item.unit}</span>
            </div>
          
          ))
        }
        </div> */}


      </div>
      </div>
    </>
  );
}

export default MeasurementsComponent;
