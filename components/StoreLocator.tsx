import React, { useState } from 'react';
import { MapPin, Navigation, Search, Loader2, ExternalLink } from 'lucide-react';
import { findNearbyStores } from '../services/geminiService';
import { GroundingChunk, GeoLocation } from '../types';
import ReactMarkdown from 'react-markdown';

const StoreLocator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, chunks?: GroundingChunk[] } | null>(null);
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLoading(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("La geolocalización no es compatible con tu navegador.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
        // Auto search after getting location
        handleSearch("Tiendas de ropa de bebé cerca de mí", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
      },
      (error) => {
        setLocationError("No pudimos obtener tu ubicación. Por favor escribí el nombre de tu ciudad.");
        setLoading(false);
      }
    );
  };

  const handleSearch = async (searchQuery: string, loc?: GeoLocation) => {
    if (!searchQuery.trim() && !loc) return;
    
    setLoading(true);
    setResult(null);

    const activeLocation = loc || userLocation;
    // Default to searching in La Rioja if no query provided and no location
    const effectiveQuery = searchQuery || (activeLocation ? "Tiendas de ropa de bebé cerca de mí" : "Tiendas de ropa de bebé en La Rioja Capital");
    
    if(!effectiveQuery) {
        setLoading(false);
        return;
    }

    try {
      const data = await findNearbyStores(effectiveQuery, activeLocation || undefined);
      setResult(data);
    } catch (e) {
      setResult({ text: "Lo siento, hubo un error al buscar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-pink-50 to-purple-50">
          <h2 className="text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            <MapPin className="text-pink-500 w-8 h-8" />
            Nuestras Sucursales
          </h2>
          <p className="text-slate-600 mb-6">
            Visitá nuestro local principal en <strong>La Rioja Capital</strong> o encontrá puntos de venta cercanos con nuestra búsqueda inteligente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="ej. Centro de La Rioja, Barrio General Paz..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/80 backdrop-blur-sm"
              />
              <Search className="absolute left-4 top-3.5 text-pink-300 w-5 h-5" />
            </div>
            
            <button 
              onClick={() => handleSearch(query)}
              disabled={loading}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar'}
            </button>

            <button 
              onClick={handleGetLocation}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-pink-500 border border-pink-200 rounded-xl font-semibold transition-colors whitespace-nowrap"
            >
              <Navigation className="w-5 h-5" />
              Cerca de mí
            </button>
          </div>
          {locationError && <p className="text-red-400 mt-2 text-sm">{locationError}</p>}
        </div>

        {result && (
            <div className="p-8">
                <div className="prose prose-pink max-w-none text-slate-700">
                    <ReactMarkdown>{result.text}</ReactMarkdown>
                </div>

                {result.chunks && result.chunks.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.chunks.map((chunk, i) => {
                            if (!chunk.maps) return null;
                            const mapData = chunk.maps;
                            return (
                                <a 
                                    key={i} 
                                    href={mapData.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block p-4 rounded-xl border border-slate-100 hover:border-pink-300 hover:shadow-md transition-all bg-white group"
                                >
                                    <h4 className="font-semibold text-lg text-slate-800 group-hover:text-pink-600 flex items-center justify-between">
                                        {mapData.title}
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h4>
                                    {mapData.placeAnswerSources?.reviewSnippets?.[0] && (
                                        <p className="text-sm text-slate-500 mt-2 italic">
                                            "{mapData.placeAnswerSources.reviewSnippets[0].content}"
                                        </p>
                                    )}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default StoreLocator;