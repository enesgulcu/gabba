import {createNewDataMany, createNewProduct,  getAllData, deleteDataByAny, updateProduct, deleteDataByMany } from "@/services/serviceOperations";

/* 
  model Collections{
    id           String    @id @default(auto()) @map("_id") @db.ObjectId
    collectionName String
    collectionType String
    collectionDescription String?

    collectionNameTR String?
    collectionTypeTR String?
    collectionDescriptionTR String?

    collectionNameUA String?
    collectionTypeUA String?
    collectionDescriptionUA String?

    collectionNameEN String?
    collectionTypeEN String?
    collectionDescriptionEN String?
  }

  model CollectionProducts{
    id           String    @id @default(auto()) @map("_id") @db.ObjectId
    collectionId String
    productId    String
    prodcutCode  String
    productName  String
  }

  model collectionImages{
    id              String    @id @default(auto()) @map("_id") @db.ObjectId
    collectionId    String
    collectionImage String
  }
*/

const handler = async (req, res) => {

  // extra ve image verileri içi boş olanları temizlenecek.
  const checkData = async (data) => {
    try {
     
      const collectionProductsData = await data.collectionProducts;
      const collectionImagesData = await data.collectionImages;

      // collectionProducts ve collectionImages verilerini data içerisinden sil.
      delete data.collectionProducts;
      delete data.collectionImages;
      const collectionsData = await data;

      if(!collectionsData.collectionName || !collectionsData.collectionType){
        throw new Error("Koleksiyon adı ve tipi boş bırakılamaz.");
      }

      if(!collectionProductsData || collectionProductsData.length < 1){
        throw new Error("Koleksiyonda en az 1 ürün olmazı gerekmektedir.");
      }

      return { collectionsData, collectionProductsData, collectionImagesData };


    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  try {
    if (req.method === "POST"){

      const data = await req.body;
      const result = await checkData(data);
      
      console.log("result :", result);

      if (result.error || !result) {
        throw new Error(result.message);
      }
      
      const collectionsData = await createNewProduct("Collections", result.collectionsData);
      console.log("collectionsData :", collectionsData)
      if (collectionsData.error || !collectionsData) {
        throw new Error(collectionsData.message);
      }

      const collectionProductsData = await createNewDataMany("CollectionProducts", result.collectionProductsData);
      console.log("collectionProductsData :", collectionProductsData);

      if (collectionProductsData.error || !collectionProductsData) {
        throw new Error(collectionProductsData.message);
      }

      const collectionImagesData = await createNewDataMany("CollectionImages", result.collectionImagesData);
      console.log("collectionImagesData :", collectionImagesData);

      if (collectionImagesData.error || !collectionImagesData) {
        throw new Error(collectionImagesData.message);
      }

      return res.status(200).json({ error: false, message: "Koleksiyon başarıyla oluşturuldu.", data: createNewDataManyResult });

    }

    if (req.method === "GET"){

    }

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }


};

export default handler;
