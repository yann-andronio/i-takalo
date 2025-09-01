import { NavigatorScreenParams } from '@react-navigation/native';
import { ProductDataI } from '../data/ProductData';

export type RootStackParamListHomenavigatorScreen= {
  HomeMain: undefined;
  Search: undefined;
  Product: { item: ProductDataI };
};

export type RootStackParamListChatnavigatorScreen = {
  ChatMain: undefined;
  Conversation: undefined;
};
export type RootStackParamListProfilnavigatorScreen = {
  ProfilMain: undefined;
  TrueProfilUserAccess: undefined;
  FavoriteProduct: undefined;
  Dashboard: undefined;
  ConfidentialityScreen: undefined;
  ConditionToUse: undefined;
  About: undefined;
  Product: { item: ProductDataI };
};

// Types hoan  MainNavigatorTab
export type RootStackParamListMainNavigatorTab = {
  Home: NavigatorScreenParams<RootStackParamListHomenavigatorScreen>;
  Chat: NavigatorScreenParams<RootStackParamListChatnavigatorScreen>;
  Sell: undefined;
  Wallet: undefined;
  Profile: undefined;
};