import React, { createContext, useState, useEffect } from 'react';
import API from '../api/Api';
import { ImageSourcePropType } from 'react-native';

export interface ProductDataI {
  id: number;
  title: string; 
  image: string;
  type: 'SALE' | 'DONATION';
  description?: string;
  author?: number;
  likes: number[];
  category: string;
  price?: number; 
  created_at: string;
  adresse?: string;
  updated_at: string;
}

interface ProductContextType {
  products: ProductDataI[];
  donationProducts: ProductDataI[];
  loading: boolean;
  fetchProducts: () => void;
  fetchFilteredProductsDonation: (filters: any) => void;
  addProduct: (newProduct: ProductDataI) => void;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  donationProducts: [],
  loading: false,
  fetchProducts: () => {},
  fetchFilteredProductsDonation: () => {},
  addProduct: () => {}, 
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductDataI[]>([]);
  const [donationProducts, setDonationProducts] = useState<ProductDataI[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/v1/products/');
      const fetchedProducts = res.data.dataset as ProductDataI[];

      const sales = fetchedProducts.filter(i => i.type === 'SALE');
      const donations = fetchedProducts.filter(i => i.type === 'DONATION');

      setProducts(sales);
      setDonationProducts(donations);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredProductsDonation = async (filters: any) => {
    setLoading(true);
    try {
      const res = await API.get('/api/v1/products/', {
        params: {
          type: 'DONATION',
          category: filters.category !== 'all' ? filters.category : undefined,
        },
      });
      const fetchedProducts = res.data.dataset as ProductDataI[];
      setDonationProducts(fetchedProducts);
    } catch (err) {
      console.error('Erreur lors du filtrage des produits:', err);
    } finally {
      setLoading(false);
    }
  };


  const addProduct = (newProduct: ProductDataI) => {
    if (newProduct.type === 'SALE') {
      setProducts(prevProducts => [newProduct, ...prevProducts]);
    } else if (newProduct.type === 'DONATION') {
      setDonationProducts(prevDonations => [newProduct, ...prevDonations]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        donationProducts,
        products,
        loading,
        fetchFilteredProductsDonation,
        fetchProducts,
        addProduct, 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};