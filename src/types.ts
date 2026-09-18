export type Language = 'te' | 'ta' | 'hi' | 'ml' | 'kn';

export interface ChatMessage {
  id?: string;
  userId: string;
  sender: 'user' | 'admin' | 'bot';
  text: string;
  type: 'text' | 'image' | 'video' | 'coin_card';
  mediaUrl?: string;
  serialNumber?: string;
  expectedPrice?: string;
  estimatedValue?: string;
  transactionId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
}

export interface Transaction {
  id?: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'buy' | 'sell';
  name?: string;
  phoneNumber?: string;
  aadhaarNumber?: string;
  addressPostOffice?: string;
  addressRoad?: string;
  deliveryOption?: 'COD' | 'Post';
  date?: string;
  serialNumber?: string;
  expectedPrice?: string;
  estimatedValue?: string;
  photoUrl?: string;
  adminDecision?: string;
  timestamp?: string;
}

export interface CoinRateItem {
  id: string;
  nameTe: string;
  nameEn: string;
  denomination: string; // ఉదా: 1 దమ్మిడి, 1 కాణి, 1 అణా, 1 రూపాయి
  era: string; // కాలం: బ్రిటిష్ ఇండియా, మొఘల్, స్వతంత్ర భారతం
  rate: string; // Admin determined price, e.g. "75,000"
  rarity: 'Ultra Rare' | 'Rare' | 'Vintage' | 'High Demand';
  rarityTe: string;
  category: 'coin' | 'note';
  description: string;
  updatedAt?: string;
}



