export function normaliseName(name: string) {
  return name
    .normalize('NFD') // Normalize accented characters
    .replace(/[^\p{L}\s]/gu, '') // Allow only letters (Unicode) and spaces
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
    .join(' ');
}
