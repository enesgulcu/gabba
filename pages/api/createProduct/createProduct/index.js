import {createNewProduct, getAllData, deleteDataByAny, updateDataByAny } from "@/services/serviceOperations";

const handler = async (req, res) => {

  // extra ve image verileri içi boş olanları temizlenecek.
  const checkData = async (data) => {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error("Veri eksik veya geçersiz.");
      }
  
      // extraValue ve imageValue boş olanları temizliyoruz. ################## (1 start) ##################
      if (!data.productFeatures || !Array.isArray(data.productFeatures)) {
        throw new Error("productFeatures dizi olarak belirtilmemiş.");
      }
  
      const processedFeatures = data.productFeatures.filter(item => {
        if (item.feature === 'Extra' && (!item.extraValue || item.extraValue.trim() === '')) {
          return false;
        }
        if (item.feature === 'Image' && (!item.imageValue || item.imageValue.trim() === '')) {
          return false;
        }

        return true;
      });
  
      const processedData = {
        productName: data.productName,
        productType: data.productType,
        selectedCategoryKey: data.selectedCategoryKey,
        selectedCategoryValues: data.selectedCategoryValues,
        productFeatures: processedFeatures
      };

      return processedData;
      // extraValue ve imageValue boş olanları temizliyoruz. ################## (1 end) ##################

    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  
  try {
    if (req.method === "POST") {
      
      const {data, processType} = await req.body;
      
      const checkedData = await checkData(data);
      console.log(checkedData);

      if(!checkedData && checkedData.error){
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU2";
      }

      //silme işlemi için gelen veriyi sileriz.
      else if(processType == "delete"){

        const deleteData = await deleteDataByAny("Products", {id: checkedData.id});
        if(!deleteData || deleteData.error){
          throw deleteData;
        }
        return res.status(200).json({ status: "success", data:checkedData, message: deleteData.message });
      }

      else if(processType == "update"){        

        // id değerini silip yeni veriyi oluşturuyoruz.
        const NewDatawitoutId = checkedData.map(item => {
          const {id, ...newData} = item;
          return newData;
        });
        
        // veriyi güncelliyoruz.
        const updateData = await updateDataByAny("Products", {id: checkedData[0].id}, NewDatawitoutId[0]);

        if(!updateData || updateData.error){
          throw updateData;
        }
        
        return res.status(200).json({ status: "success", data:updateData, message: updateData.message });
      }

      else if(data && processType == "post"){

        const createProducts = await createNewProduct("Products", checkedData);


        if(!createProducts || createProducts.error){
          throw createProducts; //"Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU3";
        }
        return res.status(200).json({ status: "success", data:checkedData, message: createProducts.message });
      }
      
      else{
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KGG3SS";
      }
    }


    if(req.method === "GET"){
      const createProducts = await getAllData("Products");
      const productFeatures = await getAllData("ProductFeature");

      
      if(!createProducts || createProducts.error){
        throw createProducts;
      }
      if(!productFeatures || productFeatures.error){
        throw productFeatures;
      }

      return res.status(200).json({ status: "success", data:{createProducts, productFeatures}, message: "createProducts.message" });
    }

  } catch (error) {

    return res.status(500).json({ status: "error", error, message: error.message  });
  }
};

export default handler;
