import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updatePrompt41() {
  const client = await pool.connect();
  try {
    const id = '41';
    
    // Updated content from user
    const content = `Create an Ultra-realistic 8k portrait, standing against a deep red background. She has sharp facial features, messy styled dark hair, and a confident, slightly intense expression. She is wearing a black suits jacket over a white shirt with the collar slightly open paired with a net red stripped tie]- Unlimited Free :Dramatic red and black lighting highlights the contour of her face, jawline, and neck creating a cinematic powerful and moody atmosphere. Please do not alter facial features and leave head positioning as is.`;
    
    // Translated content (Chinese)
    const chineseContent = `创建一幅超写实的8k人像，站在深红色背景前。她有着锐利的面部特征，凌乱的深色发型，表情自信且略带强烈感。她身穿一件黑色西装外套，里面是一件领口微开的白衬衫，搭配一条网红条纹领带。戏剧性的红黑光线突出了她的脸部轮廓、下颌线和颈部，营造出一种电影般的强大而情绪化的氛围。请不要改变面部特征，保持头部姿势不变。`;
    
    // New Titles & Descriptions
    const titleEn = "Cinematic Red & Black Portrait";
    const titleZh = "红黑光影电影感人像";
    
    const descriptionEn = "An ultra-realistic, moody portrait with dramatic red and black lighting, featuring a confident woman in a suit.";
    const descriptionZh = "一张超写实的情绪人像，采用戏剧性的红黑光影，描绘一位穿着西装、自信且略带强烈感的女性。";
    
    const category = "PHOTOGRAPHY"; // Still photography
    const tags = JSON.stringify(["portrait", "cinematic", "lighting", "red-background", "photorealistic", "moody"]);

    console.log(`Updating Prompt ID ${id}...`);
    
    await client.query(
      `UPDATE prompts SET 
        title_zh = $1, title_en = $2, 
        description_zh = $3, description_en = $4,
        content = $5, chinese_content = $6,
        category = $7, tags = $8
       WHERE id = $9`,
      [titleZh, titleEn, descriptionZh, descriptionEn, content, chineseContent, category, tags, id]
    );

    console.log('Update successful!');

  } catch (err) {
    console.error('Error updating prompt:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

updatePrompt41();
