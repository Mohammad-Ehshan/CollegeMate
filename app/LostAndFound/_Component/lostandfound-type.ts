export type ItemCategory = 'electronics' | 'documents' | 'jewelry' | 'clothing' | 'bags' | 'other';

export type lostItemStatus = 'LOST' | 'FOUND'| 'CLAIMED';

export interface RecentItem {
  id: string;
  title: string;
  imageUrls: string[];
  locationLost: string;
  reportedAt: Date;
  status: lostItemStatus;
  geoLocation: {
    lat: number;
    lng: number;
  } | null;
  createdAt: Date;
}