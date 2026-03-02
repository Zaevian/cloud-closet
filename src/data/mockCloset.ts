import type { ClothingItem } from '../types';

const uc = (filename: string) => `/user-clothes/${filename}.jpg`;

export const mockCloset: ClothingItem[] = [
  // SHIRTS (8)
  {
    id: 'item-001', name: 'White Oxford Button-Down', category: 'shirt', subcategory: 'dress shirt',
    color: 'White', size: 'M', brand: 'Brooks Brothers',
    imageUrl: uc('0mm1h'), imageAlt: 'White oxford button-down shirt',
    lastCleaned: '2026-02-10', status: 'stored', addedDate: '2026-01-15',
    condition: 'like-new', conditionScore: 95, inspectedDate: '2026-02-10',
    defects: [],
  },
  {
    id: 'item-002', name: 'Navy Polo Shirt', category: 'shirt', subcategory: 'polo',
    color: 'Navy', size: 'M', brand: 'Lacoste',
    imageUrl: uc('hYm8j'), imageAlt: 'Navy polo shirt',
    lastCleaned: '2026-02-05', status: 'stored', addedDate: '2026-01-15',
    condition: 'good', conditionScore: 82, inspectedDate: '2026-02-05',
    defects: [
      { location: 'Left sleeve cuff', description: 'Minor fraying along edge', severity: 'minor' },
    ],
  },
  {
    id: 'item-003', name: 'Garnet FSU Game Day Tee', category: 'shirt', subcategory: 't-shirt',
    color: 'Garnet', size: 'M', brand: 'Nike',
    imageUrl: uc('gc7cr'), imageAlt: 'Garnet FSU game day tee',
    lastCleaned: '2026-01-28', status: 'at-home', addedDate: '2026-01-15',
    condition: 'fair', conditionScore: 61, inspectedDate: '2026-01-28',
    defects: [
      { location: 'Bottom hem', description: 'Minor rip in bottom hem, approx. 1 inch', severity: 'minor' },
      { location: 'Front graphic', description: 'Fading on screen-print logo', severity: 'minor' },
    ],
  },
  {
    id: 'item-004', name: 'Light Blue Chambray Shirt', category: 'shirt', subcategory: 'casual shirt',
    color: 'Light Blue', size: 'M', brand: 'J.Crew',
    imageUrl: uc('VRzJp'), imageAlt: 'Light blue chambray shirt',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-20',
    condition: 'like-new', conditionScore: 93, inspectedDate: '2026-02-14',
    defects: [],
  },
  {
    id: 'item-005', name: 'Striped Linen Shirt', category: 'shirt', subcategory: 'linen shirt',
    color: 'Blue/White', size: 'M', brand: 'Banana Republic',
    imageUrl: uc('1QMQZ'), imageAlt: 'Light blue oxford casual shirt',
    lastCleaned: '2026-02-08', status: 'stored', addedDate: '2026-01-22',
    condition: 'good', conditionScore: 79, inspectedDate: '2026-02-08',
    defects: [
      { location: 'Right collar point', description: 'Small yellow discoloration from previous use', severity: 'minor' },
    ],
  },
  {
    id: 'item-006', name: 'Black Henley Shirt', category: 'shirt', subcategory: 'henley',
    color: 'Black', size: 'M', brand: 'Gap',
    imageUrl: uc('HswW2'), imageAlt: 'Black henley shirt',
    lastCleaned: '2026-02-01', status: 'stored', addedDate: '2026-01-25',
    condition: 'good', conditionScore: 85, inspectedDate: '2026-02-01',
    defects: [
      { location: 'Neckline', description: 'Small hole at neckline seam, approx. 3mm', severity: 'minor' },
    ],
  },
  {
    id: 'item-007', name: 'Gray Merino Crewneck', category: 'shirt', subcategory: 'sweater',
    color: 'Gray', size: 'M', brand: 'Everlane',
    imageUrl: uc('SmY92'), imageAlt: 'Gray crewneck long sleeve shirt',
    lastCleaned: '2026-02-12', status: 'stored', addedDate: '2026-01-28',
    condition: 'like-new', conditionScore: 91, inspectedDate: '2026-02-12',
    defects: [],
  },
  {
    id: 'item-008', name: 'Gold FSU Spirit Tank', category: 'shirt', subcategory: 'tank top',
    color: 'Gold', size: 'M', brand: 'Nike',
    imageUrl: uc('WXLqJ'), imageAlt: 'Gold FSU spirit tank top',
    lastCleaned: '2026-01-30', status: 'at-home', addedDate: '2026-01-30',
    condition: 'fair', conditionScore: 58, inspectedDate: '2026-01-30',
    defects: [
      { location: 'Left armhole', description: 'Moderate tear at left armhole seam, approx. 2 inches', severity: 'moderate' },
      { location: 'Front center', description: 'Small stain — appears to be grass, not fully removed', severity: 'minor' },
    ],
  },

  // PANTS (6)
  {
    id: 'item-009', name: 'Dark Wash Slim Jeans', category: 'pants', subcategory: 'jeans',
    color: 'Dark Blue', size: '32x32', brand: 'Levi\'s',
    imageUrl: uc('lzzCK'), imageAlt: 'Dark wash slim jeans',
    lastCleaned: '2026-02-10', status: 'stored', addedDate: '2026-01-15',
    condition: 'good', conditionScore: 80, inspectedDate: '2026-02-10',
    defects: [
      { location: 'Right knee', description: 'Minor surface scuffing on fabric', severity: 'minor' },
    ],
  },
  {
    id: 'item-010', name: 'Khaki Chinos', category: 'pants', subcategory: 'chinos',
    color: 'Khaki', size: '32x32', brand: 'Dockers',
    imageUrl: uc('tyhp9'), imageAlt: 'Khaki chino pants',
    lastCleaned: '2026-02-06', status: 'stored', addedDate: '2026-01-15',
    condition: 'like-new', conditionScore: 94, inspectedDate: '2026-02-06',
    defects: [],
  },
  {
    id: 'item-011', name: 'Black Dress Trousers', category: 'pants', subcategory: 'dress pants',
    color: 'Black', size: '32x32', brand: 'Calvin Klein',
    imageUrl: uc('U9SAR'), imageAlt: 'Black dress trousers',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-18',
    condition: 'like-new', conditionScore: 97, inspectedDate: '2026-02-14',
    defects: [],
  },
  {
    id: 'item-012', name: 'Olive Cargo Pants', category: 'pants', subcategory: 'cargo',
    color: 'Olive', size: '32x32', brand: 'Carhartt',
    imageUrl: uc('k1gUa'), imageAlt: 'Olive cargo pants',
    lastCleaned: '2026-01-25', status: 'stored', addedDate: '2026-01-20',
    condition: 'fair', conditionScore: 63, inspectedDate: '2026-01-25',
    defects: [
      { location: 'Left cargo pocket', description: 'Torn pocket seam, approx. 1.5 inches', severity: 'moderate' },
      { location: 'Right knee', description: 'Faded patch area from heavy wear', severity: 'minor' },
    ],
  },
  {
    id: 'item-013', name: 'Navy Slim Chinos', category: 'pants', subcategory: 'chinos',
    color: 'Navy', size: '32x32', brand: 'Gap',
    imageUrl: uc('4ZnQh'), imageAlt: 'Navy slim chino pants',
    lastCleaned: '2026-02-03', status: 'stored', addedDate: '2026-01-22',
    condition: 'good', conditionScore: 84, inspectedDate: '2026-02-03',
    defects: [
      { location: 'Bottom left hem', description: 'Slight fraying at cuff', severity: 'minor' },
    ],
  },
  {
    id: 'item-014', name: 'Light Wash Straight Jeans', category: 'pants', subcategory: 'jeans',
    color: 'Light Blue', size: '32x32', brand: 'Levi\'s',
    imageUrl: uc('Yvs91'), imageAlt: 'Light wash straight jeans',
    lastCleaned: '2026-02-09', status: 'stored', addedDate: '2026-01-24',
    condition: 'good', conditionScore: 77, inspectedDate: '2026-02-09',
    defects: [
      { location: 'Right thigh', description: 'Minor abrasion marks from regular wear', severity: 'minor' },
      { location: 'Back right pocket', description: 'Small hole at pocket corner, approx. 5mm', severity: 'minor' },
    ],
  },

  // JACKETS (4)
  {
    id: 'item-015', name: 'Navy Blazer', category: 'jacket', subcategory: 'blazer',
    color: 'Navy', size: 'M', brand: 'Brooks Brothers',
    imageUrl: uc('jSnRB'), imageAlt: 'Navy blazer jacket',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-15',
    condition: 'like-new', conditionScore: 96, inspectedDate: '2026-02-14',
    defects: [],
  },
  {
    id: 'item-016', name: 'Black Leather Jacket', category: 'jacket', subcategory: 'leather jacket',
    color: 'Black', size: 'M', brand: 'AllSaints',
    imageUrl: uc('G1Azc'), imageAlt: 'Black leather jacket',
    lastCleaned: '2026-01-20', status: 'stored', addedDate: '2026-01-15',
    condition: 'good', conditionScore: 76, inspectedDate: '2026-01-20',
    defects: [
      { location: 'Left elbow', description: 'Surface scuff on leather, approx. 2cm', severity: 'minor' },
      { location: 'Right cuff zipper', description: 'Zipper pull slightly stiff, functional', severity: 'minor' },
    ],
  },
  {
    id: 'item-017', name: 'Tan Trench Coat', category: 'jacket', subcategory: 'trench coat',
    color: 'Tan', size: 'M', brand: 'Burberry',
    imageUrl: uc('7DaTj'), imageAlt: 'Tan trench coat',
    lastCleaned: '2026-02-01', status: 'stored', addedDate: '2026-01-18',
    condition: 'like-new', conditionScore: 92, inspectedDate: '2026-02-01',
    defects: [],
  },
  {
    id: 'item-018', name: 'Gray Puffer Jacket', category: 'jacket', subcategory: 'puffer',
    color: 'Gray', size: 'M', brand: 'Patagonia',
    imageUrl: uc('0HlUg'), imageAlt: 'Gray puffer jacket',
    lastCleaned: '2026-01-15', status: 'stored', addedDate: '2026-01-15',
    condition: 'fair', conditionScore: 65, inspectedDate: '2026-01-15',
    defects: [
      { location: 'Right shoulder seam', description: 'Small rip in outer shell, approx. 1 inch — no fill loss', severity: 'moderate' },
      { location: 'Front zipper', description: 'Zipper occasionally sticks near bottom', severity: 'minor' },
    ],
  },

  // DRESSES (5)
  {
    id: 'item-019', name: 'Little Black Dress', category: 'dress', subcategory: 'cocktail dress',
    color: 'Black', size: '6', brand: 'Zara',
    imageUrl: uc('bBmx2'), imageAlt: 'Little black dress',
    lastCleaned: '2026-02-10', status: 'stored', addedDate: '2026-01-15',
    condition: 'like-new', conditionScore: 98, inspectedDate: '2026-02-10',
    defects: [],
  },
  {
    id: 'item-020', name: 'Floral Midi Dress', category: 'dress', subcategory: 'midi dress',
    color: 'Floral', size: '6', brand: 'Free People',
    imageUrl: uc('LCWvo'), imageAlt: 'Floral midi dress',
    lastCleaned: '2026-01-28', status: 'stored', addedDate: '2026-01-20',
    condition: 'good', conditionScore: 83, inspectedDate: '2026-01-28',
    defects: [
      { location: 'Back zipper area', description: 'Minor pull on fabric near zipper teeth', severity: 'minor' },
    ],
  },
  {
    id: 'item-021', name: 'Teal Wrap Dress', category: 'dress', subcategory: 'wrap dress',
    color: 'Teal', size: '6', brand: 'Diane von Furstenberg',
    imageUrl: uc('qMGRV'), imageAlt: 'Teal wrap dress',
    lastCleaned: '2026-02-05', status: 'stored', addedDate: '2026-01-22',
    condition: 'good', conditionScore: 87, inspectedDate: '2026-02-05',
    defects: [
      { location: 'Left tie belt', description: 'Small fraying at belt tip', severity: 'minor' },
    ],
  },
  {
    id: 'item-022', name: 'White Sundress', category: 'dress', subcategory: 'sundress',
    color: 'White', size: '6', brand: 'H&M',
    imageUrl: uc('EIGdK'), imageAlt: 'White sundress',
    lastCleaned: '2026-02-08', status: 'stored', addedDate: '2026-01-25',
    condition: 'fair', conditionScore: 60, inspectedDate: '2026-02-08',
    defects: [
      { location: 'Front chest area', description: 'Faint yellow stain, partially removed', severity: 'moderate' },
      { location: 'Bottom hem', description: 'Minor rip, approx. 0.5 inches on right side', severity: 'minor' },
    ],
  },
  {
    id: 'item-023', name: 'Red Date Night Dress', category: 'dress', subcategory: 'mini dress',
    color: 'Red', size: '6', brand: 'ASOS',
    imageUrl: uc('DJBd4'), imageAlt: 'Red date night dress',
    lastCleaned: '2026-01-30', status: 'stored', addedDate: '2026-01-28',
    condition: 'like-new', conditionScore: 99, inspectedDate: '2026-01-30',
    defects: [],
  },

  // SHOES (4)
  {
    id: 'item-024', name: 'White Leather Sneakers', category: 'shoes', subcategory: 'sneakers',
    color: 'White', size: '10', brand: 'Common Projects',
    imageUrl: uc('RnOBU'), imageAlt: 'White leather sneakers',
    lastCleaned: '2026-02-12', status: 'stored', addedDate: '2026-01-15',
    condition: 'good', conditionScore: 80, inspectedDate: '2026-02-12',
    defects: [
      { location: 'Right toe box', description: 'Light scuff mark on leather toe cap', severity: 'minor' },
    ],
  },
  {
    id: 'item-025', name: 'Oxford Dress Shoes', category: 'shoes', subcategory: 'dress shoes',
    color: 'Brown', size: '10', brand: 'Cole Haan',
    imageUrl: uc('3eHU6'), imageAlt: 'Brown oxford dress shoes',
    lastCleaned: '2026-02-06', status: 'stored', addedDate: '2026-01-15',
    condition: 'good', conditionScore: 78, inspectedDate: '2026-02-06',
    defects: [
      { location: 'Left heel', description: 'Heel tip showing moderate wear', severity: 'moderate' },
      { location: 'Right insole', description: 'Slight compression of insole cushioning', severity: 'minor' },
    ],
  },
  {
    id: 'item-026', name: 'Black Chelsea Boots', category: 'shoes', subcategory: 'boots',
    color: 'Black', size: '10', brand: 'Thursday Boot Co.',
    imageUrl: uc('EZRj6'), imageAlt: 'Black chelsea boots',
    lastCleaned: '2026-01-22', status: 'stored', addedDate: '2026-01-18',
    condition: 'like-new', conditionScore: 90, inspectedDate: '2026-01-22',
    defects: [],
  },
  {
    id: 'item-027', name: 'Navy Running Shoes', category: 'shoes', subcategory: 'athletic',
    color: 'Navy/White', size: '10', brand: 'Nike',
    imageUrl: uc('Um68Z'), imageAlt: 'Navy running shoes',
    lastCleaned: '2026-02-01', status: 'at-home', addedDate: '2026-01-20',
    condition: 'fair', conditionScore: 55, inspectedDate: '2026-02-01',
    defects: [
      { location: 'Outer sole', description: 'Significant tread wear on ball of foot area', severity: 'moderate' },
      { location: 'Right upper mesh', description: 'Small tear in mesh, approx. 1cm', severity: 'moderate' },
    ],
  },

  // ACCESSORIES (5)
  {
    id: 'item-028', name: 'Navy Leather Belt', category: 'accessories', subcategory: 'belt',
    color: 'Navy', size: '32', brand: 'Coach',
    imageUrl: uc('5atQw'), imageAlt: 'Navy leather belt',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-15',
    condition: 'like-new', conditionScore: 95, inspectedDate: '2026-02-14',
    defects: [],
  },
  {
    id: 'item-029', name: 'Gray Wool Scarf', category: 'accessories', subcategory: 'scarf',
    color: 'Gray', size: 'OS', brand: 'Acne Studios',
    imageUrl: uc('1Gfcg'), imageAlt: 'Gray wool scarf',
    lastCleaned: '2026-02-02', status: 'stored', addedDate: '2026-01-18',
    condition: 'good', conditionScore: 85, inspectedDate: '2026-02-02',
    defects: [
      { location: 'Right fringe end', description: 'Two fringe threads pulled longer than others', severity: 'minor' },
    ],
  },
  {
    id: 'item-030', name: 'Silver Watch', category: 'accessories', subcategory: 'watch',
    color: 'Silver', size: 'OS', brand: 'Seiko',
    imageUrl: uc('0WhOf'), imageAlt: 'Silver dress watch',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-15',
    condition: 'good', conditionScore: 82, inspectedDate: '2026-02-14',
    defects: [
      { location: 'Crystal face', description: 'Hairline surface scratch, not visible when worn', severity: 'minor' },
    ],
  },
  {
    id: 'item-031', name: 'Navy Baseball Cap', category: 'accessories', subcategory: 'hat',
    color: 'Navy', size: 'OS', brand: 'New Era',
    imageUrl: uc('7JRvo'), imageAlt: 'Navy baseball cap',
    lastCleaned: '2026-01-25', status: 'stored', addedDate: '2026-01-22',
    condition: 'fair', conditionScore: 62, inspectedDate: '2026-01-25',
    defects: [
      { location: 'Sweatband interior', description: 'Moderate sweat staining on interior band', severity: 'moderate' },
      { location: 'Brim edge', description: 'Slight warping at right brim edge', severity: 'minor' },
    ],
  },
  {
    id: 'item-032', name: 'Tan Leather Wallet', category: 'accessories', subcategory: 'wallet',
    color: 'Tan', size: 'OS', brand: 'Fossil',
    imageUrl: uc('abfL2'), imageAlt: 'Tan leather wallet',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-15',
    condition: 'good', conditionScore: 75, inspectedDate: '2026-02-14',
    defects: [
      { location: 'Spine fold', description: 'Creasing along main fold from regular use', severity: 'minor' },
    ],
  },

  // SOCKS (4 pairs)
  {
    id: 'item-033', name: 'White Athletic Socks (3pk)', category: 'socks', subcategory: 'athletic',
    color: 'White', size: 'M (9-11)', brand: 'Nike',
    imageUrl: uc('w9uaM'), imageAlt: 'White athletic socks',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-15',
    condition: 'like-new', conditionScore: 95, inspectedDate: '2026-02-14',
    defects: [],
  },
  {
    id: 'item-034', name: 'Navy Dress Socks', category: 'socks', subcategory: 'dress',
    color: 'Navy', size: 'M (9-11)', brand: 'Gold Toe',
    imageUrl: uc('uH0GX'), imageAlt: 'Navy dress socks',
    lastCleaned: '2026-02-10', status: 'stored', addedDate: '2026-01-15',
    condition: 'good', conditionScore: 86, inspectedDate: '2026-02-10',
    defects: [
      { location: 'Right heel', description: 'Minor thinning of fabric at heel pad', severity: 'minor' },
    ],
  },
  {
    id: 'item-035', name: 'Colorful Pattern Socks', category: 'socks', subcategory: 'novelty',
    color: 'Multi', size: 'M (9-11)', brand: 'Happy Socks',
    imageUrl: uc('3RsRn'), imageAlt: 'Colorful pattern socks',
    lastCleaned: '2026-01-28', status: 'stored', addedDate: '2026-01-20',
    condition: 'good', conditionScore: 81, inspectedDate: '2026-01-28',
    defects: [
      { location: 'Left toe seam', description: 'Slight bunching at toe seam after wash', severity: 'minor' },
    ],
  },
  {
    id: 'item-036', name: 'Black No-Show Socks (5pk)', category: 'socks', subcategory: 'no-show',
    color: 'Black', size: 'M (9-11)', brand: 'Bombas',
    imageUrl: uc('St9ob'), imageAlt: 'Black no-show socks',
    lastCleaned: '2026-02-07', status: 'stored', addedDate: '2026-01-22',
    condition: 'like-new', conditionScore: 93, inspectedDate: '2026-02-07',
    defects: [],
  },

  // UNDERWEAR (4)
  {
    id: 'item-037', name: 'Gray Boxer Briefs (5pk)', category: 'underwear', subcategory: 'boxer briefs',
    color: 'Gray', size: 'M', brand: 'Calvin Klein',
    imageUrl: uc('E4Tsn'), imageAlt: 'Black/gray boxer briefs',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-15',
    condition: 'like-new', conditionScore: 97, inspectedDate: '2026-02-14',
    defects: [],
  },
  {
    id: 'item-038', name: 'Black Boxer Briefs (5pk)', category: 'underwear', subcategory: 'boxer briefs',
    color: 'Black', size: 'M', brand: 'Calvin Klein',
    imageUrl: uc('mYVpc'), imageAlt: 'Navy shorts/trunks',
    lastCleaned: '2026-02-14', status: 'stored', addedDate: '2026-01-15',
    condition: 'like-new', conditionScore: 96, inspectedDate: '2026-02-14',
    defects: [],
  },
  {
    id: 'item-039', name: 'Navy Trunks (3pk)', category: 'underwear', subcategory: 'trunks',
    color: 'Navy', size: 'M', brand: 'Tommy John',
    imageUrl: uc('kPF4c'), imageAlt: 'Gray shorts/trunks pack',
    lastCleaned: '2026-02-10', status: 'stored', addedDate: '2026-01-18',
    condition: 'good', conditionScore: 88, inspectedDate: '2026-02-10',
    defects: [
      { location: 'Waistband elastic', description: 'Slight stretch in one trunk waistband', severity: 'minor' },
    ],
  },
  {
    id: 'item-040', name: 'White V-Neck Undershirts (5pk)', category: 'underwear', subcategory: 'undershirt',
    color: 'White', size: 'M', brand: 'Hanes',
    imageUrl: uc('Xur2Y'), imageAlt: 'White v-neck undershirts pack',
    lastCleaned: '2026-02-12', status: 'stored', addedDate: '2026-01-20',
    condition: 'good', conditionScore: 84, inspectedDate: '2026-02-12',
    defects: [
      { location: 'Neck collar', description: 'Mild collar yellowing on two of five shirts', severity: 'minor' },
    ],
  },
];
