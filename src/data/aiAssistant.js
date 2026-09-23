// Indian Kirana AI Assistant Engine

export const indianGroceryAliases = {
  atta: ['atta', 'aata', 'wheat flour', 'gehu', 'sharbati', 'chakki atta', 'aashirvaad atta', 'fortune atta'],
  dal: ['dal', 'daal', 'pulses', 'toor dal', 'arhar dal', 'moong dal', 'chana dal', 'masoor dal', 'urad dal', 'rajma', 'chana', 'kabuli chana'],
  rice: ['rice', 'chawal', 'basmati', 'rozana', 'rice grains', 'biryani rice', 'india gate'],
  tel: ['oil', 'tel', 'cooking oil', 'sunflower oil', 'mustard oil', 'sarson tel', 'groundnut oil', 'saffola', 'fortune oil', 'gemini'],
  ghee: ['ghee', 'desi ghee', 'pure ghee', 'cow ghee', 'amul ghee', 'gowardhan ghee'],
  doodh: ['milk', 'doodh', 'toned milk', 'amul milk', 'mother dairy', 'full cream milk', 'cow milk'],
  dahi: ['curd', 'dahi', 'yogurt', 'probiotic curd'],
  paneer: ['paneer', 'cottage cheese', 'malai paneer'],
  butter: ['butter', 'makhan', 'amul butter', 'salted butter'],
  cheese: ['cheese', 'cheese slice', 'amul cheese'],
  bread: ['bread', 'brown bread', 'white bread', 'sandwich bread', 'pav', 'bun'],
  eggs: ['eggs', 'egg', 'anda', 'ande', 'farm eggs', 'dozen eggs'],
  chini: ['sugar', 'chini', 'sakkar', 'sugar crystals', 'madhur'],
  namak: ['salt', 'namak', 'iodised salt', 'tata salt', 'rock salt', 'sendha namak'],
  chai: ['tea', 'chai', 'chai patti', 'tea leaves', 'tata tea', 'red label', 'kadak chai'],
  coffee: ['coffee', 'nescafe', 'bru', 'instant coffee'],
  masala: ['masala', 'spices', 'haldi', 'turmeric', 'mirchi', 'red chilli', 'dhaniya', 'coriander', 'garam masala', 'jeera', 'cumin', 'rai', 'mustard seeds', 'kasuri methi', 'pav bhaji masala', 'everest', 'mdh', 'catch'],
  biscuits: ['biscuit', 'biscuits', 'cookies', 'parle g', 'good day', 'hide & seek', 'marie gold', 'bourbon'],
  snacks: ['snacks', 'chips', 'lays', 'kurkure', 'bingo', 'bhujia', 'sev', 'namkeen'],
  surf: ['surf', 'detergent', 'washing powder', 'surf excel', 'tide', 'ariel', 'laundry detergent'],
  vim: ['vim', 'dishwash', 'dishwashing gel', 'bartan bar', 'dishwash bar', 'dishwash liquid'],
  cleaner: ['harpic', 'lizol', 'phenyl', 'floor cleaner', 'toilet cleaner', 'cleaning'],
  sabun: ['soap', 'sabun', 'bathing bar', 'lux', 'dove', 'dettol', 'lifebuoy'],
  shampoo: ['shampoo', 'head & shoulders', 'clinic plus', 'hair wash'],
  toothpaste: ['toothpaste', 'colgate', 'closeup', 'brush', 'teeth'],
  badam: ['almonds', 'badam', 'badam giri', 'california almonds'],
  kaju: ['cashews', 'kaju', 'cashew nuts'],
  kismis: ['raisins', 'kismis', 'kishmish', 'golden raisins'],
  honey: ['honey', 'shahad', 'dabur honey'],
  besan: ['besan', 'gram flour', 'chana besan'],
  suji: ['suji', 'sooji', 'rava', 'semolina'],
  maida: ['maida', 'all purpose flour', 'refined flour'],
  poha: ['poha', 'flattened rice', 'chivda']
};

export const normalizeIndianQuery = (query = '') =>
  query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Convert Hindi / Hinglish numbers to digits
