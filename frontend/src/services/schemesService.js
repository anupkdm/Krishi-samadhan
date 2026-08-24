import api from './api';

const COMPREHENSIVE_SCHEMES = [
  // 1. PM-KISAN
  {
    id: 1,
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "Central sector direct income support scheme providing direct bank transfers to all landholding farmer families across India.",
    benefits: "₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly credited to Aadhaar-linked bank accounts via DBT.",
    eligibility: "All small, marginal and large landholding farmer families with cultivable land.",
    category: "income support",
    official_url: "https://pmkisan.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  // 2. Namo Shetkari Mahasanman (Maharashtra)
  {
    id: 2,
    name: "Namo Shetkari Mahasanman Nidhi Yojana (Maharashtra)",
    description: "Government of Maharashtra supplementary financial benefit scheme providing additional financial backing to state farmers.",
    benefits: "₹6,000 per year from the Maharashtra State Government (Combining with PM-KISAN, farmers receive ₹12,000 total per year).",
    eligibility: "All farmers in Maharashtra enrolled and verified under the PM-KISAN database.",
    category: "income support",
    official_url: "https://mahadbt.maharashtra.gov.in",
    ministry: "Department of Agriculture, Govt of Maharashtra",
    status: "Active"
  },
  // 3. PMFBY (Crop Insurance)
  {
    id: 3,
    name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    description: "National comprehensive crop insurance scheme protecting farmers against unforeseen natural risks from pre-sowing to post-harvest.",
    benefits: "Heavily subsidized premium rates: 2% for Kharif crops, 1.5% for Rabi crops, and 5% for Horticulture/Commercial crops.",
    eligibility: "All farmers growing notified crops in notified areas including sharecroppers, tenant farmers, and loanee/non-loanee growers.",
    category: "crop insurance",
    official_url: "https://pmfby.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  // 4. Magel Tyala Shettale (Farm Pond on Demand)
  {
    id: 4,
    name: "Magel Tyala Shettale Yojana (Farm Pond on Demand - MH)",
    description: "Flagship Maharashtra state rainwater harvesting initiative to ensure permanent micro-irrigation water security during dry spells.",
    benefits: "Direct financial subsidy up to ₹75,000 for standard farm pond excavation + additional plastic lining subsidies.",
    eligibility: "Farmers owning at least 0.60 hectares (1.5 acres) of land with suitable soil contour.",
    category: "solar/irrigation",
    official_url: "https://mahadbt.maharashtra.gov.in/Farmer/SchemeData/SchemeData?str=E9DD59489297834E",
    ministry: "Department of Agriculture, Govt of Maharashtra",
    status: "Active"
  },
  // 5. PM-KUSUM (Solar Pumps)
  {
    id: 5,
    name: "PM-KUSUM (Solar Agriculture Pumps Scheme)",
    description: "Decarbonizing farm irrigation by providing subsidized standalone and grid-connected solar agricultural pumps.",
    benefits: "Up to 60% capital subsidy (30% Central + 30% State Govt) for solar pump capacities from 3 HP to 7.5 HP.",
    eligibility: "Individual farmers, Water User Associations, Primary Agricultural Credit Societies (PACS), and FPOs.",
    category: "solar/irrigation",
    official_url: "https://mnre.gov.in/pm-kusum",
    ministry: "Ministry of New and Renewable Energy",
    status: "Active"
  },
  // 6. PMKSY (Per Drop More Crop - Drip & Sprinkler)
  {
    id: 6,
    name: "PMKSY (Per Drop More Crop — Drip & Sprinkler Subsidy)",
    description: "Promoting precision micro-irrigation systems to maximize water use efficiency and reduce water wastage in orchards and field crops.",
    benefits: "55% to 80% subsidy for installation of inline drip irrigation, microsprinklers, and portable rain-gun systems.",
    eligibility: "Farmers with verified water source and land records (7/12 & 8A extract).",
    category: "solar/irrigation",
    official_url: "https://pmksy.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  // 7. Soil Health Card Scheme
  {
    id: 7,
    name: "Soil Health Card Scheme",
    description: "Periodic chemical laboratory soil testing providing customized NPK and micronutrient dosage prescriptions per crop cycle.",
    benefits: "Free 12-parameter soil health analysis report issued every 3 years with optimized fertilizer prescriptions.",
    eligibility: "All agricultural landholders in India. Soil samples gathered by village extension workers.",
    category: "soil health",
    official_url: "https://soilhealth.dac.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  // 8. Kisan Credit Card (KCC)
  {
    id: 8,
    name: "Kisan Credit Card (KCC — Concessional Farm Credit)",
    description: "Affordable and flexible institutional credit facility ensuring farmers have timely access to working capital and input purchases.",
    benefits: "Concessional interest rate of 4% per annum (with 3% prompt repayment incentive subvention) for loans up to ₹3 Lakhs.",
    eligibility: "Owner cultivators, tenant farmers, oral lessees, sharecroppers, and SHGs/JLGs of farmers.",
    category: "credit",
    official_url: "https://www.pmkisan.gov.in/kcc",
    ministry: "Ministry of Finance & NABARD",
    status: "Active"
  },
  // 9. Agri-Mechanization (MahaDBT / SMAM)
  {
    id: 9,
    name: "Sub-Mission on Agricultural Mechanization (SMAM / MahaDBT)",
    description: "Financial assistance for purchasing high-tech farm machinery to reduce manual labor costs and improve operational turnaround.",
    benefits: "40% to 50% subsidy on tractors, power tillers, rotavators, multi-crop threshers, raised bed seed drills, and shredders.",
    eligibility: "Registered farmers on MahaDBT portal with preference to small/marginal, women, and SC/ST farmers.",
    category: "infrastructure",
    official_url: "https://agrimachinery.nic.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  // 10. PKVY (Organic Farming)
  {
    id: 10,
    name: "Paramparagat Krishi Vikas Yojana (PKVY — Organic Farming)",
    description: "Promoting chemical-free organic farming clusters, bio-fertilizers, PGS India certification, and premium value-chain marketing.",
    benefits: "₹50,000 per hectare for 3 years (₹31,000 direct benefit transfer for organic inputs, bio-pesticides, and botanical extracts).",
    eligibility: "Farmers forming 20-hectare clusters or participating through FPOs and cooperatives.",
    category: "sustainability",
    official_url: "https://pgsindia-ncof.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  // 11. e-NAM
  {
    id: 11,
    name: "e-NAM (National Agriculture Market)",
    description: "Pan-India electronic trading network integrating local APMC mandis to facilitate transparent bidding and fair price realization.",
    benefits: "Access to nationwide commodity buyers, electronic quality assaying, and real-time online fund settlement to bank accounts.",
    eligibility: "Farmers and farmer groups registered at affiliated APMC mandis across Maharashtra and India.",
    category: "market",
    official_url: "https://enam.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  // 12. PMFME (Food Processing)
  {
    id: 12,
    name: "PMFME (Micro Food Processing Enterprises Scheme)",
    description: "Financial, technical, and business support for establishing micro food processing enterprises (dal mills, oil extractors, dehydration).",
    benefits: "35% credit-linked capital subsidy up to ₹10 Lakhs + seed capital of ₹40,000 per SHG member for small equipment.",
    eligibility: "Individual micro-entrepreneurs, Farmer Producer Companies (FPCs), Self Help Groups (SHGs), and Cooperatives.",
    category: "infrastructure",
    official_url: "https://pmfme.mofpi.gov.in",
    ministry: "Ministry of Food Processing Industries",
    status: "Active"
  }
];

export const getSchemes = async (searchOrParams, categoryParam) => {
  let search = '';
  let category = '';

  if (typeof searchOrParams === 'object' && searchOrParams !== null) {
    search = searchOrParams.search || searchOrParams.search_query || '';
    category = searchOrParams.category || '';
  } else {
    search = searchOrParams || '';
    category = categoryParam || '';
  }

  try {
    const params = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;

    const res = await api.get('/schemes', params);
    const list = res?.schemes || res?.records || (Array.isArray(res) ? res : null);
    if (list && list.length > 0) {
      return {
        status: "success",
        count: list.length,
        records: list
      };
    }
  } catch (err) {
    console.warn('Backend schemes endpoint unavailable, using client-side catalog fallback:', err.message);
  }

  let filtered = [...COMPREHENSIVE_SCHEMES];
  if (category && category !== 'All') {
    filtered = filtered.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.benefits.toLowerCase().includes(q) ||
      s.eligibility.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }

  return { status: "success", count: filtered.length, records: filtered };
};

export const getSchemeById = async (id) => {
  try {
    const res = await api.get(`/schemes/${id}`);
    if (res && res.scheme) return res;
  } catch {}
  const scheme = COMPREHENSIVE_SCHEMES.find(s => String(s.id) === String(id)) || COMPREHENSIVE_SCHEMES[0];
  return { status: "success", scheme };
};

const schemesService = {
  getSchemes,
  getSchemeById
};

export default schemesService;
