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
    aliases: ["boxes", "shipping boxes", "amazon boxes", "corrugated cardboard", "moving boxes", "cereal boxes", "cardboard boxes", "delivery boxes", "packaging boxes", "cartons"],
    category: DisposalCategory.RECYCLE,
    instructions: "Flatten all cardboard boxes and place in your recycling cart. Remove any packing materials like styrofoam or bubble wrap first.",
    tips: "If cardboard is wet or heavily soiled with food (like a greasy pizza box), put it in the landfill cart instead.",
    materialName: "Paper & Cardboard",
    sourceUrl: "https://www.accgov.com/9496/Recycle-Right-Athens",
  },
  {
    name: "Pizza Box",
    slug: "pizza-box",
    aliases: ["pizza boxes", "pizza cardboard", "greasy pizza box", "dominos box", "pizza container"],
    category: DisposalCategory.RECYCLE,
    instructions: "Clean pizza boxes are accepted in ACC recycling. Remove any food scraps (cheese, crusts, sauce, peppers) first. If the bottom is greasy but the top is clean, tear it in half and recycle the clean portion.",
    tips: "Greasy portions can be composted at ACC's food scraps drop-off locations (CHaRM, 725 Hancock Industrial Way, and others — available 24/7).",
    materialName: "Paper & Cardboard",
    sourceUrl: "https://www.accgov.com/Faq.aspx?QID=718",
  },
  {
    name: "Newspaper",
    slug: "newspaper",
    aliases: ["newspapers", "newsprint", "paper news", "daily paper", "sunday paper"],
    category: DisposalCategory.RECYCLE,
    instructions: "Place newspapers in your recycling cart. No need to remove inserts or ads.",
    materialName: "Paper & Cardboard",
  },
  {
    name: "Magazines",
    slug: "magazines",
    aliases: ["magazine", "glossy paper", "catalogs", "catalogues", "junk mail", "office paper", "printer paper", "copy paper", "mail", "flyers", "pamphlets", "paperback books", "paper bags", "envelopes"],
    category: DisposalCategory.RECYCLE,
    instructions: "Magazines, catalogs, and junk mail can all go in your recycling cart.",
    materialName: "Paper & Cardboard",
  },
  {
    name: "Shredded Paper",
    slug: "shredded-paper",
    aliases: ["paper shreddings", "shredded documents", "shredded mail", "cross cut paper", "confidential documents", "document shredding"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Shredded paper cannot go in curbside recycling — it's too small for the sorting equipment. Drop off shredded paper in a clear plastic bag or box at the ACC Recycling Facility (699 Hancock Industrial Way) or other designated dumpsters. Documents for secure shredding can go to CHaRM ($2/bankers box).",
    tips: "Shredded paper also makes great brown material for backyard composting.",
    materialName: "Paper & Cardboard",
    sourceUrl: "https://www.accgov.com/faq.aspx?TID=81",
  },

  // Plastics
  {
    name: "Plastic Bottles",
    slug: "plastic-bottles",
    aliases: ["water bottles", "soda bottles", "plastic bottle", "PET bottles", "drink bottles", "juice bottles", "milk jugs", "detergent bottles", "shampoo bottles", "plastic jugs"],
    category: DisposalCategory.RECYCLE,
    instructions: "Empty and rinse plastic bottles. Keep the cap on and place in your recycling cart. ACC accepts clean, empty, rigid plastic containers labeled #1-7 (no Styrofoam or plastic bags).",
    tips: "No need to remove labels. Just make sure they're empty and rinsed.",
    materialName: "Plastics",
    sourceUrl: "https://www.accgov.com/9496/Recycle-Right-Athens",
  },
  {
    name: "Plastic Bags",
    slug: "plastic-bags",
    aliases: ["grocery bags", "shopping bags", "plastic film", "produce bags", "ziplock bags", "trash bags", "shrink wrap", "bubble wrap", "dry cleaning bags", "bread bags", "plastic wrap", "stretch wrap", "film plastic", "sandwich bags"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Plastic bags are NOT accepted in ACC curbside recycling — they tangle and damage sorting machinery. Take to the CHaRM facility (1005 College Ave) or return clean, dry bags to grocery store drop-off bins (Kroger, Publix, Walmart, Target, Ingles, EarthFare, Daily Co-Op).",
    tips: "This includes bread bags, produce bags, dry cleaning bags, bubble wrap, and film pillows. Pop the air out of bubble wrap before drop-off. Better yet, switch to reusable bags!",
    materialName: "Plastics",
    sourceUrl: "https://www.accgov.com/faq.aspx?TID=81",
  },
  {
    name: "Styrofoam",
    slug: "styrofoam",
    aliases: ["polystyrene", "foam", "foam containers", "foam cups", "packing peanuts", "EPS foam", "takeout containers", "styrofoam cooler", "foam egg carton", "foam meat tray", "packaging foam", "foam plates", "#6 plastic"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Styrofoam is NOT accepted in ACC curbside recycling. Take it to the CHaRM facility (1005 College Ave) for separate recycling. Egg cartons, meat trays, and block styrofoam can also be dropped off at Publix.",
    tips: "If no drop-off is convenient, Styrofoam can go in the landfill cart as a last resort. Some shipping stores accept clean packing peanuts for reuse.",
    materialName: "Plastics",
    sourceUrl: "https://www.accgov.com/FAQ.aspx?QID=293",
  },
  {
    name: "Plastic Containers",
    slug: "plastic-containers",
    aliases: ["tupperware", "yogurt cups", "plastic tubs", "butter tubs", "deli containers", "clamshell containers", "plastic cups", "food trays", "berry containers", "plastic buckets", "plastic bins", "cottage cheese container", "sour cream tub", "hummus container", "to-go containers"],
    category: DisposalCategory.RECYCLE,
    instructions: "Clean, empty, rigid plastic containers #1-7 are accepted — cups, bottles, jugs, food trays, tubs, toys, buckets, and bins. Keep lids on. Rinse and place in your recycling cart.",
    tips: "NOT accepted: stretchy or flexible plastics (bags, wraps, chip bags, snack wrappers), Styrofoam, or disposable plates and cutlery.",
    materialName: "Plastics",
    sourceUrl: "https://www.accgov.com/9496/Recycle-Right-Athens",
  },

  // Glass
  {
    name: "Glass Bottles",
    slug: "glass-bottles",
    aliases: ["glass bottle", "beer bottles", "wine bottles", "liquor bottles", "glass jars", "mason jars", "pickle jars", "sauce jars", "salsa jar", "jam jars", "glass containers"],
    category: DisposalCategory.RECYCLE,
    instructions: "Rinse glass bottles and jars and place in your recycling cart. All colors of glass are accepted. Remove all lids before recycling.",
    tips: "Metal lids on glass: remove and recycle the lid separately with metals. Plastic lids on glass: remove and dispose of in the landfill cart (they are not recyclable). No windows, mirrors, broken glass, or drinking glasses.",
    materialName: "Glass",
    sourceUrl: "https://www.accgov.com/Faq.aspx?QID=603",
  },
  {
    name: "Broken Glass",
    slug: "broken-glass",
    aliases: ["shattered glass", "glass shards", "broken mirror", "broken window", "drinking glasses", "wine glass", "pint glass", "pyrex", "glass cups", "window pane", "picture frame glass"],
    category: DisposalCategory.LANDFILL,
    instructions: "Wrap broken glass carefully in newspaper or cardboard and place in your landfill cart. Label it 'broken glass' for the safety of collection workers. Flat glass (windows, shower doors, table glass, windshields) can be taken to CHaRM for separate recycling.",
    tips: "Mirrors, window glass, drinking glasses, and Pyrex are different types of glass than bottles/jars and cannot go in curbside recycling. CHaRM recycles flat glass separately — don't throw it in the landfill if you can drop it off.",
    materialName: "Glass",
    sourceUrl: "https://www.accgov.com/6828/Items-Accepted",
  },

  // Metals
  {
    name: "Aluminum Cans",
    slug: "aluminum-cans",
    aliases: ["beer cans", "soda cans", "pop cans", "aluminum", "aluminium cans", "drink cans", "seltzer cans", "sparkling water cans", "energy drink cans", "coke cans"],
    category: DisposalCategory.RECYCLE,
    instructions: "Rinse aluminum cans and place in your recycling cart. No need to crush them. Remove plastic lids if present.",
    tips: "Curbside recycling accepts cans and foil only — no scrap metal, tools, electronics, appliances, aerosol cans, or propane tanks.",
    materialName: "Metals",
    sourceUrl: "https://www.accgov.com/9496/Recycle-Right-Athens",
  },
  {
    name: "Tin Cans",
    slug: "tin-cans",
    aliases: ["steel cans", "food cans", "soup cans", "canned food cans", "metal cans", "tuna cans", "pet food cans", "cat food cans", "dog food cans", "vegetable cans", "bean cans"],
    category: DisposalCategory.RECYCLE,
    instructions: "Rinse tin/steel cans and place in your recycling cart. Labels can stay on.",
    tips: "You can put the lid inside the can and pinch the top to keep it contained.",
    materialName: "Metals",
  },
  {
    name: "Aluminum Foil",
    slug: "aluminum-foil",
    aliases: ["tin foil", "foil", "aluminum wrap", "aluminum trays", "pie tins", "foil trays", "foil pans", "baking foil", "aluminum pie pan"],
    category: DisposalCategory.RECYCLE,
    instructions: "Clean aluminum foil and trays can be recycled. Ball up foil and place in your recycling cart with metals.",
    tips: "If it's heavily soiled with food, it goes in the landfill cart. Only clean foil is recyclable.",
    materialName: "Metals",
    sourceUrl: "https://www.accgov.com/9496/Recycle-Right-Athens",
  },
  {
    name: "Scrap Metal",
    slug: "scrap-metal",
    aliases: ["metal scraps", "old metal", "metal pieces", "iron", "steel", "wire hangers", "coat hangers", "pots and pans", "aerosol cans", "propane tanks", "metal furniture", "metal shelving"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Large scrap metal items are not accepted in curbside recycling. Take household scrap steel and aluminum to the CHaRM facility (1005 College Ave). First 20 lbs are free for residents.",
    tips: "CHaRM accepts bed frames, wire shelving, screws, nails, keys, house screens, gutters, and more. Separate steel from aluminum. Larger quantities are charged by the pound.",
    materialName: "Metals",
    sourceUrl: "https://www.accgov.com/6828/Items-Accepted",
  },

  // Electronics
  {
    name: "Old Computer",
    slug: "old-computer",
    aliases: ["desktop computer", "laptop", "old laptop", "PC", "computer tower", "monitor", "keyboard", "mouse", "printer", "cables", "chargers", "hard drive", "e-waste", "computer parts"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Electronics are accepted at the ACC CHaRM facility (1005 College Ave). Do NOT place in curbside carts. Hard drives can be destroyed at CHaRM for $10 each, or donated to FREE IT Athens for secure wiping and reuse.",
    tips: "Wipe personal data before disposal. Consider donating working computers to FREE IT Athens or other local nonprofits for refurbishment.",
    materialName: "Electronics",
    sourceUrl: "https://www.accgov.com/6828/Items-Accepted",
  },
  {
    name: "Cell Phone",
    slug: "cell-phone",
    aliases: ["smartphone", "old phone", "mobile phone", "iPhone", "Android phone", "tablet", "iPad", "Apple Watch", "smart watch", "earbuds", "AirPods", "e-reader", "Kindle", "broken phone"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Take to the CHaRM facility or check with your carrier — many offer trade-in/recycling programs. Do NOT place in curbside carts.",
    tips: "Factory reset your device and remove SIM/SD cards before recycling.",
    materialName: "Electronics",
  },
  {
    name: "TV",
    slug: "tv",
    aliases: ["television", "flat screen", "old TV", "CRT", "screen", "plasma TV", "LCD TV", "gaming console", "DVD player", "Blu-ray player", "stereo", "speakers", "Roku"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "TVs contain hazardous materials and must be taken to the CHaRM facility at 1005 College Ave. Never place in curbside carts.",
    materialName: "Electronics",
  },

  // Yard Waste
  {
    name: "Grass Clippings",
    slug: "grass-clippings",
    aliases: ["lawn clippings", "cut grass", "mowed grass", "grass", "pine straw", "weeds", "yard trimmings", "lawn waste"],
    category: DisposalCategory.COMPOST,
    instructions: "Place grass clippings in paper lawn refuse bags at the curb for leaf and limb collection, or leave them on the lawn as natural fertilizer (grasscycling). No plastic bags accepted.",
    tips: "Grasscycling returns nitrogen to your soil and reduces the need for fertilizer. Paper lawn refuse bags are available at local retail stores.",
    materialName: "Yard Waste",
    sourceUrl: "https://www.accgov.com/leaflimb",
  },
  {
    name: "Tree Branches",
    slug: "tree-branches",
    aliases: ["limbs", "sticks", "tree limbs", "branches", "brush", "tree trimmings", "twigs", "hedge clippings", "shrub trimmings", "yard debris", "storm debris"],
    category: DisposalCategory.COMPOST,
    instructions: "Stack limbs, brush, and small branches at the curb for leaf and limb collection (every 4 weeks by zone). Limbs can be no more than 4 inches in diameter. Place material out by 8 AM on the Monday of your collection week.",
    tips: "Use paper lawn refuse bags for grass, leaves, and small brush — no plastic bags accepted. Check your zone schedule at accgov.com/leaflimb. For large tree debris, call ACC Solid Waste at 706-613-3501.",
    materialName: "Yard Waste",
    sourceUrl: "https://www.accgov.com/leaflimb",
  },
  {
    name: "Leaves",
    slug: "leaves",
    aliases: ["fall leaves", "leaf", "dead leaves", "raked leaves", "pine needles", "leaf bags", "dried leaves", "yard leaves"],
    category: DisposalCategory.COMPOST,
    instructions: "Bag leaves in paper lawn refuse bags and place at the curb for leaf and limb collection (every 4 weeks by zone). No plastic bags accepted. Place material out by 8 AM on the Monday of your collection week.",
    tips: "Check your zone schedule at accgov.com/leaflimb. Residents are allowed one load per rotation (25 paper bags or equivalent pile).",
    materialName: "Yard Waste",
    sourceUrl: "https://www.accgov.com/leaflimb",
  },

  // Household Chemicals
  {
    name: "Paint",
    slug: "paint",
    aliases: ["latex paint", "oil paint", "house paint", "old paint", "paint cans", "spray paint", "wood stain", "primer", "paint thinner", "turpentine", "varnish", "polyurethane", "leftover paint"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "Take paint to the CHaRM facility (1005 College Ave). There is a $3 facility fee per visit for ACC residents. Latex paint can also be dried out (mix with cat litter) and placed in the landfill cart. Oil-based paint must go to CHaRM.",
    tips: "To dry latex paint: remove lid, mix in cat litter or sand, let solidify completely, then place in landfill cart with lid off. CHaRM accepts check or major credit card only (no cash, no American Express).",
    materialName: "Household Chemicals",
    sourceUrl: "https://www.accgov.com/5894/Hard-to-Recycle-Materials-CHaRM",
  },
  {
    name: "Motor Oil",
    slug: "motor-oil",
    aliases: ["used oil", "car oil", "engine oil", "automotive oil", "transmission fluid", "brake fluid", "antifreeze", "coolant", "motor fluid"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "Take used motor oil to the CHaRM facility or many auto parts stores (AutoZone, O'Reilly) accept used oil for free. Never pour down drains or in the trash.",
    materialName: "Household Chemicals",
  },
  {
    name: "Cleaning Products",
    slug: "cleaning-products",
    aliases: ["cleaners", "household cleaners", "bleach", "chemical cleaners", "cleaning supplies", "ammonia", "pesticides", "insecticides", "weed killer", "herbicide", "pool chemicals", "solvents", "drain cleaner", "oven cleaner"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "Take unused or expired cleaning products to the CHaRM facility (1005 College Ave). All chemicals must be in their original containers. No industrial lab chemicals or containers 5 gallons or larger. If a product is completely used up, rinse the container and recycle if it's rigid plastic #1-7.",
    materialName: "Household Chemicals",
    sourceUrl: "https://www.accgov.com/6828/Items-Accepted",
  },

  // Batteries
  {
    name: "AA/AAA Batteries",
    slug: "household-batteries",
    aliases: ["alkaline batteries", "AA batteries", "AAA batteries", "C batteries", "D batteries", "9 volt", "single use batteries", "disposable batteries", "remote batteries", "flashlight batteries"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Drop off batteries at CHaRM (1005 College Ave), ACC Solid Waste (725 Hancock Industrial Way), ACC Landfill (5700 Lexington Rd), or Fire Stations #2, #8, and #9. Retailers like Lowe's, Batteries Plus, and Best Buy also accept them. Tape the terminals of 9-volt batteries before disposal.",
    tips: "Single-use alkaline batteries can go in the landfill cart if drop-off is not convenient, but recycling is strongly preferred.",
    materialName: "Batteries",
    sourceUrl: "https://www.accgov.com/1335/Batteries",
  },
  {
    name: "Rechargeable Batteries",
    slug: "rechargeable-batteries",
    aliases: ["lithium batteries", "lithium ion", "NiMH batteries", "li-ion", "laptop battery", "power tool battery", "phone battery", "e-bike battery", "scooter battery", "vape battery", "rechargeable", "battery pack", "portable charger", "power bank"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "NEVER place rechargeable or lithium batteries in curbside carts — they cause fires in collection trucks. Take to CHaRM facility or retailers like Home Depot, Lowe's, or Best Buy.",
    tips: "Tape the terminals with electrical tape before transport to prevent short circuits.",
    materialName: "Batteries",
  },
  {
    name: "Car Battery",
    slug: "car-battery",
    aliases: ["auto battery", "vehicle battery", "lead acid battery", "motorcycle battery", "lawn mower battery", "boat battery", "12 volt battery", "car batteries"],
    category: DisposalCategory.HAZARDOUS,
    instructions: "Take to CHaRM facility, AutoZone, O'Reilly, or any auto parts store. Most offer a core charge refund. Never place in curbside carts.",
    materialName: "Batteries",
  },

  // Textiles
  {
    name: "Clothing",
    slug: "clothing",
    aliases: ["clothes", "old clothes", "used clothing", "shirts", "pants", "jackets", "shoes", "boots", "sneakers", "coats", "dresses", "linens", "towels", "blankets", "curtains", "fabric", "bedding", "rags"],
    category: DisposalCategory.REUSE,
    instructions: "Donate wearable clothing to local thrift stores (Goodwill, Habitat ReStore, Salvation Army), America's Thrift Store drop-off bins around Athens, or bring to the CHaRM facility (1005 College Ave). Clothing in poor condition can go to textile recycling at these same locations.",
    tips: "Even stained or torn clothing can be recycled into industrial rags or insulation — about 85% of clothing in the U.S. ends up in landfills, so please donate or recycle instead! CHaRM also accepts sheets, towels, drapes, and fabric scraps.",
    materialName: "Textiles",
    sourceUrl: "https://www.accgov.com/1343/Clothing-and-Shoes",
  },

  // Appliances
  {
    name: "Refrigerator",
    slug: "refrigerator",
    aliases: ["fridge", "freezer", "old fridge", "mini fridge", "deep freezer", "wine cooler", "beverage cooler", "chest freezer", "washer", "dryer", "stove", "oven", "dishwasher", "water heater", "dehumidifier", "humidifier"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Large appliances can be dropped off at the CHaRM facility (1005 College Ave) or you can schedule a bulk pickup with ACC Solid Waste at 706-613-3501 ext. 0. CHaRM accepts refrigerators, washers, dryers, stoves, ovens, water heaters, dehumidifiers, and more.",
    tips: "Refrigerators and AC units contain refrigerants that must be properly handled — never leave at the curb without scheduling or dropping off at CHaRM. Do not attempt to remove refrigerant yourself.",
    materialName: "Appliances",
    sourceUrl: "https://www.accgov.com/6828/Items-Accepted",
  },
  {
    name: "Mattress",
    slug: "mattress",
    aliases: ["bed mattress", "old mattress", "box spring", "bed", "futon", "crib mattress", "memory foam mattress", "air mattress", "mattress pad"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Drop off spring mattresses and box springs at the CHaRM facility (1005 College Ave) — $15 for twin/full, $18 for queen/king. Mattresses must be dry, not heavily soiled, and free of bed bugs. You can also schedule a bulk pickup with ACC Solid Waste at 706-613-3501 ext. 0.",
    tips: "CHaRM only accepts mattresses with springs — no memory foam, air mattresses, foam toppers, crib mattresses, or futons. Mattresses collected at CHaRM are sent to the Furniture Bank of Metro Atlanta for refurbishment and redistribution. Some local charities also accept mattresses in good condition.",
    materialName: "Appliances",
    sourceUrl: "https://www.accgov.com/6828/Items-Accepted",
  },

  // Misc common items
  {
    name: "Cooking Oil",
    slug: "cooking-oil",
    aliases: ["grease", "frying oil", "used cooking oil", "vegetable oil", "bacon grease", "canola oil", "olive oil", "peanut oil", "fryer oil", "lard", "cooking grease", "deep fryer oil"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Take used cooking grease to the CHaRM facility (1005 College Ave) — recycling grease is free for ACC residents (up to 5-gallon containers). Small amounts can be solidified (freeze or mix with cat litter) and placed in the landfill cart. NEVER pour down the drain.",
    materialName: "Household Chemicals",
    sourceUrl: "https://www.accgov.com/1314/Additional-Requirements",
  },
  {
    name: "Prescription Medication",
    slug: "prescription-medication",
    aliases: ["old medicine", "expired medicine", "pills", "prescription drugs", "medications", "drugs", "vitamins", "supplements", "over the counter medicine", "OTC medicine", "unused medicine", "medicine cabinet"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "Use a drug take-back location. ACC has permanent drop boxes at the Police East Precinct (3035 Lexington Rd) and West Precinct (Georgia Square Mall, 3700 Atlanta Hwy), available 8 AM–5 PM Mon–Fri. Walmart pharmacies on Atlanta Hwy and Epps Bridge Pkwy also accept medications. Do not flush medications.",
    tips: "Remove prescription labels before drop-off. Sharps and liquids are not accepted at police drop boxes. National Drug Take-Back Day events happen twice a year for additional options.",
    materialName: "Household Chemicals",
    sourceUrl: "https://www.accgov.com/6325/Medication-Disposal",
  },
  {
    name: "Light Bulbs",
    slug: "light-bulbs",
    aliases: ["CFL bulbs", "fluorescent bulbs", "LED bulbs", "incandescent bulbs", "light bulb", "fluorescent tubes", "tube lights", "halogen bulbs", "compact fluorescent", "lamp bulbs", "flood lights", "christmas lights"],
    category: DisposalCategory.SPECIAL_DROPOFF,
    instructions: "CFL and fluorescent bulbs contain mercury — take to CHaRM facility or Home Depot/Lowe's drop-off. LED and incandescent bulbs can go in the landfill cart (wrap to prevent breakage).",
    materialName: "Electronics",
    sourceUrl: "https://www.accgov.com/faq.aspx?TID=81",
  },
  {
    name: "Tires",
    slug: "tires",
    aliases: ["old tires", "car tires", "used tires", "flat tire", "truck tires", "bicycle tires", "lawn mower tires", "trailer tires", "tire disposal", "spare tire"],
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