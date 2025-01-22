"use client";
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import  { useEffect, useState } from "react";
import sanityClient from "@sanity/client";
import Image from "next/image";

const sanity = sanityClient({
  projectId: '5q8erzvb', // Replace with your project ID
  dataset: 'production', // Or your dataset name
  apiVersion: '2024-01-04', // Today's date or latest API version
  useCdn: true, // Disable CDN for real-time updates
  //token: "skByVTxZKXxtWJnz77XOyGiIgq4UG3FfNPKOa1k7Fmn9ti98LYXJQ3poetEwnrUMlYUGPpeOcLYHYGI4RaehDHdoXYRS9XKhU43JPiEF9uSiXFqUiCgQ1JmdVURWgbfXqNVrEAJhDTH5iUjGDRwSLvyF3he9zomI0ROirIqRQ2jrF0KVAY3l"
});

interface Category {
    image: any;
    _id : string;
    name : string;
    slug : number;
}

const Navbar: React.FC = () => {
  const [category, setCategory]= useState<Category[]>([]);
  const fetchCategory = async () => {
    try {
        const query =` *[_type == "category"] {
            _id, name, slug, 
          }`
        const data = await sanity.fetch(query);
        console.log(data, "this is category  data")
        setCategory(data);
    } 
    catch (error){
        console.log("Error Fatching product",error);
    }
}
useEffect(()=> {
  fetchCategory(); 
        
    },[]);



  return (
    <div>
    
      <nav className="flex items-center justify-between px-5 py-4">
    
        <div>
          <IoIosSearch size={24} />
        </div>

        <div className="text-2xl font-semibold">Avion</div>

        <div className="flex space-x-4">
          <HiOutlineShoppingCart size={24} />
          <FaRegUserCircle size={24} />
        </div>
      </nav>

 
      <div>
        <ul className="flex items-center justify-center space-x-5 md:space-x-10 py-4 text-sm md:text-base flex-wrap">
          
          {category.map((category) => (
          <li key= {category._id} className="hover:underline cursor-pointer">{category.name}</li>
        ))}
          
          


        </ul>
      </div>
    </div>
  );
};

export default Navbar;