const numberWordMap = {
  'ek': 1,
  'one': 1,
  '1': 1,
  'do': 2,
  'two': 2,
  '2': 2,
  'teen': 3,
  'tin': 3,
  'three': 3,
  '3': 3,
  'char': 4,
  'four': 4,
  '4': 4,
  'paanch': 5,
  'panch': 5,
  'five': 5,
  '5': 5,
  'che': 6,
  'six': 6,
  '6': 6,
  'saat': 7,
  'seven': 7,
  '7': 7,
  'aath': 8,
  'eight': 8,
  '8': 8,
  'nau': 9,
  'nine': 9,
  '9': 9,
  'das': 10,
  'ten': 10,
  '10': 10,
  'aadha': 0.5,
  'adha': 0.5,
  'half': 0.5,
  'dedh': 1.5,
  'dhai': 2.5,
  'pao': 0.25,
  'pav': 0.25
};

export const getExpandedSearchTerms = (query = '') => {
  const normalized = normalizeIndianQuery(query);
  if (!normalized) return [];

  const terms = new Set([normalized]);

  // Check alias dictionary
  Object.entries(indianGroceryAliases).forEach(([key, values]) => {
    if (normalized.includes(key)) {
      terms.add(key);
      values.forEach((v) => terms.add(v));
    }

    values.forEach((value) => {
      if (normalized.includes(value) || value.includes(normalized)) {
        terms.add(key);
        terms.add(value);
      }
    });
  });

  return Array.from(terms).filter(Boolean);
};

export const findProductByKeywords = (products = [], keywords = []) => {
  if (!products.length || !keywords.length) return null;

  const lowerKeywords = keywords.map((k) => k.toLowerCase().trim());

  // 1. Exact Name/Brand match
  for (const product of products) {
    const prodName = product.name.toLowerCase();
    const prodBrand = (product.brand || '').toLowerCase();
    for (const kw of lowerKeywords) {
      if (prodName.includes(kw) || prodBrand.includes(kw)) {
        return product;
      }
    }
  }

  // 2. Category / Description match
  for (const product of products) {
    const haystack = [product.name, product.brand, product.categoryName, product.description || '']
      .join(' ')
      .toLowerCase();

    if (lowerKeywords.some((kw) => haystack.includes(kw))) {
      return product;
    }
  }

  return null;
};

// Parse a single line of Hinglish grocery item into structured object
export const parseGroceryLine = (line = '', products = []) => {
  const normalized = normalizeIndianQuery(line);
  if (!normalized) return null;

  const words = normalized.split(' ');
  let quantity = 1;
  let unit = 'unit';

  // Check for quantity digits or words at start
  const firstWord = words[0];
  const secondWord = words[1];

  if (!isNaN(parseFloat(firstWord))) {
    quantity = Math.max(1, Math.round(parseFloat(firstWord)));
  } else if (numberWordMap[firstWord]) {
    quantity = Math.max(1, Math.round(numberWordMap[firstWord]));
  }

  // Detect unit
  if (normalized.includes('kg') || normalized.includes('kilo')) {
    unit = 'kg';
  } else if (normalized.includes('litre') || normalized.includes('liter') || normalized.includes(' l ') || normalized.endsWith(' l') || normalized.includes('ltr')) {
    unit = 'L';
  } else if (normalized.includes('gm') || normalized.includes('gram') || normalized.includes(' g ') || normalized.endsWith(' g')) {
    unit = 'g';
  } else if (normalized.includes('packet') || normalized.includes('pkt') || normalized.includes('pack')) {
    unit = 'packet';
  } else if (normalized.includes('dozen') || normalized.includes('darjan')) {
    unit = 'dozen';
  } else if (normalized.includes('piece') || normalized.includes('pc')) {
    unit = 'piece';
  }

  // Find matching product
  // Expand synonyms for all words
  const expanded = getExpandedSearchTerms(normalized);
  const matchedProduct = findProductByKeywords(products, [...expanded, normalized, ...words]);

  return {
    rawLine: line,
    quantity,
    unit,
    product: matchedProduct
  };
};

