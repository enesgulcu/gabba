"use client"
import React, { useState, useEffect } from 'react';
import {postAPI, getAPI} from '@/services/fetchAPI';
import LoadingScreen from '@/components/other/loading';
import { ToastContainer, toast } from "react-toastify";
import ResizeImage from '@/functions/others/resizeImage';
import Image from 'next/image';

/*  veri yapısındaki key değerleri
[
    fabricType: "",
    fabricDescription: "",
    fabricSwatch: "",
    image: null,
        
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
]
*/

const ListComponent = ({NewData, setUpdateData}) => {

    const [isloading, setIsloading] = useState(false);
    
    // tablo verisi bu state üzerinde tutulmaktadır.
    const [fields, setFields] = useState([]);

    useEffect(() => {

      setFields(NewData);
    
    }, [NewData])
    
    // tablodan veri silme fonksiyonu
    const dataDeleteFunction = async (data) => {
        try {
            const responseData = await postAPI("/createProduct/fields",{data:data, processType:"delete"});
            if(responseData.status !== "success"){
                throw new Error("Veri silinemedi");
            }
            getData();
            setIsloading(false);
            toast.success("Veri başarıyla silindi");

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    // tabloya veri çekme fonksiyonu
    const getData = async () => {
        try {
            const response = await getAPI('/createProduct/fields');
            setIsloading(false);
            if(response.status !== "success"){
                
                throw new Error("Veri çekilemedi 1");
            }
            setFields(response.data);
            
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }
    
    // tablo başlıklarını oluşturma fonksiyonu (thead)
    const renderHead = () => {

        const tableHeaders = ["Sıra","Kumaş Tipi","Açıklama","Kartela","Resim","Dil Çevirisi","İşlemler"]
        return (
            <tr className=''>
                {tableHeaders.map((header, index) => (
                    <th key={index} scope="col" className=" text-center py-4 border-l border-white last:bg-gray-700 last:text-white p-2">
                        {header}
                    </th>
                ))}
            </tr>
        );
    };

    // tablo içeriklerini oluşturma fonksiyonu (tbody)
    const renderData = () => {
        
        return fields ? 
        fields.map((field, index) => (
            <tr key={index} className='border-b'>
                <td className='text-center py-2 border-r flex justify-center items-center h-full mt-2'>
                    <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>{index + 1}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    {/* Kumaş Tipi giriş tipine göre gösterim belirlendiği yer */}
                    <div>{field.fabricType}</div>
                </td> 
                <td className='text-center py-2 border-r'>
                    <div>{field.fabricDescription}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    <div>{field.fabricSwatch}</div>
                </td>
                <td className='text-center py-2 border-r hover:bg-gray-100'>
                
                    <div className='w-full flex justify-center items-center max-h-40 overflow-hidden hover:overflow-visible hover:max-h-max '> 
                        {
                            field.image ?
                            <Image 
                            src={field.image} width={500} height={500} alt="resim" className='hover:border-4 hover:border-blue-500 hover:cursor-pointer hover:w-72 transition-all w-20 rounded object-cover' />
                            :
                            <div className='w-10 h-10 rounded-full bg-gray-300'></div>
                        }
                     </div>
                </td>
                <td className='text-center py-2 border-r'>
                    <div>Dil çevirme iconu</div>
                </td>

                {/* Tablonun Düzenle - sil aksiyon işlemlerinin yapıldığı kısım */}
                <td className='text-center py-2 border-r'>
                    <div className='flex center justify-center items-center gap-4'>
                        <button 
                        onClick={() => {
                            // veri güncellemesi için ilk adım.
                            setUpdateData(field);
                        }}
                        className='shadow-md bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-md min-w-[50px]'>
                            Düzenle
                        </button>
                        <button 
                        onClick={async () => {
                            setIsloading(true); // yükleniyor etkinleştirildi
                            await dataDeleteFunction(field); // veri silme fonksiyonu çağırıldı
                            await getData(); // güncel verileri çekme fonksiyonu çağırıldı
                        }}
                        className='shadow-md bg-red-500 hover:bg-red-700 text-white font-bold p-2  rounded-md min-w-[50px]'>
                            Sil
                        </button>
                    </div>
                </td>
            </tr>
        )) :
        <tr>
            <td>Veri yok</td>
        </tr>
    }

    return (
      <>
        {isloading && <LoadingScreen isloading={isloading} />}
        
        {/* 
        zaten parent componentinde mevcut olduğu için onu algılıyor ve onun çalışması yeterli oluyr
        yoksa iki kere bildirim geliyor.
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
        /> */}
        
        <div className={`
        w-full relative overflow-x-auto
        ${isloading ? " blur max-h-screen overflow-hidden" : " blur-none"}
        `}>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
              {renderHead()}{" "}
              {/* Tablo başlık kısmını renderHeaders fonksiyonu ile oluşturur */}
            </thead>
            <tbody>
                {renderData()}{" "}  
              {/* Tablo içerik kısmını renderData fonksiyonu ile oluşturur */}
            </tbody>
          </table>
        </div>
      </>
    );
};

export default ListComponent;
