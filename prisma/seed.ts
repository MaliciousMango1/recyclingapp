import { PrismaClient, DisposalCategory } from "@prisma/client";

const prisma = new PrismaClient();

const materials = [
  { name: "Paper & Cardboard", description: "Paper products and cardboard packaging", iconName: "newspaper" },
  { name: "Plastics", description: "Plastic containers and packaging", iconName: "container" },
  { name: "Glass", description: "Glass bottles and jars", iconName: "wine" },
  { name: "Metals", description: "Metal cans and containers", iconName: "cylinder" },
  { name: "Electronics", description: "Electronic devices and components", iconName: "monitor" },
  { name: "Yard Waste", description: "Organic yard debris and trimmings", iconName: "leaf" },
  { name: "Household Chemicals", description: "Paints, cleaners, and chemical products", iconName: "flask-round" },
  { name: "Textiles", description: "Clothing, fabric, and textile products", iconName: "shirt" },
  { name: "Batteries", description: "All battery types", iconName: "battery-full" },
  { name: "Appliances", description: "Household appliances large and small", iconName: "refrigerator" },
];

interface ItemSeed {
  name: string;
  slug: string;
  aliases: string[];
  category: DisposalCategory;
  instructions: string;
  tips?: string;
  materialName: string;
  sourceUrl?: string;
}

