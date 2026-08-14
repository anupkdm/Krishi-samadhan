const SEED_DATA = [
  {
    id: 's-1',
    crop: 'Onion',
    variety: 'Pusa Red / F1 Hybrid',
    brand: 'Mahyco / Kalash Seeds',
    packSize: '1 kg',
    avgPrice: 1850,
    category: 'seeds',
    shops: [
      { shopName: 'Kisan Krishi Seva Kendra', locality: 'Sangamner', district: 'Ahmednagar', price: 1800, stock: 'In Stock', rating: 4.8 },
      { shopName: 'Maheshwari Agri Inputs', locality: 'Kopargaon', district: 'Ahmednagar', price: 1850, stock: 'In Stock', rating: 4.6 },
      { shopName: 'Nashik Agro Agency', locality: 'Nashik', district: 'Nashik', price: 1780, stock: 'Limited Stock', rating: 4.9 },
      { shopName: 'Shree Ram Krishi Kendra', locality: 'Sinnar', district: 'Nashik', price: 1820, stock: 'In Stock', rating: 4.5 },
      { shopName: 'Sai Baba Agro Services', locality: 'Shirdi', district: 'Ahmednagar', price: 1870, stock: 'In Stock', rating: 4.7 }
    ]
  },
  {
    id: 's-2',
    crop: 'Cotton',
    variety: 'Bollgard II BG-II Hybrid',
    brand: 'Rasi Seeds (RCH-659)',
    packSize: '475 g (with Refuge)',
    avgPrice: 864,
    category: 'seeds',
    shops: [
      { shopName: 'Kisan Krishi Seva Kendra', locality: 'Sangamner', district: 'Ahmednagar', price: 864, stock: 'In Stock', rating: 4.8 },
      { shopName: 'Rahata Shetkari Seva Kendra', locality: 'Rahata', district: 'Ahmednagar', price: 864, stock: 'In Stock', rating: 4.7 },
      { shopName: 'Yeola Agro Traders', locality: 'Yeola', district: 'Nashik', price: 860, stock: 'In Stock', rating: 4.6 },
      { shopName: 'Sinnar Farmers Outlet', locality: 'Sinnar', district: 'Nashik', price: 864, stock: 'In Stock', rating: 4.5 }
    ]
  },
  {
    id: 's-3',
    crop: 'Wheat',
    variety: 'HD-2967 / GW-322 Certified',
    brand: 'Mahabeej (Maharashtra State Seeds)',
    packSize: '40 kg bag',
    avgPrice: 1650,
    category: 'seeds',
    shops: [
      { shopName: 'Sangamner Taluka Kharedi Vikri Sangh', locality: 'Sangamner', district: 'Ahmednagar', price: 1600, stock: 'In Stock', rating: 4.9 },
      { shopName: 'Kopargaon Co-op Market', locality: 'Kopargaon', district: 'Ahmednagar', price: 1620, stock: 'In Stock', rating: 4.7 },
      { shopName: 'Yeola Shetkari Bhandar', locality: 'Yeola', district: 'Nashik', price: 1640, stock: 'In Stock', rating: 4.6 },
      { shopName: 'Nashik Seeds Depot', locality: 'Nashik', district: 'Nashik', price: 1590, stock: 'In Stock', rating: 4.8 }
    ]
  },
  {
    id: 's-4',
    crop: 'Soybean',
    variety: 'JS-335 / JS-9560 Certified',
    brand: 'Mahabeej / Syngenta',
    packSize: '30 kg bag',
    avgPrice: 2850,
    category: 'seeds',
    shops: [
      { shopName: 'Godavari Krishi Bhandar', locality: 'Kopargaon', district: 'Ahmednagar', price: 2800, stock: 'In Stock', rating: 4.8 },
      { shopName: 'Shirdi Agro World', locality: 'Shirdi', district: 'Ahmednagar', price: 2850, stock: 'In Stock', rating: 4.6 },
      { shopName: 'Sinnar Krishi Vikas', locality: 'Sinnar', district: 'Nashik', price: 2820, stock: 'In Stock', rating: 4.7 }
    ]
  },
  {
    id: 's-5',
    crop: 'Pomegranate',
    variety: 'Bhagwa Tissue Culture Plants',
    brand: 'Jain Irrigation Nursery / Local Certified',
    packSize: '1 Sapling Plant',
    avgPrice: 45,
    category: 'seeds',
    shops: [
      { shopName: 'Sangamner Hi-Tech Nursery', locality: 'Sangamner', district: 'Ahmednagar', price: 42, stock: 'In Stock', rating: 4.9 },
      { shopName: 'Rahata Fruit Nursery', locality: 'Rahata', district: 'Ahmednagar', price: 45, stock: 'In Stock', rating: 4.7 },
      { shopName: 'Nashik Horticulture Center', locality: 'Nashik', district: 'Nashik', price: 40, stock: 'In Stock', rating: 4.8 }
    ]
  }
];

