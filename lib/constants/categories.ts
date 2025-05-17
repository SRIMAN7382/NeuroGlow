export const PRODUCT_CATEGORIES = {
  FACE: {
    id: 'face',
    name: 'Face',
    subcategories: ['foundation', 'concealer', 'powder', 'blush', 'bronzer', 'highlighter', 'primer']
  },
  EYES: {
    id: 'eyes',
    name: 'Eyes',
    subcategories: ['eyeshadow', 'eyeliner', 'mascara', 'eyebrow', 'eye_primer']
  },
  LIPS: {
    id: 'lips',
    name: 'Lips',
    subcategories: ['lipstick', 'lip_liner', 'lip_gloss', 'lip_stain']
  },
  SKINCARE: {
    id: 'skincare',
    name: 'Skincare',
    subcategories: ['moisturizer', 'cleanser', 'treatment', 'mask', 'eye_care']
  },
  TOOLS: {
    id: 'tools',
    name: 'Tools',
    subcategories: ['brushes', 'applicators', 'accessories']
  }
};

export const PRODUCT_TAGS = {
  CONCERNS: [
    'acne',
    'aging',
    'blackheads',
    'dark circles',
    'dark spots',
    'dryness',
    'dullness',
    'pores',
    'redness',
    'sensitivity',
    'uneven skin tone',
    'wrinkles'
  ],
  FORMULATION: [
    'cream',
    'gel',
    'liquid',
    'oil',
    'powder',
    'serum',
    'spray'
  ],
  BENEFITS: [
    'brightening',
    'hydrating',
    'mattifying',
    'oil-control',
    'soothing',
    'sun protection'
  ],
  INGREDIENTS: [
    'hyaluronic acid',
    'retinol',
    'vitamin c',
    'niacinamide',
    'salicylic acid',
    'peptides'
  ]
};

export const SKIN_TYPES = [
  'normal',
  'dry',
  'oily',
  'combination',
  'sensitive'
] as const;

export const CERTIFICATIONS = [
  'cruelty-free',
  'vegan',
  'organic',
  'dermatologist-tested',
  'non-comedogenic',
  'hypoallergenic'
] as const;