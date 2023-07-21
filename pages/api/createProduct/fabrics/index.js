import { createNewData, getAllData, createNewDataMany, deleteDataByAny, updateDataByAny } from "@/services/serviceOperations";




const removeImageFromFabricData = (data) => {
  const newData = { ...data }; // Gelen veriyi kopyalayarak yeni bir nesne oluşturuyoruz

  // Eğer "fabrics" dizisi varsa ve içinde en az bir öğe varsa devam ediyoruz
  if (newData.fabrics && newData.fabrics.length > 0) {
    newData.fabrics.forEach((fabric) => {
      delete fabric.image; // "image" alanını her bir kumaş öğesinden kaldırıyoruz
    });
  }

  return newData; // "image" alanı kaldırılmış yeni veriyi döndürüyoruz
};


// girilen verileri göndermeden önce kontrol ederiz.
const checkData = async (fabrics) => {

  // gelen verilerden içerisindeki image verisini siliyoruz.
  const imageDeleted = await removeImageFromFabricData(fabrics);
  
  // firstValue değeri olmayan değerleri sildik.
  const newFabrics = await imageDeleted.filter(item => item.fabricType);

  // Number gelen değerleri stringe çeviriyoruz.
  newFabrics.forEach((newMeasurement, index, arr) => {
    arr[index]['fabricType'] = newMeasurement.fabricType.toString();
    arr[index]['fabricDescription'] = newMeasurement.fabricDescription.toString();
    arr[index]['fabricSwatch'] = newMeasurement.fabricSwatch.toString();
  });
  
  if(newFabrics.length > 0){

    return newFabrics;
  }
  else{
    return false;
  }
};

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const {fabrics, data, processType} = req.body;
      
      //silme işlemi için gelen veriyi sileriz.
      if(!fabrics && processType == "delete"){
        const deleteData = await deleteDataByAny("fabrics", {id: data.id});
        if(!deleteData || deleteData.error){
          throw deleteData;
        }
        return res.status(200).json({ status: "success", data:deleteData, message: deleteData.message });
      }

      else if(!fabrics && processType == "update"){

        // veri doğruluğunu test ediyoruz
        const checkedData = await checkData(data.fabrics);
        

        if(!checkedData && checkedData.error){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU2";
        }
        
        // id değerini silip yeni veriyi oluşturuyoruz.
        const NewDatawitoutId = checkedData.map(item => {
          const {id, ...newData} = item;
          return newData;
        });
        
        // veriyi güncelliyoruz.
        const updateData = await updateDataByAny("fabrics", {id: checkedData[0].id}, NewDatawitoutId[0]);

        if(!updateData || updateData.error){
          throw updateData;
        }
        
        return res.status(200).json({ status: "success", data:updateData, message: updateData.message });
      }

      else{
        if(!fabrics){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU1";
        } 
        
        // gelen verinin doğruluğunu kontrol ediyoruz.
        const checkedData = await checkData(fabrics);
        
        if(!checkedData){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU2";
        }
        
        const createdNewData = await createNewDataMany("fabrics", checkedData);

        if(!createdNewData || createdNewData.error){
          throw createdNewData; //"Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU3";
        }
        return res.status(200).json({ status: "success", data:checkedData, message: fabrics.message });
      }      
    }


    if(req.method === "GET"){
      const fabrics = await getAllData("fabrics");
      if (!fabrics || fabrics.error) {
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU4";
      }
      return res.status(200).json({ status: "success", data: fabrics, message: fabrics.message });
    }

  } catch (error) {
    return res.status(500).json({ status: "error", error, message: error.message  });
  }
};

export default handler;
