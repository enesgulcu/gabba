import {createNewDataMany, createNewData, getAllData, deleteDataByMany, getDataByUnique} from "@/services/serviceOperations";

/* 
  model Collections{
    id           String    @id @default(auto()) @map("_id") @db.ObjectId
    collectionCode String
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

    // her ürün için uniq olarak bir ürün kodu oluşturuyoruz #########################
    //################################################################################

    // gün - ay - yıl - saat olarak türkiye zamanını al ve her bir veriyi ayrı değişkenlere string olarak kaydet. yılın sadece son 2 rakamını al.
    const date = new Date().toLocaleString("tr-TR", {timeZone: "Europe/Istanbul"});
    const day = date.split(" ")[0].split(".")[0];
    const month = date.split(" ")[0].split(".")[1];
    const year = date.split(" ")[0].split(".")[2].slice(2,4);
    const hour = date.split(" ")[1].split(":")[0];
    const minute = date.split(" ")[1].split(":")[1];

    // collectionName değerinin ilk 2 ve son 2 harfini alarak ürün kodunu oluştur
    let collectionName;
    if(data.collectionName){
      collectionName = data.collectionName.slice(0,3).toUpperCase();
    }
    else{
      collectionName = "Name";
    }
    
    let collectionType;
    if(data.collectionType){
      collectionType = data.collectionType.slice(0,3).toUpperCase();
    }   
    else{
      collectionType = "Type";
    } 

        // resgele alfabeden iki büyük harf üret
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomAlphabet2 = alphabet[Math.floor(Math.random() * 26)] + alphabet[Math.floor(Math.random() * 26)];

    // rasgele 3 tane tam sayı rakam oluştur sonra bunları string olarak yan yana yaz.
    const randomAlphabet = Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + "" + randomAlphabet2;


    // ürün kodunu oluştur
      const collectionCode = (year + collectionName + month + collectionType + day + randomAlphabet).trim();
      
      // collectionsData içerisine oluşturulan collectionCode değerini ekle
      collectionsData.collectionCode = collectionCode;


      return { collectionsData, collectionProductsData, collectionImagesData };


    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  try {
    if (req.method === "POST"){

      const data = await req.body;

      if(!data.processType && data.processType !== "delete"){
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


// ### DELETE ############################################################################################################
      else if(data.processType === "delete"){
        
        // deleteDataByAny(tableName, where)
        const deleteCollection = await deleteDataByMany("Collections", {id: data.data});
        console.log("deleteCollection :", deleteCollection);
        
        if(deleteCollection.error || !deleteCollection){
          throw new Error(deleteCollection.message);
        }

        const deleteCollectionProducts = await deleteDataByMany("CollectionProducts", {collectionId: data.data});
        console.log("deleteCollectionProducts :", deleteCollectionProducts);
        if(deleteCollectionProducts.error || !deleteCollectionProducts){
          throw new Error(deleteCollectionProducts.message);
        }

        // resim var mı veri tabanını sorgula. varsa eğer eşleşen id değerindeki tüm resimleri sil.
        const deleteCollectionImages = await deleteDataByMany("CollectionImages", {collectionId: data.data});
          console.log("deleteCollectionImages :", deleteCollectionImages);

          if(deleteCollectionImages.error){
            throw new Error(deleteCollectionImages.message);
          }

        return res.status(200).json({ error: false, status:"success", message: "Koleksiyon başarıyla silindi."});       
        
      }

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
      const collection = {
        
          collectionsData: collectionsData,
          collectionProductsData: collectionProductsData,
          collectionImagesData: collectionImagesData
        
      }

      return res.status(200).json({ error: false, status:"success", message: "Koleksiyon başarıyla getirildi.", data: collection});

    }

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }


};

export default handler;