const PESTICIDE_DATA = [
  {
    id: 'p-1',
    name: 'Emamectin Benzoate 5% SG',
    targetPest: 'Bollworm, Stem Borer, Caterpillars',
    brand: 'Proclaim (Syngenta) / Solomon (Bayer)',
    packSize: '250 g',
    avgPrice: 850,
    category: 'pesticides',
    shops: [
      { shopName: 'Kisan Krishi Seva Kendra', locality: 'Sangamner', district: 'Ahmednagar', price: 820, stock: 'In Stock', rating: 4.8 },
      { shopName: 'Nashik Agro Agency', locality: 'Nashik', district: 'Nashik', price: 810, stock: 'In Stock', rating: 4.9 },
      { shopName: 'Kopargaon Pesticides Mart', locality: 'Kopargaon', district: 'Ahmednagar', price: 840, stock: 'In Stock', rating: 4.6 },
      { shopName: 'Yeola Agro Traders', locality: 'Yeola', district: 'Nashik', price: 830, stock: 'In Stock', rating: 4.7 }
    ]
  },
  {
    id: 'p-2',
    name: 'Chlorantraniliprole 18.5% SC',
    targetPest: 'Stem Borer, Leaf Folder, Armyworm',
    brand: 'Coragen (FMC)',
    packSize: '150 ml',
    avgPrice: 1750,
    category: 'pesticides',
    shops: [
      { shopName: 'Sangamner Krishi Udhyog', locality: 'Sangamner', district: 'Ahmednagar', price: 1720, stock: 'In Stock', rating: 4.9 },
      { shopName: 'Sinnar Farmers Outlet', locality: 'Sinnar', district: 'Nashik', price: 1740, stock: 'In Stock', rating: 4.6 },
      { shopName: 'Shirdi Agro World', locality: 'Shirdi', district: 'Ahmednagar', price: 1750, stock: 'In Stock', rating: 4.7 }
    ]
  },
  {
    id: 'p-3',
    name: 'Neem Oil 10,000 PPM (Bio)',
    targetPest: 'Aphids, Whitefly, Thrips, Mites',
    brand: 'Neemraj / Azadirachtin Pure',
    packSize: '1 Litre',
    avgPrice: 420,
    category: 'pesticides',
    shops: [
      { shopName: 'Rahata Bio-Agro Store', locality: 'Rahata', district: 'Ahmednagar', price: 390, stock: 'In Stock', rating: 4.8 },
      { shopName: 'Kisan Krishi Seva Kendra', locality: 'Sangamner', district: 'Ahmednagar', price: 410, stock: 'In Stock', rating: 4.8 },
      { shopName: 'Nashik Organic Store', locality: 'Nashik', district: 'Nashik', price: 400, stock: 'In Stock', rating: 4.9 }
    ]
  },
  {
    id: 'p-4',
    name: 'Copper Oxychloride 50% WP (Fungicide)',
    targetPest: 'Bacterial Blight, Fruit Rot, Downy Mildew',
    brand: 'Blitox (Rallis Tata)',
    packSize: '500 g',
    avgPrice: 290,
    category: 'pesticides',
    shops: [
      { shopName: 'Yeola Agro Traders', locality: 'Yeola', district: 'Nashik', price: 280, stock: 'In Stock', rating: 4.7 },
      { shopName: 'Maheshwari Agri Inputs', locality: 'Kopargaon', district: 'Ahmednagar', price: 290, stock: 'In Stock', rating: 4.6 },
      { shopName: 'Sai Baba Agro Services', locality: 'Shirdi', district: 'Ahmednagar', price: 285, stock: 'In Stock', rating: 4.7 }
    ]
  }
];

