import { Material } from '../types';

export function mapAiMaterialToId(aiMaterial: string, materials: Material[]): string {
  if (!aiMaterial) return materials[0]?.id || 'm-pcb';
  
  const lower = aiMaterial.toLowerCase();
  
  if (lower.includes('circuit') || lower.includes('pcb')) {
    const found = materials.find(m => m.id === 'm-pcb');
    if (found) return found.id;
  }
  if (lower.includes('copper')) {
    const found = materials.find(m => m.id === 'm-copper');
    if (found) return found.id;
  }
  if (lower.includes('battery')) {
    const found = materials.find(m => m.id === 'm-battery');
    if (found) return found.id;
  }
  if (lower.includes('smartphone') || lower.includes('phone') || lower.includes('laptop') || lower.includes('computer')) {
    const found = materials.find(m => m.id === 'm-mixed');
    if (found) return found.id;
  }
  if (lower.includes('monitor') || lower.includes('screen') || lower.includes('display') || lower.includes('tv')) {
    const found = materials.find(m => m.id === 'm-monitors');
    if (found) return found.id;
  }
  if (lower.includes('appliance') || lower.includes('cable') || lower.includes('wire')) {
    const found = materials.find(m => m.id === 'm-appliances');
    if (found) return found.id;
  }

  // Fallback to closest matching material category or first material
  return materials[0]?.id || 'm-pcb';
}
