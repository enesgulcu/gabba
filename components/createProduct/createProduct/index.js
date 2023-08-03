"use client"
import { useState, useEffect } from "react";
import { getAPI } from '@/services/fetchAPI';
import DropDownCatagories from "@/components/createProduct/createProduct/dropDownCatagories"
import DynamicTable from "@/components/createProduct/createProduct/dynamicTable"
import { ToastContainer, toast } from "react-toastify";


// özellikler ve alt özelliklerin verilerini çekmek için kullanılır
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
    },
  },
};

const CreateProductComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [data, setData] = useState({}); // Initialize data as an empty object

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
      if (!selectedSubCategory) {
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

      setData({[selectedCategory.key]: fetchedData });
    };

    fetchData();
  }, [selectedSubCategory, selectedCategory]);

  return (
    <>
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
      />
      <DropDownCatagories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {selectedCategory && selectedSubCategory && Object.keys(data).length > 0 ? (
        <div>
          <DynamicTable data={data} selectedCategoryKey={selectedCategory.key} selectedCategoryValues={selectedCategory.value} />
        </div>
      ) : (
        selectedCategory && <div>Yükleniyor...</div>
      )}
    </>
  );
};

export default CreateProductComponent;
