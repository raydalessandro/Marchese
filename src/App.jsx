import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dati fittizi per demo
const DEMO_ORDERS = [
  {
    id: 1730800000000,
    table: 3,
    items: [
      { name: 'Cornetto Vuoto', qty: 2, price: 1.50, total: 3.00 },
      { name: '+ Farcitura Crema', qty: 1, price: 0.50, total: 0.50 },
      { name: 'Cappuccino', qty: 2, price: 1.50, total: 3.00 }
    ],
    total: 6.50,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'completed'
  },
  {
    id: 1730801000000,
    table: 5,
    items: [
      { name: 'Espresso', qty: 1, price: 1.20, total: 1.20 },
      { name: 'Brioche Lievito Madre', qty: 1, price: 2.00, total: 2.00 }
    ],
    total: 3.20,
    timestamp: new Date(Date.now() - 6400000).toISOString(),
    status: 'completed'
  },
  {
    id: 1730802000000,
    table: 1,
    items: [
      { name: 'Marchesino', qty: 2, price: 1.70, total: 3.40 },
      { name: 'Cornetto Integrale', qty: 2, price: 1.70, total: 3.40 }
    ],
    total: 6.80,
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    status: 'completed'
  },
  // Ordini di ieri
  {
    id: 1730703000000,
    table: 2,
    items: [
      { name: 'Cappuccino', qty: 3, price: 1.50, total: 4.50 },
      { name: 'Cornetto Vuoto', qty: 3, price: 1.50, total: 4.50 }
    ],
    total: 9.00,
    timestamp: new Date(Date.now() - 86400000 - 7200000).toISOString(),
    status: 'completed'
  },
  {
    id: 1730704000000,
    table: 8,
    items: [
      { name: 'Espresso', qty: 4, price: 1.20, total: 4.80 },
      { name: 'Brioche Lievito Madre', qty: 2, price: 2.00, total: 4.00 }
    ],
    total: 8.80,
    timestamp: new Date(Date.now() - 86400000 - 3600000).toISOString(),
    status: 'completed'
  },
  // Ordini di 3 giorni fa
  {
    id: 1730603000000,
    table: 6,
    items: [
      { name: 'Spremuta d\'Arancia', qty: 2, price: 3.50, total: 7.00 },
      { name: 'Cornetto Integrale', qty: 2, price: 1.70, total: 3.40 }
    ],
    total: 10.40,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    status: 'completed'
  },
  {
    id: 1730803000000,
    table: 7,
    items: [
      { name: 'Spremuta d\'Arancia', qty: 1, price: 3.50, total: 3.50 },
      { name: 'Cornetto Vuoto', qty: 1, price: 1.50, total: 1.50 },
      { name: '+ Farcitura Pistacchio', qty: 1, price: 0.70, total: 0.70 }
    ],
    total: 5.70,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed'
  },
  {
    id: 1730804000000,
    table: 2,
    items: [
      { name: 'Cappuccino Soia', qty: 1, price: 1.80, total: 1.80 },
      { name: 'Brioche Lievito Madre', qty: 1, price: 2.00, total: 2.00 }
    ],
    total: 3.80,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'ready'
  },
  {
    id: 1730805000000,
    table: 4,
    items: [
      { name: 'Espresso', qty: 3, price: 1.20, total: 3.60 },
      { name: 'Acqua', qty: 1, price: 1.50, total: 1.50 }
    ],
    total: 5.10,
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: 'preparing'
  }
];

