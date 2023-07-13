import { createNewData, getAllData, createNewDataMany } from "@/services/serviceOperations";

// girilen verileri göndermeden önce kontrol ederiz.
const checkData = async (measurements) => {

  // firstValue değeri olmayan değerleri sildik.
  const newMeasurements = measurements.filter(item => item.firstValue);

  // Number gelen değerleri stringe çeviriyoruz.
  newMeasurements.forEach((newMeasurement, index, arr) => {
    arr[index]['firstValue'] = newMeasurement.firstValue.toString();
    arr[index]['secondValue'] = newMeasurement.secondValue.toString();
  });


  newMeasurements.forEach((measurement, index) => {
    if(newMeasurements[index]){

//####################################################################################
      // ######### sadece " Tek Ölçü Ekleme Aktif " ise burası çalışır
      if(measurement.oneRangeEnabled){

        // eğer ölçü aralığı aktif değilse ve ikinci değer doluysa
        // ikinci değeri boşalt.
        if(measurement.secondValue){
          newMeasurements[index].secondValue = "";
        }

        // eğer bir ölçü varsa ancak unit değeri boş ise
        // unit değerini default olarak " cm " ata.
        if(!measurement.unit){
          newMeasurements[index].unit = 'cm';
        }

        // Tek Ölçü Ekleme bölümünde dil olamaz!
        if(measurement.turkish || measurement.ukrainian || measurement.english){
          newMeasurements[index].turkish = '';
          newMeasurements[index].ukrainian = '';
          newMeasurements[index].english = '';
        }

//####################################################################################
        // ######### sadece "Ölçü Aralığı Ekleme Aktif" ise burası çalışır
        else if(measurement.twoRangeEnabled){

          // eğer ölçü aralığı ekleme aktifse ve ikinci değer boşsa
          // ölçü aralığı ekleme aktifliğini kapat.
          if(measurement.twoRangeEnabled && !measurement.secondValue){
            newMeasurements[index].twoRangeEnabled = false;
          }

          // eğer bir ölçü varsa ancak unit değeri boş ise
          // unit değerini default olarak " cm " ata.
          if(!measurement.unit){
            newMeasurements[index].unit = 'cm';
          }

          //Ölçü Aralığı Ekleme bölümünde dil olamaz!
          if(measurement.turkish || measurement.ukrainian || measurement.english){
            newMeasurements[index].turkish = '';
            newMeasurements[index].ukrainian = '';
            newMeasurements[index].english = '';
          }

        }

//####################################################################################
        // ######### sadece " Manuel Ölçü Tanımlama Aktif " ise burası çalışır
        else if(measurement.manuelDefined){

          if(measurement.secondValue){
            newMeasurements[index].secondValue = false;
          }

          // eğer unit üzerinde bir ölçü varsa
          // unit değerini boşalt.
          if(measurement.unit){
            newMeasurements[index].unit = '';
          }
        }
      }
    }
    // yapılan kontroller sonrası güncel düzenlenmiş veriyi göndeririz.
    
  });
  
  if(newMeasurements.length > 0){
    return newMeasurements;
  }
  else{
    return false;
  }
};

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      
      const {measurements} = req.body;
      console.log(measurements)
      if(!measurements){
        throw "Veri alınamadı";
      } 
      
      // gelen verinin doğruluğunu kontrol ediyoruz.
      const checkedData = await checkData(measurements);

      if(!checkedData){
        return res.status(500).json({ status: "error", error: "veri yok"});
      }
      const createdNewData = await createNewDataMany("measurements", checkedData);

      if(!createdNewData || createdNewData.error){
        throw createdNewData;
      }

      return res.status(200).json({ status: "success", data:measurements, message: "Veri iletildi!" });
    }

    if(req.method === "GET"){
      const measurements = await getAllData("measurements");
      if (!measurements || measurements.error) {
        throw measurements;
      }
      return res.status(200).json({ status: "success", data: measurements });
    }

  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};

export default handler;
