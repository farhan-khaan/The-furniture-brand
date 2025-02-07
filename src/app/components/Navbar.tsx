"use client";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { motion } from "framer-motion";
// import type { ImageUrlBuilder } from "@sanity/image-url";


const sanity = sanityClient({
  projectId: "5q8erzvb",
  dataset: "production",
  apiVersion: "2024-01-04",
  useCdn: true,
});

const builder = imageUrlBuilder(sanity);
// const urlFor = (source: Parameters<ImageUrlBuilder["image"]>[0]) =>
//   builder.image(source).url();

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  discountPercentage?: number;
  tags: string[];
}

const Navbar: React.FC<{ cart: Product[]; removeFromCart: (id: string) => void }> = ({ cart, removeFromCart }) => {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div>
      <nav className="flex items-center justify-between px-5 py-4 bg-white shadow-md">
        <div className="text-2xl font-semibold">Avion</div>
        <div className="flex space-x-4">
          <HiOutlineShoppingCart size={24} className="cursor-pointer" onClick={() => setCartOpen(!cartOpen)} />
          <FaRegUserCircle size={24} />
        </div>
      </nav>
      {/* Shopping Cart Sidebar */}
      <motion.div initial={{ x: "100%" }} animate={{ x: cartOpen ? "0%" : "100%" }} transition={{ duration: 0.3 }} className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-5 z-50 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={() => setCartOpen(false)} className="text-xl font-bold cursor-pointer">✕</button>
        </div>
        <div className="mt-4">
          {cart?.length > 0 ? (
            <ul className="space-y-4">
              {cart?.map((item) => (
                <li key={item._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow">
                  <div>
                    <p className="text-gray-900 font-medium">{item.name}</p>
                    <p className="text-blue-600 font-bold text-sm">${item.price.toFixed(2)}</p>
                  </div>
                  <Image src={item.image || "/placeholder.png"} alt={item.name} width={50} height={50} className="rounded-lg" />
                  <button className="text-red-500 font-semibold hover:underline" onClick={() => removeFromCart(item._id)}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty!</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;