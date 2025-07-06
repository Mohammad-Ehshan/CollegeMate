export interface Donation {
  id: string;
  date: string;
  item: string;
  quantity: string;
  ngo: string;
  status: "Pending" | "Delivered";
}

export type StatusChangeHandler = (id: string, newStatus: "Pending" | "Delivered") => void;