
import React from 'react'
import MeasurementsComponent from "@/components/createProduct/MeasurementsComponent"
import Navbar from "@/components/navbar"
import {getAPI} from '@/services/fetchAPI';


// veriyi server side ile burada alıyoruz
export const getMeasurementsData = async () => {
  const response = await getAPI('/createProduct/measurements');
  return response;
}



const HomeContainer = async () => {  

  // aldığımız veriyi değişkene atıp clientside a gönderiyoruz.
  const {data} = await getMeasurementsData();
  return (
    <>
        <MeasurementsComponent measurementsData={data}/>
    </>
  )
}

export default HomeContainer;
