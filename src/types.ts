export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  stock: number;
  sku: string;
  tags?: string[];
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
  notes?: string;
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'klarna' | 'invoice';

export type OrderStatus = 'Neu' | 'In Zubereitung' | 'Im Versand' | 'Abgeschlossen';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  discountCode?: string;
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

export interface PresetImage {
  name: string;
  url: string;
  category: string;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  enteredPin: string;
  message: string;
  deviceInfo: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'bot' | 'human_staff';
  text: string;
  timestamp: string;
}

export interface SupportChatSession {
  messages: ChatMessage[];
  isHumanConnected: boolean;
  waitingForHuman: boolean;
  unreadCountForStaff: number;
}
