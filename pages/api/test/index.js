import { createNewData, getAllData, createNewDataMany } from "@/services/serviceOperations";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      
      const data = req.body;
      if(!data){
        throw "Veri alınamadı";
      }   

      console.log(data);
      const createdNewData = await createNewDataMany("measurements", data);

      if(!createdNewData || createdNewData.error){
        throw createdNewData;
      }

      return res.status(200).json({ status: "success", data:data, message: "Veri iletildi!" });
    }

    if(req.method === "GET"){
      const data = await getAllData("measurements");
      if (!data || data.error) {
        throw data;
      }
      return res.status(200).json({ status: "success", data: data });
    }

  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};

export default handler;
