import { Product, BlogPost, COADocument } from './types';

export const WHATSAPP_NUMBER = "601133373941";
export const CURRENCY = "RM";

export const PRODUCTS: Product[] = [
  {
    id: 'evo-retat-kit',
    name: 'Retatrutide 20mg + BAC Water Kit (Combo Reta-Bac)',
    price: 580,
    category: 'Weight Management',
    description: 'The absolute zenith of metabolic capability. Retatrutide (GGG Tri-Agonist) paired with our signature bacteriostatic solvent. This combo is designed for advanced research protocols focusing on metabolic efficiency.',
    image: '/images/evo-retatrutide.webp',
    badge: 'BEST SELLER',
    isNew: true,
    inStock: true,
    features: ['Triple Agonist (GLP-1, GIP, GCGR)', '>99.9% Purity HPLC Verified', 'Includes 10ml BAC Water (Combo Reta-Bac)', 'Cold-Chain Logistics'],
    techSpec: {
      mass: '4731.33 g/mol',
      halfLife: '~6 Days',
      focus: 'Triple-G Agonism',
      formula: 'C221H342N54O67'
    },
    coa: {
      id: 'c1',
      productName: 'Retatrutide 20mg',
      batchNumber: 'EVO-RT-0092',
      purity: '99.8%',
      date: '2023-11-15'
    }
  },
  {
    id: 'evo-bpc-tb-blend',
    name: 'Evo BPC-157 + TB-500 Blend 10mg (5mg/5mg)',
    price: 0,
    category: 'Recovery',
    description: 'The ultimate recovery synergy. Combining the regenerative power of BPC-157 with the cellular migration capabilities of TB-500 for maximum tissue repair.',
    image: '/images/evo-bpc-tb.webp',
    inStock: true,
    features: ['Synergistic Blend', 'HPLC Verified', 'Elite Recovery Protocol'],
    techSpec: { mass: 'Multiple', halfLife: 'Variable', focus: 'Systemic Regeneration', formula: 'C62H98N16O22 + C212H350N56O78S' }
  },
  {
    id: 'evo-ghk-cu',
    name: 'Evo GHK-Cu 100mg',
    price: 0,
    category: 'Anti-Aging',
    description: 'Elite Copper Peptide. Engineered for biological tissue remodeling, collagen synthesis, and DNA repair research protocols.',
    image: '/images/evo-ghk-cu.webp',
    inStock: true,
    features: ['Tissue Remodeling', 'High Concentration 100mg', '99.9% Purity'],
    techSpec: { mass: '340.38 g/mol', halfLife: '~30 Min (Plasma)', focus: 'Copper-Dependent Repair', formula: 'C14H24N6O4' }
  },
  {
    id: 'evo-pt-141',
    name: 'Evo PT-141 10mg (Bremelanotide)',
    price: 0,
    category: 'Performance',
    description: 'Synthetic peptide agonist of the melanocortin receptors. Research focused on sexual dysfunction and libido enhancement through CNS pathways.',
    image: '/images/evo-pt-141.webp',
    inStock: true,
    features: ['CNS Agonist', 'Purity Verified', 'Research Grade'],
    techSpec: { mass: '1025.2 g/mol', halfLife: '~2 Hours', focus: 'MC3R/MC4R Agonism', formula: 'C50H68N14O10' }
  }
];

export const TECHNICAL_SPECS = [
  { name: 'Evo Retatrutide', category: 'Weight / Metabolic', formula: 'C221H342N54O67', mass: '4731.33 g/mol', focus: 'Triple-G Agonism', halfLife: '~6 Days' },
  { name: 'Evo GHK-Cu', category: 'Tissue Repair/Anti-Aging', formula: 'C14H24N6O4', mass: '340.38 g/mol', focus: 'Copper-Dependent Repair', halfLife: '~30 Min' },
  { name: 'Evo PT-141', category: 'CNS Performance', formula: 'C50H68N14O10', mass: '1025.2 g/mol', focus: 'MC3R/MC4R Agonism', halfLife: '~2 Hours' }
];

export const STORAGE_PROTOCOLS = {
  purity: '≥ 99.4% via HPLC/MS',
  form: 'Lyophilized white nano-powder',
  preReconstitution: [
    { temp: 'Room Temp', stability: '30–60 days' },
    { temp: '2°C to 8°C', stability: '24 months' },
    { temp: '-20°C', stability: '36–60 months' }
  ],
  postReconstitution: [
    { temp: '2°C to 8°C', stability: 'Must be refrigerated' },
    { note: 'Use within 30 days for maximum integrity' }
  ],
  solvent: 'Optimized for Evo™ Bacteriostatic (BAC) Water'
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "Evo™ Series: Technical Master Specification",
    excerpt: "The surgical precision of our 'Sporty-Noir' luxury brand through analytical data and laboratory standards.",
    content: "Every vial in the Evo series is characterized by three core pillars: Evo-Grade Purity, Enhanced Stability, and the 'Evo Kit' Logic. <br/><br/><strong>Evo-Grade Purity:</strong> All products undergo rigorous HPLC and MS testing to ensure absolute sequences. <br/><br/><strong>Enhanced Stability:</strong> Vacuum-sealed in specialized light-protected vials to prevent UV degradation. <br/><br/><strong>Evo Kit Logic:</strong> We bundle peptides with high-purity BAC water to ensure structural stability during reconstitution.",
    date: "Feb 11, 2024",
    category: "Science",
    readTime: "6 min"
  },
  {
    id: '2',
    title: "The Triple-G Agonist Era",
    excerpt: "Exploring the pharmacodynamics of Retatrutide: The vanguard of metabolic and adipose research.",
    content: "Retatrutide represents the next evolution in metabolic research, moving beyond the single (Semaglutide) and dual (Tirzepatide) agonist models. <br/><br/>By targeting the Glucagon receptor (GCGR) alongside GIP and GLP-1, Retatrutide exhibits a unique mechanism of increasing energy expenditure while suppressing appetite.",
    date: "Feb 11, 2024",
    category: "Science",
    readTime: "8 min"
  },
  {
    id: '3',
    title: "Local Excellence & Logistics Hub",
    excerpt: "How Evo Peptides is eliminating international shipping risk with KL Ready Stock.",
    content: "Operating from our hub in Kuala Lumpur, we utilize local logistics like Lalamove and Grab for same-day delivery in the Klang Valley. Our mission is to provide the elite Malaysian research community with immediate access to verified, lab-tested compounds without the uncertainty of customs.",
    date: "Feb 11, 2024",
    category: "Operations",
    readTime: "4 min"
  }
];

export const COA_DATA: COADocument[] = [
  { id: 'c1', productName: 'Retatrutide 20mg', batchNumber: 'EVO-RT-0092', purity: '99.8%', date: '2023-11-15' },
  { id: 'c7', productName: 'GHK-Cu 100mg', batchNumber: 'EVO-GK-0021', purity: '99.9%', date: '2023-12-05' },
  { id: 'c8', productName: 'BPC-157 + TB-500 Blend', batchNumber: 'EVO-BL-9921', purity: '99.8%', date: '2024-01-15' },
  { id: 'c9', productName: 'PT-141 10mg', batchNumber: 'EVO-PT-0772', purity: '99.7%', date: '2024-01-20' },
];