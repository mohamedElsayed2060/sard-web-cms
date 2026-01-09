// src/app/page.jsx
import SceneHome from "@/components/Scene/SceneHome";
import { fetchJSON } from "@/lib/cms";

export const revalidate = 60;

export default async function HomePage() {
  const [scene, hotspotsRes] = await Promise.all([
    // لو الـ global مش موجود لسه → رجّع null
    fetchJSON("/api/globals/scene?depth=2").catch(() => null),
    // لو الـ collection مش موجودة لسه → رجّع null
    fetchJSON("/api/scene-hotspots?limit=100").catch(() => null),
  ]);

  const hotspots = hotspotsRes?.docs || [];

  return <SceneHome scene={scene} hotspots={hotspots} />;
}
