export interface Donation {
  id: string;
  date: string;
  item: string;
  quantity: string;
  ngo: string;
  status: "Pending" | "Delivered";
}

export type StatusChangeHandler = (
  id: string, 
  newStatus: 'PENDING' | 'SCHEDULED' | 'DELIVERED' | 'CANCELLED'
) => void;


export type DonationUnit = 'plates' | 'kgs' | 'servings' | 'boxes' | 'liters';

export type DonationStatus = 'PENDING' | 'SCHEDULED' | 'DELIVERED' | 'CANCELLED';