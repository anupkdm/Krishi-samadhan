import api from './api';

const DEFAULT_SCHEMES = [
  {
    id: 1,
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "Central sector scheme providing income support to all landholding farmer families across the country.",
    benefits: "₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly transferred to Aadhaar-linked bank accounts.",
    eligibility: "All small and marginal landholding farmer families with cultivable land.",
    category: "income support",
    official_url: "https://pmkisan.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  {
    id: 2,
    name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    description: "Comprehensive crop insurance scheme protecting farmers against non-preventable natural risks from pre-sowing to post-harvest.",
    benefits: "Lowest farmer premium (2% Kharif, 1.5% Rabi, 5% Commercial/Horticulture) with claim settlement through automated satellite assessment.",
    eligibility: "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
    category: "crop insurance",
    official_url: "https://pmfby.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  {
    id: 3,
    name: "PM-KUSUM (Solar Agriculture Pumps)",
    description: "De-dieselize agricultural sector and provide energy security to farmers via grid-connected and standalone solar pumps.",
    benefits: "Up to 60% direct capital subsidy for installation of solar agricultural pumps + option to sell surplus power to grid.",
    eligibility: "Individual farmers, Water User Associations, Panchayats, and Farmer Producer Organizations (FPOs).",
    category: "solar/irrigation",
    official_url: "https://mnre.gov.in/pm-kusum",
    ministry: "Ministry of New and Renewable Energy",
    status: "Active"
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    description: "Field-specific chemical nutrient profiling to assist farmers in optimizing chemical and organic fertilizer dosages.",
    benefits: "Free periodic soil testing with customized 12-parameter nutrient report card (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC).",
    eligibility: "All farm owners across India. Samples collected every 3 years by Agriculture Extension Department.",
    category: "soil health",
    official_url: "https://soilhealth.dac.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "Active"
  },
  {
    id: 5,
    name: "Kisan Credit Card (KCC)",
    description: "Institutional credit scheme ensuring farmers have access to timely and affordable short-term working capital.",
    benefits: "Low effective interest rate of 4% per annum (with prompt repayment subvention) for loans up to ₹3 Lakhs.",
    eligibility: "Owner cultivators, tenant farmers, oral lessees, sharecroppers, and SHGs/JLGs of farmers.",
    category: "credit",
    official_url: "https://www.pmkisan.gov.in/kcc",
    ministry: "Ministry of Finance",
    status: "Active"
  },
  {
    id: 6,
    name: "e-NAM (National Agriculture Market)",
    description: "Pan-India electronic trading portal networking the existing APMC mandis to create a unified national market for agricultural commodities.",
    benefits: "Transparent online auctioning, digital payment settlement directly to farmer bank accounts, real-time interstate price discovery.",
    eligibility: "Farmers, registered traders, and Commission Agents affiliated with enrolled APMC markets.",
    category: "market",
    official_url: "https://enam.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
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
    if (res && (res.records || Array.isArray(res))) {
      return res;
    }
  } catch (err) {
    console.warn('Backend schemes endpoint unavailable, using client fallback:', err.message);
  }

  let filtered = [...DEFAULT_SCHEMES];
  if (category && category !== 'All') {
    filtered = filtered.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.benefits.toLowerCase().includes(q));
  }

  return { status: "success", count: filtered.length, records: filtered };
};

export const getSchemeById = async (id) => {
  try {
    return await api.get(`/schemes/${id}`);
  } catch {
    const scheme = DEFAULT_SCHEMES.find(s => String(s.id) === String(id)) || DEFAULT_SCHEMES[0];
    return { status: "success", scheme };
  }
};

const schemesService = {
  getSchemes,
  getSchemeById
};

export default schemesService;
