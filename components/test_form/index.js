"use client"
import React from 'react'
import {postAPI} from '@/services/fetchAPI';
import { Formik, Form } from "formik";
import { useState , useEffect} from 'react';

 const Test_form = () => {



    const [testData, setTestData] = useState()


    useEffect(() => {
        if(testData){
            console.log(testData);
        }
    
      
    }, [testData])
    

  return (
    <div className='h-full flex justify-center items-center'>
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
                <Form className='w-full h-full min-h-[500px] flex justify-center items-center gap-4 flex-col m-4 p-4 bg-gray-400 rounded-xl'
                onSubmit={props.handleSubmit}
                >
                    <input  onChange={props.handleChange}  className='bg-white p-2 w-1/2 rounded-xl' id='email' type="email" name="email" />
                    <input  onChange={props.handleChange}  className='bg-white p-2 w-1/2 rounded-xl' id='password' type="password" name="password" />
                    <button onChange={props.handleChange} className='bg-white p-2 w-1/2 rounded-xl' id='submit' type="submit">Test verisi gönder</button>
                    {
                        testData && testData != "" && (
                            <div className='bg-white p-4 rounded-xl'>
                                <h2 className='text-green-600 font-bold'>Veriler veri tabanına başarılı bir şekilde gönderildi</h2>
                                <div className='bg-gray-100 p-2 rounded-xl'>
                                    <p>email:<span className='text-red-600'> {testData.email}</span></p>
                                    <p>password:<span className='text-red-600'> {testData.password}</span></p>
                                </div>
                            </div>
                        )
                        
                    }
                </Form>
            )}
            
        </Formik>
        <div className='absolute top-0 right-0 bg-red-100 rounded-xl p-2 m-4'>
            <p><span className='text-red-600 font-bold'>Testing Now</span>.</p>
        </div>
        <div className='absolute top-0 left-0 bg-black rounded-xl p-2 m-4'>
            <p><span className='text-yellow-600 font-bold'>Gabba Home</span></p>
        </div>
        

    </div>
  )
}

export default Test_form;
