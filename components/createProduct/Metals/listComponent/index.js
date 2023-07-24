"use client"
import React, { useState, useEffect } from 'react';
import {postAPI, getAPI} from '@/services/fetchAPI';
import { toast } from "react-toastify";
import ResizeImage from '@/functions/others/resizeImage';
import Image from 'next/image';

/*  veri yapısındaki key değerleri
[
    metalType: "",
    metalDescription: "",
        
    translateEnabled: false,

    metalTypeTurkish: "",
    metalTypeUkrainian: "",
    metalTypeEnglish: "",

    metalDescriptionTurkish: "",
    metalDescriptionUkrainian: "",
    metalDescriptionEnglish: "",
]
*/

const ListComponent = ({NewData, setUpdateData, setNewData, isloading, setIsloading, setSelectedLanguageData, selectedLanguageData}) => {

    
    // tablo verisi bu state üzerinde tutulmaktadır.
    const [metals, setMetals] = useState([]);


    useEffect(() => {

      setMetals(NewData);
    
    }, [NewData])
    
    // tablodan veri silme fonksiyonu
    const dataDeleteFunction = async (data) => {
        
        try {
            const responseData = await postAPI("/createProduct/metals",{data:data, processType:"delete"});
            if(!responseData || responseData.status !== "success"){
                throw new Error("Veri silinemedi");
            }
            await getData();
            await setIsloading(false);
            toast.success("Veri başarıyla silindi");

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    // tabloya veri çekme fonksiyonu
    const getData = async () => {
        try {
            const response = await getAPI('/createProduct/metals');
            setIsloading(false);
            if(response.status !== "success"){
                
                throw new Error("Veri çekilemedi 1");
            }
            
            setNewData(response.data);
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }
    
    // tablo başlıklarını oluşturma fonksiyonu (thead)
    const renderHead = () => {

        const tableHeaders = ["Sıra","Metal Tipi","Açıklama","Dil Çevirisi","İşlemler"]
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
        
        return metals ? (
          metals.map((metal, index) => (
            <tr key={index} className="border-b">
              <td className="  border-r">
                <div className="flex justify-center items-center h-full mt-2 w-full text-center py-2">
                  <div className="bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center">
                    {index + 1}
                  </div>
                </div>
              </td>
              <td className="text-center py-2 border-r">
                {/* Kumaş Tipi giriş tipine göre gösterim belirlendiği yer */}
                <div>{metal.metalType}</div>
              </td>
              <td className="text-center py-2 border-r">
                <div>{metal.metalDescription}</div>
              </td>
              <td className="text-center py-2 border-r">
                <div className='h-20 flex justify-center items-center'>
                  <Image
                  onClick={
                    () => {
                      setSelectedLanguageData(metal);
                    }
                  }
                    className="hover:scale-125 transition-all cursor-pointer"
                    src="/translate_book.svg"
                    height={30}
                    width={40}
                    alt="TrFlag"
                  />
                </div>
              </td>

              {/* Tablonun Düzenle - sil aksiyon işlemlerinin yapıldığı kısım */}
              <td className="text-center py-2 border-r">
                <div className="flex center justify-center items-center gap-4">
                  <button
                    onClick={() => {
                      // veri güncellemesi için ilk adım.
                      setUpdateData(metal);
                    }}
                    className="shadow-md bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-md min-w-[50px]"
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={async () => {
                      setIsloading(true); // yükleniyor etkinleştirildi
                      await dataDeleteFunction(metal); // veri silme fonksiyonu çağırıldı
                      //await getData(); // güncel verileri çekme fonksiyonu çağırıldı
                    }}
                    className="shadow-md bg-red-500 hover:bg-red-700 text-white font-bold p-2  rounded-md min-w-[50px]"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>Veri yok</td>
          </tr>
        );
    }

    return (
      <>
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