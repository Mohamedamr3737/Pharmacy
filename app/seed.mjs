import { createClient } from '@supabase/supabase-js'


var NEXT_PUBLIC_SUPABASE_URL='https://bhflounyosmifleaixuo.supabase.co'
var NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmxvdW55b3NtaWZsZWFpeHVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzU5Mjc3OCwiZXhwIjoyMDU5MTY4Nzc4fQ.YuH5zqmqhWdHR_-GTDjdEST72hW0YNeLxeAhk9eHjvQ'
            
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)


const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@meditrack.com',
  password: 'StrongPassword123',
  email_confirm: true, // ✅ Bypass email verification
  user_metadata: {
    role: 'admin'
  }
})

if (error) console.error(error)
else console.log('Admin user created:', data)
