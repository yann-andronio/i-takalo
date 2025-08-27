import { ProductDataI } from '../data/ProductData';

export type RootStackParamListHomenavigatorScreen= {
  HomeMain: undefined;         
  Search: undefined;          
  Product: { item: ProductDataI }; // Product reçoit un objet item
};
export type RootStackParamListMainNavigatorTab = {
    Home: undefined; 
    Chat:undefined , 
    Sell:undefined , 
    Wallet:undefined , 
    Profile:undefined

};
