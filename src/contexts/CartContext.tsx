"use client";

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useState,
} from "react";
import {
    CartState,
    CartAction,
    cartReducer,
    loadCartFromStorage,
    saveCartToStorage,
} from "@/lib/cart";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

type CartContextType = {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    addItem: (
        bookId: string,
        title: string,
        cover: string,
        price: number,
        quantity?: number
    ) => void;
    removeItem: (bookId: string, title: string) => void;
    updateQuantity: (bookId: string, quantity: number) => void;
    clearCart: () => void;
    isAuthenticated: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
};

type CartProviderProps = {
    children: React.ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const t = useTranslations("messages");
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchCartFromDb = async () => {
        try {
            const res = await fetch("/api/cart");
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                dispatch({ type: "LOAD_CART", payload: data.items });
            }
        } catch (e) {
            console.error("Failed to fetch cart from database:", e);
        }
    };

    const syncCartToDb = async () => {
        try {
            await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: state.items }),
            });
        } catch (e) {
            console.error("Failed to sync cart to database:", e);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                setIsAuthenticated(data.authenticated);

                if (data.authenticated) {
                    await fetchCartFromDb();
                } else {
                    const storedItems = loadCartFromStorage();
                    if (storedItems.length > 0) {
                        dispatch({ type: "LOAD_CART", payload: storedItems });
                    }
                }
            } catch {
                const storedItems = loadCartFromStorage();
                if (storedItems.length > 0) {
                    dispatch({ type: "LOAD_CART", payload: storedItems });
                }
            } finally {
                setIsLoaded(true);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            saveCartToStorage(state);
        }
    }, [state, isLoaded]);

    useEffect(() => {
        if (isLoaded && isAuthenticated && state.items.length > 0) {
            syncCartToDb();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.items, isAuthenticated, isLoaded]);

    const addItem = async (
        bookId: string,
        title: string,
        cover: string,
        price: number,
        quantity: number = 1
    ) => {
        dispatch({
            type: "ADD_ITEM",
            payload: {
                bookId,
                title,
                cover,
                price,
                quantity,
            },
        });

        if (isAuthenticated) {
            try {
                await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookId, quantity }),
                });
            } catch {
                console.error("Failed to add item to database");
            }
        }

        toast.success(t("cart-add", { product: title }));
    };

    const removeItem = async (bookId: string, title: string) => {
        dispatch({
            type: "REMOVE_ITEM",
            payload: { bookId },
        });

        if (isAuthenticated) {
            try {
                await fetch(`/api/cart?bookId=${bookId}`, {
                    method: "DELETE",
                });
            } catch {
                console.error("Failed to remove item from database");
            }
        }

        toast.success(t("cart-remove", { product: title }));
    };

    const updateQuantity = async (bookId: string, quantity: number) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { bookId, quantity },
        });

        if (isAuthenticated && quantity === 0) {
            try {
                await fetch(`/api/cart?bookId=${bookId}`, {
                    method: "DELETE",
                });
            } catch {
                console.error("Failed to update quantity in database");
            }
        }
    };

    const clearCart = async () => {
        dispatch({ type: "CLEAR_CART" });

        if (isAuthenticated) {
            try {
                await fetch("/api/cart/clear", {
                    method: "DELETE",
                });
            } catch {
                console.error("Failed to clear cart in database");
            }
        }
    };

    const value: CartContextType = {
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isAuthenticated,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
