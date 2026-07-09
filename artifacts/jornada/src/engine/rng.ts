export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export class Rng {
  private next: () => number;

  constructor(seed: string) {
    this.next = mulberry32(seedFromString(seed));
  }

  random(): number {
    return this.next();
  }

  range(min: number, max: number): number {
    return min + this.random() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  normal(mu: number, sigma: number): number {
    const u1 = Math.max(this.random(), 1e-9);
    const u2 = this.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mu + z * sigma;
  }

  clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
  }

  poisson(lambda: number): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= this.random();
    } while (p > L);
    return k - 1;
  }
}