const INITIAL_MENU = {
  'corn-vuoto': { name: 'Cornetto Vuoto', price: 1.50, category: 'Colazione', description: 'Da farcire al momento', available: true },
  'farc-crema': { name: '+ Farcitura Crema', price: 0.50, category: 'Colazione', description: '', available: true },
  'farc-cioc': { name: '+ Farcitura Cioccolato', price: 0.50, category: 'Colazione', description: '', available: true },
  'farc-pist': { name: '+ Farcitura Pistacchio', price: 0.70, category: 'Colazione', description: '', available: true },
  'farc-marm': { name: '+ Farcitura Marmellata', price: 0.40, category: 'Colazione', description: '', available: true },
  'corn-int': { name: 'Cornetto Integrale', price: 1.70, category: 'Colazione', description: 'Farina biologica', available: true },
  'brioche-lm': { name: 'Brioche Lievito Madre', price: 2.00, category: 'Colazione', description: '', available: true },
  'espresso': { name: 'Espresso', price: 1.20, category: 'Caffetteria', description: 'Miscela della casa', available: true },
  'cappuccino': { name: 'Cappuccino', price: 1.50, category: 'Caffetteria', description: '', available: true },
  'capp-soia': { name: 'Cappuccino Soia', price: 1.80, category: 'Caffetteria', description: 'Latte di soia bio', available: true },
  'marchesino': { name: 'Marchesino', price: 1.70, category: 'Caffetteria', description: 'Il nostro marocchino speciale', available: true },
  'acqua': { name: 'Acqua', price: 1.50, category: 'Bevande', description: '50cl', available: true },
  'spremuta': { name: 'Spremuta d\'Arancia', price: 3.50, category: 'Bevande', description: 'Fresca', available: true }
};

