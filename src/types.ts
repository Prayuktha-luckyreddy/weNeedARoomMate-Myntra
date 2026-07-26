export type VerificationStatus = 'Pending' | 'Vouched';

export type ApplicationStatus = 'Pending Review' | 'Accepted' | 'Declined';

export interface MentorshipApp {
  id: string;
  sellerId: string;
  sellerName: string;
  mentorId: string;
  mentorName: string;
  category: string;
  clusterCity: string;
  customNote: string;
  timestamp: string;
  status: ApplicationStatus;
}

export interface MentorInfo {
  id: string;
  name: string;
  clusterCity: string;
  category: string;
  rating: number;
  lifetimeOrders: number;
  description: string;
  image: string;
}

export interface Seller {
  id: string;
  name: string;
  clusterCity: string;
  category: string;
  status: VerificationStatus;
  description: string;
  whatsappNumber: string;
}

export interface BuyerPurchase {
  id: string;
  sellerId: string;
  productName: string;
  price: number;
  timestamp: string;
}

export interface MentorshipRequest {
  sellerId: string;
  businessDescription: string;
  category: string;
  permitContact: boolean;
}
