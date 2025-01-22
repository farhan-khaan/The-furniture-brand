"use client";
import React, { useEffect, useState } from "react";
import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";

const sanity = sanityClient({
  projectId: "5q8erzvb", 
  dataset: "production", 
  apiVersion: "2024-01-04", 
  useCdn: true, 
});

// Initialize the image URL builder
const builder = imageUrlBuilder(sanity);

// Helper function to build image URLs
const urlFor = (source: string) => builder.image(source).url();

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  discountPercentage?: number;
  tags: string[];
}

const ProductCards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  // Fetch products from Sanity
  const fetchProducts = async () => {
    try {
      const query = `*[_type == "product"] {
        _id,
        name,
        price,
        description,
        "image": productImage.asset->url, // Fetch full image URL
        discountPercentage,
        tags
      }`;
      const data: Product[] = await sanity.fetch(query);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} has been added to your cart!`);
  };

  // Truncate long descriptions
  const truncateDescription = (description: string) => {
    return description.length > 100
      ? `${description.slice(0, 100)}...`
      : description;
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-gray-800 text-3xl font-extrabold text-center mb-10">
        Our Products
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <Image
              src={product.image || "/placeholder.png"} 
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-56 object-cover rounded-lg mb-4"
              placeholder="blur"
              blurDataURL="/placeholder.png"
            />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {truncateDescription(product.description)}
            </p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-semibold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
              {product.discountPercentage && (
                <span className="text-xs text-red-500 font-semibold bg-red-100 px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 text-gray-700 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Cart Summary</h2>
        {cart.length > 0 ? (
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow"
              >
                <div>
                  <p className="text-gray-900 font-medium">{item.name}</p>
                  <p className="text-blue-600 font-bold text-sm">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <Image
                  src={item.image || "/placeholder.png"} 
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            Your cart is empty! Choose a product.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCards;