// Parse raw WhatsApp grocery list or multi-line text into cart items
export const parseMultiLineGroceryList = (rawText = '', products = []) => {
  const lines = rawText.split(/\r?\n|,|;/).map((l) => l.trim()).filter(Boolean);
  const parsedItems = [];

  lines.forEach((line) => {
    // Strip bullet numbers (e.g. "1.", "2)", "- ")
    const cleanLine = line.replace(/^(\d+[\.\)]\s*|[-*•]\s*)/, '').trim();
    if (!cleanLine) return;

    const parsed = parseGroceryLine(cleanLine, products);
    if (parsed && parsed.product) {
      parsedItems.push(parsed);
    }
  });

  return parsedItems;
};

// Pre-defined Indian Kirana Ration Kits & Meal Plans
export const KIRANA_SMART_KITS = [
  {
    id: 'family-weekly-4',
    title: 'Weekly Family Ration (4 Persons)',
    subtitle: 'Standard 1-week kitchen pantry staples for a typical Indian family of 4',
    badge: 'Most Popular',
    icon: 'Users',
    description: 'Complete balanced list of daily flour, rice, lentils, cooking oil, dairy, tea, sugar, and snacks.',
    queries: ['groceries for 4 people for one week', '4 people 1 week', 'weekly groceries for 4', 'family ration 4'],
    items: [
      { key: 'atta', name: 'Aashirvaad Superior MP Atta', quantity: 1, unit: '5 kg', keywords: ['aashirvaad', 'atta'] },
      { key: 'rice', name: 'India Gate Rozana Basmati Rice', quantity: 1, unit: '5 kg', keywords: ['india gate', 'basmati rice'] },
      { key: 'dal', name: 'Tata Sampann Unpolished Toor Dal', quantity: 1, unit: '1 kg', keywords: ['toor dal', 'tata sampann toor'] },
      { key: 'tel', name: 'Fortune Sunlite Sunflower Oil', quantity: 2, unit: '2 L', keywords: ['fortune sunlite', 'sunflower oil'] },
      { key: 'chini', name: 'Madhur Pure Refined Sugar', quantity: 1, unit: '1 kg', keywords: ['madhur', 'sugar'] },
      { key: 'namak', name: 'Tata Salt Vacuum Evaporated Iodised Salt', quantity: 1, unit: '1 kg', keywords: ['tata salt'] },
      { key: 'chai', name: 'Tata Tea Premium Desi Chai', quantity: 1, unit: '500 g', keywords: ['tata tea'] },
      { key: 'biscuits', name: 'Parle-G Original Gluco Biscuits', quantity: 2, unit: '2 packets', keywords: ['parle g'] },
      { key: 'doodh', name: 'Amul Taaza Toned Milk', quantity: 7, unit: '7 L', keywords: ['amul taaza', 'amul milk'] }
    ]
  },
  {
    id: 'bachelor-monthly',
    title: 'Monthly Bachelor Ration Kit',
    subtitle: 'Quick cooking essentials, ready snacks, tea & noodles for working professionals',
    badge: 'Quick & Easy',
    icon: 'Coffee',
    description: 'Quick-prep breakfast poha, ready tea, instant coffee, biscuits, chips, milk, and basic dal-rice.',
    queries: ['bachelor', 'bachelor monthly', 'quick bachelor ration', 'hostel ration'],
    items: [
      { key: 'rice', name: 'India Gate Rozana Basmati Rice', quantity: 1, unit: '5 kg', keywords: ['basmati rice', 'india gate'] },
      { key: 'moong-dal', name: 'Tata Sampann Moong Dal', quantity: 1, unit: '1 kg', keywords: ['moong dal'] },
      { key: 'poha', name: 'Fortune Thick Poha', quantity: 2, unit: '1 kg', keywords: ['poha'] },
      { key: 'oil', name: 'Fortune Sunlite Sunflower Oil', quantity: 1, unit: '1 L', keywords: ['fortune sunlite'] },
      { key: 'chai', name: 'Tata Tea Premium Desi Chai', quantity: 1, unit: '500 g', keywords: ['tata tea'] },
      { key: 'coffee', name: 'Nescafé Classic Instant Coffee', quantity: 1, unit: '100 g', keywords: ['nescafe'] },
      { key: 'biscuits', name: 'Britannia Good Day Butter Cookies', quantity: 3, unit: '3 packets', keywords: ['good day'] },
      { key: 'chips', name: 'Lay\'s India\'s Magic Masala', quantity: 3, unit: '3 packets', keywords: ['lays'] },
      { key: 'surf', name: 'Surf Excel Easy Wash Detergent', quantity: 1, unit: '2 kg', keywords: ['surf excel'] }
    ]
  },
  {
    id: 'chai-nashta-party',
    title: 'Chai & Shaam Ka Nashta Bundle',
    subtitle: 'Assorted cookies, namkeen, premium kadak chai & milk for evening snacks',
    badge: 'Tea Lovers',
    icon: 'Sparkles',
    description: 'Crisp Parle-G, Good Day, Hide & Seek, Haldiram Bhujia, Kurkure, and Kadak Red Label Tea.',
    queries: ['chai nashta', 'tea party', 'evening snacks', 'chai biscuits'],
    items: [
      { key: 'chai', name: 'Brooke Bond Red Label Tea', quantity: 1, unit: '500 g', keywords: ['red label'] },
      { key: 'doodh', name: 'Amul Gold Full Cream Milk', quantity: 2, unit: '1 L', keywords: ['amul gold', 'amul milk'] },
      { key: 'sugar', name: 'Madhur Refined Sugar', quantity: 1, unit: '1 kg', keywords: ['madhur'] },
      { key: 'parle', name: 'Parle-G Original Gluco Biscuits', quantity: 2, unit: '2 packets', keywords: ['parle g'] },
      { key: 'good-day', name: 'Britannia Good Day Butter Cookies', quantity: 2, unit: '2 packets', keywords: ['good day'] },
      { key: 'hide-seek', name: 'Parle Hide & Seek Chocolate Chip Biscuits', quantity: 2, unit: '2 packets', keywords: ['hide & seek'] },
      { key: 'bhujia', name: 'Haldiram\'s Nagpur Bhujia Sev', quantity: 1, unit: '400 g', keywords: ['bhujia', 'haldiram'] },
      { key: 'kurkure', name: 'Kurkure Masala Munch', quantity: 2, unit: '2 packets', keywords: ['kurkure'] }
    ]
  },
  {
    id: 'monthly-spices-masala',
    title: 'Indian Spice Box & Tadka Refill',
    subtitle: 'Essential MDH, Everest & Catch masalas for authentic daily Indian cooking',
    badge: 'Desi Swad',
    icon: 'Flame',
    description: 'Turmeric (Haldi), Tikhalal Chilli, MDH Deggi Mirch, MDH Garam Masala, Jeera, Rai & Kasuri Methi.',
    queries: ['masala kit', 'spice box', 'spices refill', 'tadka masala'],
    items: [
      { key: 'haldi', name: 'Everest Turmeric / Haldi Powder', quantity: 1, unit: '250 g', keywords: ['everest', 'turmeric', 'haldi'] },
      { key: 'mirchi', name: 'Everest Tikhalal Red Chilli Powder', quantity: 1, unit: '250 g', keywords: ['everest', 'chilli', 'tikhalal'] },
      { key: 'deggi-mirch', name: 'MDH Deggi Mirch', quantity: 1, unit: '100 g', keywords: ['mdh', 'deggi mirch'] },
      { key: 'garam-masala', name: 'MDH Garam Masala', quantity: 1, unit: '100 g', keywords: ['mdh', 'garam masala'] },
      { key: 'dhaniya', name: 'Catch Coriander / Dhaniya Powder', quantity: 1, unit: '200 g', keywords: ['catch', 'dhaniya', 'coriander'] },
      { key: 'jeera', name: 'Catch Whole Cumin Seeds (Jeera)', quantity: 1, unit: '200 g', keywords: ['catch', 'jeera', 'cumin'] },
      { key: 'rai', name: 'Tata Sampann Small Mustard Seeds (Rai)', quantity: 1, unit: '200 g', keywords: ['mustard seeds', 'rai'] },
      { key: 'methi', name: 'MDH Kasuri Methi', quantity: 1, unit: '100 g', keywords: ['kasuri methi'] }
    ]
  },
  {
    id: 'home-cleaning-hygiene',
    title: 'Home Cleaning & Hygiene Bundle',
    subtitle: 'Detergents, floor cleaners, dishwashing gel, toilet cleaner & Dettol soap',
    badge: 'Purity Shield',
    icon: 'ShieldCheck',
    description: 'Surf Excel, Vim Gel, Lizol Floor Cleaner, Harpic Power Plus, Dettol Soap & Colgate Toothpaste.',
    queries: ['cleaning kit', 'house cleaning', 'hygiene bundle', 'detergent and soap'],
    items: [
      { key: 'surf', name: 'Surf Excel Easy Wash Detergent Powder', quantity: 1, unit: '2 kg', keywords: ['surf excel'] },
      { key: 'vim', name: 'Vim Lemon Dishwash Liquid Gel', quantity: 1, unit: '750 ml', keywords: ['vim', 'gel'] },
      { key: 'harpic', name: 'Harpic Power Plus Toilet Cleaner', quantity: 1, unit: '1 L', keywords: ['harpic'] },
      { key: 'lizol', name: 'Lizol Disinfectant Floor Cleaner', quantity: 1, unit: '1 L', keywords: ['lizol'] },
      { key: 'dettol', name: 'Dettol Original Germ Protection Soap', quantity: 1, unit: 'Pack of 4', keywords: ['dettol', 'soap'] },
      { key: 'colgate', name: 'Colgate Strong Teeth Dental Cream', quantity: 1, unit: '300 g', keywords: ['colgate'] }
    ]
  },
  {
    id: 'pooja-dryfruit-festive',
    title: 'Pooja, Sweets & Dry Fruit Platter',
    subtitle: 'Pure Desi Ghee, California Almonds, Kaju, Kismis, Sugar & Honey',
    badge: 'Shubh Laabh',
    icon: 'Zap',
    description: 'Pure Amul Desi Ghee, California Almonds (Badam), Royal Cashews (Kaju), Golden Raisins & Honey.',
    queries: ['pooja', 'dry fruit', 'festive kit', 'diwali', 'halwa samagri'],
    items: [
      { key: 'ghee', name: 'Amul Pure Desi Ghee', quantity: 1, unit: '1 L', keywords: ['amul ghee', 'pure ghee'] },
      { key: 'badam', name: 'California Crisp Almonds (Badam Giri)', quantity: 1, unit: '500 g', keywords: ['badam', 'almonds'] },
      { key: 'kaju', name: 'Royal Whole Cashews W320 Grade (Kaju)', quantity: 1, unit: '500 g', keywords: ['kaju', 'cashews'] },
      { key: 'kismis', name: 'Golden Indian Seedless Raisins (Kismis)', quantity: 1, unit: '500 g', keywords: ['kismis', 'raisins'] },
      { key: 'sugar', name: 'Madhur Pure Refined Sugar', quantity: 1, unit: '1 kg', keywords: ['madhur', 'sugar'] },
      { key: 'suji', name: 'Rajdhani Special Sooji (Rava)', quantity: 1, unit: '500 g', keywords: ['sooji', 'rava'] },
      { key: 'honey', name: 'Dabur 100% Pure Natural Honey', quantity: 1, unit: '500 g', keywords: ['dabur honey'] }
    ]
  }
];

export const getSuggestedWeeklyKiranaPlan = (query = '', products = []) => {
  const normalized = normalizeIndianQuery(query);

  // 1. Check if user matched a specific pre-defined kit
  if (normalized) {
    for (const kit of KIRANA_SMART_KITS) {
      const isMatch = kit.queries.some(
        (q) => normalized.includes(q) || q.includes(normalized) || normalized.includes(kit.id)
      );
      if (isMatch) {
        const resolvedItems = kit.items
          .map((it) => {
            const product = findProductByKeywords(products, it.keywords);
            return {
              ...it,
              product
            };
          })
          .filter((it) => it.product);

        return {
          kitInfo: kit,
          items: resolvedItems
        };
      }
    }
  }

  // 2. Default to the primary requested kit: "Groceries for 4 people for 1 week"
  const defaultKit = KIRANA_SMART_KITS[0];
  const resolvedItems = defaultKit.items
    .map((it) => {
      const product = findProductByKeywords(products, it.keywords);
      return {
        ...it,
        product
      };
    })
    .filter((it) => it.product);

  return {
    kitInfo: defaultKit,
    items: resolvedItems
  };
};
