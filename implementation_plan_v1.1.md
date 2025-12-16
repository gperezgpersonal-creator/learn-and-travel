# V1.1.0 Implementation Plan: Shopping Cart & Stripe

## Goal
Implement a functional shopping cart and "Reserve" flow for "Learn and Travel" programs, allowing users to select a program and proceed to payment using Stripe.

## Architecture

### 1. State Management (The Cart)
- **Technology:** React Context API + LocalStorage.
- **File:** `src/context/CartContext.tsx`
- **Features:**
    - `addItem(program)`
    - `removeItem(id)`
    - `clearCart()`
    - `cartItems` array.

### 2. UI Components
- **Cart Icon:** Added to `Header.tsx`. Shows badge with item count.
- **Cart Sidebar/Drawer:** Slides in from the right when icon is clicked. Review items + "Checkout" button.
- **"Reserve" Button:** Replaces or sits alongside "Contact" on Program pages. Adds item to cart and opens drawer.

### 3. Payment Integration (Stripe)
- **Technology:** `stripe` (server-side) and `@stripe/stripe-js` (client-side).
- **Flow:**
    1. User clicks "Checkout" in Cart Drawer.
    2. Call API route `/api/checkout_sessions`.
    3. API creates details in Stripe and returns a URL.
    4. Redirect user to Stripe Hosted Checkout Page.
    5. User pays and is redirected back to `/success` or `/cancel`.

## Changes Required

### Re-enabling Features (Hidden in V1.0)
- Uncomment "Programs" links in Header and Footer.
- Uncomment "Program Types" and "Featured Programs" in Home.
- **Note:** This will be done in the `feature/shopping-cart-v1.1` branch, keeping `main` clean.

### New Files
- `src/context/CartContext.tsx`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cart/CartButton.tsx`
- `src/app/api/checkout_sessions/route.ts`
- `src/app/[locale]/(main)/checkout/result/page.ts` (Success/Cancel pages)

## Setup Steps
1. Install dependencies: `npm install @stripe/stripe-js stripe`
2. Configure Environment Variables (User will need to provide eventually):
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    - `STRIPE_SECRET_KEY`

## Verification
- Verify "Reserve" adds item to cart.
- Verify Cart persistence (refresh page).
- Verify "Checkout" redirects to Stripe (Test Mode).
