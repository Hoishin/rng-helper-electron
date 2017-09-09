'use strict';

const DEFAULT_SEED = 4537;
const N = 624;
const M = 397;
const MATRIX_A = 0x9908B0DF;
const UPPER_MASK = 0x80000000;
const LOWER_MASK = 0x7FFFFFFF;

module.exports = class MersenneTwister {
  /**
   * Fork of Mersenne Twister that Final Fantasy XII uses.
   * @param {Boolean} tza - TZA uses newer version of MT
   */
  constructor(tza = false) {
    this.tza = tza;
    this.mt = [N];
    this.mti = N + 1;
    this.__initGenRand(DEFAULT_SEED);
  }

  /**
   * Generates next random number out of the Mersenne Twister
   * @return {Number} From 0 up to 4294967295
   */
  genRand() {
    let y;
    const mag01 = [0x0, MATRIX_A];
    if (this.mti >= N) {
      let kk;
      if (this.mti === N + 1) {
        this.__initGenRand(DEFAULT_SEED);
      }
      for (kk = 0; kk < N - M; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      for (; kk < N - 1; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
      this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
      this.mti = 0;
    }
    y = this.mt[this.mti++];
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9D2C5680;
    y ^= (y << 15) & 0xEFC60000;
    y ^= (y >>> 18);
    return y >>> 0;
  }

  /**
   * Initialize Mersenne Twister
   * @param {Number} seed
   */
  __initGenRand(seed) {
    this.mt[0] = seed >>> 0;
    for (this.mti = 1; this.mti < N; this.mti++) {
      if (this.tza) {
        const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
        const first = (((s & 0xFFFF0000) >>> 16) * 1812433253) << 16;
        const second = (s & 0x0000FFFF) * 1812433253;
        this.mt[this.mti] = (first + second) + this.mti;
        this.mt[this.mti] >>>= 0;
      } else {
        this.mt[this.mti] = (69069 * this.mt[this.mti - 1]) & 0xFFFFFFFF;
      }
    }
  }
};