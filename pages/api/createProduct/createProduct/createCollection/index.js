import {createNewDataMany, createNewData, getAllData} from "@/services/serviceOperations";

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
    productCode  String
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

      if (result.error || !result) {
        throw new Error(result.message);
      }
//____________________________________________________________________________________________________________________
//collectionsData ####################################################################################################
      
        // Koleksiyon oluşturuldu veri tabanına kaydedildi
        const collectionsData = await createNewData("Collections", result.collectionsData);

        if (collectionsData.error || !collectionsData) {
          throw new Error(collectionsData.message);
        }


//ProductsData #############################################################################################

      if(result.collectionProductsData){
        
        // collectionsData.id değerini collectionProductsData içerisine collectionId olarak ekle.
        await result.collectionProductsData.map((item) => {
          item.collectionId = collectionsData.id;
      });
      
      // Koleksiyonun sahip olduğu ürünler oluşturuldu veri tabanına kaydedildi
      const collectionProductsData = await createNewDataMany("CollectionProducts", result.collectionProductsData);

      if (collectionProductsData.error || !collectionProductsData) {
        throw new Error(collectionProductsData.message);
      }
      }


//ImagesData ###############################################################################################
      
      let collectionImagesData;
      if(result.collectionImagesData && result.collectionImagesData.length > 0){ 

        //collectionsData.id değerini collectionImagesData içerisine collectionId olarak ekle.
        await result.collectionImagesData.map((item) => {
          item.collectionId = collectionsData.id;
        });

        // Koleksiyonun sahip olduğu resimler oluşturuldu veri tabanına kaydedildi
        collectionImagesData = await createNewDataMany("CollectionImages", result.collectionImagesData);


        if (collectionImagesData.error || !collectionImagesData) {
          throw new Error(collectionImagesData.message);
        }
      }
//____________________________________________________________________________________________________________________
      

      return res.status(200).json({ error: false, status:"success", message: "Koleksiyon başarıyla oluşturuldu."});

    }

    if (req.method === "GET"){
      const collectionsData = await getAllData("Collections");

      if (collectionsData.error || !collectionsData) {
        throw new Error(collectionsData.message);
      }

      const collectionProductsData = await getAllData("CollectionProducts");
      
      if (collectionProductsData.error || !collectionProductsData) {
        throw new Error(collectionProductsData.message);
      }

      const collectionImagesData = await getAllData("CollectionImages");

      // collectionsData içerisine collectionProducts ve collectionImages objelerini direkt ekle
      await collectionsData.push({collectionProducts: collectionProductsData, collectionImages: collectionImagesData})

      console.log(collectionsData);

      return res.status(200).json({ error: false, status:"success", message: "Koleksiyon başarıyla getirildi.", data: collectionsData});

    }

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }


};

export default handler;
