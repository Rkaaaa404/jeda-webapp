import { useState, useEffect } from 'react';
import { ShoppingBag, Coins, Check, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const THEME_PREVIEWS = {
  'default': { bg: 'from-slate-900 to-slate-800', accent: 'emerald' },
  'dark-forest': { bg: 'from-green-900 to-emerald-950', accent: 'green' },
  'cyberpunk': { bg: 'from-purple-900 to-fuchsia-950', accent: 'fuchsia' },
  'blood-moon': { bg: 'from-red-950 to-black', accent: 'red' },
  'ice-palace': { bg: 'from-cyan-950 to-blue-950', accent: 'cyan' },
  'golden-emperor': { bg: 'from-yellow-900 to-amber-950', accent: 'yellow' }
};

const Shop = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [equippedTheme, setEquippedTheme] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      const [itemsRes, inventoryRes] = await Promise.all([
        fetch('/api/shop/items', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/shop/inventory', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const itemsData = await itemsRes.json();
      const inventoryData = await inventoryRes.json();

      setItems(itemsData.data || []);
      setInventory(inventoryData.data?.inventory || []);
      setEquippedTheme(inventoryData.data?.equippedTheme || 'default');
    } catch (error) {
      console.error('Failed to load shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (itemId) => {
    try {
      const res = await fetch(`/api/shop/purchase/${itemId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ ${data.message}`);
        loadShopData();
        window.location.reload(); // Refresh to update gold
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed!');
    }
  };

  const handleEquip = async (itemId) => {
    try {
      const res = await fetch(`/api/shop/equip/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ ${data.message}`);
        loadShopData();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Equip failed:', error);
    }
  };

  const isOwned = (itemId) => inventory.some(i => i._id === itemId);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <ShoppingBag className="text-yellow-400" size={40} />
                Slayer's Shop
              </h1>
              <p className="text-slate-400">Customize your hero's appearance with gold</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-600 to-amber-600 px-6 py-3 rounded-xl flex items-center gap-2">
              <Coins size={24} className="text-yellow-200" />
              <span className="text-2xl font-bold">{user?.gold || 0}g</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading shop...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => {
              const owned = isOwned(item._id);
              const equipped = equippedTheme === item.themeId;
              const canAfford = (user?.gold || 0) >= item.cost;
              const preview = THEME_PREVIEWS[item.themeId] || THEME_PREVIEWS.default;

              return (
                <div 
                  key={item._id}
                  className={`bg-gradient-to-br ${preview.bg} rounded-xl p-6 border-2 ${
                    equipped ? 'border-yellow-400' : 'border-slate-700'
                  } transition-all hover:scale-105`}
                >
                  {/* Theme Preview */}
                  <div className={`h-32 bg-gradient-to-r ${preview.bg} rounded-lg mb-4 flex items-center justify-center border border-slate-600`}>
                    <div className={`text-6xl`}>🎨</div>
                  </div>

                  {/* Item Info */}
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-300 mb-4">{item.description}</p>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins size={20} className="text-yellow-400" />
                      <span className="text-xl font-bold text-yellow-400">{item.cost}g</span>
                    </div>

                    {equipped ? (
                      <div className="bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2">
                        <Check size={18} />
                        Equipped
                      </div>
                    ) : owned ? (
                      <button
                        onClick={() => handleEquip(item._id)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Equip
                      </button>
                    ) : item.cost === 0 ? (
                      <button
                        onClick={() => handlePurchase(item._id)}
                        className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Claim Free
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item._id)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                          canAfford 
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-slate-700 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {canAfford ? (
                          <>Purchase</>
                        ) : (
                          <>
                            <Lock size={16} />
                            Locked
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            ← Back to Quests
          </a>
        </div>
      </div>
    </div>
  );
};

export default Shop;
