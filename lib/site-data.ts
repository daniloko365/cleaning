export const brand = {
  name: "Novaclean",
  descriptor: "Upholstery & textile care",
  region: "Orange County, California",
};

export type PriceItem = {
  id: string;
  label: string;
  shortLabel: string;
  price: number;
  unit?: string;
  scope: string;
  category: "upholstery" | "mattress" | "rug" | "carpet" | "addon" | "bundle";
};

export const prices: PriceItem[] = [
  {
    id: "loveseat",
    label: "Loveseat / 2-seat sofa",
    shortLabel: "Loveseat",
    price: 79,
    scope: "standard fabric, up to 2 seats",
    category: "upholstery",
  },
  {
    id: "sofa",
    label: "3-seat sofa",
    shortLabel: "3-seat sofa",
    price: 99,
    scope: "standard fabric, three seat cushions",
    category: "upholstery",
  },
  {
    id: "l-sectional",
    label: "L-shape sectional",
    shortLabel: "L sectional",
    price: 169,
    scope: "up to 5 seating sections",
    category: "upholstery",
  },
  {
    id: "u-sectional",
    label: "U-shape sectional",
    shortLabel: "U sectional",
    price: 219,
    scope: "up to 7 seating sections",
    category: "upholstery",
  },
  {
    id: "side-chair",
    label: "Accent chair / recliner",
    shortLabel: "Chair",
    price: 45,
    scope: "one standard chair",
    category: "upholstery",
  },
  {
    id: "dining-chair",
    label: "Dining chair",
    shortLabel: "Dining chair",
    price: 10,
    scope: "seat only; four-chair minimum or add-on",
    category: "upholstery",
  },
  {
    id: "mattress",
    label: "Mattress cleaning",
    shortLabel: "Mattress",
    price: 79,
    scope: "starting price, Twin to King; condition can change scope",
    category: "mattress",
  },
  {
    id: "rug",
    label: "Area rug cleaning",
    shortLabel: "Area rug",
    price: 59,
    scope: "starting price; final scope depends on size and material",
    category: "rug",
  },
  {
    id: "rug-sqft",
    label: "Area rug by square foot",
    shortLabel: "Rug / sq ft",
    price: 1.5,
    unit: "/ sq ft",
    scope: "eligible in-home rugs",
    category: "rug",
  },
  {
    id: "stain",
    label: "Targeted stain treatment",
    shortLabel: "Stain treatment",
    price: 39,
    scope: "per affected area; outcome not guaranteed",
    category: "addon",
  },
  {
    id: "pet",
    label: "Pet enzyme treatment",
    shortLabel: "Pet treatment",
    price: 40,
    scope: "surface contamination area",
    category: "addon",
  },
  {
    id: "protector",
    label: "Carpet protector",
    shortLabel: "Protector / room",
    price: 35,
    scope: "per eligible carpeted room; upholstery coverage requires review",
    category: "addon",
  },
  {
    id: "carpet-room",
    label: "Carpet — one room",
    shortLabel: "1 carpet room",
    price: 89,
    scope: "up to 200 sq ft",
    category: "carpet",
  },
  {
    id: "carpet-3",
    label: "Carpet — three rooms",
    shortLabel: "3 carpet rooms",
    price: 140,
    scope: "up to 600 sq ft total",
    category: "carpet",
  },
  {
    id: "carpet-home",
    label: "Carpet — whole home",
    shortLabel: "Whole home",
    price: 199,
    scope: "up to 1,500 cleanable sq ft",
    category: "carpet",
  },
  {
    id: "stairs",
    label: "Carpeted stairs",
    shortLabel: "Stair",
    price: 3,
    unit: "/ step",
    scope: "per standard stair, tread and riser definition confirmed",
    category: "carpet",
  },
  {
    id: "hallway",
    label: "Carpeted hallway",
    shortLabel: "Hallway",
    price: 25,
    scope: "one standard-length hallway",
    category: "carpet",
  },
  {
    id: "living-room-reset",
    label: "Living Room Pair",
    shortLabel: "Living Room Pair",
    price: 178,
    scope: "3-seat sofa + loveseat",
    category: "bundle",
  },
  {
    id: "sectional-pet",
    label: "Sectional Plus",
    shortLabel: "Sectional Plus",
    price: 214,
    scope: "L sectional + standard side chair",
    category: "bundle",
  },
  {
    id: "sleep-reset",
    label: "Sleep Reset for Two",
    shortLabel: "Sleep Reset for Two",
    price: 158,
    scope: "two standard mattresses",
    category: "bundle",
  },
  {
    id: "move-reset",
    label: "Pet Sofa Rescue",
    shortLabel: "Pet Sofa Rescue",
    price: 139,
    scope: "3-seat sofa + surface pet treatment",
    category: "bundle",
  },
  {
    id: "whole-home",
    label: "Move-in Textile Starter",
    shortLabel: "Move-in Starter",
    price: 239,
    scope: "3 carpet rooms + 3-seat sofa",
    category: "bundle",
  },
];

