
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xokqssqdxhqjkixozxrh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva3Fzc3FkeGhxamtpeG96eHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDg5MTIsImV4cCI6MjA1NjgyNDkxMn0.2V97eYz5RlsKvGnxn7zGS-R3IPUH-jLL3ZlzAcRRXgM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
