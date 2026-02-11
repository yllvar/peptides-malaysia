import { Product, BlogPost, COADocument } from './types';

export const WHATSAPP_NUMBER = "601133373941";
export const CURRENCY = "RM";

export const PRODUCTS: Product[] = [
  // Existing Products
  {
    id: 'evo-retat-kit',
    name: 'Retatrutide 20mg + BAC Water Kit',
    price: 650,
    category: 'Weight Management',
    description: 'The absolute zenith of metabolic capability. Retatrutide (GGG Tri-Agonist) represents the bleeding edge of lipolytic research. This Evo™ Exclusive Kit pairs 20mg of >99.9% purity lyophilized solid with our signature bacteriostatic solvent.',
    image: '/images/evo_retatrutide.jpg',
    badge: 'BEST SELLER',
    inStock: true,
    features: ['Triple Agonist (GLP-1, GIP, GCGR)', '>99.9% Purity HPLC Verified', 'Includes 10ml BAC Water', 'Cold-Chain Logistics']
  },
  {
    id: 'evo-tirz-kit',
    name: 'Tirzepatide 10mg Research Kit',
    price: 350,
    category: 'Weight Management',
    description: 'The modern standard in GLP-1/GIP receptor research. Our Tirzepatide is synthesized for maximum solubility and stability.',
    image: '/images/evo_retatrutide.jpg',
    inStock: true,
    features: ['Dual Agonist Profile', 'High Solubility', 'Lab Tested Purity']
  },
  {
    id: 'evo-bpc-157',
    name: 'BPC-157 Rapid Recovery 5mg',
    price: 180,
    category: 'Recovery',
    description: 'The "Wolverine" compound. BPC-157 is the gold standard for angiogenesis and tissue repair research.',
    image: '/images/evo_retatrutide.jpg',
    inStock: true,
    features: ['Tissue Repair Focus', 'Systemic Stability', '5mg Pure Isolate']
  },
  {
    id: 'evo-tb-500',
    name: 'TB-500 Mobility 5mg',
    price: 190,
    category: 'Recovery',
    description: 'Synthetic fraction of thymosin beta-4. Essential for research into actin regulation, cellular motility, and inflammation modulation.',
    image: '/images/evo_retatrutide.jpg',
    inStock: true,
    features: ['Cellular Motility', 'Actin Regulation', 'Pure Isolate']
  },
  {
    id: 'evo-cjc-ipa',
    name: 'CJC-1295 + Ipamorelin Blend',
    price: 280,
    category: 'Performance',
    description: 'The ultimate synergistic blend for growth hormone secretagogue research. 5mg/5mg ratio for optimal pulsatile release studies.',
    image: '/images/evo_retatrutide.jpg',
    inStock: true,
    features: ['Synergistic Blend', 'No DAC', 'Lean Mass Research']
  },
  {
    id: 'evo-bac-water',
    name: 'Evo™ Bacteriostatic Water 10ml',
    price: 45,
    category: 'Essentials',
    description: 'Pharmaceutical grade solvent containing 0.9% benzyl alcohol. The foundation of safe reconstitution.',
    image: '/images/evo_retatrutide.jpg',
    inStock: true,
    features: ['0.9% Benzyl Alcohol', 'Sterile Filtered', 'Long Shelf Life']
  },

  // NEW PRODUCTS & BUNDLES (Latest)
  {
    id: 'bundle-fat-burn',
    name: 'Metabolic Ignition Stack (Pro)',
    price: 800,
    category: 'Bundles',
    description: 'A comprehensive research protocol combining Retatrutide and Tirzepatide for comparative agonist studies. Designed for advanced metabolic research.',
    image: '/images/evo_retatrutide.jpg',
    badge: 'PRO BUNDLE',
    isNew: true,
    inStock: true,
    features: ['1x Retatrutide 10mg', '1x Tirzepatide 10mg', '2x BAC Water', 'Advanced Protocol']
  },
  {
    id: 'bundle-recovery-max',
    name: 'Wolverine Recovery Stack',
    price: 350,
    category: 'Bundles',
    description: 'The ultimate synergistic pairing for tissue repair research. BPC-157 and TB-500 work in concert to modulate inflammation and accelerate cellular migration.',
    image: '/images/evo_retatrutide.jpg',
    badge: 'VALUE PACK',
    isNew: true,
    inStock: true,
    features: ['1x BPC-157 5mg', '1x TB-500 5mg', '1x BAC Water', 'Synergistic Action']
  },
  {
    id: 'evo-ghk-cu',
    name: 'GHK-Cu Copper Peptide 50mg',
    price: 220,
    category: 'Anti-Aging',
    description: 'The "Blue Copper" peptide. Widely researched for its ability to stimulate collagen synthesis and skin remodeling in dermal tissue samples.',
    image: '/images/evo_retatrutide.jpg',
    isNew: true,
    inStock: true,
    features: ['Dermal Remodeling', 'Collagen Synthesis', 'Deep Blue Solution']
  },
  {
    id: 'bundle-beauty-skin',
    name: 'Dermal Restoration Protocol',
    price: 250,
    category: 'Bundles',
    description: 'Complete skin research kit featuring high-concentration GHK-Cu. Ideal for studies focused on elasticity and wound healing.',
    image: '/images/evo_retatrutide.jpg',
    isNew: true,
    inStock: true,
    features: ['1x GHK-Cu 50mg', '1x BAC Water', 'Sterile Swabs', 'Reconstitution Guide']
  },
  {
    id: 'evo-epitalon',
    name: 'Epitalon Longevity 10mg',
    price: 300,
    category: 'Anti-Aging',
    description: 'A synthetic tetrapeptide researched for its potential to increase telomerase activity and extend cellular lifespan in vitro.',
    image: '/images/evo_retatrutide.jpg',
    isNew: true,
    inStock: true,
    features: ['Telomerase Activation', 'Circadian Regulation', '10mg Vial']
  },
  {
    id: 'bundle-bulk-reta',
    name: 'Retatrutide 50mg Bulk Pack',
    price: 2250,
    category: 'Bundles',
    description: 'Institutional research pack containing 5 vials of Retatrutide 10mg. High-volume supply for extensive longitudinal studies.',
    image: '/images/evo_retatrutide.jpg',
    badge: 'BULK SAVE',
    isNew: true,
    inStock: true,
    features: ['5x Retatrutide 10mg', '5x BAC Water', 'Institutional Pricing', 'Priority Shipping']
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "The Beginner's Guide to Research Peptides",
    excerpt: "Understanding the fundamental protocols for handling, storing, and reconstituting lyophilized compounds in a lab setting.",
    content: "Handling lyophilized peptides requires precision to maintain structural integrity. <br/><br/><strong>1. Storage:</strong> Upon arrival, store lyophilized vials at -20°C. Reconstituted peptides must be kept at 4°C.<br/><br/><strong>2. Reconstitution:</strong> Use Bacteriostatic Water. Inject the water slowly down the side of the vial to avoid shearing the peptide bonds. Do not shake; swirl gently.<br/><br/><strong>3. Tools:</strong> Always use sterile insulin syringes for measurement. Ensure the environment is free of contaminants.",
    date: "Oct 12, 2023",
    category: "Protocols",
    readTime: "5 min"
  },
  {
    id: '2',
    title: "Why BAC Water is Essential",
    excerpt: "Why sterile water isn't enough. The role of benzyl alcohol in preventing bacterial growth during longitudinal studies.",
    content: "Bacteriostatic Water differs from sterile water because it contains 0.9% benzyl alcohol. <br/><br/>This additive serves a critical function: it inhibits the growth of bacteria within the vial after the stopper has been punctured. <br/><br/>For researchers using a single vial for multiple subjects or experiments over time (longitudinal studies), BAC water is non-negotiable to prevent contamination and degradation of the peptide sequence.",
    date: "Nov 05, 2023",
    category: "Safety",
    readTime: "3 min"
  },
  {
    id: '3',
    title: "Retatrutide: The Triple Agonist Era",
    excerpt: "Exploring the pharmacodynamics of the GIP, GLP-1, and Glucagon receptor interactions.",
    content: "Retatrutide represents the next evolution in metabolic research, moving beyond the single (Semaglutide) and dual (Tirzepatide) agonist models. <br/><br/>By targeting the Glucagon receptor (GCGR) alongside GIP and GLP-1, Retatrutide exhibits a unique mechanism of increasing energy expenditure while suppressing appetite. <br/><br/>Current in-vitro studies suggest a significantly higher affinity for lipolysis compared to its predecessors.",
    date: "Dec 01, 2023",
    category: "Science",
    readTime: "8 min"
  }
];

export const COA_DATA: COADocument[] = [
  { id: 'c1', productName: 'Retatrutide 20mg', batchNumber: 'EVO-RT-0092', purity: '99.8%', date: '2023-11-15' },
  { id: 'c2', productName: 'Tirzepatide 10mg', batchNumber: 'EVO-TZ-1102', purity: '99.5%', date: '2023-11-10' },
  { id: 'c3', productName: 'BPC-157 5mg', batchNumber: 'EVO-BP-0044', purity: '99.9%', date: '2023-10-22' },
  { id: 'c4', productName: 'TB-500 5mg', batchNumber: 'EVO-TB-0881', purity: '99.6%', date: '2023-10-25' },
  { id: 'c5', productName: 'CJC-1295 + Ipamorelin', batchNumber: 'EVO-CJ-4412', purity: '99.7%', date: '2023-11-20' },
  { id: 'c6', productName: 'GHK-Cu 50mg', batchNumber: 'EVO-GK-0021', purity: '99.9%', date: '2023-12-05' },
];