export const minimums = {
  core: 0,
  extended: 150,
};

export const servicePages = [
  {
    slug: "sofa-couch-cleaning",
    name: "Sofa & couch cleaning",
    kicker: "The everyday reset",
    priceId: "sofa",
    image: "/media/final/sofa-service.webp",
    problem: "body oils, everyday soil, food spots and dull-looking fabric",
    outcome: "a visibly refreshed sofa with fabric-specific aftercare",
    method:
      "Fiber check → dry soil removal → targeted pre-treatment → controlled extraction → groom and dry guidance.",
  },
  {
    slug: "sectional-cleaning",
    name: "Sectional cleaning",
    kicker: "No ambiguous per-seat math",
    priceId: "l-sectional",
    image: "/media/final/sectional-service.webp",
    problem: "high-use sections, cushion edges and uneven wear",
    outcome: "consistent cleaning across the full sectional",
    method:
      "We count seating sections from photos, confirm construction, then lock the scope before arrival.",
  },
  {
    slug: "mattress-cleaning",
    name: "Mattress cleaning",
    kicker: "A cleaner sleep surface",
    priceId: "mattress",
    image: "/media/final/mattress-home.webp",
    problem: "surface soil, sweat marks and routine refresh needs",
    outcome: "a refreshed surface and clear dry-time guidance",
    method:
      "Label check → HEPA-style dry extraction → compatible spot care → controlled low-moisture cleaning.",
  },
  {
    slug: "chair-recliner-ottoman-cleaning",
    name: "Chair, recliner & ottoman cleaning",
    kicker: "Small pieces, same care",
    priceId: "side-chair",
    image: "/media/final/chair-service.webp",
    problem: "arm-rest buildup, head-rest oils and spotty seats",
    outcome: "an even, refreshed finish",
    method:
      "Construction and code check → detail vacuum → controlled cleaning by panel.",
  },
  {
    slug: "pet-stain-odor-removal",
    name: "Pet stain & odor treatment",
    kicker: "Diagnose before deodorizing",
    priceId: "pet",
    image: "/media/final/pet-safe.webp",
    problem:
      "surface incidents, recurring odor or suspected deep contamination",
    outcome: "the right treatment level with honest limits",
    method:
      "Visual and contamination-level check → compatible enzyme dwell → extraction → reassessment.",
  },
  {
    slug: "area-rug-cleaning",
    name: "Area rug cleaning",
    kicker: "Material first",
    priceId: "rug",
    image: "/media/final/rug-service.webp",
    problem: "tracked-in soil, spots and pet use",
    outcome: "safe in-home care or a specialist referral",
    method:
      "Fiber, backing and dye-stability checks determine whether in-home cleaning is appropriate.",
  },
  {
    slug: "carpet-cleaning",
    name: "Carpet cleaning",
    kicker: "Rooms priced clearly",
    priceId: "carpet-room",
    image: "/media/final/carpet-service.webp",
    problem: "traffic lanes, routine soil and move-related refresh",
    outcome: "cleaner traffic areas with simple room definitions",
    method:
      "Room measurement → dry soil removal → pre-spray → agitation as needed → extraction.",
  },
  {
    slug: "stain-removal",
    name: "Targeted stain treatment",
    kicker: "Evidence, not promises",
    priceId: "stain",
    image: "/media/final/stain-service.webp",
    problem: "isolated food, beverage, body oil or unknown spots",
    outcome: "best-safe improvement without fabric damage",
    method:
      "Identify likely stain family → fiber-safe chemistry → controlled dwell → extraction → document remaining change.",
  },
  {
    slug: "fabric-protection",
    name: "Fabric protection",
    kicker: "More reaction time",
    priceId: "protector",
    image: "/media/final/protection-service.webp",
    problem: "frequent spills and high-use seating",
    outcome: "added repellency after cleaning",
    method:
      "Apply compatible protector evenly to clean, dry-enough fabric and explain cure time.",
  },
  {
    slug: "move-in-move-out",
    name: "Move-in / move-out textile reset",
    kicker: "One visit, fewer loose ends",
    priceId: "whole-home",
    image: "/media/final/move-service.webp",
    problem: "carpets and furnishings that need a handoff-ready reset",
    outcome: "a documented multi-surface service plan",
    method:
      "Photo inventory → access and parking check → prioritized scope → service record for handoff.",
  },
] as const;

