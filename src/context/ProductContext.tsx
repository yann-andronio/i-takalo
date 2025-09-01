// context/ProductContext.tsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import API from "../api/Api";
import { ImageSourcePropType } from "react-native";

export interface ProductDataI {
  id: number;
  title: string;
  image: string;
  type: "SALE" | "DONATION";
  description?: string;
  author?: number;
  likes: number[];
  category:string
  price:number
  created_at: string;
  adresse?: string; 
  updated_at: string; 
}

interface ProductContextType {
  products: ProductDataI[];
  loading: boolean;
  fetchProducts: () => void;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: false,
  fetchProducts: () => {},
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductDataI[]>([]);
  const [loading, setLoading] = useState(false);

 
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/v1/products/");
      const fetchedProducts = res.data.dataset as ProductDataI[];
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};