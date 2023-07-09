"use client"
import React from 'react'
import {postAPI} from '@/services/fetchAPI';
import { Formik, Form } from "formik";
import { useState , useEffect} from 'react';
import { MdOutlineCancel } from "react-icons/md";

 const Test_form = () => {



    const [testData, setTestData] = useState()
    
    const [measurements, setMeasurements] = useState([
        { firstValue: '',secondValue: '', unit: 'cm', isRangeEnabled: true },
    ]);
    
    const addMeasurement = () => {
        setMeasurements([...measurements, { firstValue: '',secondValue: '', unit: 'cm', isRangeEnabled: true }]);
    };

    const removeMeasurement = () => {
        const newMeasurements = [...measurements];
        newMeasurements.map((measurement, index) => {
            if(!newMeasurements[index].isRangeEnabled)
            newMeasurements[index].secondValue = '';
        })
        setMeasurements(newMeasurements);
    }

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
                    <div>
                    {measurements.map((measurement, index) => (
                        <div key={index} className={`hover:scale-105 transition-all w-full flex justify-center items-center gap-10 ${index % 2 ? 'bg-gray-100' : 'bg-white'}`}>

                            <label htmlFor={`measure-${index}`} className="block font-semibold">
                                { 
                                    measurements[index].isRangeEnabled ? 
                                    `${index+1} - Ölçü Aralığı Ekle` :
                                    `${index+1} - Ölçü Ekle`
                                }
                            </label>

                            <div className="flex items-center gap-4">
                                <input
                                id={`measure-${index}`}
                                name={`measure-${index}`}
                                type="number"
                                className="border border-gray-300 rounded-md p-2"
                                placeholder="Ölçü Değeri"
                                value={measurement.value}
                                onChange={(e) => {
                                    const newMeasurements = [...measurements];
                                    newMeasurements[index].firstValue = e.target.value;
                                    setMeasurements(newMeasurements);
                                }}
                                />
                                <div className='flex flex-row justify-center items-center p-4 rounded-lg gap-4'>
                                    
                                    <input
                                        id={`measure-${index}`}
                                        name={`measure-${index}`}
                                        type="number"
                                        className={`border border-gray-300 rounded-md p-2 ${measurements[index].isRangeEnabled ? 'block' : 'hidden'}`}
                                        placeholder="Ölçü Değeri"
                                        value={measurements[index].secondValue}
                                        onChange={(e) => {
                                            const newMeasurements = [...measurements];
                                            newMeasurements[index].secondValue = e.target.value;
                                            setMeasurements(newMeasurements);
                                        }}
                                    />
                                    
                                    <div className='flex gap-4'>
                                        <label htmlFor={`measure-${index}`}>Ölçü Aralığı Gir: </label>
                                    
                                    <input 
                                    type="checkbox"
                                        className="border border-gray-300 rounded-md p-2 w-6 h-6"
                                        checked={measurement.isRangeEnabled}
                                        onChange={(e) => {
                                            const newMeasurements = [...measurements];
                                            newMeasurements[index].isRangeEnabled = e.target.checked;
                                            setMeasurements(newMeasurements);
                                        }}
                                    />
                                    </div>
                                </div>

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
                    </div>

                    <div className='w-full flex justify-center items-center gap-4 my-6'>
                        <button
                        type="button"
                        onClick={addMeasurement}
                        className="px-3 py-2 rounded-md bg-blue-500 text-white"
                        >
                        Yeni Ölçü Ekle
                        </button>

                        <button
                        onClick={() => {
                            removeMeasurement();
                        }}
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
