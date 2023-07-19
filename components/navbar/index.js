// components/Navbar.js
"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = ({ links }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenSubMenuIndex(null); // Ana menüyü açarken alt menüleri kapat
  };

  const handleSubMenuToggle = (index) => {
    // Alt menüyü açarken diğer alt menüleri kapat
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Ana menüyü açık tutmak için
  const handleMenuMouseEnter = () => {
    setIsMenuOpen(true);
  };

  // Ana menüyü kapalı tutmak için
  const handleMenuMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="w-full mx-auto">
        <div
          className="flex flex-col md:flex-row md:justify-around justify-between items-center"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          <div className="w-full md:w-auto flex flex-row md:justify-around justify-between items-center">
            <div className="text-white font-bold text-xl">Logo</div>
            <div className="md:hidden">
              <button
                onClick={handleMenuToggle}
                className="text-white focus:outline-none focus:bg-gray-700 px-3 py-2"
              >
                {isMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden md:block'
            } md:flex md:space-x-4 md:items-center`}
          >
            {links.map((link, index) => (
              <div key={index} className="relative">
                {link.submenu ?(
                  <>
                    <button
                      onMouseEnter={() => handleSubMenuToggle(index)}
                      
                      className="text-white hover:bg-gray-700 px-3 py-2 rounded-md md:inline-block"
                    >
                      {link.text}
                      <svg
                        className={`w-5 h-5 inline ml-1 transition-transform ${
                          openSubMenuIndex === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {openSubMenuIndex === index && (
                      <div className="absolute bg-gray-800 rounded-md shadow-md mt-2 py-2 w-40 z-40 md:left-0"
                      onMouseLeave={() => handleSubMenuToggle(index)}
                      
                      >
                        {link.submenu.map((sublink, subIndex) => (
                          <Link href={sublink.url} key={subIndex}>
                            <div className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md">
                              {sublink.text}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={link.url} key={index}>
                    <div className="text-white hover:bg-gray-700 px-3 py-2 rounded-md md:inline-block">
                      {link.text}
                    </div>
                  </Link>
                )}
              </div>
            ))}
            <button className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md md:inline-block">
              Button
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






