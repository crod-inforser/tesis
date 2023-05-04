// Retorna un entero aleatorio entre 0 y 1_000_000_000_000
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

// Genera una promesa que se resuelve
// después de un tiempo específico en milisegundos
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}