const items: ItemSeed[] = [
  // Paper & Cardboard
  {
    name: "Cardboard",
    slug: "cardboard",
    aliases: ["boxes", "shipping boxes", "amazon boxes", "corrugated cardboard", "moving boxes"],
    category: DisposalCategory.RECYCLE,
    instructions: "Flatten all cardboard boxes and place in your recycling cart. Remove any packing materials like styrofoam or bubble wrap first.",
    tips: "If cardboard is wet or heavily soiled with food (like a greasy pizza box), put it in the landfill cart instead.",
    materialName: "Paper & Cardboard",
    sourceUrl: "https://www.accgov.com/7618/Recycling",
  },
  {
    name: "Pizza Box",
    slug: "pizza-box",
    aliases: ["pizza boxes", "pizza cardboard", "greasy pizza box"],
    category: DisposalCategory.LANDFILL,
    instructions: "Greasy pizza boxes cannot be recycled. Place in your landfill cart. If the top of the box is clean, you can tear it off and recycle that portion.",
    tips: "A common misconception — grease contaminates the recycling process for paper products.",
    materialName: "Paper & Cardboard",
  },
  {
    name: "Newspaper",
    slug: "newspaper",
    aliases: ["newspapers", "newsprint", "paper news"],
    category: DisposalCategory.RECYCLE,
    instructions: "Place newspapers in your recycling cart. No need to remove inserts or ads.",
    materialName: "Paper & Cardboard",
  },
  {
    name: "Magazines",
    slug: "magazines",
    aliases: ["magazine", "glossy paper", "catalogs", "catalogues", "junk mail"],
    category: DisposalCategory.RECYCLE,
    instructions: "Magazines, catalogs, and junk mail can all go in your recycling cart.",
    materialName: "Paper & Cardboard",
  },
  {
    name: "Shredded Paper",
    slug: "shredded-paper",
    aliases: ["paper shreddings", "shredded documents"],
    category: DisposalCategory.LANDFILL,
    instructions: "Shredded paper is too small to be sorted at the recycling facility. Place in your landfill cart in a bag.",
    tips: "Consider composting shredded paper instead — it makes great brown material for compost.",
    materialName: "Paper & Cardboard",
  },

  // Plastics
  {
    name: "Plastic Bottles",
    slug: "plastic-bottles",
    aliases: ["water bottles", "soda bottles", "plastic bottle", "PET bottles", "drink bottles"],
    category: DisposalCategory.RECYCLE,
    instructions: "Empty and rinse plastic bottles. Replace the cap and place in your recycling cart. ACC accepts rigid plastics #1-7.",
    tips: "No need to remove labels. Just make sure they're empty and rinsed.",
    materialName: "Plastics",
    sourceUrl: "https://www.accgov.com/7618/Recycling",
  },
  {
    name: "Plastic Bags",
    slug: "plastic-bags",
    aliases: ["grocery bags", "shopping bags", "plastic film", "produce bags", "ziplock bags"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Plastic bags are NOT accepted in ACC curbside recycling — they jam the sorting machinery. Return clean, dry bags to grocery store drop-off bins (Kroger, Publix, Walmart all have them).",
    tips: "This includes bread bags, produce bags, dry cleaning bags, and bubble wrap. Better yet, switch to reusable bags!",
    materialName: "Plastics",
  },
  {
    name: "Styrofoam",
    slug: "styrofoam",
    aliases: ["polystyrene", "foam", "foam containers", "foam cups", "packing peanuts", "EPS foam", "takeout containers"],
    category: DisposalCategory.LANDFILL,
    instructions: "Styrofoam (expanded polystyrene) is not recyclable in ACC. Place in your landfill cart.",
    tips: "Some shipping stores accept clean packing peanuts for reuse. Check with local UPS or FedEx stores.",
    materialName: "Plastics",
  },
  {
    name: "Plastic Containers",
    slug: "plastic-containers",
    aliases: ["tupperware", "yogurt cups", "plastic tubs", "butter tubs", "deli containers", "clamshell containers"],
    category: DisposalCategory.RECYCLE,
    instructions: "Rigid plastic containers #1-7 are accepted. Rinse and place in your recycling cart. Check the bottom of the container for the recycling number.",
    materialName: "Plastics",
  },

  // Glass
  {
    name: "Glass Bottles",
    slug: "glass-bottles",
    aliases: ["glass bottle", "beer bottles", "wine bottles", "liquor bottles", "glass jars"],
    category: DisposalCategory.RECYCLE,
    instructions: "Rinse glass bottles and jars and place in your recycling cart. All colors of glass are accepted.",
    tips: "Remove lids — metal lids can be recycled separately, plastic lids go in recycling too.",
    materialName: "Glass",
  },
  {
    name: "Broken Glass",
    slug: "broken-glass",
    aliases: ["shattered glass", "glass shards", "broken mirror", "broken window"],
    category: DisposalCategory.LANDFILL,
    instructions: "Wrap broken glass carefully in newspaper or cardboard and place in your landfill cart. Label it 'broken glass' for the safety of collection workers.",
    tips: "Mirrors and window glass are different types of glass than bottles and cannot be recycled.",
    materialName: "Glass",
  },

  // Metals
  {
    name: "Aluminum Cans",
    slug: "aluminum-cans",
    aliases: ["beer cans", "soda cans", "pop cans", "aluminum", "aluminium cans", "drink cans"],
    category: DisposalCategory.RECYCLE,
    instructions: "Rinse aluminum cans and place in your recycling cart. No need to crush them.",
    materialName: "Metals",
  },
  {
    name: "Tin Cans",
    slug: "tin-cans",
    aliases: ["steel cans", "food cans", "soup cans", "canned food cans", "metal cans"],
    category: DisposalCategory.RECYCLE,
    instructions: "Rinse tin/steel cans and place in your recycling cart. Labels can stay on.",
    tips: "You can put the lid inside the can and pinch the top to keep it contained.",
    materialName: "Metals",
  },
  {
    name: "Aluminum Foil",
    slug: "aluminum-foil",
    aliases: ["tin foil", "foil", "aluminum wrap"],
    category: DisposalCategory.RECYCLE,
    instructions: "Clean aluminum foil can be recycled. Ball it up to at least 2 inches in diameter so it doesn't fall through sorting screens.",
    tips: "If it's heavily soiled with food, it goes in the landfill cart.",
    materialName: "Metals",
  },
  {
    name: "Scrap Metal",
    slug: "scrap-metal",
    aliases: ["metal scraps", "old metal", "metal pieces", "iron", "steel"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Large scrap metal items are not accepted in curbside recycling. Take them to the ACC CHaRM facility at 1005 College Station Road.",
    materialName: "Metals",
  },

  // Electronics
  {
    name: "Old Computer",
    slug: "old-computer",
    aliases: ["desktop computer", "laptop", "old laptop", "PC", "computer tower", "monitor"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Electronics are accepted at the ACC CHaRM facility (1005 College Station Road). Do NOT place in curbside carts.",
    tips: "Wipe personal data before disposal. Consider donating working computers to local nonprofits.",
    materialName: "Electronics",
  },
  {
    name: "Cell Phone",
    slug: "cell-phone",
    aliases: ["smartphone", "old phone", "mobile phone", "iPhone", "Android phone", "tablet"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Take to the CHaRM facility or check with your carrier — many offer trade-in/recycling programs. Do NOT place in curbside carts.",
    tips: "Factory reset your device and remove SIM/SD cards before recycling.",
    materialName: "Electronics",
  },
  {
    name: "TV",
    slug: "tv",
    aliases: ["television", "flat screen", "old TV", "CRT", "monitor", "screen"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "TVs contain hazardous materials and must be taken to the CHaRM facility at 1005 College Station Road. Never place in curbside carts.",
    materialName: "Electronics",
  },

  // Yard Waste
  {
    name: "Grass Clippings",
    slug: "grass-clippings",
    aliases: ["lawn clippings", "cut grass", "mowed grass", "grass"],
    category: DisposalCategory.COMPOST,
    instructions: "Place grass clippings in your yard waste cart or leave them on the lawn as natural fertilizer (grasscycling).",
    tips: "Grasscycling returns nitrogen to your soil and reduces the need for fertilizer.",
    materialName: "Yard Waste",
  },
  {
    name: "Tree Branches",
    slug: "tree-branches",
    aliases: ["limbs", "sticks", "tree limbs", "branches", "brush", "tree trimmings"],
    category: DisposalCategory.COMPOST,
    instructions: "Bundle branches (under 4 feet long, 2 inches diameter) and place beside your yard waste cart. Larger limbs require a bulk pickup request.",
    tips: "Call ACC Solid Waste at 706-613-3512 to schedule bulk pickup for large tree debris.",
    materialName: "Yard Waste",
  },
  {
    name: "Leaves",
    slug: "leaves",
    aliases: ["fall leaves", "leaf", "dead leaves", "raked leaves"],
    category: DisposalCategory.COMPOST,
    instructions: "Place leaves in your yard waste cart. During fall leaf season, ACC offers additional leaf collection — bag leaves in paper yard waste bags and place at the curb.",
    materialName: "Yard Waste",
  },

  // Household Chemicals
  {
    name: "Paint",
    slug: "paint",
    aliases: ["latex paint", "oil paint", "house paint", "old paint", "paint cans", "spray paint"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "Take paint to the CHaRM facility at 1005 College Station Road. Latex paint can also be dried out (mix with cat litter) and placed in the landfill cart. Oil-based paint must go to CHaRM.",
    tips: "To dry latex paint: remove lid, mix in cat litter or sand, let solidify completely, then place in landfill cart with lid off.",
    materialName: "Household Chemicals",
  },
  {
    name: "Motor Oil",
    slug: "motor-oil",
    aliases: ["used oil", "car oil", "engine oil", "automotive oil"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "Take used motor oil to the CHaRM facility or many auto parts stores (AutoZone, O'Reilly) accept used oil for free. Never pour down drains or in the trash.",
    materialName: "Household Chemicals",
  },
  {
    name: "Cleaning Products",
    slug: "cleaning-products",
    aliases: ["cleaners", "household cleaners", "bleach", "chemical cleaners", "cleaning supplies", "ammonia"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "Take unused or expired cleaning products to the CHaRM facility. If a product is completely used up, rinse the container and recycle if it's plastic #1-7.",
    materialName: "Household Chemicals",
  },

  // Batteries
  {
    name: "AA/AAA Batteries",
    slug: "household-batteries",
    aliases: ["alkaline batteries", "AA batteries", "AAA batteries", "C batteries", "D batteries", "9 volt"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Single-use alkaline batteries can technically go in the landfill cart, but it's better to take them to the CHaRM facility or drop-off locations. Tape the terminals of 9-volt batteries before disposal.",
    materialName: "Batteries",
  },
  {
    name: "Rechargeable Batteries",
    slug: "rechargeable-batteries",
    aliases: ["lithium batteries", "lithium ion", "NiMH batteries", "li-ion", "laptop battery", "power tool battery"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "NEVER place rechargeable or lithium batteries in curbside carts — they cause fires in collection trucks. Take to CHaRM facility or retailers like Home Depot, Lowe's, or Best Buy.",
    tips: "Tape the terminals with electrical tape before transport to prevent short circuits.",
    materialName: "Batteries",
  },
  {
    name: "Car Battery",
    slug: "car-battery",
    aliases: ["auto battery", "vehicle battery", "lead acid battery"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "Take to CHaRM facility, AutoZone, O'Reilly, or any auto parts store. Most offer a core charge refund. Never place in curbside carts.",
    materialName: "Batteries",
  },

  // Textiles
  {
    name: "Clothing",
    slug: "clothing",
    aliases: ["clothes", "old clothes", "used clothing", "shirts", "pants", "jackets", "shoes"],
    category: DisposalCategory.REUSE,
    instructions: "Donate wearable clothing to local thrift stores (Goodwill, Habitat ReStore, Salvation Army) or textile recycling bins around Athens. Clothing in poor condition can go to textile recycling.",
    tips: "Even stained or torn clothing can be recycled into industrial rags or insulation. Don't throw textiles in the landfill!",
    materialName: "Textiles",
  },

  // Appliances
  {
    name: "Refrigerator",
    slug: "refrigerator",
    aliases: ["fridge", "freezer", "old fridge", "mini fridge"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Schedule a bulk pickup with ACC Solid Waste at 706-613-3512. Refrigerators contain refrigerants that must be properly handled. Do not leave at curb without scheduling.",
    materialName: "Appliances",
  },
  {
    name: "Mattress",
    slug: "mattress",
    aliases: ["bed mattress", "old mattress", "box spring", "bed"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Schedule a bulk pickup with ACC Solid Waste at 706-613-3512. Some charities accept mattresses in good condition.",
    materialName: "Appliances",
  },

  // Misc common items
  {
    name: "Cooking Oil",
    slug: "cooking-oil",
    aliases: ["grease", "frying oil", "used cooking oil", "vegetable oil", "bacon grease"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Small amounts can be solidified (freeze or mix with cat litter) and placed in the landfill cart. Larger quantities should go to the CHaRM facility. NEVER pour down the drain.",
    materialName: "Household Chemicals",
  },
  {
    name: "Prescription Medication",
    slug: "prescription-medication",
    aliases: ["old medicine", "expired medicine", "pills", "prescription drugs", "medications", "drugs"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Use a drug take-back location. ACC has permanent drop boxes at the Athens-Clarke County Police Department (3035 Lexington Rd). Do not flush medications.",
    tips: "National Drug Take-Back Day events happen twice a year for additional options.",
    materialName: "Household Chemicals",
  },
  {
    name: "Light Bulbs",
    slug: "light-bulbs",
    aliases: ["CFL bulbs", "fluorescent bulbs", "LED bulbs", "incandescent bulbs", "light bulb"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "CFL and fluorescent bulbs contain mercury — take to CHaRM facility or Home Depot/Lowe's drop-off. LED and incandescent bulbs can go in the landfill cart (wrap to prevent breakage).",
    materialName: "Electronics",
  },
  {
    name: "Tires",
    slug: "tires",
    aliases: ["old tires", "car tires", "used tires", "flat tire"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Take tires to the CHaRM facility (limit 4 per visit). Many tire shops also accept old tires for a small disposal fee. Never leave at the curb.",
    materialName: "Appliances",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create materials
  const materialMap = new Map<string, string>();
  for (const mat of materials) {
    const created = await prisma.material.upsert({
      where: { name: mat.name },
      update: mat,
      create: mat,
    });
    materialMap.set(mat.name, created.id);
  }
  console.log(`✅ Created ${materials.length} materials`);

  // Create items
  for (const item of items) {
    const materialId = materialMap.get(item.materialName);
    await prisma.item.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        aliases: item.aliases,
        category: item.category,
        instructions: item.instructions,
        tips: item.tips ?? null,
        materialId: materialId ?? null,
        sourceUrl: item.sourceUrl ?? null,
        isVerified: true,
        lastVerifiedAt: new Date(),
      },
      create: {
        name: item.name,
        slug: item.slug,
        aliases: item.aliases,
        category: item.category,
        instructions: item.instructions,
        tips: item.tips ?? null,
        materialId: materialId ?? null,
        sourceUrl: item.sourceUrl ?? null,
        isVerified: true,
        lastVerifiedAt: new Date(),
      },
    });
  }
  console.log(`✅ Created ${items.length} items`);

  // Seed site settings
  await prisma.siteSetting.upsert({
    where: { key: "showVerifiedDates" },
    update: {},
    create: { key: "showVerifiedDates", value: "true" },
  });
  console.log("✅ Created site settings");

  console.log("🎉 Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
