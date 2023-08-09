import {useState, useEffect} from 'react'
import { getAPI } from '@/services/fetchAPI';
import Image from 'next/image';
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingScreen from '@/components/other/loading';

const ListFeatureTable = ({catagoriesData}) => {

  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState([]); // tüm ürünler ve tüm özellikler 
  const [selectedImage, setSelectedImage] = useState(null); // seçilen resim
  const [selectedProduct, setSelectedProduct] = useState(null); // seçilen ürün bilgisi
  const [allFeatureData , setAllFeatureData] = useState([]); // ürün kategorisinin tüm özellikleri (hepsi)
  const [selectedCategory, setSelectedCategory] = useState("");  // seçilen kategori -> furniture
  const [productFeatures, setProductFeatures] = useState([]); // seçilen ürünün kendi özellikleri

  useEffect(() => {
    getData("/createProduct/createProduct");
  }, [])

  // veritabanından verileri çek. (1)
  const getData = async (url) => {
    try {
        setIsloading(true);
        const response = await getAPI(url || '/createProduct/createProduct');
        if(response.status !== "success"){
            
            throw new Error("Veri çekilemedi 1");
        }
        
        setData(response.data);
        setIsloading(false);
    } catch (error) {

        setIsloading(false);
        console.log(error);
    }
}

// ürünlerden özellikleri gör butonuna bastıktan sonra çalışacak fonksiyon. (2)
const getProductFeatures = async (data, productId) => {
  try {
    if(!data || !productId){
      return;
    }
    setIsloading(true);
    const selectedFeatures = [];
    data.productFeatures.map((item, index) => {
      if(item.productId === productId){
        //id eşleşmesi olan gelen tüm item verilerini selectedProductFeatures state'ine at.
        selectedFeatures.push(item);
      }
    })

    if(selectedFeatures.length > 0 && selectedFeatures){
      if(selectedFeatures[0].selectedCategoryKey === selectedCategory){
        // eğer seçilen kategori daha önce seçilmişse, verileri tekrar çekme.
        setIsloading(false);
        return;
      }
      setSelectedCategory(selectedFeatures[0].selectedCategoryKey);
      fetchData(catagoriesData, selectedFeatures);
    }
  }
  catch (error) {
    console.log(error);
  }
}

 // seçilen kategoriye göre ürün özelliklerini allFeatureData state'ine at. !!! (tek amacı bu) (3)
 const fetchData = async (catagoriesData, selectedProductFeatures)  => {
  setIsloading(true);
  try {
    if(!catagoriesData || !selectedProductFeatures){
      return;
    }

    // categoriKeys = ['furniture', 'electronic', 'accessories']
    const categoriKeys = Object.keys(catagoriesData);

    // selectedProductFeatures[0].selectedCategoryKey = furniture
    const featureCategoriKeys = await selectedProductFeatures[0]?.selectedCategoryKey;

    // featureCategoriKeys değerini categoriKeys içinde ara ve eşleşen objeyi döndür.
    const matchedCategories = categoriKeys.filter((item) => item === featureCategoriKeys).map((item) => catagoriesData[item]);
    const matchedCategori = matchedCategories[0];

    const keys = Object.keys(matchedCategori);
    const results = [];

    for (const key of keys) {
      if (key !== 'label') {
        // veri tabanından eşleşen kategorinin apiGetRequest değerini al ve verileri çek.
        const response = await getAPI(matchedCategori[key].apiGetRequest);

        if(response.status !== "success" || !response.data){
          throw new Error("Veri çekilemedi 1");
        }

        // veritabanından çekilen verileri results arrayine atıyoruz.
        results.push({
          label: matchedCategori[key].label,
          data: response.data,
        })
      }
    }

    // tüm verileri allFeatureData state'ine at.
    await setAllFeatureData(results);
    setIsloading(false);

  } catch (error) {
    setIsloading(false);
    console.log(error);
  }
}


  const renderHead = () => {

    const tableHeaders = ["sıra", "Ürün Adı", "Ürün Tipi", "Seçilen Kategori", "Ürün Resmi", "Ürün Özellikleri"]
    return (
        <tr className=''>
            {tableHeaders.map((header, index) => (
                <th key={index} scope="col" className=" text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
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

              <div key={index} className='lg:p-2 p-0 m-1 lg:m-2'>
                <Image width={50} height={50} src={featureItem.imageValue} alt={`image${index}`} 
                onClick={() => setSelectedImage(featureItem.imageValue)}
                className='hover:cursor-pointer hover:scale-125 transition-all'
                />
              </div>              
            ))
          }
          </div>
        </td>

        {/* ürün özellikleri */}
        <td className="text-center p-2 border-r border-b border-black ">
          <button 
          onClick={() => selectedProduct  && selectedProduct.id === prodcutItem.id ? setSelectedProduct(null) : setSelectedProduct(prodcutItem)}
          
          type='button' className={`${selectedProduct && selectedProduct.id === prodcutItem.id ? "bg-red-600" : "bg-blue-600"} rounded p-2 hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`} >
            {
              selectedProduct && selectedProduct.id === prodcutItem.id ? 
              <div className='flex flex-row justify-center items-center gap-2 whitespace-nowrap'><FaEyeSlash size={20}/><span className="hidden lg:block">Özellikleri Gizle</span></div> : 
              <div 
              onClick={() => getProductFeatures(data, prodcutItem.id)}
              className='flex flex-row justify-center items-center gap-2 whitespace-nowrap'><FaEye size={20}/><span className="hidden lg:block">Özellikleri Gör</span></div>
            }
            
            </button>
        </td>
      </tr>
    )))
}

  // gelen verileri tablo haline getiriyoruz ve listeliyoruz.
  return (
    <div className='w-full'>
      {isloading && <LoadingScreen isloading={isloading} />}

      {/* Ürün Özelliklerini Listeleme */}
      {
        allFeatureData && allFeatureData.length > 0 &&
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
            
            <Image width={50} height={50} src={selectedImage} alt={`image`} />
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
