const groceryAliases = {
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

const normalizeQuery = (query = '') =>
  query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

export const getExpandedSearchTerms = (query = '') => {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];

  const terms = new Set([normalized]);
  Object.entries(groceryAliases).forEach(([key, values]) => {
    if (normalized.includes(key)) {
      terms.add(key);
      values.forEach(value => terms.add(value));
    }

    values.forEach(value => {
      if (normalized.includes(value) || value.includes(normalized)) {
        terms.add(key);
        terms.add(value);
      }
    });
  });

  return Array.from(terms).filter(Boolean);
};
