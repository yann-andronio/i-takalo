export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    image: string;
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
    reaction: string;
  }
  