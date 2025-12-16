'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

export interface CartItem {
    id: string | number;
    title: string;
    price: number; // Enforced as number for easier calculation
    image: string;
    description?: string;
    quantity?: number;
    plan?: string; // e.g., "Pago Total", "Anticipo"
    variantId?: string; // Unique identifier for the specific variant
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string | number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    toggleCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Failed to parse cart:', error);
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((item: CartItem) => {
        setCartItems(prev => {
            const uniqueId = item.variantId
                ? `${item.title}-${item.variantId}`
                : `${item.title}-${item.plan || 'default'}`;

            const itemWithId = { ...item, id: uniqueId };

            const exists = prev.find(i => i.id === uniqueId);
            if (exists) {
                return prev;
            }
            return [...prev, { ...itemWithId, quantity: 1 }];
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((id: string | number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        toggleCart,
        total
    }), [cartItems, addToCart, removeFromCart, clearCart, isCartOpen, toggleCart, total]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
