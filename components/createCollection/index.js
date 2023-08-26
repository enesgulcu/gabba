"use client"
import React from 'react'
import {useState, useEffect} from 'react';
import { getAPI, postAPI } from '@/services/fetchAPI';

const CreateCollectionComponent = () => {
  
  const [data, setData] = useState([]); // tüm ürünler ve tüm özellikler 

  useEffect(() => {
    getData();

  }, [])
  

  useEffect(() => {
    console.log(data);  
  }, [data])
  

  const getData = async () => {
    try {
        //setIsloading(true);
        const response = await getAPI('/createCollection');
        if(response.status !== "success"){
          throw new Error("Veri çekilemedi 1");
        }
        
        setData(response.data);
        //setIsloading(false);
    } catch (error) {

        setIsloading(false);
        //console.log(error);
    }
}

  return (
    <>
      <div>
        Create Collection Component
      </div>
    </>
  )
}

export default CreateCollectionComponent;
