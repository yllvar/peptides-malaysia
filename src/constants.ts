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
    image: '/images/evo_retatrutide.jpg',
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
    id: 'evo-bpc-157',
    name: 'BPC-157 5mg',
    price: 180,
    category: 'Recovery',
    description: 'The body protection compound. Engineered for localized healing and systemic recovery protocols.',
    image: '/images/evo_bpc157.jpg',
    inStock: true,
    features: ['Regenerative Agonist', '99.9% Purity HPLC', 'Cold-Chain Shipping'],
    techSpec: { mass: '1419.5 g/mol', halfLife: '~4-6 Hours', focus: 'Angiogenesis', formula: 'C62H98N16O22' }
  },
  {
    id: 'evo-tb-500',
    name: 'TB-500 5mg',
    price: 220,
    category: 'Recovery',
    description: 'Thymosin Beta-4 synthetic analogue. Designed for cellular migration and rapid tissue repair.',
    image: '/images/evo_tb500.jpg',
    inStock: true,
    features: ['Tissue Repair Spec', 'HPLC Verified', 'Cold-Chain'],
    techSpec: { mass: '4963.5 g/mol', halfLife: '~7-10 Days', focus: 'Cellular Migration', formula: 'C212H350N56O78S' }
  },
  {
    id: 'evo-mt2',
    name: 'Melanotan II 10mg',
    price: 150,
    category: 'Essentials',
    description: 'Pigmentation research and UV protection protocols.',
    image: '/images/evo_mt2.jpg',
    inStock: true,
    features: ['UV Pigmentation', 'High Purity', 'Cold-Chain'],
    techSpec: { mass: '1024.2 g/mol', halfLife: '~2-3 Hours', focus: 'MC4R Agonism', formula: 'C50H69N11O9' }
  },
  {
    id: 'evo-cjc-no-dac',
    name: 'CJC-1295 (No DAC)',
    price: 190,
    category: 'Essentials',
    description: 'Growth hormone secretagogue for episodic research.',
    image: '/images/evo_cjc.jpg',
    inStock: true,
    features: ['Pituitary GH Support', 'Verified Sequence', 'Cold-Chain'],
    techSpec: { mass: '3647.2 g/mol', halfLife: '~30 Min', focus: 'Pituitary GH', formula: 'C165H271N47O46' }
  },
  {
    id: 'evo-tirz-10',
    name: 'Tirzepatide 10mg',
    price: 350,
    category: 'Weight Management',
    description: 'Dual agonist (GLP-1/GIP) for metabolic research.',
    image: '/images/evo_tirzepatide.jpg',
    inStock: true,
    features: ['Dual Agonist', '99.5% Purity', 'Cold-Chain'],
    techSpec: { mass: '4813.5 g/mol', halfLife: '~5 Days', focus: 'Metabolic Efficiency', formula: 'C225H348N48O68' }
  }
];

export const TECHNICAL_SPECS = [
  { name: 'Evo Retatrutide', category: 'Weight / Metabolic', formula: 'C221H342N54O67', mass: '4731.33 g/mol', focus: 'Triple-G Agonism', halfLife: '~6 Days' },
  { name: 'Evo BPC-157', category: 'Healing / Recovery', formula: 'C62H98N16O22', mass: '1419.5 g/mol', focus: 'Angiogenesis', halfLife: '~4-6 Hours' },
  { name: 'Evo TB-500', category: 'Tissue Repair', formula: 'C212H350N56O78S', mass: '4963.5 g/mol', focus: 'Cellular Migration', halfLife: '~7-10 Days' },
  { name: 'Evo Melanotan II', category: 'UV / Pigmentation', formula: 'C50H69N11O9', mass: '1024.2 g/mol', focus: 'MC4R Agonism', halfLife: '~2-3 Hours' },
  { name: 'Evo CJC-1295', category: 'GH Performance', formula: 'C165H271N47O46', mass: '3647.2 g/mol', focus: 'Pituitary GH', halfLife: '~30 Min' }
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
    excerpt: "How Peptides Malaysia is eliminating international shipping risk with KL Ready Stock.",
    content: "Operating from our hub in Kuala Lumpur, we utilize local logistics like Lalamove and Grab for same-day delivery in the Klang Valley. Our mission is to provide the elite Malaysian research community with immediate access to verified, lab-tested compounds without the uncertainty of customs.",
    date: "Feb 11, 2024",
    category: "Operations",
    readTime: "4 min"
  }
];

export const COA_DATA: COADocument[] = [
  { id: 'c1', productName: 'Retatrutide 20mg', batchNumber: 'EVO-RT-0092', purity: '99.8%', date: '2023-11-15' },
  { id: 'c2', productName: 'Tirzepatide 10mg', batchNumber: 'EVO-TZ-1102', purity: '99.5%', date: '2023-11-10' },
  { id: 'c3', productName: 'BPC-157 5mg', batchNumber: 'EVO-BP-0044', purity: '99.9%', date: '2023-10-22' },
  { id: 'c4', productName: 'TB-500 5mg', batchNumber: 'EVO-TB-0881', purity: '99.6%', date: '2023-10-25' },
  { id: 'c5', productName: 'CJC-1295 (No DAC)', batchNumber: 'EVO-CJ-4412', purity: '99.7%', date: '2023-11-20' },
  { id: 'c6', productName: 'Melanotan II 10mg', batchNumber: 'EVO-MT-0031', purity: '99.4%', date: '2024-02-05' },
  { id: 'c7', productName: 'GHK-Cu 50mg', batchNumber: 'EVO-GK-0021', purity: '99.9%', date: '2023-12-05' },
];