export const cities = [
  "irvine",
  "costa-mesa",
  "newport-beach",
  "huntington-beach",
  "santa-ana",
  "orange",
  "anaheim",
  "tustin",
  "mission-viejo",
  "lake-forest",
  "laguna-niguel",
  "aliso-viejo",
  "dana-point",
  "san-clemente",
  "fullerton",
  "yorba-linda",
  "garden-grove",
  "westminster",
  "fountain-valley",
  "seal-beach",
] as const;

export const cityName = (slug: string) =>
  slug
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

export const guides = [
  {
    slug: "how-much-does-sofa-cleaning-cost-orange-county",
    title: "How much does sofa cleaning cost in Orange County?",
    dek: "The item, construction, material, condition and access details that actually move the price.",
  },
  {
    slug: "how-long-does-a-sofa-take-to-dry",
    title: "How long does a sofa take to dry?",
    dek: "Why humidity, airflow, cushion construction and method matter more than one universal number.",
  },
  {
    slug: "pet-odor-enzyme-vs-deodorizer",
    title: "Pet odor: enzyme treatment vs deodorizer",
    dek: "Masking fragrance and treating an organic source are not the same service.",
  },
  {
    slug: "upholstery-cleaning-codes-w-s-ws-x",
    title: "Upholstery codes W, S, WS and X",
    dek: "Where to find the tag, what the letters mean and why the code is only the start of testing.",
  },
  {
    slug: "can-this-stain-be-removed",
    title: "Can this stain be removed?",
    dek: "A practical framework for age, chemistry, fiber type and permanent color change.",
  },
  {
    slug: "mattress-cleaning-cost",
    title: "Mattress cleaning cost: what is included",
    dek: "Surface, side count, size, stain work and realistic hygiene expectations.",
  },
  {
    slug: "prepare-for-upholstery-cleaning",
    title: "How to prepare for upholstery cleaning",
    dek: "A calm ten-minute checklist for access, loose items, pets and parking.",
  },
  {
    slug: "how-often-clean-sofa-with-pets",
    title: "How often should you clean a sofa with pets?",
    dek: "A schedule based on use, shedding, odor and household sensitivity—not a scare tactic.",
  },
  {
    slug: "steam-vs-low-moisture-upholstery",
    title: "Extraction vs low-moisture upholstery cleaning",
    dek: "How technicians choose a method around fabric, backing, soil and drying constraints.",
  },
  {
    slug: "move-out-cleaning-checklist",
    title: "Move-out textile cleaning checklist",
    dek: "What to photograph, what to schedule first and what to keep for the handoff record.",
  },
] as const;

export const faq = [
  [
    "Will the price change at the door?",
    "Not when the photos and answers match the item. If hidden conditions change the safe scope, we pause, explain the option and ask for approval before doing extra work.",
  ],
  [
    "How long will the fabric take to dry?",
    "Most common upholstery is touch-dry in several hours, but fiber, cushion fill, humidity and airflow can extend that. Your confirmation includes item-specific guidance.",
  ],
  [
    "Can every stain or odor be removed?",
    "No ethical cleaner can promise that. We identify the likely source, choose the safest treatment and document improvement and any limitation.",
  ],
  [
    "Is the process safe around children and pets?",
    "We choose products and dwell/rinse steps by fabric and soil. Keep children and pets off damp textiles until the technician’s stated dry time.",
  ],
  [
    "Do I need to move furniture?",
    "Remove small objects and access blockers. We confirm any large-item movement in the quote so there are no visit-day surprises.",
  ],
  [
    "What is the minimum order?",
    `Sofas, sectionals and mattresses have no visit minimum in the core launch zone. Dining chairs start at four; stain, protector, stairs and hallways are add-ons. Extended-zone visits start at $${minimums.extended}, shown after ZIP.`,
  ],
  [
    "What if I am not satisfied?",
    "Contact us within 7 days with photos. If the concern falls within the agreed scope and can be safely improved, the first re-clean visit is included under the service guarantee.",
  ],
  [
    "Do you clean leather, velvet or code X fabric?",
    "Those materials require item-specific review. We may approve a limited method or refer the piece rather than risk damage.",
  ],
] as const;