const FERTILIZER_DATA = [
  {
    id: 'f-1',
    name: 'Neem Coated Urea (46% N)',
    packSize: '45 kg Bag',
    mrp: 266.50,
    type: 'Government Subsidized',
    brand: 'IFFCO / RCF Trombay',
    shops: [
      { shopName: 'Sangamner Primary Agri Co-op Society', locality: 'Sangamner', district: 'Ahmednagar', price: 266.50, stock: 'In Stock (Govt MRP)', rating: 5.0 },
      { shopName: 'Kopargaon Co-op Society', locality: 'Kopargaon', district: 'Ahmednagar', price: 266.50, stock: 'In Stock (Govt MRP)', rating: 4.9 },
      { shopName: 'Nashik District Co-op Board', locality: 'Nashik', district: 'Nashik', price: 266.50, stock: 'In Stock (Govt MRP)', rating: 5.0 }
    ]
  },
  {
    id: 'f-2',
    name: 'DAP (18:46:0)',
    packSize: '50 kg Bag',
    mrp: 1350,
    type: 'Subsidized Complex',
    brand: 'IFFCO / Coromandel Gromor',
    shops: [
      { shopName: 'Sangamner Shetkari Sangh', locality: 'Sangamner', district: 'Ahmednagar', price: 1350, stock: 'In Stock', rating: 4.9 },
      { shopName: 'Rahata Krishi Seva Kendra', locality: 'Rahata', district: 'Ahmednagar', price: 1350, stock: 'In Stock', rating: 4.8 },
      { shopName: 'Sinnar Agro Outlet', locality: 'Sinnar', district: 'Nashik', price: 1350, stock: 'In Stock', rating: 4.7 }
    ]
  },
  {
    id: 'f-3',
    name: 'NPK 10:26:26 Complex',
    packSize: '50 kg Bag',
    mrp: 1470,
    type: 'Balanced Nutrient',
    brand: 'Mahadhan / Mahabeej',
    shops: [
      { shopName: 'Kisan Krishi Seva Kendra', locality: 'Sangamner', district: 'Ahmednagar', price: 1450, stock: 'In Stock', rating: 4.8 },
      { shopName: 'Yeola Agro Traders', locality: 'Yeola', district: 'Nashik', price: 1460, stock: 'In Stock', rating: 4.7 }
    ]
  }
];

function getInputStores(category, locality, search) {
  let list = [];
  if (category === 'seeds') list = SEED_DATA;
  else if (category === 'pesticides') list = PESTICIDE_DATA;
  else if (category === 'fertilizers') list = FERTILIZER_DATA;
  else list = [...SEED_DATA, ...PESTICIDE_DATA, ...FERTILIZER_DATA];

  if (locality && locality !== 'All') {
    list = list.map(item => ({
      ...item,
      shops: item.shops.filter(s => s.locality.toLowerCase() === locality.toLowerCase())
    })).filter(item => item.shops.length > 0);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(item => 
      (item.crop && item.crop.toLowerCase().includes(q)) ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.variety && item.variety.toLowerCase().includes(q)) ||
      (item.brand && item.brand.toLowerCase().includes(q))
    );
  }

  return list;
}

module.exports = {
  getInputStores
};
