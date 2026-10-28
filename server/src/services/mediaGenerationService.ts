/** Optional media providers plug in here. Text reconstruction is the safe default. */
export function mediaFallback(type: 'image' | 'cctv') {
  return type === 'image'
    ? { kind: 'placeholder', label: 'Fictional image evidence · text reconstruction', assetUrl: null }
    : { kind: 'transcript', label: 'CCTV text reconstruction · no video generated', assetUrl: null };
}
