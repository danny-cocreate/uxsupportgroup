#!/usr/bin/env node

/**
 * Simple script to sync events from Google Sheets to the database
 * Run with: node sync-events.js
 */

const SUPABASE_URL = 'https://hxsykzhergwulxsayckj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4c3lremhlcmd3dWx4c2F5Y2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNjEyODYsImV4cCI6MjA3NTYzNzI4Nn0.ZQxfMKRlWTt5ZLRR_cQcQZE3LqpTDq6x8WBPmTKy0hM';

async function syncEvents() {
  console.log('🔄 Syncing events from Google Sheets...\n');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/sync-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({})
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to sync events');
    }

    console.log('✅ Success!');
    console.log(`📅 Synced ${data.events?.length || 0} events from Google Sheets\n`);
    
    if (data.events && data.events.length > 0) {
      console.log('Events synced:');
      data.events.forEach((event, i) => {
        console.log(`  ${i + 1}. ${event.title} - ${event.date}`);
      });
    }

  } catch (error) {
    console.error('❌ Error syncing events:', error.message);
    process.exit(1);
  }
}

syncEvents();


