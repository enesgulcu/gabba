import {createNewProduct, getAllData, deleteDataByAny, updateDataByAny } from "@/services/serviceOperations";

const handler = async (req, res) => {

  // extra ve image verileri içi boş olanları temizlenecek.
  const checkData = async (data) => {
    try {
      //####################################################### ENES BURAYA BAK!
    } catch (error) {
      return {error: true, message: error.message};
    }
  }

  
  try {
    if (req.method === "POST") {
      const {data, processType} = req.body;

      //silme işlemi için gelen veriyi sileriz.
      if(data && processType == "delete"){
         
        const deleteData = await deleteDataByAny("Products", {id: data.id});
        if(!deleteData || deleteData.error){
          throw deleteData;
        }
        return res.status(200).json({ status: "success", data:deleteData, message: deleteData.message });
      }

      else if(data && processType == "update"){

        // veri doğruluğunu test ediyoruz
        const checkedData = await checkData(data.createProducts);
       

        if(!checkedData && checkedData.error){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU2";
        }
        
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
        if(!data){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY1SS";
        } 

         console.log(await checkData(data));
        const createdNewData = await createNewProduct("Products", data);


        if(!createdNewData || createdNewData.error){
          throw createdNewData; //"Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU3";
        }
        return res.status(200).json({ status: "success", data:"checkedData", message: "createProducts.message" });
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
