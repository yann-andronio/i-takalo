import axios from "axios";
import API from '../api/Api';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    avatar_url: string;
    status: boolean;
  }
  
  export interface Conversation {
    id: string;
    participants: User[];
    created_at: string;
    updated_at: string;
    messages: Message[];
  }
  
  export interface Message {
    id: string;
    conversation: string;
    sender: User;
    content: string;
    timestamp: string;
    is_read: boolean;
  }
  

export const getFriendsOnlineData = async (): Promise<User[]> => {
    try {
      const response = await API.get("api/auth/friends/");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        console.log("Connexion_Error :", error);
        const openAiError = error.response?.data.error;
        console.log("openAiError", openAiError);
        if (openAiError) {
        //   ToastService.show({
        //     type: "error",
        //     text1: "Erreur",
        //     text2: openAiError,
        //   });
        }
      }
      return [];
    }
  };
  
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