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

// Types hoan  MainNavigatorTab
export type RootStackParamListMainNavigatorTab = {
  Home: NavigatorScreenParams<RootStackParamListHomenavigatorScreen>;
  Chat: NavigatorScreenParams<RootStackParamListChatnavigatorScreen>;
  Sell: undefined;
  Wallet: undefined;
  Profile: undefined;
};