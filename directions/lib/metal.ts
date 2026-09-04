import * as THREE from "three";

/** Albedo tint only — living gold is env + specular, never this as a flat fill. */
export const GOLD_TINT = 0xc4a574;
export const DEAD_TINT = 0x2a2a2a;

export function applyLiveMetal(mat: THREE.MeshStandardMaterial) {
  mat.color.setHex(GOLD_TINT);
  mat.metalness = 1;
  mat.roughness = 0.16;
  mat.envMapIntensity = 1.7;
  mat.emissive.setHex(0x000000);
  mat.emissiveIntensity = 0;
  mat.needsUpdate = true;
}

export function applyDeadMetal(mat: THREE.MeshStandardMaterial) {
  mat.color.setHex(DEAD_TINT);
  mat.metalness = 0.38;
  mat.roughness = 0.74;
  mat.envMapIntensity = 0.28;
  mat.emissive.setHex(0x000000);
  mat.emissiveIntensity = 0;
  mat.needsUpdate = true;
}

export function applyMetal(mat: THREE.MeshStandardMaterial, live: boolean) {
  if (live) applyLiveMetal(mat);
  else applyDeadMetal(mat);
}
