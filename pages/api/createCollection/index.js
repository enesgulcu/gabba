import {getAllData} from "@/services/serviceOperations";

const handler = async (req, res) => {
  
  try {
    if (req.method === "POST") {

    }


    if(req.method === "GET"){
      const createCollection = await getAllData("Products");

      
      if(!createCollection || createCollection.error){
        throw createCollection;
      }

      return res.status(200).json({ status: "success", data:createCollection, message: createCollection.message });
    }

  } catch (error) {

    return res.status(500).json({ status: "error", error, message: error.message  });
  }
};

export default handler;
