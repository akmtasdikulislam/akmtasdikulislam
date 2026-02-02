// One-time script to upload author photo to Supabase
// Run this with: npx tsx scripts/upload-author-photo.ts

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadAuthorPhoto() {
  try {
    console.log('📸 Starting author photo upload...');

    // Read the image file
    const imagePath = resolve(__dirname, '../src/assets/author-photo.png');
    const imageBuffer = readFileSync(imagePath);
    
    const fileName = `author-avatar-${Date.now()}.png`;
    const filePath = `avatars/${fileName}`;

    console.log(`📤 Uploading to: ${filePath}`);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cms-uploads')
      .upload(filePath, imageBuffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    console.log('✅ Upload successful!');

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('cms-uploads')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    console.log(`🔗 Public URL: ${publicUrl}`);

    // Update author_profile table
    console.log('📝 Updating author_profile table...');
    
    const { error: updateError } = await supabase
      .from('author_profile')
      .update({ avatar_url: publicUrl })
      .limit(1);

    if (updateError) {
      throw updateError;
    }

    console.log('✅ Author profile updated successfully!');
    console.log('\n🎉 All done! Your author photo is now set.');
    console.log(`📷 Avatar URL: ${publicUrl}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadAuthorPhoto();
