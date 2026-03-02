import type { AppState, AppAction, ToastMessage } from '../types';
import { mockUser } from '../data/mockUser';
import { mockCloset } from '../data/mockCloset';
import { mockMarketplace } from '../data/mockMarketplace';
import { generateId } from '../utils/format';

export const defaultState: AppState = {
  user: mockUser,
  closet: mockCloset,
  marketplace: mockMarketplace,
  getBag: [],
  deliveryOrders: [],
  fitPlan: null,
  fitPlanItems: [],
  pickupRequests: [],
  outfitHistory: [],
  waitlist: null,
  toasts: [],
  activeModal: null,
};

function addToast(toasts: ToastMessage[], payload: Omit<ToastMessage, 'id'>): ToastMessage[] {
  const newToast: ToastMessage = { ...payload, id: generateId() };
  return [...toasts.slice(-2), newToast];
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CLOSET':
      return {
        ...state,
        closet: [...state.closet, action.payload],
        toasts: addToast(state.toasts, { message: `${action.payload.name} added to your closet!`, type: 'success' }),
      };

    case 'REMOVE_FROM_CLOSET':
      return {
        ...state,
        closet: state.closet.filter(i => i.id !== action.payload),
        getBag: state.getBag.filter(b => b.itemId !== action.payload),
      };

    case 'UPDATE_ITEM_STATUS':
      return {
        ...state,
        closet: state.closet.map(i =>
          i.id === action.payload.id ? { ...i, status: action.payload.status } : i
        ),
      };

    case 'ADD_MARKETPLACE_LISTING':
      return {
        ...state,
        marketplace: [action.payload, ...state.marketplace],
        closet: state.closet.map(i =>
          i.id === action.payload.item.id ? { ...i, status: 'listed' } : i
        ),
        toasts: addToast(state.toasts, { message: `${action.payload.item.name} is now listed in the marketplace!`, type: 'success' }),
      };

    case 'REMOVE_MARKETPLACE_LISTING':
      return {
        ...state,
        marketplace: state.marketplace.filter(l => l.id !== action.payload),
      };

    case 'QUICK_BUY': {
      const listing = state.marketplace.find(l => l.id === action.payload.listingId);
      if (!listing) return state;
      const newItem = { ...listing.item, id: generateId(), status: 'stored' as const, addedDate: new Date().toISOString() };
      return {
        ...state,
        marketplace: state.marketplace.filter(l => l.id !== action.payload.listingId),
        closet: [...state.closet, newItem],
        toasts: addToast(state.toasts, { message: `${listing.item.name} added to your Cloud Closet!`, type: 'success' }),
      };
    }

    case 'TOGGLE_GET_BAG': {
      const itemId = action.payload;
      const alreadyIn = state.getBag.some(b => b.itemId === itemId);
      if (alreadyIn) {
        return { ...state, getBag: state.getBag.filter(b => b.itemId !== itemId) };
      }
      return {
        ...state,
        getBag: [...state.getBag, { itemId, addedAt: new Date().toISOString() }],
      };
    }

    case 'CONFIRM_DELIVERY': {
      const order = action.payload;
      return {
        ...state,
        deliveryOrders: [...state.deliveryOrders, order],
        getBag: state.getBag.filter(b => !order.itemIds.includes(b.itemId)),
        closet: state.closet.map(i =>
          order.itemIds.includes(i.id) ? { ...i, status: 'delivering' } : i
        ),
        toasts: addToast(state.toasts, {
          message: `${order.itemIds.length} item${order.itemIds.length !== 1 ? 's' : ''} confirmed — arriving by ${order.deliveryTime}!`,
          type: 'success',
        }),
      };
    }

    case 'CANCEL_DELIVERY': {
      const { itemId, orderId } = action.payload;
      return {
        ...state,
        deliveryOrders: state.deliveryOrders.map(o =>
          o.id === orderId
            ? { ...o, itemIds: o.itemIds.filter(id => id !== itemId), status: o.itemIds.length <= 1 ? 'cancelled' : o.status }
            : o
        ),
        closet: state.closet.map(i =>
          i.id === itemId ? { ...i, status: 'stored' } : i
        ),
        toasts: addToast(state.toasts, { message: 'Delivery cancelled for that item.', type: 'info' }),
      };
    }

    case 'TOGGLE_FIT_PLAN_ITEM': {
      const id = action.payload;
      const already = state.fitPlanItems.includes(id);
      return {
        ...state,
        fitPlanItems: already
          ? state.fitPlanItems.filter(i => i !== id)
          : [...state.fitPlanItems, id],
      };
    }

    case 'SET_FIT_PLAN_WEEK':
      return { ...state, fitPlan: action.payload };

    case 'SET_FIT_PLAN_DAY': {
      if (!state.fitPlan) return state;
      const { dayIndex, slot, itemId } = action.payload;
      const days = state.fitPlan.days.map(d =>
        d.dayIndex === dayIndex ? { ...d, [slot]: itemId } : d
      );
      const dayExists = state.fitPlan.days.some(d => d.dayIndex === dayIndex);
      return {
        ...state,
        fitPlan: {
          ...state.fitPlan,
          days: dayExists ? days : [...state.fitPlan.days, { dayIndex, [slot]: itemId }],
        },
      };
    }

    case 'CONFIRM_SET_DELIVERY': {
      const { dayIndices, address, deliveryDate } = action.payload;
      if (!state.fitPlan) return state;
      const itemIds: string[] = [];
      dayIndices.forEach(di => {
        const day = state.fitPlan!.days.find(d => d.dayIndex === di);
        if (day) {
          if (day.shirtId) itemIds.push(day.shirtId);
          if (day.pantsId) itemIds.push(day.pantsId);
          if (day.shoesId) itemIds.push(day.shoesId);
        }
      });
      const uniqueIds = [...new Set(itemIds)];
      const order = {
        id: generateId(),
        itemIds: uniqueIds,
        address,
        deliveryDate,
        deliveryTime: '9:00 AM',
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        deliveryOrders: [...state.deliveryOrders, order],
        closet: state.closet.map(i =>
          uniqueIds.includes(i.id) ? { ...i, status: 'delivering' } : i
        ),
        toasts: addToast(state.toasts, {
          message: `Set delivery confirmed — ${uniqueIds.length} items on the way!`,
          type: 'success',
        }),
      };
    }

    case 'SUBMIT_PICKUP':
      return {
        ...state,
        pickupRequests: [...state.pickupRequests, action.payload],
        toasts: addToast(state.toasts, { message: 'Pickup scheduled! We\'ll see you soon.', type: 'success' }),
      };

    case 'SAVE_OUTFIT':
      return {
        ...state,
        outfitHistory: [action.payload, ...state.outfitHistory.slice(0, 9)],
      };

    case 'SHIP_OUTFIT':
      return {
        ...state,
        closet: state.closet.map(i =>
          action.payload.itemIds.includes(i.id) ? { ...i, status: 'delivering' } : i
        ),
        toasts: addToast(state.toasts, { message: 'Your look is on its way!', type: 'success' }),
      };

    case 'SUBMIT_WAITLIST':
      return {
        ...state,
        waitlist: action.payload,
        toasts: addToast(state.toasts, { message: 'You\'re on the list! We\'ll be in touch soon.', type: 'success' }),
      };

    case 'SHOW_TOAST':
      return { ...state, toasts: addToast(state.toasts, action.payload) };

    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    case 'SET_MODAL':
      return { ...state, activeModal: action.payload };

    case 'REORDER_CLOSET':
      return { ...state, closet: action.payload };

    case 'RESET_STATE':
      return { ...defaultState, toasts: addToast([], { message: 'Demo reset to initial state.', type: 'info' }) };

    default:
      return state;
  }
}
