// Comprehensive Ayurvedic Herb Database
export const herbDatabase = {
  turmeric: {
    name: "Turmeric (Haldi)",
    scientificName: "Curcuma longa",
    description: "A golden-yellow spice with powerful anti-inflammatory and antioxidant properties. Known as the 'Golden Spice' in Ayurveda.",
    properties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial", "Hepatoprotective"],
    uses: ["Joint pain", "Digestive issues", "Skin problems", "Wound healing", "Liver health"],
    whereFound: "Native to Southeast Asia, widely cultivated in India, Thailand, China, and tropical regions worldwide",
    availability: "Available in grocery stores, health food stores, online retailers, and Indian spice markets",
    forms: ["Fresh root", "Dried powder", "Capsules", "Extracts", "Essential oil"],
    dosage: "1-3 grams of powder daily, or as directed by practitioner",
    precautions: "May increase bleeding risk, avoid with blood thinners. Can cause stomach upset in large doses."
  },
  
  ashwagandha: {
    name: "Ashwagandha (Winter Cherry)",
    scientificName: "Withania somnifera",
    description: "An adaptogenic herb known for reducing stress, improving energy, and supporting overall vitality. Called 'Indian Ginseng'.",
    properties: ["Adaptogenic", "Anti-stress", "Immunomodulatory", "Neuroprotective"],
    uses: ["Stress relief", "Anxiety", "Insomnia", "Fatigue", "Immune support", "Muscle strength"],
    whereFound: "Native to India, Middle East, and parts of Africa. Grows in dry regions and rocky soils",
    availability: "Health food stores, Ayurvedic pharmacies, online retailers, some grocery stores",
    forms: ["Root powder", "Capsules", "Liquid extracts", "Tablets"],
    dosage: "300-600mg daily, preferably with meals",
    precautions: "Avoid during pregnancy. May interact with thyroid medications and immunosuppressants."
  },

  neem: {
    name: "Neem (Margosa)",
    scientificName: "Azadirachta indica",
    description: "A versatile medicinal tree known for its antibacterial, antifungal, and blood-purifying properties.",
    properties: ["Antibacterial", "Antifungal", "Blood purifier", "Anti-inflammatory"],
    uses: ["Skin conditions", "Dental health", "Blood purification", "Diabetes management", "Pest control"],
    whereFound: "Native to Indian subcontinent, now found in tropical and semi-tropical regions worldwide",
    availability: "Indian grocery stores, Ayurvedic shops, online retailers, some health food stores",
    forms: ["Leaf powder", "Oil", "Capsules", "Fresh leaves", "Bark extract"],
    dosage: "2-4 grams of leaf powder daily, or as directed",
    precautions: "Bitter taste. Avoid during pregnancy and breastfeeding. May lower blood sugar."
  },

  tulsi: {
    name: "Tulsi (Holy Basil)",
    scientificName: "Ocimum tenuiflorum",
    description: "Sacred herb in Hinduism with powerful adaptogenic and respiratory benefits. Known as 'Queen of Herbs'.",
    properties: ["Adaptogenic", "Respiratory support", "Antimicrobial", "Stress-relieving"],
    uses: ["Respiratory infections", "Stress relief", "Immune support", "Fever", "Cough and cold"],
    whereFound: "Native to Indian subcontinent, cultivated throughout Southeast Asia and tropical regions",
    availability: "Indian grocery stores, health food stores, online retailers, can be grown at home",
    forms: ["Fresh leaves", "Dried leaves", "Tea", "Capsules", "Essential oil"],
    dosage: "2-3 cups of tea daily, or 300-600mg in capsule form",
    precautions: "Generally safe. May lower blood sugar and blood pressure."
  },

  ginger: {
    name: "Ginger (Adrak)",
    scientificName: "Zingiber officinale",
    description: "A warming spice excellent for digestion, nausea, and circulation. Widely used in cooking and medicine.",
    properties: ["Digestive", "Anti-nausea", "Anti-inflammatory", "Circulatory stimulant"],
    uses: ["Nausea", "Digestive issues", "Motion sickness", "Cold and flu", "Joint pain"],
    whereFound: "Native to Southeast Asia, cultivated in India, China, Jamaica, and tropical regions worldwide",
    availability: "Widely available in grocery stores, supermarkets, health food stores, and spice markets",
    forms: ["Fresh root", "Dried powder", "Capsules", "Tea", "Essential oil", "Crystallized"],
    dosage: "1-4 grams daily, or 2-3 cups of ginger tea",
    precautions: "May increase bleeding risk. Avoid large amounts during pregnancy."
  },

  brahmi: {
    name: "Brahmi (Bacopa)",
    scientificName: "Bacopa monnieri",
    description: "A brain tonic herb renowned for enhancing memory, concentration, and cognitive function.",
    properties: ["Nootropic", "Memory enhancer", "Neuroprotective", "Adaptogenic"],
    uses: ["Memory improvement", "Concentration", "Anxiety", "ADHD", "Age-related cognitive decline"],
    whereFound: "Native to wetlands of India, Australia, Europe, Africa, Asia, and North and South America",
    availability: "Health food stores, Ayurvedic pharmacies, online retailers, supplement stores",
    forms: ["Capsules", "Powder", "Liquid extracts", "Tablets"],
    dosage: "300-600mg daily, preferably with meals",
    precautions: "May cause drowsiness initially. Can interact with thyroid medications."
  },

  amla: {
    name: "Amla (Indian Gooseberry)",
    scientificName: "Phyllanthus emblica",
    description: "A vitamin C-rich fruit that supports immunity, hair health, and overall rejuvenation.",
    properties: ["Antioxidant", "Immunomodulatory", "Rejuvenative", "Vitamin C rich"],
    uses: ["Immune support", "Hair health", "Skin health", "Digestive health", "Anti-aging"],
    whereFound: "Native to India, found throughout Southeast Asia and cultivated in tropical regions",
    availability: "Indian grocery stores, health food stores, online retailers, some Asian markets",
    forms: ["Fresh fruit", "Juice", "Powder", "Capsules", "Dried fruit", "Oil"],
    dosage: "1-2 teaspoons of powder daily, or 1 fresh fruit",
    precautions: "Generally safe. May enhance iron absorption."
  },

  triphala: {
    name: "Triphala (Three Fruits)",
    scientificName: "Combination of Amalaki, Bibhitaki, Haritaki",
    description: "A traditional formula of three fruits that supports digestion, detoxification, and overall health.",
    properties: ["Digestive", "Detoxifying", "Antioxidant", "Rejuvenative"],
    uses: ["Constipation", "Digestive health", "Detoxification", "Eye health", "Weight management"],
    whereFound: "Components found throughout India and Southeast Asia",
    availability: "Ayurvedic stores, health food stores, online retailers, Indian pharmacies",
    forms: ["Powder", "Capsules", "Tablets", "Liquid extracts"],
    dosage: "1-2 teaspoons of powder at bedtime, or as directed",
    precautions: "May cause loose stools initially. Avoid during pregnancy."
  }
};

