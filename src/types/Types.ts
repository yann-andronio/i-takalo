// src/navigation/types.ts
import { ProductDataI } from '../data/ProductData';

export type RootStackParamList = {
  HomeMain: undefined;          // Home n'a pas de params
  Search: undefined;            // Search n'a pas de params
  Product: { item: ProductDataI }; // Product reçoit un objet item
};