const MenuPrintView = ({ menuItems }) => {
  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '15mm',
      margin: '0 auto',
      background: 'white',
      fontFamily: 'Inter, sans-serif',
      color: '#333'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '4px solid #6B4423', marginBottom: '25px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: '#6B4423', margin: '0 0 10px 0' }}>
          Torrefazione Marchese
        </h1>
        <p style={{ fontSize: '1rem', color: '#666', margin: '5px 0' }}>
          Via delle Forze Armate, 348 - Baggio, Milano
        </p>
        <p style={{ fontSize: '1rem', color: '#666', margin: '5px 0' }}>
          ☎ 375 613 6262
        </p>
      </div>

      {/* Menu Sections */}
      {['Colazione', 'Caffetteria', 'Bevande'].map(category => {
        const items = Object.entries(menuItems).filter(([_, item]) => item.category === category && item.available);
        if (items.length === 0) return null;
        
        return (
          <div key={category} style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontWeight: 600,
              color: '#6B4423',
              fontSize: '1.5rem',
              marginBottom: '15px',
              paddingBottom: '8px',
              borderBottom: '3px solid #D4A574'
            }}>
              {category === 'Colazione' ? '🥐' : category === 'Caffetteria' ? '☕' : '🥤'} {category.toUpperCase()}
            </h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {items.map(([id, item]) => (
                <div key={id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '10px',
                  background: '#FAFAFA',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '1.1rem', color: '#333', marginBottom: '4px' }}>
                      {item.name}
                    </div>
                    {item.description && (
                      <div style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: 600, color: '#6B4423', fontSize: '1.2rem', marginLeft: '15px' }}>
                    €{item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ 
        marginTop: '40px', 
        paddingTop: '20px', 
        borderTop: '2px solid #D4A574',
        textAlign: 'center',
        color: '#999',
        fontSize: '0.9rem'
      }}>
        <p>Grazie per la vostra visita! • Buon appetito!</p>
      </div>
    </div>
  );
};

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('marchese_orders');
    return saved ? JSON.parse(saved) : DEMO_ORDERS;
  });
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('marchese_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [adminView, setAdminView] = useState('live');
  const [editingItem, setEditingItem] = useState(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  // Date range per analytics
  const [dateRange, setDateRange] = useState('today'); // today, yesterday, week, month, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const printRef = useRef();
  
  const urlParams = new URLSearchParams(window.location.search);
  const tableNumber = urlParams.get('table') || '3';

  useEffect(() => {
    localStorage.setItem('marchese_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('marchese_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const printMenu = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Menu - Torrefazione Marchese</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Filtra ordini per periodo
  const getFilteredOrders = () => {
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = new Date(yesterday.setHours(0, 0, 0, 0));
        endDate = new Date(yesterday.setHours(23, 59, 59, 999));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          return orders;
        }
        break;
      default:
        return orders;
    }

    return orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  // Calcoli analytics con filtro periodo
  const getAnalytics = () => {
    const filteredOrders = getFilteredOrders();
    
    // Prodotti più venduti
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { qty: 0, revenue: 0 };
        }
        productSales[item.name].qty += item.qty;
        productSales[item.name].revenue += item.total;
      });
    });
    
    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);
    
    // Vendite per ora
    const hourlySales = {};
    filteredOrders.forEach(order => {
      const hour = new Date(order.timestamp).getHours();
      if (!hourlySales[hour]) {
        hourlySales[hour] = { hour: `${hour}:00`, orders: 0, revenue: 0 };
      }
      hourlySales[hour].orders += 1;
      hourlySales[hour].revenue += order.total;
    });
    
    const hourlyData = Object.values(hourlySales).sort((a, b) => 
      parseInt(a.hour) - parseInt(b.hour)
    );
    
    // Distribuzione per categoria
    const categorySales = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const itemData = Object.values(menuItems).find(m => m.name === item.name);
        const category = itemData?.category || 'Altro';
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }
        categorySales[category] += item.total;
      });
    });
    
    const categoryData = Object.entries(categorySales).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
    
    // Stats generali
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrder = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
    const completedOrders = filteredOrders.filter(o => o.status === 'completed').length;
    
    return {
      topProducts,
      hourlyData,
      categoryData,
      stats: {
        totalOrders: filteredOrders.length,
        completedOrders,
        totalRevenue,
        avgOrder
      }
    };
  };

  const analytics = getAnalytics();

  const updateCart = (itemId, change) => {
    setCart(prev => {
      const newQty = Math.max(0, (prev[itemId] || 0) + change);
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((sum, [itemId, qty]) => {
      return sum + (menuItems[itemId].price * qty);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const sendOrder = () => {
    const orderItems = Object.entries(cart).map(([itemId, qty]) => ({
      name: menuItems[itemId].name,
      qty,
      price: menuItems[itemId].price,
      total: qty * menuItems[itemId].price
    }));

    const newOrder = {
      id: Date.now(),
      table: parseInt(tableNumber),
      items: orderItems,
      total: getCartTotal(),
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    setOrders(prev => [...prev, newOrder]);
    setCart({});
    setShowCart(false);
    
    alert('✅ Ordine inviato con successo!');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updateMenuItem = (itemId, field, value) => {
    setMenuItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const addNewItem = () => {
    const newId = `item-${Date.now()}`;
    setMenuItems(prev => ({
      ...prev,
      [newId]: {
        name: 'Nuovo Prodotto',
        price: 0,
        category: 'Colazione',
        description: '',
        available: true
      }
    }));
    setEditingItem(newId);
  };

  const deleteMenuItem = (itemId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      const newMenuItems = { ...menuItems };
      delete newMenuItems[itemId];
      setMenuItems(newMenuItems);
      setEditingItem(null);
    }
  };

  const getPeriodLabel = () => {
    switch (dateRange) {
      case 'today': return 'Oggi';
      case 'yesterday': return 'Ieri';
      case 'week': return 'Ultimi 7 giorni';
      case 'month': return 'Ultimi 30 giorni';
      case 'custom': 
        if (customStartDate && customEndDate) {
          return `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`;
        }
        return 'Periodo personalizzato';
      default: return '';
    }
  };

  const COLORS = ['#6B4423', '#D4A574', '#93C572', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '10px',
      background: 'white'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap');
        
        @media print {
          .no-print { display: none !important; }
          .menu-item { justify-content: flex-start !important; }
          body { max-width: 100% !important; padding: 0 !important; }
        }
        
        .menu-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: white;
          border-radius: 5px;
          border: 1px solid #E5E7EB;
          margin-bottom: 8px;
        }
        
        .stat-card {
          background: white;
          border: 2px solid #D4A574;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        
        .order-card {
          background: white;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        
        .order-card.new {
          border-color: #93C572;
          animation: pulse 2s infinite;
        }
        
        .order-card.preparing {
          border-color: #D4A574;
        }
        
        .order-card.ready {
          border-color: #10B981;
          background: #F0FDF4;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        input, select {
          padding: 8px;
          border: 1px solid #E5E7EB;
          border-radius: 5px;
          font-family: inherit;
          font-size: 0.9rem;
        }

        button {
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover {
          opacity: 0.9;
        }

        .date-filter-btn {
          padding: 8px 15px;
          border: 2px solid #E5E7EB;
          background: white;
          border-radius: 5px;
          font-weight: 500;
          font-size: 0.9rem;
          color: #666;
        }

        .date-filter-btn.active {
          background: #6B4423;
          color: white;
          border-color: #6B4423;
        }
      `}</style>

      {/* Hidden print view */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <MenuPrintView menuItems={menuItems} />
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            padding: '20px'
          }}
          onClick={(e) => e.target === e.currentTarget && setShowPrintPreview(false)}
        >
          <div style={{
            background: 'white',
            borderRadius: '10px',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              padding: '15px 20px',
              borderBottom: '2px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10
            }}>
              <h2 style={{ margin: 0, color: '#6B4423' }}>Anteprima Stampa Menu</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={printMenu}
                  style={{
                    padding: '10px 20px',
                    background: '#6B4423',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 600
                  }}
                >
                  🖨️ Stampa
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  style={{
                    padding: '10px 20px',
                    background: '#999',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px'
                  }}
                >
                  ✕ Chiudi
                </button>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <MenuPrintView menuItems={menuItems} />
            </div>
          </div>
        </div>
      )}

      {/* Admin Toggle */}
      <button 
        onClick={() => setIsAdmin(!isAdmin)}
        className="no-print"
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#666',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          border: 'none',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        {isAdmin ? '👤 Torna al Menu' : '👤 Admin'}
      </button>

      {!isAdmin ? (
        // VISTA CLIENTE
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', padding: '15px 0', borderBottom: '3px solid #6B4423', marginBottom: '15px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#6B4423', margin: '0 0 5px 0' }}>
              Torrefazione Marchese
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>
              Via delle Forze Armate, 348 - Baggio, Milano | ☎ 375 613 6262
            </p>
            <div className="no-print" style={{ 
              display: 'inline-block',
              background: '#D4A574',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '20px',
              marginTop: '10px',
              fontWeight: 600
            }}>
              Tavolo {tableNumber}
            </div>
          </div>

          {/* Menu */}
          {['Colazione', 'Caffetteria', 'Bevande'].map(category => {
            const items = Object.entries(menuItems).filter(([_, item]) => item.category === category && item.available);
            if (items.length === 0) return null;
            
            return (
              <div key={category} style={{ background: '#FAFAFA', borderRadius: '8px', padding: '10px', marginBottom: '15px' }}>
                <h2 style={{ 
                  fontWeight: 600,
                  color: '#6B4423',
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  paddingBottom: '5px',
                  borderBottom: '2px solid #D4A574'
                }}>
                  {category === 'Colazione' ? '🥐' : category === 'Caffetteria' ? '☕' : '🥤'} {category.toUpperCase()}
                </h2>
                
                {items.map(([id, item]) => (
                  <div key={id} className="menu-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#333' }}>
                        {item.name}
                      </div>
                      {item.description && (
                        <div style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, color: '#6B4423', marginRight: '15px', minWidth: '50px', textAlign: 'right' }}>
                      €{item.price.toFixed(2)}
                    </div>
                    <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F3F4F6', borderRadius: '5px', padding: '2px' }}>
                      <button 
                        onClick={() => updateCart(id, -1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: 'none',
                          background: 'white',
                          color: '#6B4423',
                          borderRadius: '3px',
                          fontSize: '1.2rem',
                          fontWeight: 600
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600, color: '#6B4423' }}>
                        {cart[id] || 0}
                      </span>
                      <button 
                        onClick={() => updateCart(id, 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: 'none',
                          background: 'white',
                          color: '#6B4423',
                          borderRadius: '3px',
                          fontSize: '1.2rem',
                          fontWeight: 600
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Floating Cart */}
          {getCartItemCount() > 0 && (
            <div 
              className="no-print"
              onClick={() => setShowCart(true)}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: '#93C572',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 600,
                zIndex: 1000
              }}
            >
              <span>🛒</span>
              <span>€{getCartTotal().toFixed(2)}</span>
              <span style={{ background: 'white', color: '#93C572', padding: '2px 8px', borderRadius: '15px', fontSize: '0.9rem' }}>
                {getCartItemCount()}
              </span>
            </div>
          )}

          {/* Cart Modal */}
          {showCart && (
            <div 
              className="no-print"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000
              }}
              onClick={(e) => e.target === e.currentTarget && setShowCart(false)}
            >
              <div style={{
                background: 'white',
                borderRadius: '10px',
                padding: '20px',
                maxWidth: '400px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #D4A574' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#6B4423', margin: 0 }}>
                    Il Tuo Ordine
                  </h2>
                  <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>
                    ✕
                  </button>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  {Object.entries(cart).map(([itemId, qty]) => (
                    <div key={itemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EEE' }}>
                      <span style={{ flex: 1, fontSize: '0.9rem' }}>{menuItems[itemId].name}</span>
                      <span style={{ color: '#666', margin: '0 10px' }}>x{qty}</span>
                      <span style={{ fontWeight: 600, color: '#6B4423' }}>€{(qty * menuItems[itemId].price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600, color: '#6B4423', padding: '10px 0', borderTop: '2px solid #D4A574' }}>
                  <span>Totale:</span>
                  <span>€{getCartTotal().toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={sendOrder}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#93C572',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Invia Ordine
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // VISTA ADMIN
        <>
          <div style={{ textAlign: 'center', padding: '15px 0', borderBottom: '3px solid #6B4423', marginBottom: '15px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#6B4423', margin: 0 }}>
              Dashboard Admin - Marchese
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>Gestione e Analytics</p>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #E5E7EB', flexWrap: 'wrap' }}>
            {[
              { key: 'live', label: '🔴 Live' },
              { key: 'history', label: '📋 Storico' },
              { key: 'analytics', label: '📊 Analytics' },
              { key: 'menu', label: '📝 Menu' }
            ].map(view => (
              <button
                key={view.key}
                onClick={() => setAdminView(view.key)}
                style={{
                  padding: '10px 20px',
                  background: adminView === view.key ? '#6B4423' : 'transparent',
                  color: adminView === view.key ? 'white' : '#666',
                  border: 'none',
                  borderBottom: adminView === view.key ? '3px solid #6B4423' : 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {view.label}
              </button>
            ))}
          </div>

          {adminView === 'menu' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ margin: 0, color: '#6B4423', fontFamily: 'Playfair Display, serif' }}>
                  Gestione Menu
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowPrintPreview(true)}
                    style={{
                      padding: '10px 20px',
                      background: '#D4A574',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 600
                    }}
                  >
                    👁️ Anteprima Stampa
                  </button>
                  <button
                    onClick={addNewItem}
                    style={{
                      padding: '10px 20px',
                      background: '#93C572',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 600
                    }}
                  >
                    ➕ Nuovo Prodotto
                  </button>
                </div>
              </div>

              {['Colazione', 'Caffetteria', 'Bevande'].map(category => (
                <div key={category} style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: '#6B4423', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #D4A574' }}>
                    {category === 'Colazione' ? '🥐' : category === 'Caffetteria' ? '☕' : '🥤'} {category}
                  </h3>
                  
                  {Object.entries(menuItems)
                    .filter(([_, item]) => item.category === category)
                    .map(([id, item]) => (
                      <div key={id} style={{
                        background: 'white',
                        border: editingItem === id ? '2px solid #6B4423' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '10px'
                      }}>
                        {editingItem === id ? (
                          <div style={{ display: 'grid', gap: '10px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Nome</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateMenuItem(id, 'name', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Prezzo (€)</label>
                                <input
                                  type="number"
                                  step="0.10"
                                  value={item.price}
                                  onChange={(e) => updateMenuItem(id, 'price', parseFloat(e.target.value))}
                                  style={{ width: '100%' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Categoria</label>
                                <select
                                  value={item.category}
                                  onChange={(e) => updateMenuItem(id, 'category', e.target.value)}
                                  style={{ width: '100%' }}
                                >
                                  <option>Colazione</option>
                                  <option>Caffetteria</option>
                                  <option>Bevande</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Descrizione</label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateMenuItem(id, 'description', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <input
                                type="checkbox"
                                checked={item.available}
                                onChange={(e) => updateMenuItem(id, 'available', e.target.checked)}
                                id={`available-${id}`}
                              />
                              <label htmlFor={`available-${id}`} style={{ fontSize: '0.9rem' }}>Disponibile</label>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                              <button
                                onClick={() => setEditingItem(null)}
                                style={{
                                  flex: 1,
                                  padding: '8px',
                                  background: '#93C572',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '5px',
                                  fontWeight: 600
                                }}
                              >
                                ✓ Salva
                              </button>
                              <button
                                onClick={() => deleteMenuItem(id)}
                                style={{
                                  padding: '8px 15px',
                                  background: '#DC2626',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '5px',
                                  fontWeight: 600
                                }}
                              >
                                🗑️ Elimina
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontWeight: 600, 
                                fontSize: '1rem', 
                                color: item.available ? '#333' : '#999',
                                marginBottom: '4px'
                              }}>
                                {item.name} {!item.available && '(Non disponibile)'}
                              </div>
                              {item.description && (
                                <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <div style={{ fontWeight: 600, color: '#6B4423', fontSize: '1.1rem', marginRight: '15px' }}>
                              €{item.price.toFixed(2)}
                            </div>
                            <button
                              onClick={() => setEditingItem(id)}
                              style={{
                                padding: '8px 15px',
                                background: '#6B4423',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontWeight: 600
                              }}
                            >
                              ✏️ Modifica
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </>
          )}

          {adminView === 'live' && (
            <>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div className="stat-card">
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6B4423' }}>
                    {orders.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString()).length}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Ordini Oggi</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6B4423' }}>
                    €{orders.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString())
                      .reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Incasso</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6B4423' }}>
                    €{(() => {
                      const todayOrders = orders.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString());
                      const total = todayOrders.reduce((sum, o) => sum + o.total, 0);
                      return todayOrders.length > 0 ? (total / todayOrders.length).toFixed(2) : '0.00';
                    })()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Scontrino Medio</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6B4423' }}>
                    {orders.filter(o => o.status === 'new' || o.status === 'preparing').length}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Ordini Attivi</div>
                </div>
              </div>

              {/* Live Orders */}
              <h2 style={{ margin: '20px 0 15px', color: '#6B4423', fontFamily: 'Playfair Display, serif' }}>Ordini Live</h2>
              {orders.filter(o => o.status !== 'completed').length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>Nessun ordine attivo al momento</p>
              ) : (
                orders.filter(o => o.status !== 'completed').reverse().map(order => (
                  <div key={order.id} className={`order-card ${order.status}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.2rem', color: '#6B4423' }}>Tavolo {order.table}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: order.status === 'new' ? '#FEF3C7' : order.status === 'preparing' ? '#FED7AA' : '#BBF7D0',
                        color: order.status === 'new' ? '#92400E' : order.status === 'preparing' ? '#9A3412' : '#166534'
                      }}>
                        {order.status === 'new' ? 'NUOVO' : order.status === 'preparing' ? 'IN PREPARAZIONE' : 'PRONTO'}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '0.9rem', color: '#333', marginBottom: '10px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ padding: '3px 0' }}>
                          <strong>{item.qty}x</strong> {item.name}
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ fontWeight: 600, color: '#6B4423', margin: '10px 0' }}>
                      Totale: €{order.total.toFixed(2)}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {order.status === 'new' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#D4A574',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontWeight: 600
                          }}
                        >
                          In Preparazione
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#93C572',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontWeight: 600
                          }}
                        >
                          Pronto
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontWeight: 600
                          }}
                        >
                          Consegnato
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {adminView === 'history' && (
            <>
              <h2 style={{ margin: '20px 0 15px', color: '#6B4423', fontFamily: 'Playfair Display, serif' }}>
                Storico Ordini - {new Date().toLocaleDateString()}
              </h2>
              {orders.slice().reverse().map(order => (
                <div key={order.id} style={{ 
                  background: order.status === 'completed' ? '#F9FAFB' : 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: '#6B4423', marginRight: '10px' }}>
                        Tavolo {order.table}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>
                        {new Date(order.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#6B4423' }}>
                      €{order.total.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {order.items.map((item, idx) => (
                      <span key={idx}>
                        {item.qty}x {item.name}
                        {idx < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {adminView === 'analytics' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ margin: 0, color: '#6B4423', fontFamily: 'Playfair Display, serif' }}>
                    Analytics - {getPeriodLabel()}
                  </h2>
                </div>

                {/* Date Range Selector */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <button
                    className={`date-filter-btn ${dateRange === 'today' ? 'active' : ''}`}
                    onClick={() => setDateRange('today')}
                  >
                    Oggi
                  </button>
                  <button
                    className={`date-filter-btn ${dateRange === 'yesterday' ? 'active' : ''}`}
                    onClick={() => setDateRange('yesterday')}
                  >
                    Ieri
                  </button>
                  <button
                    className={`date-filter-btn ${dateRange === 'week' ? 'active' : ''}`}
                    onClick={() => setDateRange('week')}
                  >
                    Ultimi 7 giorni
                  </button>
                  <button
                    className={`date-filter-btn ${dateRange === 'month' ? 'active' : ''}`}
                    onClick={() => setDateRange('month')}
                  >
                    Ultimi 30 giorni
                  </button>
                  <button
                    className={`date-filter-btn ${dateRange === 'custom' ? 'active' : ''}`}
                    onClick={() => setDateRange('custom')}
                  >
                    Personalizzato
                  </button>
                </div>

                {/* Custom Date Range */}
                {dateRange === 'custom' && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginBottom: '20px', 
                    padding: '15px', 
                    background: '#F9FAFB', 
                    borderRadius: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>
                        Data inizio
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>
                        Data fine
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  <div className="stat-card">
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6B4423' }}>{analytics.stats.totalOrders}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Ordini Totali</div>
                  </div>
                  <div className="stat-card">
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6B4423' }}>€{analytics.stats.totalRevenue.toFixed(2)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Incasso</div>
                  </div>
                  <div className="stat-card">
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6B4423' }}>€{analytics.stats.avgOrder.toFixed(2)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Scontrino Medio</div>
                  </div>
                  <div className="stat-card">
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6B4423' }}>{analytics.stats.completedOrders}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>Ordini Completati</div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              {analytics.topProducts.length > 0 && (
                <div style={{ background: 'white', border: '2px solid #E5E7EB', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                  <h3 style={{ color: '#6B4423', marginBottom: '15px' }}>📈 Prodotti Più Venduti</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} style={{ fontSize: '0.75rem' }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="qty" fill="#6B4423" name="Quantità" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Hourly Sales */}
              {analytics.hourlyData.length > 0 && (
                <div style={{ background: 'white', border: '2px solid #E5E7EB', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                  <h3 style={{ color: '#6B4423', marginBottom: '15px' }}>⏰ Vendite per Ora</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analytics.hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#6B4423" name="N° Ordini" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#93C572" name="Incasso €" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Category Distribution */}
              {analytics.categoryData.length > 0 && (
                <div style={{ background: 'white', border: '2px solid #E5E7EB', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                  <h3 style={{ color: '#6B4423', marginBottom: '15px' }}>🎯 Distribuzione per Categoria</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: €${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Revenue Table */}
              {analytics.topProducts.length > 0 && (
                <div style={{ background: 'white', border: '2px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
                  <h3 style={{ color: '#6B4423', marginBottom: '15px' }}>💰 Dettaglio Incassi per Prodotto</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #D4A574' }}>
                          <th style={{ textAlign: 'left', padding: '10px', color: '#6B4423' }}>Prodotto</th>
                          <th style={{ textAlign: 'center', padding: '10px', color: '#6B4423' }}>Quantità</th>
                          <th style={{ textAlign: 'right', padding: '10px', color: '#6B4423' }}>Incasso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topProducts.map((product, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '10px' }}>{product.name}</td>
                            <td style={{ textAlign: 'center', padding: '10px', fontWeight: 600 }}>{product.qty}</td>
                            <td style={{ textAlign: 'right', padding: '10px', fontWeight: 600, color: '#6B4423' }}>
                              €{product.revenue.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {analytics.topProducts.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  background: '#F9FAFB', 
                  borderRadius: '8px',
                  color: '#999'
                }}>
                  <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>📊</p>
                  <p>Nessun dato disponibile per il periodo selezionato</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
