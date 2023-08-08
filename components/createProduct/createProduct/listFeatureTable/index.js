import {useState, useEffect} from 'react'
import { getAPI } from '@/services/fetchAPI';
import Image from 'next/image';
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ListFeatureTable = () => {

  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductFeatures, setSelectedProductFeatures] = useState([]);
  

  useEffect(() => {
    console.log(selectedProductFeatures);
  }, [selectedProductFeatures])
  

  // veritabanından verileri çek.
  const getData = async (url) => {
    try {
        const response = await getAPI(url || '/createProduct/createProduct');
        //setIsloading(false);
        if(response.status !== "success"){
            
            throw new Error("Veri çekilemedi 1");
        }
        
        setData(response.data);
    } catch (error) {
        //toast.error(error.message);
        console.log(error);
    }
}

// ürünlerden özellikleri gör butonuna bastıktan sonra çalışacak fonksiyon.
const getProductFeatures = async (data, productId) => {
  try {
    const selectedFeatures = [];
    data.productFeatures.map((item, index) => {
      if(item.productId === productId){
        //id eşleşmesi olan gelen tüm item verilerini selectedProductFeatures state'ine at.
        selectedFeatures.push(item);
      }
    })

    if(selectedFeatures.length > 0 && selectedFeatures){
      setSelectedProductFeatures(selectedFeatures);
    }
    else{
      setSelectedProductFeatures([]);
    }
  }
  catch (error) {
    console.log(error);
  }
}
      


  useEffect(() => {
    getData("/createProduct/createProduct");
  }, [])


  useEffect(() => {
    //console.log(data);
  }, [data])



  const renderHead = () => {

    const tableHeaders = ["sıra", "Ürün Adı", "Ürün Tipi", "Seçilen Kategori", "Ürün Resmi", "Ürün Özellikleri"]
    return (
        <tr className=''>
            {tableHeaders.map((header, index) => (
                <th key={index} scope="col" className=" text-center py-4 border-l border-white p-2">
                     {header}
                </th>
            ))}
        </tr>
    );
};

const renderData = () => {
  
  
  return data && data.createProducts && (
    data.createProducts.map((prodcutItem, index) => (
      <tr key={index} className="border-b hover:bg-blue-100">

        {/* sıra numarası */}
        <td className="  border-r border-b border-black">
          <div className="flex justify-center items-center h-full mt-2 w-full text-center py-2">
            <div className="bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center">
              {index + 1}
            </div>
          </div>
        </td>

        {/* ürün adı */}
        <td className="text-center py-2 border-r border-b border-black">
          <div>{prodcutItem.productName}</div>
        </td>

        {/* ürün tipi */}
        <td className="text-center py-2 border-r border-b border-black">
          <div>{prodcutItem.productType}</div>
        </td>

        {/* seçilen kategori */}
        <td className="text-center py-2 border-r border-b border-black">
          <div>{prodcutItem.selectedCategoryValues}</div>
        </td>

        {/* ürün resmi */}
        <td className="text-center py-2 border-r border-b border-black">
          <div className='w-full flex justify-center item-center flex-wrap'>
          {
            data.productFeatures.map((featureItem, index) => (

              featureItem.productId === prodcutItem.id && 
              featureItem.feature.includes("Image" || "image") &&

              <div key={index} className='p-2 m-2'>
                <Image width={50} height={50} src={featureItem.imageValue} alt={`image${index}`} 
                onClick={() => setSelectedImage(featureItem.imageValue)}
                className='hover:cursor-pointer hover:scale-110 transition-all'
                />
              </div>              
            ))
          }
          </div>
        </td>

        {/* ürün özellikleri */}
        <td className="text-center py-2 border-r border-b border-black">
          <button 
          onClick={() => selectedProduct  && selectedProduct.id === prodcutItem.id ? setSelectedProduct(null) : setSelectedProduct(prodcutItem)}
          
          type='button' className={`${selectedProduct && selectedProduct.id === prodcutItem.id ? "bg-red-600" : "bg-blue-600"} rounded p-2 hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`} >
            {
              selectedProduct && selectedProduct.id === prodcutItem.id ? 
              <div className='flex flex-row justify-center items-center gap-2'><FaEyeSlash size={20}/> Özellikleri Gizle</div> : 
              <div 
              onClick={() => getProductFeatures(data, prodcutItem.id)}
              className='flex flex-row justify-center items-center gap-2'><FaEye size={20}/> Özellikleri Gör</div>
            }
            
            </button>
        </td>
      </tr>
    )))
}



  // gelen verileri tablo haline getiriyoruz ve listeliyoruz.
  return (
    <div className='w-full'>

      {/* Ürün Özelliklerini Listeleme */}
      {
        selectedProductFeatures && selectedProductFeatures.length > 0 &&
        <div className='w-full'>
          
        </div>
      }
      
      {
        // resim seçildiğinde resmi büyütüyoruz ve ekranda gösteriyoruz (1)
        selectedImage &&
        <div className='absolute w-full h-full z-20 bg-black bg-opacity-80'>
          <div className='relative w-full h-full flex flex-col justify-center items-center gap-2'>
            
              <div className='bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all'
              onClick={() => setSelectedImage(null)}
              >
                <IoCloseOutline size={50} color='white' />
              </div>
            
            <Image width={500} height={500} src={selectedImage} alt={`image`} />
          </div>
        </div>
      }


      {/* ürünleri listelediğimiz tablomuz */}
      <table className={`${selectedImage && "blur"} w-full text-sm text-left text-gray-500 dark:text-gray-400`}>
        <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
          {renderHead()}{" "}
        </thead>
        <tbody>
          {renderData()}{" "}  
        </tbody>
      </table>


    </div>
  )
}

export default ListFeatureTable
