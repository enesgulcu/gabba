"use client"
import {useState, useEffect} from 'react'
import { getAPI } from '@/services/fetchAPI';
import Image from 'next/image';
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingScreen from '@/components/other/loading';

// (1) Data -> kayıtlı ürün ve tüm ürünlerin kayıtlı özelliklerini getirir.
// 

const ListFeatureTable = ({categoriesData}) => {

  // categoriesData değerini bir state içerisine atıyoruz.
  const [catagories, setCatagories] = useState(categoriesData);

  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState([]); // tüm ürünler ve tüm özellikler 
  const [selectedProductFeatures, setSelectedProductFeatures] = useState([]); // seçilen ürünün özellikleri tutar
  const [selectedCategory, setSelectedCategory] = useState("");  // seçilen kategori -> furniture
  const [allFeatureData , setAllFeatureData] = useState([]); // ürün kategorisinin tüm özellikleri (hepsi)
  const [productFeatures, setProductFeatures] = useState([]); // seçilen ürünün kendi özellikleri tam olarak

  const [selectedImage, setSelectedImage] = useState(null); // seçilen resim
  const [selectedProduct, setSelectedProduct] = useState(null); // seçilen ürün bilgisi

  const [selectedFeature , setSelectedFeature] = useState(""); // Ölçüler - Renkler - Kumaşlar - Metaller - Extra - Image başlıkları
  
  const [readyForListFeature, setReadyForListFeature] = useState([]); // ürün özelliklerini listelemek için hazır mıyız ?

  // useEffect(() => {
  //   console.log(readyForListFeature);
  // }, [readyForListFeature])

  useEffect(() => {
      if(selectedProduct && selectedProduct.selectedCategoryKey !== selectedCategory && selectedCategory){
        setAllFeatureData([]);
      }
  }, [catagories, selectedCategory, selectedProduct])

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


// seçilen ürünün özelliklerini data içinden getir ve selectedProductFeatures içine atar. (2)
// seçilen ürünün kategorisini selectedCategory içine atar. (2)
const getProductFeatures = async (data, productId) => {
  try {
    setIsloading(true);
    if(!data || !productId){
      setIsloading(false);
      return;
    }

    // ########################################################################
    // seçilen ürünün özelliklerini selectedProductFeatures state'ine at. (2.1)

      const selectedProductFeatures = [];

      await data.productFeatures.map((item, index) => {
        if(item.productId === productId){
          //id eşleşmesi olan gelen tüm item verilerini selectedProductFeatures state'ine at.
          selectedProductFeatures.push(item);
        }
      })

      await setSelectedProductFeatures(selectedProductFeatures);

    // seçilen ürünün özelliklerini selectedProductFeatures state'ine at. (2.1)
    // ########################################################################

    // ########################################################################
    // seçilen ürünün kategorisini selectedCategory state'ine at. (2.2)

      
        await setSelectedCategory(selectedProductFeatures[0].selectedCategoryKey);
        await fetchData(selectedProductFeatures[0].selectedCategoryKey, productId);
        setIsloading(false);
      

    // seçilen ürünün kategorisini selectedCategory state'ine at. (2.2)
    // ########################################################################

  }
  catch (error) {
    console.log(error);
  }
}

 // seçilen kategoriye göre ürün özelliklerini allFeatureData state'ine at. !!! (tek amacı bu) (3)
 const fetchData = async (productCategory, productId)  => {

  setIsloading(true);
  try {

    if(!productCategory){
      setIsloading(false);
      throw new Error("M2GF59KGV");
    }

    // ########################################################################
    // categories'lerin ürününki ile eşleşen features dewğerlerini ver itabanından getiririz.(3.1)

    if(allFeatureData.length > 0 && allFeatureData){
      await matchedFeatureOfProduct(productId, allFeatureData);
    }

    else{
      const results = [];
      const matchedCategories = catagories[productCategory];
      
      //matchedCategories içerisindeki key değeri label hariç olan tüm değerleri gez. içindeki objenin apiGetRequest değerini al ve verileri çek.
      for (const key in matchedCategories) {
        if (Object.hasOwnProperty.call(matchedCategories, key)) {
          const element = matchedCategories[key];
          if(key !== "label"){
            const response = await getAPI(element.apiGetRequest);
            if(response.status !== "success"){
              throw new Error("Veri çekilemedi 2");
            }
            results.push(response.data);
          }
        }
      }
      await matchedFeatureOfProduct(productId, results);
      await setAllFeatureData(results);
    }

    setIsloading(false);

    // categories'lerin ürününki ile eşleşen features dewğerlerini ver itabanından getiririz.(3.1)
    // ########################################################################

  } catch (error) {
    setIsloading(false);
    console.log(error);
  }
}


// seçilen ürünün özelliklerini en detaylı şekilde state e atar. (4)
const matchedFeatureOfProduct = async (productId, results) => {

  const matchedFeature = data.productFeatures.filter((item) => item.productId === productId);
  const featureResults = [];


  await matchedFeature.forEach((item) => {
    if (item.feature.toLowerCase().includes("extra") || item.feature.toLowerCase().includes("image")) {
      featureResults.push(item);
    }
    results.forEach((item2) => {
      item2.forEach((item3) => {
        if (item.featureId === item3.id) {
          featureResults.push(item3);
        }
      });
    });
  });

   const result = [{ featureResults: featureResults, matchedFeature: matchedFeature }];
  await setProductFeatures(result);
  setIsloading(false);
};


// seçilen ürünün özelliklerini en detaylı şekilde state e atar. (5)
const prepareProductList = async (feature) => {
  
  await setSelectedFeature(feature);
  
  //feature ->  Ölçüler - Renkler - Kumaşlar - Metaller - Extra - Image
  const readyForListData = [];
  //console.log("productFeatures :", productFeatures.matchedFeature);
  await productFeatures.forEach((item) => {
    item.matchedFeature.forEach((item2) => { // item2.featureId -> özelliğin gerçek id' değeri
      if(feature === item2.feature){ // [ productFeatures.matchedFeature.item2.feature ] -> Ölçüler - Renkler - Kumaşlar - Metaller - Extra - Image
        
        if(feature === "Image" || feature ==="Extra"){ // extra ve image değerleri farkl ıbir yerden geliyor o yüzden onları ayrı aldık.
          readyForListData.push(item2);
        }
        
        else{
          item.featureResults.forEach((item3) => { // item3.id -> özelliğin gerçek id' değeri
            if(item2.featureId === item3.id){
              readyForListData.push(item3);
            }
          })
        }
      }
    });
  });

  setReadyForListFeature(readyForListData);
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
                <Image width={100} height={100} src={featureItem.imageValue} alt={`image${index}`} 
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
          onClick={() => productFeatures && productFeatures.length > 0 && selectedProduct && selectedProduct.id === prodcutItem.id ? setSelectedProduct(null) : setSelectedProduct(prodcutItem)}
          
          type='button' className={`${productFeatures && productFeatures.length > 0 && selectedProduct && selectedProduct.id === prodcutItem.id ? "bg-red-600" : "bg-blue-600"} rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`} >
            {
              productFeatures && productFeatures.length > 0 && selectedProduct && selectedProduct.id === prodcutItem.id ? 
              <div className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'><FaEyeSlash size={20}/><span className="hidden lg:block">Özellikleri Gizle</span></div> : 
              <div 
              onClick={() => getProductFeatures(data, prodcutItem.id)}
              className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'><FaEye size={20}/><span className="hidden lg:block">Özellikleri Gör</span></div>
            }
            
            </button>
        </td>
      </tr>
    )))
}

