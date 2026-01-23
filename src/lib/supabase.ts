import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oiyzxdrssxobsqjtlyjf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peXp4ZHJzc3hvYnNxanRseWpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5NTUxMSwiZXhwIjoyMDg0MDcxNTExfQ.DAu3egzVedYCLLIZNL3toSl72EyuEnMGjqWgslPsXq4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const TABLE_NAME = 'budget';
