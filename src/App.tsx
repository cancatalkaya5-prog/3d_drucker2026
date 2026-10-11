/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Storefront } from './components/Storefront';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { ProductFormModal } from './components/seller/ProductFormModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { StaffPinModal } from './components/StaffPinModal';
import { SupportChatWidget } from './components/SupportChatWidget';
import { ToastContainer } from './components/Toast';

const MainLayout: React.FC = () => {
  const { viewMode } = useShop();
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenNewProductModal={() => setIsQuickAddModalOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1">
        {viewMode === 'shop' ? (
          <>
            <Hero />
            <Storefront />
          </>
        ) : (
          <SellerDashboard />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <CustomerOrdersModal />
      <StaffPinModal />
      
      {/* Live AI Support Chat with Human Handoff */}
      <SupportChatWidget />
      
      {/* Quick Add Product Modal from Topbar */}
      <ProductFormModal
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        productToEdit={null}
      />

      {/* Notification Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
