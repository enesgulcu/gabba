"use client"
import React from 'react'
import {postAPI, getAPI} from '@/services/fetchAPI';
import { Formik, Form,Field, FieldArray } from "formik";
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
    
    // formda kullanılacak ölçümlerin tutulacağı state.
    const [measurements, setMeasurements] = useState([
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
         },
    ]);
    

    // ölçü ekleme fonksiyonu.
    const addMeasurement = () => {
        setMeasurements([
          ...measurements, 
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
        ]);
      };


  return (
    <div className='w-full'>
      <Formik
        initialValues={{
          measurements: [],
        }}

        validationSchema={MeasurementsValidationSchema}

        onSubmit={async (value) => {
          console.log(measurements);
          const data = measurements;
            const responseData = await postAPI("/createProduct/measurements", data);
            if (responseData.status !== "success" || responseData.status == "error") {
              console.log(responseData.error);
            } else {
              console.log("işlem başarılı!");
            }
          
          
        }}
      >
        {(props) => (
          //console.log(props.errors.measurements),
          <Form onSubmit={props.handleSubmit}>
             <FieldArray name="measurements">
            {({ push, remove }) => (
                <div>
                  <div>
                    {measurements.map((measurement, index) => (
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
                          measurements[index].oneRangeEnabled ? 
                          <div className='flex justify-start items-center flex-row gap-2'><span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${index + 1}`}</span> - Tek Ölçü Ekle</div>
                          : measurements[index].twoRangeEnabled ?
                          <div className='flex justify-start items-center flex-row gap-2'><span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${index + 1}`}</span> - Ölçü Aralığı Ekle</div>
                          :
                          <div className='flex justify-start items-center flex-row gap-2'><span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${index + 1}`}</span> - Özel Ölçü Ekle</div>
                          }
                          </label>

                        <div className=' flex flex-row flex-wrap lg:flex-nowrap gap-4 justify-center items-start'>
                          <div className='flex flex-col justify-center items-center'>    
                            <Field 
                              id={`measurements[${index}].firstValue`}
                              name={`measurements[${index}].firstValue`}
                              type={`${measurements[index].manuelDefined ? "text" : "number"}`}
                              className={`border border-gray-300 rounded-md p-2 `}
                              placeholder={`${
                                measurements[index].manuelDefined ? "örnek: Soldan Kapak Çıkar" : "örnek: 124"   
                              } `}
                              //value={measurements[index].firstValue || ""}
                              value={props.values.firstValue}
                              onChange={(e) => {
                                props.handleChange(e);
                                const newMeasurements = [...measurements];
                                newMeasurements[index].firstValue = e.target.value;
                                setMeasurements(newMeasurements);
                              }}
                            />
                            <div className='text-red-600 m-1 font-bold'>
                              {props.errors.measurements && props.errors.measurements[index] && props.errors.measurements[index].firstValue}
                            </div>
                          </div> 
                          <div className={`flex flex-col justify-center items-center ${
                              measurements[index].twoRangeEnabled
                                ? "block"
                                : "hidden"
                            }`}>
                          <Field 
                            id={`measurements[${index}].secondValue`}
                            name={`measurements[${index}].secondValue`}
                            type="number"
                            className={`border border-gray-300 rounded-md p-2`}
                            placeholder="örnek: 238"
                            //value={measurements[index].secondValue || ""}
                            value={props.values.secondValue}
                            onChange={(e) => {
                              props.handleChange(e);
                              const newMeasurements = [...measurements];
                              newMeasurements[index].secondValue =
                                e.target.value;
                              setMeasurements(newMeasurements);
                            }}
                          />
                          <div className='text-red-600 m-1 font-bold'>
                              {props.errors.measurements && props.errors.measurements[index] && props.errors.measurements[index].secondValue}
                            </div>
                          </div>
                        </div>
                          <div className="flex flex-row flex-wrap justify-center xl:justify-around gap-4 items-center cursor-pointer">
                            
                            <Field 
                                as="select"
                                id={`measurements[${index}].unit`}
                                name={`measurements[${index}].unit`}
                                disabled={measurements[index].manuelDefined}
                                value={props.values.unit}
                                defaultValue="cm"
                                className={`${measurements[index].manuelDefined ? " opacity-30" : "block"} cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                onChange={(e) => {
                                  props.handleChange(e);
                                  const newMeasurements = [...measurements];
                                  newMeasurements[index].unit = e.target.value;
                                  setMeasurements(newMeasurements);
                                }}
                              >
                                <option value="cm">cm</option>
                                <option value="mm">mm</option>
                                <option value="m">m</option>
                            </Field>
                            <div 
                              onClick={() => {
                                if(!measurement[index]?.oneRangeEnabled){
                                  const newMeasurements = [...measurements];
                                  newMeasurements[index].oneRangeEnabled = true;
                                  newMeasurements[index].twoRangeEnabled = false;
                                  newMeasurements[index].manuelDefined = false;

                                  setMeasurements(newMeasurements);
                                }
                              }}
                              className={`${measurements[index].oneRangeEnabled ? "bg-blue-200 text-black" : "bg-white cursor-pointer"} cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}
                            > 
                              <label
                                  className="inline-block whitespace-nowrap cursor-pointer"
                                  htmlFor={`measure-${index}`}
                                >
                                  Tek Ölçü:
                              </label>

                                <Field 
                                value={props.values.oneRangeEnabled}
                                  type="checkbox"
                                  id={`measurements[${index}].oneRangeEnabled`}
                                  name={`measurements[${index}].oneRangeEnabled`}
                                  className="border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer"
                                  checked={measurement.oneRangeEnabled}
                                  readOnly={true}
                                  onChange={(e) => {
                                    props.handleChange(e);
                                  }}
                                />
                              </div>
                              <div 
                                onClick={() => {
                                  if(!measurement[index]?.twoRangeEnabled){
                                    const newMeasurements = [...measurements];
                                    newMeasurements[index].twoRangeEnabled = true;
                                    newMeasurements[index].oneRangeEnabled = false;
                                    newMeasurements[index].manuelDefined = false;
                                    setMeasurements(newMeasurements);
                                  }
                                }}

                                className={`${measurements[index].twoRangeEnabled ? "bg-blue-200 text-black" : "bg-white cursor-pointer"} cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}
                              >  
                              <label
                                className="inline-block whitespace-nowrap cursor-pointer"
                                htmlFor={`measure-${index}`}
                              >
                                Ölçü Aralığı:
                              </label>

                              <Field 
                                type="checkbox"
                                id={`measurements[${index}].twoRangeEnabled`}
                                name={`measurements[${index}].twoRangeEnabled`}
                                className="border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer"
                                checked={measurement.twoRangeEnabled}
                                readOnly={true}
                                value={props.values.twoRangeEnabled}
                                onChange={(e) => {
                                  props.handleChange(e);
                                }}
                              />
                              </div>
                              <div 
                                onClick={() => {
                                  if(!measurement[index]?.manuelDefined){
                                    const newMeasurements = [...measurements];
                                    newMeasurements[index].manuelDefined = true;
                                    newMeasurements[index].oneRangeEnabled = false;
                                    newMeasurements[index].twoRangeEnabled = false;
                                    setMeasurements(newMeasurements);
                                  }
                                }}
                                className={`${measurements[index].manuelDefined ? "bg-blue-200 text-black" : "bg-white"} cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}
                              > 
                              <label
                                className="inline-block whitespace-nowrap cursor-pointer"
                                htmlFor={`measure-${index}`}
                              >
                                Özel Ölçü
                              </label>

                              <Field 
                                type="checkbox"
                                id={`measurements[${index}].manuelDefined`}
                                name={`measurements[${index}].manuelDefined`}
                                className="border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer"
                                checked={measurement.manuelDefined}
                                readOnly={true}
                                value={props.values.manuelDefined}
                                onChange={(e) => {
                                  props.handleChange(e);
                                }}
                              />
                              </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedMeasurements = measurements.filter(
                                  (item) => item !== measurements[index]
                                );
                                setMeasurements(updatedMeasurements);
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
                      onClick={addMeasurement}
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
  );
}

export default MeasurementsComponent;
