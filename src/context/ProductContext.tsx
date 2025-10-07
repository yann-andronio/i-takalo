import React, { createContext, useState, useEffect } from 'react';
import API from '../api/Api';

export interface ProductSuggestionI {
  id: number;
  author_image:string
  title: string;
  images: string[];
  price?: number;
  type: 'SALE' | 'DONATION' | 'ECHANGE';
  category: string;
}
export interface ProductDataI {
  id: number;
  title: string;
  images: string[];
  type: 'SALE' | 'DONATION' | 'ECHANGE';
  description?: string;
  author?: number;
  likes: number[];
  category: string;
  price?: number;
  mots_cles_recherches?: string[];
  created_at: string;
  adresse?: string;
  updated_at: string;
  suggestions: ProductSuggestionI[]; 
}

interface ProductContextType {
  allProducts: ProductDataI[];
  saleProducts: ProductDataI[];
  echangeProducts: ProductDataI[];
  donationProducts: ProductDataI[];
  loading: boolean;
  fetchProducts: () => void;
  fetchFilteredProductsDonation: (filters: any) => void;
  addProduct: (newProduct: ProductDataI) => void;
  deleteProduct: (id: number) => void;
  fetchProductById: (id: number) => Promise<ProductDataI | undefined>; 
}

export const ProductContext = createContext<ProductContextType>({
  allProducts: [],
  saleProducts: [],
  donationProducts: [],
  echangeProducts: [],
  loading: false,
  fetchProducts: () => {},
  fetchFilteredProductsDonation: () => {},
  addProduct: () => {},
  deleteProduct: () => {},
  fetchProductById: async () => undefined, 
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allProducts, setAllProducts] = useState<ProductDataI[]>([]);
  const [saleProducts, setsaleProducts] = useState<ProductDataI[]>([]);
  const [donationProducts, setDonationProducts] = useState<ProductDataI[]>([]);
  const [echangeProducts, setEchangeProducts] = useState<ProductDataI[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/v1/products/');
      const fetchedProducts = res.data.dataset as ProductDataI[];

      const sales = fetchedProducts.filter(i => i.type === 'SALE');
      const donations = fetchedProducts.filter(i => i.type === 'DONATION');
      const echanges = fetchedProducts.filter(i => i.type === 'ECHANGE');
      setAllProducts(fetchedProducts);
      setDonationProducts(donations);
      setsaleProducts(sales);
      setEchangeProducts(echanges);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: number): Promise<ProductDataI | undefined> => {
    try {
      const res = await API.get(`/api/v1/products/${id}/`);
      return res.data as ProductDataI; 
    } catch (err) {
      console.error(`Erreur lors du chargement du produit ${id}:`, err);
      return undefined;
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
      setsaleProducts(prevProducts => [newProduct, ...prevProducts]);
    } else if (newProduct.type === 'DONATION') {
      setDonationProducts(prevDonations => [newProduct, ...prevDonations]);
    }
    setAllProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const deleteProduct = async (id: number) => {
    setLoading(true);
    try {
      await API.delete(`/api/v1/products/${id}/`);

      setAllProducts(prev => prev.filter(p => p.id !== id));
      setsaleProducts(prev => prev.filter(p => p.id !== id));
      setDonationProducts(prev => prev.filter(p => p.id !== id));
      setEchangeProducts(prev => prev.filter(p => p.id !== id));

      console.log(`Produit ${id} supprimé avec succès`);
    } catch (err) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        allProducts,
        donationProducts,
        saleProducts,
        echangeProducts,
        loading,
        fetchFilteredProductsDonation,
        fetchProducts,
        addProduct,
        deleteProduct,
        fetchProductById, 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};