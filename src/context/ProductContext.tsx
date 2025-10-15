import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/Api';
import { AuthContext } from './AuthContext';

export interface ProductSuggestionI {
  id: number;
  author_image: string;
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
  ToggleLike: (productId: number) => Promise<boolean>;
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
  ToggleLike: async productId => false,
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allProducts, setAllProducts] = useState<ProductDataI[]>([]);
  const [saleProducts, setsaleProducts] = useState<ProductDataI[]>([]);
  const [donationProducts, setDonationProducts] = useState<ProductDataI[]>([]);
  const [echangeProducts, setEchangeProducts] = useState<ProductDataI[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/v1/products/');
      const fetchedProducts = (res.data.dataset as ProductDataI[]).map(p => ({ ...p,likes: Array.isArray(p.likes) ? p.likes : [],
      }));
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

  const fetchProductById = async (
    id: number,
  ): Promise<ProductDataI | undefined> => {
    try {
      const res = await API.get(`/api/v1/products/${id}/`);
      const data = res.data as ProductDataI;
      return { ...data, likes: Array.isArray(data.likes) ? data.likes : [] };
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

  const ToggleLike = async (productId: number): Promise<boolean> => {
    if (!user || !user.id) {
      console.warn('Action de like impossible : Utilisateur non connecté.');
      return false;
    }
    const userId = user.id;

    try {
      const res = await API.post(`/api/v1/products/${productId}/like/`);
      const { action } = res.data;

      const updateProductList = (
        prevProducts: ProductDataI[],
      ): ProductDataI[] => {
        return prevProducts.map(product => {
          if (product.id === productId) {
            let newLikes = [...product.likes];
            if (action === 'added') {
              if (!newLikes.includes(userId)) {
                newLikes.push(userId);
              }
            } else if (action === 'removed') {
              newLikes = newLikes.filter(id => id !== userId);
            }
            return { ...product, likes: newLikes };
          }
          return product;
        });
      };

      setAllProducts(updateProductList);
      setsaleProducts(updateProductList);
      setDonationProducts(updateProductList);
      setEchangeProducts(updateProductList);

      return true;
    } catch (err) {
      console.error(`Erreur lors du like/unlike du produit ${productId}:`, err);
      return false;
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
        ToggleLike, // Fonction de like ajoutée
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
