import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

export interface BotResponseResult {
  reply: string;
  wantsHumanHandoff: boolean;
}

const HUMAN_INTENT_KEYWORDS = [
  'mit dir',
  'mit mir',
  'mensch',
  'mitarbeiter',
  'echte person',
  'persönlich',
  'chef',
  'echter',
  'verbinde',
  'sprechen',
  'telefonieren',
  'supporten',
  'hilfe von dir',
  'echten',
  'jemand echten',
  'jemand da',
];

export function checkHumanIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return HUMAN_INTENT_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function generateBotReply(
  userMessage: string,
  products: Product[]
): Promise<BotResponseResult> {
  // 1. Check for immediate human handoff request
  if (checkHumanIntent(userMessage)) {
    return {
      reply:
        'Alles klar! Ich verbinde dich sofort mit unserem Shop-Mitarbeiter. Er wurde soeben benachrichtigt und wird diesen Chat gleich persönlich übernehmen. Bitte bleib kurz im Chat!',
      wantsHumanHandoff: true,
    };
  }

  const lower = userMessage.toLowerCase();

  // 2. Specific FAQ handling for discount code 10pz and shop details
  if (lower.includes('10pz') || lower.includes('rabatt') || lower.includes('gutschein') || lower.includes('code')) {
    return {
      reply:
        'Mit dem Gutscheincode "10pz" erhältst du 10% Rabatt auf deine gesamte Bestellung! Du kannst ihn einfach im Warenkorb unter "Code einlösen" eingeben. Außerdem gibt es ab 50 € kostenlosen Versand!',
      wantsHumanHandoff: false,
    };
  }

  if (lower.includes('versand') || lower.includes('lieferung') || lower.includes('kosten')) {
    return {
      reply:
        'Wir versenden alle Bestellungen innerhalb von 2-3 Werktagen. Ab einem Bestellwert von 50 € ist der Versand komplett kostenlos (darunter 4,90 €). Den aktuellen Status kannst du live unter "Meine Einkäufe" verfolgen!',
      wantsHumanHandoff: false,
    };
  }

  if (lower.includes('rückgabe') || lower.includes('zurück') || lower.includes('garantie')) {
    return {
      reply:
        'Wir bieten ein 30-tägiges Rückgaberecht für alle unbenutzten Artikel. Du kannst Artikel einfach zurücksenden oder uns bei Fragen kontaktieren.',
      wantsHumanHandoff: false,
    };
  }

  // 3. Try Gemini API if API key is present in environment
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const productList = products.map((p) => `${p.title} (${p.price}€)`).join(', ');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction: `Du bist der freundliche AI-Support-Bot des Online-Shops "Artisan & Co.".
Unser Sortiment: ${productList}.
Wichtige Infos:
- Rabattcode "10pz" gibt 10% Rabatt!
- Kostenloser Versand ab 50€, sonst 4,90€.
- Wenn der Kunde mit einem echten Menschen / Mitarbeiter / dem Shop-Betreiber sprechen oder schreiben möchte, antworte freundlich und füge am Ende exakt "[HANDOFF]" ein.
Halte Antworten kurz, hilfsbereit und sympathisch auf Deutsch.`,
        },
      });

      const text = response.text || '';
      if (text.includes('[HANDOFF]')) {
        return {
          reply: text.replace('[HANDOFF]', '').trim() || 'Ich leite dich jetzt an unseren Mitarbeiter weiter.',
          wantsHumanHandoff: true,
        };
      }

      return {
        reply: text,
        wantsHumanHandoff: false,
      };
    } catch {
      // fallback to domain response
    }
  }

  // 4. Default helpful fallback response
  return {
    reply:
      `Hallo! Ich helfe dir gerne bei Fragen zu unseren handverlesenen Produkten, dem Versand oder Rabatten. Tipp: Mit dem Code "10pz" sparst du 10%! Falls du lieber persönlich mit einem echten Menschen schreiben möchtest, sag einfach "Ich will mit einem Mitarbeiter sprechen" oder klicke unten auf "Mit Mitarbeiter verbinden".`,
    wantsHumanHandoff: false,
  };
}
