import {createNewProduct, getAllData, deleteDataByAny, updateProduct, deleteDataByMany } from "@/services/serviceOperations";

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
        productCode: data.productCode,
        productName: data.productName,
        productType: data.productType,
        selectedCategoryKey: data.selectedCategoryKey,
        selectedCategoryValues: data.selectedCategoryValues,
        productFeatures: processedFeatures,

        productNameTR: data.productNameTR,
        productTypeTR: data.productTypeTR,
        productCategoryTR: data.productCategoryTR,

        productNameUA: data.productNameUA,
        productTypeUA: data.productTypeUA,
        productCategoryUA: data.productCategoryUA,

        productNameEN: data.productNameEN,
        productTypeEN: data.productTypeEN,
        productCategoryEN: data.productCategoryEN,
      };

      // processedData içerisinde boş olan değer olmayanları temizliyoruz.
      Object.keys(processedData).forEach(key => {
        if (processedData[key] === undefined || processedData[key] === null || processedData[key] === '') {
          delete processedData[key];
        }
      });
      
      return processedData;
      // extraValue ve imageValue boş olanları temizliyoruz. ################## (1 end) ##################

    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  
  try {
    if (req.method === "POST") {
      
      const {data, processType, process=null} = await req.body;
      ;
      // gelen verileri kontrol fonksiyonunua gönderiyoruz.
      const checkedData = await checkData(data);
      
      if(!checkedData && checkedData.error){
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU2";
      }

      //silme işlemi için gelen veriyi sileriz.
      else if (processType == "delete") {
        // NOT: Burada productFeature ve product verileri birbirine bağlı olduğu için önce productFeature verileri silinmesi gerekiyor. bu sayade bağ koparılır.
        try {
          // Önce ProductFeature verilerini sil
          if(process == "deleteProduct"){
            // data: 64c4ac2c36677515eec15f85
            const deleteProductFeatureData = await deleteDataByMany("ProductFeature", {
              productId: data,
            });
  
            if (!deleteProductFeatureData || deleteProductFeatureData.error) {
              throw new Error("Ürün özellikleri silinemedi.");
            }

            // ProductFeature verileri başarılı şekilde silindiyse, şimdi Products verisini sil
            const deleteProductData = await deleteDataByAny("Products", { id: data });
        
            if (!deleteProductData || deleteProductData.error) {
              throw new Error("Ürün silinemedi.");
            }
        
            return res.status(200).json({status: "success",message: "Ürün ve ürün özellikleri başarıyla silindi."});
          }


          if(process == "deleteFeature"){
            // data:{
            //   featureId: '64c4ac3336677515eec15f86',
            //   productId: '64daeb7ef75baae29340e3d7'
            // }
            let deleteProductFeatureData = await deleteDataByMany("ProductFeature", data);

            if (!deleteProductFeatureData || deleteProductFeatureData.error) {
              throw new Error("Ürün özellikleri silinemedi.");
            }

            if(!deleteProductFeatureData.count){
              // IAMGE ve EXTRA için özel olarak silme işlemi yapılıyor.
              // featureId yerine direk id ile eşleştiririz.
              deleteProductFeatureData = await deleteDataByAny("ProductFeature", {id: data.featureId});
            }

            if (!deleteProductFeatureData || deleteProductFeatureData.error) {
              throw new Error("Ürün özellikleri silinemedi.");
            }

          
            if(deleteProductFeatureData.count == 0){
              throw new Error("Silinecek ürün özellikleri bulunamadı.");
            }

            return res.status(200).json({status: "success",message: "Ürün özelliği başarıyla silindi."});
            
          }
        } catch (error) {
          return res.status(500).json({
            status: "error",
            message: error.message,
          });
        }
      }

      // güncelleme işlemi için gelen veriyi güncelleriz.
      else if(processType == "update"){ 

        // checkedData {
        //   productCode: '23T108T218FU37',
        //   productName: 't1',
        //   productType: 't2',
        //   selectedCategoryKey: 'furniture',
        //   selectedCategoryValues: 'Mobilya',
        //   productFeatures: [
        //     {
        //       id: '64df87e9c8efeeb303c3c905',
        //       index: 1,
        //       feature: 'Ölçüler',
        //       featureId: '64c4ac3336677515eec15f86',
        //       targetValue: 'standard',
        //       checked: true,
        //       value: null,
        //       imageValue: null,
        //       extraValue: null,
        //       productId: '64df87e8c8efeeb303c3c903',
        //       productName: 't1',
        //       productType: 't2',
        //       selectedCategoryKey: 'furniture',
        //       selectedCategoryValues: 'Mobilya',
        //       createdAt: '2023-08-18T15:02:00.250Z',
        //       updatedAt: '2023-08-18T15:02:00.250Z'
        //     }
        //   ]
        // }
        
        // enes burada kaldın.
        console.log("checkedData", checkedData);

        return res.status(200).json({ status: "success", data:checkedData, message: createProducts.message });
        
      }

      // yeni veri oluşturuyoruz.
      
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
