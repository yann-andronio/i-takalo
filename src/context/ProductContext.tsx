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
  loadingMore: boolean;
  hasMore: boolean;
  currentPage: number;
  fetchProducts: () => void;
  fetchMoreProducts: () => void;
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
  loadingMore: false,
  hasMore: true,
  currentPage: 1,
  fetchProducts: () => {},
  fetchMoreProducts: () => {},
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useContext(AuthContext);

  // ✅ Fetch initial des produits
  const fetchProducts = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const res = await API.get('/api/v1/products/', {
        params: {
          per_page: 25,
          page_no: 1,
        },
      });
      
      const fetchedProducts = (res.data.dataset as ProductDataI[]).map(p => ({
        ...p,
        likes: Array.isArray(p.likes) ? p.likes : [],
      }));
      
      const sales = fetchedProducts.filter(i => i.type === 'SALE');
      const donations = fetchedProducts.filter(i => i.type === 'DONATION');
      const echanges = fetchedProducts.filter(i => i.type === 'ECHANGE');
      
      setAllProducts(fetchedProducts);
      setDonationProducts(donations);
      setsaleProducts(sales);
      setEchangeProducts(echanges);
      
      // Vérifier s'il y a plus de données
      setHasMore(fetchedProducts.length === 25);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch des produits suivants (pagination)
  const fetchMoreProducts = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const res = await API.get('/api/v1/products/', {
        params: {
          per_page: 25,
          page_no: nextPage,
        },
      });
      
      const fetchedProducts = (res.data.dataset as ProductDataI[]).map(p => ({
        ...p,
        likes: Array.isArray(p.likes) ? p.likes : [],
      }));
      
      if (fetchedProducts.length === 0) {
        setHasMore(false);
        return;
      }
      
      const sales = fetchedProducts.filter(i => i.type === 'SALE');
      const donations = fetchedProducts.filter(i => i.type === 'DONATION');
      const echanges = fetchedProducts.filter(i => i.type === 'ECHANGE');
      
      // Ajouter les nouveaux produits sans doublons
      setAllProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newProducts = fetchedProducts.filter(p => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
      
      setDonationProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newDonations = donations.filter(p => !existingIds.has(p.id));
        return [...prev, ...newDonations];
      });
      
      setsaleProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newSales = sales.filter(p => !existingIds.has(p.id));
        return [...prev, ...newSales];
      });
      
      setEchangeProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newEchanges = echanges.filter(p => !existingIds.has(p.id));
        return [...prev, ...newEchanges];
      });
      
      setCurrentPage(nextPage);
      setHasMore(fetchedProducts.length === 25);
    } catch (err) {
      console.error('Erreur lors du chargement de plus de produits:', err);
    } finally {
      setLoadingMore(false);
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
    } else if (newProduct.type === 'ECHANGE') {
      setEchangeProducts(prev => [newProduct, ...prev]);
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
        loadingMore,
        hasMore,
        currentPage,
        fetchFilteredProductsDonation,
        fetchProducts,
        fetchMoreProducts,
        addProduct,
        deleteProduct,
        fetchProductById,
        ToggleLike,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};