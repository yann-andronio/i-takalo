import { NavigatorScreenParams } from '@react-navigation/native';
import { ProductDataI } from '../data/ProductData';

export type RootStackParamListHomenavigatorScreen= {
  AccueilMain: undefined;
  Search: undefined;
  Product: { item: ProductDataI };
};

export type RootStackParamListChatnavigatorScreen = {
  MessageMain: undefined;
  Conversation: undefined;
  Chat: { conversationId: any; participant: any  };
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
  Accueil: NavigatorScreenParams<RootStackParamListHomenavigatorScreen>;
  Message: NavigatorScreenParams<RootStackParamListChatnavigatorScreen>;
  Sell: undefined;
  Notification: undefined;
  Profile: undefined;
};