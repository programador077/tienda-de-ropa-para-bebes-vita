import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GeoLocation, GroundingChunk } from "../types";

// Initialize the API client
// Note: We create a new instance per request to ensure fresh API key usage if needed, 
// though for this demo a singleton is also fine if the key is static.
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  const ai = getAIClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `Sos 'VitaBot', el asistente virtual amable y experto de 'BabyVita', una tienda de ropa de bebés ubicada en La Rioja Capital, Argentina.
      
      Tu tono debe ser dulce, tranquilizador y servicial con los padres (usá modismos argentinos suaves, tratá de 'vos').
      
      Información Clave de la Tienda:
      - Ubicación Principal: Centro de La Rioja Capital.
      - Vendemos ropa premium de bebé, accesorios y juguetes.
      - Precios en Pesos Argentinos (ARS).
      - Aceptamos Mercado Pago (Dinero en cuenta, Débito) y todas las Tarjetas de Crédito (Visa, Mastercard, Amex, Cabal).
      - Envíos a todo el país (Andreani / Correo Argentino) y retiros en el local de La Rioja.
      
      Ayudá con talles, ideas para regalos y recomendaciones de productos.
      Mantené las respuestas concisas (menos de 100 palabras) a menos que te pidan más detalles.`,
    },
  });
};

export const findNearbyStores = async (query: string, location?: GeoLocation): Promise<{ text: string, chunks?: GroundingChunk[] }> => {
  const ai = getAIClient();
  
  const retrievalConfig = location ? {
    latLng: {
      latitude: location.latitude,
      longitude: location.longitude
    }
  } : undefined;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: retrievalConfig ? {
          retrievalConfig: retrievalConfig
        } : undefined,
      },
    });

    const text = response.text || "No pude encontrar información.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return { text, chunks };

  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Lo siento, tengo problemas para conectar con los mapas en este momento." };
  }
};

export const generateProductDescription = async (name: string, category: string, price: number): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Escribí una descripción corta, tierna y vendedora (máximo 2 oraciones) para un producto de bebé llamado "${name}".
      Categoría: ${category}.
      Precio: $${price} ARS.
      Contexto: Tienda de ropa de bebé 'BabyVita' en Argentina. Usá un tono dulce, emotivo y profesional.`,
    });

    return response.text || "Descripción no disponible.";
  } catch (error) {
    console.error("AI Description Error:", error);
    return "Una prenda hermosa y cómoda para tu bebé. Ideal para regalar o usar todos los días.";
  }
};