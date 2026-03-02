export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  sizeProfile: {
    shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    waist: number;
    inseam: number;
    shoeSize: number;
    dressSize?: string;
  };
  plan: 'beta-40' | 'beta-80';
  joinedDate: string;
  avatarUrl: string;
}

export type ClothingCategory =
  | 'shirt'
  | 'pants'
  | 'socks'
  | 'underwear'
  | 'jacket'
  | 'dress'
  | 'shoes'
  | 'accessories';

export type ItemStatus = 'stored' | 'delivering' | 'at-home' | 'listed';
export type ItemCondition = 'like-new' | 'good' | 'fair';
export type MarketplaceTier = 'clearance' | 'premium';

export interface ConditionDefect {
  location: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major';
}

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  subcategory?: string;
  color: string;
  size: string;
  brand?: string;
  imageUrl: string;
  imageAlt: string;
  lastCleaned: string;
  status: ItemStatus;
  addedDate: string;
  condition: ItemCondition;
  conditionScore: number;
  defects: ConditionDefect[];
  inspectedDate: string;
}

export interface MarketplaceListing {
  id: string;
  item: ClothingItem;
  price: number;
  sellerId: string;
  sellerName: string;
  tier: MarketplaceTier;
  condition: ItemCondition;
  sizeMatchHint?: string;
  listedDate: string;
}

export interface GetBagItem {
  itemId: string;
  addedAt: string;
}

export interface DeliveryOrder {
  id: string;
  itemIds: string[];
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface FitPlanDay {
  dayIndex: number;
  shirtId?: string;
  pantsId?: string;
  shoesId?: string;
}

export interface FitPlanWeek {
  weekLabel: string;
  startDate: string;
  days: FitPlanDay[];
}

export interface OutfitSuggestion {
  id: string;
  name: string;
  items: ClothingItem[];
  weather: { condition: string; tempF: number };
  event: string;
  generatedAt: string;
}

export interface PickupRequest {
  id: string;
  date: string;
  timeSlot: string;
  address: string;
  estimatedItems: number;
  status: 'scheduled' | 'completed';
  createdAt: string;
}

export interface WaitlistEntry {
  name: string;
  email: string;
  phone: string;
  approxItems: number;
  movingSoon: boolean;
  submittedAt: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AppState {
  user: UserProfile;
  closet: ClothingItem[];
  marketplace: MarketplaceListing[];
  getBag: GetBagItem[];
  deliveryOrders: DeliveryOrder[];
  fitPlan: FitPlanWeek | null;
  fitPlanItems: string[];
  pickupRequests: PickupRequest[];
  outfitHistory: OutfitSuggestion[];
  waitlist: WaitlistEntry | null;
  toasts: ToastMessage[];
  activeModal: string | null;
}

export type AppAction =
  | { type: 'ADD_TO_CLOSET'; payload: ClothingItem }
  | { type: 'REMOVE_FROM_CLOSET'; payload: string }
  | { type: 'UPDATE_ITEM_STATUS'; payload: { id: string; status: ItemStatus } }
  | { type: 'ADD_MARKETPLACE_LISTING'; payload: MarketplaceListing }
  | { type: 'REMOVE_MARKETPLACE_LISTING'; payload: string }
  | { type: 'QUICK_BUY'; payload: { listingId: string } }
  | { type: 'TOGGLE_GET_BAG'; payload: string }
  | { type: 'CONFIRM_DELIVERY'; payload: DeliveryOrder }
  | { type: 'CANCEL_DELIVERY'; payload: { itemId: string; orderId: string } }
  | { type: 'TOGGLE_FIT_PLAN_ITEM'; payload: string }
  | { type: 'SET_FIT_PLAN_WEEK'; payload: FitPlanWeek }
  | { type: 'SET_FIT_PLAN_DAY'; payload: { dayIndex: number; slot: 'shirtId' | 'pantsId' | 'shoesId'; itemId: string | undefined } }
  | { type: 'CONFIRM_SET_DELIVERY'; payload: { dayIndices: number[]; address: string; deliveryDate: string } }
  | { type: 'SUBMIT_PICKUP'; payload: PickupRequest }
  | { type: 'SAVE_OUTFIT'; payload: OutfitSuggestion }
  | { type: 'SUBMIT_WAITLIST'; payload: WaitlistEntry }
  | { type: 'SHIP_OUTFIT'; payload: { outfitId: string; itemIds: string[] } }
  | { type: 'SHOW_TOAST'; payload: Omit<ToastMessage, 'id'> }
  | { type: 'DISMISS_TOAST'; payload: string }
  | { type: 'SET_MODAL'; payload: string | null }
  | { type: 'REORDER_CLOSET'; payload: ClothingItem[] }
  | { type: 'RESET_STATE' };
