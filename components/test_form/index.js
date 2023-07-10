"use client"
import React from 'react'
import {postAPI, getAPI} from '@/services/fetchAPI';
import { Formik, Form, FieldArray, Field } from "formik";
import { useState , useEffect} from 'react';
import { MdOutlineCancel } from "react-icons/md";

 const Test_form = () => {

  const [listData, setListData] = useState();

  useEffect(() => {
    console.log(listData);
  }, [listData])
  

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await getAPI("/test");
      if (!responseData || responseData.status !== "success" || responseData.status == "error") {
        return "VERİ YOK!";
      } else {
        setListData(responseData.data);
      }
    }

    fetchData();


  }, [])

    
    
    const [measurements, setMeasurements] = useState([
        { firstValue: "",secondValue: "", unit: 'cm', isRangeEnabled: true },
    ]);

    
    const addMeasurement = () => {
        setMeasurements([...measurements, { firstValue: "", secondValue: "", unit: 'cm', isRangeEnabled: true }]);
      };

    const removeMeasurement = () => {
        const newMeasurements = [...measurements];
        newMeasurements.forEach((measurement, index) => {
          if(newMeasurements[index] && newMeasurements[index].firstValue === ""){
            //eğer ilk değer boş ise bu ölçümü sil
            
            
            const filteredData = newMeasurements.filter(item => item.firstValue !== "");
            if(filteredData.length === 0){
              filteredData.push({ firstValue: "", secondValue: "", unit: 'cm', isRangeEnabled: true })
            }
            setMeasurements(filteredData);
            
          }
          else if (newMeasurements[index] && !newMeasurements[index].isRangeEnabled){
            newMeasurements[index].secondValue = ""
            setMeasurements(newMeasurements);
          }
          
        });
        
        
      };

  return (
    <div className='w-full'>
      <Formik
        initialValues={{
          data: measurements,
        }}
        //validationSchema={resetPasswordValidationSchema}

        onSubmit={async () => {
          const data = measurements;

          const responseData = await postAPI("/test", data);
          if (responseData.status !== "success" || responseData.status == "error") {
            console.log(responseData.error);
          } else {
            console.log("işlem başarılı!");
          }
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>

                  <div>
                    {measurements.map((measurement, index) => (
                      <div
                        key={index}
                        className={`hover:bg-yellow-400 py-4 transition-all w-full flex-col md:flex-row flex flex-wrap justify-center items-center gap-4 ${
                          index % 2 ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        <label
                          htmlFor={`measure-${index}`}
                          className="inline-block whitespace-nowrap font-semibold"
                        >
                          {measurements[index].isRangeEnabled
                            ? <div className='flex justify-start items-center flex-row gap-2'><span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${index + 1}`}</span> - Ölçü Aralığı Ekle</div>
                            : <div className='flex justify-start items-center flex-row gap-2'><span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${index + 1}`}</span> - Ölçü Ekle</div>}
                        </label>

                        <div className="flex items-center gap-2 lg:gap-10 xl:gap-16 flex-wrap flex-col md:flex-row">
                          <input
                            id={`measurements.${index}.firstValue`}
                            name={`measurements.${index}.firstValue`}
                            type="number"
                            className={`border border-gray-300 rounded-md p-2 `}
                            placeholder="Ölçü Değeri"
                            value={measurements[index].firstValue || ""}
                            
                            onChange={(e) => {
                              const newMeasurements = [...measurements];
                              newMeasurements[index].firstValue =
                                e.target.value;
                              setMeasurements(newMeasurements);
                            }}
                          />

                          <input
                            id={`measurements.${index}.secondValue`}
                            name={`measurements.${index}.secondValue`}
                            type="number"
                            className={`border border-gray-300 rounded-md p-2 ${
                              measurements[index].isRangeEnabled
                                ? "block"
                                : "hidden"
                            }`}
                            placeholder="Ölçü Değeri"
                            value={measurements[index].secondValue || ""}
                            onChange={(e) => {
                              const newMeasurements = [...measurements];
                              newMeasurements[index].secondValue =
                                e.target.value;
                              setMeasurements(newMeasurements);
                            }}
                          />

                          <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
                            <div className="flex gap-4">
                              <label
                                className="inline-block whitespace-nowrap"
                                htmlFor={`measure-${index}`}
                              >
                                Ölçü Aralığı Gir:{" "}
                              </label>

                              <input
                                type="checkbox"
                                id={`measurements.${index}.isRangeEnabled`}
                                name={`measurements.${index}.isRangeEnabled`}
                                className="border border-gray-300 rounded-md p-2 w-6 h-6"
                                checked={measurement.isRangeEnabled}
                                onChange={(e) => {
                                  const newMeasurements = [...measurements];
                                  newMeasurements[index].isRangeEnabled =
                                    e.target.checked;
                                  setMeasurements(newMeasurements);
                                }}
                              />
                            </div>

                            <select
                              id={`measurements.${index}.unit`}
                              name={`measurements.${index}.unit`}
                              defaultValue="cm"
                              className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              onChange={(e) => {
                                const newMeasurements = [...measurements];
                                newMeasurements[index].unit = e.target.value;
                                setMeasurements(newMeasurements);
                              }}
                            >
                              <option value="cm">cm</option>
                              <option value="mm">mm</option>
                              <option value="m">m</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                const updatedMeasurements = measurements.filter(
                                  (item) => item !== measurements[index]
                                );
                                setMeasurements(updatedMeasurements);
                              }}
                            >
                              <p className="bg-red-600 text-white p-2 rounded-md">
                                {" "}
                                <MdOutlineCancel size={25} />{" "}
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full flex justify-center items-center gap-4 my-6">
                    <button
                      type="button"
                      onClick={addMeasurement}
                      className="px-3 py-2 rounded-md bg-blue-500 text-white"
                    >
                      Yeni Ölçü Ekle
                    </button>

                    <button
                      onClick={() => removeMeasurement()}
                      type="submit"
                      className="px-4 py-2 rounded-md bg-green-500 text-white"
                    >
                      Gönder
                    </button>
                  </div>
          </Form>
        )}
      </Formik>
      <div className='w-full mt-6 flex-row flex-wrap justify-center items-center'>
        <div className='w-full flex justify-center items-center p-2 bg-black text-white font-bold text-xl'>
          <h4>Ölçü Listesi</h4>
        </div>
        {
          listData &&   listData.map((item, index) => (
            <div key={index} className={`p-4 ${index % 2 ? "bg-white" : "bg-gray-100"}`}>
              {index+1} - <span className='ml-4 bg-blue-100 p-2 rounded-lg'>{item.firstValue} - {item.secondValue} {item.unit}</span>
            </div>
          
          ))
        }
      </div>
    </div>
  );
}

export default Test_form;
