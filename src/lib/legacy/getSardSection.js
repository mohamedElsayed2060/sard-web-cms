export async function getSardSection() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/sard-section?depth=2`
  );
  if (!res.ok) throw new Error("Failed to fetch Sard Section");
  return res.json();
}
