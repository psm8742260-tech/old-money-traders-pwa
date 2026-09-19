import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

const initialCoinRates = [
  {
    id: "rate-1",
    nameTe: "1 దమ్మిడి (1 Dammidi / 1 Pie)",
    nameEn: "1 Dammidi (1/192 Rupee)",
    denomination: "1 దమ్మిడి",
    era: "బ్రిటీష్ ఇండియా / ఈస్ట్ ఇండియా కంపెనీ (1835-1942)",
    rate: "85,000",
    rarity: "Ultra Rare",
    rarityTe: "అత్యంత అరుదైనది",
    category: "coin",
    description: "పురాతన భారతదేశంలో అతిచిన్న ద్రవ్య ప్రమాణం (1/12 అణా). బ్రిటిష్ రాజుల చిహ్నం కలది."
  },
  {
    id: "rate-2",
    nameTe: "1 కాణి / పావు అణా (1 Kaani / 1/4th Anna)",
    nameEn: "1 Kaani (1/64 Rupee)",
    denomination: "1 కాణి",
    era: "బ్రిటిష్ పాలన (1862-1939)",
    rate: "70,000",
    rarity: "Rare",
    rarityTe: "చాలా అరుదైనది",
    category: "coin",
    description: "రాగి నాణెం, విక్టోరియా రాణి & ఎడ్వర్డ్ VII ముద్రికలు కలది."
  },
  {
    id: "rate-3",
    nameTe: "1 పైసా / తొట్టి పైసా (Center Hole 1 Pice)",
    nameEn: "1 Pice Hole Coin",
    denomination: "1 పైసా",
    era: "రెండవ ప్రపంచ యుద్ధ కాలం (1943-1947)",
    rate: "45,000",
    rarity: "Vintage",
    rarityTe: "వింటేజ్ కలెక్షన్",
    category: "coin",
    description: "మధ్యలో రంధ్రం ఉన్న చారిత్రక నాణెం, కిరీటం ఆకృతితో ఉంటుంది."
  },
  {
    id: "rate-4",
    nameTe: "అర్ధణా / 1/2 అణా (Half Anna Coin)",
    nameEn: "Half Anna (1/32 Rupee)",
    denomination: "అర్ధణా",
    era: "కింగ్ జార్జ్ V / VI (1906-1940)",
    rate: "60,000",
    rarity: "Rare",
    rarityTe: "అరుదైన నాణెం",
    category: "coin",
    description: "ప్రత్యేక చదరపు లేదా గుండ్రని అంచు గల నికెల్/రాగి నాణెం."
  },
  {
    id: "rate-5",
    nameTe: "1 అణా (1 Anna - 12 అంచుల నాణెం)",
    nameEn: "1 Anna Scalloped Coin",
    denomination: "1 అణా",
    era: "బ్రిటిష్ ఇండియా & 1950 గణతంత్ర భారతం",
    rate: "55,000",
    rarity: "Vintage",
    rarityTe: "వింటేజ్ డిమాండ్",
    category: "coin",
    description: "12 తరంగాల అంచులు (12-scalloped) మరియు ఎద్దు చిహ్నంతో కూడిన నాణెం."
  },
  {
    id: "rate-6",
    nameTe: "2 అణాలు / బేడ (2 Annas / Beda)",
    nameEn: "2 Annas (1/8th Rupee)",
    denomination: "2 అణాలు / బేడ",
    era: "1918-1947 కింగ్ జార్జ్ V & VI",
    rate: "65,000",
    rarity: "Rare",
    rarityTe: "అరుదైనది",
    category: "coin",
    description: "చతురస్రాకార అంచులు గల ప్రత్యేక నికెల్-ఇత్తడి నాణెం."
  },
  {
    id: "rate-7",
    nameTe: "4 అణాలు / పావలా (4 Annas / Pavala - 25 పైసలు)",
    nameEn: "4 Annas / Pavala (Quarter Rupee)",
    denomination: "4 అణాలు / పావలా",
    era: "బ్రిటిష్ ఇండియా వెండి & 1950 నికెల్",
    rate: "75,000",
    rarity: "High Demand",
    rarityTe: "అధిక డిమాండ్",
    category: "coin",
    description: "స్వచ్ఛమైన వెండి పావలా & 1950ల సింహ చిహ్న పావలా నాణెం."
  },
  {
    id: "rate-8",
    nameTe: "8 అణాలు / అర్ధ రూపాయి (8 Annas / Half Rupee)",
    nameEn: "8 Annas / Half Rupee Silver",
    denomination: "8 అణాలు (అర్ధ రూపాయి)",
    era: "1862-1945 వెండి నాణెం",
    rate: "95,000",
    rarity: "High Demand",
    rarityTe: "రాయల్ వెండి నిల్వ",
    category: "coin",
    description: "కింగ్ జార్జ్ & విక్టోరియా వెండి ముద్రిక గల 50 పైసల అర్ధ రూపాయి."
  },
  {
    id: "rate-9",
    nameTe: "1 రూపాయి రాయల్ వెండి కాయిన్ (1 Rupee George V / Victoria)",
    nameEn: "1 Rupee Pure Silver Royal Coin",
    denomination: "1 వెండి రూపాయి",
    era: "1840-1945 విక్టోరియా / జార్జ్ V చక్రవర్తి",
    rate: "1,50,000",
    rarity: "Ultra Rare",
    rarityTe: "రాయల్ వెండి నాణెం",
    category: "coin",
    description: "స్వచ్ఛమైన వెండితో కూడిన చారిత్రక 1 రూపాయి నాణెం, అత్యధిక మార్కెట్ విలువ."
  },
  {
    id: "rate-10",
    nameTe: "1 రూపాయి 1947 స్వతంత్ర భారత పులి నాణెం (1947 Tiger Rupee)",
    nameEn: "1947 Tiger 1 Rupee Coin",
    denomination: "1 రూపాయి పులి కాయిన్",
    era: "1947 స్వాతంత్ర్య సంక్రమణ కాలం",
    rate: "1,20,000",
    rarity: "Ultra Rare",
    rarityTe: "చారిత్రక ప్రాధాన్యత",
    category: "coin",
    description: "భారతదేశానికి స్వాతంత్ర్యం వచ్చిన 1947 నాటి ప్రసిద్ధ నడుస్తున్న పులి బొమ్మ నాణెం."
  },
  {
    id: "rate-11",
    nameTe: "2 రూపాయల జాతీయ సమగ్రత నాణెం (National Integration)",
    nameEn: "2 Rupees National Map Coin",
    denomination: "2 రూపాయలు",
    era: "1982-1992 భారత మ్యాప్ నాణెం",
    rate: "40,000",
    rarity: "Vintage",
    rarityTe: "వింటేజ్ డిమాండ్",
    category: "coin",
    description: "వెనుకభాగం భారత దేశ పటం (Indian Map) గల అష్టభుజి నాణెం."
  },
  {
    id: "rate-12",
    nameTe: "5 రూపాయల ఇందిరా గాంధీ / నెహ్రూ స్మారక కాయిన్",
    nameEn: "5 Rupees Commemorative Coin",
    denomination: "5 రూపాయలు",
    era: "1984-1989 స్మారక విడుదల",
    rate: "80,000",
    rarity: "Rare",
    rarityTe: "స్మారక నిల్వ",
    category: "coin",
    description: "మొట్టమొదటి భారీ పరిమాణ కాపర్-నికెల్ స్మారక నాణెం."
  },
  {
    id: "rate-13",
    nameTe: "10 రూపాయల పడవ బొమ్మ నోటు (₹10 Vintage Boat Note)",
    nameEn: "₹10 RBI Vintage Boat Dhow Note",
    denomination: "₹10 పడవ నోటు",
    era: "1950-1970 క్లాసిక్ RBI సిరీస్",
    rate: "2,50,000",
    rarity: "Ultra Rare",
    rarityTe: "అత్యధిక విలువైన నోటు",
    category: "note",
    description: "సముద్రంలో పడవ (Dhow Boat) ముద్రణ మరియు రిజర్వ్ బ్యాంక్ గవర్నర్ సంతకంతో అత్యంత డిమాండ్."
  },
  {
    id: "rate-14",
    nameTe: "10 రూపాయల 3 పులుల పాత నోటు (₹10 Three Tigers Note)",
    nameEn: "₹10 Three Tigers Banknote",
    denomination: "₹10 పులుల నోటు",
    era: "1960-1975 క్లాసిక్ సిరీస్",
    rate: "1,90,000",
    rarity: "Rare",
    rarityTe: "చాలా అరుదైన నోటు",
    category: "note",
    description: "మూడు పులుల గ్రాఫిక్ చిత్రణతో ముద్రించిన బ్రిటిష్/స్వతంత్ర భారత నోటు."
  },
  {
    id: "rate-15",
    nameTe: "10 రూపాయల నెమలి నోటు (₹10 RBI Peacock Note)",
    nameEn: "₹10 Vintage Peacock Banknote",
    denomination: "₹10 నెమలి నోటు",
    era: "1968-1985 మహాత్మా గాంధీ శతాబ్దికి మునుపటి నోటు",
    rate: "1,80,000",
    rarity: "Rare",
    rarityTe: "కలెక్టర్స్ చాయిస్",
    category: "note",
    description: "వెనుకభాగంలో అందమైన నెమలి చిత్రణ ఉన్న ప్రాచీన రిజర్వ్ బ్యాంక్ నోటు."
  },
  {
    id: "rate-16",
    nameTe: "10 రూపాయల 786 లక్కీ సీరియల్ నంబర్ నోటు",
    nameEn: "₹10 Lucky 786 Holy Serial Note",
    denomination: "₹10 లక్కీ 786",
    era: "అన్ని పాత & వింటేజ్ సిరీస్‌లు",
    rate: "3,00,000",
    rarity: "Ultra Rare",
    rarityTe: "పవిత్ర లక్కీ సీరియల్",
    category: "note",
    description: "సీరియల్ నంబర్‌లో 786 సంఖ్య కలిగిన ప్రత్యేక పవిత్ర నోట్లు."
  },
  {
    id: "rate-17",
    nameTe: "100 రూపాయల రైతు ట్రాక్టర్ పాత నోటు (₹100 Tractor Note)",
    nameEn: "₹100 Farmer Tractor Vintage Note",
    denomination: "₹100 ట్రాక్టర్ నోటు",
    era: "1975-1990 వ్యవసాయ విప్లవ సిరీస్",
    rate: "2,00,000",
    rarity: "High Demand",
    rarityTe: "అత్యధిక డిమాండ్",
    category: "note",
    description: "పొలంలో రైతు ట్రాక్టర్ దున్నుతున్న ప్రసిద్ధ చారిత్రక నోటు."
  }
];

