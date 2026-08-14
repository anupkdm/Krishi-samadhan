import api from './api';

const FALLBACK_INPUT_STORES = [
  // SEEDS
  {
    id: "seed-1",
    category: "seeds",
    crop: "Cotton (कापूस)",
    variety: "Rasi RCH-659 BG-II Hybrid Cotton",
    brand: "Rasi Seeds",
    packSize: "450 gm",
    avgPrice: 864,
    shops: [
      { shopName: "Kisan Krishi Seva Kendra", locality: "Sangamner", district: "Ahmednagar", price: 860, stock: "In Stock (120 pkts)", rating: 4.8 },
      { shopName: "Sai Agro Agency", locality: "Kopargaon", district: "Ahmednagar", price: 864, stock: "In Stock (85 pkts)", rating: 4.7 },
      { shopName: "Maharashtra Beej Bhandar", locality: "Nashik", district: "Nashik", price: 855, stock: "In Stock (200 pkts)", rating: 4.9 },
      { shopName: "Sinnar Agro Centre", locality: "Sinnar", district: "Nashik", price: 864, stock: "Limited Stock (30 pkts)", rating: 4.5 }
    ]
  },
  {
    id: "seed-2",
    category: "seeds",
    crop: "Onion (कांदा)",
    variety: "Pusa Red / Kalash F1 Red Onion Seeds",
    brand: "Kalash Seeds / Mahabeej",
    packSize: "1 kg",
    avgPrice: 1850,
    shops: [
      { shopName: "Maheshwari Krishi Seva", locality: "Yeola", district: "Nashik", price: 1820, stock: "In Stock (40 kg)", rating: 4.9 },
      { shopName: "Sai Baba Agro Services", locality: "Shirdi", district: "Ahmednagar", price: 1850, stock: "In Stock (25 kg)", rating: 4.6 },
      { shopName: "Godavari Agro Inputs", locality: "Rahata", district: "Ahmednagar", price: 1840, stock: "In Stock (35 kg)", rating: 4.8 },
      { shopName: "Nashik Kisan Super Mart", locality: "Nashik", district: "Nashik", price: 1800, stock: "In Stock (100 kg)", rating: 4.9 }
    ]
  },
  {
    id: "seed-3",
    category: "seeds",
    crop: "Wheat (गहू)",
    variety: "HD-2967 Certified Wheat Seeds",
    brand: "Mahabeej (Maharashtra State Seeds Corp)",
    packSize: "40 kg bag",
    avgPrice: 1480,
    shops: [
      { shopName: "Sangamner Taluka Sahakari Kharedi Vikri Sangh", locality: "Sangamner", district: "Ahmednagar", price: 1450, stock: "In Stock (300 bags)", rating: 4.8 },
      { shopName: "Kopargaon Farmers Agro Care", locality: "Kopargaon", district: "Ahmednagar", price: 1480, stock: "In Stock (150 bags)", rating: 4.6 },
      { shopName: "Sinnar Krishi Vikas Kendra", locality: "Sinnar", district: "Nashik", price: 1475, stock: "In Stock (90 bags)", rating: 4.7 }
    ]
  },
  // PESTICIDES
  {
    id: "pest-1",
    category: "pesticides",
    name: "Coragen (Chlorantraniliprole 18.5% SC)",
    brand: "FMC India",
    packSize: "60 ml",
    targetPest: "Bollworm, Stem Borer, Diamondback Moth",
    avgPrice: 940,
    shops: [
      { shopName: "Kisan Krishi Seva Kendra", locality: "Sangamner", district: "Ahmednagar", price: 920, stock: "In Stock", rating: 4.8 },
      { shopName: "Sai Agro Agency", locality: "Kopargaon", district: "Ahmednagar", price: 935, stock: "In Stock", rating: 4.7 },
      { shopName: "Nashik Agro Chemicals", locality: "Nashik", district: "Nashik", price: 915, stock: "In Stock", rating: 4.9 },
      { shopName: "Yeola Krishi Seva", locality: "Yeola", district: "Nashik", price: 940, stock: "In Stock", rating: 4.6 }
    ]
  },
  {
    id: "pest-2",
    category: "pesticides",
    name: "Proclaim (Emamectin Benzoate 5% SG)",
    brand: "Syngenta India",
    packSize: "100 gm",
    targetPest: "Caterpillars, Pod Borers, Thrips",
    avgPrice: 420,
    shops: [
      { shopName: "Godavari Agro Inputs", locality: "Rahata", district: "Ahmednagar", price: 410, stock: "In Stock", rating: 4.8 },
      { shopName: "Sai Baba Agro Services", locality: "Shirdi", district: "Ahmednagar", price: 420, stock: "In Stock", rating: 4.6 },
      { shopName: "Sinnar Agro Centre", locality: "Sinnar", district: "Nashik", price: 415, stock: "In Stock", rating: 4.7 }
    ]
  },
  // FERTILIZERS
  {
    id: "fert-1",
    category: "fertilizers",
    name: "Neem Coated Urea (46% N)",
    brand: "IFFCO / RCF Trombay",
    packSize: "45 kg bag",
    mrp: 266.50,
    shops: [
      { shopName: "Sangamner Cooperative Society (PACS)", locality: "Sangamner", district: "Ahmednagar", price: 266.50, stock: "Govt Subsidized (450 bags)", rating: 5.0 },
      { shopName: "Kopargaon PACS Centre", locality: "Kopargaon", district: "Ahmednagar", price: 266.50, stock: "Govt Subsidized (300 bags)", rating: 4.9 },
      { shopName: "Nashik Zilla Sahakari Sangh", locality: "Nashik", district: "Nashik", price: 266.50, stock: "Govt Subsidized (800 bags)", rating: 5.0 }
    ]
  },
  {
    id: "fert-2",
    category: "fertilizers",
    name: "DAP - Di-Ammonium Phosphate (18:46:0)",
    brand: "IFFCO / Coromandel Gromor",
    packSize: "50 kg bag",
    mrp: 1350,
    shops: [
      { shopName: "Sangamner Cooperative Society (PACS)", locality: "Sangamner", district: "Ahmednagar", price: 1350, stock: "Available (250 bags)", rating: 5.0 },
      { shopName: "Yeola Agro Traders", locality: "Yeola", district: "Nashik", price: 1350, stock: "Available (180 bags)", rating: 4.7 },
      { shopName: "Sinnar Farmers Co-op", locality: "Sinnar", district: "Nashik", price: 1350, stock: "Available (120 bags)", rating: 4.8 }
    ]
  }
];

export const getInputs = async (category, locality, search) => {
  try {
    const params = {};
    if (category) params.category = category;
    if (locality && locality !== 'All') params.locality = locality;
    if (search) params.search = search;

    const res = await api.get('/input-stores', params);
    if (res && res.records && res.records.length > 0) {
      return res;
    }
  } catch (err) {
    console.warn('Backend input-stores endpoint unavailable, using client fallback:', err.message);
  }

  let filtered = [...FALLBACK_INPUT_STORES];

  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (locality && locality !== 'All') {
    filtered = filtered.map(item => ({
      ...item,
      shops: item.shops.filter(s => s.locality.toLowerCase() === locality.toLowerCase())
    })).filter(item => item.shops.length > 0);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(item =>
      (item.variety && item.variety.toLowerCase().includes(q)) ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.crop && item.crop.toLowerCase().includes(q)) ||
      (item.brand && item.brand.toLowerCase().includes(q))
    );
  }

  return { status: "success", count: filtered.length, records: filtered };
};

const inputStoreService = {
  getInputs
};

export default inputStoreService;
