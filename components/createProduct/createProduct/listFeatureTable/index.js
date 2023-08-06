import {useState, useEffect} from 'react'
import { getAPI } from '@/services/fetchAPI';

const ListFeatureTable = () => {

  const [data, setData] = useState([]);

  const getData = async () => {
    try {
        const response = await getAPI('/createProduct/createProduct');
        //setIsloading(false);
        if(response.status !== "success"){
            
            throw new Error("Veri çekilemedi 1");
        }
        
        setData(response.data);
    } catch (error) {
        //toast.error(error.message);
        console.log(error);
    }
}

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    if(!data){
      return;
    }
    console.log(data);
  }, [data])
  
  // gelen verileri tablo haline getiriyoruz ve listeliyoruz.
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Ürün Tipi</th>
            <th>Seçilen Kategori</th>
          </tr>
        </thead>
        <tbody>
          {
            data.createProducts && data.createProducts.length > 0 && data.createProducts.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.productType}</td>
                <td>{item.selectedCategoryValues}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {/* {
        data.createProducts && data.createProducts.length > 0 && data.createProducts.map((item, index) => (
          <div key={index} className='w-full p-2 shadow-lg flex justify-center items-center'>
             <div className='p-2 m-2 flex flex-col justify-center items-center'>
                <div>Ürün Adı</div>
                <div>{item.productName}</div>
             </div>
             <div className='p-2 border-gray-200 rounded border m-2'>{item.productType}</div>
             <div className='p-2 border-gray-200 rounded border m-2'>{item.selectedCategoryValues}</div>

          </div>
        ))
      } */}
    </div>
  )
}

export default ListFeatureTable