// Alternative names mapping
const alternativeNames = {
  'haldi': 'turmeric',
  'haridra': 'turmeric',
  'curcuma': 'turmeric',
  'golden spice': 'turmeric',
  'winter cherry': 'ashwagandha',
  'indian ginseng': 'ashwagandha',
  'withania': 'ashwagandha',
  'holy basil': 'tulsi',
  'ocimum': 'tulsi',
  'queen of herbs': 'tulsi',
  'margosa': 'neem',
  'azadirachta': 'neem',
  'adrak': 'ginger',
  'zingiber': 'ginger',
  'bacopa': 'brahmi',
  'indian gooseberry': 'amla',
  'phyllanthus': 'amla',
  'three fruits': 'triphala'
};

// Function to search for herbs
export const searchHerb = (query) => {
  const searchTerm = query.toLowerCase();
  
  // Check alternative names first
  for (const [alt, main] of Object.entries(alternativeNames)) {
    if (searchTerm.includes(alt)) {
      return herbDatabase[main];
    }
  }
  
  // Direct name matches
  for (const [key, herb] of Object.entries(herbDatabase)) {
    if (searchTerm.includes(key) || 
        herb.name.toLowerCase().includes(searchTerm) ||
        herb.scientificName.toLowerCase().includes(searchTerm)) {
      return herb;
    }
  }
  
  // Search in uses and properties
  for (const [key, herb] of Object.entries(herbDatabase)) {
    const searchableText = [
      ...herb.uses,
      ...herb.properties,
      herb.description
    ].join(' ').toLowerCase();
    
    if (searchableText.includes(searchTerm)) {
      return herb;
    }
  }
  
  return null;
};

// Function to detect if query is about herbs
export const isHerbQuery = (query) => {
  const herbKeywords = [
    'herb', 'herbs', 'plant', 'plants', 'medicine', 'medicinal',
    'where to find', 'where can i find', 'where to buy', 'where to get',
    'availability', 'available', 'grow', 'cultivation', 'native',
    'tell me about', 'what is', 'about',
    ...Object.keys(herbDatabase),
    ...Object.keys(alternativeNames),
    ...Object.values(herbDatabase).map(h => h.name.toLowerCase())
  ];
  
  const queryLower = query.toLowerCase();
  return herbKeywords.some(keyword => queryLower.includes(keyword));
};