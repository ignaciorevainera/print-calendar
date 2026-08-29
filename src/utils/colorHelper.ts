export function getContrastTextColor(hexColor: string): '#ffffff' | '#0f172a' {
  if (!hexColor) return '#ffffff';
  let cleanHex = hexColor.replace('#', '').trim();
  
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((char) => char + char).join('');
  }
  
  if (cleanHex.length !== 6) return '#ffffff';
  
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#0f172a' : '#ffffff';
}
