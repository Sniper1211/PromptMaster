import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Define the Category Enum mapping (Value -> Key)
// We want to store KEYs (e.g., 'ART') in the DB, not Values (e.g., 'Art & Design')
const CategoryMap = {
  'All': 'ALL',
  'Coding': 'CODING',
  'Writing': 'WRITING',
  'Business': 'BUSINESS',
  'Photography': 'PHOTOGRAPHY',
  'Art & Design': 'ART',
  'Commercial Visuals': 'COMMERCIAL',
  'Productivity': 'PRODUCTIVITY',
  'Marketing': 'MARKETING',
  'Fun & Creative': 'FUN',
  'SEO': 'SEO',
  'Learning': 'LEARNING',
  // Handle potential lowercase/uppercase variants that might exist
  'ART & DESIGN': 'ART',
  'COMMERCIAL VISUALS': 'COMMERCIAL',
  'FUN & CREATIVE': 'FUN'
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function normalizeCategories() {
  const client = await pool.connect();
  try {
    console.log('Fetching all prompts...');
    const res = await client.query('SELECT id, category FROM prompts');
    const prompts = res.rows;

    let updateCount = 0;

    for (const p of prompts) {
      const originalCat = p.category;
      
      // 1. Try to find a mapping from Value -> Key
      // e.g., "Art & Design" -> "ART"
      let newCat = CategoryMap[originalCat];

      // 2. If not found, maybe it's already a valid Key?
      // e.g., "ART" is not in keys of CategoryMap (which are Values), but it IS a valid target.
      // Let's check if originalCat is already one of the target values (values of CategoryMap)
      const validKeys = Object.values(CategoryMap);
      if (!newCat && validKeys.includes(originalCat)) {
        // It's already correct (e.g. "CODING")
        continue; 
      }

      // 3. Fallback: UpperCase check
      if (!newCat) {
        // Check case-insensitive match against map keys
        const matchKey = Object.keys(CategoryMap).find(k => k.toUpperCase() === originalCat.toUpperCase());
        if (matchKey) {
          newCat = CategoryMap[matchKey];
        }
      }

      // 4. Fallback: If it's just a simple word like "Coding" or "CODING"
      if (!newCat) {
         // If the uppercased version is a valid target key
         if (validKeys.includes(originalCat.toUpperCase())) {
             newCat = originalCat.toUpperCase();
         }
      }

      // 5. Ultimate Fallback: Default to CODING if completely unrecognizable
      if (!newCat) {
        console.warn(`⚠️  Warning: Unknown category "${originalCat}" for ID ${p.id}. Defaulting to CODING.`);
        newCat = 'CODING';
      }

      if (newCat !== originalCat) {
        console.log(`Fixing ID ${p.id}: "${originalCat}" -> "${newCat}"`);
        await client.query('UPDATE prompts SET category = $1 WHERE id = $2', [newCat, p.id]);
        updateCount++;
      }
    }

    console.log(`\n✅ Migration complete. Updated ${updateCount} prompts.`);

  } catch (err) {
    console.error('Error normalizing categories:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

normalizeCategories();
