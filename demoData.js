// Demo data for Smart Restaurant. Generated once, then persisted in LocalStorage.

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Completed',
  'Cancelled',
];

export const defaultSettings = {
  restaurantName: 'Smart Restaurant',
  logo: '',
  phone: '+20 100 123 4567',
  whatsapp: '201001234567',
  address: '12 Nile Corniche, Banha, Qalyubia, Egypt',
  currency: 'EGP',
  deliveryFee: 25,
  email: 'hello@smartrestaurant.demo',
  openingHours: [
    { day: 'Monday', open: '12:00', close: '23:00', closed: false },
    { day: 'Tuesday', open: '12:00', close: '23:00', closed: false },
    { day: 'Wednesday', open: '12:00', close: '23:00', closed: false },
    { day: 'Thursday', open: '12:00', close: '23:59', closed: false },
    { day: 'Friday', open: '13:00', close: '23:59', closed: false },
    { day: 'Saturday', open: '12:00', close: '23:59', closed: false },
    { day: 'Sunday', open: '12:00', close: '22:00', closed: false },
  ],
};

export const defaultCategories = [
  { id: 'burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'grills', name: 'Grills', emoji: '🍖' },
  { id: 'starters', name: 'Salads & Starters', emoji: '🥗' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤' },
];

const P = (id, name, category, price, emoji, color, description, featured = false, available = true) => ({
  id,
  name,
  category,
  price,
  emoji,
  color,
  description,
  featured,
  available,
  image: '',
});

export const defaultProducts = [
  P('p1', 'Classic Smash Burger', 'burgers', 145, '🍔', '#f97316', 'Double smashed beef patties, aged cheddar, pickles, caramelized onions and house sauce on a toasted brioche bun.', true),
  P('p2', 'BBQ Bacon Burger', 'burgers', 175, '🥓', '#b45309', 'Juicy beef patty, crispy smoked bacon, onion ring and smoky BBQ glaze with melted cheese.', false),
  P('p3', 'Crispy Chicken Burger', 'burgers', 130, '🍗', '#ea580c', 'Buttermilk-fried chicken fillet, coleslaw, spicy mayo and fresh lettuce in a soft bun.', true),
  P('p4', 'Mushroom Swiss Burger', 'burgers', 160, '🍄', '#78716c', 'Beef patty topped with sautéed mushrooms, Swiss cheese and garlic aioli.'),
  P('p5', 'Margherita Pizza', 'pizza', 135, '🍕', '#dc2626', 'Stone-baked thin crust with San Marzano tomato sauce, fresh mozzarella and basil.', true),
  P('p6', 'Pepperoni Feast Pizza', 'pizza', 165, '🍕', '#b91c1c', 'Loaded with spicy pepperoni, mozzarella and a drizzle of chili honey.'),
  P('p7', 'Four Cheese Pizza', 'pizza', 175, '🧀', '#ca8a04', 'Mozzarella, gorgonzola, parmesan and provolone on a creamy white base.'),
  P('p8', 'Veggie Garden Pizza', 'pizza', 140, '🫑', '#16a34a', 'Bell peppers, olives, mushrooms, red onion and sweet corn with tomato sauce.'),
  P('p9', 'Mixed Grill Platter', 'grills', 320, '🍖', '#9a3412', 'Kofta, shish tawook and lamb chops served with grilled vegetables, rice and tahini.', true),
  P('p10', 'Shish Tawook', 'grills', 185, '🍢', '#c2410c', 'Marinated chicken skewers grilled over charcoal with garlic sauce and pickles.'),
  P('p11', 'Beef Kofta Plate', 'grills', 195, '🥩', '#7c2d12', 'Hand-minced beef kofta with parsley and spices, served with pita and grilled tomato.'),
  P('p12', 'Grilled Salmon', 'grills', 285, '🐟', '#0891b2', 'Atlantic salmon fillet with lemon butter, roasted potatoes and seasonal greens.', false, false),
  P('p13', 'Caesar Salad', 'starters', 95, '🥗', '#15803d', 'Crisp romaine, parmesan shavings, garlic croutons and creamy Caesar dressing.'),
  P('p14', 'Crispy Calamari', 'starters', 120, '🦑', '#d97706', 'Lightly battered calamari rings with lemon aioli and marinara dip.'),
  P('p15', 'Loaded Fries', 'starters', 85, '🍟', '#eab308', 'Golden fries topped with cheddar sauce, jalapeños and crispy onions.', true),
  P('p16', 'Creamy Mushroom Soup', 'starters', 70, '🍲', '#a16207', 'Velvety wild mushroom soup finished with truffle oil and warm bread.'),
  P('p17', 'Chocolate Lava Cake', 'desserts', 90, '🍫', '#78350f', 'Warm dark chocolate cake with a molten center, served with vanilla ice cream.', true),
  P('p18', 'New York Cheesecake', 'desserts', 85, '🍰', '#db2777', 'Classic baked cheesecake with berry compote on a buttery biscuit base.'),
  P('p19', 'Om Ali', 'desserts', 65, '🥣', '#b45309', 'Traditional Egyptian bread pudding baked with milk, nuts and coconut until golden.'),
  P('p20', 'Tiramisu Cup', 'desserts', 80, '☕', '#92400e', 'Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.'),
  P('p21', 'Fresh Orange Juice', 'drinks', 45, '🍊', '#f59e0b', 'Freshly squeezed Egyptian oranges, no added sugar.'),
  P('p22', 'Mint Lemonade', 'drinks', 40, '🍋', '#65a30d', 'Refreshing blend of fresh lemon, mint leaves and a touch of sugar.'),
  P('p23', 'Iced Caramel Latte', 'drinks', 60, '🧋', '#a16207', 'Double espresso, cold milk and caramel over ice.'),
  P('p24', 'Sparkling Water', 'drinks', 25, '💧', '#0ea5e9', 'Chilled sparkling mineral water, 330ml.'),
];

export const defaultCustomers = [
  { id: 'c1', name: 'Omar Hassan', phone: '01012345601', address: '14 Tahrir St, Banha', createdAt: '' },
  { id: 'c2', name: 'Sara Ahmed', phone: '01123456702', address: '8 El Gomhoria St, Banha', createdAt: '' },
  { id: 'c3', name: 'Youssef Ibrahim', phone: '01234567803', address: '22 Saad Zaghloul St, Banha', createdAt: '' },
  { id: 'c4', name: 'Mariam Khaled', phone: '01512345604', address: '5 El Nasr Rd, Banha', createdAt: '' },
  { id: 'c5', name: 'Mahmoud Adel', phone: '01098765405', address: '31 Port Said St, Banha', createdAt: '' },
  { id: 'c6', name: 'Nour Samir', phone: '01187654306', address: '9 Gamal Abdel Nasser St, Banha', createdAt: '' },
  { id: 'c7', name: 'Karim Mostafa', phone: '01276543207', address: '17 El Horreya St, Banha', createdAt: '' },
  { id: 'c8', name: 'Hana Tarek', phone: '01565432108', address: '3 Mostafa Kamel St, Banha', createdAt: '' },
  { id: 'c9', name: 'Ali Fathy', phone: '01054321009', address: '40 El Geish St, Banha', createdAt: '' },
  { id: 'c10', name: 'Dina Waleed', phone: '01143210910', address: '11 Nile View Compound, Banha', createdAt: '' },
];

// Small deterministic PRNG so demo data is stable.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const notesPool = [
  '',
  '',
  '',
  'No onions please.',
  'Extra sauce on the side.',
  'Call when you arrive.',
  'Ring the bell twice.',
  'Please include extra napkins.',
];

export function generateDemoOrders(products, customers, count = 48) {
  const rand = mulberry32(20261112);
  const now = Date.now();
  const orders = [];
  const available = products.filter((p) => p.available);

  const liveStatuses = ['Pending', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery'];
  const older = count - 9;

  for (let i = 0; i < count; i++) {
    const fromEnd = count - 1 - i; // 0 = newest
    // 5 live orders today, 4 yesterday, the rest spread over the previous ~6 weeks.
    let daysAgo;
    if (fromEnd < 5) daysAgo = 0;
    else if (fromEnd < 9) daysAgo = 1;
    else daysAgo = 44 - Math.round((i / (older - 1)) * 42);

    const date = new Date(now - daysAgo * 86400000);
    date.setHours(12 + Math.floor(rand() * 10), Math.floor(rand() * 60), 0, 0);
    if (fromEnd < 5) date.setTime(now - (fromEnd + 1) * 14 * 60000 - Math.floor(rand() * 5) * 60000);

    const customer = customers[Math.floor(rand() * customers.length)];
    const itemCount = 1 + Math.floor(rand() * 4);
    const chosen = new Map();
    for (let k = 0; k < itemCount; k++) {
      const p = available[Math.floor(rand() * available.length)];
      const qty = 1 + Math.floor(rand() * 2);
      chosen.set(p.id, { productId: p.id, name: p.name, price: p.price, quantity: (chosen.get(p.id)?.quantity || 0) + qty });
    }
    const items = [...chosen.values()];
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const deliveryFee = defaultSettings.deliveryFee;

    // The newest few orders are "live" so the admin sees a realistic kitchen queue.
    let status;
    if (fromEnd < liveStatuses.length) status = liveStatuses[fromEnd];
    else status = rand() < 0.08 ? 'Cancelled' : 'Completed';

    orders.push({
      id: `o${1001 + i}`,
      number: `SR-${1001 + i}`,
      customerId: customer.id,
      customer: { name: customer.name, phone: customer.phone, address: customer.address },
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      notes: notesPool[Math.floor(rand() * notesPool.length)],
      status,
      channel: rand() < 0.28 ? 'WhatsApp' : 'Website',
      createdAt: date.toISOString(),
    });
  }
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export const testimonials = [
  { name: 'Layla M.', role: 'Food blogger', text: 'The smash burger is unreal and the delivery was faster than promised. Ordering through the website took less than a minute.', rating: 5 },
  { name: 'Hossam R.', role: 'Regular customer', text: 'Best mixed grill in town. Everything arrives hot, beautifully packed and perfectly seasoned. My family orders every weekend.', rating: 5 },
  { name: 'Salma K.', role: 'University student', text: 'Love the WhatsApp ordering option, super easy. The chocolate lava cake is dangerously good.', rating: 5 },
];