const renderFeaturesTable = () => {
// readyForListFeature içerisindeki verileri burada listeleriz.

  const excludedKeys = ['id', 'createdAt', 'updatedAt'];
    const keyMappings = {
      "firstValue": "Birinci Değer",
      "secondValue": "İkinci Değer",
      "unit": "Birim",
      // Diğer anahtarları buraya ekleyebilirsiniz...
    };
    // Object.keys(readyForListFeature[0]).filter((key) => !excludedKeys.includes(key));
    const filteredKeys = readyForListFeature.map((item) => Object.keys(item).filter((key) => !excludedKeys.includes(key)));
    console.log(filteredKeys);
 
  return (
    <table>
      <thead>
        <tr>
          {readyForListFeature && filteredKeys.map((key, index) => (
            <th key={index}>{keyMappings[key] || key}</th>
          ))}
        </tr>
      </thead>


      <tbody>
        
      </tbody>
    </table>
  )

}





  // gelen verileri tablo haline getiriyoruz ve listeliyoruz.
  return (
    <div className='w-full'>
      {isloading && <LoadingScreen isloading={isloading} />}

      {/* Ürün Özelliklerini Listeleme */}
      {productFeatures && productFeatures.length > 0 &&
        <div className="w-full absolute bg-black bg-opacity-90 z-50 min-h-screen">
          
          <div className='mt-4 flex flex-col flex-wrap justify-center items-center gap-2 text-xl'>
            <div className='bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all'
              onClick={() =>{setProductFeatures([]); setSelectedProduct(null) ; setSelectedFeature(null) ; readyForListFeature && readyForListFeature.length > 0 && setReadyForListFeature([])}}
              >
                <IoCloseOutline size={50} color='white' />
              </div>
              <div className="p-2 flex flex-row flex-wrap justify-center items-start gap-4 text-xl w-full">
              {
                [...new Set(productFeatures[0].matchedFeature.map(item => item.feature))].map((feature, index) => (
                  <div key={index} className={`p-2 rounded bg-blue-50 hover:cursor-pointer hover:scale-110 transition-all hover:bg-blue-600 hover:text-white
                   ${selectedFeature === feature ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => prepareProductList(feature)}
                  >                  
                    {feature.toLowerCase().includes("image") ? "Resimler" : feature.toLowerCase().includes("extra") ? "Ekstralar" : feature}
                  </div>
                ))
              }
              {
                
                readyForListFeature && readyForListFeature.length > 0 &&
                <div className="w-full p-2 bg-white">
                  {
                    renderFeaturesTable()
                  }

                </div>

              }
              
            </div>
          </div>
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
            
            <Image width={750} height={750} src={selectedImage} alt={`image`} />
          </div>
        </div>
      }


      {/* ürünleri listelediğimiz tablomuz */}
      <table className={`${selectedImage && "blur"} ${productFeatures && productFeatures.length > 0 && "blur"} w-full text-sm text-left text-gray-500 dark:text-gray-400`}>
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