export const nav = [
  ["Services", "/services"],
  ["Pricing", "/pricing"],
  ["Results", "/results"],
  ["Service area", "/service-area"],
  ["How it works", "/how-it-works"],
  ["About", "/about"],
] as const;

export const quoteItemIds = [
  "loveseat",
  "sofa",
  "l-sectional",
  "u-sectional",
  "side-chair",
  "dining-chair",
  "mattress",
  "rug",
  "carpet-room",
  "carpet-3",
  "protector",
  "living-room-reset",
  "sectional-pet",
  "sleep-reset",
  "move-reset",
  "whole-home",
] as const;

const extendedZips = new Set([
  "90620",
  "90621",
  "90623",
  "90630",
  "90631",
  "90680",
  "90720",
  "90740",
  "90742",
  "90743",
  "92629",
  "92630",
  "92637",
  "92651",
  "92672",
  "92673",
  "92674",
  "92675",
  "92676",
  "92677",
  "92678",
  "92679",
  "92688",
  "92690",
  "92691",
  "92692",
  "92693",
  "92694",
  "92801",
  "92802",
  "92803",
  "92804",
  "92805",
  "92806",
  "92807",
  "92808",
  "92809",
  "92821",
  "92823",
  "92831",
  "92832",
  "92833",
  "92835",
  "92861",
  "92865",
  "92866",
  "92867",
  "92870",
  "92871",
]);
const coreZips = new Set([
  "92602",
  "92603",
  "92604",
  "92606",
  "92610",
  "92612",
  "92614",
  "92617",
  "92618",
  "92620",
  "92624",
  "92625",
  "92626",
  "92627",
  "92646",
  "92647",
  "92648",
  "92649",
  "92653",
  "92655",
  "92656",
  "92657",
  "92660",
  "92661",
  "92662",
  "92663",
  "92683",
  "92701",
  "92703",
  "92704",
  "92705",
  "92706",
  "92707",
  "92708",
  "92840",
  "92841",
  "92843",
  "92844",
  "92845",
  "92868",
  "92869",
  "92886",
  "92887",
]);

export function serviceZone(zip: string): "core" | "extended" | "out" {
  if (extendedZips.has(zip)) return "extended";
  if (coreZips.has(zip)) return "core";
  return "out";
}

export function calculateEstimate(input: {
  zip: string;
  itemId: string;
  quantity: number;
  stain: boolean;
  pet: boolean;
  priceOverrides?: Record<string, number>;
  extendedMinimum?: number;
}) {
  const baseItem = prices.find(
    (candidate) =>
      candidate.id === input.itemId &&
      quoteItemIds.includes(candidate.id as (typeof quoteItemIds)[number]),
  );
  const zone = serviceZone(input.zip);
  if (!baseItem || zone === "out") return null;
  const item = {
    ...baseItem,
    price: input.priceOverrides?.[baseItem.id] ?? baseItem.price,
  };
  const quantity =
    item.id === "dining-chair"
      ? Math.min(24, Math.max(4, Math.trunc(input.quantity) || 4))
      : 1;
  const additions =
    (input.stain
      ? (input.priceOverrides?.stain ?? getPrice("stain").price)
      : 0) +
    (input.pet ? (input.priceOverrides?.pet ?? getPrice("pet").price) : 0);
  const minimum =
    zone === "core"
      ? minimums.core
      : (input.extendedMinimum ?? minimums.extended);
  return {
    item,
    quantity,
    zone,
    total: Math.max(item.price * quantity + additions, minimum),
  };
}

export function getPrice(id: string) {
  return prices.find((item) => item.id === id) ?? prices[1];
}

export function money(value: number) {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}
