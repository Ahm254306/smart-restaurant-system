import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  defaultProducts,
  defaultCategories,
  defaultCustomers,
  defaultSettings,
  generateDemoOrders,
} from '../data/demoData';
import { loadJSON, saveJSON, removeKey } from '../utils/storage';
import { uid } from '../utils/format';

const StoreContext = createContext(null);

const KEYS = {
  version: 'sr_version',
  products: 'sr_products',
  categories: 'sr_categories',
  orders: 'sr_orders',
  customers: 'sr_customers',
  settings: 'sr_settings',
  cart: 'sr_cart',
};
const DATA_VERSION = '1';

function seedCustomers() {
  const now = Date.now();
  return defaultCustomers.map((c, i) => ({ ...c, createdAt: new Date(now - (60 - i * 4) * 86400000).toISOString() }));
}

function initialData() {
  const version = loadJSON(KEYS.version, null);
  if (version === DATA_VERSION) {
    const products = loadJSON(KEYS.products, null);
    const orders = loadJSON(KEYS.orders, null);
    const customers = loadJSON(KEYS.customers, null);
    if (products && orders && customers) {
      return {
        products,
        orders,
        customers,
        categories: loadJSON(KEYS.categories, defaultCategories),
        settings: { ...defaultSettings, ...loadJSON(KEYS.settings, {}) },
      };
    }
  }
  const customers = seedCustomers();
  const products = defaultProducts;
  return {
    products,
    customers,
    orders: generateDemoOrders(products, customers),
    categories: defaultCategories,
    settings: defaultSettings,
  };
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(initialData);
  const [cart, setCart] = useState(() => loadJSON(KEYS.cart, []));
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    saveJSON(KEYS.version, DATA_VERSION);
    saveJSON(KEYS.products, data.products);
    saveJSON(KEYS.categories, data.categories);
    saveJSON(KEYS.orders, data.orders);
    saveJSON(KEYS.customers, data.customers);
    saveJSON(KEYS.settings, data.settings);
  }, [data]);

  useEffect(() => {
    saveJSON(KEYS.cart, cart);
  }, [cart]);

  // ---------- Products ----------
  const addProduct = useCallback((product) => {
    const p = { ...product, id: uid('p') };
    setData((d) => ({ ...d, products: [p, ...d.products] }));
    return p;
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setData((d) => ({ ...d, products: d.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }, []);

  const deleteProduct = useCallback((id) => {
    setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));
    setCart((c) => c.filter((l) => l.productId !== id));
  }, []);

  // ---------- Orders ----------
  const placeOrder = useCallback(({ customer, items, notes, channel = 'Website' }) => {
    // Build everything outside the state updater so the returned order is always defined and stable.
    const d = dataRef.current;
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const deliveryFee = Number(d.settings.deliveryFee) || 0;
    const phoneKey = customer.phone.replace(/\D/g, '');
    const found = d.customers.find((c) => c.phone.replace(/\D/g, '') === phoneKey);
    const customerRecord = found
      ? { ...found, name: customer.name, address: customer.address }
      : {
          id: uid('c'),
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          createdAt: new Date().toISOString(),
        };
    const maxNum = d.orders.reduce((m, o) => Math.max(m, parseInt(o.number.replace(/\D/g, ''), 10) || 0), 1000);
    const order = {
      id: uid('o'),
      number: `SR-${maxNum + 1}`,
      customerId: customerRecord.id,
      customer: { name: customer.name, phone: customer.phone, address: customer.address },
      items: items.map((it) => ({ productId: it.productId, name: it.name, price: it.price, quantity: it.quantity })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      notes: notes || '',
      status: 'Pending',
      channel,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      customers: found
        ? prev.customers.map((c) => (c.id === found.id ? customerRecord : c))
        : [customerRecord, ...prev.customers],
      orders: [order, ...prev.orders],
    }));
    setCart([]);
    return order;
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    setData((d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
  }, []);

  // ---------- Settings ----------
  const updateSettings = useCallback((patch) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  const resetDemoData = useCallback(() => {
    Object.values(KEYS).forEach(removeKey);
    const customers = seedCustomers();
    setData({
      products: defaultProducts,
      customers,
      orders: generateDemoOrders(defaultProducts, customers),
      categories: defaultCategories,
      settings: defaultSettings,
    });
    setCart([]);
  }, []);

  // ---------- Cart ----------
  const addToCart = useCallback((productId, qty = 1) => {
    setCart((c) => {
      const found = c.find((l) => l.productId === productId);
      if (found) return c.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + qty } : l));
      return [...c, { productId, quantity: qty }];
    });
  }, []);

  const setCartQty = useCallback((productId, quantity) => {
    setCart((c) =>
      quantity <= 0 ? c.filter((l) => l.productId !== productId) : c.map((l) => (l.productId === productId ? { ...l, quantity } : l))
    );
  }, []);

  const removeFromCart = useCallback((productId) => setCart((c) => c.filter((l) => l.productId !== productId)), []);
  const clearCart = useCallback(() => setCart([]), []);

  // Cart lines resolved against live product data (drops deleted / unavailable products)
  const cartLines = useMemo(
    () =>
      cart
        .map((l) => {
          const p = data.products.find((x) => x.id === l.productId);
          return p && p.available ? { productId: p.id, name: p.name, price: p.price, quantity: l.quantity, product: p } : null;
        })
        .filter(Boolean),
    [cart, data.products]
  );
  const cartCount = cartLines.reduce((s, l) => s + l.quantity, 0);
  const cartSubtotal = cartLines.reduce((s, l) => s + l.price * l.quantity, 0);

  // ---------- Derived: customers with stats ----------
  const customersWithStats = useMemo(() => {
    return data.customers.map((c) => {
      const own = data.orders.filter((o) => o.customerId === c.id);
      const valid = own.filter((o) => o.status !== 'Cancelled');
      return {
        ...c,
        orders: own.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        totalOrders: own.length,
        totalSpent: valid.reduce((s, o) => s + o.total, 0),
        lastOrderAt: own.length ? own[0].createdAt : null,
      };
    });
  }, [data.customers, data.orders]);

  const value = {
    ...data,
    customersWithStats,
    addProduct,
    updateProduct,
    deleteProduct,
    placeOrder,
    updateOrderStatus,
    updateSettings,
    resetDemoData,
    cart,
    cartLines,
    cartCount,
    cartSubtotal,
    addToCart,
    setCartQty,
    removeFromCart,
    clearCart,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
