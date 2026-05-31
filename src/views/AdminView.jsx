import { useState } from 'react';
import { Loader2, Plus, Trash2, Wand2 } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import callGeminiAPI from '../services/geminiApi';

const AdminView = ({ db, setDb }) => {
  const [activeTab, setActiveTab] = useState('shirts');
  const [formData, setFormData] = useState({ name: '', price: '', image: '' });
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleDelete = (id, category) => {
    setDb(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: Number(formData.price),
      image: formData.image || `https://placehold.co/400x500/0f172a/ffffff?text=${formData.name.replace(/ /g, '+')}`
    };

    setDb(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItem]
    }));
    setFormData({ name: '', price: '', image: '' });
  };
  
  const handleAIEnhance = async () => {
    if (!formData.name) return;
    setIsEnhancing(true);
    try {
      const prompt = `
        I am adding a new ${activeTab === 'combinations' ? 'outfit pair' : activeTab.slice(0, -1)} to my premium glass/water-themed apparel store "Glass Apparel".
        The basic idea I have is: "${formData.name}".
        
        Generate a premium, captivating product name and suggest a reasonable premium price (between $40 and $150).
        Return ONLY a JSON object with this exact schema:
        {
          "name": "The enhanced premium name",
          "price": 85
          }
      `;
      const result = await callGeminiAPI(prompt, true);
      setFormData(prev => ({ ...prev, name: result.name, price: result.price }));
    } catch (err) {
      console.error("AI Enhance failed", err);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 w-full">
      <FadeIn>
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide">Data Update Register</h2>
          <p className="text-white/70 mt-2 text-sm sm:text-base">Simulated MongoDB Backend Controller. Add or remove products instantly.</p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-8 bg-black/20 p-2 rounded-2xl w-full sm:w-fit justify-center sm:justify-start">
          {['shirts', 'pants', 'combinations'].map(tab => (
            <button 
            key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 rounded-xl font-bold text-sm sm:text-base capitalize transition-colors flex-1 sm:flex-none text-center ${activeTab === tab ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Form */}
        <FadeIn delay={200} className="lg:col-span-1">
          <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold mb-4">Add New {activeTab.slice(0,-1)}</h3>
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-semibold">Name</label>
                <button 
                  type="button"
                  onClick={handleAIEnhance}
                  disabled={isEnhancing || !formData.name}
                  className="text-xs flex items-center gap-1 text-teal-300 hover:text-teal-200 disabled:opacity-50 transition"
                >
                  {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                  {isEnhancing ? 'Enhancing...' : '✨ AI Enhance'}
                </button>
              </div>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400 transition"
                placeholder="e.g. Silk Shirt"
                />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Price ($)</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400 transition"
                placeholder="e.g. 45"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Image URL (Optional)</label>
              <input 
                type="text" 
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400 transition"
                placeholder="Leave blank for placeholder"
              />
            </div>
            <button type="submit" className="w-full glass-button py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2">
              <Plus size={18} /> Add to Database
            </button>
          </form>
        </FadeIn>

        {/* List */}
        <FadeIn delay={300} className="lg:col-span-2">
          <div className="glass-panel p-4 sm:p-6 rounded-3xl min-h-[400px]">
            <h3 className="text-xl font-bold mb-4 sm:mb-6 capitalize">Current {activeTab}</h3>
            <div className="space-y-3">
              {db[activeTab].map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl hover:bg-white/10 transition gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <img src={item.image} alt={item.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base truncate">{item.name}</p>
                      <p className="text-xs sm:text-sm text-teal-200">${item.price}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id, activeTab)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition shrink-0"
                  >
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}
              {db[activeTab].length === 0 && (
                <p className="text-white/50 text-center py-8">No items found in {activeTab}.</p>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
export default AdminView;