const store = {
  transactions: [] as any[],
  messages: [] as any[],
  coinRates: [...initialCoinRates] as any[],
};


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  
  app.get("/api/health", (req, res) => { res.json({ status: "ok" }); });
  app.get("/api/messages", (req, res) => { res.json(store.messages); });
  app.post("/api/messages", (req, res) => {
    const msg = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...req.body };
    store.messages.push(msg);
    res.json({ success: true, message: msg });
  });

  // Agent AI reply endpoint with multi-language instruction
  app.post("/api/agent-reply", async (req, res) => {
    const { message, languageCode = 'te', languageName = 'Telugu', serialNumber, expectedPrice, estimatedValue } = req.body;
    const ai = getGemini();

    if (ai) {
      try {
        const prompt = `You are the expert evaluation agent of 'Coin Selling and Buying' platform. 
CRITICAL RULE: You MUST speak and respond ONLY in ${languageName} (${languageCode}). Do not use any other language.
User's message / submission: "${message || ''}".
Item details if provided: Serial Number: "${serialNumber || 'N/A'}", User Expected Price: "₹${expectedPrice || 'N/A'}", Estimated Market Value: "${estimatedValue || 'N/A'}".
Provide a professional, courteous, and accurate reply in ${languageName} answering their query, validating their item, or guiding them on next steps for verification and payout. Keep your response within 2-4 sentences.`;

        const response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt
        });

        const replyText = response.text?.trim();
        if (replyText) {
          return res.json({ success: true, reply: replyText });
        }
      } catch (err) {
        console.error("Gemini API error:", err);
      }
    }

    // Return fallback signal so client uses localized expert reply
    res.json({ success: false, fallback: true });
  });

  // Official Coin & Note Rates Master endpoints
  app.get("/api/coin-rates", (req, res) => {
    res.json(store.coinRates);
  });

  app.put("/api/coin-rates/:id", (req, res) => {
    const index = store.coinRates.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      store.coinRates[index] = { 
        ...store.coinRates[index], 
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      res.json({ success: true, item: store.coinRates[index] });
    } else {
      res.status(404).json({ error: "Rate item not found" });
    }
  });

  app.post("/api/coin-rates/batch", (req, res) => {
    const { updates } = req.body; // array of { id, rate }
    if (Array.isArray(updates)) {
      updates.forEach(up => {
        const idx = store.coinRates.findIndex(c => c.id === up.id);
        if (idx !== -1) {
          store.coinRates[idx] = { 
            ...store.coinRates[idx], 
            rate: up.rate,
            updatedAt: new Date().toISOString()
          };
        }
      });
      return res.json({ success: true, coinRates: store.coinRates });
    }
    res.status(400).json({ error: "Invalid updates format" });
  });

  app.post("/api/coin-rates/reset", (req, res) => {
    store.coinRates = [...initialCoinRates];
    res.json({ success: true, coinRates: store.coinRates });
  });

  app.get("/api/transactions", (req, res) => { res.json(store.transactions); });

  app.post("/api/transactions", (req, res) => {
    const tx = { 
      id: Date.now().toString(), 
      timestamp: new Date().toISOString(), 
      ...req.body,
      // Ensure specific fields are mapped if they come in different names
      aadhaarNumber: req.body.aadhaarNumber || req.body.userAadhar,
      addressRoad: req.body.addressRoad || req.body.userAddress,
      phoneNumber: req.body.phoneNumber || req.body.userPhone
    };
    store.transactions.push(tx);
    res.json({ success: true, transaction: tx });
  });
  app.put("/api/transactions/:id", (req, res) => {
    const index = store.transactions.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
      store.transactions[index] = { ...store.transactions[index], ...req.body };
      res.json({ success: true, transaction: store.transactions[index] });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => { res.sendFile(path.join(distPath, 'index.html')); });
  }

  app.listen(PORT, "0.0.0.0", () => { console.log(`Server running on port ${PORT}`); });
}

startServer();
