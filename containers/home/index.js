
import React from 'react'
import MeasurementsComponent from "../../components/createProduct/MeasurementsComponent/mainComponent"
import Navbar from "@/components/navbar"

const HomeContainer = async () => {  

  const links = [
    { url: '/', text: 'Home' },
    { url: '/about', text: 'About' },
    { url: '/services', text: 'Services' },
    {
      url: '/products',
      text: 'Products',
      submenu: [
        { url: '/products/category1', text: 'Category 4' },
        { url: '/products/category2', text: 'Category 5' },
        { url: '/products/category3', text: 'Category 6' },
      ],
    },
    // Diğer linkleri burada da tanımlayabilirsiniz
  ];

  return (
    <>
      <Navbar links={links}/>
      <MeasurementsComponent/>
    </>
  )
}

export default HomeContainer;
