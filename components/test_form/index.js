"use client"
import React from 'react'
import {postAPI} from '@/services/fetchAPI';
import { Formik, Form } from "formik";
import { useState , useEffect} from 'react';
import { MdOutlineCancel } from "react-icons/md";

 const Test_form = () => {



    const [testData, setTestData] = useState()
    
    const [measurements, setMeasurements] = useState([
        { value: '', unit: 'cm', isRangeEnabled: false },
      ]);
    
      const addMeasurement = () => {
        setMeasurements([...measurements, { value: '', unit: 'cm', isRangeEnabled: false }]);
      };

  return (
    <div>
        <Formik
        initialValues={{
            email: "", 
            password: "" 
        }}

        //validationSchema={resetPasswordValidationSchema}


        onSubmit={async (values) => {
            
            await postAPI("/test", values).then((data) => {
                
                if(!data.status === 200){
                    console.log("hata var")
                }
                else{
                    setTestData(data.user)
                }
            });
        }}
        >
            {(props) => (
                <Form className=''
                onSubmit={props.handleSubmit}
                >

                    {measurements.map((measurement, index) => (
                        <div key={index} className="mb-4 w-full flex justify-center m-4 items-center gap-4">

                            <label htmlFor={`measure-${index}`} className="block font-semibold">
                                {`${index+1} - Ölçü Ekle`}
                            </label>

                            <div className="flex items-center gap-4 hover:scale-105 transition-all">
                                <input
                                id={`measure-${index}`}
                                name={`measure-${index}`}
                                type="number"
                                className="border border-gray-300 rounded-md p-2"
                                placeholder="Ölçü Değeri"
                                value={measurement.value}
                                onChange={(e) => {
                                    const newMeasurements = [...measurements];
                                    newMeasurements[index].value = e.target.value;
                                    setMeasurements(newMeasurements);
                                }}
                                />
                                <button
                                type="button"
                                onClick={() => {
                                    const updatedMeasurements = measurements.filter((item) => item !== measurements[index]);
                                    setMeasurements(updatedMeasurements);
                                }}
                                >
                                    <p className='bg-red-600 text-white p-2 rounded-md'> <MdOutlineCancel size={25}/> </p>
                                </button>
                            </div>

                                
                        </div>
                    ))}

                    <div className='w-full flex justify-center items-center gap-4'>
                        <button
                        type="button"
                        onClick={addMeasurement}
                        className="px-3 py-2 rounded-md bg-blue-500 text-white"
                        >
                        Yeni Ölçü Ekle
                        </button>

                        <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-green-500 text-white"
                        >
                        Gönder
                        </button>
                    </div>

                </Form>
            )}
            
        </Formik>
    </div>
  )
}

export default Test_form;
