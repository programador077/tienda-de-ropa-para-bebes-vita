export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'clothing' | 'accessories' | 'toys';
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[]
    }
  };
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
