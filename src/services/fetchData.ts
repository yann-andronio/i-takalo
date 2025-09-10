import axios from "axios";
import API from '../api/Api';
import {Conversation, Message} from "../types/ModelTypes";

  
  
export const getConversations = async () => {
  try {
    const response = await API.get(`api/chat/conversations/`);
    console.log("getConversations", response)
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Connexion_Error :", error);
      // ToastService.show({
      //   type: "error",
      //   text1: "Erreur",
      //   text2: "Impossible de charger les conversations",
      // });
    }
    throw error;
  }
};




// Page Chat

// Fonction pour récupérer les messages d'une conversation
export const getConversationMessages = async (
  conversationId: string
): Promise<Message[]> => {
  try {
    const response = await API.get(
      `api/chat/conversations/${conversationId}/messages/`
    );
    console.log("getConversationMessagesconversationId", response.data)
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Erreur lors de la récupération des messages :", error);
      // ToastService.show({
      //   type: "error",
      //   text1: "Erreur",
      //   text2: "Impossible de charger les messages",
      // });
    }
    return [];
  }
};


// Fonction pour obtenir ou créer une conversation avec un ami spécifique
export const getOrCreateConversation = async (
  userId: string
): Promise<Conversation> => {
  try {
    const response = await API.get(`api/chat/conversations/with-user/${userId}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Erreur lors de la récupération de la conversation :", error);
      // ToastService.show({
      //   type: "error",
      //   text1: "Erreur",
      //   text2: "Impossible de charger la conversation",
      // });
    }
    throw error;
  }
};