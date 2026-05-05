// Script untuk membuat akun demo di Supabase
// Jalankan: node setup-demo-accounts.mjs

const SUPABASE_URL = "https://ekgzrqxygukenlmnhbhc.supabase.co";
const SERVICE_ROLE_KEY = "SERVICE_ROLE_KEY_HERE"; // Ganti dengan service_role key dari Supabase

async function createUser(email, password, role, fullName) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "apikey": SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    }),
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`✅ Created: ${email} (${role})`);
  } else {
    console.log(`❌ Failed: ${email} →`, data.msg || data.message || JSON.stringify(data));
  }
}

async function main() {
  console.log("🚀 Creating demo accounts...\n");
  await createUser("user@ceamis.id", "user123456", "user", "Danu Zen");
  await createUser("admin@ceamis.id", "admin123456", "admin", "Admin CEAMIS");
  console.log("\n✅ Done! Anda sekarang bisa login dengan akun-akun di atas.");
}

main();
