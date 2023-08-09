"use client"
import { useState, useEffect } from "react";
import { getAPI } from '@/services/fetchAPI';
import DropDownCatagories from "@/components/createProduct/createProduct/dropDownCatagories"
import DynamicTable from "@/components/createProduct/createProduct/dynamicTable"
import LoadingScreen from '@/components/other/loading';
import ListFeatureTable from "@/components/createProduct/createProduct/listFeatureTable"
import { RxPlusCircled, RxListBullet, RxTriangleRight } from "react-icons/rx";


// özellikler ve alt özelliklerin verilerini çekmek için kullanılır yeni bir yapı eklenirse buraya eklenmelidir.
const catagoriesData = {
  furniture: {
    label: "Mobilya",
    colors: {
      label: "Renkler",
      apiGetRequest: "/createProduct/colors",
    },
    fabrics: {
      label: "Kumaşlar",
      apiGetRequest: "/createProduct/fabrics",
    },
    measurementsrs: {
      label: "Ölçüler",
      apiGetRequest: "/createProduct/measurements",
    },
    metals: {
      label: "Metaller",
      apiGetRequest: "/createProduct/metals",
    }
  },
};

const CreateProductComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [data, setData] = useState({}); // Initialize data as an empty object
  const [isloading, setIsloading] = useState(false);
  const [listProductsEnabled, setListProductsEnabled] = useState(true);

  useEffect(() => {
    console.log(selectedSubCategory);
  }, [selectedSubCategory])
  

  

  const getData = async (apiUrl) => {
    try {
      const response = await getAPI(apiUrl);
      if (response.status !== "success") {
        throw new Error("Veri çekilemedi 1");
      }
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    setSelectedSubCategory("");
    
    if (!selectedCategory) {
      return;
    }
    
    // Burada seçilen Ana kategoriye göre alt kategorileri seçin
    setSelectedSubCategory(catagoriesData[selectedCategory.key]);
  }, [selectedCategory]);

  useEffect(() => {
    
    const fetchData = async () => {
        setIsloading(true);
      if (!selectedSubCategory) {
        setIsloading(false);
        return;
      }

      // Burada seçilen alt kategorilere göre verileri çekin
      const dataKeys = Object.keys(selectedSubCategory);
      const fetchedData = {};
      for (const key of dataKeys) {
        const subCategoryData = selectedSubCategory[key];
        if (subCategoryData.apiGetRequest) {
          try {
            const result = await getData(subCategoryData.apiGetRequest);
            fetchedData[subCategoryData.label] = result; // Use the "label" property as the object title
          } catch (error) {
            console.log(error.message);
          }
        }
      }
      setIsloading(false);
      setData({[selectedCategory.key]: fetchedData });
    };

    fetchData();
  }, [selectedSubCategory, selectedCategory]);

  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}

      <div className="p-0 lg:p-2 w-full flex justify-center lg:justify-end items-center shadow-lg">
          <button onClick={() => setListProductsEnabled(!listProductsEnabled)}
          className={`p-2 rounded m-2 text-white text-lg hover:cursor-pointer hover:scale-105 transition-all
            ${listProductsEnabled ? "bg-green-500" : "bg-blue-500"}
          `}
          >

            {listProductsEnabled ? 
              <div className="p-2 flex flex-row gap-2 flex-nowrap justify-center items-center">
                <RxPlusCircled size={25}/>  Ürün Oluşturma Sayfasına Git <RxTriangleRight size={25}/>
              </div> : 
              <div className="p-2 flex flex-row gap-2 flex-nowrap justify-center items-center">
              <RxListBullet size={25}/>  Ürün Listeleme Sayfasına Git <RxTriangleRight size={25}/>
            </div>
            }
          </button>
      </div>

      {

        listProductsEnabled ? 
        <div>
          <ListFeatureTable catagoriesData={catagoriesData}/>
        </div>

        : 

        <div>
          <DropDownCatagories
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

          {selectedCategory && selectedSubCategory && Object.keys(data).length > 0 && (
            <div>
              <DynamicTable data={data} selectedCategoryKey={selectedCategory.key} selectedCategoryValues={selectedCategory.value} />
            </div>
          )}
        </div>
      }
        
    </>
  );
};

export default CreateProductComponent;
