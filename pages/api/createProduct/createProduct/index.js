import {createNewProduct, getAllData, deleteDataByAny, updateDataByAny } from "@/services/serviceOperations";


// girilen verileri göndermeden önce kontrol ederiz.
const checkData = async (createProducts) => {
  
  // firstValue değeri olmayan değerleri sildik.
  const newCreateProducts = await createProducts.filter(item => item.colourType);
  
  //newCreateProducts içinden image ve ColourPickerEnabled key value değerlerini siliyoruz.
  newCreateProducts.forEach((newColour, index, arr) => {
    delete arr[index]['image'];
    //delete arr[index]['ColourPickerEnabled'];
  });


  // Number gelen değerleri stringe çeviriyoruz.
  newCreateProducts.forEach((newColour, index, arr) => {
    arr[index]['colourType'] = newColour.colourType.toString();
    arr[index]['colourDescription'] = newColour.colourDescription.toString();
  });
  
  if(newCreateProducts.length > 0){

    return newCreateProducts;
  }
  else{
    return false;
  }
};

const handler = async (req, res) => {
  
  try {
    if (req.method === "POST") {
      const {data, processType} = req.body;

      //silme işlemi için gelen veriyi sileriz.
      if(data && processType == "delete"){
         
        const deleteData = await deleteDataByAny("createProducts", {id: data.id});
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
        const updateData = await updateDataByAny("createProducts", {id: checkedData[0].id}, NewDatawitoutId[0]);

        if(!updateData || updateData.error){
          throw updateData;
        }
        
        return res.status(200).json({ status: "success", data:updateData, message: updateData.message });
      }

      else if(data && processType == "post"){
        if(!data){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY1";
        } 
        
        // gelen verinin doğruluğunu kontrol ediyoruz.
        //const checkedData = await checkData(createProducts);

        
        // if(!checkedData || checkedData.error){
        //   throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY2";
        // }

        // kontroller yapılacak!
        const createdNewData = await createNewProduct("Products", data);


        if(!createdNewData || createdNewData.error){
          throw createdNewData; //"Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU3";
        }
        return res.status(200).json({ status: "success", data:"checkedData", message: "createProducts.message" });
      }
      
      else{
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KGG3";
      }
    }


    if(req.method === "GET"){
      const createProducts = await getAllData("createProducts");
      if (!createProducts || createProducts.error) {
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4";
      }
      return res.status(200).json({ status: "success", data: createProducts, message: createProducts.message });
     }

  } catch (error) {
    return res.status(500).json({ status: "error", error, message: error.message  });
  }
};

export default handler;
