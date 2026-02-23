export type CartItem = {
    id: string;
    bookId: string;
    title: string;
    cover: string;
    price: number;
    quantity: number;
};

export type CartState = {
    items: CartItem[];
    total: number;
    itemCount: number;
};

export type CartAction =
    | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
    | { type: "REMOVE_ITEM"; payload: { bookId: string } }
    | {
          type: "UPDATE_QUANTITY";
          payload: { bookId: string; quantity: number };
      }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] };

export const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateItemCount = (items: CartItem[]): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
};

export const cartReducer = (
    state: CartState,
    action: CartAction
): CartState => {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItemIndex = state.items.findIndex(
                (item) => item.bookId === action.payload.bookId
            );

            let newItems: CartItem[];
            if (existingItemIndex >= 0) {
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex ?
                        {
                            ...item,
                            quantity: item.quantity + action.payload.quantity,
                        }
                    :   item
                );
            } else {
                const newItem: CartItem = {
                    id: action.payload.bookId,
                    ...action.payload,
                };
                newItems = [...state.items, newItem];
            }

            return {
                items: newItems,
                total: calculateTotal(newItems),
                itemCount: calculateItemCount(newItems),
            };
        }

        case "REMOVE_ITEM": {
            const newItems = state.items.filter(
                (item) => !(item.bookId === action.payload.bookId)
            );

            return {
                items: newItems,
                total: calculateTotal(newItems),
                itemCount: calculateItemCount(newItems),
            };
        }

        case "UPDATE_QUANTITY": {
            if (action.payload.quantity <= 0) {
                const newItems = state.items.filter(
                    (item) => !(item.bookId === action.payload.bookId)
                );

                return {
                    items: newItems,
                    total: calculateTotal(newItems),
                    itemCount: calculateItemCount(newItems),
                };
            }

            const newItems = state.items.map((item) =>
                item.bookId === action.payload.bookId ?
                    { ...item, quantity: action.payload.quantity }
                :   item
            );

            return {
                items: newItems,
                total: calculateTotal(newItems),
                itemCount: calculateItemCount(newItems),
            };
        }

        case "CLEAR_CART":
            return {
                items: [],
                total: 0,
                itemCount: 0,
            };

        case "LOAD_CART": {
            return {
                items: action.payload,
                total: calculateTotal(action.payload),
                itemCount: calculateItemCount(action.payload),
            };
        }

        default:
            return state;
    }
};

export const CART_STORAGE_KEY = "tome-cart";

export const saveCartToStorage = (cart: CartState): void => {
    if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
    }
};

export const loadCartFromStorage = (): CartItem[] => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return [];
            }
        }
    }
    return [];
};
