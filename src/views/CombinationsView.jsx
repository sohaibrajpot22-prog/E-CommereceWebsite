import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import callGeminiAPI from '../services/geminiApi';

const CombinationsView = ({ combinations, db, setDb, onAdd }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  
  const generateAIOutfit = async () => {
    setIsGenerating(true);
    setAiError('');
    try {
      const prompt = `
        You are an expert fashion stylist for a premium glass/water-themed apparel brand called "Glass Apparel".
        Here are our current shirts: ${JSON.stringify(db.shirts.map(s => ({id: s.id, name: s.name, price: s.price})))}.
        Here are our current pants: ${JSON.stringify(db.pants.map(p => ({id: p.id, name: p.name, price: p.price})))}.
        
        Create a stunning new outfit combination using one shirt and one pant from the lists above.
        Return ONLY a JSON object with this exact schema:
        {
          "name": "A creative, premium name for this outfit (e.g., 'The Ocean Breeze Pair')",
          "shirtId": "id of selected shirt",
          "pantId": "id of selected pant",
          "price": <Number representing calculated total price minus a 15% discount rounded to nearest integer>,
          "rationale": "A 1-sentence marketing description of why these two pieces go perfectly together"
        }
        `;
      const result = await callGeminiAPI(prompt, true);
      
      const newCombo = {
        id: 'c' + Math.random().toString(36).substr(2, 5),
        name: result.name,
        price: result.price,
        shirtId: result.shirtId,
        pantId: result.pantId,
        rationale: result.rationale,
        image: `https://placehold.co/600x400/083344/ffffff?text=${result.name.replace(/ /g, '+')}`
      };
      
      setDb(prev => ({
        ...prev,
        combinations: [newCombo, ...prev.combinations]
      }));
    } catch {
      setAiError('Failed to generate outfit. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/20 pb-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-wide inline-block">Curated Pairs</h2>
            <p className="text-white/70 mt-2 text-base sm:text-lg">Perfectly matched shirts and pants for a seamless look.</p>
          </div>
          <button 
            onClick={generateAIOutfit}
            disabled={isGenerating}
            className="w-full md:w-auto justify-center glass-button px-6 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap bg-teal-500/20 hover:bg-teal-500/40 border-teal-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="text-teal-300" />}
            {isGenerating ? 'Styling...' : '✨ AI Stylist'}
          </button>
        </div>
        {aiError && <p className="text-red-400 mt-2">{aiError}</p>}
      </FadeIn>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mt-4 sm:mt-8">
        {combinations.map((combo, idx) => (
          <FadeIn key={combo.id} delay={idx * 150}>
            <div className="glass-panel rounded-4xl sm:rounded-6xl p-4 flex flex-col sm:flex-row gap-6 group hover:border-white/40 transition duration-500 relative overflow-hidden">
              {combo.rationale && (
                <div className="absolute top-0 right-0 bg-teal-500/20 border-l border-b border-teal-500/30 px-3 sm:px-4 py-1 rounded-bl-xl sm:rounded-bl-2xl rounded-tr-3xl sm:rounded-tr-5xl text-[10px] sm:text-xs font-bold text-teal-200 flex items-center gap-1 backdrop-blur-md z-10">
                   <Sparkles size={10} className="sm:w-3 sm:h-3" /> AI Suggested
                 </div>
              )}
              <div className="w-full sm:w-2/5 md:w-1/2 h-64 sm:h-80 rounded-3xl sm:rounded-4xl overflow-hidden shrink-0">
                 <img 
                  src={combo.image} 
                  alt={combo.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
              </div>
              <div className="w-full sm:w-3/5 md:w-1/2 flex flex-col justify-center space-y-3 sm:space-y-4 px-2 sm:px-4 pb-2 sm:pb-0">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold">{combo.name}</h3>
                  <p className="text-xl sm:text-2xl text-teal-300 font-bold mt-1 sm:mt-2">${combo.price}</p>
                </div>
                <div className="space-y-2 text-white/80 text-xs sm:text-sm">
                  <p>✓ Premium Shirt Included</p>
                  <p>✓ Luxury Pants Included</p>
                  <p>✓ 15% Bundle Discount</p>
                </div>
                {combo.rationale && (
                  <p className="text-teal-100/80 text-xs sm:text-sm italic border-l-2 border-teal-500/50 pl-3">
                    "{combo.rationale}"
                  </p>
                )}
                <button 
                  onClick={() => onAdd(combo)}
                  className="glass-button py-3 mt-2 rounded-2xl font-bold text-base sm:text-lg w-full"
                >
                  Buy The Look
                </button>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};
export default CombinationsView;