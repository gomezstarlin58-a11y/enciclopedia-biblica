export function formatearNumero(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'; // Convierte 8500 en 8.5k
  }
  return num.toString();
}