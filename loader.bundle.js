(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@noble/hashes/esm/_u64.js
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  var U32_MASK64, _32n, rotlSH, rotlSL, rotlBH, rotlBL;
  var init_u64 = __esm({
    "node_modules/@noble/hashes/esm/_u64.js"() {
      U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
      _32n = /* @__PURE__ */ BigInt(32);
      rotlSH = (h, l, s) => h << s | l >>> 32 - s;
      rotlSL = (h, l, s) => l << s | h >>> 32 - s;
      rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
      rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    }
  });

  // node_modules/@noble/hashes/esm/crypto.js
  var crypto2;
  var init_crypto = __esm({
    "node_modules/@noble/hashes/esm/crypto.js"() {
      crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    }
  });

  // node_modules/@noble/hashes/esm/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function abytes(b, ...lengths) {
    if (!isBytes(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    anumber(h.outputLen);
    anumber(h.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function byteSwap(word) {
    return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  }
  function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap(arr[i]);
    }
    return arr;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    abytes(data);
    return data;
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad4 = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad4);
      pad4 += a.length;
    }
    return res;
  }
  function createHasher(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  function randomBytes(bytesLength = 32) {
    if (crypto2 && typeof crypto2.getRandomValues === "function") {
      return crypto2.getRandomValues(new Uint8Array(bytesLength));
    }
    if (crypto2 && typeof crypto2.randomBytes === "function") {
      return Uint8Array.from(crypto2.randomBytes(bytesLength));
    }
    throw new Error("crypto.getRandomValues must be defined");
  }
  var isLE, swap32IfBE, Hash;
  var init_utils = __esm({
    "node_modules/@noble/hashes/esm/utils.js"() {
      init_crypto();
      isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
      swap32IfBE = isLE ? (u) => u : byteSwap32;
      Hash = class {
      };
    }
  });

  // node_modules/@noble/hashes/esm/sha3.js
  function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t2 = 0; t2 < 24; t2++) {
        const shift = SHA3_ROTL[t2];
        const Th = rotlH(curH, curL, shift);
        const Tl = rotlL(curH, curL, shift);
        const PI = SHA3_PI[t2];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        for (let x = 0; x < 10; x++)
          B[x] = s[y + x];
        for (let x = 0; x < 10; x++)
          s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
      }
      s[0] ^= SHA3_IOTA_H[round];
      s[1] ^= SHA3_IOTA_L[round];
    }
    clean(B);
  }
  var _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, gen, keccak_256;
  var init_sha3 = __esm({
    "node_modules/@noble/hashes/esm/sha3.js"() {
      init_u64();
      init_utils();
      _0n = BigInt(0);
      _1n = BigInt(1);
      _2n = BigInt(2);
      _7n = BigInt(7);
      _256n = BigInt(256);
      _0x71n = BigInt(113);
      SHA3_PI = [];
      SHA3_ROTL = [];
      _SHA3_IOTA = [];
      for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
        [x, y] = [y, (2 * x + 3 * y) % 5];
        SHA3_PI.push(2 * (5 * y + x));
        SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
        let t2 = _0n;
        for (let j = 0; j < 7; j++) {
          R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
          if (R & _2n)
            t2 ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
        }
        _SHA3_IOTA.push(t2);
      }
      IOTAS = split(_SHA3_IOTA, true);
      SHA3_IOTA_H = IOTAS[0];
      SHA3_IOTA_L = IOTAS[1];
      rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
      rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
      Keccak = class _Keccak extends Hash {
        // NOTE: we accept arguments in bytes instead of bits here.
        constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
          super();
          this.pos = 0;
          this.posOut = 0;
          this.finished = false;
          this.destroyed = false;
          this.enableXOF = false;
          this.blockLen = blockLen;
          this.suffix = suffix;
          this.outputLen = outputLen;
          this.enableXOF = enableXOF;
          this.rounds = rounds;
          anumber(outputLen);
          if (!(0 < blockLen && blockLen < 200))
            throw new Error("only keccak-f1600 function is supported");
          this.state = new Uint8Array(200);
          this.state32 = u32(this.state);
        }
        clone() {
          return this._cloneInto();
        }
        keccak() {
          swap32IfBE(this.state32);
          keccakP(this.state32, this.rounds);
          swap32IfBE(this.state32);
          this.posOut = 0;
          this.pos = 0;
        }
        update(data) {
          aexists(this);
          data = toBytes(data);
          abytes(data);
          const { blockLen, state } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
              state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
              this.keccak();
          }
          return this;
        }
        finish() {
          if (this.finished)
            return;
          this.finished = true;
          const { state, suffix, pos, blockLen } = this;
          state[pos] ^= suffix;
          if ((suffix & 128) !== 0 && pos === blockLen - 1)
            this.keccak();
          state[blockLen - 1] ^= 128;
          this.keccak();
        }
        writeInto(out) {
          aexists(this, false);
          abytes(out);
          this.finish();
          const bufferOut = this.state;
          const { blockLen } = this;
          for (let pos = 0, len = out.length; pos < len; ) {
            if (this.posOut >= blockLen)
              this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
          }
          return out;
        }
        xofInto(out) {
          if (!this.enableXOF)
            throw new Error("XOF is not possible for this instance");
          return this.writeInto(out);
        }
        xof(bytes) {
          anumber(bytes);
          return this.xofInto(new Uint8Array(bytes));
        }
        digestInto(out) {
          aoutput(out, this);
          if (this.finished)
            throw new Error("digest() was already called");
          this.writeInto(out);
          this.destroy();
          return out;
        }
        digest() {
          return this.digestInto(new Uint8Array(this.outputLen));
        }
        destroy() {
          this.destroyed = true;
          clean(this.state);
        }
        _cloneInto(to) {
          const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
          to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
          to.state32.set(this.state32);
          to.pos = this.pos;
          to.posOut = this.posOut;
          to.finished = this.finished;
          to.rounds = rounds;
          to.suffix = suffix;
          to.outputLen = outputLen;
          to.enableXOF = enableXOF;
          to.destroyed = this.destroyed;
          return to;
        }
      };
      gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
      keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
    }
  });

  // node_modules/@noble/hashes/esm/_md.js
  function setBigUint64(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n2 = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n2 & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD, SHA256_IV, SHA224_IV;
  var init_md = __esm({
    "node_modules/@noble/hashes/esm/_md.js"() {
      init_utils();
      HashMD = class extends Hash {
        constructor(blockLen, outputLen, padOffset, isLE2) {
          super();
          this.finished = false;
          this.length = 0;
          this.pos = 0;
          this.destroyed = false;
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE2;
          this.buffer = new Uint8Array(blockLen);
          this.view = createView(this.buffer);
        }
        update(data) {
          aexists(this);
          data = toBytes(data);
          abytes(data);
          const { view, buffer: buffer2, blockLen } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = createView(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              continue;
            }
            buffer2.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
        digestInto(out) {
          aexists(this);
          aoutput(out, this);
          this.finished = true;
          const { buffer: buffer2, view, blockLen, isLE: isLE2 } = this;
          let { pos } = this;
          buffer2[pos++] = 128;
          clean(this.buffer.subarray(pos));
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          for (let i = pos; i < blockLen; i++)
            buffer2[i] = 0;
          setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
          this.process(view, 0);
          const oview = createView(out);
          const len = this.outputLen;
          if (len % 4)
            throw new Error("_sha2: outputLen should be aligned to 32bit");
          const outLen = len / 4;
          const state = this.get();
          if (outLen > state.length)
            throw new Error("_sha2: outputLen bigger than state");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE2);
        }
        digest() {
          const { buffer: buffer2, outputLen } = this;
          this.digestInto(buffer2);
          const res = buffer2.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneInto(to) {
          to || (to = new this.constructor());
          to.set(...this.get());
          const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (length % blockLen)
            to.buffer.set(buffer2);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
      };
      SHA256_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
      SHA224_IV = /* @__PURE__ */ Uint32Array.from([
        3238371032,
        914150663,
        812702999,
        4144912697,
        4290775857,
        1750603025,
        1694076839,
        3204075428
      ]);
    }
  });

  // node_modules/@noble/hashes/esm/sha2.js
  var SHA256_K, SHA256_W, SHA256, SHA224, sha256, sha224;
  var init_sha2 = __esm({
    "node_modules/@noble/hashes/esm/sha2.js"() {
      init_md();
      init_utils();
      SHA256_K = /* @__PURE__ */ Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      SHA256 = class extends HashMD {
        constructor(outputLen = 32) {
          super(64, outputLen, 8, false);
          this.A = SHA256_IV[0] | 0;
          this.B = SHA256_IV[1] | 0;
          this.C = SHA256_IV[2] | 0;
          this.D = SHA256_IV[3] | 0;
          this.E = SHA256_IV[4] | 0;
          this.F = SHA256_IV[5] | 0;
          this.G = SHA256_IV[6] | 0;
          this.H = SHA256_IV[7] | 0;
        }
        get() {
          const { A, B, C, D, E, F, G, H } = this;
          return [A, B, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
          for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
          }
          let { A, B, C, D, E, F, G, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = sigma0 + Maj(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B = B + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B, C, D, E, F, G, H);
        }
        roundClean() {
          clean(SHA256_W);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          clean(this.buffer);
        }
      };
      SHA224 = class extends SHA256 {
        constructor() {
          super(28);
          this.A = SHA224_IV[0] | 0;
          this.B = SHA224_IV[1] | 0;
          this.C = SHA224_IV[2] | 0;
          this.D = SHA224_IV[3] | 0;
          this.E = SHA224_IV[4] | 0;
          this.F = SHA224_IV[5] | 0;
          this.G = SHA224_IV[6] | 0;
          this.H = SHA224_IV[7] | 0;
        }
      };
      sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
      sha224 = /* @__PURE__ */ createHasher(() => new SHA224());
    }
  });

  // node_modules/@noble/hashes/esm/sha256.js
  var sha256_exports = {};
  __export(sha256_exports, {
    SHA224: () => SHA2242,
    SHA256: () => SHA2562,
    sha224: () => sha2242,
    sha256: () => sha2562
  });
  var SHA2562, sha2562, SHA2242, sha2242;
  var init_sha256 = __esm({
    "node_modules/@noble/hashes/esm/sha256.js"() {
      init_sha2();
      SHA2562 = SHA256;
      sha2562 = sha256;
      SHA2242 = SHA224;
      sha2242 = sha224;
    }
  });

  // node_modules/abitype/dist/esm/version.js
  var version;
  var init_version = __esm({
    "node_modules/abitype/dist/esm/version.js"() {
      version = "1.1.0";
    }
  });

  // node_modules/abitype/dist/esm/errors.js
  var BaseError;
  var init_errors = __esm({
    "node_modules/abitype/dist/esm/errors.js"() {
      init_version();
      BaseError = class _BaseError extends Error {
        constructor(shortMessage, args = {}) {
          const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
          const docsPath8 = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
          const message = [
            shortMessage || "An error occurred.",
            "",
            ...args.metaMessages ? [...args.metaMessages, ""] : [],
            ...docsPath8 ? [`Docs: https://abitype.dev${docsPath8}`] : [],
            ...details ? [`Details: ${details}`] : [],
            `Version: abitype@${version}`
          ].join("\n");
          super(message);
          Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AbiTypeError"
          });
          if (args.cause)
            this.cause = args.cause;
          this.details = details;
          this.docsPath = docsPath8;
          this.metaMessages = args.metaMessages;
          this.shortMessage = shortMessage;
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/regex.js
  function execTyped(regex, string) {
    const match = regex.exec(string);
    return match?.groups;
  }
  var bytesRegex, integerRegex, isTupleRegex;
  var init_regex = __esm({
    "node_modules/abitype/dist/esm/regex.js"() {
      bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
      integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
      isTupleRegex = /^\(.+?\).*?$/;
    }
  });

  // node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
  function formatAbiParameter(abiParameter) {
    let type = abiParameter.type;
    if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
      type = "(";
      const length = abiParameter.components.length;
      for (let i = 0; i < length; i++) {
        const component = abiParameter.components[i];
        type += formatAbiParameter(component);
        if (i < length - 1)
          type += ", ";
      }
      const result = execTyped(tupleRegex, abiParameter.type);
      type += `)${result?.array ?? ""}`;
      return formatAbiParameter({
        ...abiParameter,
        type
      });
    }
    if ("indexed" in abiParameter && abiParameter.indexed)
      type = `${type} indexed`;
    if (abiParameter.name)
      return `${type} ${abiParameter.name}`;
    return type;
  }
  var tupleRegex;
  var init_formatAbiParameter = __esm({
    "node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js"() {
      init_regex();
      tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
    }
  });

  // node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
  function formatAbiParameters(abiParameters) {
    let params = "";
    const length = abiParameters.length;
    for (let i = 0; i < length; i++) {
      const abiParameter = abiParameters[i];
      params += formatAbiParameter(abiParameter);
      if (i !== length - 1)
        params += ", ";
    }
    return params;
  }
  var init_formatAbiParameters = __esm({
    "node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js"() {
      init_formatAbiParameter();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
  function formatAbiItem(abiItem) {
    if (abiItem.type === "function")
      return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
    if (abiItem.type === "event")
      return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
    if (abiItem.type === "error")
      return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
    if (abiItem.type === "constructor")
      return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
    if (abiItem.type === "fallback")
      return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
    return "receive() external payable";
  }
  var init_formatAbiItem = __esm({
    "node_modules/abitype/dist/esm/human-readable/formatAbiItem.js"() {
      init_formatAbiParameters();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
  function isErrorSignature(signature) {
    return errorSignatureRegex.test(signature);
  }
  function execErrorSignature(signature) {
    return execTyped(errorSignatureRegex, signature);
  }
  function isEventSignature(signature) {
    return eventSignatureRegex.test(signature);
  }
  function execEventSignature(signature) {
    return execTyped(eventSignatureRegex, signature);
  }
  function isFunctionSignature(signature) {
    return functionSignatureRegex.test(signature);
  }
  function execFunctionSignature(signature) {
    return execTyped(functionSignatureRegex, signature);
  }
  function isStructSignature(signature) {
    return structSignatureRegex.test(signature);
  }
  function execStructSignature(signature) {
    return execTyped(structSignatureRegex, signature);
  }
  function isConstructorSignature(signature) {
    return constructorSignatureRegex.test(signature);
  }
  function execConstructorSignature(signature) {
    return execTyped(constructorSignatureRegex, signature);
  }
  function isFallbackSignature(signature) {
    return fallbackSignatureRegex.test(signature);
  }
  function execFallbackSignature(signature) {
    return execTyped(fallbackSignatureRegex, signature);
  }
  function isReceiveSignature(signature) {
    return receiveSignatureRegex.test(signature);
  }
  var errorSignatureRegex, eventSignatureRegex, functionSignatureRegex, structSignatureRegex, constructorSignatureRegex, fallbackSignatureRegex, receiveSignatureRegex, modifiers, eventModifiers, functionModifiers;
  var init_signatures = __esm({
    "node_modules/abitype/dist/esm/human-readable/runtime/signatures.js"() {
      init_regex();
      errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
      eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
      functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
      structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
      constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
      fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
      receiveSignatureRegex = /^receive\(\) external payable$/;
      modifiers = /* @__PURE__ */ new Set([
        "memory",
        "indexed",
        "storage",
        "calldata"
      ]);
      eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
      functionModifiers = /* @__PURE__ */ new Set([
        "calldata",
        "memory",
        "storage"
      ]);
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
  var InvalidAbiItemError, UnknownTypeError, UnknownSolidityTypeError;
  var init_abiItem = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/abiItem.js"() {
      init_errors();
      InvalidAbiItemError = class extends BaseError {
        constructor({ signature }) {
          super("Failed to parse ABI item.", {
            details: `parseAbiItem(${JSON.stringify(signature, null, 2)})`,
            docsPath: "/api/human#parseabiitem-1"
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidAbiItemError"
          });
        }
      };
      UnknownTypeError = class extends BaseError {
        constructor({ type }) {
          super("Unknown type.", {
            metaMessages: [
              `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "UnknownTypeError"
          });
        }
      };
      UnknownSolidityTypeError = class extends BaseError {
        constructor({ type }) {
          super("Unknown type.", {
            metaMessages: [`Type "${type}" is not a valid ABI type.`]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "UnknownSolidityTypeError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
  var InvalidAbiParametersError, InvalidParameterError, SolidityProtectedKeywordError, InvalidModifierError, InvalidFunctionModifierError, InvalidAbiTypeParameterError;
  var init_abiParameter = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js"() {
      init_errors();
      InvalidAbiParametersError = class extends BaseError {
        constructor({ params }) {
          super("Failed to parse ABI parameters.", {
            details: `parseAbiParameters(${JSON.stringify(params, null, 2)})`,
            docsPath: "/api/human#parseabiparameters-1"
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidAbiParametersError"
          });
        }
      };
      InvalidParameterError = class extends BaseError {
        constructor({ param }) {
          super("Invalid ABI parameter.", {
            details: param
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidParameterError"
          });
        }
      };
      SolidityProtectedKeywordError = class extends BaseError {
        constructor({ param, name }) {
          super("Invalid ABI parameter.", {
            details: param,
            metaMessages: [
              `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SolidityProtectedKeywordError"
          });
        }
      };
      InvalidModifierError = class extends BaseError {
        constructor({ param, type, modifier }) {
          super("Invalid ABI parameter.", {
            details: param,
            metaMessages: [
              `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidModifierError"
          });
        }
      };
      InvalidFunctionModifierError = class extends BaseError {
        constructor({ param, type, modifier }) {
          super("Invalid ABI parameter.", {
            details: param,
            metaMessages: [
              `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
              `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidFunctionModifierError"
          });
        }
      };
      InvalidAbiTypeParameterError = class extends BaseError {
        constructor({ abiParameter }) {
          super("Invalid ABI parameter.", {
            details: JSON.stringify(abiParameter, null, 2),
            metaMessages: ["ABI parameter type is invalid."]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidAbiTypeParameterError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/signature.js
  var InvalidSignatureError, UnknownSignatureError, InvalidStructSignatureError;
  var init_signature = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/signature.js"() {
      init_errors();
      InvalidSignatureError = class extends BaseError {
        constructor({ signature, type }) {
          super(`Invalid ${type} signature.`, {
            details: signature
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidSignatureError"
          });
        }
      };
      UnknownSignatureError = class extends BaseError {
        constructor({ signature }) {
          super("Unknown signature.", {
            details: signature
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "UnknownSignatureError"
          });
        }
      };
      InvalidStructSignatureError = class extends BaseError {
        constructor({ signature }) {
          super("Invalid struct signature.", {
            details: signature,
            metaMessages: ["No properties exist."]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidStructSignatureError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/struct.js
  var CircularReferenceError;
  var init_struct = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/struct.js"() {
      init_errors();
      CircularReferenceError = class extends BaseError {
        constructor({ type }) {
          super("Circular reference detected.", {
            metaMessages: [`Struct "${type}" is a circular reference.`]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "CircularReferenceError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
  var InvalidParenthesisError;
  var init_splitParameters = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js"() {
      init_errors();
      InvalidParenthesisError = class extends BaseError {
        constructor({ current, depth }) {
          super("Unbalanced parentheses.", {
            metaMessages: [
              `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
            ],
            details: `Depth "${depth}"`
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidParenthesisError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/runtime/cache.js
  function getParameterCacheKey(param, type, structs) {
    let structKey = "";
    if (structs)
      for (const struct of Object.entries(structs)) {
        if (!struct)
          continue;
        let propertyKey = "";
        for (const property of struct[1]) {
          propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
        }
        structKey += `(${struct[0]}{${propertyKey}})`;
      }
    if (type)
      return `${type}:${param}${structKey}`;
    return param;
  }
  var parameterCache;
  var init_cache = __esm({
    "node_modules/abitype/dist/esm/human-readable/runtime/cache.js"() {
      parameterCache = /* @__PURE__ */ new Map([
        // Unnamed
        ["address", { type: "address" }],
        ["bool", { type: "bool" }],
        ["bytes", { type: "bytes" }],
        ["bytes32", { type: "bytes32" }],
        ["int", { type: "int256" }],
        ["int256", { type: "int256" }],
        ["string", { type: "string" }],
        ["uint", { type: "uint256" }],
        ["uint8", { type: "uint8" }],
        ["uint16", { type: "uint16" }],
        ["uint24", { type: "uint24" }],
        ["uint32", { type: "uint32" }],
        ["uint64", { type: "uint64" }],
        ["uint96", { type: "uint96" }],
        ["uint112", { type: "uint112" }],
        ["uint160", { type: "uint160" }],
        ["uint192", { type: "uint192" }],
        ["uint256", { type: "uint256" }],
        // Named
        ["address owner", { type: "address", name: "owner" }],
        ["address to", { type: "address", name: "to" }],
        ["bool approved", { type: "bool", name: "approved" }],
        ["bytes _data", { type: "bytes", name: "_data" }],
        ["bytes data", { type: "bytes", name: "data" }],
        ["bytes signature", { type: "bytes", name: "signature" }],
        ["bytes32 hash", { type: "bytes32", name: "hash" }],
        ["bytes32 r", { type: "bytes32", name: "r" }],
        ["bytes32 root", { type: "bytes32", name: "root" }],
        ["bytes32 s", { type: "bytes32", name: "s" }],
        ["string name", { type: "string", name: "name" }],
        ["string symbol", { type: "string", name: "symbol" }],
        ["string tokenURI", { type: "string", name: "tokenURI" }],
        ["uint tokenId", { type: "uint256", name: "tokenId" }],
        ["uint8 v", { type: "uint8", name: "v" }],
        ["uint256 balance", { type: "uint256", name: "balance" }],
        ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
        ["uint256 value", { type: "uint256", name: "value" }],
        // Indexed
        [
          "event:address indexed from",
          { type: "address", name: "from", indexed: true }
        ],
        ["event:address indexed to", { type: "address", name: "to", indexed: true }],
        [
          "event:uint indexed tokenId",
          { type: "uint256", name: "tokenId", indexed: true }
        ],
        [
          "event:uint256 indexed tokenId",
          { type: "uint256", name: "tokenId", indexed: true }
        ]
      ]);
    }
  });

  // node_modules/abitype/dist/esm/human-readable/runtime/utils.js
  function parseSignature(signature, structs = {}) {
    if (isFunctionSignature(signature))
      return parseFunctionSignature(signature, structs);
    if (isEventSignature(signature))
      return parseEventSignature(signature, structs);
    if (isErrorSignature(signature))
      return parseErrorSignature(signature, structs);
    if (isConstructorSignature(signature))
      return parseConstructorSignature(signature, structs);
    if (isFallbackSignature(signature))
      return parseFallbackSignature(signature);
    if (isReceiveSignature(signature))
      return {
        type: "receive",
        stateMutability: "payable"
      };
    throw new UnknownSignatureError({ signature });
  }
  function parseFunctionSignature(signature, structs = {}) {
    const match = execFunctionSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "function" });
    const inputParams = splitParameters(match.parameters);
    const inputs = [];
    const inputLength = inputParams.length;
    for (let i = 0; i < inputLength; i++) {
      inputs.push(parseAbiParameter(inputParams[i], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
    const outputs = [];
    if (match.returns) {
      const outputParams = splitParameters(match.returns);
      const outputLength = outputParams.length;
      for (let i = 0; i < outputLength; i++) {
        outputs.push(parseAbiParameter(outputParams[i], {
          modifiers: functionModifiers,
          structs,
          type: "function"
        }));
      }
    }
    return {
      name: match.name,
      type: "function",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs,
      outputs
    };
  }
  function parseEventSignature(signature, structs = {}) {
    const match = execEventSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "event" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++)
      abiParameters.push(parseAbiParameter(params[i], {
        modifiers: eventModifiers,
        structs,
        type: "event"
      }));
    return { name: match.name, type: "event", inputs: abiParameters };
  }
  function parseErrorSignature(signature, structs = {}) {
    const match = execErrorSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "error" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++)
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
    return { name: match.name, type: "error", inputs: abiParameters };
  }
  function parseConstructorSignature(signature, structs = {}) {
    const match = execConstructorSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "constructor" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++)
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
    return {
      type: "constructor",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs: abiParameters
    };
  }
  function parseFallbackSignature(signature) {
    const match = execFallbackSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "fallback" });
    return {
      type: "fallback",
      stateMutability: match.stateMutability ?? "nonpayable"
    };
  }
  function parseAbiParameter(param, options) {
    const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
    if (parameterCache.has(parameterCacheKey))
      return parameterCache.get(parameterCacheKey);
    const isTuple = isTupleRegex.test(param);
    const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
    if (!match)
      throw new InvalidParameterError({ param });
    if (match.name && isSolidityKeyword(match.name))
      throw new SolidityProtectedKeywordError({ param, name: match.name });
    const name = match.name ? { name: match.name } : {};
    const indexed = match.modifier === "indexed" ? { indexed: true } : {};
    const structs = options?.structs ?? {};
    let type;
    let components = {};
    if (isTuple) {
      type = "tuple";
      const params = splitParameters(match.type);
      const components_ = [];
      const length = params.length;
      for (let i = 0; i < length; i++) {
        components_.push(parseAbiParameter(params[i], { structs }));
      }
      components = { components: components_ };
    } else if (match.type in structs) {
      type = "tuple";
      components = { components: structs[match.type] };
    } else if (dynamicIntegerRegex.test(match.type)) {
      type = `${match.type}256`;
    } else if (match.type === "address payable") {
      type = "address";
    } else {
      type = match.type;
      if (!(options?.type === "struct") && !isSolidityType(type))
        throw new UnknownSolidityTypeError({ type });
    }
    if (match.modifier) {
      if (!options?.modifiers?.has?.(match.modifier))
        throw new InvalidModifierError({
          param,
          type: options?.type,
          modifier: match.modifier
        });
      if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
        throw new InvalidFunctionModifierError({
          param,
          type: options?.type,
          modifier: match.modifier
        });
    }
    const abiParameter = {
      type: `${type}${match.array ?? ""}`,
      ...name,
      ...indexed,
      ...components
    };
    parameterCache.set(parameterCacheKey, abiParameter);
    return abiParameter;
  }
  function splitParameters(params, result = [], current = "", depth = 0) {
    const length = params.trim().length;
    for (let i = 0; i < length; i++) {
      const char = params[i];
      const tail = params.slice(i + 1);
      switch (char) {
        case ",":
          return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
        case "(":
          return splitParameters(tail, result, `${current}${char}`, depth + 1);
        case ")":
          return splitParameters(tail, result, `${current}${char}`, depth - 1);
        default:
          return splitParameters(tail, result, `${current}${char}`, depth);
      }
    }
    if (current === "")
      return result;
    if (depth !== 0)
      throw new InvalidParenthesisError({ current, depth });
    result.push(current.trim());
    return result;
  }
  function isSolidityType(type) {
    return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
  }
  function isSolidityKeyword(name) {
    return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
  }
  function isValidDataLocation(type, isArray) {
    return isArray || type === "bytes" || type === "string" || type === "tuple";
  }
  var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
  var init_utils2 = __esm({
    "node_modules/abitype/dist/esm/human-readable/runtime/utils.js"() {
      init_regex();
      init_abiItem();
      init_abiParameter();
      init_signature();
      init_splitParameters();
      init_cache();
      init_signatures();
      abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
      abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
      dynamicIntegerRegex = /^u?int$/;
      protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
    }
  });

  // node_modules/abitype/dist/esm/human-readable/runtime/structs.js
  function parseStructs(signatures) {
    const shallowStructs = {};
    const signaturesLength = signatures.length;
    for (let i = 0; i < signaturesLength; i++) {
      const signature = signatures[i];
      if (!isStructSignature(signature))
        continue;
      const match = execStructSignature(signature);
      if (!match)
        throw new InvalidSignatureError({ signature, type: "struct" });
      const properties = match.properties.split(";");
      const components = [];
      const propertiesLength = properties.length;
      for (let k = 0; k < propertiesLength; k++) {
        const property = properties[k];
        const trimmed = property.trim();
        if (!trimmed)
          continue;
        const abiParameter = parseAbiParameter(trimmed, {
          type: "struct"
        });
        components.push(abiParameter);
      }
      if (!components.length)
        throw new InvalidStructSignatureError({ signature });
      shallowStructs[match.name] = components;
    }
    const resolvedStructs = {};
    const entries = Object.entries(shallowStructs);
    const entriesLength = entries.length;
    for (let i = 0; i < entriesLength; i++) {
      const [name, parameters] = entries[i];
      resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
    }
    return resolvedStructs;
  }
  function resolveStructs(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
    const components = [];
    const length = abiParameters.length;
    for (let i = 0; i < length; i++) {
      const abiParameter = abiParameters[i];
      const isTuple = isTupleRegex.test(abiParameter.type);
      if (isTuple)
        components.push(abiParameter);
      else {
        const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
        if (!match?.type)
          throw new InvalidAbiTypeParameterError({ abiParameter });
        const { array, type } = match;
        if (type in structs) {
          if (ancestors.has(type))
            throw new CircularReferenceError({ type });
          components.push({
            ...abiParameter,
            type: `tuple${array ?? ""}`,
            components: resolveStructs(structs[type] ?? [], structs, /* @__PURE__ */ new Set([...ancestors, type]))
          });
        } else {
          if (isSolidityType(type))
            components.push(abiParameter);
          else
            throw new UnknownTypeError({ type });
        }
      }
    }
    return components;
  }
  var typeWithoutTupleRegex;
  var init_structs = __esm({
    "node_modules/abitype/dist/esm/human-readable/runtime/structs.js"() {
      init_regex();
      init_abiItem();
      init_abiParameter();
      init_signature();
      init_struct();
      init_signatures();
      init_utils2();
      typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
    }
  });

  // node_modules/abitype/dist/esm/human-readable/parseAbi.js
  function parseAbi(signatures) {
    const structs = parseStructs(signatures);
    const abi2 = [];
    const length = signatures.length;
    for (let i = 0; i < length; i++) {
      const signature = signatures[i];
      if (isStructSignature(signature))
        continue;
      abi2.push(parseSignature(signature, structs));
    }
    return abi2;
  }
  var init_parseAbi = __esm({
    "node_modules/abitype/dist/esm/human-readable/parseAbi.js"() {
      init_signatures();
      init_structs();
      init_utils2();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/parseAbiItem.js
  function parseAbiItem(signature) {
    let abiItem;
    if (typeof signature === "string")
      abiItem = parseSignature(signature);
    else {
      const structs = parseStructs(signature);
      const length = signature.length;
      for (let i = 0; i < length; i++) {
        const signature_ = signature[i];
        if (isStructSignature(signature_))
          continue;
        abiItem = parseSignature(signature_, structs);
        break;
      }
    }
    if (!abiItem)
      throw new InvalidAbiItemError({ signature });
    return abiItem;
  }
  var init_parseAbiItem = __esm({
    "node_modules/abitype/dist/esm/human-readable/parseAbiItem.js"() {
      init_abiItem();
      init_signatures();
      init_structs();
      init_utils2();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/parseAbiParameters.js
  function parseAbiParameters(params) {
    const abiParameters = [];
    if (typeof params === "string") {
      const parameters = splitParameters(params);
      const length = parameters.length;
      for (let i = 0; i < length; i++) {
        abiParameters.push(parseAbiParameter(parameters[i], { modifiers }));
      }
    } else {
      const structs = parseStructs(params);
      const length = params.length;
      for (let i = 0; i < length; i++) {
        const signature = params[i];
        if (isStructSignature(signature))
          continue;
        const parameters = splitParameters(signature);
        const length2 = parameters.length;
        for (let k = 0; k < length2; k++) {
          abiParameters.push(parseAbiParameter(parameters[k], { modifiers, structs }));
        }
      }
    }
    if (abiParameters.length === 0)
      throw new InvalidAbiParametersError({ params });
    return abiParameters;
  }
  var init_parseAbiParameters = __esm({
    "node_modules/abitype/dist/esm/human-readable/parseAbiParameters.js"() {
      init_abiParameter();
      init_signatures();
      init_structs();
      init_utils2();
      init_utils2();
    }
  });

  // node_modules/abitype/dist/esm/exports/index.js
  var init_exports = __esm({
    "node_modules/abitype/dist/esm/exports/index.js"() {
      init_formatAbiItem();
      init_formatAbiParameters();
      init_parseAbi();
      init_parseAbiItem();
      init_parseAbiParameters();
    }
  });

  // node_modules/viem/_esm/utils/abi/formatAbiItem.js
  function formatAbiItem2(abiItem, { includeName = false } = {}) {
    if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
      throw new InvalidDefinitionTypeError(abiItem.type);
    return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
  }
  function formatAbiParams(params, { includeName = false } = {}) {
    if (!params)
      return "";
    return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
  }
  function formatAbiParam(param, { includeName }) {
    if (param.type.startsWith("tuple")) {
      return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
    }
    return param.type + (includeName && param.name ? ` ${param.name}` : "");
  }
  var init_formatAbiItem2 = __esm({
    "node_modules/viem/_esm/utils/abi/formatAbiItem.js"() {
      init_abi();
    }
  });

  // node_modules/viem/_esm/utils/data/isHex.js
  function isHex(value, { strict = true } = {}) {
    if (!value)
      return false;
    if (typeof value !== "string")
      return false;
    return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
  }
  var init_isHex = __esm({
    "node_modules/viem/_esm/utils/data/isHex.js"() {
    }
  });

  // node_modules/viem/_esm/utils/data/size.js
  function size(value) {
    if (isHex(value, { strict: false }))
      return Math.ceil((value.length - 2) / 2);
    return value.length;
  }
  var init_size = __esm({
    "node_modules/viem/_esm/utils/data/size.js"() {
      init_isHex();
    }
  });

  // node_modules/viem/_esm/errors/version.js
  var version2;
  var init_version2 = __esm({
    "node_modules/viem/_esm/errors/version.js"() {
      version2 = "2.42.0";
    }
  });

  // node_modules/viem/_esm/errors/base.js
  function walk(err, fn) {
    if (fn?.(err))
      return err;
    if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
      return walk(err.cause, fn);
    return fn ? null : err;
  }
  var errorConfig, BaseError2;
  var init_base = __esm({
    "node_modules/viem/_esm/errors/base.js"() {
      init_version2();
      errorConfig = {
        getDocsUrl: ({ docsBaseUrl, docsPath: docsPath8 = "", docsSlug }) => docsPath8 ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath8}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
        version: `viem@${version2}`
      };
      BaseError2 = class _BaseError extends Error {
        constructor(shortMessage, args = {}) {
          const details = (() => {
            if (args.cause instanceof _BaseError)
              return args.cause.details;
            if (args.cause?.message)
              return args.cause.message;
            return args.details;
          })();
          const docsPath8 = (() => {
            if (args.cause instanceof _BaseError)
              return args.cause.docsPath || args.docsPath;
            return args.docsPath;
          })();
          const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath: docsPath8 });
          const message = [
            shortMessage || "An error occurred.",
            "",
            ...args.metaMessages ? [...args.metaMessages, ""] : [],
            ...docsUrl ? [`Docs: ${docsUrl}`] : [],
            ...details ? [`Details: ${details}`] : [],
            ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
          ].join("\n");
          super(message, args.cause ? { cause: args.cause } : void 0);
          Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "BaseError"
          });
          this.details = details;
          this.docsPath = docsPath8;
          this.metaMessages = args.metaMessages;
          this.name = args.name ?? this.name;
          this.shortMessage = shortMessage;
          this.version = version2;
        }
        walk(fn) {
          return walk(this, fn);
        }
      };
    }
  });

  // node_modules/viem/_esm/errors/abi.js
  var AbiConstructorNotFoundError, AbiConstructorParamsNotFoundError, AbiDecodingDataSizeTooSmallError, AbiDecodingZeroDataError, AbiEncodingArrayLengthMismatchError, AbiEncodingBytesSizeMismatchError, AbiEncodingLengthMismatchError, AbiErrorInputsNotFoundError, AbiErrorNotFoundError, AbiErrorSignatureNotFoundError, AbiEventSignatureEmptyTopicsError, AbiEventSignatureNotFoundError, AbiEventNotFoundError, AbiFunctionNotFoundError, AbiFunctionOutputsNotFoundError, AbiFunctionSignatureNotFoundError, AbiItemAmbiguityError, BytesSizeMismatchError, DecodeLogDataMismatch, DecodeLogTopicsMismatch, InvalidAbiEncodingTypeError, InvalidAbiDecodingTypeError, InvalidArrayError, InvalidDefinitionTypeError;
  var init_abi = __esm({
    "node_modules/viem/_esm/errors/abi.js"() {
      init_formatAbiItem2();
      init_size();
      init_base();
      AbiConstructorNotFoundError = class extends BaseError2 {
        constructor({ docsPath: docsPath8 }) {
          super([
            "A constructor was not found on the ABI.",
            "Make sure you are using the correct ABI and that the constructor exists on it."
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiConstructorNotFoundError"
          });
        }
      };
      AbiConstructorParamsNotFoundError = class extends BaseError2 {
        constructor({ docsPath: docsPath8 }) {
          super([
            "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
            "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiConstructorParamsNotFoundError"
          });
        }
      };
      AbiDecodingDataSizeTooSmallError = class extends BaseError2 {
        constructor({ data, params, size: size5 }) {
          super([`Data size of ${size5} bytes is too small for given parameters.`].join("\n"), {
            metaMessages: [
              `Params: (${formatAbiParams(params, { includeName: true })})`,
              `Data:   ${data} (${size5} bytes)`
            ],
            name: "AbiDecodingDataSizeTooSmallError"
          });
          Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.data = data;
          this.params = params;
          this.size = size5;
        }
      };
      AbiDecodingZeroDataError = class extends BaseError2 {
        constructor() {
          super('Cannot decode zero data ("0x") with ABI parameters.', {
            name: "AbiDecodingZeroDataError"
          });
        }
      };
      AbiEncodingArrayLengthMismatchError = class extends BaseError2 {
        constructor({ expectedLength, givenLength, type }) {
          super([
            `ABI encoding array length mismatch for type ${type}.`,
            `Expected length: ${expectedLength}`,
            `Given length: ${givenLength}`
          ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
        }
      };
      AbiEncodingBytesSizeMismatchError = class extends BaseError2 {
        constructor({ expectedSize, value }) {
          super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
        }
      };
      AbiEncodingLengthMismatchError = class extends BaseError2 {
        constructor({ expectedLength, givenLength }) {
          super([
            "ABI encoding params/values length mismatch.",
            `Expected length (params): ${expectedLength}`,
            `Given length (values): ${givenLength}`
          ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
        }
      };
      AbiErrorInputsNotFoundError = class extends BaseError2 {
        constructor(errorName, { docsPath: docsPath8 }) {
          super([
            `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
            "Cannot encode error result without knowing what the parameter types are.",
            "Make sure you are using the correct ABI and that the inputs exist on it."
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiErrorInputsNotFoundError"
          });
        }
      };
      AbiErrorNotFoundError = class extends BaseError2 {
        constructor(errorName, { docsPath: docsPath8 } = {}) {
          super([
            `Error ${errorName ? `"${errorName}" ` : ""}not found on ABI.`,
            "Make sure you are using the correct ABI and that the error exists on it."
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiErrorNotFoundError"
          });
        }
      };
      AbiErrorSignatureNotFoundError = class extends BaseError2 {
        constructor(signature, { docsPath: docsPath8 }) {
          super([
            `Encoded error signature "${signature}" not found on ABI.`,
            "Make sure you are using the correct ABI and that the error exists on it.",
            `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiErrorSignatureNotFoundError"
          });
          Object.defineProperty(this, "signature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.signature = signature;
        }
      };
      AbiEventSignatureEmptyTopicsError = class extends BaseError2 {
        constructor({ docsPath: docsPath8 }) {
          super("Cannot extract event signature from empty topics.", {
            docsPath: docsPath8,
            name: "AbiEventSignatureEmptyTopicsError"
          });
        }
      };
      AbiEventSignatureNotFoundError = class extends BaseError2 {
        constructor(signature, { docsPath: docsPath8 }) {
          super([
            `Encoded event signature "${signature}" not found on ABI.`,
            "Make sure you are using the correct ABI and that the event exists on it.",
            `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiEventSignatureNotFoundError"
          });
        }
      };
      AbiEventNotFoundError = class extends BaseError2 {
        constructor(eventName, { docsPath: docsPath8 } = {}) {
          super([
            `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
            "Make sure you are using the correct ABI and that the event exists on it."
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiEventNotFoundError"
          });
        }
      };
      AbiFunctionNotFoundError = class extends BaseError2 {
        constructor(functionName, { docsPath: docsPath8 } = {}) {
          super([
            `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
            "Make sure you are using the correct ABI and that the function exists on it."
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiFunctionNotFoundError"
          });
        }
      };
      AbiFunctionOutputsNotFoundError = class extends BaseError2 {
        constructor(functionName, { docsPath: docsPath8 }) {
          super([
            `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
            "Cannot decode function result without knowing what the parameter types are.",
            "Make sure you are using the correct ABI and that the function exists on it."
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiFunctionOutputsNotFoundError"
          });
        }
      };
      AbiFunctionSignatureNotFoundError = class extends BaseError2 {
        constructor(signature, { docsPath: docsPath8 }) {
          super([
            `Encoded function signature "${signature}" not found on ABI.`,
            "Make sure you are using the correct ABI and that the function exists on it.",
            `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
          ].join("\n"), {
            docsPath: docsPath8,
            name: "AbiFunctionSignatureNotFoundError"
          });
        }
      };
      AbiItemAmbiguityError = class extends BaseError2 {
        constructor(x, y) {
          super("Found ambiguous types in overloaded ABI items.", {
            metaMessages: [
              `\`${x.type}\` in \`${formatAbiItem2(x.abiItem)}\`, and`,
              `\`${y.type}\` in \`${formatAbiItem2(y.abiItem)}\``,
              "",
              "These types encode differently and cannot be distinguished at runtime.",
              "Remove one of the ambiguous items in the ABI."
            ],
            name: "AbiItemAmbiguityError"
          });
        }
      };
      BytesSizeMismatchError = class extends BaseError2 {
        constructor({ expectedSize, givenSize }) {
          super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
            name: "BytesSizeMismatchError"
          });
        }
      };
      DecodeLogDataMismatch = class extends BaseError2 {
        constructor({ abiItem, data, params, size: size5 }) {
          super([
            `Data size of ${size5} bytes is too small for non-indexed event parameters.`
          ].join("\n"), {
            metaMessages: [
              `Params: (${formatAbiParams(params, { includeName: true })})`,
              `Data:   ${data} (${size5} bytes)`
            ],
            name: "DecodeLogDataMismatch"
          });
          Object.defineProperty(this, "abiItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.abiItem = abiItem;
          this.data = data;
          this.params = params;
          this.size = size5;
        }
      };
      DecodeLogTopicsMismatch = class extends BaseError2 {
        constructor({ abiItem, param }) {
          super([
            `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem2(abiItem, { includeName: true })}".`
          ].join("\n"), { name: "DecodeLogTopicsMismatch" });
          Object.defineProperty(this, "abiItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.abiItem = abiItem;
        }
      };
      InvalidAbiEncodingTypeError = class extends BaseError2 {
        constructor(type, { docsPath: docsPath8 }) {
          super([
            `Type "${type}" is not a valid encoding type.`,
            "Please provide a valid ABI type."
          ].join("\n"), { docsPath: docsPath8, name: "InvalidAbiEncodingType" });
        }
      };
      InvalidAbiDecodingTypeError = class extends BaseError2 {
        constructor(type, { docsPath: docsPath8 }) {
          super([
            `Type "${type}" is not a valid decoding type.`,
            "Please provide a valid ABI type."
          ].join("\n"), { docsPath: docsPath8, name: "InvalidAbiDecodingType" });
        }
      };
      InvalidArrayError = class extends BaseError2 {
        constructor(value) {
          super([`Value "${value}" is not a valid array.`].join("\n"), {
            name: "InvalidArrayError"
          });
        }
      };
      InvalidDefinitionTypeError = class extends BaseError2 {
        constructor(type) {
          super([
            `"${type}" is not a valid definition type.`,
            'Valid types: "function", "event", "error"'
          ].join("\n"), { name: "InvalidDefinitionTypeError" });
        }
      };
    }
  });

  // node_modules/viem/_esm/errors/data.js
  var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError, InvalidBytesLengthError;
  var init_data = __esm({
    "node_modules/viem/_esm/errors/data.js"() {
      init_base();
      SliceOffsetOutOfBoundsError = class extends BaseError2 {
        constructor({ offset, position, size: size5 }) {
          super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size5}).`, { name: "SliceOffsetOutOfBoundsError" });
        }
      };
      SizeExceedsPaddingSizeError = class extends BaseError2 {
        constructor({ size: size5, targetSize, type }) {
          super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size5}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
        }
      };
      InvalidBytesLengthError = class extends BaseError2 {
        constructor({ size: size5, targetSize, type }) {
          super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size5} ${type} long.`, { name: "InvalidBytesLengthError" });
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/data/pad.js
  function pad(hexOrBytes, { dir, size: size5 = 32 } = {}) {
    if (typeof hexOrBytes === "string")
      return padHex(hexOrBytes, { dir, size: size5 });
    return padBytes(hexOrBytes, { dir, size: size5 });
  }
  function padHex(hex_, { dir, size: size5 = 32 } = {}) {
    if (size5 === null)
      return hex_;
    const hex = hex_.replace("0x", "");
    if (hex.length > size5 * 2)
      throw new SizeExceedsPaddingSizeError({
        size: Math.ceil(hex.length / 2),
        targetSize: size5,
        type: "hex"
      });
    return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size5 * 2, "0")}`;
  }
  function padBytes(bytes, { dir, size: size5 = 32 } = {}) {
    if (size5 === null)
      return bytes;
    if (bytes.length > size5)
      throw new SizeExceedsPaddingSizeError({
        size: bytes.length,
        targetSize: size5,
        type: "bytes"
      });
    const paddedBytes = new Uint8Array(size5);
    for (let i = 0; i < size5; i++) {
      const padEnd = dir === "right";
      paddedBytes[padEnd ? i : size5 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
  }
  var init_pad = __esm({
    "node_modules/viem/_esm/utils/data/pad.js"() {
      init_data();
    }
  });

  // node_modules/viem/_esm/errors/encoding.js
  var IntegerOutOfRangeError, InvalidBytesBooleanError, InvalidHexBooleanError, SizeOverflowError;
  var init_encoding = __esm({
    "node_modules/viem/_esm/errors/encoding.js"() {
      init_base();
      IntegerOutOfRangeError = class extends BaseError2 {
        constructor({ max, min, signed, size: size5, value }) {
          super(`Number "${value}" is not in safe ${size5 ? `${size5 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
        }
      };
      InvalidBytesBooleanError = class extends BaseError2 {
        constructor(bytes) {
          super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
            name: "InvalidBytesBooleanError"
          });
        }
      };
      InvalidHexBooleanError = class extends BaseError2 {
        constructor(hex) {
          super(`Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`, { name: "InvalidHexBooleanError" });
        }
      };
      SizeOverflowError = class extends BaseError2 {
        constructor({ givenSize, maxSize }) {
          super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/data/trim.js
  function trim(hexOrBytes, { dir = "left" } = {}) {
    let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
    let sliceLength = 0;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
        sliceLength++;
      else
        break;
    }
    data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
    if (typeof hexOrBytes === "string") {
      if (data.length === 1 && dir === "right")
        data = `${data}0`;
      return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
    }
    return data;
  }
  var init_trim = __esm({
    "node_modules/viem/_esm/utils/data/trim.js"() {
    }
  });

  // node_modules/viem/_esm/utils/encoding/fromHex.js
  function assertSize(hexOrBytes, { size: size5 }) {
    if (size(hexOrBytes) > size5)
      throw new SizeOverflowError({
        givenSize: size(hexOrBytes),
        maxSize: size5
      });
  }
  function hexToBigInt(hex, opts = {}) {
    const { signed } = opts;
    if (opts.size)
      assertSize(hex, { size: opts.size });
    const value = BigInt(hex);
    if (!signed)
      return value;
    const size5 = (hex.length - 2) / 2;
    const max = (1n << BigInt(size5) * 8n - 1n) - 1n;
    if (value <= max)
      return value;
    return value - BigInt(`0x${"f".padStart(size5 * 2, "f")}`) - 1n;
  }
  function hexToBool(hex_, opts = {}) {
    let hex = hex_;
    if (opts.size) {
      assertSize(hex, { size: opts.size });
      hex = trim(hex);
    }
    if (trim(hex) === "0x00")
      return false;
    if (trim(hex) === "0x01")
      return true;
    throw new InvalidHexBooleanError(hex);
  }
  function hexToNumber(hex, opts = {}) {
    return Number(hexToBigInt(hex, opts));
  }
  var init_fromHex = __esm({
    "node_modules/viem/_esm/utils/encoding/fromHex.js"() {
      init_encoding();
      init_size();
      init_trim();
    }
  });

  // node_modules/viem/_esm/utils/encoding/toHex.js
  function toHex(value, opts = {}) {
    if (typeof value === "number" || typeof value === "bigint")
      return numberToHex(value, opts);
    if (typeof value === "string") {
      return stringToHex(value, opts);
    }
    if (typeof value === "boolean")
      return boolToHex(value, opts);
    return bytesToHex2(value, opts);
  }
  function boolToHex(value, opts = {}) {
    const hex = `0x${Number(value)}`;
    if (typeof opts.size === "number") {
      assertSize(hex, { size: opts.size });
      return pad(hex, { size: opts.size });
    }
    return hex;
  }
  function bytesToHex2(value, opts = {}) {
    let string = "";
    for (let i = 0; i < value.length; i++) {
      string += hexes[value[i]];
    }
    const hex = `0x${string}`;
    if (typeof opts.size === "number") {
      assertSize(hex, { size: opts.size });
      return pad(hex, { dir: "right", size: opts.size });
    }
    return hex;
  }
  function numberToHex(value_, opts = {}) {
    const { signed, size: size5 } = opts;
    const value = BigInt(value_);
    let maxValue;
    if (size5) {
      if (signed)
        maxValue = (1n << BigInt(size5) * 8n - 1n) - 1n;
      else
        maxValue = 2n ** (BigInt(size5) * 8n) - 1n;
    } else if (typeof value_ === "number") {
      maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    }
    const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
    if (maxValue && value > maxValue || value < minValue) {
      const suffix = typeof value_ === "bigint" ? "n" : "";
      throw new IntegerOutOfRangeError({
        max: maxValue ? `${maxValue}${suffix}` : void 0,
        min: `${minValue}${suffix}`,
        signed,
        size: size5,
        value: `${value_}${suffix}`
      });
    }
    const hex = `0x${(signed && value < 0 ? (1n << BigInt(size5 * 8)) + BigInt(value) : value).toString(16)}`;
    if (size5)
      return pad(hex, { size: size5 });
    return hex;
  }
  function stringToHex(value_, opts = {}) {
    const value = encoder.encode(value_);
    return bytesToHex2(value, opts);
  }
  var hexes, encoder;
  var init_toHex = __esm({
    "node_modules/viem/_esm/utils/encoding/toHex.js"() {
      init_encoding();
      init_pad();
      init_fromHex();
      hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
      encoder = /* @__PURE__ */ new TextEncoder();
    }
  });

  // node_modules/viem/_esm/utils/encoding/toBytes.js
  function toBytes2(value, opts = {}) {
    if (typeof value === "number" || typeof value === "bigint")
      return numberToBytes(value, opts);
    if (typeof value === "boolean")
      return boolToBytes(value, opts);
    if (isHex(value))
      return hexToBytes(value, opts);
    return stringToBytes(value, opts);
  }
  function boolToBytes(value, opts = {}) {
    const bytes = new Uint8Array(1);
    bytes[0] = Number(value);
    if (typeof opts.size === "number") {
      assertSize(bytes, { size: opts.size });
      return pad(bytes, { size: opts.size });
    }
    return bytes;
  }
  function charCodeToBase16(char) {
    if (char >= charCodeMap.zero && char <= charCodeMap.nine)
      return char - charCodeMap.zero;
    if (char >= charCodeMap.A && char <= charCodeMap.F)
      return char - (charCodeMap.A - 10);
    if (char >= charCodeMap.a && char <= charCodeMap.f)
      return char - (charCodeMap.a - 10);
    return void 0;
  }
  function hexToBytes(hex_, opts = {}) {
    let hex = hex_;
    if (opts.size) {
      assertSize(hex, { size: opts.size });
      hex = pad(hex, { dir: "right", size: opts.size });
    }
    let hexString = hex.slice(2);
    if (hexString.length % 2)
      hexString = `0${hexString}`;
    const length = hexString.length / 2;
    const bytes = new Uint8Array(length);
    for (let index2 = 0, j = 0; index2 < length; index2++) {
      const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
      const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
      if (nibbleLeft === void 0 || nibbleRight === void 0) {
        throw new BaseError2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
      }
      bytes[index2] = nibbleLeft * 16 + nibbleRight;
    }
    return bytes;
  }
  function numberToBytes(value, opts) {
    const hex = numberToHex(value, opts);
    return hexToBytes(hex);
  }
  function stringToBytes(value, opts = {}) {
    const bytes = encoder2.encode(value);
    if (typeof opts.size === "number") {
      assertSize(bytes, { size: opts.size });
      return pad(bytes, { dir: "right", size: opts.size });
    }
    return bytes;
  }
  var encoder2, charCodeMap;
  var init_toBytes = __esm({
    "node_modules/viem/_esm/utils/encoding/toBytes.js"() {
      init_base();
      init_isHex();
      init_pad();
      init_fromHex();
      init_toHex();
      encoder2 = /* @__PURE__ */ new TextEncoder();
      charCodeMap = {
        zero: 48,
        nine: 57,
        A: 65,
        F: 70,
        a: 97,
        f: 102
      };
    }
  });

  // node_modules/viem/_esm/utils/hash/keccak256.js
  function keccak256(value, to_) {
    const to = to_ || "hex";
    const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes2(value) : value);
    if (to === "bytes")
      return bytes;
    return toHex(bytes);
  }
  var init_keccak256 = __esm({
    "node_modules/viem/_esm/utils/hash/keccak256.js"() {
      init_sha3();
      init_isHex();
      init_toBytes();
      init_toHex();
    }
  });

  // node_modules/viem/_esm/utils/hash/hashSignature.js
  function hashSignature(sig) {
    return hash(sig);
  }
  var hash;
  var init_hashSignature = __esm({
    "node_modules/viem/_esm/utils/hash/hashSignature.js"() {
      init_toBytes();
      init_keccak256();
      hash = (value) => keccak256(toBytes2(value));
    }
  });

  // node_modules/viem/_esm/utils/hash/normalizeSignature.js
  function normalizeSignature(signature) {
    let active = true;
    let current = "";
    let level = 0;
    let result = "";
    let valid = false;
    for (let i = 0; i < signature.length; i++) {
      const char = signature[i];
      if (["(", ")", ","].includes(char))
        active = true;
      if (char === "(")
        level++;
      if (char === ")")
        level--;
      if (!active)
        continue;
      if (level === 0) {
        if (char === " " && ["event", "function", ""].includes(result))
          result = "";
        else {
          result += char;
          if (char === ")") {
            valid = true;
            break;
          }
        }
        continue;
      }
      if (char === " ") {
        if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
          current = "";
          active = false;
        }
        continue;
      }
      result += char;
      current += char;
    }
    if (!valid)
      throw new BaseError2("Unable to normalize signature.");
    return result;
  }
  var init_normalizeSignature = __esm({
    "node_modules/viem/_esm/utils/hash/normalizeSignature.js"() {
      init_base();
    }
  });

  // node_modules/viem/_esm/utils/hash/toSignature.js
  var toSignature;
  var init_toSignature = __esm({
    "node_modules/viem/_esm/utils/hash/toSignature.js"() {
      init_exports();
      init_normalizeSignature();
      toSignature = (def) => {
        const def_ = (() => {
          if (typeof def === "string")
            return def;
          return formatAbiItem(def);
        })();
        return normalizeSignature(def_);
      };
    }
  });

  // node_modules/viem/_esm/utils/hash/toSignatureHash.js
  function toSignatureHash(fn) {
    return hashSignature(toSignature(fn));
  }
  var init_toSignatureHash = __esm({
    "node_modules/viem/_esm/utils/hash/toSignatureHash.js"() {
      init_hashSignature();
      init_toSignature();
    }
  });

  // node_modules/viem/_esm/utils/hash/toEventSelector.js
  var toEventSelector;
  var init_toEventSelector = __esm({
    "node_modules/viem/_esm/utils/hash/toEventSelector.js"() {
      init_toSignatureHash();
      toEventSelector = toSignatureHash;
    }
  });

  // node_modules/viem/_esm/errors/address.js
  var InvalidAddressError;
  var init_address = __esm({
    "node_modules/viem/_esm/errors/address.js"() {
      init_base();
      InvalidAddressError = class extends BaseError2 {
        constructor({ address }) {
          super(`Address "${address}" is invalid.`, {
            metaMessages: [
              "- Address must be a hex value of 20 bytes (40 hex characters).",
              "- Address must match its checksum counterpart."
            ],
            name: "InvalidAddressError"
          });
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/lru.js
  var LruMap;
  var init_lru = __esm({
    "node_modules/viem/_esm/utils/lru.js"() {
      LruMap = class extends Map {
        constructor(size5) {
          super();
          Object.defineProperty(this, "maxSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.maxSize = size5;
        }
        get(key) {
          const value = super.get(key);
          if (super.has(key) && value !== void 0) {
            this.delete(key);
            super.set(key, value);
          }
          return value;
        }
        set(key, value) {
          super.set(key, value);
          if (this.maxSize && this.size > this.maxSize) {
            const firstKey = this.keys().next().value;
            if (firstKey)
              this.delete(firstKey);
          }
          return this;
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/address/getAddress.js
  function checksumAddress(address_, chainId) {
    if (checksumAddressCache.has(`${address_}.${chainId}`))
      return checksumAddressCache.get(`${address_}.${chainId}`);
    const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
    const hash3 = keccak256(stringToBytes(hexAddress), "bytes");
    const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
    for (let i = 0; i < 40; i += 2) {
      if (hash3[i >> 1] >> 4 >= 8 && address[i]) {
        address[i] = address[i].toUpperCase();
      }
      if ((hash3[i >> 1] & 15) >= 8 && address[i + 1]) {
        address[i + 1] = address[i + 1].toUpperCase();
      }
    }
    const result = `0x${address.join("")}`;
    checksumAddressCache.set(`${address_}.${chainId}`, result);
    return result;
  }
  function getAddress(address, chainId) {
    if (!isAddress(address, { strict: false }))
      throw new InvalidAddressError({ address });
    return checksumAddress(address, chainId);
  }
  var checksumAddressCache;
  var init_getAddress = __esm({
    "node_modules/viem/_esm/utils/address/getAddress.js"() {
      init_address();
      init_toBytes();
      init_keccak256();
      init_lru();
      init_isAddress();
      checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
    }
  });

  // node_modules/viem/_esm/utils/address/isAddress.js
  function isAddress(address, options) {
    const { strict = true } = options ?? {};
    const cacheKey2 = `${address}.${strict}`;
    if (isAddressCache.has(cacheKey2))
      return isAddressCache.get(cacheKey2);
    const result = (() => {
      if (!addressRegex.test(address))
        return false;
      if (address.toLowerCase() === address)
        return true;
      if (strict)
        return checksumAddress(address) === address;
      return true;
    })();
    isAddressCache.set(cacheKey2, result);
    return result;
  }
  var addressRegex, isAddressCache;
  var init_isAddress = __esm({
    "node_modules/viem/_esm/utils/address/isAddress.js"() {
      init_lru();
      init_getAddress();
      addressRegex = /^0x[a-fA-F0-9]{40}$/;
      isAddressCache = /* @__PURE__ */ new LruMap(8192);
    }
  });

  // node_modules/viem/_esm/utils/data/concat.js
  function concat(values) {
    if (typeof values[0] === "string")
      return concatHex(values);
    return concatBytes2(values);
  }
  function concatBytes2(values) {
    let length = 0;
    for (const arr of values) {
      length += arr.length;
    }
    const result = new Uint8Array(length);
    let offset = 0;
    for (const arr of values) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }
  function concatHex(values) {
    return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
  }
  var init_concat = __esm({
    "node_modules/viem/_esm/utils/data/concat.js"() {
    }
  });

  // node_modules/viem/_esm/utils/data/slice.js
  function slice(value, start, end, { strict } = {}) {
    if (isHex(value, { strict: false }))
      return sliceHex(value, start, end, {
        strict
      });
    return sliceBytes(value, start, end, {
      strict
    });
  }
  function assertStartOffset(value, start) {
    if (typeof start === "number" && start > 0 && start > size(value) - 1)
      throw new SliceOffsetOutOfBoundsError({
        offset: start,
        position: "start",
        size: size(value)
      });
  }
  function assertEndOffset(value, start, end) {
    if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
      throw new SliceOffsetOutOfBoundsError({
        offset: end,
        position: "end",
        size: size(value)
      });
    }
  }
  function sliceBytes(value_, start, end, { strict } = {}) {
    assertStartOffset(value_, start);
    const value = value_.slice(start, end);
    if (strict)
      assertEndOffset(value, start, end);
    return value;
  }
  function sliceHex(value_, start, end, { strict } = {}) {
    assertStartOffset(value_, start);
    const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
    if (strict)
      assertEndOffset(value, start, end);
    return value;
  }
  var init_slice = __esm({
    "node_modules/viem/_esm/utils/data/slice.js"() {
      init_data();
      init_isHex();
      init_size();
    }
  });

  // node_modules/viem/_esm/utils/regex.js
  var bytesRegex2, integerRegex2;
  var init_regex2 = __esm({
    "node_modules/viem/_esm/utils/regex.js"() {
      bytesRegex2 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
      integerRegex2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
    }
  });

  // node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
  function encodeAbiParameters(params, values) {
    if (params.length !== values.length)
      throw new AbiEncodingLengthMismatchError({
        expectedLength: params.length,
        givenLength: values.length
      });
    const preparedParams = prepareParams({
      params,
      values
    });
    const data = encodeParams(preparedParams);
    if (data.length === 0)
      return "0x";
    return data;
  }
  function prepareParams({ params, values }) {
    const preparedParams = [];
    for (let i = 0; i < params.length; i++) {
      preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
    }
    return preparedParams;
  }
  function prepareParam({ param, value }) {
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return encodeArray(value, { length, param: { ...param, type } });
    }
    if (param.type === "tuple") {
      return encodeTuple(value, {
        param
      });
    }
    if (param.type === "address") {
      return encodeAddress(value);
    }
    if (param.type === "bool") {
      return encodeBool(value);
    }
    if (param.type.startsWith("uint") || param.type.startsWith("int")) {
      const signed = param.type.startsWith("int");
      const [, , size5 = "256"] = integerRegex2.exec(param.type) ?? [];
      return encodeNumber(value, {
        signed,
        size: Number(size5)
      });
    }
    if (param.type.startsWith("bytes")) {
      return encodeBytes(value, { param });
    }
    if (param.type === "string") {
      return encodeString(value);
    }
    throw new InvalidAbiEncodingTypeError(param.type, {
      docsPath: "/docs/contract/encodeAbiParameters"
    });
  }
  function encodeParams(preparedParams) {
    let staticSize = 0;
    for (let i = 0; i < preparedParams.length; i++) {
      const { dynamic, encoded } = preparedParams[i];
      if (dynamic)
        staticSize += 32;
      else
        staticSize += size(encoded);
    }
    const staticParams = [];
    const dynamicParams = [];
    let dynamicSize = 0;
    for (let i = 0; i < preparedParams.length; i++) {
      const { dynamic, encoded } = preparedParams[i];
      if (dynamic) {
        staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
        dynamicParams.push(encoded);
        dynamicSize += size(encoded);
      } else {
        staticParams.push(encoded);
      }
    }
    return concat([...staticParams, ...dynamicParams]);
  }
  function encodeAddress(value) {
    if (!isAddress(value))
      throw new InvalidAddressError({ address: value });
    return { dynamic: false, encoded: padHex(value.toLowerCase()) };
  }
  function encodeArray(value, { length, param }) {
    const dynamic = length === null;
    if (!Array.isArray(value))
      throw new InvalidArrayError(value);
    if (!dynamic && value.length !== length)
      throw new AbiEncodingArrayLengthMismatchError({
        expectedLength: length,
        givenLength: value.length,
        type: `${param.type}[${length}]`
      });
    let dynamicChild = false;
    const preparedParams = [];
    for (let i = 0; i < value.length; i++) {
      const preparedParam = prepareParam({ param, value: value[i] });
      if (preparedParam.dynamic)
        dynamicChild = true;
      preparedParams.push(preparedParam);
    }
    if (dynamic || dynamicChild) {
      const data = encodeParams(preparedParams);
      if (dynamic) {
        const length2 = numberToHex(preparedParams.length, { size: 32 });
        return {
          dynamic: true,
          encoded: preparedParams.length > 0 ? concat([length2, data]) : length2
        };
      }
      if (dynamicChild)
        return { dynamic: true, encoded: data };
    }
    return {
      dynamic: false,
      encoded: concat(preparedParams.map(({ encoded }) => encoded))
    };
  }
  function encodeBytes(value, { param }) {
    const [, paramSize] = param.type.split("bytes");
    const bytesSize = size(value);
    if (!paramSize) {
      let value_ = value;
      if (bytesSize % 32 !== 0)
        value_ = padHex(value_, {
          dir: "right",
          size: Math.ceil((value.length - 2) / 2 / 32) * 32
        });
      return {
        dynamic: true,
        encoded: concat([padHex(numberToHex(bytesSize, { size: 32 })), value_])
      };
    }
    if (bytesSize !== Number.parseInt(paramSize, 10))
      throw new AbiEncodingBytesSizeMismatchError({
        expectedSize: Number.parseInt(paramSize, 10),
        value
      });
    return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
  }
  function encodeBool(value) {
    if (typeof value !== "boolean")
      throw new BaseError2(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
    return { dynamic: false, encoded: padHex(boolToHex(value)) };
  }
  function encodeNumber(value, { signed, size: size5 = 256 }) {
    if (typeof size5 === "number") {
      const max = 2n ** (BigInt(size5) - (signed ? 1n : 0n)) - 1n;
      const min = signed ? -max - 1n : 0n;
      if (value > max || value < min)
        throw new IntegerOutOfRangeError({
          max: max.toString(),
          min: min.toString(),
          signed,
          size: size5 / 8,
          value: value.toString()
        });
    }
    return {
      dynamic: false,
      encoded: numberToHex(value, {
        size: 32,
        signed
      })
    };
  }
  function encodeString(value) {
    const hexValue = stringToHex(value);
    const partsLength = Math.ceil(size(hexValue) / 32);
    const parts = [];
    for (let i = 0; i < partsLength; i++) {
      parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
        dir: "right"
      }));
    }
    return {
      dynamic: true,
      encoded: concat([
        padHex(numberToHex(size(hexValue), { size: 32 })),
        ...parts
      ])
    };
  }
  function encodeTuple(value, { param }) {
    let dynamic = false;
    const preparedParams = [];
    for (let i = 0; i < param.components.length; i++) {
      const param_ = param.components[i];
      const index2 = Array.isArray(value) ? i : param_.name;
      const preparedParam = prepareParam({
        param: param_,
        value: value[index2]
      });
      preparedParams.push(preparedParam);
      if (preparedParam.dynamic)
        dynamic = true;
    }
    return {
      dynamic,
      encoded: dynamic ? encodeParams(preparedParams) : concat(preparedParams.map(({ encoded }) => encoded))
    };
  }
  function getArrayComponents(type) {
    const matches = type.match(/^(.*)\[(\d+)?\]$/);
    return matches ? (
      // Return `null` if the array is dynamic.
      [matches[2] ? Number(matches[2]) : null, matches[1]]
    ) : void 0;
  }
  var init_encodeAbiParameters = __esm({
    "node_modules/viem/_esm/utils/abi/encodeAbiParameters.js"() {
      init_abi();
      init_address();
      init_base();
      init_encoding();
      init_isAddress();
      init_concat();
      init_pad();
      init_size();
      init_slice();
      init_toHex();
      init_regex2();
    }
  });

  // node_modules/viem/_esm/utils/hash/toFunctionSelector.js
  var toFunctionSelector;
  var init_toFunctionSelector = __esm({
    "node_modules/viem/_esm/utils/hash/toFunctionSelector.js"() {
      init_slice();
      init_toSignatureHash();
      toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);
    }
  });

  // node_modules/viem/_esm/utils/abi/getAbiItem.js
  function getAbiItem(parameters) {
    const { abi: abi2, args = [], name } = parameters;
    const isSelector = isHex(name, { strict: false });
    const abiItems = abi2.filter((abiItem) => {
      if (isSelector) {
        if (abiItem.type === "function")
          return toFunctionSelector(abiItem) === name;
        if (abiItem.type === "event")
          return toEventSelector(abiItem) === name;
        return false;
      }
      return "name" in abiItem && abiItem.name === name;
    });
    if (abiItems.length === 0)
      return void 0;
    if (abiItems.length === 1)
      return abiItems[0];
    let matchedAbiItem;
    for (const abiItem of abiItems) {
      if (!("inputs" in abiItem))
        continue;
      if (!args || args.length === 0) {
        if (!abiItem.inputs || abiItem.inputs.length === 0)
          return abiItem;
        continue;
      }
      if (!abiItem.inputs)
        continue;
      if (abiItem.inputs.length === 0)
        continue;
      if (abiItem.inputs.length !== args.length)
        continue;
      const matched = args.every((arg, index2) => {
        const abiParameter = "inputs" in abiItem && abiItem.inputs[index2];
        if (!abiParameter)
          return false;
        return isArgOfType(arg, abiParameter);
      });
      if (matched) {
        if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
          const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
          if (ambiguousTypes)
            throw new AbiItemAmbiguityError({
              abiItem,
              type: ambiguousTypes[0]
            }, {
              abiItem: matchedAbiItem,
              type: ambiguousTypes[1]
            });
        }
        matchedAbiItem = abiItem;
      }
    }
    if (matchedAbiItem)
      return matchedAbiItem;
    return abiItems[0];
  }
  function isArgOfType(arg, abiParameter) {
    const argType = typeof arg;
    const abiParameterType = abiParameter.type;
    switch (abiParameterType) {
      case "address":
        return isAddress(arg, { strict: false });
      case "bool":
        return argType === "boolean";
      case "function":
        return argType === "string";
      case "string":
        return argType === "string";
      default: {
        if (abiParameterType === "tuple" && "components" in abiParameter)
          return Object.values(abiParameter.components).every((component, index2) => {
            return isArgOfType(Object.values(arg)[index2], component);
          });
        if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
          return argType === "number" || argType === "bigint";
        if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
          return argType === "string" || arg instanceof Uint8Array;
        if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
          return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
            ...abiParameter,
            // Pop off `[]` or `[M]` from end of type
            type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
          }));
        }
        return false;
      }
    }
  }
  function getAmbiguousTypes(sourceParameters, targetParameters, args) {
    for (const parameterIndex in sourceParameters) {
      const sourceParameter = sourceParameters[parameterIndex];
      const targetParameter = targetParameters[parameterIndex];
      if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
        return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
      const types = [sourceParameter.type, targetParameter.type];
      const ambiguous = (() => {
        if (types.includes("address") && types.includes("bytes20"))
          return true;
        if (types.includes("address") && types.includes("string"))
          return isAddress(args[parameterIndex], { strict: false });
        if (types.includes("address") && types.includes("bytes"))
          return isAddress(args[parameterIndex], { strict: false });
        return false;
      })();
      if (ambiguous)
        return types;
    }
    return;
  }
  var init_getAbiItem = __esm({
    "node_modules/viem/_esm/utils/abi/getAbiItem.js"() {
      init_abi();
      init_isHex();
      init_isAddress();
      init_toEventSelector();
      init_toFunctionSelector();
    }
  });

  // node_modules/viem/_esm/accounts/utils/parseAccount.js
  function parseAccount(account) {
    if (typeof account === "string")
      return { address: account, type: "json-rpc" };
    return account;
  }
  var init_parseAccount = __esm({
    "node_modules/viem/_esm/accounts/utils/parseAccount.js"() {
    }
  });

  // node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
  function prepareEncodeFunctionData(parameters) {
    const { abi: abi2, args, functionName } = parameters;
    let abiItem = abi2[0];
    if (functionName) {
      const item = getAbiItem({
        abi: abi2,
        args,
        name: functionName
      });
      if (!item)
        throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath2 });
      abiItem = item;
    }
    if (abiItem.type !== "function")
      throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath2 });
    return {
      abi: [abiItem],
      functionName: toFunctionSelector(formatAbiItem2(abiItem))
    };
  }
  var docsPath2;
  var init_prepareEncodeFunctionData = __esm({
    "node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js"() {
      init_abi();
      init_toFunctionSelector();
      init_formatAbiItem2();
      init_getAbiItem();
      docsPath2 = "/docs/contract/encodeFunctionData";
    }
  });

  // node_modules/viem/_esm/utils/abi/encodeFunctionData.js
  function encodeFunctionData(parameters) {
    const { args } = parameters;
    const { abi: abi2, functionName } = (() => {
      if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x"))
        return parameters;
      return prepareEncodeFunctionData(parameters);
    })();
    const abiItem = abi2[0];
    const signature = functionName;
    const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0;
    return concatHex([signature, data ?? "0x"]);
  }
  var init_encodeFunctionData = __esm({
    "node_modules/viem/_esm/utils/abi/encodeFunctionData.js"() {
      init_concat();
      init_encodeAbiParameters();
      init_prepareEncodeFunctionData();
    }
  });

  // node_modules/viem/_esm/constants/solidity.js
  var panicReasons, solidityError, solidityPanic;
  var init_solidity = __esm({
    "node_modules/viem/_esm/constants/solidity.js"() {
      panicReasons = {
        1: "An `assert` condition failed.",
        17: "Arithmetic operation resulted in underflow or overflow.",
        18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
        33: "Attempted to convert to an invalid type.",
        34: "Attempted to access a storage byte array that is incorrectly encoded.",
        49: "Performed `.pop()` on an empty array",
        50: "Array index is out of bounds.",
        65: "Allocated too much memory or created an array which is too large.",
        81: "Attempted to call a zero-initialized variable of internal function type."
      };
      solidityError = {
        inputs: [
          {
            name: "message",
            type: "string"
          }
        ],
        name: "Error",
        type: "error"
      };
      solidityPanic = {
        inputs: [
          {
            name: "reason",
            type: "uint256"
          }
        ],
        name: "Panic",
        type: "error"
      };
    }
  });

  // node_modules/viem/_esm/errors/cursor.js
  var NegativeOffsetError, PositionOutOfBoundsError, RecursiveReadLimitExceededError;
  var init_cursor = __esm({
    "node_modules/viem/_esm/errors/cursor.js"() {
      init_base();
      NegativeOffsetError = class extends BaseError2 {
        constructor({ offset }) {
          super(`Offset \`${offset}\` cannot be negative.`, {
            name: "NegativeOffsetError"
          });
        }
      };
      PositionOutOfBoundsError = class extends BaseError2 {
        constructor({ length, position }) {
          super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
        }
      };
      RecursiveReadLimitExceededError = class extends BaseError2 {
        constructor({ count, limit }) {
          super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/cursor.js
  function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
    const cursor = Object.create(staticCursor);
    cursor.bytes = bytes;
    cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    cursor.positionReadCount = /* @__PURE__ */ new Map();
    cursor.recursiveReadLimit = recursiveReadLimit;
    return cursor;
  }
  var staticCursor;
  var init_cursor2 = __esm({
    "node_modules/viem/_esm/utils/cursor.js"() {
      init_cursor();
      staticCursor = {
        bytes: new Uint8Array(),
        dataView: new DataView(new ArrayBuffer(0)),
        position: 0,
        positionReadCount: /* @__PURE__ */ new Map(),
        recursiveReadCount: 0,
        recursiveReadLimit: Number.POSITIVE_INFINITY,
        assertReadLimit() {
          if (this.recursiveReadCount >= this.recursiveReadLimit)
            throw new RecursiveReadLimitExceededError({
              count: this.recursiveReadCount + 1,
              limit: this.recursiveReadLimit
            });
        },
        assertPosition(position) {
          if (position < 0 || position > this.bytes.length - 1)
            throw new PositionOutOfBoundsError({
              length: this.bytes.length,
              position
            });
        },
        decrementPosition(offset) {
          if (offset < 0)
            throw new NegativeOffsetError({ offset });
          const position = this.position - offset;
          this.assertPosition(position);
          this.position = position;
        },
        getReadCount(position) {
          return this.positionReadCount.get(position || this.position) || 0;
        },
        incrementPosition(offset) {
          if (offset < 0)
            throw new NegativeOffsetError({ offset });
          const position = this.position + offset;
          this.assertPosition(position);
          this.position = position;
        },
        inspectByte(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position);
          return this.bytes[position];
        },
        inspectBytes(length, position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position + length - 1);
          return this.bytes.subarray(position, position + length);
        },
        inspectUint8(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position);
          return this.bytes[position];
        },
        inspectUint16(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position + 1);
          return this.dataView.getUint16(position);
        },
        inspectUint24(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position + 2);
          return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
        },
        inspectUint32(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position + 3);
          return this.dataView.getUint32(position);
        },
        pushByte(byte) {
          this.assertPosition(this.position);
          this.bytes[this.position] = byte;
          this.position++;
        },
        pushBytes(bytes) {
          this.assertPosition(this.position + bytes.length - 1);
          this.bytes.set(bytes, this.position);
          this.position += bytes.length;
        },
        pushUint8(value) {
          this.assertPosition(this.position);
          this.bytes[this.position] = value;
          this.position++;
        },
        pushUint16(value) {
          this.assertPosition(this.position + 1);
          this.dataView.setUint16(this.position, value);
          this.position += 2;
        },
        pushUint24(value) {
          this.assertPosition(this.position + 2);
          this.dataView.setUint16(this.position, value >> 8);
          this.dataView.setUint8(this.position + 2, value & ~4294967040);
          this.position += 3;
        },
        pushUint32(value) {
          this.assertPosition(this.position + 3);
          this.dataView.setUint32(this.position, value);
          this.position += 4;
        },
        readByte() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectByte();
          this.position++;
          return value;
        },
        readBytes(length, size5) {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectBytes(length);
          this.position += size5 ?? length;
          return value;
        },
        readUint8() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectUint8();
          this.position += 1;
          return value;
        },
        readUint16() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectUint16();
          this.position += 2;
          return value;
        },
        readUint24() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectUint24();
          this.position += 3;
          return value;
        },
        readUint32() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectUint32();
          this.position += 4;
          return value;
        },
        get remaining() {
          return this.bytes.length - this.position;
        },
        setPosition(position) {
          const oldPosition = this.position;
          this.assertPosition(position);
          this.position = position;
          return () => this.position = oldPosition;
        },
        _touch() {
          if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
            return;
          const count = this.getReadCount();
          this.positionReadCount.set(this.position, count + 1);
          if (count > 0)
            this.recursiveReadCount++;
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/encoding/fromBytes.js
  function bytesToBigInt(bytes, opts = {}) {
    if (typeof opts.size !== "undefined")
      assertSize(bytes, { size: opts.size });
    const hex = bytesToHex2(bytes, opts);
    return hexToBigInt(hex, opts);
  }
  function bytesToBool(bytes_, opts = {}) {
    let bytes = bytes_;
    if (typeof opts.size !== "undefined") {
      assertSize(bytes, { size: opts.size });
      bytes = trim(bytes);
    }
    if (bytes.length > 1 || bytes[0] > 1)
      throw new InvalidBytesBooleanError(bytes);
    return Boolean(bytes[0]);
  }
  function bytesToNumber(bytes, opts = {}) {
    if (typeof opts.size !== "undefined")
      assertSize(bytes, { size: opts.size });
    const hex = bytesToHex2(bytes, opts);
    return hexToNumber(hex, opts);
  }
  function bytesToString(bytes_, opts = {}) {
    let bytes = bytes_;
    if (typeof opts.size !== "undefined") {
      assertSize(bytes, { size: opts.size });
      bytes = trim(bytes, { dir: "right" });
    }
    return new TextDecoder().decode(bytes);
  }
  var init_fromBytes = __esm({
    "node_modules/viem/_esm/utils/encoding/fromBytes.js"() {
      init_encoding();
      init_trim();
      init_fromHex();
      init_toHex();
    }
  });

  // node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
  function decodeAbiParameters(params, data) {
    const bytes = typeof data === "string" ? hexToBytes(data) : data;
    const cursor = createCursor(bytes);
    if (size(bytes) === 0 && params.length > 0)
      throw new AbiDecodingZeroDataError();
    if (size(data) && size(data) < 32)
      throw new AbiDecodingDataSizeTooSmallError({
        data: typeof data === "string" ? data : bytesToHex2(data),
        params,
        size: size(data)
      });
    let consumed = 0;
    const values = [];
    for (let i = 0; i < params.length; ++i) {
      const param = params[i];
      cursor.setPosition(consumed);
      const [data2, consumed_] = decodeParameter(cursor, param, {
        staticPosition: 0
      });
      consumed += consumed_;
      values.push(data2);
    }
    return values;
  }
  function decodeParameter(cursor, param, { staticPosition }) {
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return decodeArray(cursor, { ...param, type }, { length, staticPosition });
    }
    if (param.type === "tuple")
      return decodeTuple(cursor, param, { staticPosition });
    if (param.type === "address")
      return decodeAddress(cursor);
    if (param.type === "bool")
      return decodeBool(cursor);
    if (param.type.startsWith("bytes"))
      return decodeBytes(cursor, param, { staticPosition });
    if (param.type.startsWith("uint") || param.type.startsWith("int"))
      return decodeNumber(cursor, param);
    if (param.type === "string")
      return decodeString(cursor, { staticPosition });
    throw new InvalidAbiDecodingTypeError(param.type, {
      docsPath: "/docs/contract/decodeAbiParameters"
    });
  }
  function decodeAddress(cursor) {
    const value = cursor.readBytes(32);
    return [checksumAddress(bytesToHex2(sliceBytes(value, -20))), 32];
  }
  function decodeArray(cursor, param, { length, staticPosition }) {
    if (!length) {
      const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      const startOfData = start + sizeOfLength;
      cursor.setPosition(start);
      const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
      const dynamicChild = hasDynamicChild(param);
      let consumed2 = 0;
      const value2 = [];
      for (let i = 0; i < length2; ++i) {
        cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
        const [data, consumed_] = decodeParameter(cursor, param, {
          staticPosition: startOfData
        });
        consumed2 += consumed_;
        value2.push(data);
      }
      cursor.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    if (hasDynamicChild(param)) {
      const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      const value2 = [];
      for (let i = 0; i < length; ++i) {
        cursor.setPosition(start + i * 32);
        const [data] = decodeParameter(cursor, param, {
          staticPosition: start
        });
        value2.push(data);
      }
      cursor.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    let consumed = 0;
    const value = [];
    for (let i = 0; i < length; ++i) {
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: staticPosition + consumed
      });
      consumed += consumed_;
      value.push(data);
    }
    return [value, consumed];
  }
  function decodeBool(cursor) {
    return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
  }
  function decodeBytes(cursor, param, { staticPosition }) {
    const [_, size5] = param.type.split("bytes");
    if (!size5) {
      const offset = bytesToNumber(cursor.readBytes(32));
      cursor.setPosition(staticPosition + offset);
      const length = bytesToNumber(cursor.readBytes(32));
      if (length === 0) {
        cursor.setPosition(staticPosition + 32);
        return ["0x", 32];
      }
      const data = cursor.readBytes(length);
      cursor.setPosition(staticPosition + 32);
      return [bytesToHex2(data), 32];
    }
    const value = bytesToHex2(cursor.readBytes(Number.parseInt(size5, 10), 32));
    return [value, 32];
  }
  function decodeNumber(cursor, param) {
    const signed = param.type.startsWith("int");
    const size5 = Number.parseInt(param.type.split("int")[1] || "256", 10);
    const value = cursor.readBytes(32);
    return [
      size5 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
      32
    ];
  }
  function decodeTuple(cursor, param, { staticPosition }) {
    const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
    const value = hasUnnamedChild ? [] : {};
    let consumed = 0;
    if (hasDynamicChild(param)) {
      const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      for (let i = 0; i < param.components.length; ++i) {
        const component = param.components[i];
        cursor.setPosition(start + consumed);
        const [data, consumed_] = decodeParameter(cursor, component, {
          staticPosition: start
        });
        consumed += consumed_;
        value[hasUnnamedChild ? i : component?.name] = data;
      }
      cursor.setPosition(staticPosition + 32);
      return [value, 32];
    }
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition
      });
      value[hasUnnamedChild ? i : component?.name] = data;
      consumed += consumed_;
    }
    return [value, consumed];
  }
  function decodeString(cursor, { staticPosition }) {
    const offset = bytesToNumber(cursor.readBytes(32));
    const start = staticPosition + offset;
    cursor.setPosition(start);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["", 32];
    }
    const data = cursor.readBytes(length, 32);
    const value = bytesToString(trim(data));
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  function hasDynamicChild(param) {
    const { type } = param;
    if (type === "string")
      return true;
    if (type === "bytes")
      return true;
    if (type.endsWith("[]"))
      return true;
    if (type === "tuple")
      return param.components?.some(hasDynamicChild);
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
      return true;
    return false;
  }
  var sizeOfLength, sizeOfOffset;
  var init_decodeAbiParameters = __esm({
    "node_modules/viem/_esm/utils/abi/decodeAbiParameters.js"() {
      init_abi();
      init_getAddress();
      init_cursor2();
      init_size();
      init_slice();
      init_trim();
      init_fromBytes();
      init_toBytes();
      init_toHex();
      init_encodeAbiParameters();
      sizeOfLength = 32;
      sizeOfOffset = 32;
    }
  });

  // node_modules/viem/_esm/utils/abi/decodeErrorResult.js
  function decodeErrorResult(parameters) {
    const { abi: abi2, data } = parameters;
    const signature = slice(data, 0, 4);
    if (signature === "0x")
      throw new AbiDecodingZeroDataError();
    const abi_ = [...abi2 || [], solidityError, solidityPanic];
    const abiItem = abi_.find((x) => x.type === "error" && signature === toFunctionSelector(formatAbiItem2(x)));
    if (!abiItem)
      throw new AbiErrorSignatureNotFoundError(signature, {
        docsPath: "/docs/contract/decodeErrorResult"
      });
    return {
      abiItem,
      args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice(data, 4)) : void 0,
      errorName: abiItem.name
    };
  }
  var init_decodeErrorResult = __esm({
    "node_modules/viem/_esm/utils/abi/decodeErrorResult.js"() {
      init_solidity();
      init_abi();
      init_slice();
      init_toFunctionSelector();
      init_decodeAbiParameters();
      init_formatAbiItem2();
    }
  });

  // node_modules/viem/_esm/utils/stringify.js
  var stringify;
  var init_stringify = __esm({
    "node_modules/viem/_esm/utils/stringify.js"() {
      stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
        const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
        return typeof replacer === "function" ? replacer(key, value2) : value2;
      }, space);
    }
  });

  // node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js
  function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
    if (!("name" in abiItem))
      return;
    if (!("inputs" in abiItem))
      return;
    if (!abiItem.inputs)
      return;
    return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? stringify(args[i]) : args[i]}`).join(", ")})`;
  }
  var init_formatAbiItemWithArgs = __esm({
    "node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js"() {
      init_stringify();
    }
  });

  // node_modules/viem/_esm/constants/unit.js
  var etherUnits, gweiUnits;
  var init_unit = __esm({
    "node_modules/viem/_esm/constants/unit.js"() {
      etherUnits = {
        gwei: 9,
        wei: 18
      };
      gweiUnits = {
        ether: -9,
        wei: 9
      };
    }
  });

  // node_modules/viem/_esm/utils/unit/formatUnits.js
  function formatUnits(value, decimals) {
    let display = value.toString();
    const negative = display.startsWith("-");
    if (negative)
      display = display.slice(1);
    display = display.padStart(decimals, "0");
    let [integer, fraction] = [
      display.slice(0, display.length - decimals),
      display.slice(display.length - decimals)
    ];
    fraction = fraction.replace(/(0+)$/, "");
    return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
  }
  var init_formatUnits = __esm({
    "node_modules/viem/_esm/utils/unit/formatUnits.js"() {
    }
  });

  // node_modules/viem/_esm/utils/unit/formatEther.js
  function formatEther(wei, unit = "wei") {
    return formatUnits(wei, etherUnits[unit]);
  }
  var init_formatEther = __esm({
    "node_modules/viem/_esm/utils/unit/formatEther.js"() {
      init_unit();
      init_formatUnits();
    }
  });

  // node_modules/viem/_esm/utils/unit/formatGwei.js
  function formatGwei(wei, unit = "wei") {
    return formatUnits(wei, gweiUnits[unit]);
  }
  var init_formatGwei = __esm({
    "node_modules/viem/_esm/utils/unit/formatGwei.js"() {
      init_unit();
      init_formatUnits();
    }
  });

  // node_modules/viem/_esm/errors/stateOverride.js
  function prettyStateMapping(stateMapping) {
    return stateMapping.reduce((pretty, { slot, value }) => {
      return `${pretty}        ${slot}: ${value}
`;
    }, "");
  }
  function prettyStateOverride(stateOverride) {
    return stateOverride.reduce((pretty, { address, ...state }) => {
      let val = `${pretty}    ${address}:
`;
      if (state.nonce)
        val += `      nonce: ${state.nonce}
`;
      if (state.balance)
        val += `      balance: ${state.balance}
`;
      if (state.code)
        val += `      code: ${state.code}
`;
      if (state.state) {
        val += "      state:\n";
        val += prettyStateMapping(state.state);
      }
      if (state.stateDiff) {
        val += "      stateDiff:\n";
        val += prettyStateMapping(state.stateDiff);
      }
      return val;
    }, "  State Override:\n").slice(0, -1);
  }
  var AccountStateConflictError, StateAssignmentConflictError;
  var init_stateOverride = __esm({
    "node_modules/viem/_esm/errors/stateOverride.js"() {
      init_base();
      AccountStateConflictError = class extends BaseError2 {
        constructor({ address }) {
          super(`State for account "${address}" is set multiple times.`, {
            name: "AccountStateConflictError"
          });
        }
      };
      StateAssignmentConflictError = class extends BaseError2 {
        constructor() {
          super("state and stateDiff are set on the same account.", {
            name: "StateAssignmentConflictError"
          });
        }
      };
    }
  });

  // node_modules/viem/_esm/errors/transaction.js
  function prettyPrint(args) {
    const entries = Object.entries(args).map(([key, value]) => {
      if (value === void 0 || value === false)
        return null;
      return [key, value];
    }).filter(Boolean);
    const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
    return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
  }
  var InvalidSerializableTransactionError, TransactionExecutionError, TransactionNotFoundError, TransactionReceiptNotFoundError, TransactionReceiptRevertedError, WaitForTransactionReceiptTimeoutError;
  var init_transaction = __esm({
    "node_modules/viem/_esm/errors/transaction.js"() {
      init_formatEther();
      init_formatGwei();
      init_base();
      InvalidSerializableTransactionError = class extends BaseError2 {
        constructor({ transaction }) {
          super("Cannot infer a transaction type from provided transaction.", {
            metaMessages: [
              "Provided Transaction:",
              "{",
              prettyPrint(transaction),
              "}",
              "",
              "To infer the type, either provide:",
              "- a `type` to the Transaction, or",
              "- an EIP-1559 Transaction with `maxFeePerGas`, or",
              "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
              "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
              "- an EIP-7702 Transaction with `authorizationList`, or",
              "- a Legacy Transaction with `gasPrice`"
            ],
            name: "InvalidSerializableTransactionError"
          });
        }
      };
      TransactionExecutionError = class extends BaseError2 {
        constructor(cause, { account, docsPath: docsPath8, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
          const prettyArgs = prettyPrint({
            chain: chain && `${chain?.name} (id: ${chain?.id})`,
            from: account?.address,
            to,
            value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
            data,
            gas,
            gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
            maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
            maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
            nonce
          });
          super(cause.shortMessage, {
            cause,
            docsPath: docsPath8,
            metaMessages: [
              ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
              "Request Arguments:",
              prettyArgs
            ].filter(Boolean),
            name: "TransactionExecutionError"
          });
          Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.cause = cause;
        }
      };
      TransactionNotFoundError = class extends BaseError2 {
        constructor({ blockHash, blockNumber, blockTag, hash: hash3, index: index2 }) {
          let identifier = "Transaction";
          if (blockTag && index2 !== void 0)
            identifier = `Transaction at block time "${blockTag}" at index "${index2}"`;
          if (blockHash && index2 !== void 0)
            identifier = `Transaction at block hash "${blockHash}" at index "${index2}"`;
          if (blockNumber && index2 !== void 0)
            identifier = `Transaction at block number "${blockNumber}" at index "${index2}"`;
          if (hash3)
            identifier = `Transaction with hash "${hash3}"`;
          super(`${identifier} could not be found.`, {
            name: "TransactionNotFoundError"
          });
        }
      };
      TransactionReceiptNotFoundError = class extends BaseError2 {
        constructor({ hash: hash3 }) {
          super(`Transaction receipt with hash "${hash3}" could not be found. The Transaction may not be processed on a block yet.`, {
            name: "TransactionReceiptNotFoundError"
          });
        }
      };
      TransactionReceiptRevertedError = class extends BaseError2 {
        constructor({ receipt }) {
          super(`Transaction with hash "${receipt.transactionHash}" reverted.`, {
            metaMessages: [
              'The receipt marked the transaction as "reverted". This could mean that the function on the contract you are trying to call threw an error.',
              " ",
              "You can attempt to extract the revert reason by:",
              "- calling the `simulateContract` or `simulateCalls` Action with the `abi` and `functionName` of the contract",
              "- using the `call` Action with raw `data`"
            ],
            name: "TransactionReceiptRevertedError"
          });
          Object.defineProperty(this, "receipt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.receipt = receipt;
        }
      };
      WaitForTransactionReceiptTimeoutError = class extends BaseError2 {
        constructor({ hash: hash3 }) {
          super(`Timed out while waiting for transaction with hash "${hash3}" to be confirmed.`, { name: "WaitForTransactionReceiptTimeoutError" });
        }
      };
    }
  });

  // node_modules/viem/_esm/errors/utils.js
  var getContractAddress, getUrl;
  var init_utils3 = __esm({
    "node_modules/viem/_esm/errors/utils.js"() {
      getContractAddress = (address) => address;
      getUrl = (url) => url;
    }
  });

  // node_modules/viem/_esm/errors/contract.js
  var CallExecutionError, ContractFunctionExecutionError, ContractFunctionRevertedError, ContractFunctionZeroDataError, CounterfactualDeploymentFailedError, RawContractError;
  var init_contract = __esm({
    "node_modules/viem/_esm/errors/contract.js"() {
      init_parseAccount();
      init_solidity();
      init_decodeErrorResult();
      init_formatAbiItem2();
      init_formatAbiItemWithArgs();
      init_getAbiItem();
      init_formatEther();
      init_formatGwei();
      init_abi();
      init_base();
      init_stateOverride();
      init_transaction();
      init_utils3();
      CallExecutionError = class extends BaseError2 {
        constructor(cause, { account: account_, docsPath: docsPath8, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride }) {
          const account = account_ ? parseAccount(account_) : void 0;
          let prettyArgs = prettyPrint({
            from: account?.address,
            to,
            value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
            data,
            gas,
            gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
            maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
            maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
            nonce
          });
          if (stateOverride) {
            prettyArgs += `
${prettyStateOverride(stateOverride)}`;
          }
          super(cause.shortMessage, {
            cause,
            docsPath: docsPath8,
            metaMessages: [
              ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
              "Raw Call Arguments:",
              prettyArgs
            ].filter(Boolean),
            name: "CallExecutionError"
          });
          Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.cause = cause;
        }
      };
      ContractFunctionExecutionError = class extends BaseError2 {
        constructor(cause, { abi: abi2, args, contractAddress, docsPath: docsPath8, functionName, sender }) {
          const abiItem = getAbiItem({ abi: abi2, args, name: functionName });
          const formattedArgs = abiItem ? formatAbiItemWithArgs({
            abiItem,
            args,
            includeFunctionName: false,
            includeName: false
          }) : void 0;
          const functionWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
          const prettyArgs = prettyPrint({
            address: contractAddress && getContractAddress(contractAddress),
            function: functionWithParams,
            args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
            sender
          });
          super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
            cause,
            docsPath: docsPath8,
            metaMessages: [
              ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
              prettyArgs && "Contract Call:",
              prettyArgs
            ].filter(Boolean),
            name: "ContractFunctionExecutionError"
          });
          Object.defineProperty(this, "abi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "contractAddress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "formattedArgs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "functionName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "sender", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.abi = abi2;
          this.args = args;
          this.cause = cause;
          this.contractAddress = contractAddress;
          this.functionName = functionName;
          this.sender = sender;
        }
      };
      ContractFunctionRevertedError = class extends BaseError2 {
        constructor({ abi: abi2, data, functionName, message }) {
          let cause;
          let decodedData;
          let metaMessages;
          let reason;
          if (data && data !== "0x") {
            try {
              decodedData = decodeErrorResult({ abi: abi2, data });
              const { abiItem, errorName, args: errorArgs } = decodedData;
              if (errorName === "Error") {
                reason = errorArgs[0];
              } else if (errorName === "Panic") {
                const [firstArg] = errorArgs;
                reason = panicReasons[firstArg];
              } else {
                const errorWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
                const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
                  abiItem,
                  args: errorArgs,
                  includeFunctionName: false,
                  includeName: false
                }) : void 0;
                metaMessages = [
                  errorWithParams ? `Error: ${errorWithParams}` : "",
                  formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
                ];
              }
            } catch (err) {
              cause = err;
            }
          } else if (message)
            reason = message;
          let signature;
          if (cause instanceof AbiErrorSignatureNotFoundError) {
            signature = cause.signature;
            metaMessages = [
              `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
              "Make sure you are using the correct ABI and that the error exists on it.",
              `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
            ];
          }
          super(reason && reason !== "execution reverted" || signature ? [
            `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
            reason || signature
          ].join("\n") : `The contract function "${functionName}" reverted.`, {
            cause,
            metaMessages,
            name: "ContractFunctionRevertedError"
          });
          Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "raw", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "reason", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "signature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.data = decodedData;
          this.raw = data;
          this.reason = reason;
          this.signature = signature;
        }
      };
      ContractFunctionZeroDataError = class extends BaseError2 {
        constructor({ functionName }) {
          super(`The contract function "${functionName}" returned no data ("0x").`, {
            metaMessages: [
              "This could be due to any of the following:",
              `  - The contract does not have the function "${functionName}",`,
              "  - The parameters passed to the contract function may be invalid, or",
              "  - The address is not a contract."
            ],
            name: "ContractFunctionZeroDataError"
          });
        }
      };
      CounterfactualDeploymentFailedError = class extends BaseError2 {
        constructor({ factory }) {
          super(`Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`, {
            metaMessages: [
              "Please ensure:",
              "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
              "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
            ],
            name: "CounterfactualDeploymentFailedError"
          });
        }
      };
      RawContractError = class extends BaseError2 {
        constructor({ data, message }) {
          super(message || "", { name: "RawContractError" });
          Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
          });
          Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.data = data;
        }
      };
    }
  });

  // node_modules/viem/_esm/errors/request.js
  var HttpRequestError, RpcRequestError, TimeoutError;
  var init_request = __esm({
    "node_modules/viem/_esm/errors/request.js"() {
      init_stringify();
      init_base();
      init_utils3();
      HttpRequestError = class extends BaseError2 {
        constructor({ body, cause, details, headers, status, url }) {
          super("HTTP request failed.", {
            cause,
            details,
            metaMessages: [
              status && `Status: ${status}`,
              `URL: ${getUrl(url)}`,
              body && `Request body: ${stringify(body)}`
            ].filter(Boolean),
            name: "HttpRequestError"
          });
          Object.defineProperty(this, "body", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.body = body;
          this.headers = headers;
          this.status = status;
          this.url = url;
        }
      };
      RpcRequestError = class extends BaseError2 {
        constructor({ body, error, url }) {
          super("RPC Request failed.", {
            cause: error,
            details: error.message,
            metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
            name: "RpcRequestError"
          });
          Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.code = error.code;
          this.data = error.data;
          this.url = url;
        }
      };
      TimeoutError = class extends BaseError2 {
        constructor({ body, url }) {
          super("The request took too long to respond.", {
            details: "The request timed out.",
            metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
            name: "TimeoutError"
          });
          Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.url = url;
        }
      };
    }
  });

  // node_modules/viem/_esm/errors/rpc.js
  var unknownErrorCode, RpcError, ProviderRpcError, ParseRpcError, InvalidRequestRpcError, MethodNotFoundRpcError, InvalidParamsRpcError, InternalRpcError, InvalidInputRpcError, ResourceNotFoundRpcError, ResourceUnavailableRpcError, TransactionRejectedRpcError, MethodNotSupportedRpcError, LimitExceededRpcError, JsonRpcVersionUnsupportedError, UserRejectedRequestError, UnauthorizedProviderError, UnsupportedProviderMethodError, ProviderDisconnectedError, ChainDisconnectedError, SwitchChainError, UnsupportedNonOptionalCapabilityError, UnsupportedChainIdError, DuplicateIdError, UnknownBundleIdError, BundleTooLargeError, AtomicReadyWalletRejectedUpgradeError, AtomicityNotSupportedError, UnknownRpcError;
  var init_rpc = __esm({
    "node_modules/viem/_esm/errors/rpc.js"() {
      init_base();
      init_request();
      unknownErrorCode = -1;
      RpcError = class extends BaseError2 {
        constructor(cause, { code, docsPath: docsPath8, metaMessages, name, shortMessage }) {
          super(shortMessage, {
            cause,
            docsPath: docsPath8,
            metaMessages: metaMessages || cause?.metaMessages,
            name: name || "RpcError"
          });
          Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.name = name || cause.name;
          this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
        }
      };
      ProviderRpcError = class extends RpcError {
        constructor(cause, options) {
          super(cause, options);
          Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          this.data = options.data;
        }
      };
      ParseRpcError = class _ParseRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _ParseRpcError.code,
            name: "ParseRpcError",
            shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
          });
        }
      };
      Object.defineProperty(ParseRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32700
      });
      InvalidRequestRpcError = class _InvalidRequestRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _InvalidRequestRpcError.code,
            name: "InvalidRequestRpcError",
            shortMessage: "JSON is not a valid request object."
          });
        }
      };
      Object.defineProperty(InvalidRequestRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32600
      });
      MethodNotFoundRpcError = class _MethodNotFoundRpcError extends RpcError {
        constructor(cause, { method } = {}) {
          super(cause, {
            code: _MethodNotFoundRpcError.code,
            name: "MethodNotFoundRpcError",
            shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
          });
        }
      };
      Object.defineProperty(MethodNotFoundRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32601
      });
      InvalidParamsRpcError = class _InvalidParamsRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _InvalidParamsRpcError.code,
            name: "InvalidParamsRpcError",
            shortMessage: [
              "Invalid parameters were provided to the RPC method.",
              "Double check you have provided the correct parameters."
            ].join("\n")
          });
        }
      };
      Object.defineProperty(InvalidParamsRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32602
      });
      InternalRpcError = class _InternalRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _InternalRpcError.code,
            name: "InternalRpcError",
            shortMessage: "An internal error was received."
          });
        }
      };
      Object.defineProperty(InternalRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32603
      });
      InvalidInputRpcError = class _InvalidInputRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _InvalidInputRpcError.code,
            name: "InvalidInputRpcError",
            shortMessage: [
              "Missing or invalid parameters.",
              "Double check you have provided the correct parameters."
            ].join("\n")
          });
        }
      };
      Object.defineProperty(InvalidInputRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32e3
      });
      ResourceNotFoundRpcError = class _ResourceNotFoundRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _ResourceNotFoundRpcError.code,
            name: "ResourceNotFoundRpcError",
            shortMessage: "Requested resource not found."
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "ResourceNotFoundRpcError"
          });
        }
      };
      Object.defineProperty(ResourceNotFoundRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32001
      });
      ResourceUnavailableRpcError = class _ResourceUnavailableRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _ResourceUnavailableRpcError.code,
            name: "ResourceUnavailableRpcError",
            shortMessage: "Requested resource not available."
          });
        }
      };
      Object.defineProperty(ResourceUnavailableRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32002
      });
      TransactionRejectedRpcError = class _TransactionRejectedRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _TransactionRejectedRpcError.code,
            name: "TransactionRejectedRpcError",
            shortMessage: "Transaction creation failed."
          });
        }
      };
      Object.defineProperty(TransactionRejectedRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32003
      });
      MethodNotSupportedRpcError = class _MethodNotSupportedRpcError extends RpcError {
        constructor(cause, { method } = {}) {
          super(cause, {
            code: _MethodNotSupportedRpcError.code,
            name: "MethodNotSupportedRpcError",
            shortMessage: `Method${method ? ` "${method}"` : ""} is not supported.`
          });
        }
      };
      Object.defineProperty(MethodNotSupportedRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32004
      });
      LimitExceededRpcError = class _LimitExceededRpcError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _LimitExceededRpcError.code,
            name: "LimitExceededRpcError",
            shortMessage: "Request exceeds defined limit."
          });
        }
      };
      Object.defineProperty(LimitExceededRpcError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32005
      });
      JsonRpcVersionUnsupportedError = class _JsonRpcVersionUnsupportedError extends RpcError {
        constructor(cause) {
          super(cause, {
            code: _JsonRpcVersionUnsupportedError.code,
            name: "JsonRpcVersionUnsupportedError",
            shortMessage: "Version of JSON-RPC protocol is not supported."
          });
        }
      };
      Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: -32006
      });
      UserRejectedRequestError = class _UserRejectedRequestError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _UserRejectedRequestError.code,
            name: "UserRejectedRequestError",
            shortMessage: "User rejected the request."
          });
        }
      };
      Object.defineProperty(UserRejectedRequestError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 4001
      });
      UnauthorizedProviderError = class _UnauthorizedProviderError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _UnauthorizedProviderError.code,
            name: "UnauthorizedProviderError",
            shortMessage: "The requested method and/or account has not been authorized by the user."
          });
        }
      };
      Object.defineProperty(UnauthorizedProviderError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 4100
      });
      UnsupportedProviderMethodError = class _UnsupportedProviderMethodError extends ProviderRpcError {
        constructor(cause, { method } = {}) {
          super(cause, {
            code: _UnsupportedProviderMethodError.code,
            name: "UnsupportedProviderMethodError",
            shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
          });
        }
      };
      Object.defineProperty(UnsupportedProviderMethodError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 4200
      });
      ProviderDisconnectedError = class _ProviderDisconnectedError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _ProviderDisconnectedError.code,
            name: "ProviderDisconnectedError",
            shortMessage: "The Provider is disconnected from all chains."
          });
        }
      };
      Object.defineProperty(ProviderDisconnectedError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 4900
      });
      ChainDisconnectedError = class _ChainDisconnectedError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _ChainDisconnectedError.code,
            name: "ChainDisconnectedError",
            shortMessage: "The Provider is not connected to the requested chain."
          });
        }
      };
      Object.defineProperty(ChainDisconnectedError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 4901
      });
      SwitchChainError = class _SwitchChainError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _SwitchChainError.code,
            name: "SwitchChainError",
            shortMessage: "An error occurred when attempting to switch chain."
          });
        }
      };
      Object.defineProperty(SwitchChainError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 4902
      });
      UnsupportedNonOptionalCapabilityError = class _UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _UnsupportedNonOptionalCapabilityError.code,
            name: "UnsupportedNonOptionalCapabilityError",
            shortMessage: "This Wallet does not support a capability that was not marked as optional."
          });
        }
      };
      Object.defineProperty(UnsupportedNonOptionalCapabilityError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 5700
      });
      UnsupportedChainIdError = class _UnsupportedChainIdError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _UnsupportedChainIdError.code,
            name: "UnsupportedChainIdError",
            shortMessage: "This Wallet does not support the requested chain ID."
          });
        }
      };
      Object.defineProperty(UnsupportedChainIdError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 5710
      });
      DuplicateIdError = class _DuplicateIdError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _DuplicateIdError.code,
            name: "DuplicateIdError",
            shortMessage: "There is already a bundle submitted with this ID."
          });
        }
      };
      Object.defineProperty(DuplicateIdError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 5720
      });
      UnknownBundleIdError = class _UnknownBundleIdError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _UnknownBundleIdError.code,
            name: "UnknownBundleIdError",
            shortMessage: "This bundle id is unknown / has not been submitted"
          });
        }
      };
      Object.defineProperty(UnknownBundleIdError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 5730
      });
      BundleTooLargeError = class _BundleTooLargeError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _BundleTooLargeError.code,
            name: "BundleTooLargeError",
            shortMessage: "The call bundle is too large for the Wallet to process."
          });
        }
      };
      Object.defineProperty(BundleTooLargeError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 5740
      });
      AtomicReadyWalletRejectedUpgradeError = class _AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _AtomicReadyWalletRejectedUpgradeError.code,
            name: "AtomicReadyWalletRejectedUpgradeError",
            shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
          });
        }
      };
      Object.defineProperty(AtomicReadyWalletRejectedUpgradeError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 5750
      });
      AtomicityNotSupportedError = class _AtomicityNotSupportedError extends ProviderRpcError {
        constructor(cause) {
          super(cause, {
            code: _AtomicityNotSupportedError.code,
            name: "AtomicityNotSupportedError",
            shortMessage: "The wallet does not support atomic execution but the request requires it."
          });
        }
      };
      Object.defineProperty(AtomicityNotSupportedError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 5760
      });
      UnknownRpcError = class extends RpcError {
        constructor(cause) {
          super(cause, {
            name: "UnknownRpcError",
            shortMessage: "An unknown RPC error occurred."
          });
        }
      };
    }
  });

  // node_modules/@noble/hashes/esm/hmac.js
  var HMAC, hmac;
  var init_hmac = __esm({
    "node_modules/@noble/hashes/esm/hmac.js"() {
      init_utils();
      HMAC = class extends Hash {
        constructor(hash3, _key) {
          super();
          this.finished = false;
          this.destroyed = false;
          ahash(hash3);
          const key = toBytes(_key);
          this.iHash = hash3.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("Expected instance of class which extends utils.Hash");
          this.blockLen = this.iHash.blockLen;
          this.outputLen = this.iHash.outputLen;
          const blockLen = this.blockLen;
          const pad4 = new Uint8Array(blockLen);
          pad4.set(key.length > blockLen ? hash3.create().update(key).digest() : key);
          for (let i = 0; i < pad4.length; i++)
            pad4[i] ^= 54;
          this.iHash.update(pad4);
          this.oHash = hash3.create();
          for (let i = 0; i < pad4.length; i++)
            pad4[i] ^= 54 ^ 92;
          this.oHash.update(pad4);
          clean(pad4);
        }
        update(buf) {
          aexists(this);
          this.iHash.update(buf);
          return this;
        }
        digestInto(out) {
          aexists(this);
          abytes(out, this.outputLen);
          this.finished = true;
          this.iHash.digestInto(out);
          this.oHash.update(out);
          this.oHash.digestInto(out);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to || (to = Object.create(Object.getPrototypeOf(this), {}));
          const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
          to.oHash = oHash._cloneInto(to.oHash);
          to.iHash = iHash._cloneInto(to.iHash);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
        destroy() {
          this.destroyed = true;
          this.oHash.destroy();
          this.iHash.destroy();
        }
      };
      hmac = (hash3, key, message) => new HMAC(hash3, key).update(message).digest();
      hmac.create = (hash3, key) => new HMAC(hash3, key);
    }
  });

  // node_modules/@noble/curves/esm/abstract/utils.js
  function isBytes2(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function abytes2(item) {
    if (!isBytes2(item))
      throw new Error("Uint8Array expected");
  }
  function abool(title, value) {
    if (typeof value !== "boolean")
      throw new Error(title + " boolean expected, got " + value);
  }
  function numberToHexUnpadded(num2) {
    const hex = num2.toString(16);
    return hex.length & 1 ? "0" + hex : hex;
  }
  function hexToNumber2(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return hex === "" ? _0n2 : BigInt("0x" + hex);
  }
  function bytesToHex3(bytes) {
    abytes2(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += hexes2[bytes[i]];
    }
    return hex;
  }
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  function hexToBytes2(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    if (hasHexBuiltin)
      return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber2(bytesToHex3(bytes));
  }
  function bytesToNumberLE(bytes) {
    abytes2(bytes);
    return hexToNumber2(bytesToHex3(Uint8Array.from(bytes).reverse()));
  }
  function numberToBytesBE(n, len) {
    return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === "string") {
      try {
        res = hexToBytes2(hex);
      } catch (e) {
        throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
      }
    } else if (isBytes2(hex)) {
      res = Uint8Array.from(hex);
    } else {
      throw new Error(title + " must be hex string or Uint8Array");
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(title + " of length " + expectedLength + " expected, got " + len);
    return res;
  }
  function concatBytes3(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes2(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad4 = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad4);
      pad4 += a.length;
    }
    return res;
  }
  function utf8ToBytes2(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n2; n >>= _1n2, len += 1)
      ;
    return len;
  }
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== "number" || hashLen < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset = () => {
      v.fill(1);
      k.fill(0);
      i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b);
    const reseed = (seed = u8n(0)) => {
      k = h(u8fr([0]), seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(u8fr([1]), seed);
      v = h();
    };
    const gen2 = () => {
      if (i++ >= 1e3)
        throw new Error("drbg: tried 1000 values");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes3(...out);
    };
    const genUntil = (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen2())))
        reseed();
      reset();
      return res;
    };
    return genUntil;
  }
  function validateObject(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
      const checkVal = validatorFns[type];
      if (typeof checkVal !== "function")
        throw new Error("invalid validator function");
      const val = object[fieldName];
      if (isOptional && val === void 0)
        return;
      if (!checkVal(val, object)) {
        throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
      }
    };
    for (const [fieldName, type] of Object.entries(validators))
      checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
      checkField(fieldName, type, true);
    return object;
  }
  function memoized(fn) {
    const map = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map.set(arg, computed);
      return computed;
    };
  }
  var _0n2, _1n2, hasHexBuiltin, hexes2, asciis, isPosBig, bitMask, u8n, u8fr, validatorFns;
  var init_utils4 = __esm({
    "node_modules/@noble/curves/esm/abstract/utils.js"() {
      _0n2 = /* @__PURE__ */ BigInt(0);
      _1n2 = /* @__PURE__ */ BigInt(1);
      hasHexBuiltin = // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function";
      hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      isPosBig = (n) => typeof n === "bigint" && _0n2 <= n;
      bitMask = (n) => (_1n2 << BigInt(n)) - _1n2;
      u8n = (len) => new Uint8Array(len);
      u8fr = (arr) => Uint8Array.from(arr);
      validatorFns = {
        bigint: (val) => typeof val === "bigint",
        function: (val) => typeof val === "function",
        boolean: (val) => typeof val === "boolean",
        string: (val) => typeof val === "string",
        stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
        isSafeInteger: (val) => Number.isSafeInteger(val),
        array: (val) => Array.isArray(val),
        field: (val, object) => object.Fp.isValid(val),
        hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
      };
    }
  });

  // node_modules/@noble/curves/esm/abstract/modular.js
  function mod(a, b) {
    const result = a % b;
    return result >= _0n3 ? result : b + result;
  }
  function pow2(x, power, modulo) {
    let res = x;
    while (power-- > _0n3) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number, modulo) {
    if (number === _0n3)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n3)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n3, y = _1n3, u = _1n3, v = _0n3;
    while (a !== _0n3) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n3)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function sqrt3mod4(Fp, n) {
    const p1div4 = (Fp.ORDER + _1n3) / _4n;
    const root = Fp.pow(n, p1div4);
    if (!Fp.eql(Fp.sqr(root), n))
      throw new Error("Cannot find square root");
    return root;
  }
  function sqrt5mod8(Fp, n) {
    const p5div8 = (Fp.ORDER - _5n) / _8n;
    const n2 = Fp.mul(n, _2n2);
    const v = Fp.pow(n2, p5div8);
    const nv = Fp.mul(n, v);
    const i = Fp.mul(Fp.mul(nv, _2n2), v);
    const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
    if (!Fp.eql(Fp.sqr(root), n))
      throw new Error("Cannot find square root");
    return root;
  }
  function tonelliShanks(P) {
    if (P < BigInt(3))
      throw new Error("sqrt is not defined for small field");
    let Q = P - _1n3;
    let S = 0;
    while (Q % _2n2 === _0n3) {
      Q /= _2n2;
      S++;
    }
    let Z = _2n2;
    const _Fp = Field(P);
    while (FpLegendre(_Fp, Z) === 1) {
      if (Z++ > 1e3)
        throw new Error("Cannot find square root: probably non-prime P");
    }
    if (S === 1)
      return sqrt3mod4;
    let cc = _Fp.pow(Z, Q);
    const Q1div2 = (Q + _1n3) / _2n2;
    return function tonelliSlow(Fp, n) {
      if (Fp.is0(n))
        return n;
      if (FpLegendre(Fp, n) !== 1)
        throw new Error("Cannot find square root");
      let M = S;
      let c = Fp.mul(Fp.ONE, cc);
      let t2 = Fp.pow(n, Q);
      let R = Fp.pow(n, Q1div2);
      while (!Fp.eql(t2, Fp.ONE)) {
        if (Fp.is0(t2))
          return Fp.ZERO;
        let i = 1;
        let t_tmp = Fp.sqr(t2);
        while (!Fp.eql(t_tmp, Fp.ONE)) {
          i++;
          t_tmp = Fp.sqr(t_tmp);
          if (i === M)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n3 << BigInt(M - i - 1);
        const b = Fp.pow(c, exponent);
        M = i;
        c = Fp.sqr(b);
        t2 = Fp.mul(t2, c);
        R = Fp.mul(R, b);
      }
      return R;
    };
  }
  function FpSqrt(P) {
    if (P % _4n === _3n)
      return sqrt3mod4;
    if (P % _8n === _5n)
      return sqrt5mod8;
    return tonelliShanks(P);
  }
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "isSafeInteger",
      BITS: "isSafeInteger"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    return validateObject(field, opts);
  }
  function FpPow(Fp, num2, power) {
    if (power < _0n3)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n3)
      return Fp.ONE;
    if (power === _1n3)
      return num2;
    let p = Fp.ONE;
    let d = num2;
    while (power > _0n3) {
      if (power & _1n3)
        p = Fp.mul(p, d);
      d = Fp.sqr(d);
      power >>= _1n3;
    }
    return p;
  }
  function FpInvertBatch(Fp, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num2, i) => {
      if (Fp.is0(num2))
        return acc;
      inverted[i] = acc;
      return Fp.mul(acc, num2);
    }, Fp.ONE);
    const invertedAcc = Fp.inv(multipliedAcc);
    nums.reduceRight((acc, num2, i) => {
      if (Fp.is0(num2))
        return acc;
      inverted[i] = Fp.mul(acc, inverted[i]);
      return Fp.mul(acc, num2);
    }, invertedAcc);
    return inverted;
  }
  function FpLegendre(Fp, n) {
    const p1mod2 = (Fp.ORDER - _1n3) / _2n2;
    const powered = Fp.pow(n, p1mod2);
    const yes = Fp.eql(powered, Fp.ONE);
    const zero = Fp.eql(powered, Fp.ZERO);
    const no = Fp.eql(powered, Fp.neg(Fp.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function nLength(n, nBitLength) {
    if (nBitLength !== void 0)
      anumber(nBitLength);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
    if (ORDER <= _0n3)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
    if (BYTES > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let sqrtP;
    const f = Object.freeze({
      ORDER,
      isLE: isLE2,
      BITS,
      BYTES,
      MASK: bitMask(BITS),
      ZERO: _0n3,
      ONE: _1n3,
      create: (num2) => mod(num2, ORDER),
      isValid: (num2) => {
        if (typeof num2 !== "bigint")
          throw new Error("invalid field element: expected bigint, got " + typeof num2);
        return _0n3 <= num2 && num2 < ORDER;
      },
      is0: (num2) => num2 === _0n3,
      isOdd: (num2) => (num2 & _1n3) === _1n3,
      neg: (num2) => mod(-num2, ORDER),
      eql: (lhs, rhs) => lhs === rhs,
      sqr: (num2) => mod(num2 * num2, ORDER),
      add: (lhs, rhs) => mod(lhs + rhs, ORDER),
      sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
      mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
      pow: (num2, power) => FpPow(f, num2, power),
      div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
      // Same as above, but doesn't normalize
      sqrN: (num2) => num2 * num2,
      addN: (lhs, rhs) => lhs + rhs,
      subN: (lhs, rhs) => lhs - rhs,
      mulN: (lhs, rhs) => lhs * rhs,
      inv: (num2) => invert(num2, ORDER),
      sqrt: redef.sqrt || ((n) => {
        if (!sqrtP)
          sqrtP = FpSqrt(ORDER);
        return sqrtP(f, n);
      }),
      toBytes: (num2) => isLE2 ? numberToBytesLE(num2, BYTES) : numberToBytesBE(num2, BYTES),
      fromBytes: (bytes) => {
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        return isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
      },
      // TODO: we don't need it here, move out to separate fn
      invertBatch: (lst) => FpInvertBatch(f, lst),
      // We can't move this out because Fp6, Fp12 implement it
      // and it's unclear what to return in there.
      cmov: (a, b, c) => c ? b : a
    });
    return Object.freeze(f);
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE2 = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num2 = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
    const reduced = mod(num2, fieldOrder - _1n3) + _1n3;
    return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }
  var _0n3, _1n3, _2n2, _3n, _4n, _5n, _8n, FIELD_FIELDS;
  var init_modular = __esm({
    "node_modules/@noble/curves/esm/abstract/modular.js"() {
      init_utils();
      init_utils4();
      _0n3 = BigInt(0);
      _1n3 = BigInt(1);
      _2n2 = /* @__PURE__ */ BigInt(2);
      _3n = /* @__PURE__ */ BigInt(3);
      _4n = /* @__PURE__ */ BigInt(4);
      _5n = /* @__PURE__ */ BigInt(5);
      _8n = /* @__PURE__ */ BigInt(8);
      FIELD_FIELDS = [
        "create",
        "isValid",
        "is0",
        "neg",
        "inv",
        "sqrt",
        "sqr",
        "eql",
        "add",
        "sub",
        "mul",
        "pow",
        "div",
        "addN",
        "subN",
        "mulN",
        "sqrN"
      ];
    }
  });

  // node_modules/@noble/curves/esm/abstract/curve.js
  function constTimeNegate(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  function calcWOpts(W, scalarBits) {
    validateW(W, scalarBits);
    const windows = Math.ceil(scalarBits / W) + 1;
    const windowSize = 2 ** (W - 1);
    const maxNumber = 2 ** W;
    const mask = bitMask(W);
    const shiftBy = BigInt(W);
    return { windows, windowSize, mask, maxNumber, shiftBy };
  }
  function calcOffsets(n, window2, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n & mask);
    let nextN = n >> shiftBy;
    if (wbits > windowSize) {
      wbits -= maxNumber;
      nextN += _1n4;
    }
    const offsetStart = window2 * windowSize;
    const offset = offsetStart + Math.abs(wbits) - 1;
    const isZero = wbits === 0;
    const isNeg = wbits < 0;
    const isNegF = window2 % 2 !== 0;
    const offsetF = offsetStart;
    return { nextN, offset, isZero, isNeg, isNegF, offsetF };
  }
  function validateMSMPoints(points, c) {
    if (!Array.isArray(points))
      throw new Error("array expected");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      if (!field.isValid(s))
        throw new Error("invalid scalar at index " + i);
    });
  }
  function getW(P) {
    return pointWindowSizes.get(P) || 1;
  }
  function wNAF(c, bits) {
    return {
      constTimeNegate,
      hasPrecomputes(elm) {
        return getW(elm) !== 1;
      },
      // non-const time multiplication ladder
      unsafeLadder(elm, n, p = c.ZERO) {
        let d = elm;
        while (n > _0n4) {
          if (n & _1n4)
            p = p.add(d);
          d = d.double();
          n >>= _1n4;
        }
        return p;
      },
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @param elm Point instance
       * @param W window size
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(elm, W) {
        const { windows, windowSize } = calcWOpts(W, bits);
        const points = [];
        let p = elm;
        let base = p;
        for (let window2 = 0; window2 < windows; window2++) {
          base = p;
          points.push(base);
          for (let i = 1; i < windowSize; i++) {
            base = base.add(p);
            points.push(base);
          }
          p = base.double();
        }
        return points;
      },
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @returns real and fake (for const-time) points
       */
      wNAF(W, precomputes, n) {
        let p = c.ZERO;
        let f = c.BASE;
        const wo = calcWOpts(W, bits);
        for (let window2 = 0; window2 < wo.windows; window2++) {
          const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
          n = nextN;
          if (isZero) {
            f = f.add(constTimeNegate(isNegF, precomputes[offsetF]));
          } else {
            p = p.add(constTimeNegate(isNeg, precomputes[offset]));
          }
        }
        return { p, f };
      },
      /**
       * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @param acc accumulator point to add result of multiplication
       * @returns point
       */
      wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
        const wo = calcWOpts(W, bits);
        for (let window2 = 0; window2 < wo.windows; window2++) {
          if (n === _0n4)
            break;
          const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
          n = nextN;
          if (isZero) {
            continue;
          } else {
            const item = precomputes[offset];
            acc = acc.add(isNeg ? item.negate() : item);
          }
        }
        return acc;
      },
      getPrecomputes(W, P, transform) {
        let comp = pointPrecomputes.get(P);
        if (!comp) {
          comp = this.precomputeWindow(P, W);
          if (W !== 1)
            pointPrecomputes.set(P, transform(comp));
        }
        return comp;
      },
      wNAFCached(P, n, transform) {
        const W = getW(P);
        return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
      },
      wNAFCachedUnsafe(P, n, transform, prev) {
        const W = getW(P);
        if (W === 1)
          return this.unsafeLadder(P, n, prev);
        return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
      },
      // We calculate precomputes for elliptic curve point multiplication
      // using windowed method. This specifies window size and
      // stores precomputed values. Usually only base point would be precomputed.
      setWindowSize(P, W) {
        validateW(W, bits);
        pointWindowSizes.set(P, W);
        pointPrecomputes.delete(P);
      }
    };
  }
  function pippenger(c, fieldN, points, scalars) {
    validateMSMPoints(points, c);
    validateMSMScalars(scalars, fieldN);
    const plength = points.length;
    const slength = scalars.length;
    if (plength !== slength)
      throw new Error("arrays of points and scalars must have equal length");
    const zero = c.ZERO;
    const wbits = bitLen(BigInt(plength));
    let windowSize = 1;
    if (wbits > 12)
      windowSize = wbits - 3;
    else if (wbits > 4)
      windowSize = wbits - 2;
    else if (wbits > 0)
      windowSize = 2;
    const MASK = bitMask(windowSize);
    const buckets = new Array(Number(MASK) + 1).fill(zero);
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(zero);
      for (let j = 0; j < slength; j++) {
        const scalar = scalars[j];
        const wbits2 = Number(scalar >> BigInt(i) & MASK);
        buckets[wbits2] = buckets[wbits2].add(points[j]);
      }
      let resI = zero;
      for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
        sumI = sumI.add(buckets[j]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j = 0; j < windowSize; j++)
          sum = sum.double();
    }
    return sum;
  }
  function validateBasic(curve) {
    validateField(curve.Fp);
    validateObject(curve, {
      n: "bigint",
      h: "bigint",
      Gx: "field",
      Gy: "field"
    }, {
      nBitLength: "isSafeInteger",
      nByteLength: "isSafeInteger"
    });
    return Object.freeze({
      ...nLength(curve.n, curve.nBitLength),
      ...curve,
      ...{ p: curve.Fp.ORDER }
    });
  }
  var _0n4, _1n4, pointPrecomputes, pointWindowSizes;
  var init_curve = __esm({
    "node_modules/@noble/curves/esm/abstract/curve.js"() {
      init_modular();
      init_utils4();
      _0n4 = BigInt(0);
      _1n4 = BigInt(1);
      pointPrecomputes = /* @__PURE__ */ new WeakMap();
      pointWindowSizes = /* @__PURE__ */ new WeakMap();
    }
  });

  // node_modules/@noble/curves/esm/abstract/weierstrass.js
  function validateSigVerOpts(opts) {
    if (opts.lowS !== void 0)
      abool("lowS", opts.lowS);
    if (opts.prehash !== void 0)
      abool("prehash", opts.prehash);
  }
  function validatePointOpts(curve) {
    const opts = validateBasic(curve);
    validateObject(opts, {
      a: "field",
      b: "field"
    }, {
      allowInfinityPoint: "boolean",
      allowedPrivateKeyLengths: "array",
      clearCofactor: "function",
      fromBytes: "function",
      isTorsionFree: "function",
      toBytes: "function",
      wrapPrivateKey: "boolean"
    });
    const { endo, Fp, a } = opts;
    if (endo) {
      if (!Fp.eql(a, Fp.ZERO)) {
        throw new Error("invalid endo: CURVE.a must be 0");
      }
      if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
        throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
      }
    }
    return Object.freeze({ ...opts });
  }
  function numToSizedHex(num2, size5) {
    return bytesToHex3(numberToBytesBE(num2, size5));
  }
  function weierstrassPoints(opts) {
    const CURVE = validatePointOpts(opts);
    const { Fp } = CURVE;
    const Fn = Field(CURVE.n, CURVE.nBitLength);
    const toBytes4 = CURVE.toBytes || ((_c, point, _isCompressed) => {
      const a = point.toAffine();
      return concatBytes3(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
    });
    const fromBytes4 = CURVE.fromBytes || ((bytes) => {
      const tail = bytes.subarray(1);
      const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
      const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
      return { x, y };
    });
    function weierstrassEquation(x) {
      const { a, b } = CURVE;
      const x2 = Fp.sqr(x);
      const x3 = Fp.mul(x2, x);
      return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
    }
    function isValidXY(x, y) {
      const left = Fp.sqr(y);
      const right = weierstrassEquation(x);
      return Fp.eql(left, right);
    }
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
    const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
    if (Fp.is0(Fp.add(_4a3, _27b2)))
      throw new Error("bad curve params: a or b");
    function isWithinCurveOrder(num2) {
      return inRange(num2, _1n5, CURVE.n);
    }
    function normPrivateKeyToScalar(key) {
      const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
      if (lengths && typeof key !== "bigint") {
        if (isBytes2(key))
          key = bytesToHex3(key);
        if (typeof key !== "string" || !lengths.includes(key.length))
          throw new Error("invalid private key");
        key = key.padStart(nByteLength * 2, "0");
      }
      let num2;
      try {
        num2 = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
      } catch (error) {
        throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
      }
      if (wrapPrivateKey)
        num2 = mod(num2, N);
      aInRange("private key", num2, _1n5, N);
      return num2;
    }
    function aprjpoint(other) {
      if (!(other instanceof Point2))
        throw new Error("ProjectivePoint expected");
    }
    const toAffineMemo = memoized((p, iz) => {
      const { px: x, py: y, pz: z } = p;
      if (Fp.eql(z, Fp.ONE))
        return { x, y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(z);
      const ax = Fp.mul(x, iz);
      const ay = Fp.mul(y, iz);
      const zz = Fp.mul(z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    });
    const assertValidMemo = memoized((p) => {
      if (p.is0()) {
        if (CURVE.allowInfinityPoint && !Fp.is0(p.py))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not FE");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    class Point2 {
      constructor(px, py, pz) {
        if (px == null || !Fp.isValid(px))
          throw new Error("x required");
        if (py == null || !Fp.isValid(py) || Fp.is0(py))
          throw new Error("y required");
        if (pz == null || !Fp.isValid(pz))
          throw new Error("z required");
        this.px = px;
        this.py = py;
        this.pz = pz;
        Object.freeze(this);
      }
      // Does not validate if the point is on-curve.
      // Use fromHex instead, or call assertValidity() later.
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point2)
          throw new Error("projective point not allowed");
        const is0 = (i) => Fp.eql(i, Fp.ZERO);
        if (is0(x) && is0(y))
          return Point2.ZERO;
        return new Point2(x, y, Fp.ONE);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       * Takes a bunch of Projective Points but executes only one
       * inversion on all of them. Inversion is very slow operation,
       * so this improves performance massively.
       * Optimization: converts a list of projective points to a list of identical points with Z=1.
       */
      static normalizeZ(points) {
        const toInv = FpInvertBatch(Fp, points.map((p) => p.pz));
        return points.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
      }
      /**
       * Converts hash string or Uint8Array to Point.
       * @param hex short/long ECDSA hex
       */
      static fromHex(hex) {
        const P = Point2.fromAffine(fromBytes4(ensureBytes("pointHex", hex)));
        P.assertValidity();
        return P;
      }
      // Multiplies generator point by privateKey.
      static fromPrivateKey(privateKey) {
        return Point2.BASE.multiply(normPrivateKeyToScalar(privateKey));
      }
      // Multiscalar Multiplication
      static msm(points, scalars) {
        return pippenger(Point2, Fn, points, scalars);
      }
      // "Private method", don't use it directly
      _setWindowSize(windowSize) {
        wnaf.setWindowSize(this, windowSize);
      }
      // A point on curve is valid if it conforms to equation.
      assertValidity() {
        assertValidMemo(this);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (Fp.isOdd)
          return !Fp.isOdd(y);
        throw new Error("Field doesn't support isOdd");
      }
      /**
       * Compare one point to another.
       */
      equals(other) {
        aprjpoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
        const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
        return U1 && U2;
      }
      /**
       * Flips point to one corresponding to (x, -y) in Affine coordinates.
       */
      negate() {
        return new Point2(this.px, Fp.neg(this.py), this.pz);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a, b } = CURVE;
        const b3 = Fp.mul(b, _3n2);
        const { px: X1, py: Y1, pz: Z1 } = this;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        let t0 = Fp.mul(X1, X1);
        let t1 = Fp.mul(Y1, Y1);
        let t2 = Fp.mul(Z1, Z1);
        let t3 = Fp.mul(X1, Y1);
        t3 = Fp.add(t3, t3);
        Z3 = Fp.mul(X1, Z1);
        Z3 = Fp.add(Z3, Z3);
        X3 = Fp.mul(a, Z3);
        Y3 = Fp.mul(b3, t2);
        Y3 = Fp.add(X3, Y3);
        X3 = Fp.sub(t1, Y3);
        Y3 = Fp.add(t1, Y3);
        Y3 = Fp.mul(X3, Y3);
        X3 = Fp.mul(t3, X3);
        Z3 = Fp.mul(b3, Z3);
        t2 = Fp.mul(a, t2);
        t3 = Fp.sub(t0, t2);
        t3 = Fp.mul(a, t3);
        t3 = Fp.add(t3, Z3);
        Z3 = Fp.add(t0, t0);
        t0 = Fp.add(Z3, t0);
        t0 = Fp.add(t0, t2);
        t0 = Fp.mul(t0, t3);
        Y3 = Fp.add(Y3, t0);
        t2 = Fp.mul(Y1, Z1);
        t2 = Fp.add(t2, t2);
        t0 = Fp.mul(t2, t3);
        X3 = Fp.sub(X3, t0);
        Z3 = Fp.mul(t2, t1);
        Z3 = Fp.add(Z3, Z3);
        Z3 = Fp.add(Z3, Z3);
        return new Point2(X3, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        aprjpoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        const a = CURVE.a;
        const b3 = Fp.mul(CURVE.b, _3n2);
        let t0 = Fp.mul(X1, X2);
        let t1 = Fp.mul(Y1, Y2);
        let t2 = Fp.mul(Z1, Z2);
        let t3 = Fp.add(X1, Y1);
        let t4 = Fp.add(X2, Y2);
        t3 = Fp.mul(t3, t4);
        t4 = Fp.add(t0, t1);
        t3 = Fp.sub(t3, t4);
        t4 = Fp.add(X1, Z1);
        let t5 = Fp.add(X2, Z2);
        t4 = Fp.mul(t4, t5);
        t5 = Fp.add(t0, t2);
        t4 = Fp.sub(t4, t5);
        t5 = Fp.add(Y1, Z1);
        X3 = Fp.add(Y2, Z2);
        t5 = Fp.mul(t5, X3);
        X3 = Fp.add(t1, t2);
        t5 = Fp.sub(t5, X3);
        Z3 = Fp.mul(a, t4);
        X3 = Fp.mul(b3, t2);
        Z3 = Fp.add(X3, Z3);
        X3 = Fp.sub(t1, Z3);
        Z3 = Fp.add(t1, Z3);
        Y3 = Fp.mul(X3, Z3);
        t1 = Fp.add(t0, t0);
        t1 = Fp.add(t1, t0);
        t2 = Fp.mul(a, t2);
        t4 = Fp.mul(b3, t4);
        t1 = Fp.add(t1, t2);
        t2 = Fp.sub(t0, t2);
        t2 = Fp.mul(a, t2);
        t4 = Fp.add(t4, t2);
        t0 = Fp.mul(t1, t4);
        Y3 = Fp.add(Y3, t0);
        t0 = Fp.mul(t5, t4);
        X3 = Fp.mul(t3, X3);
        X3 = Fp.sub(X3, t0);
        t0 = Fp.mul(t3, t1);
        Z3 = Fp.mul(t5, Z3);
        Z3 = Fp.add(Z3, t0);
        return new Point2(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point2.ZERO);
      }
      wNAF(n) {
        return wnaf.wNAFCached(this, n, Point2.normalizeZ);
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed private key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(sc) {
        const { endo: endo2, n: N } = CURVE;
        aInRange("scalar", sc, _0n5, N);
        const I = Point2.ZERO;
        if (sc === _0n5)
          return I;
        if (this.is0() || sc === _1n5)
          return this;
        if (!endo2 || wnaf.hasPrecomputes(this))
          return wnaf.wNAFCachedUnsafe(this, sc, Point2.normalizeZ);
        let { k1neg, k1, k2neg, k2 } = endo2.splitScalar(sc);
        let k1p = I;
        let k2p = I;
        let d = this;
        while (k1 > _0n5 || k2 > _0n5) {
          if (k1 & _1n5)
            k1p = k1p.add(d);
          if (k2 & _1n5)
            k2p = k2p.add(d);
          d = d.double();
          k1 >>= _1n5;
          k2 >>= _1n5;
        }
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new Point2(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
        return k1p.add(k2p);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        const { endo: endo2, n: N } = CURVE;
        aInRange("scalar", scalar, _1n5, N);
        let point, fake;
        if (endo2) {
          const { k1neg, k1, k2neg, k2 } = endo2.splitScalar(scalar);
          let { p: k1p, f: f1p } = this.wNAF(k1);
          let { p: k2p, f: f2p } = this.wNAF(k2);
          k1p = wnaf.constTimeNegate(k1neg, k1p);
          k2p = wnaf.constTimeNegate(k2neg, k2p);
          k2p = new Point2(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
          point = k1p.add(k2p);
          fake = f1p.add(f2p);
        } else {
          const { p, f } = this.wNAF(scalar);
          point = p;
          fake = f;
        }
        return Point2.normalizeZ([point, fake])[0];
      }
      /**
       * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
       * Not using Strauss-Shamir trick: precomputation tables are faster.
       * The trick could be useful if both P and Q are not G (not in our case).
       * @returns non-zero affine point
       */
      multiplyAndAddUnsafe(Q, a, b) {
        const G = Point2.BASE;
        const mul = (P, a2) => a2 === _0n5 || a2 === _1n5 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
        const sum = mul(this, a).add(mul(Q, b));
        return sum.is0() ? void 0 : sum;
      }
      // Converts Projective point to affine (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      // (x, y, z) ∋ (x=x/z, y=y/z)
      toAffine(iz) {
        return toAffineMemo(this, iz);
      }
      isTorsionFree() {
        const { h: cofactor, isTorsionFree } = CURVE;
        if (cofactor === _1n5)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point2, this);
        throw new Error("isTorsionFree() has not been declared for the elliptic curve");
      }
      clearCofactor() {
        const { h: cofactor, clearCofactor } = CURVE;
        if (cofactor === _1n5)
          return this;
        if (clearCofactor)
          return clearCofactor(Point2, this);
        return this.multiplyUnsafe(CURVE.h);
      }
      toRawBytes(isCompressed = true) {
        abool("isCompressed", isCompressed);
        this.assertValidity();
        return toBytes4(Point2, this, isCompressed);
      }
      toHex(isCompressed = true) {
        abool("isCompressed", isCompressed);
        return bytesToHex3(this.toRawBytes(isCompressed));
      }
    }
    Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy, Fp.ONE);
    Point2.ZERO = new Point2(Fp.ZERO, Fp.ONE, Fp.ZERO);
    const { endo, nBitLength } = CURVE;
    const wnaf = wNAF(Point2, endo ? Math.ceil(nBitLength / 2) : nBitLength);
    return {
      CURVE,
      ProjectivePoint: Point2,
      normPrivateKeyToScalar,
      weierstrassEquation,
      isWithinCurveOrder
    };
  }
  function validateOpts(curve) {
    const opts = validateBasic(curve);
    validateObject(opts, {
      hash: "hash",
      hmac: "function",
      randomBytes: "function"
    }, {
      bits2int: "function",
      bits2int_modN: "function",
      lowS: "boolean"
    });
    return Object.freeze({ lowS: true, ...opts });
  }
  function weierstrass(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { Fp, n: CURVE_ORDER, nByteLength, nBitLength } = CURVE;
    const compressedLen = Fp.BYTES + 1;
    const uncompressedLen = 2 * Fp.BYTES + 1;
    function modN2(a) {
      return mod(a, CURVE_ORDER);
    }
    function invN(a) {
      return invert(a, CURVE_ORDER);
    }
    const { ProjectivePoint: Point2, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
      ...CURVE,
      toBytes(_c, point, isCompressed) {
        const a = point.toAffine();
        const x = Fp.toBytes(a.x);
        const cat = concatBytes3;
        abool("isCompressed", isCompressed);
        if (isCompressed) {
          return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
        } else {
          return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
        }
      },
      fromBytes(bytes) {
        const len = bytes.length;
        const head = bytes[0];
        const tail = bytes.subarray(1);
        if (len === compressedLen && (head === 2 || head === 3)) {
          const x = bytesToNumberBE(tail);
          if (!inRange(x, _1n5, Fp.ORDER))
            throw new Error("Point is not on curve");
          const y2 = weierstrassEquation(x);
          let y;
          try {
            y = Fp.sqrt(y2);
          } catch (sqrtError) {
            const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
            throw new Error("Point is not on curve" + suffix);
          }
          const isYOdd = (y & _1n5) === _1n5;
          const isHeadOdd = (head & 1) === 1;
          if (isHeadOdd !== isYOdd)
            y = Fp.neg(y);
          return { x, y };
        } else if (len === uncompressedLen && head === 4) {
          const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
          const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
          return { x, y };
        } else {
          const cl = compressedLen;
          const ul = uncompressedLen;
          throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
        }
      }
    });
    function isBiggerThanHalfOrder(number) {
      const HALF = CURVE_ORDER >> _1n5;
      return number > HALF;
    }
    function normalizeS(s) {
      return isBiggerThanHalfOrder(s) ? modN2(-s) : s;
    }
    const slcNum = (b, from14, to) => bytesToNumberBE(b.slice(from14, to));
    class Signature {
      constructor(r, s, recovery) {
        aInRange("r", r, _1n5, CURVE_ORDER);
        aInRange("s", s, _1n5, CURVE_ORDER);
        this.r = r;
        this.s = s;
        if (recovery != null)
          this.recovery = recovery;
        Object.freeze(this);
      }
      // pair (bytes of r, bytes of s)
      static fromCompact(hex) {
        const l = nByteLength;
        hex = ensureBytes("compactSignature", hex, l * 2);
        return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
      }
      // DER encoded ECDSA signature
      // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
      static fromDER(hex) {
        const { r, s } = DER.toSig(ensureBytes("DER", hex));
        return new Signature(r, s);
      }
      /**
       * @todo remove
       * @deprecated
       */
      assertValidity() {
      }
      addRecoveryBit(recovery) {
        return new Signature(this.r, this.s, recovery);
      }
      recoverPublicKey(msgHash) {
        const { r, s, recovery: rec } = this;
        const h = bits2int_modN(ensureBytes("msgHash", msgHash));
        if (rec == null || ![0, 1, 2, 3].includes(rec))
          throw new Error("recovery id invalid");
        const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
        if (radj >= Fp.ORDER)
          throw new Error("recovery id 2 or 3 invalid");
        const prefix = (rec & 1) === 0 ? "02" : "03";
        const R = Point2.fromHex(prefix + numToSizedHex(radj, Fp.BYTES));
        const ir = invN(radj);
        const u1 = modN2(-h * ir);
        const u2 = modN2(s * ir);
        const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
          throw new Error("point at infinify");
        Q.assertValidity();
        return Q;
      }
      // Signatures should be low-s, to prevent malleability.
      hasHighS() {
        return isBiggerThanHalfOrder(this.s);
      }
      normalizeS() {
        return this.hasHighS() ? new Signature(this.r, modN2(-this.s), this.recovery) : this;
      }
      // DER-encoded
      toDERRawBytes() {
        return hexToBytes2(this.toDERHex());
      }
      toDERHex() {
        return DER.hexFromSig(this);
      }
      // padded bytes of r, then padded bytes of s
      toCompactRawBytes() {
        return hexToBytes2(this.toCompactHex());
      }
      toCompactHex() {
        const l = nByteLength;
        return numToSizedHex(this.r, l) + numToSizedHex(this.s, l);
      }
    }
    const utils = {
      isValidPrivateKey(privateKey) {
        try {
          normPrivateKeyToScalar(privateKey);
          return true;
        } catch (error) {
          return false;
        }
      },
      normPrivateKeyToScalar,
      /**
       * Produces cryptographically secure private key from random of size
       * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
       */
      randomPrivateKey: () => {
        const length = getMinHashLength(CURVE.n);
        return mapHashToField(CURVE.randomBytes(length), CURVE.n);
      },
      /**
       * Creates precompute table for an arbitrary EC point. Makes point "cached".
       * Allows to massively speed-up `point.multiply(scalar)`.
       * @returns cached point
       * @example
       * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
       * fast.multiply(privKey); // much faster ECDH now
       */
      precompute(windowSize = 8, point = Point2.BASE) {
        point._setWindowSize(windowSize);
        point.multiply(BigInt(3));
        return point;
      }
    };
    function getPublicKey(privateKey, isCompressed = true) {
      return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    function isProbPub(item) {
      if (typeof item === "bigint")
        return false;
      if (item instanceof Point2)
        return true;
      const arr = ensureBytes("key", item);
      const len = arr.length;
      const fpl = Fp.BYTES;
      const compLen = fpl + 1;
      const uncompLen = 2 * fpl + 1;
      if (CURVE.allowedPrivateKeyLengths || nByteLength === compLen) {
        return void 0;
      } else {
        return len === compLen || len === uncompLen;
      }
    }
    function getSharedSecret(privateA, publicB, isCompressed = true) {
      if (isProbPub(privateA) === true)
        throw new Error("first arg must be private key");
      if (isProbPub(publicB) === false)
        throw new Error("second arg must be public key");
      const b = Point2.fromHex(publicB);
      return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    const bits2int = CURVE.bits2int || function(bytes) {
      if (bytes.length > 8192)
        throw new Error("input is too large");
      const num2 = bytesToNumberBE(bytes);
      const delta = bytes.length * 8 - nBitLength;
      return delta > 0 ? num2 >> BigInt(delta) : num2;
    };
    const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
      return modN2(bits2int(bytes));
    };
    const ORDER_MASK = bitMask(nBitLength);
    function int2octets(num2) {
      aInRange("num < 2^" + nBitLength, num2, _0n5, ORDER_MASK);
      return numberToBytesBE(num2, nByteLength);
    }
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
      if (["recovered", "canonical"].some((k) => k in opts))
        throw new Error("sign() legacy options not supported");
      const { hash: hash3, randomBytes: randomBytes2 } = CURVE;
      let { lowS, prehash, extraEntropy: ent } = opts;
      if (lowS == null)
        lowS = true;
      msgHash = ensureBytes("msgHash", msgHash);
      validateSigVerOpts(opts);
      if (prehash)
        msgHash = ensureBytes("prehashed msgHash", hash3(msgHash));
      const h1int = bits2int_modN(msgHash);
      const d = normPrivateKeyToScalar(privateKey);
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (ent != null && ent !== false) {
        const e = ent === true ? randomBytes2(Fp.BYTES) : ent;
        seedArgs.push(ensureBytes("extraEntropy", e));
      }
      const seed = concatBytes3(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int(kBytes);
        if (!isWithinCurveOrder(k))
          return;
        const ik = invN(k);
        const q = Point2.BASE.multiply(k).toAffine();
        const r = modN2(q.x);
        if (r === _0n5)
          return;
        const s = modN2(ik * modN2(m + r * d));
        if (s === _0n5)
          return;
        let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n5);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = normalizeS(s);
          recovery ^= 1;
        }
        return new Signature(r, normS, recovery);
      }
      return { seed, k2sig };
    }
    const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
    const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
    function sign(msgHash, privKey, opts = defaultSigOpts) {
      const { seed, k2sig } = prepSig(msgHash, privKey, opts);
      const C = CURVE;
      const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
      return drbg(seed, k2sig);
    }
    Point2.BASE._setWindowSize(8);
    function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
      const sg = signature;
      msgHash = ensureBytes("msgHash", msgHash);
      publicKey = ensureBytes("publicKey", publicKey);
      const { lowS, prehash, format } = opts;
      validateSigVerOpts(opts);
      if ("strict" in opts)
        throw new Error("options.strict was renamed to lowS");
      if (format !== void 0 && format !== "compact" && format !== "der")
        throw new Error("format must be compact or der");
      const isHex2 = typeof sg === "string" || isBytes2(sg);
      const isObj = !isHex2 && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
      if (!isHex2 && !isObj)
        throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
      let _sig = void 0;
      let P;
      try {
        if (isObj)
          _sig = new Signature(sg.r, sg.s);
        if (isHex2) {
          try {
            if (format !== "compact")
              _sig = Signature.fromDER(sg);
          } catch (derError) {
            if (!(derError instanceof DER.Err))
              throw derError;
          }
          if (!_sig && format !== "der")
            _sig = Signature.fromCompact(sg);
        }
        P = Point2.fromHex(publicKey);
      } catch (error) {
        return false;
      }
      if (!_sig)
        return false;
      if (lowS && _sig.hasHighS())
        return false;
      if (prehash)
        msgHash = CURVE.hash(msgHash);
      const { r, s } = _sig;
      const h = bits2int_modN(msgHash);
      const is = invN(s);
      const u1 = modN2(h * is);
      const u2 = modN2(r * is);
      const R = Point2.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
      if (!R)
        return false;
      const v = modN2(R.x);
      return v === r;
    }
    return {
      CURVE,
      getPublicKey,
      getSharedSecret,
      sign,
      verify,
      ProjectivePoint: Point2,
      Signature,
      utils
    };
  }
  function SWUFpSqrtRatio(Fp, Z) {
    const q = Fp.ORDER;
    let l = _0n5;
    for (let o = q - _1n5; o % _2n3 === _0n5; o /= _2n3)
      l += _1n5;
    const c1 = l;
    const _2n_pow_c1_1 = _2n3 << c1 - _1n5 - _1n5;
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n3;
    const c2 = (q - _1n5) / _2n_pow_c1;
    const c3 = (c2 - _1n5) / _2n3;
    const c4 = _2n_pow_c1 - _1n5;
    const c5 = _2n_pow_c1_1;
    const c6 = Fp.pow(Z, c2);
    const c7 = Fp.pow(Z, (c2 + _1n5) / _2n3);
    let sqrtRatio = (u, v) => {
      let tv1 = c6;
      let tv2 = Fp.pow(v, c4);
      let tv3 = Fp.sqr(tv2);
      tv3 = Fp.mul(tv3, v);
      let tv5 = Fp.mul(u, tv3);
      tv5 = Fp.pow(tv5, c3);
      tv5 = Fp.mul(tv5, tv2);
      tv2 = Fp.mul(tv5, v);
      tv3 = Fp.mul(tv5, u);
      let tv4 = Fp.mul(tv3, tv2);
      tv5 = Fp.pow(tv4, c5);
      let isQR = Fp.eql(tv5, Fp.ONE);
      tv2 = Fp.mul(tv3, c7);
      tv5 = Fp.mul(tv4, tv1);
      tv3 = Fp.cmov(tv2, tv3, isQR);
      tv4 = Fp.cmov(tv5, tv4, isQR);
      for (let i = c1; i > _1n5; i--) {
        let tv52 = i - _2n3;
        tv52 = _2n3 << tv52 - _1n5;
        let tvv5 = Fp.pow(tv4, tv52);
        const e1 = Fp.eql(tvv5, Fp.ONE);
        tv2 = Fp.mul(tv3, tv1);
        tv1 = Fp.mul(tv1, tv1);
        tvv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, e1);
        tv4 = Fp.cmov(tvv5, tv4, e1);
      }
      return { isValid: isQR, value: tv3 };
    };
    if (Fp.ORDER % _4n2 === _3n2) {
      const c12 = (Fp.ORDER - _3n2) / _4n2;
      const c22 = Fp.sqrt(Fp.neg(Z));
      sqrtRatio = (u, v) => {
        let tv1 = Fp.sqr(v);
        const tv2 = Fp.mul(u, v);
        tv1 = Fp.mul(tv1, tv2);
        let y1 = Fp.pow(tv1, c12);
        y1 = Fp.mul(y1, tv2);
        const y2 = Fp.mul(y1, c22);
        const tv3 = Fp.mul(Fp.sqr(y1), v);
        const isQR = Fp.eql(tv3, u);
        let y = Fp.cmov(y2, y1, isQR);
        return { isValid: isQR, value: y };
      };
    }
    return sqrtRatio;
  }
  function mapToCurveSimpleSWU(Fp, opts) {
    validateField(Fp);
    if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
    if (!Fp.isOdd)
      throw new Error("Fp.isOdd is not implemented!");
    return (u) => {
      let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
      tv1 = Fp.sqr(u);
      tv1 = Fp.mul(tv1, opts.Z);
      tv2 = Fp.sqr(tv1);
      tv2 = Fp.add(tv2, tv1);
      tv3 = Fp.add(tv2, Fp.ONE);
      tv3 = Fp.mul(tv3, opts.B);
      tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
      tv4 = Fp.mul(tv4, opts.A);
      tv2 = Fp.sqr(tv3);
      tv6 = Fp.sqr(tv4);
      tv5 = Fp.mul(tv6, opts.A);
      tv2 = Fp.add(tv2, tv5);
      tv2 = Fp.mul(tv2, tv3);
      tv6 = Fp.mul(tv6, tv4);
      tv5 = Fp.mul(tv6, opts.B);
      tv2 = Fp.add(tv2, tv5);
      x = Fp.mul(tv1, tv3);
      const { isValid, value } = sqrtRatio(tv2, tv6);
      y = Fp.mul(tv1, u);
      y = Fp.mul(y, value);
      x = Fp.cmov(x, tv3, isValid);
      y = Fp.cmov(y, value, isValid);
      const e1 = Fp.isOdd(u) === Fp.isOdd(y);
      y = Fp.cmov(Fp.neg(y), y, e1);
      const tv4_inv = FpInvertBatch(Fp, [tv4], true)[0];
      x = Fp.mul(x, tv4_inv);
      return { x, y };
    };
  }
  var DERErr, DER, _0n5, _1n5, _2n3, _3n2, _4n2;
  var init_weierstrass = __esm({
    "node_modules/@noble/curves/esm/abstract/weierstrass.js"() {
      init_curve();
      init_modular();
      init_utils4();
      DERErr = class extends Error {
        constructor(m = "") {
          super(m);
        }
      };
      DER = {
        // asn.1 DER encoding utils
        Err: DERErr,
        // Basic building block is TLV (Tag-Length-Value)
        _tlv: {
          encode: (tag, data) => {
            const { Err: E } = DER;
            if (tag < 0 || tag > 256)
              throw new E("tlv.encode: wrong tag");
            if (data.length & 1)
              throw new E("tlv.encode: unpadded data");
            const dataLen = data.length / 2;
            const len = numberToHexUnpadded(dataLen);
            if (len.length / 2 & 128)
              throw new E("tlv.encode: long form length too big");
            const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
            const t2 = numberToHexUnpadded(tag);
            return t2 + lenLen + len + data;
          },
          // v - value, l - left bytes (unparsed)
          decode(tag, data) {
            const { Err: E } = DER;
            let pos = 0;
            if (tag < 0 || tag > 256)
              throw new E("tlv.encode: wrong tag");
            if (data.length < 2 || data[pos++] !== tag)
              throw new E("tlv.decode: wrong tlv");
            const first = data[pos++];
            const isLong = !!(first & 128);
            let length = 0;
            if (!isLong)
              length = first;
            else {
              const lenLen = first & 127;
              if (!lenLen)
                throw new E("tlv.decode(long): indefinite length not supported");
              if (lenLen > 4)
                throw new E("tlv.decode(long): byte length is too big");
              const lengthBytes = data.subarray(pos, pos + lenLen);
              if (lengthBytes.length !== lenLen)
                throw new E("tlv.decode: length bytes not complete");
              if (lengthBytes[0] === 0)
                throw new E("tlv.decode(long): zero leftmost byte");
              for (const b of lengthBytes)
                length = length << 8 | b;
              pos += lenLen;
              if (length < 128)
                throw new E("tlv.decode(long): not minimal encoding");
            }
            const v = data.subarray(pos, pos + length);
            if (v.length !== length)
              throw new E("tlv.decode: wrong value length");
            return { v, l: data.subarray(pos + length) };
          }
        },
        // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
        // since we always use positive integers here. It must always be empty:
        // - add zero byte if exists
        // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
        _int: {
          encode(num2) {
            const { Err: E } = DER;
            if (num2 < _0n5)
              throw new E("integer: negative integers are not allowed");
            let hex = numberToHexUnpadded(num2);
            if (Number.parseInt(hex[0], 16) & 8)
              hex = "00" + hex;
            if (hex.length & 1)
              throw new E("unexpected DER parsing assertion: unpadded hex");
            return hex;
          },
          decode(data) {
            const { Err: E } = DER;
            if (data[0] & 128)
              throw new E("invalid signature integer: negative");
            if (data[0] === 0 && !(data[1] & 128))
              throw new E("invalid signature integer: unnecessary leading zero");
            return bytesToNumberBE(data);
          }
        },
        toSig(hex) {
          const { Err: E, _int: int, _tlv: tlv } = DER;
          const data = ensureBytes("signature", hex);
          const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
          if (seqLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
          const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
          if (sLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          return { r: int.decode(rBytes), s: int.decode(sBytes) };
        },
        hexFromSig(sig) {
          const { _tlv: tlv, _int: int } = DER;
          const rs = tlv.encode(2, int.encode(sig.r));
          const ss = tlv.encode(2, int.encode(sig.s));
          const seq = rs + ss;
          return tlv.encode(48, seq);
        }
      };
      _0n5 = BigInt(0);
      _1n5 = BigInt(1);
      _2n3 = BigInt(2);
      _3n2 = BigInt(3);
      _4n2 = BigInt(4);
    }
  });

  // node_modules/@noble/curves/esm/_shortw_utils.js
  function getHash(hash3) {
    return {
      hash: hash3,
      hmac: (key, ...msgs) => hmac(hash3, key, concatBytes(...msgs)),
      randomBytes
    };
  }
  function createCurve(curveDef, defHash) {
    const create2 = (hash3) => weierstrass({ ...curveDef, ...getHash(hash3) });
    return { ...create2(defHash), create: create2 };
  }
  var init_shortw_utils = __esm({
    "node_modules/@noble/curves/esm/_shortw_utils.js"() {
      init_hmac();
      init_utils();
      init_weierstrass();
    }
  });

  // node_modules/@noble/curves/esm/abstract/hash-to-curve.js
  function i2osp(value, length) {
    anum(value);
    anum(length);
    if (value < 0 || value >= 1 << 8 * length)
      throw new Error("invalid I2OSP input: " + value);
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1; i >= 0; i--) {
      res[i] = value & 255;
      value >>>= 8;
    }
    return new Uint8Array(res);
  }
  function strxor(a, b) {
    const arr = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
      arr[i] = a[i] ^ b[i];
    }
    return arr;
  }
  function anum(item) {
    if (!Number.isSafeInteger(item))
      throw new Error("number expected");
  }
  function expand_message_xmd(msg, DST, lenInBytes, H) {
    abytes2(msg);
    abytes2(DST);
    anum(lenInBytes);
    if (DST.length > 255)
      DST = H(concatBytes3(utf8ToBytes2("H2C-OVERSIZE-DST-"), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
      throw new Error("expand_message_xmd: invalid lenInBytes");
    const DST_prime = concatBytes3(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2);
    const b = new Array(ell);
    const b_0 = H(concatBytes3(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H(concatBytes3(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i <= ell; i++) {
      const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
      b[i] = H(concatBytes3(...args));
    }
    const pseudo_random_bytes = concatBytes3(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
  }
  function expand_message_xof(msg, DST, lenInBytes, k, H) {
    abytes2(msg);
    abytes2(DST);
    anum(lenInBytes);
    if (DST.length > 255) {
      const dkLen = Math.ceil(2 * k / 8);
      DST = H.create({ dkLen }).update(utf8ToBytes2("H2C-OVERSIZE-DST-")).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255)
      throw new Error("expand_message_xof: invalid lenInBytes");
    return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
  }
  function hash_to_field(msg, count, options) {
    validateObject(options, {
      DST: "stringOrUint8Array",
      p: "bigint",
      m: "isSafeInteger",
      k: "isSafeInteger",
      hash: "hash"
    });
    const { p, k, m, hash: hash3, expand, DST: _DST } = options;
    abytes2(msg);
    anum(count);
    const DST = typeof _DST === "string" ? utf8ToBytes2(_DST) : _DST;
    const log2p = p.toString(2).length;
    const L = Math.ceil((log2p + k) / 8);
    const len_in_bytes = count * m * L;
    let prb;
    if (expand === "xmd") {
      prb = expand_message_xmd(msg, DST, len_in_bytes, hash3);
    } else if (expand === "xof") {
      prb = expand_message_xof(msg, DST, len_in_bytes, k, hash3);
    } else if (expand === "_internal_pass") {
      prb = msg;
    } else {
      throw new Error('expand must be "xmd" or "xof"');
    }
    const u = new Array(count);
    for (let i = 0; i < count; i++) {
      const e = new Array(m);
      for (let j = 0; j < m; j++) {
        const elm_offset = L * (j + i * m);
        const tv = prb.subarray(elm_offset, elm_offset + L);
        e[j] = mod(os2ip(tv), p);
      }
      u[i] = e;
    }
    return u;
  }
  function isogenyMap(field, map) {
    const coeff = map.map((i) => Array.from(i).reverse());
    return (x, y) => {
      const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
      const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
      x = field.mul(xn, xd_inv);
      y = field.mul(y, field.mul(yn, yd_inv));
      return { x, y };
    };
  }
  function createHasher2(Point2, mapToCurve, defaults) {
    if (typeof mapToCurve !== "function")
      throw new Error("mapToCurve() must be defined");
    function map(num2) {
      return Point2.fromAffine(mapToCurve(num2));
    }
    function clear(initial) {
      const P = initial.clearCofactor();
      if (P.equals(Point2.ZERO))
        return Point2.ZERO;
      P.assertValidity();
      return P;
    }
    return {
      defaults,
      // Encodes byte string to elliptic curve.
      // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
      hashToCurve(msg, options) {
        const u = hash_to_field(msg, 2, { ...defaults, DST: defaults.DST, ...options });
        const u0 = map(u[0]);
        const u1 = map(u[1]);
        return clear(u0.add(u1));
      },
      // Encodes byte string to elliptic curve.
      // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
      encodeToCurve(msg, options) {
        const u = hash_to_field(msg, 1, { ...defaults, DST: defaults.encodeDST, ...options });
        return clear(map(u[0]));
      },
      // Same as encodeToCurve, but without hash
      mapToCurve(scalars) {
        if (!Array.isArray(scalars))
          throw new Error("expected array of bigints");
        for (const i of scalars)
          if (typeof i !== "bigint")
            throw new Error("expected array of bigints");
        return clear(map(scalars));
      }
    };
  }
  var os2ip;
  var init_hash_to_curve = __esm({
    "node_modules/@noble/curves/esm/abstract/hash-to-curve.js"() {
      init_modular();
      init_utils4();
      os2ip = bytesToNumberBE;
    }
  });

  // node_modules/@noble/curves/esm/secp256k1.js
  var secp256k1_exports = {};
  __export(secp256k1_exports, {
    encodeToCurve: () => encodeToCurve,
    hashToCurve: () => hashToCurve,
    schnorr: () => schnorr,
    secp256k1: () => secp256k1,
    secp256k1_hasher: () => secp256k1_hasher
  });
  function sqrtMod(y) {
    const P = secp256k1P;
    const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow2(b3, _3n3, P) * b3 % P;
    const b9 = pow2(b6, _3n3, P) * b3 % P;
    const b11 = pow2(b9, _2n4, P) * b2 % P;
    const b22 = pow2(b11, _11n, P) * b11 % P;
    const b44 = pow2(b22, _22n, P) * b22 % P;
    const b88 = pow2(b44, _44n, P) * b44 % P;
    const b176 = pow2(b88, _88n, P) * b88 % P;
    const b220 = pow2(b176, _44n, P) * b44 % P;
    const b223 = pow2(b220, _3n3, P) * b3 % P;
    const t1 = pow2(b223, _23n, P) * b22 % P;
    const t2 = pow2(t1, _6n, P) * b2 % P;
    const root = pow2(t2, _2n4, P);
    if (!Fpk1.eql(Fpk1.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  }
  function taggedHash(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === void 0) {
      const tagH = sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
      tagP = concatBytes3(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return sha256(concatBytes3(tagP, ...messages));
  }
  function schnorrGetExtPubKey(priv) {
    let d_ = secp256k1.utils.normPrivateKeyToScalar(priv);
    let p = Point.fromPrivateKey(d_);
    const scalar = p.hasEvenY() ? d_ : modN(-d_);
    return { scalar, bytes: pointToBytes(p) };
  }
  function lift_x(x) {
    aInRange("x", x, _1n6, secp256k1P);
    const xx = modP(x * x);
    const c = modP(xx * x + BigInt(7));
    let y = sqrtMod(c);
    if (y % _2n4 !== _0n6)
      y = modP(-y);
    const p = new Point(x, y, _1n6);
    p.assertValidity();
    return p;
  }
  function challenge(...args) {
    return modN(num(taggedHash("BIP0340/challenge", ...args)));
  }
  function schnorrGetPublicKey(privateKey) {
    return schnorrGetExtPubKey(privateKey).bytes;
  }
  function schnorrSign(message, privateKey, auxRand = randomBytes(32)) {
    const m = ensureBytes("message", message);
    const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
    const a = ensureBytes("auxRand", auxRand, 32);
    const t2 = numTo32b(d ^ num(taggedHash("BIP0340/aux", a)));
    const rand = taggedHash("BIP0340/nonce", t2, px, m);
    const k_ = modN(num(rand));
    if (k_ === _0n6)
      throw new Error("sign failed: k is zero");
    const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
    const e = challenge(rx, px, m);
    const sig = new Uint8Array(64);
    sig.set(rx, 0);
    sig.set(numTo32b(modN(k + e * d)), 32);
    if (!schnorrVerify(sig, m, px))
      throw new Error("sign: Invalid signature produced");
    return sig;
  }
  function schnorrVerify(signature, message, publicKey) {
    const sig = ensureBytes("signature", signature, 64);
    const m = ensureBytes("message", message);
    const pub = ensureBytes("publicKey", publicKey, 32);
    try {
      const P = lift_x(num(pub));
      const r = num(sig.subarray(0, 32));
      if (!inRange(r, _1n6, secp256k1P))
        return false;
      const s = num(sig.subarray(32, 64));
      if (!inRange(s, _1n6, secp256k1N))
        return false;
      const e = challenge(numTo32b(r), pointToBytes(P), m);
      const R = GmulAdd(P, s, modN(-e));
      if (!R || !R.hasEvenY() || R.toAffine().x !== r)
        return false;
      return true;
    } catch (error) {
      return false;
    }
  }
  var secp256k1P, secp256k1N, _0n6, _1n6, _2n4, divNearest, Fpk1, secp256k1, TAGGED_HASH_PREFIXES, pointToBytes, numTo32b, modP, modN, Point, GmulAdd, num, schnorr, isoMap, mapSWU, secp256k1_hasher, hashToCurve, encodeToCurve;
  var init_secp256k1 = __esm({
    "node_modules/@noble/curves/esm/secp256k1.js"() {
      init_sha2();
      init_utils();
      init_shortw_utils();
      init_hash_to_curve();
      init_modular();
      init_utils4();
      init_weierstrass();
      secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
      secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
      _0n6 = BigInt(0);
      _1n6 = BigInt(1);
      _2n4 = BigInt(2);
      divNearest = (a, b) => (a + b / _2n4) / b;
      Fpk1 = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
      secp256k1 = createCurve({
        a: _0n6,
        b: BigInt(7),
        Fp: Fpk1,
        n: secp256k1N,
        Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
        Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
        h: BigInt(1),
        lowS: true,
        // Allow only low-S signatures by default in sign() and verify()
        endo: {
          // Endomorphism, see above
          beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
          splitScalar: (k) => {
            const n = secp256k1N;
            const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
            const b1 = -_1n6 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
            const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
            const b2 = a1;
            const POW_2_128 = BigInt("0x100000000000000000000000000000000");
            const c1 = divNearest(b2 * k, n);
            const c2 = divNearest(-b1 * k, n);
            let k1 = mod(k - c1 * a1 - c2 * a2, n);
            let k2 = mod(-c1 * b1 - c2 * b2, n);
            const k1neg = k1 > POW_2_128;
            const k2neg = k2 > POW_2_128;
            if (k1neg)
              k1 = n - k1;
            if (k2neg)
              k2 = n - k2;
            if (k1 > POW_2_128 || k2 > POW_2_128) {
              throw new Error("splitScalar: Endomorphism failed, k=" + k);
            }
            return { k1neg, k1, k2neg, k2 };
          }
        }
      }, sha256);
      TAGGED_HASH_PREFIXES = {};
      pointToBytes = (point) => point.toRawBytes(true).slice(1);
      numTo32b = (n) => numberToBytesBE(n, 32);
      modP = (x) => mod(x, secp256k1P);
      modN = (x) => mod(x, secp256k1N);
      Point = /* @__PURE__ */ (() => secp256k1.ProjectivePoint)();
      GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
      num = bytesToNumberBE;
      schnorr = /* @__PURE__ */ (() => ({
        getPublicKey: schnorrGetPublicKey,
        sign: schnorrSign,
        verify: schnorrVerify,
        utils: {
          randomPrivateKey: secp256k1.utils.randomPrivateKey,
          lift_x,
          pointToBytes,
          numberToBytesBE,
          bytesToNumberBE,
          taggedHash,
          mod
        }
      }))();
      isoMap = /* @__PURE__ */ (() => isogenyMap(Fpk1, [
        // xNum
        [
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
          "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
          "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
        ],
        // xDen
        [
          "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
          "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
          // LAST 1
        ],
        // yNum
        [
          "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
          "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
          "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
          "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
        ],
        // yDen
        [
          "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
          "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
          "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
          // LAST 1
        ]
      ].map((i) => i.map((j) => BigInt(j)))))();
      mapSWU = /* @__PURE__ */ (() => mapToCurveSimpleSWU(Fpk1, {
        A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
        B: BigInt("1771"),
        Z: Fpk1.create(BigInt("-11"))
      }))();
      secp256k1_hasher = /* @__PURE__ */ (() => createHasher2(secp256k1.ProjectivePoint, (scalars) => {
        const { x, y } = mapSWU(Fpk1.create(scalars[0]));
        return isoMap(x, y);
      }, {
        DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
        encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
        p: Fpk1.ORDER,
        m: 1,
        k: 128,
        expand: "xmd",
        hash: sha256
      }))();
      hashToCurve = /* @__PURE__ */ (() => secp256k1_hasher.hashToCurve)();
      encodeToCurve = /* @__PURE__ */ (() => secp256k1_hasher.encodeToCurve)();
    }
  });

  // node_modules/viem/_esm/errors/node.js
  var ExecutionRevertedError, FeeCapTooHighError, FeeCapTooLowError, NonceTooHighError, NonceTooLowError, NonceMaxValueError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, TransactionTypeNotSupportedError, TipAboveFeeCapError, UnknownNodeError;
  var init_node = __esm({
    "node_modules/viem/_esm/errors/node.js"() {
      init_formatGwei();
      init_base();
      ExecutionRevertedError = class extends BaseError2 {
        constructor({ cause, message } = {}) {
          const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
          super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
            cause,
            name: "ExecutionRevertedError"
          });
        }
      };
      Object.defineProperty(ExecutionRevertedError, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 3
      });
      Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /execution reverted/
      });
      FeeCapTooHighError = class extends BaseError2 {
        constructor({ cause, maxFeePerGas } = {}) {
          super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
            cause,
            name: "FeeCapTooHighError"
          });
        }
      };
      Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
      });
      FeeCapTooLowError = class extends BaseError2 {
        constructor({ cause, maxFeePerGas } = {}) {
          super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
            cause,
            name: "FeeCapTooLowError"
          });
        }
      };
      Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
      });
      NonceTooHighError = class extends BaseError2 {
        constructor({ cause, nonce } = {}) {
          super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
        }
      };
      Object.defineProperty(NonceTooHighError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /nonce too high/
      });
      NonceTooLowError = class extends BaseError2 {
        constructor({ cause, nonce } = {}) {
          super([
            `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
            "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
          ].join("\n"), { cause, name: "NonceTooLowError" });
        }
      };
      Object.defineProperty(NonceTooLowError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /nonce too low|transaction already imported|already known/
      });
      NonceMaxValueError = class extends BaseError2 {
        constructor({ cause, nonce } = {}) {
          super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
        }
      };
      Object.defineProperty(NonceMaxValueError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /nonce has max value/
      });
      InsufficientFundsError = class extends BaseError2 {
        constructor({ cause } = {}) {
          super([
            "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
          ].join("\n"), {
            cause,
            metaMessages: [
              "This error could arise when the account does not have enough funds to:",
              " - pay for the total gas fee,",
              " - pay for the value to send.",
              " ",
              "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
              " - `gas` is the amount of gas needed for transaction to execute,",
              " - `gas fee` is the gas fee,",
              " - `value` is the amount of ether to send to the recipient."
            ],
            name: "InsufficientFundsError"
          });
        }
      };
      Object.defineProperty(InsufficientFundsError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /insufficient funds|exceeds transaction sender account balance/
      });
      IntrinsicGasTooHighError = class extends BaseError2 {
        constructor({ cause, gas } = {}) {
          super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
            cause,
            name: "IntrinsicGasTooHighError"
          });
        }
      };
      Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /intrinsic gas too high|gas limit reached/
      });
      IntrinsicGasTooLowError = class extends BaseError2 {
        constructor({ cause, gas } = {}) {
          super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
            cause,
            name: "IntrinsicGasTooLowError"
          });
        }
      };
      Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /intrinsic gas too low/
      });
      TransactionTypeNotSupportedError = class extends BaseError2 {
        constructor({ cause }) {
          super("The transaction type is not supported for this chain.", {
            cause,
            name: "TransactionTypeNotSupportedError"
          });
        }
      };
      Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /transaction type not valid/
      });
      TipAboveFeeCapError = class extends BaseError2 {
        constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
          super([
            `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`
          ].join("\n"), {
            cause,
            name: "TipAboveFeeCapError"
          });
        }
      };
      Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
      });
      UnknownNodeError = class extends BaseError2 {
        constructor({ cause }) {
          super(`An error occurred while executing: ${cause?.shortMessage}`, {
            cause,
            name: "UnknownNodeError"
          });
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/errors/getNodeError.js
  function getNodeError(err, args) {
    const message = (err.details || "").toLowerCase();
    const executionRevertedError = err instanceof BaseError2 ? err.walk((e) => e?.code === ExecutionRevertedError.code) : err;
    if (executionRevertedError instanceof BaseError2)
      return new ExecutionRevertedError({
        cause: err,
        message: executionRevertedError.details
      });
    if (ExecutionRevertedError.nodeMessage.test(message))
      return new ExecutionRevertedError({
        cause: err,
        message: err.details
      });
    if (FeeCapTooHighError.nodeMessage.test(message))
      return new FeeCapTooHighError({
        cause: err,
        maxFeePerGas: args?.maxFeePerGas
      });
    if (FeeCapTooLowError.nodeMessage.test(message))
      return new FeeCapTooLowError({
        cause: err,
        maxFeePerGas: args?.maxFeePerGas
      });
    if (NonceTooHighError.nodeMessage.test(message))
      return new NonceTooHighError({ cause: err, nonce: args?.nonce });
    if (NonceTooLowError.nodeMessage.test(message))
      return new NonceTooLowError({ cause: err, nonce: args?.nonce });
    if (NonceMaxValueError.nodeMessage.test(message))
      return new NonceMaxValueError({ cause: err, nonce: args?.nonce });
    if (InsufficientFundsError.nodeMessage.test(message))
      return new InsufficientFundsError({ cause: err });
    if (IntrinsicGasTooHighError.nodeMessage.test(message))
      return new IntrinsicGasTooHighError({ cause: err, gas: args?.gas });
    if (IntrinsicGasTooLowError.nodeMessage.test(message))
      return new IntrinsicGasTooLowError({ cause: err, gas: args?.gas });
    if (TransactionTypeNotSupportedError.nodeMessage.test(message))
      return new TransactionTypeNotSupportedError({ cause: err });
    if (TipAboveFeeCapError.nodeMessage.test(message))
      return new TipAboveFeeCapError({
        cause: err,
        maxFeePerGas: args?.maxFeePerGas,
        maxPriorityFeePerGas: args?.maxPriorityFeePerGas
      });
    return new UnknownNodeError({
      cause: err
    });
  }
  var init_getNodeError = __esm({
    "node_modules/viem/_esm/utils/errors/getNodeError.js"() {
      init_base();
      init_node();
    }
  });

  // node_modules/viem/_esm/utils/formatters/extract.js
  function extract(value_, { format }) {
    if (!format)
      return {};
    const value = {};
    function extract_(formatted2) {
      const keys = Object.keys(formatted2);
      for (const key of keys) {
        if (key in value_)
          value[key] = value_[key];
        if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
          extract_(formatted2[key]);
      }
    }
    const formatted = format(value_ || {});
    extract_(formatted);
    return value;
  }
  var init_extract = __esm({
    "node_modules/viem/_esm/utils/formatters/extract.js"() {
    }
  });

  // node_modules/viem/_esm/utils/formatters/transactionRequest.js
  function formatTransactionRequest(request, _) {
    const rpcRequest = {};
    if (typeof request.authorizationList !== "undefined")
      rpcRequest.authorizationList = formatAuthorizationList(request.authorizationList);
    if (typeof request.accessList !== "undefined")
      rpcRequest.accessList = request.accessList;
    if (typeof request.blobVersionedHashes !== "undefined")
      rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
    if (typeof request.blobs !== "undefined") {
      if (typeof request.blobs[0] !== "string")
        rpcRequest.blobs = request.blobs.map((x) => bytesToHex2(x));
      else
        rpcRequest.blobs = request.blobs;
    }
    if (typeof request.data !== "undefined")
      rpcRequest.data = request.data;
    if (request.account)
      rpcRequest.from = request.account.address;
    if (typeof request.from !== "undefined")
      rpcRequest.from = request.from;
    if (typeof request.gas !== "undefined")
      rpcRequest.gas = numberToHex(request.gas);
    if (typeof request.gasPrice !== "undefined")
      rpcRequest.gasPrice = numberToHex(request.gasPrice);
    if (typeof request.maxFeePerBlobGas !== "undefined")
      rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
    if (typeof request.maxFeePerGas !== "undefined")
      rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
    if (typeof request.maxPriorityFeePerGas !== "undefined")
      rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
    if (typeof request.nonce !== "undefined")
      rpcRequest.nonce = numberToHex(request.nonce);
    if (typeof request.to !== "undefined")
      rpcRequest.to = request.to;
    if (typeof request.type !== "undefined")
      rpcRequest.type = rpcTransactionType[request.type];
    if (typeof request.value !== "undefined")
      rpcRequest.value = numberToHex(request.value);
    return rpcRequest;
  }
  function formatAuthorizationList(authorizationList) {
    return authorizationList.map((authorization) => ({
      address: authorization.address,
      r: authorization.r ? numberToHex(BigInt(authorization.r)) : authorization.r,
      s: authorization.s ? numberToHex(BigInt(authorization.s)) : authorization.s,
      chainId: numberToHex(authorization.chainId),
      nonce: numberToHex(authorization.nonce),
      ...typeof authorization.yParity !== "undefined" ? { yParity: numberToHex(authorization.yParity) } : {},
      ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: numberToHex(authorization.v) } : {}
    }));
  }
  var rpcTransactionType;
  var init_transactionRequest = __esm({
    "node_modules/viem/_esm/utils/formatters/transactionRequest.js"() {
      init_toHex();
      rpcTransactionType = {
        legacy: "0x0",
        eip2930: "0x1",
        eip1559: "0x2",
        eip4844: "0x3",
        eip7702: "0x4"
      };
    }
  });

  // node_modules/viem/_esm/utils/stateOverride.js
  function serializeStateMapping(stateMapping) {
    if (!stateMapping || stateMapping.length === 0)
      return void 0;
    return stateMapping.reduce((acc, { slot, value }) => {
      if (slot.length !== 66)
        throw new InvalidBytesLengthError({
          size: slot.length,
          targetSize: 66,
          type: "hex"
        });
      if (value.length !== 66)
        throw new InvalidBytesLengthError({
          size: value.length,
          targetSize: 66,
          type: "hex"
        });
      acc[slot] = value;
      return acc;
    }, {});
  }
  function serializeAccountStateOverride(parameters) {
    const { balance, nonce, state, stateDiff, code } = parameters;
    const rpcAccountStateOverride = {};
    if (code !== void 0)
      rpcAccountStateOverride.code = code;
    if (balance !== void 0)
      rpcAccountStateOverride.balance = numberToHex(balance);
    if (nonce !== void 0)
      rpcAccountStateOverride.nonce = numberToHex(nonce);
    if (state !== void 0)
      rpcAccountStateOverride.state = serializeStateMapping(state);
    if (stateDiff !== void 0) {
      if (rpcAccountStateOverride.state)
        throw new StateAssignmentConflictError();
      rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
    }
    return rpcAccountStateOverride;
  }
  function serializeStateOverride(parameters) {
    if (!parameters)
      return void 0;
    const rpcStateOverride = {};
    for (const { address, ...accountState } of parameters) {
      if (!isAddress(address, { strict: false }))
        throw new InvalidAddressError({ address });
      if (rpcStateOverride[address])
        throw new AccountStateConflictError({ address });
      rpcStateOverride[address] = serializeAccountStateOverride(accountState);
    }
    return rpcStateOverride;
  }
  var init_stateOverride2 = __esm({
    "node_modules/viem/_esm/utils/stateOverride.js"() {
      init_address();
      init_data();
      init_stateOverride();
      init_isAddress();
      init_toHex();
    }
  });

  // node_modules/viem/_esm/constants/number.js
  var maxInt8, maxInt16, maxInt24, maxInt32, maxInt40, maxInt48, maxInt56, maxInt64, maxInt72, maxInt80, maxInt88, maxInt96, maxInt104, maxInt112, maxInt120, maxInt128, maxInt136, maxInt144, maxInt152, maxInt160, maxInt168, maxInt176, maxInt184, maxInt192, maxInt200, maxInt208, maxInt216, maxInt224, maxInt232, maxInt240, maxInt248, maxInt256, minInt8, minInt16, minInt24, minInt32, minInt40, minInt48, minInt56, minInt64, minInt72, minInt80, minInt88, minInt96, minInt104, minInt112, minInt120, minInt128, minInt136, minInt144, minInt152, minInt160, minInt168, minInt176, minInt184, minInt192, minInt200, minInt208, minInt216, minInt224, minInt232, minInt240, minInt248, minInt256, maxUint8, maxUint16, maxUint24, maxUint32, maxUint40, maxUint48, maxUint56, maxUint64, maxUint72, maxUint80, maxUint88, maxUint96, maxUint104, maxUint112, maxUint120, maxUint128, maxUint136, maxUint144, maxUint152, maxUint160, maxUint168, maxUint176, maxUint184, maxUint192, maxUint200, maxUint208, maxUint216, maxUint224, maxUint232, maxUint240, maxUint248, maxUint256;
  var init_number = __esm({
    "node_modules/viem/_esm/constants/number.js"() {
      maxInt8 = 2n ** (8n - 1n) - 1n;
      maxInt16 = 2n ** (16n - 1n) - 1n;
      maxInt24 = 2n ** (24n - 1n) - 1n;
      maxInt32 = 2n ** (32n - 1n) - 1n;
      maxInt40 = 2n ** (40n - 1n) - 1n;
      maxInt48 = 2n ** (48n - 1n) - 1n;
      maxInt56 = 2n ** (56n - 1n) - 1n;
      maxInt64 = 2n ** (64n - 1n) - 1n;
      maxInt72 = 2n ** (72n - 1n) - 1n;
      maxInt80 = 2n ** (80n - 1n) - 1n;
      maxInt88 = 2n ** (88n - 1n) - 1n;
      maxInt96 = 2n ** (96n - 1n) - 1n;
      maxInt104 = 2n ** (104n - 1n) - 1n;
      maxInt112 = 2n ** (112n - 1n) - 1n;
      maxInt120 = 2n ** (120n - 1n) - 1n;
      maxInt128 = 2n ** (128n - 1n) - 1n;
      maxInt136 = 2n ** (136n - 1n) - 1n;
      maxInt144 = 2n ** (144n - 1n) - 1n;
      maxInt152 = 2n ** (152n - 1n) - 1n;
      maxInt160 = 2n ** (160n - 1n) - 1n;
      maxInt168 = 2n ** (168n - 1n) - 1n;
      maxInt176 = 2n ** (176n - 1n) - 1n;
      maxInt184 = 2n ** (184n - 1n) - 1n;
      maxInt192 = 2n ** (192n - 1n) - 1n;
      maxInt200 = 2n ** (200n - 1n) - 1n;
      maxInt208 = 2n ** (208n - 1n) - 1n;
      maxInt216 = 2n ** (216n - 1n) - 1n;
      maxInt224 = 2n ** (224n - 1n) - 1n;
      maxInt232 = 2n ** (232n - 1n) - 1n;
      maxInt240 = 2n ** (240n - 1n) - 1n;
      maxInt248 = 2n ** (248n - 1n) - 1n;
      maxInt256 = 2n ** (256n - 1n) - 1n;
      minInt8 = -(2n ** (8n - 1n));
      minInt16 = -(2n ** (16n - 1n));
      minInt24 = -(2n ** (24n - 1n));
      minInt32 = -(2n ** (32n - 1n));
      minInt40 = -(2n ** (40n - 1n));
      minInt48 = -(2n ** (48n - 1n));
      minInt56 = -(2n ** (56n - 1n));
      minInt64 = -(2n ** (64n - 1n));
      minInt72 = -(2n ** (72n - 1n));
      minInt80 = -(2n ** (80n - 1n));
      minInt88 = -(2n ** (88n - 1n));
      minInt96 = -(2n ** (96n - 1n));
      minInt104 = -(2n ** (104n - 1n));
      minInt112 = -(2n ** (112n - 1n));
      minInt120 = -(2n ** (120n - 1n));
      minInt128 = -(2n ** (128n - 1n));
      minInt136 = -(2n ** (136n - 1n));
      minInt144 = -(2n ** (144n - 1n));
      minInt152 = -(2n ** (152n - 1n));
      minInt160 = -(2n ** (160n - 1n));
      minInt168 = -(2n ** (168n - 1n));
      minInt176 = -(2n ** (176n - 1n));
      minInt184 = -(2n ** (184n - 1n));
      minInt192 = -(2n ** (192n - 1n));
      minInt200 = -(2n ** (200n - 1n));
      minInt208 = -(2n ** (208n - 1n));
      minInt216 = -(2n ** (216n - 1n));
      minInt224 = -(2n ** (224n - 1n));
      minInt232 = -(2n ** (232n - 1n));
      minInt240 = -(2n ** (240n - 1n));
      minInt248 = -(2n ** (248n - 1n));
      minInt256 = -(2n ** (256n - 1n));
      maxUint8 = 2n ** 8n - 1n;
      maxUint16 = 2n ** 16n - 1n;
      maxUint24 = 2n ** 24n - 1n;
      maxUint32 = 2n ** 32n - 1n;
      maxUint40 = 2n ** 40n - 1n;
      maxUint48 = 2n ** 48n - 1n;
      maxUint56 = 2n ** 56n - 1n;
      maxUint64 = 2n ** 64n - 1n;
      maxUint72 = 2n ** 72n - 1n;
      maxUint80 = 2n ** 80n - 1n;
      maxUint88 = 2n ** 88n - 1n;
      maxUint96 = 2n ** 96n - 1n;
      maxUint104 = 2n ** 104n - 1n;
      maxUint112 = 2n ** 112n - 1n;
      maxUint120 = 2n ** 120n - 1n;
      maxUint128 = 2n ** 128n - 1n;
      maxUint136 = 2n ** 136n - 1n;
      maxUint144 = 2n ** 144n - 1n;
      maxUint152 = 2n ** 152n - 1n;
      maxUint160 = 2n ** 160n - 1n;
      maxUint168 = 2n ** 168n - 1n;
      maxUint176 = 2n ** 176n - 1n;
      maxUint184 = 2n ** 184n - 1n;
      maxUint192 = 2n ** 192n - 1n;
      maxUint200 = 2n ** 200n - 1n;
      maxUint208 = 2n ** 208n - 1n;
      maxUint216 = 2n ** 216n - 1n;
      maxUint224 = 2n ** 224n - 1n;
      maxUint232 = 2n ** 232n - 1n;
      maxUint240 = 2n ** 240n - 1n;
      maxUint248 = 2n ** 248n - 1n;
      maxUint256 = 2n ** 256n - 1n;
    }
  });

  // node_modules/viem/_esm/utils/transaction/assertRequest.js
  function assertRequest(args) {
    const { account: account_, maxFeePerGas, maxPriorityFeePerGas, to } = args;
    const account = account_ ? parseAccount(account_) : void 0;
    if (account && !isAddress(account.address))
      throw new InvalidAddressError({ address: account.address });
    if (to && !isAddress(to))
      throw new InvalidAddressError({ address: to });
    if (maxFeePerGas && maxFeePerGas > maxUint256)
      throw new FeeCapTooHighError({ maxFeePerGas });
    if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
      throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
  }
  var init_assertRequest = __esm({
    "node_modules/viem/_esm/utils/transaction/assertRequest.js"() {
      init_parseAccount();
      init_number();
      init_address();
      init_node();
      init_isAddress();
    }
  });

  // node_modules/viem/_esm/utils/address/isAddressEqual.js
  function isAddressEqual(a, b) {
    if (!isAddress(a, { strict: false }))
      throw new InvalidAddressError({ address: a });
    if (!isAddress(b, { strict: false }))
      throw new InvalidAddressError({ address: b });
    return a.toLowerCase() === b.toLowerCase();
  }
  var init_isAddressEqual = __esm({
    "node_modules/viem/_esm/utils/address/isAddressEqual.js"() {
      init_address();
      init_isAddress();
    }
  });

  // node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
  function decodeFunctionResult(parameters) {
    const { abi: abi2, args, functionName, data } = parameters;
    let abiItem = abi2[0];
    if (functionName) {
      const item = getAbiItem({ abi: abi2, args, name: functionName });
      if (!item)
        throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath4 });
      abiItem = item;
    }
    if (abiItem.type !== "function")
      throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath4 });
    if (!abiItem.outputs)
      throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath4 });
    const values = decodeAbiParameters(abiItem.outputs, data);
    if (values && values.length > 1)
      return values;
    if (values && values.length === 1)
      return values[0];
    return void 0;
  }
  var docsPath4;
  var init_decodeFunctionResult = __esm({
    "node_modules/viem/_esm/utils/abi/decodeFunctionResult.js"() {
      init_abi();
      init_decodeAbiParameters();
      init_getAbiItem();
      docsPath4 = "/docs/contract/decodeFunctionResult";
    }
  });

  // node_modules/ox/_esm/core/version.js
  var version3;
  var init_version3 = __esm({
    "node_modules/ox/_esm/core/version.js"() {
      version3 = "0.1.1";
    }
  });

  // node_modules/ox/_esm/core/internal/errors.js
  function getVersion() {
    return version3;
  }
  var init_errors2 = __esm({
    "node_modules/ox/_esm/core/internal/errors.js"() {
      init_version3();
    }
  });

  // node_modules/ox/_esm/core/Errors.js
  function walk2(err, fn) {
    if (fn?.(err))
      return err;
    if (err && typeof err === "object" && "cause" in err && err.cause)
      return walk2(err.cause, fn);
    return fn ? null : err;
  }
  var BaseError3;
  var init_Errors = __esm({
    "node_modules/ox/_esm/core/Errors.js"() {
      init_errors2();
      BaseError3 = class _BaseError extends Error {
        constructor(shortMessage, options = {}) {
          const details = (() => {
            if (options.cause instanceof _BaseError) {
              if (options.cause.details)
                return options.cause.details;
              if (options.cause.shortMessage)
                return options.cause.shortMessage;
            }
            if (options.cause && "details" in options.cause && typeof options.cause.details === "string")
              return options.cause.details;
            if (options.cause?.message)
              return options.cause.message;
            return options.details;
          })();
          const docsPath8 = (() => {
            if (options.cause instanceof _BaseError)
              return options.cause.docsPath || options.docsPath;
            return options.docsPath;
          })();
          const docsBaseUrl = "https://oxlib.sh";
          const docs = `${docsBaseUrl}${docsPath8 ?? ""}`;
          const message = [
            shortMessage || "An error occurred.",
            ...options.metaMessages ? ["", ...options.metaMessages] : [],
            ...details || docsPath8 ? [
              "",
              details ? `Details: ${details}` : void 0,
              docsPath8 ? `See: ${docs}` : void 0
            ] : []
          ].filter((x) => typeof x === "string").join("\n");
          super(message, options.cause ? { cause: options.cause } : void 0);
          Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "docs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "BaseError"
          });
          Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: `ox@${getVersion()}`
          });
          this.cause = options.cause;
          this.details = details;
          this.docs = docs;
          this.docsPath = docsPath8;
          this.shortMessage = shortMessage;
        }
        walk(fn) {
          return walk2(this, fn);
        }
      };
    }
  });

  // node_modules/ox/_esm/core/internal/bytes.js
  function assertSize2(bytes, size_) {
    if (size2(bytes) > size_)
      throw new SizeOverflowError2({
        givenSize: size2(bytes),
        maxSize: size_
      });
  }
  function assertStartOffset2(value, start) {
    if (typeof start === "number" && start > 0 && start > size2(value) - 1)
      throw new SliceOffsetOutOfBoundsError2({
        offset: start,
        position: "start",
        size: size2(value)
      });
  }
  function assertEndOffset2(value, start, end) {
    if (typeof start === "number" && typeof end === "number" && size2(value) !== end - start) {
      throw new SliceOffsetOutOfBoundsError2({
        offset: end,
        position: "end",
        size: size2(value)
      });
    }
  }
  function charCodeToBase162(char) {
    if (char >= charCodeMap2.zero && char <= charCodeMap2.nine)
      return char - charCodeMap2.zero;
    if (char >= charCodeMap2.A && char <= charCodeMap2.F)
      return char - (charCodeMap2.A - 10);
    if (char >= charCodeMap2.a && char <= charCodeMap2.f)
      return char - (charCodeMap2.a - 10);
    return void 0;
  }
  function pad2(bytes, options = {}) {
    const { dir, size: size5 = 32 } = options;
    if (size5 === 0)
      return bytes;
    if (bytes.length > size5)
      throw new SizeExceedsPaddingSizeError2({
        size: bytes.length,
        targetSize: size5,
        type: "Bytes"
      });
    const paddedBytes = new Uint8Array(size5);
    for (let i = 0; i < size5; i++) {
      const padEnd = dir === "right";
      paddedBytes[padEnd ? i : size5 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
  }
  function trim2(value, options = {}) {
    const { dir = "left" } = options;
    let data = value;
    let sliceLength = 0;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
        sliceLength++;
      else
        break;
    }
    data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
    return data;
  }
  var charCodeMap2;
  var init_bytes = __esm({
    "node_modules/ox/_esm/core/internal/bytes.js"() {
      init_Bytes();
      charCodeMap2 = {
        zero: 48,
        nine: 57,
        A: 65,
        F: 70,
        a: 97,
        f: 102
      };
    }
  });

  // node_modules/ox/_esm/core/internal/hex.js
  function assertSize3(hex, size_) {
    if (size3(hex) > size_)
      throw new SizeOverflowError3({
        givenSize: size3(hex),
        maxSize: size_
      });
  }
  function assertStartOffset3(value, start) {
    if (typeof start === "number" && start > 0 && start > size3(value) - 1)
      throw new SliceOffsetOutOfBoundsError3({
        offset: start,
        position: "start",
        size: size3(value)
      });
  }
  function assertEndOffset3(value, start, end) {
    if (typeof start === "number" && typeof end === "number" && size3(value) !== end - start) {
      throw new SliceOffsetOutOfBoundsError3({
        offset: end,
        position: "end",
        size: size3(value)
      });
    }
  }
  function pad3(hex_, options = {}) {
    const { dir, size: size5 = 32 } = options;
    if (size5 === 0)
      return hex_;
    const hex = hex_.replace("0x", "");
    if (hex.length > size5 * 2)
      throw new SizeExceedsPaddingSizeError3({
        size: Math.ceil(hex.length / 2),
        targetSize: size5,
        type: "Hex"
      });
    return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size5 * 2, "0")}`;
  }
  function trim3(value, options = {}) {
    const { dir = "left" } = options;
    let data = value.replace("0x", "");
    let sliceLength = 0;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
        sliceLength++;
      else
        break;
    }
    data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
    if (data === "0")
      return "0x";
    if (dir === "right" && data.length % 2 === 1)
      return `0x${data}0`;
    return `0x${data}`;
  }
  var init_hex = __esm({
    "node_modules/ox/_esm/core/internal/hex.js"() {
      init_Hex();
    }
  });

  // node_modules/ox/_esm/core/Json.js
  function stringify2(value, replacer, space) {
    return JSON.stringify(value, (key, value2) => {
      if (typeof replacer === "function")
        return replacer(key, value2);
      if (typeof value2 === "bigint")
        return value2.toString() + bigIntSuffix;
      return value2;
    }, space);
  }
  var bigIntSuffix;
  var init_Json = __esm({
    "node_modules/ox/_esm/core/Json.js"() {
      bigIntSuffix = "#__bigint";
    }
  });

  // node_modules/ox/_esm/core/Bytes.js
  function assert(value) {
    if (value instanceof Uint8Array)
      return;
    if (!value)
      throw new InvalidBytesTypeError(value);
    if (typeof value !== "object")
      throw new InvalidBytesTypeError(value);
    if (!("BYTES_PER_ELEMENT" in value))
      throw new InvalidBytesTypeError(value);
    if (value.BYTES_PER_ELEMENT !== 1 || value.constructor.name !== "Uint8Array")
      throw new InvalidBytesTypeError(value);
  }
  function from(value) {
    if (value instanceof Uint8Array)
      return value;
    if (typeof value === "string")
      return fromHex(value);
    return fromArray(value);
  }
  function fromArray(value) {
    return value instanceof Uint8Array ? value : new Uint8Array(value);
  }
  function fromHex(value, options = {}) {
    const { size: size5 } = options;
    let hex = value;
    if (size5) {
      assertSize3(value, size5);
      hex = padRight(value, size5);
    }
    let hexString = hex.slice(2);
    if (hexString.length % 2)
      hexString = `0${hexString}`;
    const length = hexString.length / 2;
    const bytes = new Uint8Array(length);
    for (let index2 = 0, j = 0; index2 < length; index2++) {
      const nibbleLeft = charCodeToBase162(hexString.charCodeAt(j++));
      const nibbleRight = charCodeToBase162(hexString.charCodeAt(j++));
      if (nibbleLeft === void 0 || nibbleRight === void 0) {
        throw new BaseError3(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
      }
      bytes[index2] = nibbleLeft * 16 + nibbleRight;
    }
    return bytes;
  }
  function fromString(value, options = {}) {
    const { size: size5 } = options;
    const bytes = encoder3.encode(value);
    if (typeof size5 === "number") {
      assertSize2(bytes, size5);
      return padRight2(bytes, size5);
    }
    return bytes;
  }
  function padRight2(value, size5) {
    return pad2(value, { dir: "right", size: size5 });
  }
  function size2(value) {
    return value.length;
  }
  function slice2(value, start, end, options = {}) {
    const { strict } = options;
    assertStartOffset2(value, start);
    const value_ = value.slice(start, end);
    if (strict)
      assertEndOffset2(value_, start, end);
    return value_;
  }
  function toBigInt2(bytes, options = {}) {
    const { size: size5 } = options;
    if (typeof size5 !== "undefined")
      assertSize2(bytes, size5);
    const hex = fromBytes(bytes, options);
    return toBigInt(hex, options);
  }
  function toBoolean(bytes, options = {}) {
    const { size: size5 } = options;
    let bytes_ = bytes;
    if (typeof size5 !== "undefined") {
      assertSize2(bytes_, size5);
      bytes_ = trimLeft(bytes_);
    }
    if (bytes_.length > 1 || bytes_[0] > 1)
      throw new InvalidBytesBooleanError2(bytes_);
    return Boolean(bytes_[0]);
  }
  function toNumber2(bytes, options = {}) {
    const { size: size5 } = options;
    if (typeof size5 !== "undefined")
      assertSize2(bytes, size5);
    const hex = fromBytes(bytes, options);
    return toNumber(hex, options);
  }
  function toString(bytes, options = {}) {
    const { size: size5 } = options;
    let bytes_ = bytes;
    if (typeof size5 !== "undefined") {
      assertSize2(bytes_, size5);
      bytes_ = trimRight(bytes_);
    }
    return decoder.decode(bytes_);
  }
  function trimLeft(value) {
    return trim2(value, { dir: "left" });
  }
  function trimRight(value) {
    return trim2(value, { dir: "right" });
  }
  function validate(value) {
    try {
      assert(value);
      return true;
    } catch {
      return false;
    }
  }
  var decoder, encoder3, InvalidBytesBooleanError2, InvalidBytesTypeError, SizeOverflowError2, SliceOffsetOutOfBoundsError2, SizeExceedsPaddingSizeError2;
  var init_Bytes = __esm({
    "node_modules/ox/_esm/core/Bytes.js"() {
      init_Errors();
      init_Hex();
      init_bytes();
      init_hex();
      init_Json();
      decoder = /* @__PURE__ */ new TextDecoder();
      encoder3 = /* @__PURE__ */ new TextEncoder();
      InvalidBytesBooleanError2 = class extends BaseError3 {
        constructor(bytes) {
          super(`Bytes value \`${bytes}\` is not a valid boolean.`, {
            metaMessages: [
              "The bytes array must contain a single byte of either a `0` or `1` value."
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.InvalidBytesBooleanError"
          });
        }
      };
      InvalidBytesTypeError = class extends BaseError3 {
        constructor(value) {
          super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid Bytes value.`, {
            metaMessages: ["Bytes values must be of type `Bytes`."]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.InvalidBytesTypeError"
          });
        }
      };
      SizeOverflowError2 = class extends BaseError3 {
        constructor({ givenSize, maxSize }) {
          super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.SizeOverflowError"
          });
        }
      };
      SliceOffsetOutOfBoundsError2 = class extends BaseError3 {
        constructor({ offset, position, size: size5 }) {
          super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.SliceOffsetOutOfBoundsError"
          });
        }
      };
      SizeExceedsPaddingSizeError2 = class extends BaseError3 {
        constructor({ size: size5, targetSize, type }) {
          super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.SizeExceedsPaddingSizeError"
          });
        }
      };
    }
  });

  // node_modules/ox/_esm/core/Hex.js
  function assert2(value, options = {}) {
    const { strict = false } = options;
    if (!value)
      throw new InvalidHexTypeError(value);
    if (typeof value !== "string")
      throw new InvalidHexTypeError(value);
    if (strict) {
      if (!/^0x[0-9a-fA-F]*$/.test(value))
        throw new InvalidHexValueError(value);
    }
    if (!value.startsWith("0x"))
      throw new InvalidHexValueError(value);
  }
  function concat2(...values) {
    return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
  }
  function from2(value) {
    if (value instanceof Uint8Array)
      return fromBytes(value);
    if (Array.isArray(value))
      return fromBytes(new Uint8Array(value));
    return value;
  }
  function fromBoolean(value, options = {}) {
    const hex = `0x${Number(value)}`;
    if (typeof options.size === "number") {
      assertSize3(hex, options.size);
      return padLeft(hex, options.size);
    }
    return hex;
  }
  function fromBytes(value, options = {}) {
    let string = "";
    for (let i = 0; i < value.length; i++)
      string += hexes3[value[i]];
    const hex = `0x${string}`;
    if (typeof options.size === "number") {
      assertSize3(hex, options.size);
      return padRight(hex, options.size);
    }
    return hex;
  }
  function fromNumber(value, options = {}) {
    const { signed, size: size5 } = options;
    const value_ = BigInt(value);
    let maxValue;
    if (size5) {
      if (signed)
        maxValue = (1n << BigInt(size5) * 8n - 1n) - 1n;
      else
        maxValue = 2n ** (BigInt(size5) * 8n) - 1n;
    } else if (typeof value === "number") {
      maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    }
    const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
    if (maxValue && value_ > maxValue || value_ < minValue) {
      const suffix = typeof value === "bigint" ? "n" : "";
      throw new IntegerOutOfRangeError2({
        max: maxValue ? `${maxValue}${suffix}` : void 0,
        min: `${minValue}${suffix}`,
        signed,
        size: size5,
        value: `${value}${suffix}`
      });
    }
    const stringValue = (signed && value_ < 0 ? (1n << BigInt(size5 * 8)) + BigInt(value_) : value_).toString(16);
    const hex = `0x${stringValue}`;
    if (size5)
      return padLeft(hex, size5);
    return hex;
  }
  function fromString2(value, options = {}) {
    return fromBytes(encoder4.encode(value), options);
  }
  function padLeft(value, size5) {
    return pad3(value, { dir: "left", size: size5 });
  }
  function padRight(value, size5) {
    return pad3(value, { dir: "right", size: size5 });
  }
  function slice3(value, start, end, options = {}) {
    const { strict } = options;
    assertStartOffset3(value, start);
    const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
    if (strict)
      assertEndOffset3(value_, start, end);
    return value_;
  }
  function size3(value) {
    return Math.ceil((value.length - 2) / 2);
  }
  function trimLeft2(value) {
    return trim3(value, { dir: "left" });
  }
  function toBigInt(hex, options = {}) {
    const { signed } = options;
    if (options.size)
      assertSize3(hex, options.size);
    const value = BigInt(hex);
    if (!signed)
      return value;
    const size5 = (hex.length - 2) / 2;
    const max_unsigned = (1n << BigInt(size5) * 8n) - 1n;
    const max_signed = max_unsigned >> 1n;
    if (value <= max_signed)
      return value;
    return value - max_unsigned - 1n;
  }
  function toNumber(hex, options = {}) {
    const { signed, size: size5 } = options;
    if (!signed && !size5)
      return Number(hex);
    return Number(toBigInt(hex, options));
  }
  function validate2(value, options = {}) {
    const { strict = false } = options;
    try {
      assert2(value, { strict });
      return true;
    } catch {
      return false;
    }
  }
  var encoder4, hexes3, IntegerOutOfRangeError2, InvalidHexTypeError, InvalidHexValueError, SizeOverflowError3, SliceOffsetOutOfBoundsError3, SizeExceedsPaddingSizeError3;
  var init_Hex = __esm({
    "node_modules/ox/_esm/core/Hex.js"() {
      init_Errors();
      init_hex();
      init_Json();
      encoder4 = /* @__PURE__ */ new TextEncoder();
      hexes3 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
      IntegerOutOfRangeError2 = class extends BaseError3 {
        constructor({ max, min, signed, size: size5, value }) {
          super(`Number \`${value}\` is not in safe${size5 ? ` ${size5 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.IntegerOutOfRangeError"
          });
        }
      };
      InvalidHexTypeError = class extends BaseError3 {
        constructor(value) {
          super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, {
            metaMessages: ['Hex types must be represented as `"0x${string}"`.']
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.InvalidHexTypeError"
          });
        }
      };
      InvalidHexValueError = class extends BaseError3 {
        constructor(value) {
          super(`Value \`${value}\` is an invalid hex value.`, {
            metaMessages: [
              'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).'
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.InvalidHexValueError"
          });
        }
      };
      SizeOverflowError3 = class extends BaseError3 {
        constructor({ givenSize, maxSize }) {
          super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.SizeOverflowError"
          });
        }
      };
      SliceOffsetOutOfBoundsError3 = class extends BaseError3 {
        constructor({ offset, position, size: size5 }) {
          super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.SliceOffsetOutOfBoundsError"
          });
        }
      };
      SizeExceedsPaddingSizeError3 = class extends BaseError3 {
        constructor({ size: size5, targetSize, type }) {
          super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.SizeExceedsPaddingSizeError"
          });
        }
      };
    }
  });

  // node_modules/ox/_esm/core/Withdrawal.js
  function toRpc(withdrawal) {
    return {
      address: withdrawal.address,
      amount: fromNumber(withdrawal.amount),
      index: fromNumber(withdrawal.index),
      validatorIndex: fromNumber(withdrawal.validatorIndex)
    };
  }
  var init_Withdrawal = __esm({
    "node_modules/ox/_esm/core/Withdrawal.js"() {
      init_Hex();
    }
  });

  // node_modules/ox/_esm/core/BlockOverrides.js
  function toRpc2(blockOverrides) {
    return {
      ...typeof blockOverrides.baseFeePerGas === "bigint" && {
        baseFeePerGas: fromNumber(blockOverrides.baseFeePerGas)
      },
      ...typeof blockOverrides.blobBaseFee === "bigint" && {
        blobBaseFee: fromNumber(blockOverrides.blobBaseFee)
      },
      ...typeof blockOverrides.feeRecipient === "string" && {
        feeRecipient: blockOverrides.feeRecipient
      },
      ...typeof blockOverrides.gasLimit === "bigint" && {
        gasLimit: fromNumber(blockOverrides.gasLimit)
      },
      ...typeof blockOverrides.number === "bigint" && {
        number: fromNumber(blockOverrides.number)
      },
      ...typeof blockOverrides.prevRandao === "bigint" && {
        prevRandao: fromNumber(blockOverrides.prevRandao)
      },
      ...typeof blockOverrides.time === "bigint" && {
        time: fromNumber(blockOverrides.time)
      },
      ...blockOverrides.withdrawals && {
        withdrawals: blockOverrides.withdrawals.map(toRpc)
      }
    };
  }
  var init_BlockOverrides = __esm({
    "node_modules/ox/_esm/core/BlockOverrides.js"() {
      init_Hex();
      init_Withdrawal();
    }
  });

  // node_modules/viem/_esm/constants/abis.js
  var multicall3Abi, batchGatewayAbi, universalResolverErrors, universalResolverResolveAbi, universalResolverReverseAbi, textResolverAbi, addressResolverAbi, erc1271Abi, erc6492SignatureValidatorAbi;
  var init_abis = __esm({
    "node_modules/viem/_esm/constants/abis.js"() {
      multicall3Abi = [
        {
          inputs: [
            {
              components: [
                {
                  name: "target",
                  type: "address"
                },
                {
                  name: "allowFailure",
                  type: "bool"
                },
                {
                  name: "callData",
                  type: "bytes"
                }
              ],
              name: "calls",
              type: "tuple[]"
            }
          ],
          name: "aggregate3",
          outputs: [
            {
              components: [
                {
                  name: "success",
                  type: "bool"
                },
                {
                  name: "returnData",
                  type: "bytes"
                }
              ],
              name: "returnData",
              type: "tuple[]"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "getCurrentBlockTimestamp",
          outputs: [
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        }
      ];
      batchGatewayAbi = [
        {
          name: "query",
          type: "function",
          stateMutability: "view",
          inputs: [
            {
              type: "tuple[]",
              name: "queries",
              components: [
                {
                  type: "address",
                  name: "sender"
                },
                {
                  type: "string[]",
                  name: "urls"
                },
                {
                  type: "bytes",
                  name: "data"
                }
              ]
            }
          ],
          outputs: [
            {
              type: "bool[]",
              name: "failures"
            },
            {
              type: "bytes[]",
              name: "responses"
            }
          ]
        },
        {
          name: "HttpError",
          type: "error",
          inputs: [
            {
              type: "uint16",
              name: "status"
            },
            {
              type: "string",
              name: "message"
            }
          ]
        }
      ];
      universalResolverErrors = [
        {
          inputs: [
            {
              name: "dns",
              type: "bytes"
            }
          ],
          name: "DNSDecodingFailed",
          type: "error"
        },
        {
          inputs: [
            {
              name: "ens",
              type: "string"
            }
          ],
          name: "DNSEncodingFailed",
          type: "error"
        },
        {
          inputs: [],
          name: "EmptyAddress",
          type: "error"
        },
        {
          inputs: [
            {
              name: "status",
              type: "uint16"
            },
            {
              name: "message",
              type: "string"
            }
          ],
          name: "HttpError",
          type: "error"
        },
        {
          inputs: [],
          name: "InvalidBatchGatewayResponse",
          type: "error"
        },
        {
          inputs: [
            {
              name: "errorData",
              type: "bytes"
            }
          ],
          name: "ResolverError",
          type: "error"
        },
        {
          inputs: [
            {
              name: "name",
              type: "bytes"
            },
            {
              name: "resolver",
              type: "address"
            }
          ],
          name: "ResolverNotContract",
          type: "error"
        },
        {
          inputs: [
            {
              name: "name",
              type: "bytes"
            }
          ],
          name: "ResolverNotFound",
          type: "error"
        },
        {
          inputs: [
            {
              name: "primary",
              type: "string"
            },
            {
              name: "primaryAddress",
              type: "bytes"
            }
          ],
          name: "ReverseAddressMismatch",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "selector",
              type: "bytes4"
            }
          ],
          name: "UnsupportedResolverProfile",
          type: "error"
        }
      ];
      universalResolverResolveAbi = [
        ...universalResolverErrors,
        {
          name: "resolveWithGateways",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "name", type: "bytes" },
            { name: "data", type: "bytes" },
            { name: "gateways", type: "string[]" }
          ],
          outputs: [
            { name: "", type: "bytes" },
            { name: "address", type: "address" }
          ]
        }
      ];
      universalResolverReverseAbi = [
        ...universalResolverErrors,
        {
          name: "reverseWithGateways",
          type: "function",
          stateMutability: "view",
          inputs: [
            { type: "bytes", name: "reverseName" },
            { type: "uint256", name: "coinType" },
            { type: "string[]", name: "gateways" }
          ],
          outputs: [
            { type: "string", name: "resolvedName" },
            { type: "address", name: "resolver" },
            { type: "address", name: "reverseResolver" }
          ]
        }
      ];
      textResolverAbi = [
        {
          name: "text",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "name", type: "bytes32" },
            { name: "key", type: "string" }
          ],
          outputs: [{ name: "", type: "string" }]
        }
      ];
      addressResolverAbi = [
        {
          name: "addr",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "name", type: "bytes32" }],
          outputs: [{ name: "", type: "address" }]
        },
        {
          name: "addr",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "name", type: "bytes32" },
            { name: "coinType", type: "uint256" }
          ],
          outputs: [{ name: "", type: "bytes" }]
        }
      ];
      erc1271Abi = [
        {
          name: "isValidSignature",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "hash", type: "bytes32" },
            { name: "signature", type: "bytes" }
          ],
          outputs: [{ name: "", type: "bytes4" }]
        }
      ];
      erc6492SignatureValidatorAbi = [
        {
          inputs: [
            {
              name: "_signer",
              type: "address"
            },
            {
              name: "_hash",
              type: "bytes32"
            },
            {
              name: "_signature",
              type: "bytes"
            }
          ],
          stateMutability: "nonpayable",
          type: "constructor"
        },
        {
          inputs: [
            {
              name: "_signer",
              type: "address"
            },
            {
              name: "_hash",
              type: "bytes32"
            },
            {
              name: "_signature",
              type: "bytes"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "isValidSig"
        }
      ];
    }
  });

  // node_modules/viem/_esm/constants/contract.js
  var aggregate3Signature;
  var init_contract2 = __esm({
    "node_modules/viem/_esm/constants/contract.js"() {
      aggregate3Signature = "0x82ad56cb";
    }
  });

  // node_modules/viem/_esm/constants/contracts.js
  var deploylessCallViaBytecodeBytecode, deploylessCallViaFactoryBytecode, erc6492SignatureValidatorByteCode, multicall3Bytecode;
  var init_contracts = __esm({
    "node_modules/viem/_esm/constants/contracts.js"() {
      deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
      deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
      erc6492SignatureValidatorByteCode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
      multicall3Bytecode = "0x608060405234801561001057600080fd5b506115b9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e14610325578063bce38bd714610350578063c3077fa914610380578063ee82ac5e146103b2576100f3565b80634d2301cc1461026257806372425d9d1461029f57806382ad56cb146102ca57806386d516e8146102fa576100f3565b80633408e470116100c65780633408e470146101af578063399542e9146101da5780633e64a6961461020c57806342cbb15c14610237576100f3565b80630f28c97d146100f8578063174dea7114610123578063252dba421461015357806327e86d6e14610184575b600080fd5b34801561010457600080fd5b5061010d6103ef565b60405161011a9190610c0a565b60405180910390f35b61013d60048036038101906101389190610c94565b6103f7565b60405161014a9190610e94565b60405180910390f35b61016d60048036038101906101689190610f0c565b610615565b60405161017b92919061101b565b60405180910390f35b34801561019057600080fd5b506101996107ab565b6040516101a69190611064565b60405180910390f35b3480156101bb57600080fd5b506101c46107b7565b6040516101d19190610c0a565b60405180910390f35b6101f460048036038101906101ef91906110ab565b6107bf565b6040516102039392919061110b565b60405180910390f35b34801561021857600080fd5b506102216107e1565b60405161022e9190610c0a565b60405180910390f35b34801561024357600080fd5b5061024c6107e9565b6040516102599190610c0a565b60405180910390f35b34801561026e57600080fd5b50610289600480360381019061028491906111a7565b6107f1565b6040516102969190610c0a565b60405180910390f35b3480156102ab57600080fd5b506102b4610812565b6040516102c19190610c0a565b60405180910390f35b6102e460048036038101906102df919061122a565b61081a565b6040516102f19190610e94565b60405180910390f35b34801561030657600080fd5b5061030f6109e4565b60405161031c9190610c0a565b60405180910390f35b34801561033157600080fd5b5061033a6109ec565b6040516103479190611286565b60405180910390f35b61036a600480360381019061036591906110ab565b6109f4565b6040516103779190610e94565b60405180910390f35b61039a60048036038101906103959190610f0c565b610ba6565b6040516103a99392919061110b565b60405180910390f35b3480156103be57600080fd5b506103d960048036038101906103d491906112cd565b610bca565b6040516103e69190611064565b60405180910390f35b600042905090565b60606000808484905090508067ffffffffffffffff81111561041c5761041b6112fa565b5b60405190808252806020026020018201604052801561045557816020015b610442610bd5565b81526020019060019003908161043a5790505b5092503660005b828110156105c957600085828151811061047957610478611329565b5b6020026020010151905087878381811061049657610495611329565b5b90506020028101906104a89190611367565b925060008360400135905080860195508360000160208101906104cb91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16818580606001906104f2919061138f565b604051610500929190611431565b60006040518083038185875af1925050503d806000811461053d576040519150601f19603f3d011682016040523d82523d6000602084013e610542565b606091505b5083600001846020018290528215151515815250505081516020850135176105bc577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b826001019250505061045c565b5082341461060c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610603906114a7565b60405180910390fd5b50505092915050565b6000606043915060008484905090508067ffffffffffffffff81111561063e5761063d6112fa565b5b60405190808252806020026020018201604052801561067157816020015b606081526020019060019003908161065c5790505b5091503660005b828110156107a157600087878381811061069557610694611329565b5b90506020028101906106a791906114c7565b92508260000160208101906106bc91906111a7565b73ffffffffffffffffffffffffffffffffffffffff168380602001906106e2919061138f565b6040516106f0929190611431565b6000604051808303816000865af19150503d806000811461072d576040519150601f19603f3d011682016040523d82523d6000602084013e610732565b606091505b5086848151811061074657610745611329565b5b60200260200101819052819250505080610795576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078c9061153b565b60405180910390fd5b81600101915050610678565b5050509250929050565b60006001430340905090565b600046905090565b6000806060439250434091506107d68686866109f4565b905093509350939050565b600048905090565b600043905090565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b600044905090565b606060008383905090508067ffffffffffffffff81111561083e5761083d6112fa565b5b60405190808252806020026020018201604052801561087757816020015b610864610bd5565b81526020019060019003908161085c5790505b5091503660005b828110156109db57600084828151811061089b5761089a611329565b5b602002602001015190508686838181106108b8576108b7611329565b5b90506020028101906108ca919061155b565b92508260000160208101906108df91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060400190610905919061138f565b604051610913929190611431565b6000604051808303816000865af19150503d8060008114610950576040519150601f19603f3d011682016040523d82523d6000602084013e610955565b606091505b5082600001836020018290528215151515815250505080516020840135176109cf577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b8160010191505061087e565b50505092915050565b600045905090565b600041905090565b606060008383905090508067ffffffffffffffff811115610a1857610a176112fa565b5b604051908082528060200260200182016040528015610a5157816020015b610a3e610bd5565b815260200190600190039081610a365790505b5091503660005b82811015610b9c576000848281518110610a7557610a74611329565b5b60200260200101519050868683818110610a9257610a91611329565b5b9050602002810190610aa491906114c7565b9250826000016020810190610ab991906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060200190610adf919061138f565b604051610aed929190611431565b6000604051808303816000865af19150503d8060008114610b2a576040519150601f19603f3d011682016040523d82523d6000602084013e610b2f565b606091505b508260000183602001829052821515151581525050508715610b90578060000151610b8f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b869061153b565b60405180910390fd5b5b81600101915050610a58565b5050509392505050565b6000806060610bb7600186866107bf565b8093508194508295505050509250925092565b600081409050919050565b6040518060400160405280600015158152602001606081525090565b6000819050919050565b610c0481610bf1565b82525050565b6000602082019050610c1f6000830184610bfb565b92915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f840112610c5457610c53610c2f565b5b8235905067ffffffffffffffff811115610c7157610c70610c34565b5b602083019150836020820283011115610c8d57610c8c610c39565b5b9250929050565b60008060208385031215610cab57610caa610c25565b5b600083013567ffffffffffffffff811115610cc957610cc8610c2a565b5b610cd585828601610c3e565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60008115159050919050565b610d2281610d0d565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d62578082015181840152602081019050610d47565b83811115610d71576000848401525b50505050565b6000601f19601f8301169050919050565b6000610d9382610d28565b610d9d8185610d33565b9350610dad818560208601610d44565b610db681610d77565b840191505092915050565b6000604083016000830151610dd96000860182610d19565b5060208301518482036020860152610df18282610d88565b9150508091505092915050565b6000610e0a8383610dc1565b905092915050565b6000602082019050919050565b6000610e2a82610ce1565b610e348185610cec565b935083602082028501610e4685610cfd565b8060005b85811015610e825784840389528151610e638582610dfe565b9450610e6e83610e12565b925060208a01995050600181019050610e4a565b50829750879550505050505092915050565b60006020820190508181036000830152610eae8184610e1f565b905092915050565b60008083601f840112610ecc57610ecb610c2f565b5b8235905067ffffffffffffffff811115610ee957610ee8610c34565b5b602083019150836020820283011115610f0557610f04610c39565b5b9250929050565b60008060208385031215610f2357610f22610c25565b5b600083013567ffffffffffffffff811115610f4157610f40610c2a565b5b610f4d85828601610eb6565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000610f918383610d88565b905092915050565b6000602082019050919050565b6000610fb182610f59565b610fbb8185610f64565b935083602082028501610fcd85610f75565b8060005b858110156110095784840389528151610fea8582610f85565b9450610ff583610f99565b925060208a01995050600181019050610fd1565b50829750879550505050505092915050565b60006040820190506110306000830185610bfb565b81810360208301526110428184610fa6565b90509392505050565b6000819050919050565b61105e8161104b565b82525050565b60006020820190506110796000830184611055565b92915050565b61108881610d0d565b811461109357600080fd5b50565b6000813590506110a58161107f565b92915050565b6000806000604084860312156110c4576110c3610c25565b5b60006110d286828701611096565b935050602084013567ffffffffffffffff8111156110f3576110f2610c2a565b5b6110ff86828701610eb6565b92509250509250925092565b60006060820190506111206000830186610bfb565b61112d6020830185611055565b818103604083015261113f8184610e1f565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061117482611149565b9050919050565b61118481611169565b811461118f57600080fd5b50565b6000813590506111a18161117b565b92915050565b6000602082840312156111bd576111bc610c25565b5b60006111cb84828501611192565b91505092915050565b60008083601f8401126111ea576111e9610c2f565b5b8235905067ffffffffffffffff81111561120757611206610c34565b5b60208301915083602082028301111561122357611222610c39565b5b9250929050565b6000806020838503121561124157611240610c25565b5b600083013567ffffffffffffffff81111561125f5761125e610c2a565b5b61126b858286016111d4565b92509250509250929050565b61128081611169565b82525050565b600060208201905061129b6000830184611277565b92915050565b6112aa81610bf1565b81146112b557600080fd5b50565b6000813590506112c7816112a1565b92915050565b6000602082840312156112e3576112e2610c25565b5b60006112f1848285016112b8565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b60008235600160800383360303811261138357611382611358565b5b80830191505092915050565b600080833560016020038436030381126113ac576113ab611358565b5b80840192508235915067ffffffffffffffff8211156113ce576113cd61135d565b5b6020830192506001820236038313156113ea576113e9611362565b5b509250929050565b600081905092915050565b82818337600083830152505050565b600061141883856113f2565b93506114258385846113fd565b82840190509392505050565b600061143e82848661140c565b91508190509392505050565b600082825260208201905092915050565b7f4d756c746963616c6c333a2076616c7565206d69736d61746368000000000000600082015250565b6000611491601a8361144a565b915061149c8261145b565b602082019050919050565b600060208201905081810360008301526114c081611484565b9050919050565b6000823560016040038336030381126114e3576114e2611358565b5b80830191505092915050565b7f4d756c746963616c6c333a2063616c6c206661696c6564000000000000000000600082015250565b600061152560178361144a565b9150611530826114ef565b602082019050919050565b6000602082019050818103600083015261155481611518565b9050919050565b60008235600160600383360303811261157757611576611358565b5b8083019150509291505056fea264697066735822122020c1bc9aacf8e4a6507193432a895a8e77094f45a1395583f07b24e860ef06cd64736f6c634300080c0033";
    }
  });

  // node_modules/viem/_esm/errors/chain.js
  var ChainDoesNotSupportContract, ClientChainNotConfiguredError;
  var init_chain = __esm({
    "node_modules/viem/_esm/errors/chain.js"() {
      init_base();
      ChainDoesNotSupportContract = class extends BaseError2 {
        constructor({ blockNumber, chain, contract }) {
          super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
            metaMessages: [
              "This could be due to any of the following:",
              ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [
                `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`
              ] : [
                `- The chain does not have the contract "${contract.name}" configured.`
              ]
            ],
            name: "ChainDoesNotSupportContract"
          });
        }
      };
      ClientChainNotConfiguredError = class extends BaseError2 {
        constructor() {
          super("No chain was provided to the Client.", {
            name: "ClientChainNotConfiguredError"
          });
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/abi/encodeDeployData.js
  function encodeDeployData(parameters) {
    const { abi: abi2, args, bytecode } = parameters;
    if (!args || args.length === 0)
      return bytecode;
    const description = abi2.find((x) => "type" in x && x.type === "constructor");
    if (!description)
      throw new AbiConstructorNotFoundError({ docsPath: docsPath5 });
    if (!("inputs" in description))
      throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
    if (!description.inputs || description.inputs.length === 0)
      throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
    const data = encodeAbiParameters(description.inputs, args);
    return concatHex([bytecode, data]);
  }
  var docsPath5;
  var init_encodeDeployData = __esm({
    "node_modules/viem/_esm/utils/abi/encodeDeployData.js"() {
      init_abi();
      init_concat();
      init_encodeAbiParameters();
      docsPath5 = "/docs/contract/encodeDeployData";
    }
  });

  // node_modules/viem/_esm/utils/chain/getChainContractAddress.js
  function getChainContractAddress({ blockNumber, chain, contract: name }) {
    const contract = chain?.contracts?.[name];
    if (!contract)
      throw new ChainDoesNotSupportContract({
        chain,
        contract: { name }
      });
    if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber)
      throw new ChainDoesNotSupportContract({
        blockNumber,
        chain,
        contract: {
          name,
          blockCreated: contract.blockCreated
        }
      });
    return contract.address;
  }
  var init_getChainContractAddress = __esm({
    "node_modules/viem/_esm/utils/chain/getChainContractAddress.js"() {
      init_chain();
    }
  });

  // node_modules/viem/_esm/utils/errors/getCallError.js
  function getCallError(err, { docsPath: docsPath8, ...args }) {
    const cause = (() => {
      const cause2 = getNodeError(err, args);
      if (cause2 instanceof UnknownNodeError)
        return err;
      return cause2;
    })();
    return new CallExecutionError(cause, {
      docsPath: docsPath8,
      ...args
    });
  }
  var init_getCallError = __esm({
    "node_modules/viem/_esm/utils/errors/getCallError.js"() {
      init_contract();
      init_node();
      init_getNodeError();
    }
  });

  // node_modules/viem/_esm/utils/promise/withResolvers.js
  function withResolvers() {
    let resolve = () => void 0;
    let reject = () => void 0;
    const promise = new Promise((resolve_, reject_) => {
      resolve = resolve_;
      reject = reject_;
    });
    return { promise, resolve, reject };
  }
  var init_withResolvers = __esm({
    "node_modules/viem/_esm/utils/promise/withResolvers.js"() {
    }
  });

  // node_modules/viem/_esm/utils/promise/createBatchScheduler.js
  function createBatchScheduler({ fn, id, shouldSplitBatch, wait: wait2 = 0, sort }) {
    const exec = async () => {
      const scheduler = getScheduler();
      flush();
      const args = scheduler.map(({ args: args2 }) => args2);
      if (args.length === 0)
        return;
      fn(args).then((data) => {
        if (sort && Array.isArray(data))
          data.sort(sort);
        for (let i = 0; i < scheduler.length; i++) {
          const { resolve } = scheduler[i];
          resolve?.([data[i], data]);
        }
      }).catch((err) => {
        for (let i = 0; i < scheduler.length; i++) {
          const { reject } = scheduler[i];
          reject?.(err);
        }
      });
    };
    const flush = () => schedulerCache.delete(id);
    const getBatchedArgs = () => getScheduler().map(({ args }) => args);
    const getScheduler = () => schedulerCache.get(id) || [];
    const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
    return {
      flush,
      async schedule(args) {
        const { promise, resolve, reject } = withResolvers();
        const split2 = shouldSplitBatch?.([...getBatchedArgs(), args]);
        if (split2)
          exec();
        const hasActiveScheduler = getScheduler().length > 0;
        if (hasActiveScheduler) {
          setScheduler({ args, resolve, reject });
          return promise;
        }
        setScheduler({ args, resolve, reject });
        setTimeout(exec, wait2);
        return promise;
      }
    };
  }
  var schedulerCache;
  var init_createBatchScheduler = __esm({
    "node_modules/viem/_esm/utils/promise/createBatchScheduler.js"() {
      init_withResolvers();
      schedulerCache = /* @__PURE__ */ new Map();
    }
  });

  // node_modules/viem/_esm/errors/ccip.js
  var OffchainLookupError, OffchainLookupResponseMalformedError, OffchainLookupSenderMismatchError;
  var init_ccip = __esm({
    "node_modules/viem/_esm/errors/ccip.js"() {
      init_stringify();
      init_base();
      init_utils3();
      OffchainLookupError = class extends BaseError2 {
        constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
          super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
            cause,
            metaMessages: [
              ...cause.metaMessages || [],
              cause.metaMessages?.length ? "" : [],
              "Offchain Gateway Call:",
              urls && [
                "  Gateway URL(s):",
                ...urls.map((url) => `    ${getUrl(url)}`)
              ],
              `  Sender: ${sender}`,
              `  Data: ${data}`,
              `  Callback selector: ${callbackSelector}`,
              `  Extra data: ${extraData}`
            ].flat(),
            name: "OffchainLookupError"
          });
        }
      };
      OffchainLookupResponseMalformedError = class extends BaseError2 {
        constructor({ result, url }) {
          super("Offchain gateway response is malformed. Response data must be a hex value.", {
            metaMessages: [
              `Gateway URL: ${getUrl(url)}`,
              `Response: ${stringify(result)}`
            ],
            name: "OffchainLookupResponseMalformedError"
          });
        }
      };
      OffchainLookupSenderMismatchError = class extends BaseError2 {
        constructor({ sender, to }) {
          super("Reverted sender address does not match target contract address (`to`).", {
            metaMessages: [
              `Contract address: ${to}`,
              `OffchainLookup sender address: ${sender}`
            ],
            name: "OffchainLookupSenderMismatchError"
          });
        }
      };
    }
  });

  // node_modules/viem/_esm/utils/abi/decodeFunctionData.js
  function decodeFunctionData(parameters) {
    const { abi: abi2, data } = parameters;
    const signature = slice(data, 0, 4);
    const description = abi2.find((x) => x.type === "function" && signature === toFunctionSelector(formatAbiItem2(x)));
    if (!description)
      throw new AbiFunctionSignatureNotFoundError(signature, {
        docsPath: "/docs/contract/decodeFunctionData"
      });
    return {
      functionName: description.name,
      args: "inputs" in description && description.inputs && description.inputs.length > 0 ? decodeAbiParameters(description.inputs, slice(data, 4)) : void 0
    };
  }
  var init_decodeFunctionData = __esm({
    "node_modules/viem/_esm/utils/abi/decodeFunctionData.js"() {
      init_abi();
      init_slice();
      init_toFunctionSelector();
      init_decodeAbiParameters();
      init_formatAbiItem2();
    }
  });

  // node_modules/viem/_esm/utils/abi/encodeErrorResult.js
  function encodeErrorResult(parameters) {
    const { abi: abi2, errorName, args } = parameters;
    let abiItem = abi2[0];
    if (errorName) {
      const item = getAbiItem({ abi: abi2, args, name: errorName });
      if (!item)
        throw new AbiErrorNotFoundError(errorName, { docsPath: docsPath6 });
      abiItem = item;
    }
    if (abiItem.type !== "error")
      throw new AbiErrorNotFoundError(void 0, { docsPath: docsPath6 });
    const definition = formatAbiItem2(abiItem);
    const signature = toFunctionSelector(definition);
    let data = "0x";
    if (args && args.length > 0) {
      if (!abiItem.inputs)
        throw new AbiErrorInputsNotFoundError(abiItem.name, { docsPath: docsPath6 });
      data = encodeAbiParameters(abiItem.inputs, args);
    }
    return concatHex([signature, data]);
  }
  var docsPath6;
  var init_encodeErrorResult = __esm({
    "node_modules/viem/_esm/utils/abi/encodeErrorResult.js"() {
      init_abi();
      init_concat();
      init_toFunctionSelector();
      init_encodeAbiParameters();
      init_formatAbiItem2();
      init_getAbiItem();
      docsPath6 = "/docs/contract/encodeErrorResult";
    }
  });

  // node_modules/viem/_esm/utils/abi/encodeFunctionResult.js
  function encodeFunctionResult(parameters) {
    const { abi: abi2, functionName, result } = parameters;
    let abiItem = abi2[0];
    if (functionName) {
      const item = getAbiItem({ abi: abi2, name: functionName });
      if (!item)
        throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath7 });
      abiItem = item;
    }
    if (abiItem.type !== "function")
      throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath7 });
    if (!abiItem.outputs)
      throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath7 });
    const values = (() => {
      if (abiItem.outputs.length === 0)
        return [];
      if (abiItem.outputs.length === 1)
        return [result];
      if (Array.isArray(result))
        return result;
      throw new InvalidArrayError(result);
    })();
    return encodeAbiParameters(abiItem.outputs, values);
  }
  var docsPath7;
  var init_encodeFunctionResult = __esm({
    "node_modules/viem/_esm/utils/abi/encodeFunctionResult.js"() {
      init_abi();
      init_encodeAbiParameters();
      init_getAbiItem();
      docsPath7 = "/docs/contract/encodeFunctionResult";
    }
  });

  // node_modules/viem/_esm/utils/ens/localBatchGatewayRequest.js
  async function localBatchGatewayRequest(parameters) {
    const { data, ccipRequest: ccipRequest2 } = parameters;
    const { args: [queries] } = decodeFunctionData({ abi: batchGatewayAbi, data });
    const failures = [];
    const responses = [];
    await Promise.all(queries.map(async (query, i) => {
      try {
        responses[i] = query.urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({ data: query.data, ccipRequest: ccipRequest2 }) : await ccipRequest2(query);
        failures[i] = false;
      } catch (err) {
        failures[i] = true;
        responses[i] = encodeError(err);
      }
    }));
    return encodeFunctionResult({
      abi: batchGatewayAbi,
      functionName: "query",
      result: [failures, responses]
    });
  }
  function encodeError(error) {
    if (error.name === "HttpRequestError" && error.status)
      return encodeErrorResult({
        abi: batchGatewayAbi,
        errorName: "HttpError",
        args: [error.status, error.shortMessage]
      });
    return encodeErrorResult({
      abi: [solidityError],
      errorName: "Error",
      args: ["shortMessage" in error ? error.shortMessage : error.message]
    });
  }
  var localBatchGatewayUrl;
  var init_localBatchGatewayRequest = __esm({
    "node_modules/viem/_esm/utils/ens/localBatchGatewayRequest.js"() {
      init_abis();
      init_solidity();
      init_decodeFunctionData();
      init_encodeErrorResult();
      init_encodeFunctionResult();
      localBatchGatewayUrl = "x-batch-gateway:true";
    }
  });

  // node_modules/viem/_esm/utils/ccip.js
  var ccip_exports = {};
  __export(ccip_exports, {
    ccipRequest: () => ccipRequest,
    offchainLookup: () => offchainLookup,
    offchainLookupAbiItem: () => offchainLookupAbiItem,
    offchainLookupSignature: () => offchainLookupSignature
  });
  async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
    const { args } = decodeErrorResult({
      data,
      abi: [offchainLookupAbiItem]
    });
    const [sender, urls, callData, callbackSelector, extraData] = args;
    const { ccipRead } = client;
    const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
    try {
      if (!isAddressEqual(to, sender))
        throw new OffchainLookupSenderMismatchError({ sender, to });
      const result = urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({
        data: callData,
        ccipRequest: ccipRequest_
      }) : await ccipRequest_({ data: callData, sender, urls });
      const { data: data_ } = await call(client, {
        blockNumber,
        blockTag,
        data: concat([
          callbackSelector,
          encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
        ]),
        to
      });
      return data_;
    } catch (err) {
      throw new OffchainLookupError({
        callbackSelector,
        cause: err,
        data,
        extraData,
        sender,
        urls
      });
    }
  }
  async function ccipRequest({ data, sender, urls }) {
    let error = new Error("An unknown error occurred.");
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const method = url.includes("{data}") ? "GET" : "POST";
      const body = method === "POST" ? { data, sender } : void 0;
      const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
      try {
        const response = await fetch(url.replace("{sender}", sender.toLowerCase()).replace("{data}", data), {
          body: JSON.stringify(body),
          headers,
          method
        });
        let result;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
          result = (await response.json()).data;
        } else {
          result = await response.text();
        }
        if (!response.ok) {
          error = new HttpRequestError({
            body,
            details: result?.error ? stringify(result.error) : response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
          continue;
        }
        if (!isHex(result)) {
          error = new OffchainLookupResponseMalformedError({
            result,
            url
          });
          continue;
        }
        return result;
      } catch (err) {
        error = new HttpRequestError({
          body,
          details: err.message,
          url
        });
      }
    }
    throw error;
  }
  var offchainLookupSignature, offchainLookupAbiItem;
  var init_ccip2 = __esm({
    "node_modules/viem/_esm/utils/ccip.js"() {
      init_call();
      init_ccip();
      init_request();
      init_decodeErrorResult();
      init_encodeAbiParameters();
      init_isAddressEqual();
      init_concat();
      init_isHex();
      init_localBatchGatewayRequest();
      init_stringify();
      offchainLookupSignature = "0x556f1830";
      offchainLookupAbiItem = {
        name: "OffchainLookup",
        type: "error",
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "urls",
            type: "string[]"
          },
          {
            name: "callData",
            type: "bytes"
          },
          {
            name: "callbackFunction",
            type: "bytes4"
          },
          {
            name: "extraData",
            type: "bytes"
          }
        ]
      };
    }
  });

  // node_modules/viem/_esm/actions/public/call.js
  async function call(client, args) {
    const { account: account_ = client.account, authorizationList, batch = Boolean(client.batch?.multicall), blockNumber, blockTag = client.experimental_blockTag ?? "latest", accessList, blobs, blockOverrides, code, data: data_, factory, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride, ...rest } = args;
    const account = account_ ? parseAccount(account_) : void 0;
    if (code && (factory || factoryData))
      throw new BaseError2("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
    if (code && to)
      throw new BaseError2("Cannot provide both `code` & `to` as parameters.");
    const deploylessCallViaBytecode = code && data_;
    const deploylessCallViaFactory = factory && factoryData && to && data_;
    const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
    const data = (() => {
      if (deploylessCallViaBytecode)
        return toDeploylessCallViaBytecodeData({
          code,
          data: data_
        });
      if (deploylessCallViaFactory)
        return toDeploylessCallViaFactoryData({
          data: data_,
          factory,
          factoryData,
          to
        });
      return data_;
    })();
    try {
      assertRequest(args);
      const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const rpcBlockOverrides = blockOverrides ? toRpc2(blockOverrides) : void 0;
      const rpcStateOverride = serializeStateOverride(stateOverride);
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format({
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
        accessList,
        account,
        authorizationList,
        blobs,
        data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to: deploylessCall ? void 0 : to,
        value
      }, "call");
      if (batch && shouldPerformMulticall({ request }) && !rpcStateOverride && !rpcBlockOverrides) {
        try {
          return await scheduleMulticall(client, {
            ...request,
            blockNumber,
            blockTag
          });
        } catch (err) {
          if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract))
            throw err;
        }
      }
      const params = (() => {
        const base = [
          request,
          block
        ];
        if (rpcStateOverride && rpcBlockOverrides)
          return [...base, rpcStateOverride, rpcBlockOverrides];
        if (rpcStateOverride)
          return [...base, rpcStateOverride];
        if (rpcBlockOverrides)
          return [...base, {}, rpcBlockOverrides];
        return base;
      })();
      const response = await client.request({
        method: "eth_call",
        params
      });
      if (response === "0x")
        return { data: void 0 };
      return { data: response };
    } catch (err) {
      const data2 = getRevertErrorData(err);
      const { offchainLookup: offchainLookup2, offchainLookupSignature: offchainLookupSignature2 } = await Promise.resolve().then(() => (init_ccip2(), ccip_exports));
      if (client.ccipRead !== false && data2?.slice(0, 10) === offchainLookupSignature2 && to)
        return { data: await offchainLookup2(client, { data: data2, to }) };
      if (deploylessCall && data2?.slice(0, 10) === "0x101bb98d")
        throw new CounterfactualDeploymentFailedError({ factory });
      throw getCallError(err, {
        ...args,
        account,
        chain: client.chain
      });
    }
  }
  function shouldPerformMulticall({ request }) {
    const { data, to, ...request_ } = request;
    if (!data)
      return false;
    if (data.startsWith(aggregate3Signature))
      return false;
    if (!to)
      return false;
    if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
      return false;
    return true;
  }
  async function scheduleMulticall(client, args) {
    const { batchSize = 1024, deployless = false, wait: wait2 = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
    const { blockNumber, blockTag = client.experimental_blockTag ?? "latest", data, to } = args;
    const multicallAddress = (() => {
      if (deployless)
        return null;
      if (args.multicallAddress)
        return args.multicallAddress;
      if (client.chain) {
        return getChainContractAddress({
          blockNumber,
          chain: client.chain,
          contract: "multicall3"
        });
      }
      throw new ClientChainNotConfiguredError();
    })();
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const { schedule } = createBatchScheduler({
      id: `${client.uid}.${block}`,
      wait: wait2,
      shouldSplitBatch(args2) {
        const size5 = args2.reduce((size6, { data: data2 }) => size6 + (data2.length - 2), 0);
        return size5 > batchSize * 2;
      },
      fn: async (requests) => {
        const calls = requests.map((request) => ({
          allowFailure: true,
          callData: request.data,
          target: request.to
        }));
        const calldata = encodeFunctionData({
          abi: multicall3Abi,
          args: [calls],
          functionName: "aggregate3"
        });
        const data2 = await client.request({
          method: "eth_call",
          params: [
            {
              ...multicallAddress === null ? {
                data: toDeploylessCallViaBytecodeData({
                  code: multicall3Bytecode,
                  data: calldata
                })
              } : { to: multicallAddress, data: calldata }
            },
            block
          ]
        });
        return decodeFunctionResult({
          abi: multicall3Abi,
          args: [calls],
          functionName: "aggregate3",
          data: data2 || "0x"
        });
      }
    });
    const [{ returnData, success }] = await schedule({ data, to });
    if (!success)
      throw new RawContractError({ data: returnData });
    if (returnData === "0x")
      return { data: void 0 };
    return { data: returnData };
  }
  function toDeploylessCallViaBytecodeData(parameters) {
    const { code, data } = parameters;
    return encodeDeployData({
      abi: parseAbi(["constructor(bytes, bytes)"]),
      bytecode: deploylessCallViaBytecodeBytecode,
      args: [code, data]
    });
  }
  function toDeploylessCallViaFactoryData(parameters) {
    const { data, factory, factoryData, to } = parameters;
    return encodeDeployData({
      abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
      bytecode: deploylessCallViaFactoryBytecode,
      args: [to, data, factory, factoryData]
    });
  }
  function getRevertErrorData(err) {
    if (!(err instanceof BaseError2))
      return void 0;
    const error = err.walk();
    return typeof error?.data === "object" ? error.data?.data : error.data;
  }
  var init_call = __esm({
    "node_modules/viem/_esm/actions/public/call.js"() {
      init_exports();
      init_BlockOverrides();
      init_parseAccount();
      init_abis();
      init_contract2();
      init_contracts();
      init_base();
      init_chain();
      init_contract();
      init_decodeFunctionResult();
      init_encodeDeployData();
      init_encodeFunctionData();
      init_getChainContractAddress();
      init_toHex();
      init_getCallError();
      init_extract();
      init_transactionRequest();
      init_createBatchScheduler();
      init_stateOverride2();
      init_assertRequest();
    }
  });

  // src/common/manifest.js
  init_sha3();
  var MANIFEST_SCHEMA = "bitcoinu-build-manifest/v1";
  var MANIFEST_ALGORITHM = "sha256";
  var MAX_BUILD_VERSION = 9007199254740991n;
  var EXCLUDED_BASENAMES = [".DS_Store"];
  var MANIFEST_BASENAME = "build-manifest.json";
  var utf8 = (s) => new TextEncoder().encode(s);
  var bytesToHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  function isExcludedPath(path) {
    const base = path.split("/").pop();
    return EXCLUDED_BASENAMES.includes(base) || base === MANIFEST_BASENAME;
  }
  function normalizeBuildVersion(buildVersion) {
    let value;
    if (typeof buildVersion === "number") {
      if (!Number.isSafeInteger(buildVersion)) {
        throw new Error(`invalid buildVersion: ${buildVersion}`);
      }
      value = BigInt(buildVersion);
    } else if (typeof buildVersion === "bigint") {
      value = buildVersion;
    } else if (typeof buildVersion === "string" && /^(0|[1-9]\d*)$/.test(buildVersion)) {
      value = BigInt(buildVersion);
    } else {
      throw new Error(`invalid buildVersion: ${buildVersion}`);
    }
    if (value <= 0n || value > MAX_BUILD_VERSION) {
      throw new Error(`invalid buildVersion: ${buildVersion}`);
    }
    return value.toString();
  }
  function manifestPreimage(buildVersion, files) {
    const v = normalizeBuildVersion(buildVersion);
    const sorted = Object.keys(files).sort();
    for (const p of sorted) {
      if (!p.startsWith("/")) throw new Error(`manifest path must start with '/': ${p}`);
      const h = files[p];
      if (typeof h !== "string" || !/^[0-9a-f]{64}$/.test(h)) {
        throw new Error(`invalid sha256 for ${p}: ${h}`);
      }
    }
    return `${MANIFEST_SCHEMA}|buildVersion=${v}|algorithm=${MANIFEST_ALGORITHM}|` + sorted.map((p) => `${p}:${files[p]}`).join("|");
  }
  function computeBuildHash(buildVersion, files) {
    return `0x${bytesToHex(keccak_256(utf8(manifestPreimage(buildVersion, files))))}`;
  }
  async function sha256Hex(bytes) {
    if (globalThis.crypto?.subtle) {
      const buf = await globalThis.crypto.subtle.digest("SHA-256", bytes);
      return bytesToHex(new Uint8Array(buf));
    }
    const { sha256: sha2564 } = await Promise.resolve().then(() => (init_sha256(), sha256_exports));
    return bytesToHex(sha2564(bytes));
  }
  function validateManifestShape(m) {
    const problems = [];
    if (!m || typeof m !== "object") return ["manifest is not an object"];
    if (m.schema !== MANIFEST_SCHEMA) problems.push(`schema mismatch: ${m.schema}`);
    if (m.algorithm !== MANIFEST_ALGORITHM) problems.push(`algorithm mismatch: ${m.algorithm}`);
    try {
      normalizeBuildVersion(m.buildVersion);
    } catch {
      problems.push(`invalid buildVersion: ${m.buildVersion}`);
    }
    if (!m.files || typeof m.files !== "object" || Array.isArray(m.files)) {
      problems.push("files map missing");
    } else {
      for (const [p, h] of Object.entries(m.files)) {
        if (!p.startsWith("/")) {
          problems.push(`path without leading '/': ${p}`);
          break;
        }
        if (typeof h !== "string" || !/^[0-9a-f]{64}$/.test(h)) {
          problems.push(`bad sha256 for ${p}`);
          break;
        }
        if (isExcludedPath(p)) {
          problems.push(`excluded path present in manifest: ${p}`);
          break;
        }
      }
      if (Number(m.fileCount) !== Object.keys(m.files).length) {
        problems.push(`fileCount mismatch: ${m.fileCount} != ${Object.keys(m.files).length}`);
      }
    }
    return problems;
  }

  // src/loader/verify-core.js
  var VERIFIED_BUNDLE_ORIGIN = "https://r2.bitcoinu.org/frontend";
  function requireVerifiedBundleOrigin(value) {
    let parsed;
    try {
      parsed = new URL(String(value));
    } catch {
      throw new Error("bundleOrigin must be the direct verified static origin");
    }
    const normalizedPath = parsed.pathname.replace(/\/+$/, "") || "/";
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port || parsed.hostname !== "r2.bitcoinu.org" || normalizedPath !== "/frontend" || parsed.search || parsed.hash) {
      throw new Error("bundleOrigin must be https://r2.bitcoinu.org/frontend (Pages Functions are not trusted for verified bytes)");
    }
    return VERIFIED_BUNDLE_ORIGIN;
  }
  var LoaderStatus = Object.freeze({
    OK: "OK",
    NO_HASH_REGISTERED: "NO_HASH_REGISTERED",
    RPC_FAIL: "RPC_FAIL",
    FETCH_FAIL: "FETCH_FAIL",
    MAINTENANCE: "MAINTENANCE",
    MANIFEST_INVALID: "MANIFEST_INVALID",
    MANIFEST_HASH_MISMATCH: "MANIFEST_HASH_MISMATCH",
    FILE_HASH_MISMATCH: "FILE_HASH_MISMATCH",
    NOT_IN_MANIFEST: "NOT_IN_MANIFEST"
  });
  function classifyHttpFailure(status) {
    if (status === 503) return LoaderStatus.MAINTENANCE;
    return LoaderStatus.FETCH_FAIL;
  }
  function verifyManifestAgainstChain(manifest, chainRead) {
    if (!chainRead) return { status: LoaderStatus.NO_HASH_REGISTERED };
    const problems = validateManifestShape(manifest);
    if (problems.length) return { status: LoaderStatus.MANIFEST_INVALID, problems };
    if (normalizeBuildVersion(manifest.buildVersion) !== normalizeBuildVersion(chainRead.buildVersion)) {
      return {
        status: LoaderStatus.MANIFEST_HASH_MISMATCH,
        detail: `buildVersion mismatch: manifest=${manifest.buildVersion} chain=${chainRead.buildVersion}`
      };
    }
    const computed = computeBuildHash(manifest.buildVersion, manifest.files);
    if (computed.toLowerCase() !== String(chainRead.hash).toLowerCase()) {
      return {
        status: LoaderStatus.MANIFEST_HASH_MISMATCH,
        detail: `computed=${computed} chain=${chainRead.hash}`,
        preimageLength: manifestPreimage(manifest.buildVersion, manifest.files).length
      };
    }
    const warns = [];
    if (chainRead.registrationCount != null && BigInt(chainRead.registrationCount) > 1n) {
      warns.push({ code: "REREGISTERED", registrationCount: String(chainRead.registrationCount) });
    }
    return { status: LoaderStatus.OK, buildVersion: normalizeBuildVersion(manifest.buildVersion), computed, warns };
  }
  async function verifyFileBytes(manifestFiles, manifestPath, bytes) {
    const expected = manifestFiles[manifestPath];
    if (!expected) return { status: LoaderStatus.NOT_IN_MANIFEST, path: manifestPath };
    const actual = await sha256Hex(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
    if (actual !== expected) {
      return { status: LoaderStatus.FILE_HASH_MISMATCH, path: manifestPath, expected, actual };
    }
    return { status: LoaderStatus.OK, path: manifestPath };
  }
  async function verifyAllFiles(manifest, fetchBytes, { onProgress = null } = {}) {
    const paths = Object.keys(manifest.files).sort();
    const failures = [];
    let done = 0;
    for (const path of paths) {
      let res;
      try {
        res = await fetchBytes(path);
      } catch (e) {
        failures.push({ status: LoaderStatus.FETCH_FAIL, path, error: String(e?.message || e) });
        continue;
      }
      if (!res.ok) {
        failures.push({ status: classifyHttpFailure(res.status), path, httpStatus: res.status });
        continue;
      }
      const v = await verifyFileBytes(manifest.files, path, res.bytes);
      if (v.status !== LoaderStatus.OK) failures.push(v);
      done++;
      if (onProgress) onProgress(done, paths.length, path);
    }
    return { total: paths.length, verified: done - failures.filter((f) => f.status === LoaderStatus.FILE_HASH_MISMATCH).length, failures };
  }
  function buildCspHeader({ connectExtra = [], frameExtra = [] } = {}) {
    const connect = ["'self'", ...connectExtra].join(" ");
    const frame = ["'self'", ...frameExtra].join(" ");
    return [
      "default-src 'self'",
      // __NEXT_DATA__ 等のインラインscriptのため unsafe-inline を script に限り許容（将来 per-hash 化）
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      `connect-src ${connect}`,
      `frame-src ${frame}`,
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'"
    ].join("; ");
  }

  // config.js
  var DEFAULTS = {
    chainIdExpected: 1,
    // 独立公開RPCプリセット（鍵不要・運営管理外・法域分散）。ローダーもこの一覧を表示する。
    // ローダーは運営RPCを一切使わない（照合前に運営RPCを信じない）。
    // S3R4-U-RPC1: 復元は注入ウォレット、または固定 S の2本以上の一致で窓・名簿・時刻を読む。
    // 利用者が足した rpcUrls は復元の読みに使わない。運営 RPC は公開が全部無答のときだけ。
    // 2026-10-10 の実測で 1rpc は無答、flashbots は eth_call を拒否したため外し、
    // 公式の INDEPENDENT_RPCS と同じ Tenderly・dRPC を足した。配布前に生存を再測定する（Q22）。
    // ⚠️ 採用条件は「**CORS 許可あり**・鍵不要・運営管理外」。復元クライアントはブラウザで動くので、
    //    CORS を返さない RPC は選択肢に置くだけ無駄（選んだ利用者が原因不明の失敗を踏む）。
    //    2026-08-05 実測で差し替え:
    //      llamarpc       … CORS ヘッダ無し（ブラウザからは恒久的に使用不可）
    //      cloudflare-eth … eth_blockNumber が -32046 で応答不可
    //    （block-verifier は 2026-07-12 の実機テストで同じ2つを既に削除していたが、
    //      こちらに反映されていなかった）
    rpcPresets: [
      { name: "publicnode", url: "https://ethereum-rpc.publicnode.com" },
      { name: "tenderly", url: "https://gateway.tenderly.co/public/mainnet" },
      { name: "drpc", url: "https://eth.drpc.org" }
    ],
    // 運営RPC（復元クライアントの最終手段のみ。ローダーでは使用しない）
    // 非推奨: ここ（か localStorage の chatgameToolsConfig.operatorRpc）に置くと、ウォレットも公開ノードも答えない読みで、そのつど知らせずにこの値を使う＝運営を信頼することになり、運営への依存を生む。置いた端末では復元の画面の Contracts in use の枠に毎回示す（S3R6-CARRY-OPTRUST・便 DISP6）。
    operatorRpc: null,
    r2Base: "https://r2.bitcoinu.org",
    // 本体サイトのオリジン（メンバーカードのプロフィールリンク /user?id= の飛び先）
    siteOrigin: "https://bitcoinu.org",
    // Turnstile 隔離フレームのオリジン（K-S6-001/K-S6-009・2026-07-28）。
    // 検証済みアプリの CSP に frame-src として渡す。**本体の NEXT_PUBLIC_TURNSTILE_FRAME_ORIGIN と
    // 同じ値でなければ、検証経由の応募だけが黙って失敗する。**
    turnstileFrameOrigin: "https://verify.bitcoinu.org",
    // I1-03: ローダーが照合対象バンドルを取得する配信元。
    // Pages / pages.dev は functions/_middleware.js がbuildHashの外側で応答を差し替えられるため使わない。
    // 公開R2 bucket直結の専用prefixへ分離し、manifestのチェーン錨＋全ファイルsha256照合を維持する。
    bundleOrigin: VERIFIED_BUNDLE_ORIGIN,
    manifestPath: "/build-manifest.json",
    // 契約再デプロイバッチ（2026-11-20）後の mainnet アドレス。
    // この HashStorage は buildHash API（registerBuildHash/getBuildHash/latestBuildVersion）を持つ。
    // （出典: Hardhat/bitcoinu/deployment-info-TokenMining-mainnet.json / .env.local）
    contracts: {
      hashStorage: "0xc8845F3De44839765cfD4278110fcc576FC5D9D0",
      tokenMining: "0x65E28cd031a63DFeb4aCD9f921938aFb6faBFC2c",
      evidence: "0x4EaFd0Eb6EA539A58b8CDbd5b8761F731CcD01a8",
      ethLock: "0x44B0A97C560A96793B532c1157f373b27D8e73bf"
    },
    // 公開ルール定数のピン値（復元挙動・表示に使い、check-vendor-sync が正典と照合する）。
    // 採点は vendored コードが権威。
    pins: {
      gameMaxPlayers: 2100,
      minChars: 500,
      minMessages: 20,
      chatCaps: { maxChars: 1e4, maxMessages: 100, maxMsgChars: 1e3 },
      maxReports: 2,
      confirmationBlocks: 64
    }
  };
  var PIN_OMISSIONS = Object.freeze({
    clockSkewAllowMs: Object.freeze({
      status: "canonical-direct",
      reason: "\u5FA9\u5143\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u306F vendored protocol-v2.js \u306E chatWindowMsFromTimeline \u3092\u76F4\u63A5\u4F7F\u3046\u305F\u3081\u3001\u5225\u306E\u6570\u5024 pin \u3092\u6301\u305F\u306A\u3044"
    }),
    quiescenceMs: Object.freeze({
      status: "no-canonical-counterpart",
      reason: "WS \u975E\u63A5\u7D9A\u306E\u5FA9\u5143\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u306B\u306F\u6C88\u9759\u5316\u8868\u793A\u30B2\u30FC\u30C8\u306E\u5B9F\u88C5\u304C\u306A\u304F\u3001\u63D0\u51FA\u30D0\u30F3\u30C9\u30EB\u30FB\u63A1\u70B9\u306B\u3082\u9069\u7528\u3057\u306A\u3044"
    })
  });
  var TOOL_CONFIG_KEY = "chatgameToolsConfig";
  function applyOverrides(cfg2, src) {
    if (!src || typeof src !== "object") return cfg2;
    if (Number.isFinite(src.chainIdExpected)) cfg2.chainIdExpected = Number(src.chainIdExpected);
    if (typeof src.r2Base === "string" && src.r2Base) cfg2.r2Base = src.r2Base.replace(/\/+$/, "");
    if (typeof src.siteOrigin === "string" && src.siteOrigin) cfg2.siteOrigin = src.siteOrigin.replace(/\/+$/, "");
    if (typeof src.bundleOrigin === "string" && src.bundleOrigin) {
      cfg2.bundleOrigin = requireVerifiedBundleOrigin(src.bundleOrigin);
    }
    if (typeof src.manifestPath === "string" && src.manifestPath) cfg2.manifestPath = src.manifestPath;
    if (Array.isArray(src.rpcUrls) && src.rpcUrls.length) cfg2.rpcUrls = src.rpcUrls.slice();
    if (typeof src.operatorRpc === "string") cfg2.operatorRpc = src.operatorRpc || null;
    if (typeof src.lang === "string" && src.lang) cfg2.lang = src.lang;
    if (src.contracts && typeof src.contracts === "object") {
      for (const k of ["hashStorage", "tokenMining", "evidence", "ethLock"]) {
        if (typeof src.contracts[k] === "string" && src.contracts[k]) cfg2.contracts[k] = src.contracts[k];
      }
    }
    return cfg2;
  }
  function loadConfig(overrides = null) {
    const cfg2 = structuredClone(DEFAULTS);
    cfg2.rpcUrls = null;
    cfg2.lang = null;
    try {
      if (typeof localStorage !== "undefined") {
        const saved = localStorage.getItem(TOOL_CONFIG_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          delete parsed.bundleOrigin;
          applyOverrides(cfg2, parsed);
        }
      }
    } catch {
    }
    if (overrides) applyOverrides(cfg2, overrides);
    cfg2.bundleOrigin = requireVerifiedBundleOrigin(cfg2.bundleOrigin);
    return cfg2;
  }
  function saveConfig(partial) {
    if (typeof localStorage === "undefined") return;
    let current = {};
    try {
      current = JSON.parse(localStorage.getItem(TOOL_CONFIG_KEY) || "{}");
    } catch {
    }
    const next = { ...current };
    delete next.bundleOrigin;
    for (const k of ["rpcUrls", "lang", "r2Base", "siteOrigin", "operatorRpc", "contracts"]) {
      if (partial?.[k] !== void 0) next[k] = partial[k];
    }
    localStorage.setItem(TOOL_CONFIG_KEY, JSON.stringify(next));
  }
  function resolveRpcUrls(cfg2) {
    if (Array.isArray(cfg2.rpcUrls) && cfg2.rpcUrls.length) return cfg2.rpcUrls;
    return cfg2.rpcPresets.map((p) => p.url);
  }

  // src/common/i18n.js
  var SUPPORTED_LANGS = ["en", "ja", "zh"];
  var en = {
    "lang.name": "English",
    "app.title": "COINU Chat-Game Tools",
    "app.subtitle": "Independent, operator-external tools anchored to the chain.",
    "entry.loader": "Verify & launch (loader)",
    "entry.recovery": "Recovery client",
    "entry.loader.desc": "Check that the app the operator serves matches the code anchored on-chain, then run only if it matches.",
    "entry.recovery.desc": "Locked out? Play the whole game \u2014 chat, vote, report, submit \u2014 with only your wallet and public relays.",
    "loader.rpc": "Independent RPC",
    "loader.reading": "Reading buildHash from the chain\u2026",
    "loader.fetching": "Fetching the served bundle manifest\u2026",
    "loader.verifying": "Verifying files ({done}/{total})\u2026",
    "loader.ok": "Verified: the served app matches build #{buildVersion} anchored on-chain.",
    "loader.launch": "Launch verified app",
    "loader.warn.reregistered": "Warning: this build version was re-registered {registrationCount} times on-chain (build was replaced \u2014 visible on-chain).",
    "loader.fail.no_hash": "No build hash is registered on-chain yet (aggregation/deploy not done, or the buildHash contract is not deployed yet).",
    "loader.fail.rpc": "Could not read the chain from the selected RPC.",
    "loader.fail.fetch": "Could not fetch the served bundle (the operator may be withholding it from you).",
    "loader.fail.maintenance": "The operator returned a maintenance page (503). This is not verification \u2014 try again later.",
    "loader.fail.manifest_invalid": "The served manifest is malformed.",
    "loader.fail.manifest_mismatch": "The served manifest does NOT match the on-chain buildHash (selective serving / tampering suspected).",
    "loader.fail.file_mismatch": "A served file does NOT match the manifest ({count} file(s)) \u2014 tampering suspected.",
    "loader.togo_recovery": "Go to the recovery client",
    "loader.guarantee": "This proves everyone runs the same code (no selective serving) and that any whole-population attack leaves permanent on-chain evidence. It does NOT prove the code is honest.",
    "recovery.connect": "Connect wallet",
    "recovery.selectWallet": "Select wallet",
    "recovery.noWallet": "No wallet extension found. Install MetaMask, Rabby, or Coinbase Wallet.",
    "recovery.restart": "\u21BB Restart",
    "recovery.discover": "Find my user id",
    "recovery.sign": "Sign to derive keys",
    "recovery.savedRescue": "Send saved submission without R2",
    "recovery.savedRescueMissing": "No saved roster proof and submission bundle match this block and wallet.",
    "recovery.savedRescueChoose": "Choose a saved user ID:",
    "recovery.savedRescueConfirm": "Send the saved submission on-chain for",
    "recovery.block": "Block number",
    "recovery.phase": "Phase",
    "recovery.ceiling": "Your submission, votes and reports are fully recoverable from your wallet alone. Chat, votes and reports only count toward scoring once at least one honest groupmate receives them over a relay (read receipts) \u2014 add an independent relay to maximize this.",
    "recovery.submit": "Reconstruct & submit on-chain",
    "recovery.submit.guarantee.headingPre": "What this submission would guarantee (not submitted yet)",
    "recovery.submit.guarantee.headingSigned": "What your signed submission guarantees (acceptance not yet confirmed)",
    "recovery.submit.guarantee.headingAccepted": "What your submission guarantees",
    "recovery.submit.guarantee.headingPreOnChain": "On-chain submission: values guaranteed if you submit",
    "recovery.submit.guarantee.turns": "Conversation turns: {count} / {min}",
    "recovery.submit.guarantee.turnsUnprotected": "Conversation turns: this submission cannot guarantee them",
    "recovery.submit.guarantee.chars": "Message characters: {count} / {min}",
    "recovery.submit.guarantee.charsUnprotected": "Message characters: this submission cannot guarantee them",
    "recovery.submit.guarantee.charsRare": "In very rare cases, only if you have posted 100 or more messages including those from your other devices and there was a problem sharing information over the network, your message characters may fall below this guarantee of {chars} characters.",
    "recovery.submit.guarantee.charsRareMin": "In very rare cases, only if you have posted 100 or more messages including those from your other devices and there was a problem sharing information over the network, your message characters may fall below this guarantee of {chars} characters. In this case, however, at least {min} characters are guaranteed.",
    "recovery.submit.guarantee.voteDone": "Vote: done (for {name})",
    "recovery.submit.guarantee.voteDoneNoTarget": "Vote: done",
    "recovery.submit.guarantee.voteUnprotected": "Vote: this submission cannot guarantee it (as things stand you may be disqualified for not voting)",
    "recovery.submit.guarantee.voteRejected": "Vote: this submission cannot guarantee it",
    "recovery.submit.guarantee.reports": "Reports: {names}",
    "recovery.submit.guarantee.reportsNone": "Reports: none",
    "recovery.submit.guarantee.reportsTooMany": "Reports: none can be guaranteed",
    "recovery.submit.guarantee.reportsRejected": "Reports: this submission cannot guarantee them",
    "recovery.submit.guarantee.reportsRare": "In very rare cases, only if you have reported 3 or more players including from your other devices and there was a problem sharing information over the network, your valid reports may fall below this guarantee.",
    "recovery.submit.guarantee.nameSeparator": ", ",
    "recovery.submit.guarantee.noteAlways": "Other members' submissions cannot reduce these results. They do not cover disqualification by other members' reports or deposit conditions.",
    "recovery.submit.guarantee.noteRejected": 'This submission would be rejected by scoring. Please press "Reconstruct & submit on-chain" again.',
    "recovery.submit.guarantee.noteRejectedAccepted": "This submission would be rejected by scoring.",
    "recovery.submit.guarantee.noteMultiple": "There are two or more on-chain submissions. Scoring uses the first valid submission.",
    "recovery.submit.guarantee.notePriorOnChain": "If there is an earlier on-chain submission, its values take precedence.",
    "recovery.submit.guarantee.checking": "Checking\u2026",
    "recovery.submit.guarantee.failed": "Could not check (your submission is not affected).",
    "recovery.submit.guarantee.noteLowTurns": "If the conversation count showed 20 or more on the chat game screen and you have since switched to a different device or browser, submitting from that original device or browser may let you submit with the conversation count that was shown during the chat game.",
    "recovery.submit.signedGuarantee": "Conversation turns protected by the priority field of your signed submission: {count} / {min}",
    "recovery.submit.signedNoPriority": "Your signed submission has no priority field (turns protected by the priority field: 0).",
    "recovery.submit.wsAckedOverwrite": "According to the operator's record, your WebSocket submission has already been accepted. (This record is the operator's claim and cannot be checked on this screen.) If you reconstruct and submit on-chain here, the on-chain submission takes precedence and the accepted submission is replaced by the bundle rebuilt on this screen (the rebuilt bundle may protect fewer conversation turns in its priority field). Stopping here means trusting the operator to use the accepted submission in scoring (trusting the operator is not recommended because it creates a dependency on the operator). Continue?",
    "recovery.rpcNode.singleTitle": "Only one node is available for reading",
    "recovery.rpcNode.singleBody": "Only the following node is currently available for reading the chat deadline, roster, and time from the blockchain. Do you trust this node and continue, or connect your wallet? (If this node returns wrong values, you may not be able to play correctly.)",
    "recovery.rpcNode.nodeLine": "Node: {host}",
    "recovery.rpcNode.trustContinue": "Trust this node and continue",
    "recovery.rpcNode.connectWallet": "Connect wallet",
    "recovery.rpcNode.splitTitle": "The nodes disagree",
    "recovery.rpcNode.splitBody": "The nodes used to read the chat deadline, roster, and time from the blockchain disagree as shown below. Choose one node to trust, or connect your wallet. (If the node you choose returns wrong values, you may not be able to play correctly.)",
    "recovery.rpcNode.splitSameWindowNote": "When the disagreement is in a read that does not affect the deadline (such as the roster registration count), every node may show the same start and deadline.",
    "recovery.rpcNode.splitNodeWindow": "{host}: Window start (entry close) {start} \xB7 Chat deadline {close}",
    "recovery.rpcNode.splitNodeUnread": "{host}: could not read the window",
    "recovery.rpcNode.splitNodeValue": "Answer to the disputed read ({method}): {value}",
    "recovery.rpcNode.trustThis": "Trust this node",
    "recovery.rpcNode.waiting": "The chain sources do not agree; reading again in 5 seconds (you can cancel).",
    "recovery.rpcNode.approved": "Continuing with this trusted node: {host}",
    "recovery.rpcNode.waitTitle": "The node you chose has not answered yet",
    "recovery.rpcNode.waitBody": "The node you chose to trust, {host}, has kept failing to answer chain reads for about {seconds} seconds (it may be busy, or a new block may not have reached it yet). For the reads it did not answer, the answers of the other nodes are not used. Do you want to keep waiting, or choose another node?",
    "recovery.rpcNode.waitNoCandidates": "No other node is available to choose right now (no node has answered recently). Keep waiting, or connect your wallet.",
    "recovery.rpcNode.waitKeep": "Keep waiting",
    "recovery.rpcNode.waitPickAnother": "Choose another node",
    "recovery.rpcNode.pickTitle": "Choose another node",
    "recovery.rpcNode.pickBody": "These nodes answered recently (each value is that node's latest answer). Choose one node to trust, or connect your wallet. (Some of them may return wrong values. If the node you choose returns wrong values, you may not be able to play correctly.)",
    "recovery.rpcNode.pickThis": "Choose this node",
    "recovery.rpcNode.pickNodeValue": "Latest answer ({method}): {value}",
    "recovery.rpcNode.chosenWaiting": "Waiting for the node you chose ({host}); reading again in 5 seconds (you can cancel).",
    "recovery.windowCompare.title": "The chat deadline read differs between sources",
    "recovery.windowCompare.introBuild": "The on-chain chat window was read again from your wallet and public nodes, and the sources disagree. The priority field (which protects your conversation count) is built only from items inside the window you choose. If the chosen window is wider than the true one (later deadline), items outside the true window enter the field and the whole submission is invalid (0 points). An earlier deadline does not guarantee a valid submission: if the priority field contains items outside the true window, the whole submission may be rejected. The default mark follows a unique largest group of at least two matching sources; with a tie or only one answer, it follows this device\u2019s window. Submitting without the priority field is never rejected for the window, but your conversation count is no longer protected. Choose the window for the priority field, or submit without it.",
    "recovery.windowCompare.introStored": "The on-chain chat window was read again, and either the sources disagree or the priority field of your saved submission has items outside the window the sources agree on. If that field has even one item outside the true window, the whole submission is invalid (0 points). Each window shows whether the saved priority field fits inside it.",
    "recovery.windowCompare.groupLine": "Window start (entry close) {start} \xB7 Chat deadline {close}",
    "recovery.windowCompare.groupSources": "Sources returning this window: {sources}",
    "recovery.windowCompare.noSources": "(No source returned this window)",
    "recovery.windowCompare.sourceWallet": "Wallet",
    "recovery.windowCompare.thisDevice": "The window this device is using",
    "recovery.windowCompare.majority": "Majority agrees",
    "recovery.windowCompare.tieHint": "The marked window is the one this device determined during the chat, such as by agreement of two or more sources. (On a device whose settings include the operator's node, it may have been determined from the operator's node.)",
    "recovery.windowCompare.storedInside": "The saved priority field fits in this window",
    "recovery.windowCompare.storedOutside": "The saved priority field has items outside this window",
    "recovery.windowCompare.lockNotUsed": "If you choose this window, the priority-field set locked when your screen reached 20 cannot be used; the field will be rebuilt.",
    "recovery.windowCompare.unanswered": "Sources that could not be read: {sources}",
    "recovery.windowCompare.operatorNode": "Operator node (reference only, not selectable): Window start (entry close) {start} \xB7 Chat deadline {close}",
    "recovery.windowCompare.operatorNodeUnread": "Operator node (reference): could not be read",
    "recovery.windowCompare.chooseWindow": "Build the priority field with this window",
    "recovery.windowCompare.chooseWindowStored": "Use this window (send the saved submission if it fits, otherwise rebuild)",
    "recovery.windowCompare.chooseNone": "Submit without the priority field",
    "recovery.windowCompare.chooseNoneStored": "Rebuild and submit without the priority field",
    "recovery.windowCompare.chooseStored": "Send the saved submission as is",
    "recovery.windowCompare.storedOnlyNote": "This screen cannot rebuild the submission. To rebuild it, select the block and your user ID, load your keys, and press Submit. If you cancel, nothing is submitted on-chain from this screen.",
    "recovery.windowCompare.confirm": "Continue with this choice",
    "recovery.windowCompare.cancel": "Cancel (nothing is signed or sent)",
    "recovery.windowCompare.cancelled": "Submission cancelled (nothing was signed or sent).",
    "recovery.windowCompare.reading": "Comparing the chat window across sources\u2026",
    "recovery.windowCompare.deviceMark": "This device's window (marked)",
    "recovery.windowCompare.noMarkHint": "No source majority and no window on this device, so nothing is marked. Compare the start and deadline of each window and choose.",
    "recovery.windowCompare.walletOwnNode": "Your wallet's own node",
    "recovery.windowCompare.remoteHeadNote": " (where WalletConnect / mobile MetaMask reads go)",
    "recovery.windowCompare.cancelledOnChain": "On-chain submission cancelled (nothing was signed or sent). Your WS submission status is unchanged.",
    "recovery.senderSlots": "Evidence submissions for this wallet",
    "recovery.sharedWalletLimit": "User IDs sharing this wallet share its three on-chain submission slots.",
    "recovery.warn.proofMissing": "The complete published roster proof is missing or mismatched. Retry after the roster files are available.",
    "recovery.trimNotice": "The submission exceeds the on-chain size limit, so the read receipts listed below will be removed. Messages, your vote and your reports remain, except that priority messages that lose their receipt coverage are removed when the turn guarantee below falls. Scoring combines every player\u2019s submission, so read receipts in other submissions remain available. A vote receipt counts only when carried by someone other than its issuer.",
    "recovery.trimGuarantee": "Turn guarantee for this submission: {gBefore} \u2192 {gAfter}",
    "recovery.trimEssentialUnionWarning": "After this removal, this device\u2019s submission alone may no longer establish your eligibility (turns, characters and vote) or the evidence for your reports. Scoring combines every player\u2019s submission.",
    "recovery.trimEssentialOverrideWarning": "An on-chain submission overrides the same player\u2019s server submission. If your WebSocket submission was already accepted, trimming may worsen your score.",
    "recovery.trimEssentialCancelRecommended": "This device received the operator's claim that your WebSocket submission was accepted (it cannot be checked on this screen).",
    "recovery.trimLossWarning": "Part of your submission does not fit within the on-chain data size limit, so we cannot guarantee that the following actions of yours will be scored. Overwrite your server submission with the on-chain submission anyway?",
    "recovery.trimLossWarningNoServer": "Part of your submission does not fit within the on-chain data size limit, so we cannot guarantee that the following actions of yours will be scored. Submit on-chain anyway?",
    "recovery.trimLossTurns": "Conversation turns: {before} \u2192 {after}",
    "recovery.trimLossChars": "Message characters: {before} \u2192 {after}",
    "recovery.trimLossCharsUnprotected": "Message characters: {before} \u2192 cannot be guaranteed by this submission",
    "recovery.trimLossVote": "Vote (for {name})",
    "recovery.trimLossVoteNoTarget": "Vote",
    "recovery.trimLossReports": "Reports (on {names})",
    "recovery.trimLossUnchecked": "Could not check what the trimmed submission guarantees (your submission is not affected).",
    "recovery.trimImpossible": "The submission data exceeds the on-chain size limit and cannot be reduced enough.",
    "recovery.trimImpossibleContributors": "Largest mandatory-data contributors (up to 3): {uids}",
    "recovery.persistenceFailure": "Could not save this device\u2019s records. Keep this page open until submission, free browser storage, and try again.",
    "recovery.persistenceVolatile": "This device could not save the rescue copy. Sending continues, but rescue after reloading this page will be unavailable.",
    "recovery.submitted": "Submitted on-chain. It will be reflected after the result window closes (~13 min for confirmations).",
    "recovery.onchainDone": "Result submitted",
    "recovery.title": "Recovery Client",
    "recovery.blockLabel": "Block ",
    "recovery.groupLabel": "Group ",
    "recovery.timeRemaining": "Time remaining",
    "recovery.clock.warning": "A difference of {offset} seconds between this device's clock and the on-chain block time was detected. This device's clock may be wrong. A difference of 2 minutes or more will prevent the game from working. Please enter the difference from the correct time.",
    "recovery.clock.confirmation": "This device's clock currently shows the time below. Is this correct? A difference of 2 minutes or more can disrupt the game, so please correct it.",
    "recovery.clock.current": "Current device clock",
    "recovery.clock.correction": "Correction in seconds (+ if behind, \u2212 if ahead)",
    "recovery.clock.toggleSign": "Toggle the correction sign",
    "recovery.clock.signHelp": "A '+' in the warning means this device's clock is ahead. Enter \u2212 if it is ahead, or + if it is behind.",
    "recovery.clock.corrected": "Corrected clock",
    "recovery.clock.confirm": "Confirm",
    "recovery.clock.correct": "This device's clock is correct",
    "recovery.clock.close": "Close",
    "recovery.clock.invalid": "Enter whole seconds (for example, \u2212180 or +30, within \xB124 hours).",
    "recovery.clock.adopt": "This corrected time differs by {offset} seconds from the latest Ethereum block time obtained from the RPCs below. Do you want to adopt this corrected time?",
    "recovery.clock.repeated": "Repeatedly going back to the same time increases the chance that other players will report you for cheating. Do you want to continue?",
    "recovery.clock.partialReissue": 'If you correct the time of the read receipts for the chats below and reissue them, it will fall under the cheating rule "the cumulative number of read receipts with overlapping targets exceeds 5", which makes it more likely that other players will report you. Do you want to correct the time of the read receipts for the chats below?',
    "recovery.clock.partialReissueApply": "Correct the time",
    "recovery.clock.partialReissueSkip": "Do not correct the time",
    "recovery.clock.adoptButton": "Adopt",
    "recovery.clock.continue": "Continue",
    "recovery.clock.wallet": "Wallet",
    "recovery.clock.manualEntry": "Correct clock",
    "recovery.clock.futureLockWarning": "This device's clock differs greatly from blockchain time. You may be unable to receive other players' messages, votes, reports, or read receipts. Please set the clock to the correct time.",
    "recovery.clock.futureEarlyWarning": "This device's clock is far ahead of blockchain time. You may be unable to acknowledge other players' votes before the deadline or mark their messages as read. Your messages and votes may reach other players late. Please set the clock to the correct time.",
    "recovery.clock.warningContinue": "Continue anyway",
    "recovery.clock.bandLate": "This device is about {seconds} seconds behind blockchain time (this warning disappears below 100 seconds).",
    "recovery.rpcStale.public": "The block read from the chain is about {minutes} minutes older than this device's clock. The public node used for reading may be behind in syncing, or this device's clock may be ahead (if a clock warning appears, correct the clock as it says). The roster confirmation (the chat start) and the deadline checks may be delayed. Connecting a browser-extension wallet on Ethereum mainnet may fix this. This notice disappears about a minute after the blocks read become recent.",
    "recovery.rpcStale.wallet": "The block read from your wallet is about {minutes} minutes older than this device's clock. The node your wallet uses may be behind in syncing, or this device's clock may be ahead (if a clock warning appears, correct the clock as it says). The roster confirmation (the chat start) and the deadline checks may be delayed. Switching the network node (RPC) in your wallet's settings may fix this. This notice disappears about a minute after the blocks read become recent.",
    "recovery.clock.bandEarly": "This device is about {seconds} seconds ahead of blockchain time (this warning disappears below 120 seconds).",
    "recovery.clock.bandDeadline": "Voting deadline on your clock: {time} (vote by this time, not the time in the notice)",
    "recovery.clock.cooldownRejected": "During the ten-minute interval, you can only make a correction that clears this warning against blockchain time (unavailable when blockchain time cannot be read).",
    "recovery.clock.cooldown": "You can correct again in {minutes} min",
    "recovery.clock.manualHeading": "Correct this device's clock. Enter the difference from the correct time.",
    "recovery.clock.offset": "Offset: {offset} s",
    "recovery.clock.neutralSignHelp": "Enter \u2212 if this device is ahead, + if it is behind.",
    "recovery.clock.reloadAfterDeviceFix": "If you fixed the clock in your device settings, please reload this page.",
    "recovery.clock.checking": "Checking\u2026",
    "recovery.clock.back": "Back",
    "recovery.clock.reissueRisk": `Setting the clock back (a \u2212 correction) during the chat reissues the read receipts of the last 10 minutes with the corrected time. When many are reissued (right after a busy conversation, after repeated corrections, or when playing on several devices or on both the official screen and the recovery client), other players' screens may show a warning recommending reporting the player who made the correction (such as "Network attack detected \u2014 report recommended", a warning about five different read receipts for the same message, or "Invalid receipt issuance detected \u2014 report recommended").`,
    "recovery.operatorRpc.configured": "This device's settings include the operator's node ({host}). When neither the wallet nor any public node answers a read, the operator's node value is used without a notice each time. Trusting the operator is not recommended because it creates a dependency on the operator. Remove it from this device's settings (chatgameToolsConfig.operatorRpc) to stop using it.",
    "recovery.refresh": "Refresh",
    "recovery.refreshing": "Refreshing timeline from chain\u2026",
    "recovery.refreshed": "Timeline refreshed (phase: {phase}, grace: {grace}s)",
    "recovery.days": "d",
    "recovery.phaseName.waiting": "Waiting",
    "recovery.phaseName.chatting": "Chat",
    "recovery.phaseName.submitting": "Submission",
    "recovery.phaseName.completed": "Completed",
    "recovery.phaseName.aggregating": "Result Aggregation",
    "recovery.phaseName.verification": "Verification",
    "recovery.phaseName.claimable": "Claim",
    "recovery.phaseName.aggregatingWait": "Aggregating results \u2014 please wait for the on-chain submission to complete.",
    "recovery.waiting.description": "Your group has been formed. Please wait for the chat to start (countdown above). Votes and reports can only be cast during the chat period.",
    "recovery.connection.connected": "Connected (relay)",
    "recovery.connection.title": "Connection",
    "recovery.connection.p2p": "P2P relays (Nostr)",
    "recovery.connection.relayConnected": "{connected}/{total} connected",
    "recovery.connection.p2pDescription": "Relays are your redundant path around a censoring server. As long as one is connected, your chat/vote/report reach the whole group.",
    "recovery.connection.settingsTitle": "Relay list",
    "recovery.connection.settingsDesc": "Add an independent relay (one URL per line) \u2014 the only escape route if all defaults are censored.",
    "recovery.status.connected": "Connected",
    "recovery.status.connecting": "Connecting",
    "recovery.status.disconnected": "Disconnected",
    "recovery.connection.connecting": "Connecting (relay)",
    "recovery.connection.disconnected": "Disconnected (relay)",
    "recovery.members.depositPoints": "Lock Pt",
    "recovery.members.depositPointsCorrected": "corrected to the on-chain value",
    "recovery.members.depositPointsUnverified": "unverified",
    "recovery.members.chars": "chars",
    "recovery.members.times": "times",
    "recovery.members.voted": "Voted",
    "recovery.members.reported": "Reported",
    "recovery.members.invalidReadReceipt": "Invalid receipt issuance detected \u2014 report recommended",
    "recovery.members.fraudulentReceipts": "{name} may be disrupting the game by issuing fraudulent receipts. We recommend reporting {name}.",
    "recovery.members.suspiciousReporting": "{name} is making fraudulent reports. We recommend reporting {name}.",
    "recovery.members.suspiciousReportingShort": "{name} is making fraudulent reports.",
    "recovery.action.reportRevealWarning": "Only {A} meets the reporting requirement (a confirmed vote), so other players may be able to tell that you reported {A}. In particular, {A} is more likely to report you back. Do you still want to report? We recommend waiting until other players' votes are confirmed before reporting.",
    "recovery.action.reportRevealWarningLate": "Only {A} meets the reporting requirement (a confirmed vote), so other players may be able to tell that you reported {A}. In particular, {A} is more likely to report you back. Do you still want to report?",
    "recovery.action.reportRevealProceed": "Report",
    "recovery.action.reportRevealCancel": "Cancel",
    "recovery.members.invalidReadReceiptTip": "This is only a recommendation. An actual report still requires your signed action and the usual conditions (at least two reporters and their combined points exceeding the target\u2019s).",
    "recovery.members.multipleSessionsWarning": "Simultaneous participation from multiple screens was detected. If you keep participating from multiple devices or tabs, you may be regarded as a bot and other players will be shown a warning recommending that they report you, so please participate from a single screen. Until you choose one of the options, this screen is treated as away and does not issue read receipts.",
    "recovery.session.resume": "I have closed the other devices/tabs \u2014 resume in this tab",
    "recovery.session.close": "Close this tab",
    "recovery.session.ended": "This tab has been closed. To continue, use the screen on the device you are using. Reload this tab to resume participating here.",
    "recovery.import.title": "Import official client localStorage",
    "recovery.import.description": "On the official game page, open Developer Tools \u2192 Console and run the code below. Copy the JSON, then close that page. After closing it, press {signLabel} here and paste the JSON. Only records for this block, group and user are used; signatures are checked. Imported actions do not return to the rebuilt submission after reload. Chat messages are read from public live data and relays. Import again, or send the imported official submission bytes with the Evidence rescue button.",
    "recovery.import.button": "Import saved game data",
    "recovery.import.wait": "Sign & load the confirmed roster before importing.",
    "recovery.import.done": "Imported verified saved data (receipts: {receipts}).",
    "recovery.import.failed": "Import failed",
    "recovery.members.viewOnX": "View on X",
    "recovery.members.playerNumber": "Player {n}",
    "recovery.members.online": "Active",
    "recovery.members.offline": "No recent activity",
    "recovery.members.activityTip": "Based on the newest signed chat/receipt seen over the relay. There is no presence protocol, so silence is indistinguishable from being offline.",
    "recovery.action.voteTitle": "Vote for Member (Required)",
    "recovery.action.voteProgressTurns": "After you vote, other members may be less likely to mark your messages as read, making it harder to reach {minMessages} conversation turns. We recommend reaching {minMessages} turns before voting.",
    "recovery.action.voteProgressChars": "After you vote, other members may be less likely to mark your messages as read, making it harder to reach the minimum of {minChars} half-width characters. We recommend reaching the minimum before voting.",
    "recovery.action.voteProgressProceed": "Vote",
    "recovery.action.voteProgressBack": "Back",
    "recovery.action.deadlineVoteNotice": "Votes, like chat messages, are valid only after another member marks them as read. Without a valid vote, you will be disqualified. Vote with enough time for another member to mark it as read.",
    "recovery.action.deadlineVoteReceiptNotice": "Votes do not receive read receipts in the last 10 minutes. Please vote with time to spare so that your vote is read by {time}.",
    "recovery.action.votingClosed": "Voting is closed.",
    "recovery.action.noticeClose": "Close",
    "recovery.action.receiptNotice": "Votes and reports are not valid until another member marks them as read (received). Keep this screen open until you confirm receipt.",
    "recovery.action.voteDescription": "You must vote for one member. The person you vote for receives Vote Pt equal to your Lock Pt.",
    "recovery.action.reportTitle": "Report Member",
    "recovery.action.reportDescription": "Report members you believe are AI/bots (up to 2). You can report someone after their vote is confirmed by a read receipt from a member other than you or that person. In the last 10 minutes, you can report anyone, but a report against someone without a confirmed vote is invalid.",
    "recovery.action.voteConfirm": "You are voting for {name}. Once you vote, it cannot be changed. Even if your vote goes unread and becomes void, you cannot change who you vote for. Are you sure?",
    "recovery.action.voteSuccess": "Your vote has been submitted in an encrypted state.",
    "recovery.action.reportConfirm": "You are reporting {name}. Once you report, it cannot be changed. Are you sure?",
    "recovery.action.reportSuccess": "Your report has been submitted in an encrypted state.",
    "recovery.sameDeviceBand.reportGround": "We recommend completing your submission on this device. If you switch devices or browsers, your reports are no longer guaranteed to be accepted as valid.",
    "recovery.sameDeviceBand.conversationMemory": "Keep this page open and submit from this device. On another device or a reopened page, part of your conversation record is lost and your conversation count will not reach 20.",
    "recovery.sameDeviceBand.switchClient": "Moving between the official screen and the recovery client can also lose part of what this device remembers, such as the grounds for your reports.",
    "recovery.sameDeviceBand.reportGroundSaveFailed": "The grounds for your report could not be saved on this device. Do not close or reload this page; submit from this screen.",
    "recovery.action.deadlineWarning": "\u26A0 Votes can be cast until 10 minutes before chat ends; reports can be cast during the chat period only. Without a vote you will be disqualified. Once broadcast, actions cannot be changed or withdrawn.",
    "recovery.chat.charCount": "Character count",
    "recovery.chat.minCharProgress": "Required chars",
    "recovery.chat.maxCharProgress": "Char send limit",
    "recovery.chat.minTurnProgress": "Required turns",
    "recovery.chat.futureMessages": "Messages with future timestamps: {count}",
    "recovery.chat.futureActions": "Votes/reports with future timestamps: {count}",
    "recovery.chat.priorityNotReady": "Until the roster and chat window are confirmed on-chain, the conversation turns protected by your priority field are shown as 0 (this changes once they are confirmed).",
    "recovery.chat.priorityPlanFailed": "The priority field could not be planned; the turns it protects are shown as 0.",
    "recovery.chat.maxPostProgress": "Post send limit",
    "recovery.chat.capRemaining": "Remaining",
    "recovery.chat.msgCount": "Post count",
    "recovery.chat.send": "Send",
    "recovery.chat.historyLoading": "Loading history\u2026",
    "recovery.chat.ownHistoryPrompt": "Data loading has not finished yet, so your conversation history, character count, and message count may be incomplete. Do you want to wait for loading to finish, or start chatting while being careful about the character and message limits?",
    "recovery.chat.ownHistoryWaitingRelays": "Relays still loading: {relays}",
    "recovery.chat.ownHistoryWait": "Wait",
    "recovery.chat.ownHistoryStart": "Start chatting, minding the character and message limits",
    "recovery.chat.inputPlaceholder": "Type a message...",
    "recovery.chat.minCharsRemaining": "Chars still required:",
    "recovery.chat.minCharsReached": "Required chars reached",
    "recovery.chat.maxCharsReached": "Cannot send: this post would exceed the total character limit",
    "recovery.chat.turnCount": "Conversation turns",
    "recovery.chat.minMsgsRemaining": "Turns still required:",
    "recovery.chat.minMsgsReached": "Required turns reached",
    "recovery.chat.maxMsgsReached": "Message limit reached",
    // P-2026-0844: 送信ゲート（本体 ChatPhase の game.chat.msgTooLong に相当）
    "recovery.chat.msgTooLong": "Message exceeds the per-message limit ({max} half-width chars). It would be dropped by scoring \u2014 split it up.",
    "recovery.chat.invisibleOnly": "This message has no visible content, so it cannot be sent (scoring would not count it).",
    "recovery.chat.voteStatus": "Vote",
    "recovery.chat.voteDone": "Done",
    "recovery.chat.voteNotYet": "Not yet",
    "recovery.chat.votePending": "Please vote",
    "recovery.chat.voteCleared": "Vote complete",
    "recovery.chat.voteAwaitingReceipt": "Awaiting receipt (confirmed once received by another member)",
    "recovery.chat.readBadge": "Read {count}",
    "recovery.chat.idleOverlay": "You have been idle for 10 minutes, so you are now offline. While offline, incoming messages will not be marked as read.",
    "recovery.chat.unreadBadge": "Unread",
    "recovery.chat.voidBadge": "Void",
    "recovery.chat.bubbleVote": "Vote",
    "recovery.chat.bubbleReport": "Report (#{nth})",
    "recovery.action.voteResendConfirm": "Your previous vote was not received by anyone within 10 minutes and became void. Resend to the same member, {name}?",
    "recovery.action.reportResendConfirm": "Your previous report was not received by anyone within 10 minutes and became void. Resend to the same member, {name}?",
    "recovery.action.resendLabel": "Resend",
    // J-35（§6.9 追補・規則版数2）: 密告の資格要件が未達（残り件数）
    "recovery.action.reportNeedsReads": "needs {count} more message(s)",
    "recovery.action.voteVoidResend": "Your vote became void (unreceived for 10 min). Resend to the same member",
    "recovery.action.voteVoidNoResend": "No read receipt arrived before the cutoff, so you cannot resend this vote",
    "recovery.action.reportWaitingVote": "Waiting for a confirmed vote",
    "recovery.action.reportVoteNotVisible": "No confirmed vote is visible (if this player has not voted, this report will be invalid)",
    "recovery.completedMsg": "The game for this block has ended.",
    "recovery.entryWait": "The game has not started yet (entry period). Please wait for the game start.",
    "recovery.relaySettings": "Relay settings (independent relay = your only escape route)",
    "recovery.warn.applicantHashRegistrationCount": "Warning: applicantHash registration count is {registrationCount}, expected 1. Recovery will continue; the replacement remains visible on-chain.",
    "recovery.warn.anchoredRosterFallback.previousSummaryMismatch": "The anchored previous-block result does not match the published result artifacts. This client is using the chain-anchored roster used by the game.",
    "recovery.warn.anchoredRosterFallback.previousSummaryUnavailable": "The previous-block result artifacts or chain anchor could not be read. This client is using the independently verified chain-anchored roster.",
    "recovery.warn.anchoredRosterFallback.previousSummaryInvalid": "The previous-block result artifacts are invalid, so the grouping could not be reconstructed. This client is using the independently verified chain-anchored roster.",
    "recovery.warn.anchoredRosterFallback.publishedGroupsUnavailable": "The published game-group list could not be read. This client is using the independently verified chain-anchored roster.",
    "recovery.warn.anchoredRosterFallback.publishedGroupsMismatch": "The published game-group list does not match the grouping reconstructed from committed inputs. This client is using the independently verified chain-anchored roster.",
    "recovery.warn.anchoredRosterFallback.unknown": "Grouping reconstruction could not be verified ({reason}). This client is using the independently verified chain-anchored roster.",
    "recovery.warn.rosterReconstructionStop.previousSummaryUnavailable": "The previous-block result artifacts or chain anchor could not be read. Recovery stopped because the chain-anchored roster could not be verified either.",
    "recovery.warn.rosterReconstructionStop.previousSummaryMismatch": "The previous-block result artifacts do not match the chain anchor. Recovery stopped because the chain-anchored roster could not be verified either.",
    "recovery.warn.rosterReconstructionStop.previousSummaryInvalid": "The previous-block result artifacts are invalid. Recovery stopped because the chain-anchored roster could not be verified either.",
    "recovery.warn.rosterReconstructionStop.unknown": "Grouping reconstruction could not be verified ({reason}). Recovery stopped because the chain-anchored roster could not be verified either.",
    "recovery.warn.rosterAnchorEvidence": "Canonical roster registration: hash {rosterAnchorHash}, index {rosterAnchorIndex}.",
    "recovery.warn.rosterRecomputedHash": "Recomputed roster manifest hash: {recomputedHash}.",
    "recovery.warn.rosterConflict": "The chain-anchored roster differs from the current committed-selection reconstruction. This discrepancy alone does not identify which side is wrong.",
    "recovery.warn.recomputedRosterFallback.canonicalMatch": "The published roster files could not be verified ({anchorError}). The reconstructed roster manifest matches the canonical on-chain hash, so this client is using the verified reconstructed group.",
    "recovery.warn.recomputedRosterFallback.legacyMatch": "The published roster files could not be verified ({anchorError}). The reconstructed roster manifest matches the current on-chain hash, so this client is using the verified reconstructed group.",
    "recovery.warn.anchorError.unavailable": "some files or the chain registration could not be read",
    "recovery.warn.anchorError.invalid": "some files are malformed",
    "recovery.warn.anchorError.mismatch": "the files do not match the chain registration or the selection",
    "recovery.warn.anchorError.unknown": "reason not shown",
    "recovery.warn.rosterVerificationFailed": "The roster could not be verified. Recovery stopped before joining a group.",
    "recovery.warn.rosterMismatchStop": "The reconstructed roster manifest differs from the canonical on-chain hash. Recovery stopped before joining a group.",
    "recovery.warn.rosterAbsentStop": "No canonical roster registration is available for this block. Recovery stopped before joining a group.",
    "recovery.warn.rosterPending": "Waiting for the canonical roster registration. Recovery will continue checking until the chat window closes.",
    "recovery.cancelRosterWait": "Cancel roster wait",
    "recovery.warn.rosterLateRegistrations": "{count} roster registration(s) arrived after chat start and were ignored.",
    "recovery.warn.rosterLegacy": "This deployment uses an older HashStorage without roster history. The current on-chain roster hash was used for verification.",
    "recovery.warn.rosterProvisional": "The roster is still provisional before chat starts. Waiting for the chain to reach chat start and confirm the final roster before signing or submitting.",
    "recovery.warn.rosterRechecking": "Rechecking the final on-chain roster. Signing, receipts, and submission are paused until it is confirmed.",
    "recovery.warn.rosterChanged": "The final on-chain roster changed. Signing, receipts, and submission have stopped. Reload this page to join the correct group.",
    "recovery.relay.save": "Save relays",
    "recovery.relay.saved": "Relays saved (effective next start).",
    "recovery.relay.saveFailed": "Failed to save relays. Check this browser's storage permissions."
  };
  var ja = {
    "lang.name": "\u65E5\u672C\u8A9E",
    "app.title": "COINU \u30C1\u30E3\u30C3\u30C8\u30B2\u30FC\u30E0\u88DC\u52A9\u30C4\u30FC\u30EB",
    "app.subtitle": "\u904B\u55B6\u306E\u5916\u306B\u7F6E\u304F\u30FB\u30C1\u30A7\u30FC\u30F3\u306B\u9328\u3092\u4E0B\u308D\u3057\u305F\u72EC\u7ACB\u30C4\u30FC\u30EB\u3002",
    "entry.loader": "\u691C\u8A3C\u3057\u3066\u8D77\u52D5\uFF08\u30ED\u30FC\u30C0\u30FC\uFF09",
    "entry.recovery": "\u5FA9\u5143\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8",
    "entry.loader.desc": "\u904B\u55B6\u304C\u914D\u4FE1\u3059\u308B\u30A2\u30D7\u30EA\u304C\u30C1\u30A7\u30FC\u30F3\u306B\u9328\u3092\u4E0B\u308D\u3057\u305F\u30B3\u30FC\u30C9\u3068\u4E00\u81F4\u3059\u308B\u304B\u78BA\u8A8D\u3057\u3001\u4E00\u81F4\u6642\u306E\u307F\u5B9F\u884C\u3057\u307E\u3059\u3002",
    "entry.recovery.desc": "\u7DE0\u3081\u51FA\u3055\u308C\u3066\u3082\u3001\u30A6\u30A9\u30EC\u30C3\u30C8\u3068\u516C\u958B\u30EA\u30EC\u30FC\u3060\u3051\u3067\u30C1\u30E3\u30C3\u30C8\u30FB\u6295\u7968\u30FB\u5BC6\u544A\u30FB\u63D0\u51FA\u306E\u5168\u3066\u3092\u5B8C\u9042\u3057\u307E\u3059\u3002",
    "loader.rpc": "\u72EC\u7ACBRPC",
    "loader.reading": "\u30C1\u30A7\u30FC\u30F3\u304B\u3089 buildHash \u3092\u8AAD\u307F\u53D6\u308A\u4E2D\u2026",
    "loader.fetching": "\u914D\u4FE1\u30D0\u30F3\u30C9\u30EB\u306E\u30DE\u30CB\u30D5\u30A7\u30B9\u30C8\u3092\u53D6\u5F97\u4E2D\u2026",
    "loader.verifying": "\u30D5\u30A1\u30A4\u30EB\u691C\u8A3C\u4E2D\uFF08{done}/{total}\uFF09\u2026",
    "loader.ok": "\u691C\u8A3C\u6210\u529F: \u914D\u4FE1\u30A2\u30D7\u30EA\u306F\u30C1\u30A7\u30FC\u30F3\u306B\u9328\u3092\u4E0B\u308D\u3057\u305F build #{buildVersion} \u3068\u4E00\u81F4\u3057\u307E\u3059\u3002",
    "loader.launch": "\u691C\u8A3C\u6E08\u307F\u30A2\u30D7\u30EA\u3092\u8D77\u52D5",
    "loader.warn.reregistered": "\u8B66\u544A: \u3053\u306E build \u306F {registrationCount} \u56DE\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u3067\u518D\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\uFF08\u30D3\u30EB\u30C9\u5DEE\u3057\u66FF\u3048\uFF1D\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u3067\u53EF\u8996\uFF09\u3002",
    "loader.fail.no_hash": "\u30C1\u30A7\u30FC\u30F3\u306B build hash \u304C\u307E\u3060\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\uFF08\u96C6\u8A08/\u30C7\u30D7\u30ED\u30A4\u672A\u4E86\u3001\u307E\u305F\u306F buildHash \u5951\u7D04\u304C\u672A\u30C7\u30D7\u30ED\u30A4\uFF09\u3002",
    "loader.fail.rpc": "\u9078\u629E\u3057\u305FRPC\u304B\u3089\u30C1\u30A7\u30FC\u30F3\u3092\u8AAD\u307F\u53D6\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
    "loader.fail.fetch": "\u914D\u4FE1\u30D0\u30F3\u30C9\u30EB\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08\u904B\u55B6\u304C\u3042\u306A\u305F\u306B\u3060\u3051\u914D\u4FE1\u3057\u3066\u3044\u306A\u3044\u53EF\u80FD\u6027\uFF09\u3002",
    "loader.fail.maintenance": "\u904B\u55B6\u304C\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u5FDC\u7B54\uFF08503\uFF09\u3092\u8FD4\u3057\u307E\u3057\u305F\u3002\u691C\u8A3C\u3067\u306F\u3042\u308A\u307E\u305B\u3093 \u2014 \u6642\u9593\u3092\u304A\u3044\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "loader.fail.manifest_invalid": "\u914D\u4FE1\u30DE\u30CB\u30D5\u30A7\u30B9\u30C8\u304C\u4E0D\u6B63\u3067\u3059\u3002",
    "loader.fail.manifest_mismatch": "\u914D\u4FE1\u30DE\u30CB\u30D5\u30A7\u30B9\u30C8\u304C\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u306E buildHash \u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\uFF08\u914D\u308A\u5206\u3051/\u6539\u7AC4\u306E\u7591\u3044\uFF09\u3002",
    "loader.fail.file_mismatch": "\u914D\u4FE1\u30D5\u30A1\u30A4\u30EB\u304C\u30DE\u30CB\u30D5\u30A7\u30B9\u30C8\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\uFF08{count} \u4EF6\uFF09\u2014 \u6539\u7AC4\u306E\u7591\u3044\u3002",
    "loader.togo_recovery": "\u5FA9\u5143\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u3078",
    "loader.guarantee": "\u3053\u308C\u306F\u300C\u5168\u54E1\u304C\u540C\u4E00\u30B3\u30FC\u30C9\u3092\u5B9F\u884C\uFF08\u914D\u308A\u5206\u3051\u6392\u9664\uFF09\uFF0B\u5168\u4F53\u653B\u6483\u304C\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u306B\u6052\u4E45\u7684\u306A\u8A3C\u62E0\u3092\u6B8B\u3059\u300D\u3053\u3068\u3092\u4FDD\u8A3C\u3057\u307E\u3059\u3002\u300C\u30B3\u30FC\u30C9\u304C\u6B63\u76F4\u3067\u3042\u308B\u3053\u3068\u300D\u306E\u8A3C\u660E\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
    "recovery.connect": "\u30A6\u30A9\u30EC\u30C3\u30C8\u63A5\u7D9A",
    "recovery.selectWallet": "\u30A6\u30A9\u30EC\u30C3\u30C8\u3092\u9078\u629E",
    "recovery.noWallet": "\u30A6\u30A9\u30EC\u30C3\u30C8\u62E1\u5F35\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002MetaMask / Rabby / Coinbase Wallet \u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.restart": "\u21BB \u518D\u30B9\u30BF\u30FC\u30C8",
    "recovery.discover": "\u30E6\u30FC\u30B6\u30FCID\u3092\u7279\u5B9A",
    "recovery.sign": "\u7F72\u540D\u3057\u3066\u9375\u3092\u5C0E\u51FA",
    "recovery.savedRescue": "\u4FDD\u5B58\u6E08\u307F\u306E\u63A7\u3048\u304B\u3089\u9001\u4FE1\uFF08R2\u4E0D\u8981\uFF09",
    "recovery.savedRescueMissing": "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u3068\u30A6\u30A9\u30EC\u30C3\u30C8\u306B\u4E00\u81F4\u3059\u308B\u540D\u7C3F\u8A3C\u660E\u3068\u63D0\u51FA\u63A7\u3048\u304C\u3042\u308A\u307E\u305B\u3093\u3002",
    "recovery.savedRescueChoose": "\u4FDD\u5B58\u6E08\u307F\u30E6\u30FC\u30B6\u30FCID\u3092\u9078\u629E:",
    "recovery.savedRescueConfirm": "\u4FDD\u5B58\u6E08\u307F\u63D0\u51FA\u7269\u3092\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u3078\u9001\u4FE1\u3057\u307E\u3059:",
    "recovery.block": "\u30D6\u30ED\u30C3\u30AF\u756A\u53F7",
    "recovery.phase": "\u30D5\u30A7\u30FC\u30BA",
    "recovery.ceiling": "\u63D0\u51FA\u30FB\u6295\u7968\u30FB\u5BC6\u544A\u306F\u30A6\u30A9\u30EC\u30C3\u30C8\u3060\u3051\u3067\u5B8C\u5168\u5FA9\u5143\u3067\u304D\u307E\u3059\u3002\u30C1\u30E3\u30C3\u30C8\u30FB\u6295\u7968\u30FB\u5BC6\u544A\u306F\u3001\u5C11\u306A\u304F\u3068\u30821\u4EBA\u306E\u6B63\u76F4\u306A\u30B0\u30EB\u30FC\u30D7\u76F8\u624B\u304C\u30EA\u30EC\u30FC\u7D4C\u7531\u3067\u53D7\u4FE1\uFF08\u53D7\u9818\u8A3C\u660E\uFF1D\u65E2\u8AAD\uFF09\u3057\u305F\u3068\u304D\u306E\u307F\u63A1\u70B9\u306B\u7B97\u5165\u3055\u308C\u307E\u3059 \u2014 \u72EC\u7ACB\u30EA\u30EC\u30FC\u3092\u8FFD\u52A0\u3057\u3066\u78BA\u5EA6\u3092\u4E0A\u3052\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.submit": "\u518D\u69CB\u6210\u3057\u3066\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA",
    "recovery.submit.guarantee.headingPre": "\u3053\u306E\u307E\u307E\u63D0\u51FA\u3059\u308C\u3070\u4FDD\u8A3C\u3067\u304D\u308B\u3053\u3068\uFF08\u307E\u3060\u63D0\u51FA\u3057\u3066\u3044\u307E\u305B\u3093\uFF09",
    "recovery.submit.guarantee.headingSigned": "\u7F72\u540D\u3057\u305F\u63D0\u51FA\u7269\u3067\u4FDD\u8A3C\u3067\u304D\u308B\u3053\u3068\uFF08\u53D7\u3051\u4ED8\u3051\u306F\u307E\u3060\u78BA\u304B\u3081\u3066\u3044\u307E\u305B\u3093\uFF09",
    "recovery.submit.guarantee.headingAccepted": "\u3042\u306A\u305F\u306E\u63D0\u51FA\u3067\u4FDD\u8A3C\u3067\u304D\u308B\u3053\u3068",
    "recovery.submit.guarantee.headingPreOnChain": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA: \u63D0\u51FA\u3057\u305F\u5834\u5408\u306B\u4FDD\u8A3C\u3055\u308C\u308B\u6570\u5024",
    "recovery.submit.guarantee.turns": "\u4F1A\u8A71\u6570: {count} / {min}",
    "recovery.submit.guarantee.turnsUnprotected": "\u4F1A\u8A71\u6570: \u3053\u306E\u63D0\u51FA\u3067\u306F\u4FDD\u8A3C\u3067\u304D\u307E\u305B\u3093",
    "recovery.submit.guarantee.chars": "\u767A\u8A00\u6587\u5B57\u6570: {count} / {min}",
    "recovery.submit.guarantee.charsUnprotected": "\u767A\u8A00\u6587\u5B57\u6570: \u3053\u306E\u63D0\u51FA\u3067\u306F\u4FDD\u8A3C\u3067\u304D\u307E\u305B\u3093",
    "recovery.submit.guarantee.charsRare": "\u975E\u5E38\u306B\u7A00\u306A\u30B1\u30FC\u30B9\u3067\u3059\u304C\u3001\u4ED6\u306E\u7AEF\u672B\u3082\u542B\u3093\u3067100\u4EF6\u4EE5\u4E0A\u306E\u767A\u8A00\u3092\u3057\u3066\u3044\u308B\u5834\u5408\u3067\u3001\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u306E\u60C5\u5831\u5171\u6709\u306B\u554F\u984C\u304C\u3042\u3063\u305F\u5834\u5408\u306E\u307F\u3001\u3053\u306E\u6587\u5B57\u6570\u306E\u4FDD\u8A3C{chars}\u6587\u5B57\u3092\u4E0B\u56DE\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002",
    "recovery.submit.guarantee.charsRareMin": "\u975E\u5E38\u306B\u7A00\u306A\u30B1\u30FC\u30B9\u3067\u3059\u304C\u3001\u4ED6\u306E\u7AEF\u672B\u3082\u542B\u3093\u3067100\u4EF6\u4EE5\u4E0A\u306E\u767A\u8A00\u3092\u3057\u3066\u3044\u308B\u5834\u5408\u3067\u3001\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u306E\u60C5\u5831\u5171\u6709\u306B\u554F\u984C\u304C\u3042\u3063\u305F\u5834\u5408\u306E\u307F\u3001\u3053\u306E\u6587\u5B57\u6570\u306E\u4FDD\u8A3C{chars}\u6587\u5B57\u3092\u4E0B\u56DE\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u305F\u3060\u3057\u3001\u4ECA\u306E\u30B1\u30FC\u30B9\u3067\u306F{min}\u6587\u5B57\u3092\u8D8A\u3048\u3066\u3044\u308B\u3053\u3068\u306F\u4FDD\u8A3C\u3055\u308C\u307E\u3059\u3002",
    "recovery.submit.guarantee.voteDone": "\u6295\u7968: \u5B8C\u4E86\uFF08\u5BFE\u8C61: {name}\uFF09",
    "recovery.submit.guarantee.voteDoneNoTarget": "\u6295\u7968: \u5B8C\u4E86",
    "recovery.submit.guarantee.voteUnprotected": "\u6295\u7968: \u3053\u306E\u63D0\u51FA\u3067\u306F\u4FDD\u8A3C\u3067\u304D\u307E\u305B\u3093\uFF08\u3053\u306E\u307E\u307E\u3067\u306F\u672A\u6295\u7968\u3067\u5931\u683C\u306B\u306A\u308B\u304A\u305D\u308C\u304C\u3042\u308A\u307E\u3059\uFF09",
    "recovery.submit.guarantee.voteRejected": "\u6295\u7968: \u3053\u306E\u63D0\u51FA\u3067\u306F\u4FDD\u8A3C\u3067\u304D\u307E\u305B\u3093",
    "recovery.submit.guarantee.reports": "\u5BC6\u544A: {names}",
    "recovery.submit.guarantee.reportsNone": "\u5BC6\u544A: \u306A\u3057",
    "recovery.submit.guarantee.reportsTooMany": "\u5BC6\u544A: \u4FDD\u8A3C\u3067\u304D\u308B\u3082\u306E\u306F\u3042\u308A\u307E\u305B\u3093",
    "recovery.submit.guarantee.reportsRejected": "\u5BC6\u544A: \u3053\u306E\u63D0\u51FA\u3067\u306F\u4FDD\u8A3C\u3067\u304D\u307E\u305B\u3093",
    "recovery.submit.guarantee.reportsRare": "\u975E\u5E38\u306B\u7A00\u306A\u30B1\u30FC\u30B9\u3067\u3059\u304C\u3001\u4ED6\u306E\u7AEF\u672B\u3082\u542B\u3093\u30673\u4EBA\u4EE5\u4E0A\u306B\u5BC6\u544A\u3057\u3066\u3044\u308B\u5834\u5408\u3067\u3001\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u306E\u60C5\u5831\u5171\u6709\u306B\u554F\u984C\u304C\u3042\u3063\u305F\u5834\u5408\u306E\u307F\u3001\u6709\u52B9\u306A\u5BC6\u544A\u304C\u3053\u306E\u4FDD\u8A3C\u3092\u4E0B\u56DE\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002",
    "recovery.submit.guarantee.nameSeparator": "\u3001",
    "recovery.submit.guarantee.noteAlways": "\u3053\u306E\u7D50\u679C\u306F\u3001\u4ED6\u306E\u30E1\u30F3\u30D0\u30FC\u304C\u4F55\u3092\u63D0\u51FA\u3057\u3066\u3082\u6E1B\u308A\u307E\u305B\u3093\u3002\u305F\u3060\u3057\u3001\u4ED6\u306E\u30E1\u30F3\u30D0\u30FC\u304B\u3089\u306E\u5BC6\u544A\u306B\u3088\u308B\u5931\u683C\u3068\u30C7\u30DD\u30B8\u30C3\u30C8\u306E\u6761\u4EF6\u306F\u542B\u307F\u307E\u305B\u3093\u3002",
    "recovery.submit.guarantee.noteRejected": "\u3053\u306E\u63D0\u51FA\u7269\u306F\u63A1\u70B9\u3067\u53D7\u3051\u4ED8\u3051\u3089\u308C\u306A\u3044\u5F62\u3067\u3059\u3002\u3082\u3046\u4E00\u5EA6\u300C\u518D\u69CB\u6210\u3057\u3066\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.submit.guarantee.noteRejectedAccepted": "\u3053\u306E\u63D0\u51FA\u7269\u306F\u63A1\u70B9\u3067\u53D7\u3051\u4ED8\u3051\u3089\u308C\u306A\u3044\u5F62\u3067\u3059\u3002",
    "recovery.submit.guarantee.noteMultiple": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u306E\u63D0\u51FA\u304C2\u4EF6\u4EE5\u4E0A\u3042\u308A\u307E\u3059\u3002\u63A1\u70B9\u306B\u4F7F\u308F\u308C\u308B\u306E\u306F\u6700\u521D\u306E\u6709\u52B9\u306A\u63D0\u51FA\u3067\u3059",
    "recovery.submit.guarantee.notePriorOnChain": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u3078\u306E\u5148\u306E\u63D0\u51FA\u304C\u3042\u308B\u5834\u5408\u306F\u3001\u305D\u3061\u3089\u306E\u6570\u5024\u304C\u512A\u5148\u3055\u308C\u307E\u3059\u3002",
    "recovery.submit.guarantee.checking": "\u78BA\u304B\u3081\u3066\u3044\u307E\u3059\u2026",
    "recovery.submit.guarantee.failed": "\u78BA\u304B\u3081\u3089\u308C\u307E\u305B\u3093\u3067\u3057\u305F\uFF08\u63D0\u51FA\u306B\u306F\u5F71\u97FF\u3057\u307E\u305B\u3093\uFF09\u3002",
    "recovery.submit.guarantee.noteLowTurns": "\u30C1\u30E3\u30C3\u30C8\u30B2\u30FC\u30E0\u753B\u9762\u3067\u4F1A\u8A71\u6570\u304C20\u4EE5\u4E0A\u306B\u306A\u3063\u3066\u3044\u305F\u5834\u5408\u3067\u3001\u305D\u306E\u6642\u306E\u7AEF\u672B\u3084\u30D6\u30E9\u30A6\u30B6\u304B\u3089\u5909\u66F4\u3057\u3066\u3044\u308B\u5834\u5408\u306F\u3001\u305D\u306E\u7AEF\u672B\u30FB\u30D6\u30E9\u30A6\u30B6\u306B\u623B\u3063\u3066\u63D0\u51FA\u3059\u308B\u3068\u30C1\u30E3\u30C3\u30C8\u30B2\u30FC\u30E0\u4E2D\u306B\u8868\u793A\u3055\u308C\u3066\u3044\u305F\u4F1A\u8A71\u6570\u3067\u63D0\u51FA\u3067\u304D\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002",
    "recovery.submit.signedGuarantee": "\u7F72\u540D\u3057\u305F\u63D0\u51FA\u7269\u306E\u6700\u512A\u5148\u6B04\u3067\u5B88\u3089\u308C\u308B\u4F1A\u8A71\u6570: {count} / {min}",
    "recovery.submit.signedNoPriority": "\u7F72\u540D\u3057\u305F\u63D0\u51FA\u7269\u306B\u306F\u6700\u512A\u5148\u6B04\u3092\u7F6E\u3051\u307E\u305B\u3093\u3067\u3057\u305F\uFF08\u6700\u512A\u5148\u6B04\u3067\u5B88\u3089\u308C\u308B\u4F1A\u8A71\u6570: 0\uFF09\u3002",
    "recovery.submit.wsAckedOverwrite": "\u904B\u55B6\u306E\u8A18\u9332\u3067\u306F\u3001\u3042\u306A\u305F\u306E WebSocket \u63D0\u51FA\u306F\u53D7\u7406\u6E08\u307F\u3067\u3059\u3002\uFF08\u3053\u306E\u8A18\u9332\u306F\u904B\u55B6\u306E\u7533\u544A\u3067\u3001\u3053\u306E\u753B\u9762\u3067\u306F\u78BA\u304B\u3081\u3089\u308C\u307E\u305B\u3093\u3002\uFF09\u3053\u3053\u3067\u518D\u69CB\u6210\u3057\u3066\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u3078\u63D0\u51FA\u3059\u308B\u3068\u3001\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u306E\u63D0\u51FA\u304C\u512A\u5148\u3055\u308C\u3001\u53D7\u7406\u6E08\u307F\u306E\u63D0\u51FA\u306F\u3053\u306E\u753B\u9762\u3067\u7D44\u307F\u76F4\u3057\u305F\u675F\u306B\u7F6E\u304D\u63DB\u308F\u308A\u307E\u3059\uFF08\u7D44\u307F\u76F4\u3057\u305F\u675F\u306F\u3001\u6700\u512A\u5148\u6B04\u3067\u5B88\u3089\u308C\u308B\u4F1A\u8A71\u6570\u304C\u5C11\u306A\u304F\u306A\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF09\u3002\u3084\u3081\u308B\u3068\u3001\u53D7\u7406\u6E08\u307F\u306E\u63D0\u51FA\u304C\u63A1\u70B9\u306B\u4F7F\u308F\u308C\u308B\u304B\u306F\u904B\u55B6\u3092\u4FE1\u983C\u3059\u308B\u3053\u3068\u306B\u306A\u308A\u307E\u3059\uFF08\u904B\u55B6\u3092\u4FE1\u983C\u3059\u308B\u3053\u3068\u306F\u3001\u904B\u55B6\u3078\u306E\u4F9D\u5B58\u3092\u751F\u3080\u305F\u3081\u975E\u63A8\u5968\u3067\u3059\uFF09\u3002\u7D9A\u3051\u307E\u3059\u304B\uFF1F",
    "recovery.rpcNode.singleTitle": "\u8AAD\u307F\u53D6\u308A\u306B\u4F7F\u3048\u308B\u30CE\u30FC\u30C9\u304C1\u3064\u3060\u3051\u3067\u3059",
    "recovery.rpcNode.singleBody": "\u30D6\u30ED\u30C3\u30AF\u30C1\u30A7\u30FC\u30F3\u304B\u3089\u30C1\u30E3\u30C3\u30C8\u306E\u7DE0\u5207\u30FB\u540D\u7C3F\u30FB\u6642\u523B\u3092\u8AAD\u307F\u53D6\u308B\u305F\u3081\u306E\u6709\u52B9\u306A\u30CE\u30FC\u30C9\u304C\u3001\u6B21\u306E1\u3064\u3060\u3051\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002\u3053\u306E\u30CE\u30FC\u30C9\u3092\u4FE1\u983C\u3057\u3066\u7D9A\u884C\u3057\u307E\u3059\u304B\uFF1F \u305D\u308C\u3068\u3082\u30A6\u30A9\u30EC\u30C3\u30C8\u3092\u63A5\u7D9A\u3057\u307E\u3059\u304B\uFF1F\uFF08\u3053\u306E\u30CE\u30FC\u30C9\u304C\u8AA4\u3063\u305F\u5024\u3092\u8FD4\u3059\u3068\u3001\u6B63\u3057\u304F\u904A\u3079\u306A\u3044\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF09",
    "recovery.rpcNode.nodeLine": "\u30CE\u30FC\u30C9: {host}",
    "recovery.rpcNode.trustContinue": "\u3053\u306E\u30CE\u30FC\u30C9\u3092\u4FE1\u983C\u3057\u3066\u7D9A\u884C",
    "recovery.rpcNode.connectWallet": "\u30A6\u30A9\u30EC\u30C3\u30C8\u3092\u63A5\u7D9A",
    "recovery.rpcNode.splitTitle": "\u30CE\u30FC\u30C9\u306E\u7B54\u3048\u304C\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059",
    "recovery.rpcNode.splitBody": "\u30D6\u30ED\u30C3\u30AF\u30C1\u30A7\u30FC\u30F3\u304B\u3089\u30C1\u30E3\u30C3\u30C8\u306E\u7DE0\u5207\u30FB\u540D\u7C3F\u30FB\u6642\u523B\u3092\u8AAD\u307F\u53D6\u308B\u30CE\u30FC\u30C9\u306E\u7B54\u3048\u304C\u3001\u6B21\u306E\u3088\u3046\u306B\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059\u3002\u4FE1\u983C\u3059\u308B\u30CE\u30FC\u30C9\u30921\u3064\u9078\u3076\u304B\u3001\u30A6\u30A9\u30EC\u30C3\u30C8\u3092\u63A5\u7D9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\uFF08\u9078\u3093\u3060\u30CE\u30FC\u30C9\u304C\u8AA4\u3063\u305F\u5024\u3092\u8FD4\u3059\u3068\u3001\u6B63\u3057\u304F\u904A\u3079\u306A\u3044\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF09",
    "recovery.rpcNode.splitSameWindowNote": "\u98DF\u3044\u9055\u3044\u304C\u7DE0\u5207\u306B\u51FA\u306A\u3044\u8AAD\u307F\uFF08\u540D\u7C3F\u306E\u767B\u9332\u6570\u306A\u3069\uFF09\u3067\u306F\u3001\u3069\u306E\u30CE\u30FC\u30C9\u3082\u540C\u3058\u958B\u59CB\u3068\u7DE0\u5207\u306B\u898B\u3048\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002",
    "recovery.rpcNode.splitNodeWindow": "{host}: \u7A93\u306E\u59CB\u307E\u308A\uFF08\u5FDC\u52DF\u306E\u7DE0\u5207\uFF09{start}\u30FB\u30C1\u30E3\u30C3\u30C8\u306E\u7DE0\u5207 {close}",
    "recovery.rpcNode.splitNodeUnread": "{host}: \u7A93\u3092\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F",
    "recovery.rpcNode.splitNodeValue": "\u98DF\u3044\u9055\u3063\u305F\u8AAD\u307F\uFF08{method}\uFF09\u306E\u7B54\u3048: {value}",
    "recovery.rpcNode.trustThis": "\u3053\u306E\u30CE\u30FC\u30C9\u3092\u4FE1\u983C\u3059\u308B",
    "recovery.rpcNode.waiting": "\u30C1\u30A7\u30FC\u30F3\u306E\u8AAD\u307F\u5148\u304C\u4E00\u81F4\u3057\u306A\u3044\u305F\u3081\u30015\u79D2\u5F8C\u306B\u8AAD\u307F\u76F4\u3057\u307E\u3059\uFF08\u4E2D\u6B62\u3067\u304D\u307E\u3059\uFF09\u3002",
    "recovery.rpcNode.approved": "\u3053\u306E\u30CE\u30FC\u30C9\u3092\u4FE1\u983C\u3057\u3066\u7D9A\u3051\u307E\u3059: {host}",
    "recovery.rpcNode.waitTitle": "\u9078\u3093\u3060\u30CE\u30FC\u30C9\u304C\u307E\u3060\u7B54\u3048\u3066\u3044\u307E\u305B\u3093",
    "recovery.rpcNode.waitBody": "\u3042\u306A\u305F\u304C\u4FE1\u983C\u3059\u308B\u3068\u9078\u3093\u3060\u30CE\u30FC\u30C9 {host} \u304C\u3001\u30C1\u30A7\u30FC\u30F3\u306E\u8AAD\u307F\u306B\u7B54\u3048\u306A\u3044\u3053\u3068\u304C\u7D04{seconds}\u79D2\u7D9A\u3044\u3066\u3044\u307E\u3059\uFF08\u6DF7\u96D1\u3084\u65B0\u3057\u3044\u30D6\u30ED\u30C3\u30AF\u306E\u5C4A\u304F\u9045\u308C\u306E\u3053\u3068\u3082\u3042\u308A\u307E\u3059\uFF09\u3002\u7B54\u3048\u306A\u304B\u3063\u305F\u8AAD\u307F\u306B\u306F\u3001\u307B\u304B\u306E\u30CE\u30FC\u30C9\u306E\u7B54\u3048\u3092\u4F7F\u308F\u305A\u306B\u5F85\u3063\u3066\u3044\u307E\u3059\u3002\u3053\u306E\u307E\u307E\u5F85\u3061\u307E\u3059\u304B\uFF1F \u305D\u308C\u3068\u3082\u5225\u306E\u30CE\u30FC\u30C9\u3092\u9078\u3073\u307E\u3059\u304B\uFF1F",
    "recovery.rpcNode.waitNoCandidates": "\u3044\u307E\u9078\u3079\u308B\u5225\u306E\u30CE\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\uFF08\u76F4\u8FD1\u306B\u7B54\u3048\u305F\u30CE\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\uFF09\u3002\u5F85\u3064\u304B\u3001\u30A6\u30A9\u30EC\u30C3\u30C8\u3092\u63A5\u7D9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.rpcNode.waitKeep": "\u5F85\u3064",
    "recovery.rpcNode.waitPickAnother": "\u5225\u306E\u30CE\u30FC\u30C9\u3092\u9078\u3076",
    "recovery.rpcNode.pickTitle": "\u5225\u306E\u30CE\u30FC\u30C9\u3092\u9078\u3076",
    "recovery.rpcNode.pickBody": "\u6B21\u306E\u30CE\u30FC\u30C9\u304C\u76F4\u8FD1\u306B\u7B54\u3048\u307E\u3057\u305F\uFF08\u5024\u306F\u305D\u308C\u305E\u308C\u306E\u6700\u5F8C\u306E\u7B54\u3048\uFF09\u3002\u4FE1\u983C\u3059\u308B\u30CE\u30FC\u30C9\u30921\u3064\u9078\u3076\u304B\u3001\u30A6\u30A9\u30EC\u30C3\u30C8\u3092\u63A5\u7D9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\uFF08\u3053\u306E\u4E2D\u306B\u8AA4\u3063\u305F\u5024\u3092\u8FD4\u3059\u30CE\u30FC\u30C9\u304C\u3042\u308B\u304B\u3082\u3057\u308C\u307E\u305B\u3093\u3002\u9078\u3093\u3060\u30CE\u30FC\u30C9\u304C\u8AA4\u3063\u305F\u5024\u3092\u8FD4\u3059\u3068\u3001\u6B63\u3057\u304F\u904A\u3079\u306A\u3044\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF09",
    "recovery.rpcNode.pickThis": "\u3053\u306E\u30CE\u30FC\u30C9\u3092\u9078\u3076",
    "recovery.rpcNode.pickNodeValue": "\u6700\u5F8C\u306E\u7B54\u3048\uFF08{method}\uFF09: {value}",
    "recovery.rpcNode.chosenWaiting": "\u9078\u3093\u3060\u30CE\u30FC\u30C9\uFF08{host}\uFF09\u306E\u7B54\u3048\u3092\u5F85\u3063\u3066\u3044\u307E\u3059\u30025\u79D2\u5F8C\u306B\u8AAD\u307F\u76F4\u3057\u307E\u3059\uFF08\u4E2D\u6B62\u3067\u304D\u307E\u3059\uFF09\u3002",
    "recovery.windowCompare.title": "\u30C1\u30E3\u30C3\u30C8\u306E\u7DE0\u5207\u306E\u8AAD\u307F\u304C\u3001\u8AAD\u307F\u5148\u306B\u3088\u3063\u3066\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059",
    "recovery.windowCompare.introBuild": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u306B\u8A18\u9332\u3055\u308C\u305F\u30C1\u30E3\u30C3\u30C8\u306E\u7A93\u3092\u3001\u30A6\u30A9\u30EC\u30C3\u30C8\u3068\u516C\u958B\u30CE\u30FC\u30C9\u304B\u3089\u8AAD\u307F\u76F4\u3057\u305F\u3068\u3053\u308D\u3001\u8AAD\u307F\u5148\u306B\u3088\u3063\u3066\u98DF\u3044\u9055\u3044\u307E\u3057\u305F\u3002\u6700\u512A\u5148\u6B04\uFF08\u3042\u306A\u305F\u306E\u4F1A\u8A71\u6570\u3092\u5B88\u308B\u6B04\uFF09\u306F\u3001\u9078\u3093\u3060\u7A93\u306E\u5185\u306E\u9805\u76EE\u3060\u3051\u3067\u7D44\u307F\u307E\u3059\u3002\u9078\u3093\u3060\u7A93\u304C\u672C\u5F53\u306E\u7A93\u3088\u308A\u5E83\u3044\uFF08\u7DE0\u5207\u304C\u9045\u3044\uFF09\u3068\u3001\u672C\u5F53\u306E\u7A93\u306E\u5916\u306E\u9805\u76EE\u304C\u6B04\u306B\u5165\u308A\u3001\u63D0\u51FA\u7269\u3054\u3068\u7121\u52B9\uFF080\u70B9\uFF09\u306B\u306A\u308A\u307E\u3059\u3002\u7DE0\u5207\u304C\u65E9\u3044\u7A93\u3067\u3082\u63D0\u51FA\u7269\u304C\u5FC5\u305A\u901A\u308B\u3068\u306F\u9650\u308A\u307E\u305B\u3093\u3002\u6700\u512A\u5148\u6B04\u306B\u672C\u5F53\u306E\u7A93\u306E\u5916\u306E\u9805\u76EE\u304C\u5165\u308C\u3070\u3001\u63D0\u51FA\u7269\u3054\u3068\u62D2\u307E\u308C\u307E\u3059\u3002\u65E2\u5B9A\u306E\u5370\u306F2\u7968\u4EE5\u4E0A\u306E\u4E00\u610F\u306E\u6700\u591A\u306E\u7A93\u3001\u540C\u6570\u304B\u7B54\u3048\u304C1\u672C\u306A\u3089\u3053\u306E\u7AEF\u672B\u306E\u7A93\u306B\u4ED8\u304D\u307E\u3059\u3002\u6700\u512A\u5148\u6B04\u306A\u3057\u3067\u51FA\u3059\u3068\u7A93\u3067\u306F\u62D2\u307E\u308C\u307E\u305B\u3093\u304C\u3001\u4F1A\u8A71\u6570\u306E\u5B88\u308A\u306F\u306A\u304F\u306A\u308A\u307E\u3059\u3002\u3069\u306E\u7A93\u3067\u6700\u512A\u5148\u6B04\u3092\u7D44\u3080\u304B\u3001\u6700\u512A\u5148\u6B04\u306A\u3057\u3067\u51FA\u3059\u304B\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",
    "recovery.windowCompare.introStored": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u306B\u8A18\u9332\u3055\u308C\u305F\u30C1\u30E3\u30C3\u30C8\u306E\u7A93\u3092\u8AAD\u307F\u76F4\u3057\u305F\u3068\u3053\u308D\u3001\u8AAD\u307F\u5148\u306B\u3088\u3063\u3066\u98DF\u3044\u9055\u3063\u305F\u304B\u3001\u4FDD\u5B58\u3057\u305F\u63D0\u51FA\u7269\uFF08\u63A7\u3048\uFF09\u306E\u6700\u512A\u5148\u6B04\u304C\u3001\u8AAD\u307F\u5148\u304C\u4E00\u81F4\u3057\u305F\u7A93\u306E\u5916\u306E\u9805\u76EE\u3092\u542B\u3093\u3067\u3044\u307E\u3059\u3002\u63A7\u3048\u306E\u6700\u512A\u5148\u6B04\u306F\u3001\u672C\u5F53\u306E\u7A93\u306E\u5916\u306E\u9805\u76EE\u30921\u3064\u3067\u3082\u542B\u3080\u3068\u63D0\u51FA\u7269\u3054\u3068\u7121\u52B9\uFF080\u70B9\uFF09\u306B\u306A\u308A\u307E\u3059\u3002\u5404\u7A93\u306B\u3064\u3044\u3066\u3001\u63A7\u3048\u306E\u6700\u512A\u5148\u6B04\u304C\u305D\u306E\u7A93\u306E\u5185\u304B\u3092\u793A\u3057\u307E\u3059\u3002",
    "recovery.windowCompare.groupLine": "\u7A93\u306E\u59CB\u307E\u308A\uFF08\u5FDC\u52DF\u306E\u7DE0\u5207\uFF09{start}\u30FB\u30C1\u30E3\u30C3\u30C8\u306E\u7DE0\u5207 {close}",
    "recovery.windowCompare.groupSources": "\u3053\u306E\u7A93\u3092\u8FD4\u3057\u305F\u8AAD\u307F\u5148: {sources}",
    "recovery.windowCompare.noSources": "\uFF08\u3069\u306E\u8AAD\u307F\u5148\u3082\u3053\u306E\u7A93\u3092\u8FD4\u3057\u3066\u3044\u307E\u305B\u3093\uFF09",
    "recovery.windowCompare.sourceWallet": "\u30A6\u30A9\u30EC\u30C3\u30C8",
    "recovery.windowCompare.thisDevice": "\u3053\u306E\u7AEF\u672B\u304C\u4ECA\u4F7F\u3063\u3066\u3044\u308B\u7A93",
    "recovery.windowCompare.majority": "\u591A\u6570\u304C\u4E00\u81F4",
    "recovery.windowCompare.tieHint": "\u5370\u306E\u7A93\u306F\u3001\u3053\u306E\u7AEF\u672B\u304C\u30C1\u30E3\u30C3\u30C8\u4E2D\u306B2\u672C\u4EE5\u4E0A\u306E\u8AAD\u307F\u5148\u306E\u4E00\u81F4\u306A\u3069\u3067\u6C7A\u3081\u305F\u7A93\u3067\u3059\u3002\uFF08\u8A2D\u5B9A\u306B\u904B\u55B6\u306E\u30CE\u30FC\u30C9\u3092\u7F6E\u3044\u305F\u7AEF\u672B\u3067\u306F\u3001\u904B\u55B6\u306E\u30CE\u30FC\u30C9\u306E\u8AAD\u307F\u3067\u6C7A\u3081\u305F\u7A93\u306E\u3053\u3068\u3082\u3042\u308A\u307E\u3059\u3002\uFF09",
    "recovery.windowCompare.storedInside": "\u63A7\u3048\u306E\u6700\u512A\u5148\u6B04\u306F\u3053\u306E\u7A93\u306E\u5185\u3067\u3059",
    "recovery.windowCompare.storedOutside": "\u63A7\u3048\u306E\u6700\u512A\u5148\u6B04\u306F\u3053\u306E\u7A93\u306E\u5916\u306E\u9805\u76EE\u3092\u542B\u307F\u307E\u3059",
    "recovery.windowCompare.lockNotUsed": "\u3053\u306E\u7A93\u3092\u9078\u3076\u3068\u3001\u753B\u9762\u306720\u306B\u306A\u3063\u305F\u6642\u70B9\u306B\u78BA\u5B9A\u3057\u305F\u6700\u512A\u5148\u6B04\u306E\u7D44\u306F\u4F7F\u3048\u305A\u3001\u7D44\u307F\u76F4\u3057\u306B\u306A\u308A\u307E\u3059\u3002",
    "recovery.windowCompare.unanswered": "\u8AAD\u3081\u306A\u304B\u3063\u305F\u8AAD\u307F\u5148: {sources}",
    "recovery.windowCompare.operatorNode": "\u904B\u55B6\u30CE\u30FC\u30C9\uFF08\u53C2\u8003\u30FB\u9078\u3079\u307E\u305B\u3093\uFF09: \u7A93\u306E\u59CB\u307E\u308A\uFF08\u5FDC\u52DF\u306E\u7DE0\u5207\uFF09{start}\u30FB\u30C1\u30E3\u30C3\u30C8\u306E\u7DE0\u5207 {close}",
    "recovery.windowCompare.operatorNodeUnread": "\u904B\u55B6\u30CE\u30FC\u30C9\uFF08\u53C2\u8003\uFF09: \u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F",
    "recovery.windowCompare.chooseWindow": "\u3053\u306E\u7A93\u3067\u6700\u512A\u5148\u6B04\u3092\u7D44\u3080",
    "recovery.windowCompare.chooseWindowStored": "\u3053\u306E\u7A93\u3092\u4F7F\u3046\uFF08\u63A7\u3048\u304C\u3053\u306E\u7A93\u306E\u5185\u306A\u3089\u63A7\u3048\u306E\u307E\u307E\u51FA\u3057\u3001\u5916\u306A\u3089\u7D44\u307F\u76F4\u3059\uFF09",
    "recovery.windowCompare.chooseNone": "\u6700\u512A\u5148\u6B04\u306A\u3057\u3067\u51FA\u3059",
    "recovery.windowCompare.chooseNoneStored": "\u6700\u512A\u5148\u6B04\u306A\u3057\u3067\u7D44\u307F\u76F4\u3057\u3066\u51FA\u3059",
    "recovery.windowCompare.chooseStored": "\u63A7\u3048\u3092\u305D\u306E\u307E\u307E\u51FA\u3059",
    "recovery.windowCompare.storedOnlyNote": "\u3053\u306E\u753B\u9762\u3067\u306F\u63D0\u51FA\u7269\u3092\u7D44\u307F\u76F4\u305B\u307E\u305B\u3093\u3002\u7D44\u307F\u76F4\u3059\u306B\u306F\u3001\u30D6\u30ED\u30C3\u30AF\u3068\u672C\u4EBA\u3092\u9078\u3093\u3067\u9375\u3092\u8AAD\u307F\u8FBC\u307F\u3001\u63D0\u51FA\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u3084\u3081\u308B\u3068\u3001\u3053\u306E\u753B\u9762\u304B\u3089\u306F\u4F55\u3082\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u306B\u51FA\u307E\u305B\u3093\u3002",
    "recovery.windowCompare.confirm": "\u3053\u306E\u9078\u629E\u3067\u7D9A\u3051\u308B",
    "recovery.windowCompare.cancel": "\u3084\u3081\u308B\uFF08\u4F55\u3082\u7F72\u540D\u30FB\u9001\u4FE1\u3057\u307E\u305B\u3093\uFF09",
    "recovery.windowCompare.cancelled": "\u63D0\u51FA\u3092\u3084\u3081\u307E\u3057\u305F\uFF08\u4F55\u3082\u7F72\u540D\u30FB\u9001\u4FE1\u3057\u3066\u3044\u307E\u305B\u3093\uFF09\u3002",
    "recovery.windowCompare.reading": "\u30C1\u30E3\u30C3\u30C8\u306E\u7A93\u3092\u8AAD\u307F\u6BD4\u3079\u3066\u3044\u307E\u3059\u2026",
    "recovery.windowCompare.deviceMark": "\u3053\u306E\u7AEF\u672B\u306E\u7A93\uFF08\u5370\uFF09",
    "recovery.windowCompare.noMarkHint": "\u8AAD\u307F\u5148\u306E\u591A\u6570\u304C\u6C7A\u307E\u3089\u305A\u3001\u3053\u306E\u7AEF\u672B\u306E\u7A93\u3082\u306A\u3044\u305F\u3081\u3001\u5370\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u7A93\u306E\u59CB\u307E\u308A\u3068\u7DE0\u5207\u3092\u898B\u6BD4\u3079\u3066\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",
    "recovery.windowCompare.walletOwnNode": "\u30A6\u30A9\u30EC\u30C3\u30C8\u81EA\u8EAB\u306E\u30CE\u30FC\u30C9",
    "recovery.windowCompare.remoteHeadNote": "\uFF08WalletConnect\u30FB\u30B9\u30DE\u30DB\u306E MetaMask \u306E\u30A6\u30A9\u30EC\u30C3\u30C8\u306E\u8AAD\u307F\u5148\uFF09",
    "recovery.windowCompare.cancelledOnChain": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u3078\u306E\u63D0\u51FA\u3092\u3084\u3081\u307E\u3057\u305F\uFF08\u4F55\u3082\u7F72\u540D\u30FB\u9001\u4FE1\u3057\u3066\u3044\u307E\u305B\u3093\uFF09\u3002WS \u306E\u63D0\u51FA\u306E\u72B6\u614B\u306F\u5909\u308F\u308A\u307E\u305B\u3093\u3002",
    "recovery.senderSlots": "\u3053\u306E\u30A6\u30A9\u30EC\u30C3\u30C8\u306EEvidence\u63D0\u51FA\u6570",
    "recovery.sharedWalletLimit": "\u3053\u306E\u30A6\u30A9\u30EC\u30C3\u30C8\u3092\u5171\u6709\u3059\u308B\u30E6\u30FC\u30B6\u30FCID\u306F\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u306E3\u67A0\u3092\u5206\u3051\u5408\u3044\u307E\u3059\u3002",
    "recovery.warn.proofMissing": "\u516C\u958B\u540D\u7C3F\u5168\u4F53\u306E\u8A3C\u660E\u304C\u7121\u3044\u304B\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002\u540D\u7C3F\u30D5\u30A1\u30A4\u30EB\u304C\u8AAD\u3081\u308B\u3088\u3046\u306B\u306A\u3063\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.trimNotice": "\u30C7\u30FC\u30BF\u5BB9\u91CF\u304C\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u306E\u4E0A\u9650\u3092\u8D85\u3048\u3066\u3044\u308B\u305F\u3081\u3001\u4E0B\u8A18\u306E\u53D7\u9818\u8A3C\u660E\uFF08\u65E2\u8AAD\uFF09\u3092\u63D0\u51FA\u30C7\u30FC\u30BF\u304B\u3089\u5916\u3057\u307E\u3059\u3002\u767A\u8A00\u30FB\u81EA\u5206\u306E\u6295\u7968\u30FB\u5BC6\u544A\u306F\u5916\u3057\u307E\u305B\u3093\uFF08\u4E0B\u306E\u4F1A\u8A71\u6570\u306E\u4FDD\u8A3C\u304C\u4E0B\u304C\u308B\u3068\u304D\u3060\u3051\u3001\u8986\u3044\u3092\u5931\u3063\u305F\u6700\u512A\u5148\u6B04\u306E\u767A\u8A00\u3082\u5916\u308C\u307E\u3059\uFF09\u3002\u63A1\u70B9\u306F\u5168\u54E1\u306E\u63D0\u51FA\u7269\u3092\u5408\u308F\u305B\u3066\u884C\u3046\u305F\u3081\u3001\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u63D0\u51FA\u7269\u306B\u3042\u308B\u65E2\u8AAD\u306F\u63A1\u70B9\u306B\u6B8B\u308A\u307E\u3059\uFF08\u6295\u7968\u3078\u306E\u53D7\u9818\u8A3C\u660E\u306F\u3001\u305D\u306E\u53D7\u9818\u8A3C\u660E\u3092\u51FA\u3057\u305F\u672C\u4EBA\u4EE5\u5916\u306E\u63D0\u51FA\u7269\u306B\u3042\u308B\u3082\u306E\u3060\u3051\u304C\u6570\u3048\u3089\u308C\u307E\u3059\uFF09\u3002",
    "recovery.trimGuarantee": "\u3053\u306E\u63D0\u51FA\u7269\u306E\u4F1A\u8A71\u6570\u306E\u4FDD\u8A3C: {gBefore} \u2192 {gAfter}",
    "recovery.trimEssentialUnionWarning": "\u3053\u306E\u524A\u9664\u3067\u3001\u3053\u306E\u7AEF\u672B\u306E\u63D0\u51FA\u7269\u3060\u3051\u3067\u306F\u81EA\u5206\u306E\u8CC7\u683C\uFF08\u4F1A\u8A71\u6570\u30FB\u5B57\u6570\u30FB\u6295\u7968\uFF09\u3084\u5BC6\u544A\u306E\u6839\u62E0\u3092\u793A\u3057\u304D\u308C\u306A\u304F\u306A\u308B\u304A\u305D\u308C\u304C\u3042\u308A\u307E\u3059\u3002\u63A1\u70B9\u306F\u5168\u54E1\u306E\u63D0\u51FA\u7269\u3092\u5408\u308F\u305B\u3066\u884C\u3044\u307E\u3059\u3002",
    "recovery.trimEssentialOverrideWarning": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u306F\u3001\u540C\u3058\u63D0\u51FA\u8005\u306E\u30B5\u30FC\u30D0\u30FC\u63D0\u51FA\u3088\u308A\u512A\u5148\u3055\u308C\u307E\u3059\u3002\u3059\u3067\u306B WebSocket \u63D0\u51FA\u304C\u627F\u8A8D\u6E08\u307F\u306A\u3089\u3001\u30C8\u30EA\u30E0\u306B\u3088\u308A\u70B9\u6570\u304C\u60AA\u5316\u3059\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002",
    "recovery.trimEssentialCancelRecommended": "\u3053\u306E\u7AEF\u672B\u306F\u3001WebSocket \u63D0\u51FA\u3092\u53D7\u7406\u3057\u305F\u3068\u3044\u3046\u904B\u55B6\u306E\u7533\u544A\u3092\u53D7\u3051\u53D6\u3063\u3066\u3044\u307E\u3059\uFF08\u3053\u306E\u753B\u9762\u3067\u306F\u78BA\u304B\u3081\u3089\u308C\u307E\u305B\u3093\uFF09\u3002",
    "recovery.trimLossWarning": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u3067\u304D\u308B\u30C7\u30FC\u30BF\u30B5\u30A4\u30BA\u304B\u3089\u6EA2\u308C\u3066\u3044\u308B\u90E8\u5206\u304C\u3042\u308B\u305F\u3081\u3001\u3042\u306A\u305F\u306E\u4EE5\u4E0B\u306E\u884C\u52D5\u304C\u63A1\u70B9\u3055\u308C\u308B\u3053\u3068\u304C\u4FDD\u8A3C\u3067\u304D\u307E\u305B\u3093\u3002\u305D\u308C\u3067\u3082\u30B5\u30FC\u30D0\u30FC\u63D0\u51FA\u3092\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u3067\u4E0A\u66F8\u304D\u3057\u307E\u3059\u304B\uFF1F",
    "recovery.trimLossWarningNoServer": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u3067\u304D\u308B\u30C7\u30FC\u30BF\u30B5\u30A4\u30BA\u304B\u3089\u6EA2\u308C\u3066\u3044\u308B\u90E8\u5206\u304C\u3042\u308B\u305F\u3081\u3001\u3042\u306A\u305F\u306E\u4EE5\u4E0B\u306E\u884C\u52D5\u304C\u63A1\u70B9\u3055\u308C\u308B\u3053\u3068\u304C\u4FDD\u8A3C\u3067\u304D\u307E\u305B\u3093\u3002\u305D\u308C\u3067\u3082\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u3057\u307E\u3059\u304B\uFF1F",
    "recovery.trimLossTurns": "\u4F1A\u8A71\u6570: {before} \u2192 {after}",
    "recovery.trimLossChars": "\u767A\u8A00\u6587\u5B57\u6570: {before} \u2192 {after}",
    "recovery.trimLossCharsUnprotected": "\u767A\u8A00\u6587\u5B57\u6570: {before} \u2192 \u3053\u306E\u63D0\u51FA\u3067\u306F\u4FDD\u8A3C\u3067\u304D\u307E\u305B\u3093",
    "recovery.trimLossVote": "\u6295\u7968\uFF08\u5BFE\u8C61: {name}\uFF09",
    "recovery.trimLossVoteNoTarget": "\u6295\u7968",
    "recovery.trimLossReports": "\u5BC6\u544A\uFF08\u5BFE\u8C61: {names}\uFF09",
    "recovery.trimLossUnchecked": "\u5207\u308A\u8A70\u3081\u305F\u5F8C\u306E\u63D0\u51FA\u7269\u3067\u4FDD\u8A3C\u3067\u304D\u308B\u3053\u3068\u3092\u78BA\u304B\u3081\u3089\u308C\u307E\u305B\u3093\u3067\u3057\u305F\uFF08\u63D0\u51FA\u306B\u306F\u5F71\u97FF\u3057\u307E\u305B\u3093\uFF09\u3002",
    "recovery.trimImpossible": "\u30C7\u30FC\u30BF\u5BB9\u91CF\u304C\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u306E\u4E0A\u9650\u3092\u8D85\u3048\u3066\u304A\u308A\u3001\u524A\u6E1B\u3057\u3066\u3082\u53CE\u307E\u308A\u307E\u305B\u3093\u3002",
    "recovery.trimImpossibleContributors": "\u524A\u9664\u3067\u304D\u306A\u3044\u30C7\u30FC\u30BF\u306E\u4E3B\u306A\u767A\u4FE1\u8005\uFF08\u4E0A\u4F4D3\u540D\u307E\u3067\uFF09: {uids}",
    "recovery.persistenceFailure": "\u3053\u306E\u7AEF\u672B\u306E\u8A18\u9332\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u63D0\u51FA\u307E\u3067\u753B\u9762\u3092\u958B\u3044\u305F\u307E\u307E\u306B\u3057\u3001\u30D6\u30E9\u30A6\u30B6\u306E\u7A7A\u304D\u5BB9\u91CF\u3092\u78BA\u4FDD\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.persistenceVolatile": "\u3053\u306E\u7AEF\u672B\u306B\u6551\u6E08\u7528\u306E\u63A7\u3048\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u767A\u4FE1\u306F\u7D9A\u3051\u307E\u3059\u304C\u3001\u518D\u8AAD\u307F\u8FBC\u307F\u5F8C\u306E\u6551\u6E08\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
    "recovery.submitted": "\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u3057\u307E\u3057\u305F\u3002\u7D50\u679C\u7A93\u304C\u9589\u3058\u305F\u5F8C\uFF08\u78BA\u8A8D\u307E\u3067\u7D0413\u5206\uFF09\u306B\u53CD\u6620\u3055\u308C\u307E\u3059\u3002",
    "recovery.onchainDone": "\u7D50\u679C\u63D0\u51FA\u6E08\u307F",
    "recovery.title": "\u5FA9\u5143\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8",
    "recovery.blockLabel": "\u30D6\u30ED\u30C3\u30AF",
    "recovery.groupLabel": "\u30B0\u30EB\u30FC\u30D7",
    "recovery.timeRemaining": "\u6B8B\u308A\u6642\u9593",
    "recovery.clock.warning": "\u3053\u306E\u7AEF\u672B\u306E\u6642\u8A08\u3068\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u306E\u30D6\u30ED\u30C3\u30AF\u30BF\u30A4\u30E0\u3068\u306E\u305A\u308C\u3092{offset}\u79D2\u691C\u51FA\u3057\u307E\u3057\u305F\u3002\u3053\u306E\u7AEF\u672B\u306E\u6642\u8A08\u306E\u6642\u523B\u304C\u72C2\u3063\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u30022\u5206\u4EE5\u4E0A\u306E\u30BA\u30EC\u304C\u3042\u308B\u3068\u30B2\u30FC\u30E0\u306E\u9032\u884C\u304C\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002\u6B63\u3057\u3044\u6642\u523B\u3068\u306E\u5DEE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.clock.confirmation": "\u3053\u306E\u7AEF\u672B\u306E\u6642\u8A08\u306F\u73FE\u5728\u4EE5\u4E0B\u306E\u901A\u308A\u3068\u306A\u3063\u3066\u3044\u307E\u3059\u304C\u3001\u3053\u308C\u306F\u6B63\u3057\u3044\u3067\u3059\u304B\uFF1F2\u5206\u4EE5\u4E0A\u96E2\u308C\u3066\u3044\u308B\u3068\u30B2\u30FC\u30E0\u3092\u72C2\u308F\u305B\u308B\u53EF\u80FD\u6027\u304C\u3042\u308B\u306E\u3067\u3001\u4FEE\u6B63\u3057\u3066\u304F\u3060\u3055\u3044",
    "recovery.clock.current": "\u4ECA\u306E\u7AEF\u672B\u306E\u6642\u8A08",
    "recovery.clock.correction": "\u88DC\u6B63\u79D2\u6570\uFF08\u9045\u308C\u3066\u3044\u308C\u3070\uFF0B\u3001\u9032\u3093\u3067\u3044\u308C\u3070\u2212\uFF09",
    "recovery.clock.toggleSign": "\u88DC\u6B63\u79D2\u6570\u306E\u7B26\u53F7\u3092\u5207\u308A\u66FF\u3048\u308B",
    "recovery.clock.signHelp": "\u8B66\u544A\u306E\u300E+\u300F\u306F\u7AEF\u672B\u306E\u6642\u8A08\u304C\u9032\u3093\u3067\u3044\u308B\u3053\u3068\u3092\u8868\u3057\u307E\u3059\u3002\u9032\u3093\u3067\u3044\u308C\u3070\u2212\u3001\u9045\u308C\u3066\u3044\u308C\u3070\uFF0B\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.clock.corrected": "\u88DC\u6B63\u5F8C\u306E\u6642\u8A08",
    "recovery.clock.confirm": "\u78BA\u8A8D",
    "recovery.clock.correct": "\u3053\u306E\u7AEF\u672B\u306E\u6642\u8A08\u306F\u6B63\u3057\u3044",
    "recovery.clock.close": "\u9589\u3058\u308B",
    "recovery.clock.invalid": "\u6574\u6570\u306E\u79D2\u6570\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u4F8B: \u2212180 \u307E\u305F\u306F +30\u3001\xB124\u6642\u9593\u4EE5\u5185\uFF09\u3002",
    "recovery.clock.adopt": "\u4EE5\u4E0B\u306ERPC\u304B\u3089\u53D6\u5F97\u3057\u305F\u30A4\u30FC\u30B5\u30EA\u30A2\u30E0\u306E\u6700\u65B0\u306E\u30D6\u30ED\u30C3\u30AF\u30BF\u30A4\u30E0\u3068{offset}\u79D2\u30BA\u30EC\u3066\u3044\u307E\u3059\u304C\u3001\u3053\u306E\u88DC\u6B63\u5F8C\u306E\u6642\u523B\u3092\u63A1\u7528\u3057\u3066\u3082\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F",
    "recovery.clock.repeated": "\u4F55\u5EA6\u3082\u540C\u3058\u6642\u9593\u306B\u623B\u308B\u306E\u306F\u4E0D\u6B63\u884C\u70BA\u3068\u3057\u3066\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u5BC6\u544A\u3055\u308C\u308B\u53EF\u80FD\u6027\u304C\u9AD8\u307E\u308A\u307E\u3059\u304C\u3001\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F",
    "recovery.clock.partialReissue": "\u4EE5\u4E0B\u306E\u30C1\u30E3\u30C3\u30C8\u306B\u5BFE\u3059\u308B\u65E2\u8AAD\u3092\u6642\u523B\u3092\u4FEE\u6B63\u3057\u3066\u518D\u767A\u884C\u3092\u884C\u3046\u3068\u3001\u4E0D\u6B63\u884C\u70BA\u300C\u5BFE\u8C61\u304C\u91CD\u8907\u3059\u308B\u65E2\u8AAD\u306E\u7D2F\u7A4D\u679A\u6570\u304C5\u679A\u3092\u8D85\u3048\u308B\u300D\u306B\u8A72\u5F53\u3059\u308B\u305F\u3081\u3001\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u5BC6\u544A\u3055\u308C\u308B\u53EF\u80FD\u6027\u304C\u9AD8\u304F\u306A\u308A\u307E\u3059\u3002\u4EE5\u4E0B\u306E\u30C1\u30E3\u30C3\u30C8\u306B\u5BFE\u3059\u308B\u65E2\u8AAD\u306E\u6642\u523B\u4FEE\u6B63\u3092\u884C\u3044\u307E\u3059\u304B\uFF1F",
    "recovery.clock.partialReissueApply": "\u6642\u523B\u4FEE\u6B63\u3092\u884C\u3046",
    "recovery.clock.partialReissueSkip": "\u6642\u523B\u4FEE\u6B63\u3092\u884C\u308F\u306A\u3044",
    "recovery.clock.adoptButton": "\u63A1\u7528\u3059\u308B",
    "recovery.clock.continue": "\u7D9A\u3051\u308B",
    "recovery.clock.wallet": "\u30A6\u30A9\u30EC\u30C3\u30C8",
    "recovery.clock.manualEntry": "\u6642\u8A08\u3092\u88DC\u6B63",
    "recovery.clock.futureLockWarning": "\u7AEF\u672B\u306E\u6642\u8A08\u304C\u5927\u304D\u304F\u30D6\u30ED\u30C3\u30AF\u30C1\u30A7\u30FC\u30F3\u306E\u6642\u9593\u3068\u305A\u308C\u3066\u3044\u307E\u3059\u3002\u3053\u306E\u307E\u307E\u3067\u306F\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u767A\u8A00/\u6295\u7968/\u5BC6\u544A/\u65E2\u8AAD\u3092\u53D7\u3051\u53D6\u308B\u3053\u3068\u304C\u3067\u304D\u306A\u3044\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u6B63\u3057\u3044\u6642\u9593\u306B\u5408\u308F\u305B\u3066\u88DC\u6B63\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.clock.futureEarlyWarning": "\u7AEF\u672B\u306E\u6642\u8A08\u304C\u30D6\u30ED\u30C3\u30AF\u30C1\u30A7\u30FC\u30F3\u306E\u6642\u9593\u3088\u308A\u5927\u304D\u304F\u9032\u3093\u3067\u3044\u307E\u3059\u3002\u3053\u306E\u307E\u307E\u3067\u306F\u3001\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u7DE0\u5207\u524D\u306E\u6295\u7968\u306B\u53D7\u9818\u8A3C\u660E\u3092\u51FA\u305B\u306A\u304B\u3063\u305F\u308A\u3001\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u767A\u8A00\u306B\u65E2\u8AAD\u3092\u51FA\u305B\u306A\u304B\u3063\u305F\u308A\u3059\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u3042\u306A\u305F\u306E\u767A\u8A00\u3068\u6295\u7968\u306F\u3001\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u9045\u308C\u3066\u5C4A\u304F\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u6B63\u3057\u3044\u6642\u9593\u306B\u5408\u308F\u305B\u3066\u88DC\u6B63\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.clock.warningContinue": "\u3053\u306E\u307E\u307E\u7D9A\u3051\u308B",
    "recovery.clock.bandLate": "\u7AEF\u672B\u306E\u6642\u8A08\u304C\u30D6\u30ED\u30C3\u30AF\u30C1\u30A7\u30FC\u30F3\u306E\u6642\u9593\u3088\u308A\u7D04{seconds}\u79D2\u9045\u308C\u3066\u3044\u307E\u3059\uFF08100\u79D2\u672A\u6E80\u306B\u306A\u308B\u3068\u6D88\u3048\u307E\u3059\uFF09\u3002",
    "recovery.rpcStale.public": "\u30C1\u30A7\u30FC\u30F3\u304B\u3089\u8AAD\u307F\u53D6\u3063\u305F\u30D6\u30ED\u30C3\u30AF\u304C\u3001\u3053\u306E\u7AEF\u672B\u306E\u6642\u8A08\u3088\u308A\u7D04{minutes}\u5206\u53E4\u304F\u306A\u3063\u3066\u3044\u307E\u3059\u3002\u8AAD\u307F\u53D6\u308A\u306B\u4F7F\u3063\u305F\u516C\u958B\u30CE\u30FC\u30C9\u306E\u540C\u671F\u304C\u9045\u308C\u3066\u3044\u308B\u304B\u3001\u3053\u306E\u7AEF\u672B\u306E\u6642\u8A08\u304C\u9032\u3093\u3067\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\uFF08\u6642\u8A08\u306E\u305A\u308C\u306E\u8B66\u544A\u304C\u51FA\u305F\u3089\u3001\u305D\u3061\u3089\u306B\u5F93\u3063\u3066\u88DC\u6B63\u3057\u3066\u304F\u3060\u3055\u3044\uFF09\u3002\u540D\u7C3F\u306E\u78BA\u5B9A\uFF08\u30C1\u30E3\u30C3\u30C8\u306E\u958B\u59CB\uFF09\u3084\u7DE0\u5207\u306E\u5224\u5B9A\u304C\u9045\u308C\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002\u30D6\u30E9\u30A6\u30B6\u306E\u62E1\u5F35\u306E\u30A6\u30A9\u30EC\u30C3\u30C8\u3092\u30A4\u30FC\u30B5\u30EA\u30A2\u30E0\u306E\u30E1\u30A4\u30F3\u30CD\u30C3\u30C8\u3067\u63A5\u7D9A\u3059\u308B\u3068\u76F4\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002\u8AAD\u307F\u53D6\u3063\u305F\u30D6\u30ED\u30C3\u30AF\u304C\u65B0\u3057\u304F\u306A\u308B\u3068\u3001\u7D041\u5206\u3067\u6D88\u3048\u307E\u3059\u3002",
    "recovery.rpcStale.wallet": "\u30A6\u30A9\u30EC\u30C3\u30C8\u304B\u3089\u8AAD\u307F\u53D6\u3063\u305F\u30D6\u30ED\u30C3\u30AF\u304C\u3001\u3053\u306E\u7AEF\u672B\u306E\u6642\u8A08\u3088\u308A\u7D04{minutes}\u5206\u53E4\u304F\u306A\u3063\u3066\u3044\u307E\u3059\u3002\u30A6\u30A9\u30EC\u30C3\u30C8\u304C\u4F7F\u3063\u3066\u3044\u308B\u30CE\u30FC\u30C9\u306E\u540C\u671F\u304C\u9045\u308C\u3066\u3044\u308B\u304B\u3001\u3053\u306E\u7AEF\u672B\u306E\u6642\u8A08\u304C\u9032\u3093\u3067\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\uFF08\u6642\u8A08\u306E\u305A\u308C\u306E\u8B66\u544A\u304C\u51FA\u305F\u3089\u3001\u305D\u3061\u3089\u306B\u5F93\u3063\u3066\u88DC\u6B63\u3057\u3066\u304F\u3060\u3055\u3044\uFF09\u3002\u540D\u7C3F\u306E\u78BA\u5B9A\uFF08\u30C1\u30E3\u30C3\u30C8\u306E\u958B\u59CB\uFF09\u3084\u7DE0\u5207\u306E\u5224\u5B9A\u304C\u9045\u308C\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002\u30A6\u30A9\u30EC\u30C3\u30C8\u306E\u8A2D\u5B9A\u3067\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u306E\u30CE\u30FC\u30C9\uFF08RPC\uFF09\u3092\u5207\u308A\u66FF\u3048\u308B\u3068\u76F4\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002\u8AAD\u307F\u53D6\u3063\u305F\u30D6\u30ED\u30C3\u30AF\u304C\u65B0\u3057\u304F\u306A\u308B\u3068\u3001\u7D041\u5206\u3067\u6D88\u3048\u307E\u3059\u3002",
    "recovery.clock.bandEarly": "\u7AEF\u672B\u306E\u6642\u8A08\u304C\u30D6\u30ED\u30C3\u30AF\u30C1\u30A7\u30FC\u30F3\u306E\u6642\u9593\u3088\u308A\u7D04{seconds}\u79D2\u9032\u3093\u3067\u3044\u307E\u3059\uFF08120\u79D2\u672A\u6E80\u306B\u306A\u308B\u3068\u6D88\u3048\u307E\u3059\uFF09\u3002",
    "recovery.clock.bandDeadline": "\u3042\u306A\u305F\u306E\u6642\u8A08\u3067\u306E\u6295\u7968\u306E\u7DE0\u5207: {time}\uFF08\u544A\u77E5\u306E\u6642\u523B\u3067\u306F\u306A\u304F\u3001\u3053\u306E\u6642\u523B\u307E\u3067\u306B\u6295\u7968\u3057\u3066\u304F\u3060\u3055\u3044\uFF09",
    "recovery.clock.cooldownRejected": "10\u5206\u306E\u9593\u9694\u306E\u9593\u306F\u3001\u30D6\u30ED\u30C3\u30AF\u30C1\u30A7\u30FC\u30F3\u306E\u6642\u523B\u3068\u7167\u3089\u3057\u3066\u3053\u306E\u8B66\u544A\u304C\u6D88\u3048\u308B\u88DC\u6B63\u3060\u3051\u304C\u3067\u304D\u307E\u3059\uFF08\u30D6\u30ED\u30C3\u30AF\u30C1\u30A7\u30FC\u30F3\u306E\u6642\u523B\u3092\u8AAD\u3081\u306A\u3044\u3068\u304D\u306F\u3067\u304D\u307E\u305B\u3093\uFF09\u3002",
    "recovery.clock.cooldown": "\u3042\u3068{minutes}\u5206\u3067\u88DC\u6B63\u3067\u304D\u307E\u3059",
    "recovery.clock.manualHeading": "\u7AEF\u672B\u306E\u6642\u8A08\u3092\u88DC\u6B63\u3057\u307E\u3059\u3002\u6B63\u3057\u3044\u6642\u523B\u3068\u306E\u5DEE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.clock.offset": "\u305A\u308C: {offset}\u79D2",
    "recovery.clock.neutralSignHelp": "\u9032\u3093\u3067\u3044\u308C\u3070\u2212\u3001\u9045\u308C\u3066\u3044\u308C\u3070\uFF0B\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.clock.reloadAfterDeviceFix": "\u7AEF\u672B\u306E\u8A2D\u5B9A\u3067\u6642\u8A08\u3092\u76F4\u3057\u305F\u5834\u5408\u306F\u3001\u30DA\u30FC\u30B8\u3092\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.clock.checking": "\u78BA\u8A8D\u4E2D\u2026",
    "recovery.clock.back": "\u623B\u308B",
    "recovery.clock.reissueRisk": "\u30C1\u30E3\u30C3\u30C8\u4E2D\u306B\u6642\u8A08\u3092\u623B\u3059\uFF08\u2212\u306E\uFF09\u88DC\u6B63\u3092\u3059\u308B\u3068\u3001\u76F4\u8FD110\u5206\u306E\u65E2\u8AAD\u3092\u88DC\u6B63\u5F8C\u306E\u6642\u523B\u3067\u51FA\u3057\u76F4\u3057\u307E\u3059\u3002\u51FA\u3057\u76F4\u3057\u304C\u591A\u3044\u3068\u304D\uFF08\u4F1A\u8A71\u304C\u7D9A\u3044\u305F\u76F4\u5F8C\u3001\u4F55\u5EA6\u3082\u623B\u3059\u88DC\u6B63\u3092\u3057\u305F\u3068\u304D\u3001\u8907\u6570\u306E\u7AEF\u672B\u3084\u516C\u5F0F\u3068\u5FA9\u5143\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u3067\u53C2\u52A0\u3057\u3066\u3044\u308B\u3068\u304D\u306A\u3069\uFF09\u306F\u3001\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u753B\u9762\u3067\u3001\u88DC\u6B63\u3057\u305F\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u5BC6\u544A\u3092\u63A8\u5968\u3059\u308B\u8B66\u544A\uFF08\u300C\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u653B\u6483\u3092\u691C\u77E5 \u2014 \u5BC6\u544A\u3092\u63A8\u5968\u300D\u3001\u540C\u3058\u767A\u8A00\u3078\u306E\u7570\u306A\u308B\u65E2\u8AAD5\u679A\u306E\u8B66\u544A\u3001\u300C\u4E0D\u6B63\u306A\u53D7\u9818\u8A3C\u660E\u306E\u767A\u884C\u3092\u691C\u77E5 \u2014 \u5BC6\u544A\u3092\u63A8\u5968\u300D\u306A\u3069\uFF09\u304C\u51FA\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002",
    "recovery.operatorRpc.configured": "\u3053\u306E\u7AEF\u672B\u306E\u8A2D\u5B9A\u306B\u904B\u55B6\u306E\u30CE\u30FC\u30C9\uFF08{host}\uFF09\u304C\u7F6E\u304B\u308C\u3066\u3044\u307E\u3059\u3002\u30A6\u30A9\u30EC\u30C3\u30C8\u3082\u516C\u958B\u30CE\u30FC\u30C9\u3082\u7B54\u3048\u306A\u3044\u8AAD\u307F\u3067\u306F\u3001\u305D\u306E\u3064\u3069\u77E5\u3089\u305B\u305A\u306B\u904B\u55B6\u306E\u30CE\u30FC\u30C9\u306E\u5024\u3092\u4F7F\u3044\u307E\u3059\u3002\u904B\u55B6\u3092\u4FE1\u983C\u3059\u308B\u3053\u3068\u306F\u3001\u904B\u55B6\u3078\u306E\u4F9D\u5B58\u3092\u751F\u3080\u305F\u3081\u975E\u63A8\u5968\u3067\u3059\u3002\u3053\u306E\u7AEF\u672B\u306E\u8A2D\u5B9A\uFF08chatgameToolsConfig.operatorRpc\uFF09\u304B\u3089\u5916\u3059\u3068\u4F7F\u3044\u307E\u305B\u3093\u3002",
    "recovery.refresh": "\u66F4\u65B0",
    "recovery.refreshing": "\u30C1\u30A7\u30FC\u30F3\u304B\u3089\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u518D\u8AAD\u53D6\u4E2D\u2026",
    "recovery.refreshed": "\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u66F4\u65B0\uFF08\u30D5\u30A7\u30FC\u30BA: {phase} / grace: {grace}s\uFF09",
    "recovery.days": "\u65E5",
    "recovery.phaseName.waiting": "\u5F85\u6A5F",
    "recovery.phaseName.chatting": "\u30C1\u30E3\u30C3\u30C8\u671F\u9593",
    "recovery.phaseName.submitting": "\u63D0\u51FA\u671F\u9593",
    "recovery.phaseName.completed": "\u5B8C\u4E86",
    "recovery.phaseName.aggregating": "\u7D50\u679C\u96C6\u8A08",
    "recovery.phaseName.verification": "\u691C\u8A3C\u671F\u9593",
    "recovery.phaseName.claimable": "\u8ACB\u6C42\u671F\u9593",
    "recovery.phaseName.aggregatingWait": "\u7D50\u679C\u3092\u96C6\u8A08\u3057\u3066\u3044\u307E\u3059\u3002\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u63D0\u51FA\u306E\u5B8C\u4E86\u307E\u3067\u5C11\u3057\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002",
    "recovery.waiting.description": "\u30B0\u30EB\u30FC\u30D7\u304C\u78BA\u5B9A\u3057\u307E\u3057\u305F\u3002\u30C1\u30E3\u30C3\u30C8\u958B\u59CB\uFF08\u4E0A\u306E\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\uFF09\u307E\u3067\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002\u6295\u7968\u30FB\u5BC6\u544A\u306F\u30C1\u30E3\u30C3\u30C8\u671F\u9593\u4E2D\u306E\u307F\u8A2D\u5B9A\u3067\u304D\u307E\u3059\u3002",
    "recovery.connection.connected": "\u63A5\u7D9A\u6E08\u307F\uFF08\u30EA\u30EC\u30FC\uFF09",
    "recovery.connection.title": "\u63A5\u7D9A\u72B6\u614B",
    "recovery.connection.p2p": "P2P\u30EA\u30EC\u30FC\uFF08Nostr\uFF09",
    "recovery.connection.relayConnected": "{connected}/{total} \u63A5\u7D9A\u4E2D",
    "recovery.connection.p2pDescription": "\u30EA\u30EC\u30FC\u306F\u30B2\u30FC\u30E0\u30B5\u30FC\u30D0\u30FC\u304C\u691C\u95B2\u3055\u308C\u305F\u5834\u5408\u306E\u5197\u9577\u7D4C\u8DEF\u3067\u3059\u30021\u3064\u4EE5\u4E0A\u63A5\u7D9A\u3055\u308C\u3066\u3044\u308C\u3070\u3001\u3042\u306A\u305F\u306E\u767A\u8A00\u30FB\u6295\u7968\u30FB\u5BC6\u544A\u306F\u30B5\u30FC\u30D0\u30FC\u3092\u8FC2\u56DE\u3057\u3066\u30B0\u30EB\u30FC\u30D7\u5168\u54E1\u306B\u5C4A\u304D\u307E\u3059\u3002",
    "recovery.connection.settingsTitle": "\u30EA\u30EC\u30FC\u4E00\u89A7",
    "recovery.connection.settingsDesc": "\u72EC\u7ACB\u30EA\u30EC\u30FC\u3092\u8FFD\u52A0\uFF081\u884C1URL\uFF09\u2014 \u65E2\u5B9A\u30EA\u30EC\u30FC\u304C\u5168\u3066\u691C\u95B2\u3055\u308C\u305F\u6642\u306E\u552F\u4E00\u306E\u8131\u51FA\u8DEF\u3067\u3059\u3002",
    "recovery.status.connected": "\u63A5\u7D9A\u6E08\u307F",
    "recovery.status.connecting": "\u63A5\u7D9A\u4E2D",
    "recovery.status.disconnected": "\u5207\u65AD",
    "recovery.connection.connecting": "\u63A5\u7D9A\u4E2D\uFF08\u30EA\u30EC\u30FC\uFF09",
    "recovery.connection.disconnected": "\u5207\u65AD\uFF08\u30EA\u30EC\u30FC\uFF09",
    "recovery.members.depositPoints": "\u30ED\u30C3\u30AFPt",
    "recovery.members.depositPointsCorrected": "\u30C1\u30A7\u30FC\u30F3\u3067\u78BA\u304B\u3081\u305F\u5024\u306B\u76F4\u3057\u307E\u3057\u305F",
    "recovery.members.depositPointsUnverified": "\u672A\u78BA\u8A8D",
    "recovery.members.chars": "\u6587\u5B57",
    "recovery.members.times": "\u56DE",
    "recovery.members.voted": "\u6295\u7968\u6E08\u307F",
    "recovery.members.reported": "\u5BC6\u544A\u6E08\u307F",
    "recovery.members.invalidReadReceipt": "\u4E0D\u6B63\u306A\u53D7\u9818\u8A3C\u660E\u306E\u767A\u884C\u3092\u691C\u77E5 \u2014 \u5BC6\u544A\u3092\u63A8\u5968",
    "recovery.members.fraudulentReceipts": "{name}\u306F\u4E0D\u6B63\u306A\u53D7\u9818\u8A3C\u660E\u306E\u767A\u884C\u3092\u3057\u3066\u3001\u30B2\u30FC\u30E0\u306E\u59A8\u5BB3\u884C\u70BA\u3092\u3057\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u5BC6\u544A\u3092\u3059\u308B\u3053\u3068\u3092\u63A8\u5968\u3057\u307E\u3059\u3002",
    "recovery.members.suspiciousReporting": "{name}\u306F\u4E0D\u6B63\u306A\u5BC6\u544A\u884C\u70BA\u3092\u3057\u3066\u3044\u307E\u3059\u3002{name}\u3092\u5BC6\u544A\u3059\u308B\u3053\u3068\u3092\u63A8\u5968\u3057\u307E\u3059\u3002",
    "recovery.members.suspiciousReportingShort": "{name}\u306F\u4E0D\u6B63\u306A\u5BC6\u544A\u884C\u70BA\u3092\u3057\u3066\u3044\u307E\u3059\u3002",
    "recovery.action.reportRevealWarning": "\u5BC6\u544A\u5BFE\u8C61\u8981\u4EF6\uFF08\u6295\u7968\u306E\u78BA\u5B9A\uFF09\u3092\u6E80\u305F\u3057\u3066\u3044\u308B\u306E\u306F{A}\u3060\u3051\u306A\u306E\u3067\u3001{A}\u306B\u5BC6\u544A\u3092\u51FA\u3057\u3066\u3044\u308B\u3053\u3068\u304C\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u30D0\u30EC\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u7279\u306B{A}\u304B\u3089\u5BC6\u544A\u3092\u3055\u308C\u8FD4\u3055\u308C\u308B\u53EF\u80FD\u6027\u304C\u9AD8\u304F\u306A\u308A\u307E\u3059\u3002\u3053\u306E\u307E\u307E\u5BC6\u544A\u3092\u3057\u3066\u3082\u826F\u3044\u3067\u3059\u304B\uFF1F\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u6295\u7968\u304C\u78BA\u5B9A\u3057\u3066\u304B\u3089\u5BC6\u544A\u3059\u308B\u3053\u3068\u3092\u63A8\u5968\u3057\u307E\u3059\u3002",
    "recovery.action.reportRevealWarningLate": "\u5BC6\u544A\u5BFE\u8C61\u8981\u4EF6\uFF08\u6295\u7968\u306E\u78BA\u5B9A\uFF09\u3092\u6E80\u305F\u3057\u3066\u3044\u308B\u306E\u306F{A}\u3060\u3051\u306A\u306E\u3067\u3001{A}\u306B\u5BC6\u544A\u3092\u51FA\u3057\u3066\u3044\u308B\u3053\u3068\u304C\u4ED6\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u30D0\u30EC\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u7279\u306B{A}\u304B\u3089\u5BC6\u544A\u3092\u3055\u308C\u8FD4\u3055\u308C\u308B\u53EF\u80FD\u6027\u304C\u9AD8\u304F\u306A\u308A\u307E\u3059\u3002\u3053\u306E\u307E\u307E\u5BC6\u544A\u3092\u3057\u3066\u3082\u826F\u3044\u3067\u3059\u304B\uFF1F",
    "recovery.action.reportRevealProceed": "\u5BC6\u544A\u3059\u308B",
    "recovery.action.reportRevealCancel": "\u3084\u3081\u308B",
    "recovery.members.invalidReadReceiptTip": "\u3053\u308C\u306F\u5BC6\u544A\u306E\u63A8\u5968\u306B\u3059\u304E\u305A\u3001\u5B9F\u969B\u306E\u5BC6\u544A\u306B\u306F\u672C\u4EBA\u306E\u7F72\u540D\u30A2\u30AF\u30B7\u30E7\u30F3\u3068\u901A\u5E38\u306E\u8981\u4EF6\uFF082\u4EBA\u4EE5\u4E0A\uFF0B\u30DD\u30A4\u30F3\u30C8\u8D85\u904E\uFF09\u304C\u5FC5\u8981\u3067\u3059\u3002",
    "recovery.members.multipleSessionsWarning": "\u8907\u6570\u753B\u9762\u3067\u306E\u540C\u6642\u53C2\u52A0\u304C\u691C\u51FA\u3055\u308C\u307E\u3057\u305F\u3002\u8907\u6570\u7AEF\u672B\u3001\u8907\u6570\u30BF\u30D6\u3067\u306E\u540C\u6642\u53C2\u52A0\u304C\u7D9A\u304F\u3068\u3001Bot\u3068\u307F\u306A\u3055\u308C\u4ED6\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u5BC6\u544A\u3092\u63A8\u5968\u3059\u308B\u8B66\u544A\u304C\u51FA\u3055\u308C\u308B\u306E\u3067\u4E00\u3064\u306E\u753B\u9762\u3067\u53C2\u52A0\u3059\u308B\u3088\u3046\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u3069\u3061\u3089\u304B\u3092\u9078\u3076\u307E\u3067\u3001\u3053\u306E\u753B\u9762\u306F\u96E2\u5E2D\u3068\u540C\u3058\u6271\u3044\u306B\u306A\u308A\u3001\u65E2\u8AAD\u3092\u51FA\u3057\u307E\u305B\u3093\u3002",
    "recovery.session.resume": "\u4ED6\u306E\u7AEF\u672B\u30FB\u30BF\u30D6\u3092\u7D42\u4E86\u3057\u305F\u306E\u3067\u3001\u3053\u306E\u30BF\u30D6\u3067\u518D\u958B\u3059\u308B",
    "recovery.session.close": "\u3053\u306E\u30BF\u30D6\u3092\u7D42\u4E86\u3059\u308B",
    "recovery.session.ended": "\u3053\u306E\u30BF\u30D6\u306F\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\u7D9A\u3051\u308B\u306B\u306F\u3001\u4F7F\u3063\u3066\u3044\u308B\u7AEF\u672B\u306E\u753B\u9762\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002\u3053\u306E\u30BF\u30D6\u3092\u518D\u8AAD\u307F\u8FBC\u307F\u3059\u308B\u3068\u3001\u3053\u306E\u30BF\u30D6\u3067\u53C2\u52A0\u3092\u518D\u958B\u3067\u304D\u307E\u3059\u3002",
    "recovery.import.title": "\u516C\u5F0F\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u306E localStorage \u3092\u53D6\u308A\u8FBC\u3080",
    "recovery.import.description": "\u516C\u5F0F\u30B2\u30FC\u30E0\u753B\u9762\u3067\u958B\u767A\u8005\u30C4\u30FC\u30EB\u306E Console \u3092\u958B\u304D\u3001\u4E0B\u306E\u30B3\u30FC\u30C9\u3092\u5B9F\u884C\u3057\u3066 JSON \u3092\u30B3\u30D4\u30FC\u3057\u307E\u3059\u3002\u516C\u5F0F\u753B\u9762\u3092\u9589\u3058\u305F\u5F8C\u3001\u3053\u306E\u753B\u9762\u306E\u300C{signLabel}\u300D\u3092\u62BC\u3057\u3001\u30B3\u30D4\u30FC\u3057\u305F JSON \u3092\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u30FB\u7D44\u30FB\u672C\u4EBA\u306E\u30C7\u30FC\u30BF\u3060\u3051\u3092\u4F7F\u3044\u3001\u7F72\u540D\u3092\u691C\u8A3C\u3057\u307E\u3059\u3002\u767A\u8A00\u306F\u516C\u958B live \u3068\u30EA\u30EC\u30FC\u304B\u3089\u53D6\u5F97\u3057\u307E\u3059\u3002\u518D\u8AAD\u307F\u8FBC\u307F\u5F8C\u306E\u8868\u793A\u3068\u7D44\u307F\u76F4\u3059\u63D0\u51FA\u7269\u306B\u306F\u3001\u53D6\u308A\u8FBC\u3093\u3060\u6295\u7968\u30FB\u5BC6\u544A\u306F\u623B\u308A\u307E\u305B\u3093\u3002\u518D\u5EA6\u8CBC\u308A\u76F4\u3059\u304B\u3001\u53D6\u308A\u8FBC\u3093\u3060\u516C\u5F0F\u306E\u63D0\u51FA\u30D0\u30A4\u30C8\u5217\u3092 Evidence \u6551\u6E08\u30DC\u30BF\u30F3\u3067\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.import.button": "\u4FDD\u5B58\u3057\u305F\u30B2\u30FC\u30E0\u30C7\u30FC\u30BF\u3092\u53D6\u308A\u8FBC\u3080",
    "recovery.import.wait": "\u5148\u306B Sign & load \u3067\u78BA\u5B9A\u540D\u7C3F\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002",
    "recovery.import.done": "\u691C\u8A3C\u6E08\u307F\u4FDD\u5B58\u30C7\u30FC\u30BF\u3092\u53D6\u308A\u8FBC\u307F\u307E\u3057\u305F\uFF08\u53D7\u9818\u8A3C\u660E {receipts} \u4EF6\uFF09\u3002",
    "recovery.import.failed": "\u53D6\u308A\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F",
    "recovery.members.viewOnX": "X\u3092\u898B\u308B",
    "recovery.members.playerNumber": "\u30D7\u30EC\u30A4\u30E4\u30FC{n}",
    "recovery.members.online": "\u30A2\u30AF\u30C6\u30A3\u30D6",
    "recovery.members.offline": "\u6700\u8FD1\u306E\u6D3B\u52D5\u306A\u3057",
    "recovery.members.activityTip": "\u30EA\u30EC\u30FC\u3067\u53D7\u4FE1\u3057\u305F\u7F72\u540D\u6E08\u307F\u30C1\u30E3\u30C3\u30C8/\u53D7\u9818\u8A3C\u660E\u306E\u6700\u65B0\u6642\u523B\u304B\u3089\u5224\u5B9A\u3057\u3066\u3044\u307E\u3059\u3002\u30D7\u30EC\u30BC\u30F3\u30B9\uFF08\u5728\u5E2D\u901A\u77E5\uFF09\u306E\u4ED5\u7D44\u307F\u304C\u7121\u3044\u305F\u3081\u3001\u7121\u8A00\u3068\u30AA\u30D5\u30E9\u30A4\u30F3\u306F\u533A\u5225\u3067\u304D\u307E\u305B\u3093\u3002",
    "recovery.action.voteTitle": "\u30E1\u30F3\u30D0\u30FC\u306B\u6295\u7968(\u5FC5\u9808)",
    "recovery.action.voteProgressTurns": "\u6295\u7968\u3092\u3059\u308B\u3068\u3001\u305D\u308C\u4EE5\u964D\u306F\u65E2\u8AAD\u304C\u3064\u3051\u3066\u3082\u3089\u3044\u306B\u304F\u304F\u306A\u308A\u3001\u4F1A\u8A71\u6570{minMessages}\u304C\u9054\u6210\u3057\u306B\u304F\u304F\u306A\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u4F1A\u8A71\u6570{minMessages}\u3092\u9054\u6210\u3057\u3066\u304B\u3089\u6295\u7968\u3059\u308B\u3053\u3068\u3092\u304A\u3059\u3059\u3081\u3057\u307E\u3059\u3002",
    "recovery.action.voteProgressChars": "\u6295\u7968\u3092\u3059\u308B\u3068\u3001\u305D\u308C\u4EE5\u964D\u306F\u65E2\u8AAD\u304C\u3064\u3051\u3066\u3082\u3089\u3044\u306B\u304F\u304F\u306A\u308A\u3001\u6700\u4F4E\u6587\u5B57\u6570\uFF08\u534A\u89D2{minChars}\u6587\u5B57\uFF09\u304C\u9054\u6210\u3057\u306B\u304F\u304F\u306A\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u6700\u4F4E\u6587\u5B57\u6570\u3092\u9054\u6210\u3057\u3066\u304B\u3089\u6295\u7968\u3059\u308B\u3053\u3068\u3092\u304A\u3059\u3059\u3081\u3057\u307E\u3059\u3002",
    "recovery.action.voteProgressProceed": "\u6295\u7968\u3059\u308B",
    "recovery.action.voteProgressBack": "\u623B\u308B",
    "recovery.action.deadlineVoteNotice": "\u6295\u7968\u3082\u30C1\u30E3\u30C3\u30C8\u540C\u69D8\u306B\u4ED6\u30E1\u30F3\u30D0\u30FC\u306E\u65E2\u8AAD\u304C\u306A\u3051\u308C\u3070\u6709\u52B9\u306B\u306A\u308A\u307E\u305B\u3093\u3002\u6709\u52B9\u306A\u6295\u7968\u304C\u306A\u3051\u308C\u3070\u5931\u683C\u3068\u306A\u308A\u307E\u3059\u3002\u4ED6\u306E\u30E1\u30F3\u30D0\u30FC\u306E\u65E2\u8AAD\u304C\u3064\u304F\u3088\u3046\u306B\u3001\u6642\u9593\u306B\u4F59\u88D5\u3092\u6301\u3063\u3066\u6295\u7968\u3059\u308B\u3088\u3046\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.action.deadlineVoteReceiptNotice": "\u30E9\u30B9\u30C810\u5206\u306F\u6295\u7968\u306B\u65E2\u8AAD\u304C\u3064\u304D\u307E\u305B\u3093\u3002\u306A\u306E\u3067{time}\u307E\u3067\u306B\u65E2\u8AAD\u3092\u5F97\u308B\u3088\u3046\u306B\u4F59\u88D5\u3092\u3082\u3063\u3066\u6295\u7968\u3092\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.action.votingClosed": "\u6295\u7968\u306F\u7DE0\u3081\u5207\u3089\u308C\u307E\u3057\u305F\u3002",
    "recovery.action.noticeClose": "\u9589\u3058\u308B",
    "recovery.action.receiptNotice": "\u6295\u7968\u30FB\u5BC6\u544A\u306F\u3001\u4ED6\u306E\u30E1\u30F3\u30D0\u30FC\u306E\u65E2\u8AAD\uFF08\u53D7\u9818\uFF09\u304C\u3064\u304F\u307E\u3067\u6709\u52B9\u306B\u306A\u308A\u307E\u305B\u3093\u3002\u53D7\u9818\u3092\u78BA\u8A8D\u3059\u308B\u307E\u3067\u3001\u3053\u306E\u753B\u9762\u3092\u9589\u3058\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002",
    "recovery.action.voteDescription": "\u5FC5\u305A\u30E1\u30F3\u30D0\u30FC1\u4EBA\u306B\u6295\u7968\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u6295\u7968\u3055\u308C\u305F\u4EBA\u306B\u306F\u3042\u306A\u305F\u306E\u30ED\u30C3\u30AFPt\u3068\u540C\u984D\u306E\u6295\u7968Pt\u304C\u5165\u308A\u307E\u3059\u3002",
    "recovery.action.reportTitle": "\u30E1\u30F3\u30D0\u30FC\u3092\u5BC6\u544A",
    "recovery.action.reportDescription": "AI\u3084Bot\u3060\u3068\u601D\u3046\u30E1\u30F3\u30D0\u30FC\u304C\u3044\u305F\u3089\u5BC6\u544A\u3057\u307E\u3057\u3087\u3046\uFF08\u6700\u5927\uFF12\u540D\uFF09\u3002\u6295\u7968\u304C\u78BA\u5B9A\u3057\u305F\uFF08\u81EA\u5206\u3068\u76F8\u624B\u4EE5\u5916\u306E\u30E1\u30F3\u30D0\u30FC\u306E\u65E2\u8AAD\u304C\u3064\u3044\u305F\uFF09\u76F8\u624B\u306B\u3001\u305D\u306E\u6295\u7968\u306E\u5F8C\u3067\u5BC6\u544A\u3067\u304D\u307E\u3059\u3002\u30E9\u30B9\u30C810\u5206\u306F\u8AB0\u306B\u3067\u3082\u5BC6\u544A\u3067\u304D\u307E\u3059\u304C\u3001\u6295\u7968\u304C\u78BA\u5B9A\u3057\u3066\u3044\u306A\u3044\u76F8\u624B\u3078\u306E\u5BC6\u544A\u306F\u7121\u52B9\u3067\u3059\u3002",
    "recovery.action.voteConfirm": "{name}\u306B\u6295\u7968\u3057\u307E\u3059\u3002\u4E00\u5EA6\u6295\u7968\u3059\u308B\u3068\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002\u672A\u8AAD\u3067\u7121\u52B9\u306B\u306A\u3063\u305F\u3068\u3057\u3066\u3082\u3001\u6295\u7968\u5148\u3092\u5909\u66F4\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F",
    "recovery.action.voteSuccess": "\u6295\u7968\u3092\u6697\u53F7\u5316\u3055\u308C\u305F\u72B6\u614B\u3067\u63D0\u51FA\u3057\u307E\u3057\u305F\u3002",
    "recovery.action.reportConfirm": "{name}\u3092\u5BC6\u544A\u3057\u307E\u3059\u3002\u4E00\u5EA6\u5BC6\u544A\u3059\u308B\u3068\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F",
    "recovery.action.reportSuccess": "\u5BC6\u544A\u3092\u6697\u53F7\u5316\u3055\u308C\u305F\u72B6\u614B\u3067\u63D0\u51FA\u3057\u307E\u3057\u305F\u3002",
    "recovery.sameDeviceBand.reportGround": "\u3053\u306E\u7AEF\u672B\u3067\u63D0\u51FA\u307E\u3067\u5B8C\u4E86\u3059\u308B\u3053\u3068\u3092\u63A8\u5968\u3057\u307E\u3059\u3002\u7AEF\u672B\u30FB\u30D6\u30E9\u30A6\u30B6\u3092\u5909\u66F4\u3059\u308B\u3068\u5BC6\u544A\u304C\u6B63\u5F53\u306B\u53D7\u7406\u3055\u308C\u308B\u4FDD\u8A3C\u3092\u5931\u3044\u307E\u3059\u3002",
    "recovery.sameDeviceBand.conversationMemory": "\u3053\u306E\u30DA\u30FC\u30B8\u3092\u9589\u3058\u305A\u306B\u3001\u3053\u306E\u7AEF\u672B\u3067\u63D0\u51FA\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u4ED6\u306E\u7AEF\u672B\u3084\u958B\u304D\u76F4\u3057\u305F\u753B\u9762\u3067\u306F\u4F1A\u8A71\u306E\u8A18\u9332\u306E\u4E00\u90E8\u3092\u5931\u3044\u3001\u4F1A\u8A71\u6570\u304C20\u306B\u5C4A\u304B\u306A\u304F\u306A\u308A\u307E\u3059\u3002",
    "recovery.sameDeviceBand.switchClient": "\u516C\u5F0F\u306E\u753B\u9762\u3068\u5FA9\u5143\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u306E\u9593\u3067\u79FB\u308B\u3068\u304D\u3082\u3001\u3053\u306E\u7AEF\u672B\u306E\u8A18\u61B6\uFF08\u5BC6\u544A\u306E\u6839\u62E0\u306A\u3069\uFF09\u306E\u4E00\u90E8\u3092\u5931\u3046\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002",
    "recovery.sameDeviceBand.reportGroundSaveFailed": "\u5BC6\u544A\u306E\u6839\u62E0\u3092\u3053\u306E\u7AEF\u672B\u306B\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u30DA\u30FC\u30B8\u3092\u9589\u3058\u305F\u308A\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u305F\u308A\u305B\u305A\u3001\u3053\u306E\u753B\u9762\u306E\u307E\u307E\u63D0\u51FA\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.action.deadlineWarning": "\u26A0 \u6295\u7968\u306F\u30C1\u30E3\u30C3\u30C8\u7D42\u4E86\u306E10\u5206\u524D\u307E\u3067\u3001\u5BC6\u544A\u306F\u30C1\u30E3\u30C3\u30C8\u671F\u9593\u4E2D\u306E\u307F\u8A2D\u5B9A\u3067\u304D\u307E\u3059\uFF08\u672A\u6295\u7968\u306F\u5931\u683C\u306B\u306A\u308A\u307E\u3059\uFF09\u3002\u767A\u4FE1\u5F8C\u306E\u5909\u66F4\u30FB\u53D6\u6D88\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
    "recovery.chat.charCount": "\u6587\u5B57\u6570",
    "recovery.chat.minCharProgress": "\u5FC5\u9808\u6587\u5B57\u6570",
    "recovery.chat.maxCharProgress": "\u6587\u5B57\u9001\u4FE1\u4E0A\u9650",
    "recovery.chat.minTurnProgress": "\u5FC5\u9808\u4F1A\u8A71\u6570",
    "recovery.chat.futureMessages": "\u672A\u6765\u306E\u6642\u523B\u3067\u306E\u767A\u8A00: {count}\u4EF6",
    "recovery.chat.futureActions": "\u672A\u6765\u306E\u6642\u523B\u3067\u306E\u6295\u7968\u30FB\u5BC6\u544A: {count}\u4EF6",
    "recovery.chat.priorityNotReady": "\u540D\u7C3F\u3068\u30C1\u30E3\u30C3\u30C8\u7A93\u304C\u30C1\u30A7\u30FC\u30F3\u3067\u78BA\u5B9A\u3059\u308B\u307E\u3067\u3001\u6700\u512A\u5148\u6B04\u3067\u5B88\u3089\u308C\u308B\u4F1A\u8A71\u6570\u306F0\u3068\u8868\u793A\u3057\u307E\u3059\uFF08\u78BA\u5B9A\u3059\u308B\u3068\u8868\u793A\u304C\u5909\u308F\u308A\u307E\u3059\uFF09\u3002",
    "recovery.chat.priorityPlanFailed": "\u6700\u512A\u5148\u6B04\u306E\u8A08\u753B\u3092\u7D44\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u6700\u512A\u5148\u6B04\u3067\u5B88\u3089\u308C\u308B\u4F1A\u8A71\u6570\u306F0\u3068\u8868\u793A\u3057\u307E\u3059\u3002",
    "recovery.chat.maxPostProgress": "\u767A\u8A00\u9001\u4FE1\u4E0A\u9650",
    "recovery.chat.capRemaining": "\u6B8B\u308A",
    "recovery.chat.msgCount": "\u767A\u8A00\u56DE\u6570",
    "recovery.chat.send": "\u9001\u4FE1",
    "recovery.chat.historyLoading": "\u5C65\u6B74\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D",
    "recovery.chat.ownHistoryPrompt": "\u307E\u3060\u30C7\u30FC\u30BF\u306E\u53D6\u308A\u8FBC\u307F\u304C\u5B8C\u4E86\u3057\u3066\u3044\u306A\u3044\u305F\u3081\u3001\u4F1A\u8A71\u306E\u5C65\u6B74/\u6587\u5B57\u6570/\u767A\u8A00\u6570\u304C\u4E0D\u5B8C\u5168\u3067\u3042\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u53D6\u308A\u8FBC\u307F\u306E\u5B8C\u4E86\u3092\u5F85\u6A5F\u3057\u307E\u3059\u304B\uFF1F\u3000\u305D\u308C\u3068\u3082\u6587\u5B57\u6570\u3084\u767A\u8A00\u6570\u306E\u4E0A\u9650\u306B\u6C17\u3092\u3064\u3051\u3066\u30C1\u30E3\u30C3\u30C8\u3092\u958B\u59CB\u3057\u307E\u3059\u304B\uFF1F",
    "recovery.chat.ownHistoryWaitingRelays": "\u8AAD\u307F\u8FBC\u307F\u3092\u5F85\u3063\u3066\u3044\u308B\u30EA\u30EC\u30FC: {relays}",
    "recovery.chat.ownHistoryWait": "\u5F85\u6A5F\u3059\u308B",
    "recovery.chat.ownHistoryStart": "\u6587\u5B57\u6570\u3084\u767A\u8A00\u6570\u306E\u4E0A\u9650\u306B\u6C17\u3092\u3064\u3051\u3066\u30C1\u30E3\u30C3\u30C8\u3092\u958B\u59CB\u3059\u308B",
    "recovery.chat.inputPlaceholder": "\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u5165\u529B...",
    "recovery.chat.minCharsRemaining": "\u5FC5\u9808\u6587\u5B57\u6570\u307E\u3067\u3042\u3068",
    "recovery.chat.minCharsReached": "\u5FC5\u9808\u6587\u5B57\u6570\u30AF\u30EA\u30A2",
    "recovery.chat.maxCharsReached": "\u3053\u306E\u767A\u8A00\u306F\u9001\u4FE1\u6587\u5B57\u6570\u306E\u4E0A\u9650\u3092\u8D85\u3048\u308B\u305F\u3081\u9001\u308C\u307E\u305B\u3093",
    "recovery.chat.turnCount": "\u4F1A\u8A71\u56DE\u6570",
    "recovery.chat.minMsgsRemaining": "\u5FC5\u9808\u4F1A\u8A71\u6570\u307E\u3067\u3042\u3068",
    "recovery.chat.minMsgsReached": "\u5FC5\u9808\u4F1A\u8A71\u6570\u30AF\u30EA\u30A2",
    "recovery.chat.maxMsgsReached": "\u767A\u8A00\u56DE\u6570\u4E0A\u9650\u306B\u9054\u3057\u307E\u3057\u305F",
    // P-2026-0844: 送信ゲート（本体 ChatPhase の game.chat.msgTooLong に相当）
    "recovery.chat.msgTooLong": "1\u30E1\u30C3\u30BB\u30FC\u30B8\u306E\u4E0A\u9650\uFF08\u534A\u89D2{max}\u6587\u5B57\uFF09\u3092\u8D85\u3048\u3066\u3044\u307E\u3059\u3002\u3053\u306E\u307E\u307E\u9001\u3063\u3066\u3082\u63A1\u70B9\u3067\u306F\u4E38\u3054\u3068\u9664\u5916\u3055\u308C\u307E\u3059 \u2014 \u5206\u5272\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.chat.invisibleOnly": "\u53EF\u8996\u6587\u5B57\u304C\u7121\u3044\u305F\u3081\u9001\u4FE1\u3067\u304D\u307E\u305B\u3093\uFF08\u63A1\u70B9\u3067\u3082\u6570\u3048\u3089\u308C\u307E\u305B\u3093\uFF09\u3002",
    "recovery.chat.voteStatus": "\u6295\u7968",
    "recovery.chat.voteDone": "\u5B8C\u4E86",
    "recovery.chat.voteNotYet": "\u307E\u3060",
    "recovery.chat.votePending": "\u6295\u7968\u3057\u3066\u304F\u3060\u3055\u3044",
    "recovery.chat.voteCleared": "\u6295\u7968\u30AF\u30EA\u30A2",
    "recovery.chat.voteAwaitingReceipt": "\u53D7\u9818\u5F85\u3061\uFF08\u4ED6\u30E1\u30F3\u30D0\u30FC\u306E\u53D7\u4FE1\u3067\u78BA\u5B9A\uFF09",
    "recovery.chat.readBadge": "\u65E2\u8AAD{count}",
    "recovery.chat.idleOverlay": "10\u5206\u9593\u3001\u64CD\u4F5C\u304C\u691C\u77E5\u3055\u308C\u306A\u304B\u3063\u305F\u305F\u3081\u30AA\u30D5\u30E9\u30A4\u30F3\u72B6\u614B\u3068\u306A\u308A\u307E\u3059\u3002\u3053\u306E\u72B6\u614B\u3067\u306F\u53D7\u4FE1\u3057\u305F\u30E1\u30C3\u30BB\u30FC\u30B8\u306B\u65E2\u8AAD\u306F\u3064\u3051\u307E\u305B\u3093\u3002",
    "recovery.chat.unreadBadge": "\u672A\u8AAD",
    "recovery.chat.voidBadge": "\u7121\u52B9",
    "recovery.chat.bubbleVote": "\u6295\u7968",
    "recovery.chat.bubbleReport": "\u5BC6\u544A({nth}\u56DE\u76EE)",
    "recovery.action.voteResendConfirm": "\u524D\u56DE\u306E\u6295\u7968\u306F10\u5206\u9593\u8AB0\u306B\u3082\u53D7\u4FE1\u3055\u308C\u305A\u7121\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\u3002\u540C\u3058\u76F8\u624B\u306E{name}\u306B\u518D\u9001\u3057\u307E\u3059\u304B\uFF1F",
    "recovery.action.reportResendConfirm": "\u524D\u56DE\u306E\u5BC6\u544A\u306F10\u5206\u9593\u8AB0\u306B\u3082\u53D7\u4FE1\u3055\u308C\u305A\u7121\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\u3002\u540C\u3058\u76F8\u624B\u306E{name}\u306B\u518D\u9001\u3057\u307E\u3059\u304B\uFF1F",
    "recovery.action.resendLabel": "\u518D\u9001",
    // J-35（§6.9 追補・規則版数2）: 密告の資格要件が未達（残り件数）
    "recovery.action.reportNeedsReads": "\u3042\u3068{count}\u4EF6\u306E\u767A\u8A00\u304C\u5FC5\u8981",
    "recovery.action.voteVoidResend": "\u6295\u7968\u304C\u7121\u52B9\u306B\u306A\u308A\u307E\u3057\u305F\uFF0810\u5206\u9593\u672A\u53D7\u4FE1\uFF09\u3002\u540C\u3058\u76F8\u624B\u306B\u518D\u9001\u3057\u3066\u304F\u3060\u3055\u3044",
    "recovery.action.voteVoidNoResend": "\u7DE0\u5207\u307E\u3067\u306B\u65E2\u8AAD\u304C\u5C4A\u304B\u306A\u304B\u3063\u305F\u306E\u3067\u518D\u9001\u3067\u304D\u307E\u305B\u3093",
    "recovery.action.reportWaitingVote": "\u6295\u7968\u306E\u78BA\u5B9A\u5F85\u3061",
    "recovery.action.reportVoteNotVisible": "\u6295\u7968\u304C\u898B\u3048\u3066\u3044\u307E\u305B\u3093\uFF08\u76F8\u624B\u304C\u6295\u7968\u3057\u3066\u3044\u306A\u3051\u308C\u3070\u3053\u306E\u5BC6\u544A\u306F\u7121\u52B9\u3067\u3059\uFF09",
    "recovery.completedMsg": "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u30B2\u30FC\u30E0\u306F\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002",
    "recovery.entryWait": "\u30B2\u30FC\u30E0\u958B\u59CB\u524D\u3067\u3059\uFF08\u30A8\u30F3\u30C8\u30EA\u30FC\u671F\u9593\uFF09\u3002\u958B\u59CB\u307E\u3067\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002",
    "recovery.relaySettings": "\u30EA\u30EC\u30FC\u8A2D\u5B9A\uFF08\u72EC\u7ACB\u30EA\u30EC\u30FC\u306E\u8FFD\u52A0\u304C\u552F\u4E00\u306E\u8131\u51FA\u8DEF\uFF09",
    "recovery.warn.applicantHashRegistrationCount": "\u8B66\u544A: applicantHash \u306E\u767B\u9332\u56DE\u6570\u306F {registrationCount} \u56DE\u3067\u3059\uFF08\u671F\u5F85\u5024\u306F1\u56DE\uFF09\u3002\u5DEE\u3057\u66FF\u3048\u306F\u30AA\u30F3\u30C1\u30A7\u30FC\u30F3\u3067\u53EF\u8996\u306E\u307E\u307E\u3001\u30EA\u30AB\u30D0\u30EA\u3092\u7D9A\u884C\u3057\u307E\u3059\u3002",
    "recovery.warn.anchoredRosterFallback.previousSummaryMismatch": "\u30C1\u30A7\u30FC\u30F3\u306B\u9328\u3065\u3051\u3089\u308C\u305F\u524D\u30D6\u30ED\u30C3\u30AF\u7D50\u679C\u3068\u516C\u958B\u6210\u679C\u7269\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002\u30B2\u30FC\u30E0\u304C\u4F7F\u7528\u3057\u305F\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3078\u5207\u308A\u66FF\u3048\u3066\u3044\u307E\u3059\u3002",
    "recovery.warn.anchoredRosterFallback.previousSummaryUnavailable": "\u524D\u30D6\u30ED\u30C3\u30AF\u306E\u7D50\u679C\u6210\u679C\u7269\u307E\u305F\u306F\u30C1\u30A7\u30FC\u30F3\u9328\u3092\u8AAD\u307F\u53D6\u308C\u307E\u305B\u3093\u3002\u72EC\u7ACB\u691C\u8A3C\u3067\u304D\u305F\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3078\u5207\u308A\u66FF\u3048\u3066\u3044\u307E\u3059\u3002",
    "recovery.warn.anchoredRosterFallback.previousSummaryInvalid": "\u524D\u30D6\u30ED\u30C3\u30AF\u306E\u7D50\u679C\u6210\u679C\u7269\u304C\u4E0D\u6B63\u3067\u7D44\u5206\u3051\u3092\u518D\u69CB\u6210\u3067\u304D\u307E\u305B\u3093\u3002\u72EC\u7ACB\u691C\u8A3C\u3067\u304D\u305F\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3078\u5207\u308A\u66FF\u3048\u3066\u3044\u307E\u3059\u3002",
    "recovery.warn.anchoredRosterFallback.publishedGroupsUnavailable": "\u516C\u958B game_groups.json \u3092\u8AAD\u307F\u53D6\u308C\u307E\u305B\u3093\u3002\u72EC\u7ACB\u691C\u8A3C\u3067\u304D\u305F\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3078\u5207\u308A\u66FF\u3048\u3066\u3044\u307E\u3059\u3002",
    "recovery.warn.anchoredRosterFallback.publishedGroupsMismatch": "\u516C\u958B game_groups.json \u304C\u3001\u30B3\u30DF\u30C3\u30C8\u6E08\u307F\u5165\u529B\u304B\u3089\u518D\u69CB\u6210\u3057\u305F\u7D44\u5206\u3051\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002\u72EC\u7ACB\u691C\u8A3C\u3067\u304D\u305F\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3078\u5207\u308A\u66FF\u3048\u3066\u3044\u307E\u3059\u3002",
    "recovery.warn.anchoredRosterFallback.unknown": "\u7D44\u5206\u3051\u306E\u518D\u69CB\u6210\u3092\u691C\u8A3C\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08{reason}\uFF09\u3002\u72EC\u7ACB\u691C\u8A3C\u3067\u304D\u305F\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3078\u5207\u308A\u66FF\u3048\u3066\u3044\u307E\u3059\u3002",
    "recovery.warn.rosterReconstructionStop.previousSummaryUnavailable": "\u524D\u30D6\u30ED\u30C3\u30AF\u306E\u7D50\u679C\u6210\u679C\u7269\u307E\u305F\u306F\u30C1\u30A7\u30FC\u30F3\u9328\u3092\u8AAD\u307F\u53D6\u308C\u307E\u305B\u3093\u3002\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3082\u691C\u8A3C\u3067\u304D\u306A\u3044\u305F\u3081\u5FA9\u5143\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterReconstructionStop.previousSummaryMismatch": "\u524D\u30D6\u30ED\u30C3\u30AF\u306E\u7D50\u679C\u6210\u679C\u7269\u304C\u30C1\u30A7\u30FC\u30F3\u9328\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3082\u691C\u8A3C\u3067\u304D\u306A\u3044\u305F\u3081\u5FA9\u5143\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterReconstructionStop.previousSummaryInvalid": "\u524D\u30D6\u30ED\u30C3\u30AF\u306E\u7D50\u679C\u6210\u679C\u7269\u304C\u4E0D\u6B63\u3067\u3059\u3002\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3082\u691C\u8A3C\u3067\u304D\u306A\u3044\u305F\u3081\u5FA9\u5143\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterReconstructionStop.unknown": "\u7D44\u5206\u3051\u306E\u518D\u69CB\u6210\u3092\u691C\u8A3C\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08{reason}\uFF09\u3002\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3082\u691C\u8A3C\u3067\u304D\u306A\u3044\u305F\u3081\u5FA9\u5143\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterAnchorEvidence": "\u6B63\u5178\u306E\u540D\u7C3F\u767B\u9332\u884C: hash {rosterAnchorHash}\u3001\u6DFB\u5B57 {rosterAnchorIndex}\u3002",
    "recovery.warn.rosterRecomputedHash": "\u518D\u8A08\u7B97\u3057\u305F\u540D\u7C3F manifest \u306E hash: {recomputedHash}\u3002",
    "recovery.warn.rosterConflict": "\u30C1\u30A7\u30FC\u30F3\u9328\u3065\u3051\u6E08\u307F\u540D\u7C3F\u3068\u73FE\u5728\u306E\u5F53\u9078\u8005\u304B\u3089\u306E\u518D\u69CB\u6210\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002\u3053\u306E\u98DF\u3044\u9055\u3044\u3060\u3051\u3067\u306F\u3001\u3069\u3061\u3089\u304C\u8AA4\u3063\u3066\u3044\u308B\u304B\u306F\u65AD\u5B9A\u3067\u304D\u307E\u305B\u3093\u3002",
    "recovery.warn.recomputedRosterFallback.canonicalMatch": "\u516C\u958B\u540D\u7C3F\u30D5\u30A1\u30A4\u30EB\u3092\u691C\u8A3C\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08{anchorError}\uFF09\u3002\u518D\u8A08\u7B97\u3057\u305F\u540D\u7C3F manifest \u304C\u30C1\u30A7\u30FC\u30F3\u4E0A\u306E\u6B63\u5178\u30CF\u30C3\u30B7\u30E5\u3068\u4E00\u81F4\u3057\u305F\u305F\u3081\u3001\u7167\u5408\u6E08\u307F\u306E\u7D44\u3092\u4F7F\u7528\u3057\u307E\u3059\u3002",
    "recovery.warn.recomputedRosterFallback.legacyMatch": "\u516C\u958B\u540D\u7C3F\u30D5\u30A1\u30A4\u30EB\u3092\u691C\u8A3C\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08{anchorError}\uFF09\u3002\u518D\u8A08\u7B97\u3057\u305F\u540D\u7C3F manifest \u304C\u30C1\u30A7\u30FC\u30F3\u4E0A\u306E\u73FE\u5728\u306E\u30CF\u30C3\u30B7\u30E5\u3068\u4E00\u81F4\u3057\u305F\u305F\u3081\u3001\u7167\u5408\u6E08\u307F\u306E\u7D44\u3092\u4F7F\u7528\u3057\u307E\u3059\u3002",
    "recovery.warn.anchorError.unavailable": "\u8AAD\u3081\u306A\u3044\u30D5\u30A1\u30A4\u30EB\u304B\u30C1\u30A7\u30FC\u30F3\u306E\u767B\u9332\u304C\u3042\u308A\u307E\u3059",
    "recovery.warn.anchorError.invalid": "\u5F62\u306E\u6B63\u3057\u304F\u306A\u3044\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308A\u307E\u3059",
    "recovery.warn.anchorError.mismatch": "\u30D5\u30A1\u30A4\u30EB\u304C\u30C1\u30A7\u30FC\u30F3\u306E\u767B\u9332\u304B\u9078\u51FA\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093",
    "recovery.warn.anchorError.unknown": "\u7406\u7531\u306F\u8868\u793A\u3057\u307E\u305B\u3093",
    "recovery.warn.rosterVerificationFailed": "\u540D\u7C3F\u3092\u691C\u8A3C\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u7D44\u3078\u53C2\u52A0\u3059\u308B\u524D\u306B\u5FA9\u5143\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterMismatchStop": "\u518D\u8A08\u7B97\u3057\u305F\u540D\u7C3F manifest \u304C\u30C1\u30A7\u30FC\u30F3\u4E0A\u306E\u6B63\u5178\u30CF\u30C3\u30B7\u30E5\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002\u7D44\u3078\u53C2\u52A0\u3059\u308B\u524D\u306B\u5FA9\u5143\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterAbsentStop": "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306B\u6B63\u5178\u306E\u540D\u7C3F\u767B\u9332\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u7D44\u3078\u53C2\u52A0\u3059\u308B\u524D\u306B\u5FA9\u5143\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterPending": "\u6B63\u5178\u540D\u7C3F\u306E\u767B\u9332\u78BA\u5B9A\u3092\u5F85\u3063\u3066\u3044\u307E\u3059\u3002\u30C1\u30E3\u30C3\u30C8\u7A93\u304C\u9589\u3058\u308B\u307E\u3067\u518D\u7167\u5408\u3057\u307E\u3059\u3002",
    "recovery.cancelRosterWait": "\u540D\u7C3F\u5F85\u6A5F\u3092\u4E2D\u6B62",
    "recovery.warn.rosterLateRegistrations": "\u958B\u59CB\u5F8C\u306B\u5C4A\u3044\u305F\u540D\u7C3F\u767B\u9332 {count} \u4EF6\u3092\u7121\u8996\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterLegacy": "\u3053\u306E\u914D\u5099\u306F\u540D\u7C3F\u5C65\u6B74\u306E\u306A\u3044\u65E7 HashStorage \u3092\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059\u3002\u30C1\u30A7\u30FC\u30F3\u4E0A\u306E\u73FE\u5728\u306E\u540D\u7C3F\u30CF\u30C3\u30B7\u30E5\u3067\u7167\u5408\u3057\u307E\u3057\u305F\u3002",
    "recovery.warn.rosterProvisional": "\u540D\u7C3F\u306F\u307E\u3060\u66AB\u5B9A\uFF08\u30C1\u30E3\u30C3\u30C8\u958B\u59CB\u524D\uFF09\u3067\u3059\u3002\u30C1\u30A7\u30FC\u30F3\u304C\u958B\u59CB\u306B\u5C4A\u304D\u3001\u6700\u7D42\u540D\u7C3F\u304C\u78BA\u5B9A\u3057\u3066\u304B\u3089\u7F72\u540D\u30FB\u63D0\u51FA\u3092\u59CB\u3081\u307E\u3059\u3002",
    "recovery.warn.rosterRechecking": "\u30C1\u30A7\u30FC\u30F3\u4E0A\u306E\u6700\u7D42\u540D\u7C3F\u3092\u518D\u78BA\u8A8D\u4E2D\u3067\u3059\u3002\u78BA\u5B9A\u307E\u3067\u7F72\u540D\u30FB\u53D7\u9818\u8A3C\u660E\u30FB\u63D0\u51FA\u3092\u4FDD\u7559\u3057\u307E\u3059\u3002",
    "recovery.warn.rosterChanged": "\u30C1\u30A7\u30FC\u30F3\u4E0A\u306E\u6700\u7D42\u540D\u7C3F\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u7F72\u540D\u30FB\u53D7\u9818\u8A3C\u660E\u30FB\u63D0\u51FA\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002\u518D\u8AAD\u8FBC\u3057\u3066\u6B63\u3057\u3044\u7D44\u3078\u5165\u308A\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "recovery.relay.save": "\u30EA\u30EC\u30FC\u3092\u4FDD\u5B58",
    "recovery.relay.saved": "\u30EA\u30EC\u30FC\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\uFF08\u6B21\u56DE\u958B\u59CB\u6642\u304B\u3089\u6709\u52B9\uFF09\u3002",
    "recovery.relay.saveFailed": "\u30EA\u30EC\u30FC\u3092\u4FDD\u5B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30D6\u30E9\u30A6\u30B6\u306E\u30B9\u30C8\u30EC\u30FC\u30B8\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
  };
  var zh = {
    "lang.name": "\u4E2D\u6587",
    "app.title": "COINU \u804A\u5929\u6E38\u620F\u8F85\u52A9\u5DE5\u5177",
    "app.subtitle": "\u7F6E\u4E8E\u8FD0\u8425\u65B9\u4E4B\u5916\u3001\u951A\u5B9A\u4E8E\u94FE\u4E0A\u7684\u72EC\u7ACB\u5DE5\u5177\u3002",
    "entry.loader": "\u9A8C\u8BC1\u5E76\u542F\u52A8\uFF08\u52A0\u8F7D\u5668\uFF09",
    "entry.recovery": "\u6062\u590D\u5BA2\u6237\u7AEF",
    "entry.loader.desc": "\u68C0\u67E5\u8FD0\u8425\u65B9\u5206\u53D1\u7684\u5E94\u7528\u662F\u5426\u4E0E\u94FE\u4E0A\u951A\u5B9A\u7684\u4EE3\u7801\u4E00\u81F4\uFF0C\u4EC5\u5728\u4E00\u81F4\u65F6\u8FD0\u884C\u3002",
    "entry.recovery.desc": "\u88AB\u5C01\u9501\u65F6\uFF0C\u4EC5\u51ED\u94B1\u5305\u4E0E\u516C\u5F00\u4E2D\u7EE7\u5373\u53EF\u5B8C\u6210\u804A\u5929\u3001\u6295\u7968\u3001\u4E3E\u62A5\u3001\u63D0\u4EA4\u7684\u5168\u90E8\u64CD\u4F5C\u3002",
    "loader.rpc": "\u72EC\u7ACB RPC",
    "loader.reading": "\u6B63\u5728\u4ECE\u94FE\u4E0A\u8BFB\u53D6 buildHash\u2026",
    "loader.fetching": "\u6B63\u5728\u83B7\u53D6\u5206\u53D1\u5305\u6E05\u5355\u2026",
    "loader.verifying": "\u6B63\u5728\u9A8C\u8BC1\u6587\u4EF6\uFF08{done}/{total}\uFF09\u2026",
    "loader.ok": "\u9A8C\u8BC1\u6210\u529F\uFF1A\u5206\u53D1\u7684\u5E94\u7528\u4E0E\u94FE\u4E0A\u951A\u5B9A\u7684 build #{buildVersion} \u4E00\u81F4\u3002",
    "loader.launch": "\u542F\u52A8\u5DF2\u9A8C\u8BC1\u7684\u5E94\u7528",
    "loader.warn.reregistered": "\u8B66\u544A\uFF1A\u8BE5 build \u7248\u672C\u5728\u94FE\u4E0A\u88AB\u91CD\u65B0\u6CE8\u518C\u4E86 {registrationCount} \u6B21\uFF08\u6784\u5EFA\u88AB\u66FF\u6362\uFF1D\u94FE\u4E0A\u53EF\u89C1\uFF09\u3002",
    "loader.fail.no_hash": "\u94FE\u4E0A\u5C1A\u672A\u6CE8\u518C build hash\uFF08\u6C47\u603B/\u90E8\u7F72\u672A\u5B8C\u6210\uFF0C\u6216 buildHash \u5408\u7EA6\u5C1A\u672A\u90E8\u7F72\uFF09\u3002",
    "loader.fail.rpc": "\u65E0\u6CD5\u901A\u8FC7\u6240\u9009 RPC \u8BFB\u53D6\u94FE\u4E0A\u6570\u636E\u3002",
    "loader.fail.fetch": "\u65E0\u6CD5\u83B7\u53D6\u5206\u53D1\u5305\uFF08\u8FD0\u8425\u65B9\u53EF\u80FD\u5BF9\u4F60\u5355\u72EC\u4E0D\u4E88\u5206\u53D1\uFF09\u3002",
    "loader.fail.maintenance": "\u8FD0\u8425\u65B9\u8FD4\u56DE\u4E86\u7EF4\u62A4\u9875\u9762\uFF08503\uFF09\u3002\u8FD9\u4E0D\u662F\u9A8C\u8BC1\u7ED3\u679C\u2014\u2014\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
    "loader.fail.manifest_invalid": "\u5206\u53D1\u7684\u6E05\u5355\u683C\u5F0F\u4E0D\u6B63\u786E\u3002",
    "loader.fail.manifest_mismatch": "\u5206\u53D1\u7684\u6E05\u5355\u4E0E\u94FE\u4E0A buildHash \u4E0D\u4E00\u81F4\uFF08\u7591\u4F3C\u533A\u522B\u5206\u53D1/\u7BE1\u6539\uFF09\u3002",
    "loader.fail.file_mismatch": "\u67D0\u4E2A\u5206\u53D1\u6587\u4EF6\u4E0E\u6E05\u5355\u4E0D\u4E00\u81F4\uFF08{count} \u4E2A\uFF09\u2014\u2014\u7591\u4F3C\u7BE1\u6539\u3002",
    "loader.togo_recovery": "\u524D\u5F80\u6062\u590D\u5BA2\u6237\u7AEF",
    "loader.guarantee": "\u8FD9\u4FDD\u8BC1\u201C\u6240\u6709\u4EBA\u8FD0\u884C\u76F8\u540C\u4EE3\u7801\uFF08\u6392\u9664\u533A\u522B\u5206\u53D1\uFF09\uFF0B\u4EFB\u4F55\u5168\u4F53\u653B\u51FB\u90FD\u4F1A\u5728\u94FE\u4E0A\u7559\u4E0B\u6C38\u4E45\u8BC1\u636E\u201D\u3002\u5E76\u4E0D\u8BC1\u660E\u201C\u4EE3\u7801\u662F\u8BDA\u5B9E\u7684\u201D\u3002",
    "recovery.connect": "\u8FDE\u63A5\u94B1\u5305",
    "recovery.selectWallet": "\u9009\u62E9\u94B1\u5305",
    "recovery.noWallet": "\u672A\u627E\u5230\u94B1\u5305\u6269\u5C55\u3002\u8BF7\u5B89\u88C5 MetaMask / Rabby / Coinbase Wallet\u3002",
    "recovery.restart": "\u21BB \u91CD\u65B0\u5F00\u59CB",
    "recovery.discover": "\u67E5\u627E\u6211\u7684\u7528\u6237 ID",
    "recovery.sign": "\u7B7E\u540D\u4EE5\u6D3E\u751F\u5BC6\u94A5",
    "recovery.savedRescue": "\u4F7F\u7528\u5DF2\u4FDD\u5B58\u7684\u526F\u672C\u63D0\u4EA4\uFF08\u65E0\u9700 R2\uFF09",
    "recovery.savedRescueMissing": "\u6CA1\u6709\u4E0E\u6B64\u533A\u5757\u548C\u94B1\u5305\u5339\u914D\u7684\u540D\u518C\u8BC1\u660E\u53CA\u63D0\u4EA4\u526F\u672C\u3002",
    "recovery.savedRescueChoose": "\u9009\u62E9\u5DF2\u4FDD\u5B58\u7684\u7528\u6237 ID\uFF1A",
    "recovery.savedRescueConfirm": "\u5C06\u5DF2\u4FDD\u5B58\u7684\u63D0\u4EA4\u53D1\u9001\u5230\u94FE\u4E0A\uFF1A",
    "recovery.block": "\u533A\u5757\u7F16\u53F7",
    "recovery.phase": "\u9636\u6BB5",
    "recovery.ceiling": "\u63D0\u4EA4\u3001\u6295\u7968\u548C\u4E3E\u62A5\u4EC5\u51ED\u94B1\u5305\u5373\u53EF\u5B8C\u5168\u6062\u590D\u3002\u804A\u5929\u3001\u6295\u7968\u548C\u4E3E\u62A5\u53EA\u6709\u5728\u81F3\u5C11\u4E00\u4F4D\u8BDA\u5B9E\u7684\u540C\u7EC4\u6210\u5458\u901A\u8FC7\u4E2D\u7EE7\u6536\u5230\uFF08\u56DE\u6267\uFF1D\u5DF2\u8BFB\uFF09\u65F6\u624D\u8BA1\u5165\u8BC4\u5206\u2014\u2014\u8BF7\u6DFB\u52A0\u72EC\u7ACB\u4E2D\u7EE7\u4EE5\u63D0\u9AD8\u6210\u529F\u7387\u3002",
    "recovery.submit": "\u91CD\u5EFA\u5E76\u94FE\u4E0A\u63D0\u4EA4",
    "recovery.submit.guarantee.headingPre": "\u6309\u73B0\u72B6\u63D0\u4EA4\u53EF\u4FDD\u8BC1\u7684\u5185\u5BB9\uFF08\u5C1A\u672A\u63D0\u4EA4\uFF09",
    "recovery.submit.guarantee.headingSigned": "\u5DF2\u7B7E\u540D\u63D0\u4EA4\u7269\u53EF\u4FDD\u8BC1\u7684\u5185\u5BB9\uFF08\u5C1A\u672A\u786E\u8BA4\u53D7\u7406\uFF09",
    "recovery.submit.guarantee.headingAccepted": "\u60A8\u7684\u63D0\u4EA4\u53EF\u4FDD\u8BC1\u7684\u5185\u5BB9",
    "recovery.submit.guarantee.headingPreOnChain": "\u94FE\u4E0A\u63D0\u4EA4\uFF1A\u82E5\u63D0\u4EA4\u5219\u53EF\u4FDD\u8BC1\u7684\u6570\u503C",
    "recovery.submit.guarantee.turns": "\u5BF9\u8BDD\u6B21\u6570\uFF1A{count} / {min}",
    "recovery.submit.guarantee.turnsUnprotected": "\u5BF9\u8BDD\u6B21\u6570\uFF1A\u6B64\u63D0\u4EA4\u65E0\u6CD5\u4FDD\u8BC1",
    "recovery.submit.guarantee.chars": "\u53D1\u8A00\u5B57\u6570\uFF1A{count} / {min}",
    "recovery.submit.guarantee.charsUnprotected": "\u53D1\u8A00\u5B57\u6570\uFF1A\u6B64\u63D0\u4EA4\u65E0\u6CD5\u4FDD\u8BC1",
    "recovery.submit.guarantee.charsRare": "\u867D\u7136\u975E\u5E38\u7F55\u89C1\uFF0C\u4F46\u4EC5\u5728\u60A8\u5305\u62EC\u5176\u4ED6\u8BBE\u5907\u5728\u5185\u53D1\u8A00\u8FBE100\u6761\u4EE5\u4E0A\u3001\u4E14\u7F51\u7EDC\u4FE1\u606F\u5171\u4EAB\u51FA\u73B0\u95EE\u9898\u65F6\uFF0C\u53D1\u8A00\u5B57\u6570\u624D\u53EF\u80FD\u4F4E\u4E8E\u6B64\u4FDD\u8BC1\u7684{chars}\u5B57\u3002",
    "recovery.submit.guarantee.charsRareMin": "\u867D\u7136\u975E\u5E38\u7F55\u89C1\uFF0C\u4F46\u4EC5\u5728\u60A8\u5305\u62EC\u5176\u4ED6\u8BBE\u5907\u5728\u5185\u53D1\u8A00\u8FBE100\u6761\u4EE5\u4E0A\u3001\u4E14\u7F51\u7EDC\u4FE1\u606F\u5171\u4EAB\u51FA\u73B0\u95EE\u9898\u65F6\uFF0C\u53D1\u8A00\u5B57\u6570\u624D\u53EF\u80FD\u4F4E\u4E8E\u6B64\u4FDD\u8BC1\u7684{chars}\u5B57\u3002\u4E0D\u8FC7\uFF0C\u5728\u5F53\u524D\u60C5\u51B5\u4E0B\uFF0C\u53EF\u4EE5\u4FDD\u8BC1\u81F3\u5C11\u6709{min}\u5B57\u3002",
    "recovery.submit.guarantee.voteDone": "\u6295\u7968\uFF1A\u5DF2\u5B8C\u6210\uFF08\u5BF9\u8C61\uFF1A{name}\uFF09",
    "recovery.submit.guarantee.voteDoneNoTarget": "\u6295\u7968\uFF1A\u5DF2\u5B8C\u6210",
    "recovery.submit.guarantee.voteUnprotected": "\u6295\u7968\uFF1A\u6B64\u63D0\u4EA4\u65E0\u6CD5\u4FDD\u8BC1\uFF08\u7167\u6B64\u4E0B\u53BB\u53EF\u80FD\u56E0\u672A\u6295\u7968\u800C\u88AB\u53D6\u6D88\u8D44\u683C\uFF09",
    "recovery.submit.guarantee.voteRejected": "\u6295\u7968\uFF1A\u6B64\u63D0\u4EA4\u65E0\u6CD5\u4FDD\u8BC1",
    "recovery.submit.guarantee.reports": "\u4E3E\u62A5\uFF1A{names}",
    "recovery.submit.guarantee.reportsNone": "\u4E3E\u62A5\uFF1A\u65E0",
    "recovery.submit.guarantee.reportsTooMany": "\u4E3E\u62A5\uFF1A\u6CA1\u6709\u53EF\u4EE5\u4FDD\u8BC1\u7684\u4E3E\u62A5",
    "recovery.submit.guarantee.reportsRejected": "\u4E3E\u62A5\uFF1A\u6B64\u63D0\u4EA4\u65E0\u6CD5\u4FDD\u8BC1",
    "recovery.submit.guarantee.reportsRare": "\u867D\u7136\u975E\u5E38\u7F55\u89C1\uFF0C\u4F46\u4EC5\u5728\u60A8\u5305\u62EC\u5176\u4ED6\u8BBE\u5907\u5728\u5185\u4E3E\u62A5\u4E863\u4EBA\u4EE5\u4E0A\u3001\u4E14\u7F51\u7EDC\u4FE1\u606F\u5171\u4EAB\u51FA\u73B0\u95EE\u9898\u65F6\uFF0C\u6709\u6548\u7684\u4E3E\u62A5\u624D\u53EF\u80FD\u4F4E\u4E8E\u6B64\u4FDD\u8BC1\u3002",
    "recovery.submit.guarantee.nameSeparator": "\u3001",
    "recovery.submit.guarantee.noteAlways": "\u5176\u4ED6\u6210\u5458\u63D0\u4EA4\u7684\u5185\u5BB9\u4E0D\u4F1A\u51CF\u5C11\u8FD9\u4E9B\u7ED3\u679C\u3002\u4F46\u4E0D\u5305\u62EC\u56E0\u5176\u4ED6\u6210\u5458\u4E3E\u62A5\u800C\u88AB\u53D6\u6D88\u8D44\u683C\u4EE5\u53CA\u62BC\u91D1\u6761\u4EF6\u3002",
    "recovery.submit.guarantee.noteRejected": '\u6B64\u63D0\u4EA4\u7269\u5728\u8BC4\u5206\u65F6\u4E0D\u4F1A\u88AB\u53D7\u7406\u3002\u8BF7\u518D\u6B21\u6309\u4E0B"\u91CD\u5EFA\u5E76\u94FE\u4E0A\u63D0\u4EA4"\u3002',
    "recovery.submit.guarantee.noteRejectedAccepted": "\u6B64\u63D0\u4EA4\u7269\u5728\u8BC4\u5206\u65F6\u4E0D\u4F1A\u88AB\u53D7\u7406\u3002",
    "recovery.submit.guarantee.noteMultiple": "\u94FE\u4E0A\u63D0\u4EA4\u5DF2\u6709\u4E24\u6B21\u6216\u4EE5\u4E0A\u3002\u8BC4\u5206\u4F7F\u7528\u7B2C\u4E00\u4EFD\u6709\u6548\u63D0\u4EA4\u3002",
    "recovery.submit.guarantee.notePriorOnChain": "\u5982\u679C\u5DF2\u6709\u5148\u524D\u7684\u94FE\u4E0A\u63D0\u4EA4\uFF0C\u5219\u4EE5\u5176\u6570\u503C\u4E3A\u51C6\u3002",
    "recovery.submit.guarantee.checking": "\u6B63\u5728\u786E\u8BA4\u2026",
    "recovery.submit.guarantee.failed": "\u65E0\u6CD5\u786E\u8BA4\uFF08\u4E0D\u5F71\u54CD\u60A8\u7684\u63D0\u4EA4\uFF09\u3002",
    "recovery.submit.guarantee.noteLowTurns": "\u5982\u679C\u804A\u5929\u6E38\u620F\u753B\u9762\u4E0A\u7684\u5BF9\u8BDD\u6B21\u6570\u66FE\u663E\u793A\u4E3A20\u4EE5\u4E0A\uFF0C\u800C\u60A8\u4E4B\u540E\u66F4\u6362\u4E86\u8BBE\u5907\u6216\u6D4F\u89C8\u5668\uFF0C\u56DE\u5230\u539F\u6765\u7684\u8BBE\u5907\u6216\u6D4F\u89C8\u5668\u63D0\u4EA4\uFF0C\u53EF\u80FD\u80FD\u591F\u6309\u804A\u5929\u6E38\u620F\u4E2D\u663E\u793A\u7684\u5BF9\u8BDD\u6B21\u6570\u63D0\u4EA4\u3002",
    "recovery.submit.signedGuarantee": "\u5DF2\u7B7E\u540D\u63D0\u4EA4\u7269\u7684\u4F18\u5148\u680F\u6240\u4FDD\u62A4\u7684\u5BF9\u8BDD\u6B21\u6570\uFF1A{count} / {min}",
    "recovery.submit.signedNoPriority": "\u5DF2\u7B7E\u540D\u7684\u63D0\u4EA4\u7269\u672A\u80FD\u653E\u7F6E\u4F18\u5148\u680F\uFF08\u4F18\u5148\u680F\u6240\u4FDD\u62A4\u7684\u5BF9\u8BDD\u6B21\u6570\uFF1A0\uFF09\u3002",
    "recovery.submit.wsAckedOverwrite": "\u6839\u636E\u8FD0\u8425\u65B9\u7684\u8BB0\u5F55\uFF0C\u60A8\u7684 WebSocket \u63D0\u4EA4\u5DF2\u88AB\u53D7\u7406\u3002\uFF08\u6B64\u8BB0\u5F55\u662F\u8FD0\u8425\u65B9\u7684\u58F0\u660E\uFF0C\u65E0\u6CD5\u5728\u6B64\u9875\u9762\u6838\u5B9E\u3002\uFF09\u82E5\u5728\u6B64\u91CD\u65B0\u6784\u5EFA\u5E76\u63D0\u4EA4\u5230\u94FE\u4E0A\uFF0C\u94FE\u4E0A\u63D0\u4EA4\u5C06\u4F18\u5148\uFF0C\u5DF2\u53D7\u7406\u7684\u63D0\u4EA4\u4F1A\u88AB\u6B64\u9875\u9762\u91CD\u65B0\u6784\u5EFA\u7684\u6570\u636E\u5305\u53D6\u4EE3\uFF08\u91CD\u65B0\u6784\u5EFA\u7684\u6570\u636E\u5305\u4E2D\u7531\u4F18\u5148\u680F\u6240\u4FDD\u62A4\u7684\u5BF9\u8BDD\u6B21\u6570\u53EF\u80FD\u66F4\u5C11\uFF09\u3002\u82E5\u5728\u6B64\u505C\u6B62\uFF0C\u5DF2\u53D7\u7406\u7684\u63D0\u4EA4\u662F\u5426\u7528\u4E8E\u8BC4\u5206\u53D6\u51B3\u4E8E\u5BF9\u8FD0\u8425\u65B9\u7684\u4FE1\u4EFB\uFF08\u4FE1\u4EFB\u8FD0\u8425\u65B9\u4F1A\u9020\u6210\u5BF9\u8FD0\u8425\u65B9\u7684\u4F9D\u8D56\uFF0C\u56E0\u6B64\u4E0D\u63A8\u8350\uFF09\u3002\u662F\u5426\u7EE7\u7EED\uFF1F",
    "recovery.rpcNode.singleTitle": "\u53EA\u6709\u4E00\u4E2A\u8282\u70B9\u53EF\u4F9B\u8BFB\u53D6",
    "recovery.rpcNode.singleBody": "\u76EE\u524D\u53EA\u6709\u4E0B\u9762\u8FD9\u4E2A\u8282\u70B9\u80FD\u8BFB\u53D6\u533A\u5757\u94FE\u4E0A\u7684\u804A\u5929\u622A\u6B62\u65F6\u95F4\u3001\u6210\u5458\u540D\u5355\u548C\u65F6\u95F4\u3002\u60A8\u8981\u4FE1\u4EFB\u6B64\u8282\u70B9\u5E76\u7EE7\u7EED\uFF0C\u8FD8\u662F\u8FDE\u63A5\u94B1\u5305\uFF1F\uFF08\u5982\u679C\u8282\u70B9\u8FD4\u56DE\u9519\u8BEF\u503C\uFF0C\u60A8\u53EF\u80FD\u65E0\u6CD5\u6B63\u5E38\u53C2\u4E0E\u6E38\u620F\u3002\uFF09",
    "recovery.rpcNode.nodeLine": "\u8282\u70B9\uFF1A{host}",
    "recovery.rpcNode.trustContinue": "\u4FE1\u4EFB\u6B64\u8282\u70B9\u5E76\u7EE7\u7EED",
    "recovery.rpcNode.connectWallet": "\u8FDE\u63A5\u94B1\u5305",
    "recovery.rpcNode.splitTitle": "\u8282\u70B9\u7684\u56DE\u7B54\u4E0D\u4E00\u81F4",
    "recovery.rpcNode.splitBody": "\u8BFB\u53D6\u533A\u5757\u94FE\u4E0A\u7684\u804A\u5929\u622A\u6B62\u65F6\u95F4\u3001\u6210\u5458\u540D\u5355\u548C\u65F6\u95F4\u7684\u8282\u70B9\u7ED9\u51FA\u4E86\u4E0D\u540C\u56DE\u7B54\u3002\u8BF7\u9009\u62E9\u4E00\u4E2A\u4FE1\u4EFB\u7684\u8282\u70B9\uFF0C\u6216\u8FDE\u63A5\u94B1\u5305\u3002\uFF08\u5982\u679C\u6240\u9009\u8282\u70B9\u8FD4\u56DE\u9519\u8BEF\u503C\uFF0C\u60A8\u53EF\u80FD\u65E0\u6CD5\u6B63\u5E38\u53C2\u4E0E\u6E38\u620F\u3002\uFF09",
    "recovery.rpcNode.splitSameWindowNote": "\u5982\u679C\u5206\u6B67\u51FA\u73B0\u5728\u4E0D\u5F71\u54CD\u622A\u6B62\u65F6\u95F4\u7684\u8BFB\u53D6\uFF08\u4F8B\u5982\u6210\u5458\u540D\u5355\u767B\u8BB0\u6570\uFF09\uFF0C\u5404\u8282\u70B9\u663E\u793A\u7684\u5F00\u59CB\u548C\u622A\u6B62\u65F6\u95F4\u53EF\u80FD\u76F8\u540C\u3002",
    "recovery.rpcNode.splitNodeWindow": "{host}\uFF1A\u7A97\u53E3\u5F00\u59CB\uFF08\u62A5\u540D\u622A\u6B62\uFF09{start} \xB7 \u804A\u5929\u622A\u6B62 {close}",
    "recovery.rpcNode.splitNodeUnread": "{host}\uFF1A\u65E0\u6CD5\u8BFB\u53D6\u65F6\u95F4\u7A97\u53E3",
    "recovery.rpcNode.splitNodeValue": "\u6709\u5206\u6B67\u7684\u8BFB\u53D6\uFF08{method}\uFF09\u7684\u56DE\u7B54\uFF1A{value}",
    "recovery.rpcNode.trustThis": "\u4FE1\u4EFB\u6B64\u8282\u70B9",
    "recovery.rpcNode.waiting": "\u533A\u5757\u94FE\u8BFB\u53D6\u6E90\u4E0D\u4E00\u81F4\uFF0C5\u79D2\u540E\u91CD\u65B0\u8BFB\u53D6\uFF08\u60A8\u53EF\u4EE5\u53D6\u6D88\uFF09\u3002",
    "recovery.rpcNode.approved": "\u7EE7\u7EED\u4F7F\u7528\u6B64\u53D7\u4FE1\u4EFB\u7684\u8282\u70B9\uFF1A{host}",
    "recovery.rpcNode.waitTitle": "\u60A8\u9009\u62E9\u7684\u8282\u70B9\u5C1A\u672A\u56DE\u7B54",
    "recovery.rpcNode.waitBody": "\u60A8\u9009\u62E9\u4FE1\u4EFB\u7684\u8282\u70B9 {host} \u7EA6 {seconds} \u79D2\u4EE5\u6765\u4E00\u76F4\u672A\u80FD\u56DE\u7B54\u533A\u5757\u94FE\u8BFB\u53D6\uFF08\u53EF\u80FD\u662F\u7E41\u5FD9\uFF0C\u6216\u65B0\u533A\u5757\u5C1A\u672A\u5230\u8FBE\u8BE5\u8282\u70B9\uFF09\u3002\u5BF9\u4E8E\u5B83\u672A\u56DE\u7B54\u7684\u8BFB\u53D6\uFF0C\u4E0D\u4F7F\u7528\u5176\u4ED6\u8282\u70B9\u7684\u56DE\u7B54\u3002\u8981\u7EE7\u7EED\u7B49\u5F85\uFF0C\u8FD8\u662F\u9009\u62E9\u5176\u4ED6\u8282\u70B9\uFF1F",
    "recovery.rpcNode.waitNoCandidates": "\u76EE\u524D\u6CA1\u6709\u5176\u4ED6\u53EF\u9009\u62E9\u7684\u8282\u70B9\uFF08\u6700\u8FD1\u6CA1\u6709\u5176\u4ED6\u8282\u70B9\u56DE\u7B54\uFF09\u3002\u8BF7\u7EE7\u7EED\u7B49\u5F85\uFF0C\u6216\u8FDE\u63A5\u60A8\u7684\u94B1\u5305\u3002",
    "recovery.rpcNode.waitKeep": "\u7EE7\u7EED\u7B49\u5F85",
    "recovery.rpcNode.waitPickAnother": "\u9009\u62E9\u5176\u4ED6\u8282\u70B9",
    "recovery.rpcNode.pickTitle": "\u9009\u62E9\u5176\u4ED6\u8282\u70B9",
    "recovery.rpcNode.pickBody": "\u4EE5\u4E0B\u8282\u70B9\u6700\u8FD1\u4F5C\u51FA\u4E86\u56DE\u7B54\uFF08\u5404\u503C\u4E3A\u8BE5\u8282\u70B9\u7684\u6700\u65B0\u56DE\u7B54\uFF09\u3002\u8BF7\u9009\u62E9\u4E00\u4E2A\u4FE1\u4EFB\u7684\u8282\u70B9\uFF0C\u6216\u8FDE\u63A5\u94B1\u5305\u3002\uFF08\u5176\u4E2D\u53EF\u80FD\u6709\u8FD4\u56DE\u9519\u8BEF\u503C\u7684\u8282\u70B9\u3002\u5982\u679C\u6240\u9009\u8282\u70B9\u8FD4\u56DE\u9519\u8BEF\u503C\uFF0C\u60A8\u53EF\u80FD\u65E0\u6CD5\u6B63\u5E38\u53C2\u4E0E\u6E38\u620F\u3002\uFF09",
    "recovery.rpcNode.pickThis": "\u9009\u62E9\u6B64\u8282\u70B9",
    "recovery.rpcNode.pickNodeValue": "\u6700\u65B0\u56DE\u7B54\uFF08{method}\uFF09\uFF1A{value}",
    "recovery.rpcNode.chosenWaiting": "\u6B63\u5728\u7B49\u5F85\u60A8\u9009\u62E9\u7684\u8282\u70B9\uFF08{host}\uFF09\u7684\u56DE\u7B54\uFF1B5\u79D2\u540E\u91CD\u65B0\u8BFB\u53D6\uFF08\u60A8\u53EF\u4EE5\u53D6\u6D88\uFF09\u3002",
    "recovery.windowCompare.title": "\u5404\u8BFB\u53D6\u6E90\u8FD4\u56DE\u7684\u804A\u5929\u622A\u6B62\u65F6\u95F4\u4E0D\u4E00\u81F4",
    "recovery.windowCompare.introBuild": "\u5DF2\u901A\u8FC7\u94B1\u5305\u548C\u516C\u5171\u8282\u70B9\u91CD\u65B0\u8BFB\u53D6\u94FE\u4E0A\u804A\u5929\u7A97\u53E3\uFF0C\u4F46\u7ED3\u679C\u4E0D\u4E00\u81F4\u3002\u4F18\u5148\u680F\uFF08\u4FDD\u62A4\u60A8\u7684\u4F1A\u8BDD\u6B21\u6570\uFF09\u53EA\u4F7F\u7528\u60A8\u6240\u9009\u7A97\u53E3\u5185\u7684\u9879\u76EE\u3002\u5982\u679C\u6240\u9009\u7A97\u53E3\u6BD4\u771F\u5B9E\u7A97\u53E3\u66F4\u5BBD\uFF08\u622A\u6B62\u65F6\u95F4\u66F4\u665A\uFF09\uFF0C\u771F\u5B9E\u7A97\u53E3\u5916\u7684\u9879\u76EE\u53EF\u80FD\u8FDB\u5165\u4F18\u5148\u680F\uFF0C\u5BFC\u81F4\u6574\u4EFD\u63D0\u4EA4\u65E0\u6548\uFF080\u5206\uFF09\u3002\u8F83\u65E9\u7684\u622A\u6B62\u65F6\u95F4\u4E0D\u80FD\u4FDD\u8BC1\u63D0\u4EA4\u6709\u6548\uFF1A\u5982\u679C\u4F18\u5148\u680F\u5305\u542B\u771F\u5B9E\u7A97\u53E3\u4E4B\u5916\u7684\u9879\u76EE\uFF0C\u6574\u4EFD\u63D0\u4EA4\u53EF\u80FD\u88AB\u62D2\u7EDD\u3002\u9ED8\u8BA4\u6807\u8BB0\u6307\u5411\u81F3\u5C11\u4E24\u4E2A\u6765\u6E90\u4E00\u81F4\u4E14\u7968\u6570\u552F\u4E00\u6700\u591A\u7684\u7A97\u53E3\uFF1B\u7968\u6570\u76F8\u540C\u6216\u53EA\u6709\u4E00\u4E2A\u56DE\u7B54\u65F6\uFF0C\u6307\u5411\u6B64\u8BBE\u5907\u7684\u7A97\u53E3\u3002\u4E0D\u4F7F\u7528\u4F18\u5148\u680F\u4E0D\u4F1A\u56E0\u7A97\u53E3\u800C\u88AB\u62D2\u7EDD\uFF0C\u4F46\u4F1A\u5931\u53BB\u4F1A\u8BDD\u6B21\u6570\u4FDD\u62A4\u3002\u8BF7\u9009\u62E9\u7528\u4E8E\u6784\u5EFA\u4F18\u5148\u680F\u7684\u7A97\u53E3\uFF0C\u6216\u4E0D\u4F7F\u7528\u4F18\u5148\u680F\u63D0\u4EA4\u3002",
    "recovery.windowCompare.introStored": "\u91CD\u65B0\u8BFB\u53D6\u94FE\u4E0A\u804A\u5929\u7A97\u53E3\u540E\uFF0C\u5404\u8BFB\u53D6\u6E90\u4E0D\u4E00\u81F4\uFF0C\u6216\u8005\u5DF2\u4FDD\u5B58\u63D0\u4EA4\u7684\u4F18\u5148\u680F\u5305\u542B\u4E00\u81F4\u7A97\u53E3\u5916\u7684\u9879\u76EE\u3002\u82E5\u4F18\u5148\u680F\u5305\u542B\u771F\u5B9E\u7A97\u53E3\u5916\u7684\u4EFB\u4F55\u9879\u76EE\uFF0C\u6574\u4EFD\u63D0\u4EA4\u5C06\u65E0\u6548\uFF080\u5206\uFF09\u3002\u4E0B\u9762\u663E\u793A\u5DF2\u4FDD\u5B58\u4F18\u5148\u680F\u662F\u5426\u9002\u5408\u5404\u7A97\u53E3\u3002",
    "recovery.windowCompare.groupLine": "\u7A97\u53E3\u8D77\u70B9\uFF08\u62A5\u540D\u622A\u6B62\uFF09{start} \xB7 \u804A\u5929\u622A\u6B62 {close}",
    "recovery.windowCompare.groupSources": "\u8FD4\u56DE\u6B64\u7A97\u53E3\u7684\u8BFB\u53D6\u6E90\uFF1A{sources}",
    "recovery.windowCompare.noSources": "\uFF08\u6CA1\u6709\u8BFB\u53D6\u6E90\u8FD4\u56DE\u6B64\u7A97\u53E3\uFF09",
    "recovery.windowCompare.sourceWallet": "\u94B1\u5305",
    "recovery.windowCompare.thisDevice": "\u6B64\u8BBE\u5907\u76EE\u524D\u4F7F\u7528\u7684\u7A97\u53E3",
    "recovery.windowCompare.majority": "\u591A\u6570\u8BFB\u53D6\u6E90\u4E00\u81F4",
    "recovery.windowCompare.tieHint": "\u6807\u8BB0\u7684\u7A97\u53E3\u662F\u6B64\u8BBE\u5907\u5728\u804A\u5929\u671F\u95F4\u786E\u5B9A\u7684\u7A97\u53E3\uFF0C\u4F8B\u5982\u7531\u4E24\u4E2A\u6216\u66F4\u591A\u8BFB\u53D6\u6E90\u4E00\u81F4\u786E\u8BA4\u3002\uFF08\u5728\u8BBE\u7F6E\u4E2D\u5305\u542B\u8FD0\u8425\u8282\u70B9\u7684\u8BBE\u5907\u4E0A\uFF0C\u8BE5\u7A97\u53E3\u4E5F\u53EF\u80FD\u662F\u6839\u636E\u8FD0\u8425\u8282\u70B9\u7684\u8BFB\u53D6\u786E\u5B9A\u7684\u3002\uFF09",
    "recovery.windowCompare.storedInside": "\u5DF2\u4FDD\u5B58\u7684\u4F18\u5148\u680F\u4F4D\u4E8E\u6B64\u7A97\u53E3\u5185",
    "recovery.windowCompare.storedOutside": "\u5DF2\u4FDD\u5B58\u7684\u4F18\u5148\u680F\u5305\u542B\u6B64\u7A97\u53E3\u5916\u7684\u9879\u76EE",
    "recovery.windowCompare.lockNotUsed": "\u9009\u62E9\u6B64\u7A97\u53E3\u65F6\uFF0C\u5C4F\u5E55\u8FBE\u523020\u65F6\u9501\u5B9A\u7684\u4F18\u5148\u680F\u7EC4\u5408\u65E0\u6CD5\u4F7F\u7528\uFF0C\u5C06\u91CD\u65B0\u7EC4\u5EFA\u3002",
    "recovery.windowCompare.unanswered": "\u65E0\u6CD5\u8BFB\u53D6\u7684\u6765\u6E90\uFF1A{sources}",
    "recovery.windowCompare.operatorNode": "\u8FD0\u8425\u8282\u70B9\uFF08\u4EC5\u4F9B\u53C2\u8003\uFF0C\u4E0D\u53EF\u9009\u62E9\uFF09\uFF1A\u7A97\u53E3\u8D77\u70B9\uFF08\u62A5\u540D\u622A\u6B62\uFF09{start} \xB7 \u804A\u5929\u622A\u6B62 {close}",
    "recovery.windowCompare.operatorNodeUnread": "\u8FD0\u8425\u8282\u70B9\uFF08\u4EC5\u4F9B\u53C2\u8003\uFF09\uFF1A\u65E0\u6CD5\u8BFB\u53D6",
    "recovery.windowCompare.chooseWindow": "\u4F7F\u7528\u6B64\u7A97\u53E3\u6784\u5EFA\u4F18\u5148\u680F",
    "recovery.windowCompare.chooseWindowStored": "\u4F7F\u7528\u6B64\u7A97\u53E3\uFF08\u82E5\u526F\u672C\u9002\u5408\u5219\u76F4\u63A5\u53D1\u9001\uFF0C\u5426\u5219\u91CD\u65B0\u6784\u5EFA\uFF09",
    "recovery.windowCompare.chooseNone": "\u4E0D\u4F7F\u7528\u4F18\u5148\u680F\u63D0\u4EA4",
    "recovery.windowCompare.chooseNoneStored": "\u4E0D\u4F7F\u7528\u4F18\u5148\u680F\u91CD\u65B0\u6784\u5EFA\u5E76\u63D0\u4EA4",
    "recovery.windowCompare.chooseStored": "\u539F\u6837\u53D1\u9001\u5DF2\u4FDD\u5B58\u7684\u526F\u672C",
    "recovery.windowCompare.storedOnlyNote": "\u6B64\u9875\u9762\u65E0\u6CD5\u91CD\u65B0\u6784\u5EFA\u63D0\u4EA4\u3002\u8981\u91CD\u65B0\u6784\u5EFA\uFF0C\u8BF7\u9009\u62E9\u533A\u5757\u548C\u60A8\u7684\u7528\u6237 ID\uFF0C\u52A0\u8F7D\u5BC6\u94A5\u540E\u6309\u201C\u63D0\u4EA4\u201D\u3002\u82E5\u53D6\u6D88\uFF0C\u6B64\u9875\u9762\u4E0D\u4F1A\u5411\u94FE\u4E0A\u63D0\u4EA4\u4EFB\u4F55\u5185\u5BB9\u3002",
    "recovery.windowCompare.confirm": "\u6309\u6B64\u9009\u62E9\u7EE7\u7EED",
    "recovery.windowCompare.cancel": "\u53D6\u6D88\uFF08\u4E0D\u7B7E\u540D\u4E5F\u4E0D\u53D1\u9001\uFF09",
    "recovery.windowCompare.cancelled": "\u5DF2\u53D6\u6D88\u63D0\u4EA4\uFF08\u672A\u7B7E\u540D\u3001\u672A\u53D1\u9001\u4EFB\u4F55\u5185\u5BB9\uFF09\u3002",
    "recovery.windowCompare.reading": "\u6B63\u5728\u6BD4\u8F83\u5404\u8BFB\u53D6\u6E90\u7684\u804A\u5929\u7A97\u53E3\u2026",
    "recovery.windowCompare.deviceMark": "\u6B64\u8BBE\u5907\u7684\u7A97\u53E3\uFF08\u5DF2\u6807\u8BB0\uFF09",
    "recovery.windowCompare.noMarkHint": "\u8BFB\u53D6\u6E90\u6CA1\u6709\u5F62\u6210\u591A\u6570\uFF0C\u4E14\u6B64\u8BBE\u5907\u6CA1\u6709\u7A97\u53E3\uFF0C\u56E0\u6B64\u6CA1\u6709\u6807\u8BB0\u3002\u8BF7\u6BD4\u8F83\u5404\u7A97\u53E3\u7684\u8D77\u70B9\u548C\u622A\u6B62\u65F6\u95F4\u540E\u9009\u62E9\u3002",
    "recovery.windowCompare.walletOwnNode": "\u60A8\u94B1\u5305\u81EA\u8EAB\u7684\u8282\u70B9",
    "recovery.windowCompare.remoteHeadNote": "\uFF08WalletConnect\uFF0F\u624B\u673A MetaMask \u94B1\u5305\u7684\u8BFB\u53D6\u53BB\u5411\uFF09",
    "recovery.windowCompare.cancelledOnChain": "\u5DF2\u53D6\u6D88\u94FE\u4E0A\u63D0\u4EA4\uFF08\u672A\u7B7E\u540D\u6216\u53D1\u9001\u4EFB\u4F55\u5185\u5BB9\uFF09\u3002WebSocket \u63D0\u4EA4\u72B6\u6001\u4E0D\u53D8\u3002",
    "recovery.senderSlots": "\u6B64\u94B1\u5305\u7684 Evidence \u63D0\u4EA4\u6B21\u6570",
    "recovery.sharedWalletLimit": "\u5171\u7528\u6B64\u94B1\u5305\u7684\u7528\u6237 ID \u5171\u7528\u4E09\u4E2A\u94FE\u4E0A\u63D0\u4EA4\u540D\u989D\u3002",
    "recovery.warn.proofMissing": "\u5B8C\u6574\u516C\u5F00\u540D\u518C\u7684\u8BC1\u660E\u7F3A\u5931\u6216\u4E0D\u5339\u914D\u3002\u8BF7\u5728\u540D\u518C\u6587\u4EF6\u53EF\u7528\u540E\u91CD\u8BD5\u3002",
    "recovery.trimNotice": "\u63D0\u4EA4\u6570\u636E\u8D85\u51FA\u94FE\u4E0A\u5BB9\u91CF\u4E0A\u9650\uFF0C\u56E0\u6B64\u5C06\u4ECE\u63D0\u4EA4\u6570\u636E\u4E2D\u79FB\u9664\u4E0B\u5217\u5DF2\u8BFB\u56DE\u6267\u3002\u53D1\u8A00\u3001\u60A8\u7684\u6295\u7968\u548C\u4E3E\u62A5\u4ECD\u4F1A\u4FDD\u7559\uFF1B\u4EC5\u5F53\u4E0B\u65B9\u7684\u4F1A\u8BDD\u6570\u4FDD\u8BC1\u4E0B\u964D\u65F6\uFF0C\u5931\u53BB\u5DF2\u8BFB\u8986\u76D6\u7684\u6700\u4F18\u5148\u680F\u53D1\u8A00\u4E5F\u4F1A\u88AB\u79FB\u9664\u3002\u8BC4\u5206\u5408\u5E76\u6240\u6709\u6210\u5458\u7684\u63D0\u4EA4\uFF0C\u56E0\u6B64\u5176\u4ED6\u6210\u5458\u63D0\u4EA4\u4E2D\u7684\u5DF2\u8BFB\u56DE\u6267\u4ECD\u4F1A\u8BA1\u5165\u3002\u6295\u7968\u56DE\u6267\u53EA\u6709\u5728\u56DE\u6267\u7B7E\u53D1\u8005\u4EE5\u5916\u7684\u4EBA\u63D0\u4EA4\u65F6\u624D\u4F1A\u8BA1\u5165\u3002",
    "recovery.trimGuarantee": "\u6B64\u63D0\u4EA4\u7684\u4F1A\u8BDD\u6570\u4FDD\u8BC1\uFF1A{gBefore} \u2192 {gAfter}",
    "recovery.trimEssentialUnionWarning": "\u79FB\u9664\u540E\uFF0C\u4EC5\u51ED\u6B64\u8BBE\u5907\u7684\u63D0\u4EA4\u53EF\u80FD\u65E0\u6CD5\u8BC1\u660E\u60A8\u7684\u8D44\u683C\uFF08\u4F1A\u8BDD\u6570\u3001\u5B57\u6570\u548C\u6295\u7968\uFF09\u6216\u4E3E\u62A5\u4F9D\u636E\u3002\u8BC4\u5206\u5408\u5E76\u6240\u6709\u6210\u5458\u7684\u63D0\u4EA4\u3002",
    "recovery.trimEssentialOverrideWarning": "\u94FE\u4E0A\u63D0\u4EA4\u4F1A\u8986\u76D6\u540C\u4E00\u73A9\u5BB6\u7684\u670D\u52A1\u5668\u63D0\u4EA4\u3002\u5982\u679C WebSocket \u63D0\u4EA4\u5DF2\u88AB\u63A5\u53D7\uFF0C\u5220\u51CF\u53EF\u80FD\u964D\u4F4E\u5206\u6570\u3002",
    "recovery.trimEssentialCancelRecommended": "\u6B64\u8BBE\u5907\u5DF2\u6536\u5230\u8FD0\u8425\u65B9\u5173\u4E8E\u60A8\u7684 WebSocket \u63D0\u4EA4\u5DF2\u88AB\u63A5\u53D7\u7684\u58F0\u660E\uFF08\u65E0\u6CD5\u5728\u6B64\u9875\u9762\u6838\u5B9E\uFF09\u3002",
    "recovery.trimLossWarning": "\u7531\u4E8E\u90E8\u5206\u6570\u636E\u8D85\u51FA\u4E86\u94FE\u4E0A\u63D0\u4EA4\u7684\u6570\u636E\u5927\u5C0F\u4E0A\u9650\uFF0C\u65E0\u6CD5\u4FDD\u8BC1\u60A8\u7684\u4EE5\u4E0B\u884C\u4E3A\u4F1A\u88AB\u8BA1\u5206\u3002\u4ECD\u8981\u7528\u94FE\u4E0A\u63D0\u4EA4\u8986\u76D6\u670D\u52A1\u5668\u63D0\u4EA4\u5417\uFF1F",
    "recovery.trimLossWarningNoServer": "\u7531\u4E8E\u90E8\u5206\u6570\u636E\u8D85\u51FA\u4E86\u94FE\u4E0A\u63D0\u4EA4\u7684\u6570\u636E\u5927\u5C0F\u4E0A\u9650\uFF0C\u65E0\u6CD5\u4FDD\u8BC1\u60A8\u7684\u4EE5\u4E0B\u884C\u4E3A\u4F1A\u88AB\u8BA1\u5206\u3002\u4ECD\u8981\u8FDB\u884C\u94FE\u4E0A\u63D0\u4EA4\u5417\uFF1F",
    "recovery.trimLossTurns": "\u5BF9\u8BDD\u6B21\u6570\uFF1A{before} \u2192 {after}",
    "recovery.trimLossChars": "\u53D1\u8A00\u5B57\u6570\uFF1A{before} \u2192 {after}",
    "recovery.trimLossCharsUnprotected": "\u53D1\u8A00\u5B57\u6570\uFF1A{before} \u2192 \u6B64\u63D0\u4EA4\u65E0\u6CD5\u4FDD\u8BC1",
    "recovery.trimLossVote": "\u6295\u7968\uFF08\u5BF9\u8C61\uFF1A{name}\uFF09",
    "recovery.trimLossVoteNoTarget": "\u6295\u7968",
    "recovery.trimLossReports": "\u4E3E\u62A5\uFF08\u5BF9\u8C61\uFF1A{names}\uFF09",
    "recovery.trimLossUnchecked": "\u65E0\u6CD5\u786E\u8BA4\u5220\u51CF\u540E\u7684\u63D0\u4EA4\u7269\u53EF\u4FDD\u8BC1\u7684\u5185\u5BB9\uFF08\u4E0D\u5F71\u54CD\u60A8\u7684\u63D0\u4EA4\uFF09\u3002",
    "recovery.trimImpossible": "\u63D0\u4EA4\u6570\u636E\u8D85\u51FA\u94FE\u4E0A\u5BB9\u91CF\u4E0A\u9650\uFF0C\u5373\u4F7F\u5220\u51CF\u4E5F\u65E0\u6CD5\u5BB9\u7EB3\u3002",
    "recovery.trimImpossibleContributors": "\u65E0\u6CD5\u5220\u9664\u7684\u6570\u636E\u7684\u4E3B\u8981\u53D1\u9001\u8005\uFF08\u6700\u591A3\u540D\uFF09\uFF1A{uids}",
    "recovery.persistenceFailure": "\u65E0\u6CD5\u4FDD\u5B58\u6B64\u8BBE\u5907\u7684\u8BB0\u5F55\u3002\u8BF7\u4FDD\u6301\u9875\u9762\u6253\u5F00\u76F4\u5230\u63D0\u4EA4\uFF0C\u91CA\u653E\u6D4F\u89C8\u5668\u5B58\u50A8\u7A7A\u95F4\u540E\u91CD\u8BD5\u3002",
    "recovery.persistenceVolatile": "\u6B64\u8BBE\u5907\u65E0\u6CD5\u4FDD\u5B58\u6551\u63F4\u526F\u672C\u3002\u63D0\u4EA4\u5C06\u7EE7\u7EED\uFF0C\u4F46\u91CD\u65B0\u52A0\u8F7D\u9875\u9762\u540E\u5C06\u65E0\u6CD5\u4F7F\u7528\u6551\u63F4\u529F\u80FD\u3002",
    "recovery.submitted": "\u5DF2\u94FE\u4E0A\u63D0\u4EA4\u3002\u5C06\u5728\u7ED3\u679C\u7A97\u53E3\u5173\u95ED\u540E\uFF08\u786E\u8BA4\u7EA6 13 \u5206\u949F\uFF09\u53CD\u6620\u3002",
    "recovery.onchainDone": "\u5DF2\u63D0\u4EA4\u7ED3\u679C",
    "recovery.title": "\u6062\u590D\u5BA2\u6237\u7AEF",
    "recovery.blockLabel": "\u533A\u5757 ",
    "recovery.groupLabel": "\u5C0F\u7EC4 ",
    "recovery.timeRemaining": "\u5269\u4F59\u65F6\u95F4",
    "recovery.clock.warning": "\u68C0\u6D4B\u5230\u672C\u8BBE\u5907\u65F6\u949F\u4E0E\u94FE\u4E0A\u533A\u5757\u65F6\u95F4\u76F8\u5DEE{offset}\u79D2\u3002\u672C\u8BBE\u5907\u7684\u65F6\u949F\u53EF\u80FD\u4E0D\u51C6\u786E\u3002\u504F\u5DEE\u8FBE\u52302\u5206\u949F\u4EE5\u4E0A\u5C06\u65E0\u6CD5\u8FDB\u884C\u6E38\u620F\u3002\u8BF7\u8F93\u5165\u4E0E\u6B63\u786E\u65F6\u95F4\u7684\u5DEE\u503C\u3002",
    "recovery.clock.confirmation": "\u672C\u8BBE\u5907\u7684\u65F6\u949F\u5F53\u524D\u663E\u793A\u5982\u4E0B\u65F6\u95F4\u3002\u8FD9\u662F\u6B63\u786E\u7684\u5417\uFF1F\u76F8\u5DEE2\u5206\u949F\u4EE5\u4E0A\u53EF\u80FD\u4F1A\u6270\u4E71\u6E38\u620F\uFF0C\u8BF7\u8FDB\u884C\u4FEE\u6B63\u3002",
    "recovery.clock.current": "\u5F53\u524D\u8BBE\u5907\u65F6\u949F",
    "recovery.clock.correction": "\u6821\u6B63\u79D2\u6570\uFF08\u6162\u4E86\u586B\uFF0B\uFF0C\u5FEB\u4E86\u586B\u2212\uFF09",
    "recovery.clock.toggleSign": "\u5207\u6362\u6821\u6B63\u79D2\u6570\u7684\u6B63\u8D1F\u53F7",
    "recovery.clock.signHelp": "\u8B66\u544A\u4E2D\u7684\u201C+\u201D\u8868\u793A\u8BBE\u5907\u65F6\u949F\u8D70\u5FEB\u4E86\u3002\u8D70\u5FEB\u65F6\u8BF7\u8F93\u5165\u2212\uFF0C\u8D70\u6162\u65F6\u8BF7\u8F93\u5165\uFF0B\u3002",
    "recovery.clock.corrected": "\u6821\u6B63\u540E\u7684\u65F6\u949F",
    "recovery.clock.confirm": "\u786E\u8BA4",
    "recovery.clock.correct": "\u672C\u8BBE\u5907\u65F6\u949F\u6B63\u786E",
    "recovery.clock.close": "\u5173\u95ED",
    "recovery.clock.invalid": "\u8BF7\u8F93\u5165\u6574\u6570\u79D2\u6570\uFF08\u4F8B\u5982 \u2212180 \u6216 +30\uFF0C\u4E14\u4E0D\u8D85\u8FC7\xB124\u5C0F\u65F6\uFF09\u3002",
    "recovery.clock.adopt": "\u6B64\u6821\u6B63\u540E\u7684\u65F6\u95F4\u4E0E\u4ECE\u4EE5\u4E0B RPC \u83B7\u53D6\u7684\u4EE5\u592A\u574A\u6700\u65B0\u533A\u5757\u65F6\u95F4\u76F8\u5DEE {offset} \u79D2\u3002\u786E\u5B9A\u91C7\u7528\u6B64\u6821\u6B63\u540E\u7684\u65F6\u95F4\u5417\uFF1F",
    "recovery.clock.repeated": "\u53CD\u590D\u56DE\u5230\u540C\u4E00\u65F6\u95F4\u4F1A\u589E\u52A0\u88AB\u5176\u4ED6\u73A9\u5BB6\u4F5C\u4E3A\u4F5C\u5F0A\u884C\u4E3A\u4E3E\u62A5\u7684\u53EF\u80FD\u6027\u3002\u786E\u5B9A\u7EE7\u7EED\u5417\uFF1F",
    "recovery.clock.partialReissue": "\u5982\u679C\u4FEE\u6B63\u4EE5\u4E0B\u804A\u5929\u7684\u5DF2\u8BFB\u56DE\u6267\u65F6\u95F4\u5E76\u91CD\u65B0\u53D1\u653E\uFF0C\u5C06\u5C5E\u4E8E\u4E0D\u6B63\u884C\u4E3A\u201C\u76EE\u6807\u91CD\u53E0\u7684\u5DF2\u8BFB\u56DE\u6267\u7D2F\u8BA1\u8D85\u8FC75\u5F20\u201D\uFF0C\u88AB\u5176\u4ED6\u73A9\u5BB6\u4E3E\u62A5\u7684\u53EF\u80FD\u6027\u4F1A\u63D0\u9AD8\u3002\u8981\u4FEE\u6B63\u4EE5\u4E0B\u804A\u5929\u7684\u5DF2\u8BFB\u56DE\u6267\u65F6\u95F4\u5417\uFF1F",
    "recovery.clock.partialReissueApply": "\u4FEE\u6B63\u65F6\u95F4",
    "recovery.clock.partialReissueSkip": "\u4E0D\u4FEE\u6B63\u65F6\u95F4",
    "recovery.clock.adoptButton": "\u91C7\u7528",
    "recovery.clock.continue": "\u7EE7\u7EED",
    "recovery.clock.wallet": "\u94B1\u5305",
    "recovery.clock.manualEntry": "\u6821\u6B63\u65F6\u949F",
    "recovery.clock.futureLockWarning": "\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u4E0E\u533A\u5757\u94FE\u65F6\u95F4\u76F8\u5DEE\u5F88\u5927\u3002\u7EE7\u7EED\u4F7F\u7528\u53EF\u80FD\u65E0\u6CD5\u63A5\u6536\u5176\u4ED6\u73A9\u5BB6\u7684\u53D1\u8A00\u3001\u6295\u7968\u3001\u4E3E\u62A5\u6216\u5DF2\u8BFB\u56DE\u6267\u3002\u8BF7\u5C06\u65F6\u949F\u6821\u6B63\u4E3A\u6B63\u786E\u7684\u65F6\u95F4\u3002",
    "recovery.clock.futureEarlyWarning": "\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u6BD4\u533A\u5757\u94FE\u65F6\u95F4\u5FEB\u5F88\u591A\u3002\u60A8\u53EF\u80FD\u65E0\u6CD5\u53CA\u65F6\u4E3A\u5176\u4ED6\u73A9\u5BB6\u622A\u6B62\u524D\u7684\u6295\u7968\u51FA\u5177\u6536\u636E\uFF0C\u4E5F\u53EF\u80FD\u65E0\u6CD5\u6807\u8BB0\u4ED6\u4EEC\u7684\u53D1\u8A00\u4E3A\u5DF2\u8BFB\u3002\u60A8\u7684\u53D1\u8A00\u548C\u6295\u7968\u53EF\u80FD\u8F83\u665A\u5230\u8FBE\u5176\u4ED6\u73A9\u5BB6\u3002\u8BF7\u5C06\u65F6\u949F\u6821\u6B63\u4E3A\u6B63\u786E\u7684\u65F6\u95F4\u3002",
    "recovery.clock.warningContinue": "\u7EE7\u7EED\u4F7F\u7528",
    "recovery.clock.bandLate": "\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u6BD4\u533A\u5757\u94FE\u65F6\u95F4\u6162\u7EA6{seconds}\u79D2\uFF08\u4F4E\u4E8E100\u79D2\u65F6\u8B66\u544A\u6D88\u5931\uFF09\u3002",
    "recovery.rpcStale.public": "\u4ECE\u533A\u5757\u94FE\u8BFB\u53D6\u7684\u533A\u5757\u6BD4\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u65E9\u7EA6{minutes}\u5206\u949F\u3002\u7528\u4E8E\u8BFB\u53D6\u7684\u516C\u5171\u8282\u70B9\u53EF\u80FD\u540C\u6B65\u6EDE\u540E\uFF0C\u6216\u8005\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u53EF\u80FD\u504F\u5FEB\uFF08\u5982\u679C\u51FA\u73B0\u65F6\u949F\u8B66\u544A\uFF0C\u8BF7\u6309\u7167\u8B66\u544A\u6821\u6B63\u65F6\u949F\uFF09\u3002\u540D\u5355\u786E\u8BA4\uFF08\u804A\u5929\u5F00\u59CB\uFF09\u548C\u622A\u6B62\u65F6\u95F4\u5224\u65AD\u53EF\u80FD\u4F1A\u5EF6\u8FDF\u3002\u5728\u4EE5\u592A\u574A\u4E3B\u7F51\u4E0A\u8FDE\u63A5\u6D4F\u89C8\u5668\u6269\u5C55\u94B1\u5305\u53EF\u80FD\u4F1A\u89E3\u51B3\u6B64\u95EE\u9898\u3002\u8BFB\u53D6\u7684\u533A\u5757\u6062\u590D\u4E3A\u6700\u65B0\u540E\uFF0C\u6B64\u63D0\u793A\u7EA6\u4E00\u5206\u949F\u540E\u6D88\u5931\u3002",
    "recovery.rpcStale.wallet": "\u4ECE\u60A8\u7684\u94B1\u5305\u8BFB\u53D6\u7684\u533A\u5757\u6BD4\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u65E9\u7EA6{minutes}\u5206\u949F\u3002\u60A8\u7684\u94B1\u5305\u4F7F\u7528\u7684\u8282\u70B9\u53EF\u80FD\u540C\u6B65\u6EDE\u540E\uFF0C\u6216\u8005\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u53EF\u80FD\u504F\u5FEB\uFF08\u5982\u679C\u51FA\u73B0\u65F6\u949F\u8B66\u544A\uFF0C\u8BF7\u6309\u7167\u8B66\u544A\u6821\u6B63\u65F6\u949F\uFF09\u3002\u540D\u5355\u786E\u8BA4\uFF08\u804A\u5929\u5F00\u59CB\uFF09\u548C\u622A\u6B62\u65F6\u95F4\u5224\u65AD\u53EF\u80FD\u4F1A\u5EF6\u8FDF\u3002\u5728\u94B1\u5305\u8BBE\u7F6E\u4E2D\u5207\u6362\u7F51\u7EDC\u8282\u70B9\uFF08RPC\uFF09\u53EF\u80FD\u4F1A\u89E3\u51B3\u6B64\u95EE\u9898\u3002\u8BFB\u53D6\u7684\u533A\u5757\u6062\u590D\u4E3A\u6700\u65B0\u540E\uFF0C\u6B64\u63D0\u793A\u7EA6\u4E00\u5206\u949F\u540E\u6D88\u5931\u3002",
    "recovery.clock.bandEarly": "\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u6BD4\u533A\u5757\u94FE\u65F6\u95F4\u5FEB\u7EA6{seconds}\u79D2\uFF08\u4F4E\u4E8E120\u79D2\u65F6\u8B66\u544A\u6D88\u5931\uFF09\u3002",
    "recovery.clock.bandDeadline": "\u6309\u60A8\u7684\u65F6\u949F\u8BA1\u7B97\u7684\u6295\u7968\u622A\u6B62\u65F6\u95F4\uFF1A{time}\uFF08\u8BF7\u4EE5\u6B64\u65F6\u95F4\u4E3A\u51C6\uFF0C\u4E0D\u8981\u4EE5\u901A\u77E5\u4E2D\u7684\u65F6\u95F4\u4E3A\u51C6\uFF09",
    "recovery.clock.cooldownRejected": "\u5728\u5341\u5206\u949F\u95F4\u9694\u5185\uFF0C\u53EA\u80FD\u8FDB\u884C\u5BF9\u7167\u533A\u5757\u94FE\u65F6\u95F4\u540E\u53EF\u6D88\u9664\u6B64\u8B66\u544A\u7684\u6821\u6B63\uFF08\u65E0\u6CD5\u8BFB\u53D6\u533A\u5757\u94FE\u65F6\u95F4\u65F6\u4E0D\u53EF\u6821\u6B63\uFF09\u3002",
    "recovery.clock.cooldown": "{minutes} \u5206\u949F\u540E\u53EF\u518D\u6B21\u6821\u6B63",
    "recovery.clock.manualHeading": "\u6821\u6B63\u6B64\u8BBE\u5907\u7684\u65F6\u949F\u3002\u8BF7\u8F93\u5165\u4E0E\u6B63\u786E\u65F6\u95F4\u7684\u5DEE\u503C\u3002",
    "recovery.clock.offset": "\u504F\u5DEE\uFF1A{offset} \u79D2",
    "recovery.clock.neutralSignHelp": "\u82E5\u6B64\u8BBE\u5907\u504F\u5FEB\u8BF7\u8F93\u5165 \u2212\uFF0C\u504F\u6162\u8BF7\u8F93\u5165 \uFF0B\u3002",
    "recovery.clock.reloadAfterDeviceFix": "\u5982\u679C\u4F60\u5728\u8BBE\u5907\u8BBE\u7F6E\u4E2D\u6821\u6B63\u4E86\u65F6\u949F\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u6B64\u9875\u9762\u3002",
    "recovery.clock.checking": "\u786E\u8BA4\u4E2D\u2026",
    "recovery.clock.back": "\u8FD4\u56DE",
    "recovery.clock.reissueRisk": "\u5728\u804A\u5929\u671F\u95F4\u5C06\u65F6\u949F\u8C03\u6162\uFF08\u8F93\u5165 \u2212\uFF09\u65F6\uFF0C\u4F1A\u6309\u6821\u6B63\u540E\u7684\u65F6\u95F4\u91CD\u65B0\u53D1\u653E\u6700\u8FD110\u5206\u949F\u7684\u5DF2\u8BFB\u56DE\u6267\u3002\u91CD\u65B0\u53D1\u653E\u8F83\u591A\u65F6\uFF08\u521A\u7ECF\u5386\u5BC6\u96C6\u5BF9\u8BDD\u540E\u3001\u591A\u6B21\u8C03\u6162\u3001\u6216\u5728\u591A\u53F0\u8BBE\u5907\u6216\u5B98\u65B9\u9875\u9762\u4E0E\u6062\u590D\u5BA2\u6237\u7AEF\u4E0A\u540C\u65F6\u53C2\u4E0E\u65F6\uFF09\uFF0C\u5176\u4ED6\u73A9\u5BB6\u7684\u753B\u9762\u4E0A\u53EF\u80FD\u4F1A\u663E\u793A\u5EFA\u8BAE\u4E3E\u62A5\u505A\u51FA\u6821\u6B63\u7684\u73A9\u5BB6\u7684\u8B66\u544A\uFF08\u4F8B\u5982 P2P \u4E2D1000\u4E2A\u4E8B\u4EF6\u7684\u6D2A\u6CDB\u8B66\u544A\u3001\u540C\u4E00\u53D1\u8A00\u76845\u5F20\u4E0D\u540C\u5DF2\u8BFB\u56DE\u6267\u8B66\u544A\u3001\u90E8\u5206\u91CD\u53E0\u76845\u5F20\u5DF2\u8BFB\u56DE\u6267\u8B66\u544A\uFF09\u3002",
    "recovery.operatorRpc.configured": "\u6B64\u8BBE\u5907\u7684\u8BBE\u7F6E\u4E2D\u5305\u542B\u8FD0\u8425\u8282\u70B9\uFF08{host}\uFF09\u3002\u5F53\u94B1\u5305\u548C\u6240\u6709\u516C\u5171\u8282\u70B9\u90FD\u65E0\u5E94\u7B54\u65F6\uFF0C\u5C06\u5728\u4E0D\u9010\u6B21\u63D0\u793A\u7684\u60C5\u51B5\u4E0B\u4F7F\u7528\u8FD0\u8425\u8282\u70B9\u7684\u503C\u3002\u4FE1\u4EFB\u8FD0\u8425\u65B9\u4F1A\u9020\u6210\u5BF9\u8FD0\u8425\u65B9\u7684\u4F9D\u8D56\uFF0C\u56E0\u6B64\u4E0D\u63A8\u8350\u3002\u4ECE\u6B64\u8BBE\u5907\u7684\u8BBE\u7F6E\uFF08chatgameToolsConfig.operatorRpc\uFF09\u4E2D\u79FB\u9664\u5373\u53EF\u505C\u6B62\u4F7F\u7528\u3002",
    "recovery.refresh": "\u5237\u65B0",
    "recovery.refreshing": "\u6B63\u5728\u4ECE\u94FE\u4E0A\u91CD\u65B0\u8BFB\u53D6\u65F6\u95F4\u7EBF\u2026",
    "recovery.refreshed": "\u65F6\u95F4\u7EBF\u5DF2\u66F4\u65B0\uFF08\u9636\u6BB5\uFF1A{phase} / grace\uFF1A{grace}s\uFF09",
    "recovery.days": "\u5929",
    "recovery.phaseName.waiting": "\u7B49\u5F85\u5F00\u59CB",
    "recovery.phaseName.chatting": "\u804A\u5929\u671F",
    "recovery.phaseName.submitting": "\u63D0\u4EA4\u671F",
    "recovery.phaseName.completed": "\u5B8C\u6210",
    "recovery.phaseName.aggregating": "\u7ED3\u679C\u7EDF\u8BA1",
    "recovery.phaseName.verification": "\u9A8C\u8BC1\u671F",
    "recovery.phaseName.claimable": "\u9886\u53D6\u671F",
    "recovery.phaseName.aggregatingWait": "\u6B63\u5728\u7EDF\u8BA1\u7ED3\u679C\uFF0C\u8BF7\u7B49\u5F85\u94FE\u4E0A\u63D0\u4EA4\u5B8C\u6210\u3002",
    "recovery.waiting.description": "\u5C0F\u7EC4\u5DF2\u786E\u5B9A\u3002\u8BF7\u7B49\u5F85\u804A\u5929\u5F00\u59CB\uFF08\u89C1\u4E0A\u65B9\u5012\u8BA1\u65F6\uFF09\u3002\u6295\u7968\u4E0E\u4E3E\u62A5\u4EC5\u53EF\u5728\u804A\u5929\u671F\u5185\u8FDB\u884C\u3002",
    "recovery.connection.connected": "\u5DF2\u8FDE\u63A5\uFF08\u4E2D\u7EE7\uFF09",
    "recovery.connection.title": "\u8FDE\u63A5\u72B6\u6001",
    "recovery.connection.p2p": "P2P\u4E2D\u7EE7\uFF08Nostr\uFF09",
    "recovery.connection.relayConnected": "{connected}/{total} \u5DF2\u8FDE\u63A5",
    "recovery.connection.p2pDescription": "\u4E2D\u7EE7\u662F\u6E38\u620F\u670D\u52A1\u5668\u88AB\u5BA1\u67E5\u65F6\u7684\u5197\u4F59\u901A\u9053\u3002\u53EA\u8981\u6709\u4E00\u4E2A\u8FDE\u63A5\uFF0C\u4F60\u7684\u53D1\u8A00/\u6295\u7968/\u4E3E\u62A5\u5C31\u4F1A\u7ED5\u8FC7\u670D\u52A1\u5668\u9001\u8FBE\u5168\u7EC4\u3002",
    "recovery.connection.settingsTitle": "\u4E2D\u7EE7\u5217\u8868",
    "recovery.connection.settingsDesc": "\u6DFB\u52A0\u72EC\u7ACB\u4E2D\u7EE7\uFF08\u6BCF\u884C\u4E00\u4E2A URL\uFF09\u2014\u2014\u5F53\u9ED8\u8BA4\u4E2D\u7EE7\u5168\u90E8\u88AB\u5BA1\u67E5\u65F6\u552F\u4E00\u7684\u9003\u751F\u901A\u9053\u3002",
    "recovery.status.connected": "\u5DF2\u8FDE\u63A5",
    "recovery.status.connecting": "\u8FDE\u63A5\u4E2D",
    "recovery.status.disconnected": "\u5DF2\u65AD\u5F00",
    "recovery.connection.connecting": "\u8FDE\u63A5\u4E2D\uFF08\u4E2D\u7EE7\uFF09",
    "recovery.connection.disconnected": "\u5DF2\u65AD\u5F00\uFF08\u4E2D\u7EE7\uFF09",
    "recovery.members.depositPoints": "\u8D28\u62BC\u70B9\u6570",
    "recovery.members.depositPointsCorrected": "\u5DF2\u6309\u94FE\u4E0A\u6570\u503C\u66F4\u6B63",
    "recovery.members.depositPointsUnverified": "\u672A\u786E\u8BA4",
    "recovery.members.chars": "\u5B57\u7B26",
    "recovery.members.times": "\u6B21",
    "recovery.members.voted": "\u5DF2\u6295\u7968",
    "recovery.members.reported": "\u5DF2\u4E3E\u62A5",
    "recovery.members.invalidReadReceipt": "\u68C0\u6D4B\u5230\u4E0D\u6B63\u5F53\u7684\u6536\u636E\u7B7E\u53D1 \u2014 \u5EFA\u8BAE\u4E3E\u62A5",
    "recovery.members.fraudulentReceipts": "{name} \u53EF\u80FD\u901A\u8FC7\u53D1\u653E\u4E0D\u6B63\u5F53\u7684\u56DE\u6267\u6765\u59A8\u788D\u6E38\u620F\u3002\u5EFA\u8BAE\u4E3E\u62A5 {name}\u3002",
    "recovery.members.suspiciousReporting": "{name}\u6B63\u5728\u8FDB\u884C\u4E0D\u6B63\u5F53\u7684\u4E3E\u62A5\u3002\u5EFA\u8BAE\u4E3E\u62A5{name}\u3002",
    "recovery.members.suspiciousReportingShort": "{name}\u6B63\u5728\u8FDB\u884C\u4E0D\u6B63\u5F53\u7684\u4E3E\u62A5\u3002",
    "recovery.action.reportRevealWarning": "\u76EE\u524D\u53EA\u6709{A}\u6EE1\u8DB3\u4E3E\u62A5\u6761\u4EF6\uFF08\u6295\u7968\u5DF2\u786E\u8BA4\uFF09\uFF0C\u5176\u4ED6\u73A9\u5BB6\u53EF\u80FD\u4F1A\u5BDF\u89C9\u4F60\u4E3E\u62A5\u4E86{A}\u3002\u5C24\u5176\u662F{A}\u66F4\u6709\u53EF\u80FD\u53CD\u8FC7\u6765\u4E3E\u62A5\u4F60\u3002\u786E\u5B9A\u8981\u7EE7\u7EED\u4E3E\u62A5\u5417\uFF1F\u5EFA\u8BAE\u7B49\u5176\u4ED6\u73A9\u5BB6\u7684\u6295\u7968\u786E\u8BA4\u540E\u518D\u4E3E\u62A5\u3002",
    "recovery.action.reportRevealWarningLate": "\u76EE\u524D\u53EA\u6709{A}\u6EE1\u8DB3\u4E3E\u62A5\u6761\u4EF6\uFF08\u6295\u7968\u5DF2\u786E\u8BA4\uFF09\uFF0C\u5176\u4ED6\u73A9\u5BB6\u53EF\u80FD\u4F1A\u5BDF\u89C9\u4F60\u4E3E\u62A5\u4E86{A}\u3002\u5C24\u5176\u662F{A}\u66F4\u6709\u53EF\u80FD\u53CD\u8FC7\u6765\u4E3E\u62A5\u4F60\u3002\u786E\u5B9A\u8981\u7EE7\u7EED\u4E3E\u62A5\u5417\uFF1F",
    "recovery.action.reportRevealProceed": "\u4E3E\u62A5",
    "recovery.action.reportRevealCancel": "\u53D6\u6D88",
    "recovery.members.invalidReadReceiptTip": "\u8FD9\u53EA\u662F\u4E3E\u62A5\u5EFA\u8BAE\u3002\u5B9E\u9645\u4E3E\u62A5\u4ECD\u9700\u672C\u4EBA\u7B7E\u540D\uFF0C\u5E76\u6EE1\u8DB3\u901A\u5E38\u6761\u4EF6\uFF08\u81F3\u5C11\u4E24\u540D\u4E3E\u62A5\u8005\uFF0C\u4E14\u4E3E\u62A5\u8005\u79EF\u5206\u603B\u548C\u8D85\u8FC7\u76EE\u6807\uFF09\u3002",
    "recovery.members.multipleSessionsWarning": "\u68C0\u6D4B\u5230\u591A\u4E2A\u753B\u9762\u540C\u65F6\u53C2\u4E0E\u3002\u5982\u679C\u7EE7\u7EED\u4F7F\u7528\u591A\u4E2A\u8BBE\u5907\u6216\u6807\u7B7E\u9875\u53C2\u4E0E\uFF0C\u60A8\u53EF\u80FD\u4F1A\u88AB\u89C6\u4E3A Bot\uFF0C\u5176\u4ED6\u73A9\u5BB6\u4E5F\u4F1A\u770B\u5230\u5EFA\u8BAE\u4E3E\u62A5\u60A8\u7684\u8B66\u544A\u3002\u8BF7\u53EA\u4F7F\u7528\u4E00\u4E2A\u753B\u9762\u53C2\u4E0E\u3002\u5728\u60A8\u9009\u62E9\u5176\u4E2D\u4E00\u4E2A\u9009\u9879\u4E4B\u524D\uFF0C\u6B64\u753B\u9762\u5C06\u6309\u79BB\u5F00\u5904\u7406\uFF0C\u4E0D\u4F1A\u53D1\u51FA\u5DF2\u8BFB\u56DE\u6267\u3002",
    "recovery.session.resume": "\u6211\u5DF2\u5173\u95ED\u5176\u4ED6\u8BBE\u5907\u6216\u6807\u7B7E\u9875\uFF0C\u5728\u6B64\u6807\u7B7E\u9875\u7EE7\u7EED",
    "recovery.session.close": "\u5173\u95ED\u6B64\u6807\u7B7E\u9875",
    "recovery.session.ended": "\u6B64\u6807\u7B7E\u9875\u5DF2\u7ED3\u675F\u3002\u82E5\u8981\u7EE7\u7EED\uFF0C\u8BF7\u4F7F\u7528\u5F53\u524D\u4F7F\u7528\u7684\u8BBE\u5907\u4E0A\u7684\u753B\u9762\u3002\u91CD\u65B0\u52A0\u8F7D\u6B64\u6807\u7B7E\u9875\u5373\u53EF\u5728\u6B64\u7EE7\u7EED\u53C2\u4E0E\u3002",
    "recovery.import.title": "\u5BFC\u5165\u5B98\u65B9\u5BA2\u6237\u7AEF\u7684 localStorage",
    "recovery.import.description": "\u5728\u5B98\u65B9\u6E38\u620F\u9875\u9762\u7684\u5F00\u53D1\u8005\u5DE5\u5177 Console \u8FD0\u884C\u4E0B\u65B9\u4EE3\u7801\u5E76\u590D\u5236 JSON\u3002\u5173\u95ED\u5B98\u65B9\u9875\u9762\u540E\uFF0C\u5728\u6B64\u70B9\u51FB\u201C{signLabel}\u201D\uFF0C\u7136\u540E\u7C98\u8D34 JSON\u3002\u4EC5\u4F7F\u7528\u5E76\u9A8C\u8BC1\u5F53\u524D\u533A\u5757\u3001\u5C0F\u7EC4\u53CA\u672C\u4EBA\u6570\u636E\u3002\u804A\u5929\u6D88\u606F\u4E0D\u4ECE\u5B98\u65B9\u672C\u5730\u5B58\u50A8\u5BFC\u5165\uFF0C\u800C\u662F\u4ECE\u4E2D\u7EE7\u6216\u516C\u5F00 live \u83B7\u53D6\u3002\u5BFC\u5165\u7684\u6295\u7968\u548C\u4E3E\u62A5\u5728\u91CD\u65B0\u52A0\u8F7D\u540E\u4E0D\u4F1A\u4FDD\u7559\uFF1B\u53EF\u91CD\u65B0\u5BFC\u5165\uFF0C\u6216\u7528 Evidence \u6551\u63F4\u6309\u94AE\u53D1\u9001\u5DF2\u4FDD\u5B58\u7684\u5B98\u65B9\u63D0\u4EA4\u6570\u636E\u3002",
    "recovery.import.button": "\u5BFC\u5165\u5DF2\u4FDD\u5B58\u7684\u6E38\u620F\u6570\u636E",
    "recovery.import.wait": "\u8BF7\u5148\u7528 Sign & load \u8BFB\u53D6\u5DF2\u786E\u8BA4\u7684\u540D\u5355\u3002",
    "recovery.import.done": "\u5DF2\u5BFC\u5165\u5E76\u9A8C\u8BC1\u4FDD\u5B58\u7684\u6570\u636E\uFF08\u6536\u636E {receipts}\uFF09\u3002",
    "recovery.import.failed": "\u5BFC\u5165\u5931\u8D25",
    "recovery.members.viewOnX": "\u5728X\u4E0A\u67E5\u770B",
    "recovery.members.playerNumber": "\u73A9\u5BB6{n}",
    "recovery.members.online": "\u6D3B\u8DC3",
    "recovery.members.offline": "\u8FD1\u671F\u65E0\u6D3B\u52A8",
    "recovery.members.activityTip": "\u4F9D\u636E\u4E2D\u7EE7\u6536\u5230\u7684\u5DF2\u7B7E\u540D\u804A\u5929/\u56DE\u6267\u7684\u6700\u65B0\u65F6\u95F4\u5224\u5B9A\u3002\u7531\u4E8E\u6CA1\u6709\u5728\u7EBF\u72B6\u6001\u534F\u8BAE\uFF0C\u65E0\u6CD5\u533A\u5206\u6C89\u9ED8\u4E0E\u79BB\u7EBF\u3002",
    "recovery.action.voteTitle": "\u4E3A\u6210\u5458\u6295\u7968\uFF08\u5FC5\u987B\uFF09",
    "recovery.action.voteProgressTurns": "\u6295\u7968\u540E\uFF0C\u5176\u4ED6\u6210\u5458\u53EF\u80FD\u4E0D\u518D\u613F\u610F\u4E3A\u60A8\u7684\u6D88\u606F\u6807\u8BB0\u5DF2\u8BFB\uFF0C\u4F7F\u8FBE\u5230{minMessages}\u6B21\u5BF9\u8BDD\u66F4\u56F0\u96BE\u3002\u5EFA\u8BAE\u8FBE\u5230{minMessages}\u6B21\u540E\u518D\u6295\u7968\u3002",
    "recovery.action.voteProgressChars": "\u6295\u7968\u540E\uFF0C\u5176\u4ED6\u6210\u5458\u53EF\u80FD\u4E0D\u518D\u613F\u610F\u4E3A\u60A8\u7684\u6D88\u606F\u6807\u8BB0\u5DF2\u8BFB\uFF0C\u4F7F\u8FBE\u5230\u6700\u4F4E{minChars}\u4E2A\u534A\u89D2\u5B57\u7B26\u66F4\u56F0\u96BE\u3002\u5EFA\u8BAE\u8FBE\u5230\u6700\u4F4E\u5B57\u6570\u540E\u518D\u6295\u7968\u3002",
    "recovery.action.voteProgressProceed": "\u6295\u7968",
    "recovery.action.voteProgressBack": "\u8FD4\u56DE",
    "recovery.action.deadlineVoteNotice": "\u6295\u7968\u4E0E\u804A\u5929\u6D88\u606F\u4E00\u6837\uFF0C\u5FC5\u987B\u5F97\u5230\u5176\u4ED6\u6210\u5458\u7684\u5DF2\u8BFB\u56DE\u6267\u624D\u6709\u6548\u3002\u6CA1\u6709\u6709\u6548\u6295\u7968\u5C06\u88AB\u53D6\u6D88\u8D44\u683C\u3002\u8BF7\u7559\u51FA\u8DB3\u591F\u65F6\u95F4\u6295\u7968\uFF0C\u4EE5\u4FBF\u5176\u4ED6\u6210\u5458\u6807\u8BB0\u5DF2\u8BFB\u3002",
    "recovery.action.deadlineVoteReceiptNotice": "\u6700\u540E10\u5206\u949F\u5185\u7684\u6295\u7968\u4E0D\u4F1A\u83B7\u5F97\u5DF2\u8BFB\u56DE\u6267\u3002\u8BF7\u7559\u51FA\u5145\u8DB3\u65F6\u95F4\u6295\u7968\uFF0C\u4EE5\u4FBF\u5728{time}\u4E4B\u524D\u83B7\u5F97\u5DF2\u8BFB\u56DE\u6267\u3002",
    "recovery.action.votingClosed": "\u6295\u7968\u5DF2\u622A\u6B62\u3002",
    "recovery.action.noticeClose": "\u5173\u95ED",
    "recovery.action.receiptNotice": "\u6295\u7968\u548C\u4E3E\u62A5\u5728\u5176\u4ED6\u6210\u5458\u6807\u8BB0\u5DF2\u8BFB\uFF08\u6536\u5230\uFF09\u524D\u4E0D\u4F1A\u751F\u6548\u3002\u786E\u8BA4\u6536\u5230\u56DE\u6267\u4E4B\u524D\u8BF7\u52FF\u5173\u95ED\u6B64\u753B\u9762\u3002",
    "recovery.action.voteDescription": "\u5FC5\u987B\u4E3A\u4E00\u540D\u6210\u5458\u6295\u7968\u3002\u88AB\u6295\u7968\u8005\u5C06\u83B7\u5F97\u4E0E\u4F60\u7684\u8D28\u62BC\u70B9\u6570\u76F8\u540C\u7684\u6295\u7968\u70B9\u6570\u3002",
    "recovery.action.reportTitle": "\u4E3E\u62A5\u6210\u5458",
    "recovery.action.reportDescription": "\u5982\u679C\u6000\u7591\u67D0\u6210\u5458\u662F AI \u6216\u673A\u5668\u4EBA\uFF0C\u53EF\u4EE5\u4E3E\u62A5\uFF08\u6700\u591A 2 \u540D\uFF09\u3002\u76EE\u6807\u7684\u6295\u7968\u987B\u5F97\u5230\u4F60\u548C\u76EE\u6807\u4EE5\u5916\u6210\u5458\u7684\u5DF2\u8BFB\u56DE\u6267\uFF0C\u4E4B\u540E\u624D\u80FD\u4E3E\u62A5\u3002\u6700\u540E10\u5206\u949F\u53EF\u4E3E\u62A5\u4EFB\u4F55\u4EBA\uFF0C\u4F46\u76EE\u6807\u7684\u6295\u7968\u672A\u786E\u8BA4\u65F6\u4E3E\u62A5\u65E0\u6548\u3002",
    "recovery.action.voteConfirm": "\u5C06\u6295\u7968\u7ED9{name}\u3002\u4E00\u65E6\u6295\u7968\u5C06\u65E0\u6CD5\u66F4\u6539\u3002\u5373\u4F7F\u56E0\u672A\u8BFB\u800C\u5931\u6548\uFF0C\u4E5F\u65E0\u6CD5\u66F4\u6539\u6295\u7968\u5BF9\u8C61\u3002\u786E\u5B9A\u5417\uFF1F",
    "recovery.action.voteSuccess": "\u6295\u7968\u5DF2\u4EE5\u52A0\u5BC6\u72B6\u6001\u63D0\u4EA4\u3002",
    "recovery.action.reportConfirm": "\u5C06\u4E3E\u62A5{name}\u3002\u4E00\u65E6\u4E3E\u62A5\u5C06\u65E0\u6CD5\u66F4\u6539\u3002\u786E\u5B9A\u5417\uFF1F",
    "recovery.action.reportSuccess": "\u4E3E\u62A5\u5DF2\u4EE5\u52A0\u5BC6\u72B6\u6001\u63D0\u4EA4\u3002",
    "recovery.sameDeviceBand.reportGround": "\u5EFA\u8BAE\u5728\u6B64\u8BBE\u5907\u4E0A\u5B8C\u6210\u63D0\u4EA4\u3002\u66F4\u6362\u8BBE\u5907\u6216\u6D4F\u89C8\u5668\u540E\uFF0C\u5C06\u65E0\u6CD5\u4FDD\u8BC1\u60A8\u7684\u4E3E\u62A5\u88AB\u6709\u6548\u53D7\u7406\u3002",
    "recovery.sameDeviceBand.conversationMemory": "\u8BF7\u4E0D\u8981\u5173\u95ED\u6B64\u9875\u9762\uFF0C\u5E76\u5728\u672C\u8BBE\u5907\u4E0A\u63D0\u4EA4\u3002\u5728\u5176\u4ED6\u8BBE\u5907\u6216\u91CD\u65B0\u6253\u5F00\u7684\u9875\u9762\u4E0A\uFF0C\u4F1A\u4E22\u5931\u90E8\u5206\u5BF9\u8BDD\u8BB0\u5F55\uFF0C\u5BF9\u8BDD\u6B21\u6570\u5C06\u8FBE\u4E0D\u523020\u3002",
    "recovery.sameDeviceBand.switchClient": "\u5728\u5B98\u65B9\u9875\u9762\u4E0E\u6062\u590D\u5BA2\u6237\u7AEF\u4E4B\u95F4\u5207\u6362\u65F6\uFF0C\u4E5F\u53EF\u80FD\u4E22\u5931\u6B64\u8BBE\u5907\u4FDD\u5B58\u7684\u90E8\u5206\u4FE1\u606F\uFF0C\u4F8B\u5982\u4E3E\u62A5\u4F9D\u636E\u3002",
    "recovery.sameDeviceBand.reportGroundSaveFailed": "\u65E0\u6CD5\u5728\u6B64\u8BBE\u5907\u4E0A\u4FDD\u5B58\u4E3E\u62A5\u4F9D\u636E\u3002\u8BF7\u4E0D\u8981\u5173\u95ED\u6216\u91CD\u65B0\u52A0\u8F7D\u6B64\u9875\u9762\uFF0C\u76F4\u63A5\u5728\u5F53\u524D\u9875\u9762\u5B8C\u6210\u63D0\u4EA4\u3002",
    "recovery.action.deadlineWarning": "\u26A0 \u6295\u7968\u987B\u5728\u804A\u5929\u7ED3\u675F\u524D10\u5206\u949F\u5B8C\u6210\uFF0C\u4E3E\u62A5\u4EC5\u53EF\u5728\u804A\u5929\u671F\u95F4\u8FDB\u884C\u3002\u672A\u6295\u7968\u5C06\u88AB\u53D6\u6D88\u8D44\u683C\u3002\u53D1\u51FA\u540E\u4E0D\u53EF\u66F4\u6539\u6216\u64A4\u56DE\u3002",
    "recovery.chat.charCount": "\u5B57\u6570",
    "recovery.chat.minCharProgress": "\u6240\u9700\u5B57\u6570",
    "recovery.chat.maxCharProgress": "\u5B57\u6570\u53D1\u9001\u4E0A\u9650",
    "recovery.chat.minTurnProgress": "\u6240\u9700\u5BF9\u8BDD\u6B21\u6570",
    "recovery.chat.futureMessages": "\u672A\u6765\u65F6\u95F4\u7684\u53D1\u8A00\uFF1A{count}\u6761",
    "recovery.chat.futureActions": "\u672A\u6765\u65F6\u95F4\u7684\u6295\u7968\uFF0F\u4E3E\u62A5\uFF1A{count}\u6761",
    "recovery.chat.priorityNotReady": "\u540D\u5355\u548C\u804A\u5929\u7A97\u53E3\u5728\u94FE\u4E0A\u786E\u8BA4\u4E4B\u524D\uFF0C\u4F18\u5148\u680F\u6240\u4FDD\u62A4\u7684\u5BF9\u8BDD\u6B21\u6570\u663E\u793A\u4E3A0\uFF08\u786E\u8BA4\u540E\u663E\u793A\u4F1A\u66F4\u65B0\uFF09\u3002",
    "recovery.chat.priorityPlanFailed": "\u672A\u80FD\u89C4\u5212\u4F18\u5148\u680F\uFF1B\u4F18\u5148\u680F\u6240\u4FDD\u62A4\u7684\u5BF9\u8BDD\u6B21\u6570\u663E\u793A\u4E3A0\u3002",
    "recovery.chat.maxPostProgress": "\u53D1\u8A00\u53D1\u9001\u4E0A\u9650",
    "recovery.chat.capRemaining": "\u5269\u4F59",
    "recovery.chat.msgCount": "\u53D1\u8A00\u6B21\u6570",
    "recovery.chat.send": "\u53D1\u9001",
    "recovery.chat.historyLoading": "\u6B63\u5728\u52A0\u8F7D\u5386\u53F2\u8BB0\u5F55",
    "recovery.chat.ownHistoryPrompt": "\u6570\u636E\u5C1A\u672A\u52A0\u8F7D\u5B8C\u6210\uFF0C\u4F1A\u8BDD\u8BB0\u5F55/\u5B57\u6570/\u53D1\u8A00\u6570\u53EF\u80FD\u4E0D\u5B8C\u6574\u3002\u8981\u7B49\u5F85\u52A0\u8F7D\u5B8C\u6210\uFF0C\u8FD8\u662F\u6CE8\u610F\u5B57\u6570\u548C\u53D1\u8A00\u6570\u7684\u4E0A\u9650\u5E76\u5F00\u59CB\u804A\u5929\uFF1F",
    "recovery.chat.ownHistoryWaitingRelays": "\u4ECD\u5728\u52A0\u8F7D\u7684\u4E2D\u7EE7\uFF1A{relays}",
    "recovery.chat.ownHistoryWait": "\u7B49\u5F85",
    "recovery.chat.ownHistoryStart": "\u6CE8\u610F\u5B57\u6570\u548C\u53D1\u8A00\u6570\u7684\u4E0A\u9650\u5E76\u5F00\u59CB\u804A\u5929",
    "recovery.chat.inputPlaceholder": "\u8F93\u5165\u6D88\u606F...",
    "recovery.chat.minCharsRemaining": "\u8DDD\u6240\u9700\u5B57\u6570\u8FD8\u5DEE",
    "recovery.chat.minCharsReached": "\u5DF2\u8FBE\u6240\u9700\u5B57\u6570",
    "recovery.chat.maxCharsReached": "\u65E0\u6CD5\u53D1\u9001\uFF1A\u6B64\u6761\u6D88\u606F\u5C06\u8D85\u8FC7\u603B\u5B57\u6570\u4E0A\u9650",
    "recovery.chat.turnCount": "\u5BF9\u8BDD\u6B21\u6570",
    "recovery.chat.minMsgsRemaining": "\u8DDD\u6240\u9700\u5BF9\u8BDD\u6B21\u6570\u8FD8\u5DEE",
    "recovery.chat.minMsgsReached": "\u5DF2\u8FBE\u6240\u9700\u5BF9\u8BDD\u6B21\u6570",
    "recovery.chat.maxMsgsReached": "\u5DF2\u8FBE\u53D1\u8A00\u6B21\u6570\u4E0A\u9650",
    // P-2026-0844: 发送门限（对应本体 ChatPhase 的 game.chat.msgTooLong）
    "recovery.chat.msgTooLong": "\u8D85\u8FC7\u5355\u6761\u6D88\u606F\u4E0A\u9650\uFF08\u534A\u89D2{max}\u5B57\uFF09\u3002\u5373\u4F7F\u53D1\u9001\uFF0C\u8BA1\u5206\u65F6\u4E5F\u4F1A\u88AB\u6574\u6761\u5254\u9664 \u2014 \u8BF7\u5206\u5F00\u53D1\u9001\u3002",
    "recovery.chat.invisibleOnly": "\u6CA1\u6709\u53EF\u89C1\u5185\u5BB9\uFF0C\u65E0\u6CD5\u53D1\u9001\uFF08\u8BA1\u5206\u65F6\u4E5F\u4E0D\u4F1A\u8BA1\u5165\uFF09\u3002",
    "recovery.chat.voteStatus": "\u6295\u7968",
    "recovery.chat.voteDone": "\u5B8C\u6210",
    "recovery.chat.voteNotYet": "\u5C1A\u672A",
    "recovery.chat.votePending": "\u8BF7\u6295\u7968",
    "recovery.chat.voteCleared": "\u6295\u7968\u5B8C\u6210",
    "recovery.chat.voteAwaitingReceipt": "\u7B49\u5F85\u56DE\u6267\uFF08\u5176\u4ED6\u6210\u5458\u63A5\u6536\u540E\u786E\u8BA4\uFF09",
    "recovery.chat.readBadge": "\u5DF2\u8BFB{count}",
    "recovery.chat.idleOverlay": "\u7531\u4E8E10\u5206\u949F\u672A\u68C0\u6D4B\u5230\u64CD\u4F5C\uFF0C\u60A8\u5DF2\u8FDB\u5165\u79BB\u7EBF\u72B6\u6001\u3002\u5728\u6B64\u72B6\u6001\u4E0B\uFF0C\u6536\u5230\u7684\u6D88\u606F\u4E0D\u4F1A\u6807\u8BB0\u4E3A\u5DF2\u8BFB\u3002",
    "recovery.chat.unreadBadge": "\u672A\u8BFB",
    "recovery.chat.voidBadge": "\u5DF2\u5931\u6548",
    "recovery.chat.bubbleVote": "\u6295\u7968",
    "recovery.chat.bubbleReport": "\u4E3E\u62A5\uFF08\u7B2C{nth}\u6B21\uFF09",
    "recovery.action.voteResendConfirm": "\u4F60\u4E0A\u4E00\u6B21\u7684\u6295\u7968\u572810\u5206\u949F\u5185\u672A\u88AB\u4EFB\u4F55\u4EBA\u63A5\u6536\uFF0C\u5DF2\u5931\u6548\u3002\u8981\u5411\u540C\u4E00\u6210\u5458{name}\u91CD\u65B0\u53D1\u9001\u5417\uFF1F",
    "recovery.action.reportResendConfirm": "\u4F60\u4E0A\u4E00\u6B21\u7684\u4E3E\u62A5\u572810\u5206\u949F\u5185\u672A\u88AB\u4EFB\u4F55\u4EBA\u63A5\u6536\uFF0C\u5DF2\u5931\u6548\u3002\u8981\u5411\u540C\u4E00\u6210\u5458{name}\u91CD\u65B0\u53D1\u9001\u5417\uFF1F",
    "recovery.action.resendLabel": "\u91CD\u53D1",
    // J-35（§6.9 追补・规则版本2）: 举报资格未达标（还差几条）
    "recovery.action.reportNeedsReads": "\u8FD8\u9700{count}\u6761\u53D1\u8A00",
    "recovery.action.voteVoidResend": "\u6295\u7968\u5DF2\u5931\u6548\uFF0810\u5206\u949F\u5185\u65E0\u4EBA\u63A5\u6536\uFF09\u3002\u8BF7\u5411\u540C\u4E00\u6210\u5458\u91CD\u65B0\u53D1\u9001",
    "recovery.action.voteVoidNoResend": "\u622A\u6B62\u524D\u672A\u6536\u5230\u5DF2\u8BFB\u56DE\u6267\uFF0C\u65E0\u6CD5\u91CD\u65B0\u53D1\u9001",
    "recovery.action.reportWaitingVote": "\u7B49\u5F85\u6295\u7968\u786E\u8BA4",
    "recovery.action.reportVoteNotVisible": "\u770B\u4E0D\u5230\u8BE5\u73A9\u5BB6\u7684\u5DF2\u786E\u8BA4\u6295\u7968\uFF08\u5982\u679C\u5BF9\u65B9\u6CA1\u6709\u6295\u7968\uFF0C\u6B64\u4E3E\u62A5\u65E0\u6548\uFF09",
    "recovery.completedMsg": "\u672C\u533A\u5757\u7684\u6E38\u620F\u5DF2\u7ED3\u675F\u3002",
    "recovery.entryWait": "\u6E38\u620F\u5C1A\u672A\u5F00\u59CB\uFF08\u62A5\u540D\u671F\u95F4\uFF09\u3002\u8BF7\u7B49\u5F85\u6E38\u620F\u5F00\u59CB\u3002",
    "recovery.relaySettings": "\u4E2D\u7EE7\u8BBE\u7F6E\uFF08\u6DFB\u52A0\u72EC\u7ACB\u4E2D\u7EE7\u662F\u4F60\u552F\u4E00\u7684\u9003\u751F\u901A\u9053\uFF09",
    "recovery.warn.applicantHashRegistrationCount": "\u8B66\u544A\uFF1AapplicantHash \u7684\u6CE8\u518C\u6B21\u6570\u4E3A {registrationCount}\uFF0C\u9884\u671F\u4E3A1\u3002\u66FF\u6362\u8BB0\u5F55\u4ECD\u5728\u94FE\u4E0A\u53EF\u89C1\uFF0C\u6062\u590D\u6D41\u7A0B\u5C06\u7EE7\u7EED\u3002",
    "recovery.warn.anchoredRosterFallback.previousSummaryMismatch": "\u94FE\u4E0A\u951A\u5B9A\u7684\u524D\u4E00\u533A\u5757\u7ED3\u679C\u4E0E\u516C\u5F00\u7ED3\u679C\u6587\u4EF6\u4E0D\u4E00\u81F4\u3002\u672C\u5BA2\u6237\u7AEF\u6B63\u5728\u4F7F\u7528\u6E38\u620F\u91C7\u7528\u7684\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u3002",
    "recovery.warn.anchoredRosterFallback.previousSummaryUnavailable": "\u65E0\u6CD5\u8BFB\u53D6\u524D\u4E00\u533A\u5757\u7ED3\u679C\u6587\u4EF6\u6216\u94FE\u4E0A\u951A\u70B9\u3002\u672C\u5BA2\u6237\u7AEF\u6B63\u5728\u4F7F\u7528\u5DF2\u72EC\u7ACB\u9A8C\u8BC1\u7684\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u3002",
    "recovery.warn.anchoredRosterFallback.previousSummaryInvalid": "\u524D\u4E00\u533A\u5757\u7ED3\u679C\u6587\u4EF6\u65E0\u6548\uFF0C\u65E0\u6CD5\u91CD\u5EFA\u5206\u7EC4\u3002\u672C\u5BA2\u6237\u7AEF\u6B63\u5728\u4F7F\u7528\u5DF2\u72EC\u7ACB\u9A8C\u8BC1\u7684\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u3002",
    "recovery.warn.anchoredRosterFallback.publishedGroupsUnavailable": "\u65E0\u6CD5\u8BFB\u53D6\u516C\u5F00\u7684 game_groups.json\u3002\u672C\u5BA2\u6237\u7AEF\u6B63\u5728\u4F7F\u7528\u5DF2\u72EC\u7ACB\u9A8C\u8BC1\u7684\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u3002",
    "recovery.warn.anchoredRosterFallback.publishedGroupsMismatch": "\u516C\u5F00\u7684 game_groups.json \u4E0E\u6839\u636E\u5DF2\u63D0\u4EA4\u8F93\u5165\u91CD\u5EFA\u7684\u5206\u7EC4\u4E0D\u4E00\u81F4\u3002\u672C\u5BA2\u6237\u7AEF\u6B63\u5728\u4F7F\u7528\u5DF2\u72EC\u7ACB\u9A8C\u8BC1\u7684\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u3002",
    "recovery.warn.anchoredRosterFallback.unknown": "\u65E0\u6CD5\u9A8C\u8BC1\u5206\u7EC4\u91CD\u5EFA\uFF08{reason}\uFF09\u3002\u672C\u5BA2\u6237\u7AEF\u6B63\u5728\u4F7F\u7528\u5DF2\u72EC\u7ACB\u9A8C\u8BC1\u7684\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u3002",
    "recovery.warn.rosterReconstructionStop.previousSummaryUnavailable": "\u65E0\u6CD5\u8BFB\u53D6\u524D\u4E00\u533A\u5757\u7ED3\u679C\u6587\u4EF6\u6216\u94FE\u4E0A\u951A\u70B9\u3002\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u4E5F\u65E0\u6CD5\u9A8C\u8BC1\uFF0C\u56E0\u6B64\u6062\u590D\u5DF2\u505C\u6B62\u3002",
    "recovery.warn.rosterReconstructionStop.previousSummaryMismatch": "\u524D\u4E00\u533A\u5757\u7ED3\u679C\u6587\u4EF6\u4E0E\u94FE\u4E0A\u951A\u70B9\u4E0D\u4E00\u81F4\u3002\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u4E5F\u65E0\u6CD5\u9A8C\u8BC1\uFF0C\u56E0\u6B64\u6062\u590D\u5DF2\u505C\u6B62\u3002",
    "recovery.warn.rosterReconstructionStop.previousSummaryInvalid": "\u524D\u4E00\u533A\u5757\u7ED3\u679C\u6587\u4EF6\u65E0\u6548\u3002\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u4E5F\u65E0\u6CD5\u9A8C\u8BC1\uFF0C\u56E0\u6B64\u6062\u590D\u5DF2\u505C\u6B62\u3002",
    "recovery.warn.rosterReconstructionStop.unknown": "\u65E0\u6CD5\u9A8C\u8BC1\u5206\u7EC4\u91CD\u5EFA\uFF08{reason}\uFF09\u3002\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u4E5F\u65E0\u6CD5\u9A8C\u8BC1\uFF0C\u56E0\u6B64\u6062\u590D\u5DF2\u505C\u6B62\u3002",
    "recovery.warn.rosterAnchorEvidence": "\u89C4\u8303\u540D\u518C\u6CE8\u518C\u884C\uFF1A\u54C8\u5E0C {rosterAnchorHash}\uFF0C\u7D22\u5F15 {rosterAnchorIndex}\u3002",
    "recovery.warn.rosterRecomputedHash": "\u91CD\u5EFA\u540D\u518C manifest \u54C8\u5E0C\uFF1A{recomputedHash}\u3002",
    "recovery.warn.rosterConflict": "\u94FE\u4E0A\u951A\u5B9A\u540D\u518C\u4E0E\u5F53\u524D\u4F9D\u636E\u5165\u9009\u8005\u91CD\u5EFA\u7684\u540D\u518C\u4E0D\u4E00\u81F4\u3002\u4EC5\u51ED\u8FD9\u4E00\u5DEE\u5F02\u65E0\u6CD5\u65AD\u5B9A\u54EA\u4E00\u65B9\u6709\u8BEF\u3002",
    "recovery.warn.recomputedRosterFallback.canonicalMatch": "\u65E0\u6CD5\u9A8C\u8BC1\u516C\u5F00\u540D\u518C\u6587\u4EF6\uFF08{anchorError}\uFF09\u3002\u91CD\u5EFA\u540D\u518C manifest \u4E0E\u94FE\u4E0A\u7684\u89C4\u8303\u54C8\u5E0C\u4E00\u81F4\uFF0C\u56E0\u6B64\u672C\u5BA2\u6237\u7AEF\u4F7F\u7528\u5DF2\u6838\u5BF9\u7684\u91CD\u5EFA\u5206\u7EC4\u3002",
    "recovery.warn.recomputedRosterFallback.legacyMatch": "\u65E0\u6CD5\u9A8C\u8BC1\u516C\u5F00\u540D\u518C\u6587\u4EF6\uFF08{anchorError}\uFF09\u3002\u91CD\u5EFA\u540D\u518C manifest \u4E0E\u94FE\u4E0A\u5F53\u524D\u54C8\u5E0C\u4E00\u81F4\uFF0C\u56E0\u6B64\u672C\u5BA2\u6237\u7AEF\u4F7F\u7528\u5DF2\u6838\u5BF9\u7684\u91CD\u5EFA\u5206\u7EC4\u3002",
    "recovery.warn.anchorError.unavailable": "\u6709\u65E0\u6CD5\u8BFB\u53D6\u7684\u6587\u4EF6\u6216\u94FE\u4E0A\u767B\u8BB0",
    "recovery.warn.anchorError.invalid": "\u6709\u683C\u5F0F\u9519\u8BEF\u7684\u6587\u4EF6",
    "recovery.warn.anchorError.mismatch": "\u6587\u4EF6\u4E0E\u94FE\u4E0A\u767B\u8BB0\u6216\u9009\u51FA\u7ED3\u679C\u4E0D\u4E00\u81F4",
    "recovery.warn.anchorError.unknown": "\u4E0D\u663E\u793A\u539F\u56E0",
    "recovery.warn.rosterVerificationFailed": "\u65E0\u6CD5\u9A8C\u8BC1\u540D\u518C\u3002\u6062\u590D\u5DF2\u5728\u52A0\u5165\u5206\u7EC4\u4E4B\u524D\u505C\u6B62\u3002",
    "recovery.warn.rosterMismatchStop": "\u91CD\u5EFA\u540D\u518C manifest \u4E0E\u94FE\u4E0A\u7684\u89C4\u8303\u54C8\u5E0C\u4E0D\u4E00\u81F4\u3002\u5BA2\u6237\u7AEF\u5728\u52A0\u5165\u5206\u7EC4\u524D\u505C\u6B62\u6062\u590D\u3002",
    "recovery.warn.rosterAbsentStop": "\u8BE5\u533A\u5757\u6CA1\u6709\u89C4\u8303\u540D\u518C\u6CE8\u518C\u8BB0\u5F55\u3002\u5BA2\u6237\u7AEF\u5728\u52A0\u5165\u5206\u7EC4\u524D\u505C\u6B62\u6062\u590D\u3002",
    "recovery.warn.rosterPending": "\u6B63\u5728\u7B49\u5F85\u89C4\u8303\u540D\u518C\u6CE8\u518C\u786E\u8BA4\u3002\u804A\u5929\u7A97\u53E3\u5173\u95ED\u524D\u4F1A\u7EE7\u7EED\u6838\u5BF9\u3002",
    "recovery.cancelRosterWait": "\u53D6\u6D88\u540D\u518C\u7B49\u5F85",
    "recovery.warn.rosterLateRegistrations": "\u5DF2\u5FFD\u7565\u804A\u5929\u5F00\u59CB\u540E\u5230\u8FBE\u7684 {count} \u6761\u540D\u518C\u6CE8\u518C\u8BB0\u5F55\u3002",
    "recovery.warn.rosterLegacy": "\u6B64\u90E8\u7F72\u4F7F\u7528\u6CA1\u6709\u540D\u518C\u5386\u53F2\u8BB0\u5F55\u7684\u65E7\u7248 HashStorage\u3002\u5DF2\u7528\u94FE\u4E0A\u5F53\u524D\u540D\u518C\u54C8\u5E0C\u8FDB\u884C\u6838\u5BF9\u3002",
    "recovery.warn.rosterProvisional": "\u540D\u518C\u4ECD\u662F\u6682\u5B9A\u7248\u672C\uFF08\u804A\u5929\u5F00\u59CB\u524D\uFF09\u3002\u7B49\u5F85\u94FE\u4E0A\u65F6\u95F4\u5230\u8FBE\u5F00\u59CB\u70B9\u5E76\u786E\u8BA4\u6700\u7EC8\u540D\u518C\u540E\uFF0C\u624D\u4F1A\u5F00\u59CB\u7B7E\u540D\u548C\u63D0\u4EA4\u3002",
    "recovery.warn.rosterRechecking": "\u6B63\u5728\u91CD\u65B0\u6838\u5BF9\u94FE\u4E0A\u7684\u6700\u7EC8\u540D\u518C\u3002\u786E\u8BA4\u524D\u6682\u505C\u7B7E\u540D\u3001\u56DE\u6267\u548C\u63D0\u4EA4\u3002",
    "recovery.warn.rosterChanged": "\u94FE\u4E0A\u7684\u6700\u7EC8\u540D\u518C\u5DF2\u66F4\u6539\u3002\u7B7E\u540D\u3001\u56DE\u6267\u548C\u63D0\u4EA4\u5DF2\u505C\u6B62\u3002\u8BF7\u91CD\u65B0\u52A0\u8F7D\u9875\u9762\u5E76\u52A0\u5165\u6B63\u786E\u7684\u5206\u7EC4\u3002",
    "recovery.relay.save": "\u4FDD\u5B58\u4E2D\u7EE7",
    "recovery.relay.saved": "\u4E2D\u7EE7\u5DF2\u4FDD\u5B58\uFF08\u4E0B\u6B21\u542F\u52A8\u65F6\u751F\u6548\uFF09\u3002",
    "recovery.relay.saveFailed": "\u65E0\u6CD5\u4FDD\u5B58\u4E2D\u7EE7\u3002\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u7684\u5B58\u50A8\u6743\u9650\u3002"
  };
  var CATALOGS = { en, ja, zh };
  var warnedMissing = /* @__PURE__ */ new Set();
  function t(lang2) {
    const primary = Object.hasOwn(CATALOGS, lang2) ? CATALOGS[lang2] : en;
    return (key, params) => {
      let tpl = primary[key];
      if (tpl === void 0) tpl = en[key];
      if (tpl === void 0) {
        if (!warnedMissing.has(key)) {
          warnedMissing.add(key);
          try {
            console.warn(`i18n missing key: ${key}`);
          } catch {
          }
        }
        return key;
      }
      return tpl.replace(/\{(\w+)\}/g, (m, p) => params && Object.prototype.hasOwnProperty.call(params, p) ? String(params[p]) : "-");
    };
  }
  function pickLang(saved) {
    if (SUPPORTED_LANGS.includes(saved)) return saved;
    try {
      const nav = (typeof navigator !== "undefined" && navigator.language ? navigator.language : "en").toLowerCase();
      if (nav.startsWith("ja")) return "ja";
      if (nav.startsWith("zh")) return "zh";
    } catch {
    }
    return "en";
  }

  // node_modules/viem/_esm/utils/getAction.js
  function getAction(client, actionFn, name) {
    const action_implicit = client[actionFn.name];
    if (typeof action_implicit === "function")
      return action_implicit;
    const action_explicit = client[name];
    if (typeof action_explicit === "function")
      return action_explicit;
    return (params) => actionFn(client, params);
  }

  // node_modules/viem/_esm/utils/abi/encodeEventTopics.js
  init_abi();

  // node_modules/viem/_esm/errors/log.js
  init_base();
  var FilterTypeNotSupportedError = class extends BaseError2 {
    constructor(type) {
      super(`Filter type "${type}" is not supported.`, {
        name: "FilterTypeNotSupportedError"
      });
    }
  };

  // node_modules/viem/_esm/utils/abi/encodeEventTopics.js
  init_toBytes();
  init_keccak256();
  init_toEventSelector();
  init_encodeAbiParameters();
  init_formatAbiItem2();
  init_getAbiItem();
  var docsPath = "/docs/contract/encodeEventTopics";
  function encodeEventTopics(parameters) {
    const { abi: abi2, eventName, args } = parameters;
    let abiItem = abi2[0];
    if (eventName) {
      const item = getAbiItem({ abi: abi2, name: eventName });
      if (!item)
        throw new AbiEventNotFoundError(eventName, { docsPath });
      abiItem = item;
    }
    if (abiItem.type !== "event")
      throw new AbiEventNotFoundError(void 0, { docsPath });
    const definition = formatAbiItem2(abiItem);
    const signature = toEventSelector(definition);
    let topics = [];
    if (args && "inputs" in abiItem) {
      const indexedInputs = abiItem.inputs?.filter((param) => "indexed" in param && param.indexed);
      const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
      if (args_.length > 0) {
        topics = indexedInputs?.map((param, i) => {
          if (Array.isArray(args_[i]))
            return args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }));
          return typeof args_[i] !== "undefined" && args_[i] !== null ? encodeArg({ param, value: args_[i] }) : null;
        }) ?? [];
      }
    }
    return [signature, ...topics];
  }
  function encodeArg({ param, value }) {
    if (param.type === "string" || param.type === "bytes")
      return keccak256(toBytes2(value));
    if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
      throw new FilterTypeNotSupportedError(param.type);
    return encodeAbiParameters([param], [value]);
  }

  // node_modules/viem/_esm/actions/public/createContractEventFilter.js
  init_toHex();

  // node_modules/viem/_esm/utils/filters/createFilterRequestScope.js
  function createFilterRequestScope(client, { method }) {
    const requestMap = {};
    if (client.transport.type === "fallback")
      client.transport.onResponse?.(({ method: method_, response: id, status, transport }) => {
        if (status === "success" && method === method_)
          requestMap[id] = transport.request;
      });
    return (id) => requestMap[id] || client.request;
  }

  // node_modules/viem/_esm/actions/public/createContractEventFilter.js
  async function createContractEventFilter(client, parameters) {
    const { address, abi: abi2, args, eventName, fromBlock, strict, toBlock } = parameters;
    const getRequest = createFilterRequestScope(client, {
      method: "eth_newFilter"
    });
    const topics = eventName ? encodeEventTopics({
      abi: abi2,
      args,
      eventName
    }) : void 0;
    const id = await client.request({
      method: "eth_newFilter",
      params: [
        {
          address,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
          topics
        }
      ]
    });
    return {
      abi: abi2,
      args,
      eventName,
      id,
      request: getRequest(id),
      strict: Boolean(strict),
      type: "event"
    };
  }

  // node_modules/viem/_esm/actions/public/estimateContractGas.js
  init_parseAccount();
  init_encodeFunctionData();

  // node_modules/viem/_esm/utils/errors/getContractError.js
  init_abi();
  init_base();
  init_contract();
  init_request();
  init_rpc();
  var EXECUTION_REVERTED_ERROR_CODE = 3;
  function getContractError(err, { abi: abi2, address, args, docsPath: docsPath8, functionName, sender }) {
    const error = err instanceof RawContractError ? err : err instanceof BaseError2 ? err.walk((err2) => "data" in err2) || err.walk() : {};
    const { code, data, details, message, shortMessage } = error;
    const cause = (() => {
      if (err instanceof AbiDecodingZeroDataError)
        return new ContractFunctionZeroDataError({ functionName });
      if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage) || code === InvalidInputRpcError.code && details === "execution reverted" && data) {
        return new ContractFunctionRevertedError({
          abi: abi2,
          data: typeof data === "object" ? data.data : data,
          functionName,
          message: error instanceof RpcRequestError ? details : shortMessage ?? message
        });
      }
      return err;
    })();
    return new ContractFunctionExecutionError(cause, {
      abi: abi2,
      args,
      contractAddress: address,
      docsPath: docsPath8,
      functionName,
      sender
    });
  }

  // node_modules/viem/_esm/actions/public/estimateGas.js
  init_parseAccount();
  init_base();

  // node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
  init_getAddress();
  init_keccak256();
  function publicKeyToAddress(publicKey) {
    const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
    return checksumAddress(`0x${address}`);
  }

  // node_modules/viem/_esm/utils/signature/recoverPublicKey.js
  init_isHex();
  init_size();
  init_fromHex();
  init_toHex();
  async function recoverPublicKey({ hash: hash3, signature }) {
    const hashHex = isHex(hash3) ? hash3 : toHex(hash3);
    const { secp256k1: secp256k12 } = await Promise.resolve().then(() => (init_secp256k1(), secp256k1_exports));
    const signature_ = (() => {
      if (typeof signature === "object" && "r" in signature && "s" in signature) {
        const { r, s, v, yParity } = signature;
        const yParityOrV2 = Number(yParity ?? v);
        const recoveryBit2 = toRecoveryBit(yParityOrV2);
        return new secp256k12.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit2);
      }
      const signatureHex = isHex(signature) ? signature : toHex(signature);
      if (size(signatureHex) !== 65)
        throw new Error("invalid signature length");
      const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
      const recoveryBit = toRecoveryBit(yParityOrV);
      return secp256k12.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
    })();
    const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
    return `0x${publicKey}`;
  }
  function toRecoveryBit(yParityOrV) {
    if (yParityOrV === 0 || yParityOrV === 1)
      return yParityOrV;
    if (yParityOrV === 27)
      return 0;
    if (yParityOrV === 28)
      return 1;
    throw new Error("Invalid yParityOrV value");
  }

  // node_modules/viem/_esm/utils/signature/recoverAddress.js
  async function recoverAddress({ hash: hash3, signature }) {
    return publicKeyToAddress(await recoverPublicKey({ hash: hash3, signature }));
  }

  // node_modules/viem/_esm/utils/authorization/hashAuthorization.js
  init_concat();
  init_toBytes();
  init_toHex();

  // node_modules/viem/_esm/utils/encoding/toRlp.js
  init_base();
  init_cursor2();
  init_toBytes();
  init_toHex();
  function toRlp(bytes, to = "hex") {
    const encodable = getEncodable(bytes);
    const cursor = createCursor(new Uint8Array(encodable.length));
    encodable.encode(cursor);
    if (to === "hex")
      return bytesToHex2(cursor.bytes);
    return cursor.bytes;
  }
  function getEncodable(bytes) {
    if (Array.isArray(bytes))
      return getEncodableList(bytes.map((x) => getEncodable(x)));
    return getEncodableBytes(bytes);
  }
  function getEncodableList(list) {
    const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
    const sizeOfBodyLength = getSizeOfLength(bodyLength);
    const length = (() => {
      if (bodyLength <= 55)
        return 1 + bodyLength;
      return 1 + sizeOfBodyLength + bodyLength;
    })();
    return {
      length,
      encode(cursor) {
        if (bodyLength <= 55) {
          cursor.pushByte(192 + bodyLength);
        } else {
          cursor.pushByte(192 + 55 + sizeOfBodyLength);
          if (sizeOfBodyLength === 1)
            cursor.pushUint8(bodyLength);
          else if (sizeOfBodyLength === 2)
            cursor.pushUint16(bodyLength);
          else if (sizeOfBodyLength === 3)
            cursor.pushUint24(bodyLength);
          else
            cursor.pushUint32(bodyLength);
        }
        for (const { encode: encode4 } of list) {
          encode4(cursor);
        }
      }
    };
  }
  function getEncodableBytes(bytesOrHex) {
    const bytes = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
    const sizeOfBytesLength = getSizeOfLength(bytes.length);
    const length = (() => {
      if (bytes.length === 1 && bytes[0] < 128)
        return 1;
      if (bytes.length <= 55)
        return 1 + bytes.length;
      return 1 + sizeOfBytesLength + bytes.length;
    })();
    return {
      length,
      encode(cursor) {
        if (bytes.length === 1 && bytes[0] < 128) {
          cursor.pushBytes(bytes);
        } else if (bytes.length <= 55) {
          cursor.pushByte(128 + bytes.length);
          cursor.pushBytes(bytes);
        } else {
          cursor.pushByte(128 + 55 + sizeOfBytesLength);
          if (sizeOfBytesLength === 1)
            cursor.pushUint8(bytes.length);
          else if (sizeOfBytesLength === 2)
            cursor.pushUint16(bytes.length);
          else if (sizeOfBytesLength === 3)
            cursor.pushUint24(bytes.length);
          else
            cursor.pushUint32(bytes.length);
          cursor.pushBytes(bytes);
        }
      }
    };
  }
  function getSizeOfLength(length) {
    if (length < 2 ** 8)
      return 1;
    if (length < 2 ** 16)
      return 2;
    if (length < 2 ** 24)
      return 3;
    if (length < 2 ** 32)
      return 4;
    throw new BaseError2("Length is too large.");
  }

  // node_modules/viem/_esm/utils/authorization/hashAuthorization.js
  init_keccak256();
  function hashAuthorization(parameters) {
    const { chainId, nonce, to } = parameters;
    const address = parameters.contractAddress ?? parameters.address;
    const hash3 = keccak256(concatHex([
      "0x05",
      toRlp([
        chainId ? numberToHex(chainId) : "0x",
        address,
        nonce ? numberToHex(nonce) : "0x"
      ])
    ]));
    if (to === "bytes")
      return hexToBytes(hash3);
    return hash3;
  }

  // node_modules/viem/_esm/utils/authorization/recoverAuthorizationAddress.js
  async function recoverAuthorizationAddress(parameters) {
    const { authorization, signature } = parameters;
    return recoverAddress({
      hash: hashAuthorization(authorization),
      signature: signature ?? authorization
    });
  }

  // node_modules/viem/_esm/actions/public/estimateGas.js
  init_toHex();

  // node_modules/viem/_esm/errors/estimateGas.js
  init_formatEther();
  init_formatGwei();
  init_base();
  init_transaction();
  var EstimateGasExecutionError = class extends BaseError2 {
    constructor(cause, { account, docsPath: docsPath8, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
      const prettyArgs = prettyPrint({
        from: account?.address,
        to,
        value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
        data,
        gas,
        gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
        maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
        maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
        nonce
      });
      super(cause.shortMessage, {
        cause,
        docsPath: docsPath8,
        metaMessages: [
          ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
          "Estimate Gas Arguments:",
          prettyArgs
        ].filter(Boolean),
        name: "EstimateGasExecutionError"
      });
      Object.defineProperty(this, "cause", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.cause = cause;
    }
  };

  // node_modules/viem/_esm/utils/errors/getEstimateGasError.js
  init_node();
  init_getNodeError();
  function getEstimateGasError(err, { docsPath: docsPath8, ...args }) {
    const cause = (() => {
      const cause2 = getNodeError(err, args);
      if (cause2 instanceof UnknownNodeError)
        return err;
      return cause2;
    })();
    return new EstimateGasExecutionError(cause, {
      docsPath: docsPath8,
      ...args
    });
  }

  // node_modules/viem/_esm/actions/public/estimateGas.js
  init_extract();
  init_transactionRequest();
  init_stateOverride2();
  init_assertRequest();

  // node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
  init_parseAccount();

  // node_modules/viem/_esm/errors/fee.js
  init_formatGwei();
  init_base();
  var BaseFeeScalarError = class extends BaseError2 {
    constructor() {
      super("`baseFeeMultiplier` must be greater than 1.", {
        name: "BaseFeeScalarError"
      });
    }
  };
  var Eip1559FeesNotSupportedError = class extends BaseError2 {
    constructor() {
      super("Chain does not support EIP-1559 fees.", {
        name: "Eip1559FeesNotSupportedError"
      });
    }
  };
  var MaxFeePerGasTooLowError = class extends BaseError2 {
    constructor({ maxPriorityFeePerGas }) {
      super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
    }
  };

  // node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
  init_fromHex();

  // node_modules/viem/_esm/errors/block.js
  init_base();
  var BlockNotFoundError = class extends BaseError2 {
    constructor({ blockHash, blockNumber }) {
      let identifier = "Block";
      if (blockHash)
        identifier = `Block at hash "${blockHash}"`;
      if (blockNumber)
        identifier = `Block at number "${blockNumber}"`;
      super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
    }
  };

  // node_modules/viem/_esm/actions/public/getBlock.js
  init_toHex();

  // node_modules/viem/_esm/utils/formatters/transaction.js
  init_fromHex();
  var transactionType = {
    "0x0": "legacy",
    "0x1": "eip2930",
    "0x2": "eip1559",
    "0x3": "eip4844",
    "0x4": "eip7702"
  };
  function formatTransaction(transaction, _) {
    const transaction_ = {
      ...transaction,
      blockHash: transaction.blockHash ? transaction.blockHash : null,
      blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
      chainId: transaction.chainId ? hexToNumber(transaction.chainId) : void 0,
      gas: transaction.gas ? BigInt(transaction.gas) : void 0,
      gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
      maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : void 0,
      maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
      nonce: transaction.nonce ? hexToNumber(transaction.nonce) : void 0,
      to: transaction.to ? transaction.to : null,
      transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
      type: transaction.type ? transactionType[transaction.type] : void 0,
      typeHex: transaction.type ? transaction.type : void 0,
      value: transaction.value ? BigInt(transaction.value) : void 0,
      v: transaction.v ? BigInt(transaction.v) : void 0
    };
    if (transaction.authorizationList)
      transaction_.authorizationList = formatAuthorizationList2(transaction.authorizationList);
    transaction_.yParity = (() => {
      if (transaction.yParity)
        return Number(transaction.yParity);
      if (typeof transaction_.v === "bigint") {
        if (transaction_.v === 0n || transaction_.v === 27n)
          return 0;
        if (transaction_.v === 1n || transaction_.v === 28n)
          return 1;
        if (transaction_.v >= 35n)
          return transaction_.v % 2n === 0n ? 1 : 0;
      }
      return void 0;
    })();
    if (transaction_.type === "legacy") {
      delete transaction_.accessList;
      delete transaction_.maxFeePerBlobGas;
      delete transaction_.maxFeePerGas;
      delete transaction_.maxPriorityFeePerGas;
      delete transaction_.yParity;
    }
    if (transaction_.type === "eip2930") {
      delete transaction_.maxFeePerBlobGas;
      delete transaction_.maxFeePerGas;
      delete transaction_.maxPriorityFeePerGas;
    }
    if (transaction_.type === "eip1559") {
      delete transaction_.maxFeePerBlobGas;
    }
    return transaction_;
  }
  function formatAuthorizationList2(authorizationList) {
    return authorizationList.map((authorization) => ({
      address: authorization.address,
      chainId: Number(authorization.chainId),
      nonce: Number(authorization.nonce),
      r: authorization.r,
      s: authorization.s,
      yParity: Number(authorization.yParity)
    }));
  }

  // node_modules/viem/_esm/utils/formatters/block.js
  function formatBlock(block, _) {
    const transactions = (block.transactions ?? []).map((transaction) => {
      if (typeof transaction === "string")
        return transaction;
      return formatTransaction(transaction);
    });
    return {
      ...block,
      baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
      blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
      difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
      excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
      gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
      gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
      hash: block.hash ? block.hash : null,
      logsBloom: block.logsBloom ? block.logsBloom : null,
      nonce: block.nonce ? block.nonce : null,
      number: block.number ? BigInt(block.number) : null,
      size: block.size ? BigInt(block.size) : void 0,
      timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
      transactions,
      totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
    };
  }

  // node_modules/viem/_esm/actions/public/getBlock.js
  async function getBlock(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", includeTransactions: includeTransactions_ } = {}) {
    const includeTransactions = includeTransactions_ ?? false;
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    let block = null;
    if (blockHash) {
      block = await client.request({
        method: "eth_getBlockByHash",
        params: [blockHash, includeTransactions]
      }, { dedupe: true });
    } else {
      block = await client.request({
        method: "eth_getBlockByNumber",
        params: [blockNumberHex || blockTag, includeTransactions]
      }, { dedupe: Boolean(blockNumberHex) });
    }
    if (!block)
      throw new BlockNotFoundError({ blockHash, blockNumber });
    const format = client.chain?.formatters?.block?.format || formatBlock;
    return format(block, "getBlock");
  }

  // node_modules/viem/_esm/actions/public/getGasPrice.js
  async function getGasPrice(client) {
    const gasPrice = await client.request({
      method: "eth_gasPrice"
    });
    return BigInt(gasPrice);
  }

  // node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
  async function estimateMaxPriorityFeePerGas(client, args) {
    return internal_estimateMaxPriorityFeePerGas(client, args);
  }
  async function internal_estimateMaxPriorityFeePerGas(client, args) {
    const { block: block_, chain = client.chain, request } = args || {};
    try {
      const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
      if (typeof maxPriorityFeePerGas === "function") {
        const block = block_ || await getAction(client, getBlock, "getBlock")({});
        const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
          block,
          client,
          request
        });
        if (maxPriorityFeePerGas_ === null)
          throw new Error();
        return maxPriorityFeePerGas_;
      }
      if (typeof maxPriorityFeePerGas !== "undefined")
        return maxPriorityFeePerGas;
      const maxPriorityFeePerGasHex = await client.request({
        method: "eth_maxPriorityFeePerGas"
      });
      return hexToBigInt(maxPriorityFeePerGasHex);
    } catch {
      const [block, gasPrice] = await Promise.all([
        block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}),
        getAction(client, getGasPrice, "getGasPrice")({})
      ]);
      if (typeof block.baseFeePerGas !== "bigint")
        throw new Eip1559FeesNotSupportedError();
      const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
      if (maxPriorityFeePerGas < 0n)
        return 0n;
      return maxPriorityFeePerGas;
    }
  }

  // node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
  async function estimateFeesPerGas(client, args) {
    return internal_estimateFeesPerGas(client, args);
  }
  async function internal_estimateFeesPerGas(client, args) {
    const { block: block_, chain = client.chain, request, type = "eip1559" } = args || {};
    const baseFeeMultiplier = await (async () => {
      if (typeof chain?.fees?.baseFeeMultiplier === "function")
        return chain.fees.baseFeeMultiplier({
          block: block_,
          client,
          request
        });
      return chain?.fees?.baseFeeMultiplier ?? 1.2;
    })();
    if (baseFeeMultiplier < 1)
      throw new BaseFeeScalarError();
    const decimals = baseFeeMultiplier.toString().split(".")[1]?.length ?? 0;
    const denominator = 10 ** decimals;
    const multiply = (base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
    const block = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
    if (typeof chain?.fees?.estimateFeesPerGas === "function") {
      const fees = await chain.fees.estimateFeesPerGas({
        block: block_,
        client,
        multiply,
        request,
        type
      });
      if (fees !== null)
        return fees;
    }
    if (type === "eip1559") {
      if (typeof block.baseFeePerGas !== "bigint")
        throw new Eip1559FeesNotSupportedError();
      const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
        block,
        chain,
        request
      });
      const baseFeePerGas = multiply(block.baseFeePerGas);
      const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
      return {
        maxFeePerGas,
        maxPriorityFeePerGas
      };
    }
    const gasPrice = request?.gasPrice ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({}));
    return {
      gasPrice
    };
  }

  // node_modules/viem/_esm/actions/public/getTransactionCount.js
  init_fromHex();
  init_toHex();
  async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
    const count = await client.request({
      method: "eth_getTransactionCount",
      params: [
        address,
        typeof blockNumber === "bigint" ? numberToHex(blockNumber) : blockTag
      ]
    }, {
      dedupe: Boolean(blockNumber)
    });
    return hexToNumber(count);
  }

  // node_modules/viem/_esm/utils/blob/blobsToCommitments.js
  init_toBytes();
  init_toHex();
  function blobsToCommitments(parameters) {
    const { kzg } = parameters;
    const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
    const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
    const commitments = [];
    for (const blob of blobs)
      commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
    return to === "bytes" ? commitments : commitments.map((x) => bytesToHex2(x));
  }

  // node_modules/viem/_esm/utils/blob/blobsToProofs.js
  init_toBytes();
  init_toHex();
  function blobsToProofs(parameters) {
    const { kzg } = parameters;
    const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
    const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
    const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
    const proofs = [];
    for (let i = 0; i < blobs.length; i++) {
      const blob = blobs[i];
      const commitment = commitments[i];
      proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
    }
    return to === "bytes" ? proofs : proofs.map((x) => bytesToHex2(x));
  }

  // node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
  init_toHex();

  // node_modules/viem/_esm/utils/hash/sha256.js
  init_sha256();
  init_isHex();
  init_toBytes();
  init_toHex();
  function sha2563(value, to_) {
    const to = to_ || "hex";
    const bytes = sha2562(isHex(value, { strict: false }) ? toBytes2(value) : value);
    if (to === "bytes")
      return bytes;
    return toHex(bytes);
  }

  // node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
  function commitmentToVersionedHash(parameters) {
    const { commitment, version: version4 = 1 } = parameters;
    const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
    const versionedHash = sha2563(commitment, "bytes");
    versionedHash.set([version4], 0);
    return to === "bytes" ? versionedHash : bytesToHex2(versionedHash);
  }

  // node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
  function commitmentsToVersionedHashes(parameters) {
    const { commitments, version: version4 } = parameters;
    const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
    const hashes = [];
    for (const commitment of commitments) {
      hashes.push(commitmentToVersionedHash({
        commitment,
        to,
        version: version4
      }));
    }
    return hashes;
  }

  // node_modules/viem/_esm/constants/blob.js
  var blobsPerTransaction = 6;
  var bytesPerFieldElement = 32;
  var fieldElementsPerBlob = 4096;
  var bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
  var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - // terminator byte (0x80).
  1 - // zero byte (0x00) appended to each field element.
  1 * fieldElementsPerBlob * blobsPerTransaction;

  // node_modules/viem/_esm/errors/blob.js
  init_base();
  var BlobSizeTooLargeError = class extends BaseError2 {
    constructor({ maxSize, size: size5 }) {
      super("Blob size is too large.", {
        metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size5} bytes`],
        name: "BlobSizeTooLargeError"
      });
    }
  };
  var EmptyBlobError = class extends BaseError2 {
    constructor() {
      super("Blob data must not be empty.", { name: "EmptyBlobError" });
    }
  };

  // node_modules/viem/_esm/utils/blob/toBlobs.js
  init_cursor2();
  init_size();
  init_toBytes();
  init_toHex();
  function toBlobs(parameters) {
    const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
    const data = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
    const size_ = size(data);
    if (!size_)
      throw new EmptyBlobError();
    if (size_ > maxBytesPerTransaction)
      throw new BlobSizeTooLargeError({
        maxSize: maxBytesPerTransaction,
        size: size_
      });
    const blobs = [];
    let active = true;
    let position = 0;
    while (active) {
      const blob = createCursor(new Uint8Array(bytesPerBlob));
      let size5 = 0;
      while (size5 < fieldElementsPerBlob) {
        const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
        blob.pushByte(0);
        blob.pushBytes(bytes);
        if (bytes.length < 31) {
          blob.pushByte(128);
          active = false;
          break;
        }
        size5++;
        position += 31;
      }
      blobs.push(blob);
    }
    return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex2(x.bytes));
  }

  // node_modules/viem/_esm/utils/blob/toBlobSidecars.js
  function toBlobSidecars(parameters) {
    const { data, kzg, to } = parameters;
    const blobs = parameters.blobs ?? toBlobs({ data, to });
    const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
    const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
    const sidecars = [];
    for (let i = 0; i < blobs.length; i++)
      sidecars.push({
        blob: blobs[i],
        commitment: commitments[i],
        proof: proofs[i]
      });
    return sidecars;
  }

  // node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
  init_lru();
  init_assertRequest();

  // node_modules/viem/_esm/utils/transaction/getTransactionType.js
  init_transaction();
  function getTransactionType(transaction) {
    if (transaction.type)
      return transaction.type;
    if (typeof transaction.authorizationList !== "undefined")
      return "eip7702";
    if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
      return "eip4844";
    if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
      return "eip1559";
    }
    if (typeof transaction.gasPrice !== "undefined") {
      if (typeof transaction.accessList !== "undefined")
        return "eip2930";
      return "legacy";
    }
    throw new InvalidSerializableTransactionError({ transaction });
  }

  // node_modules/viem/_esm/actions/public/fillTransaction.js
  init_parseAccount();

  // node_modules/viem/_esm/utils/errors/getTransactionError.js
  init_node();
  init_transaction();
  init_getNodeError();
  function getTransactionError(err, { docsPath: docsPath8, ...args }) {
    const cause = (() => {
      const cause2 = getNodeError(err, args);
      if (cause2 instanceof UnknownNodeError)
        return err;
      return cause2;
    })();
    return new TransactionExecutionError(cause, {
      docsPath: docsPath8,
      ...args
    });
  }

  // node_modules/viem/_esm/actions/public/fillTransaction.js
  init_extract();
  init_transactionRequest();
  init_assertRequest();

  // node_modules/viem/_esm/actions/public/getChainId.js
  init_fromHex();
  async function getChainId(client) {
    const chainIdHex = await client.request({
      method: "eth_chainId"
    }, { dedupe: true });
    return hexToNumber(chainIdHex);
  }

  // node_modules/viem/_esm/actions/public/fillTransaction.js
  async function fillTransaction(client, parameters) {
    const { account = client.account, accessList, authorizationList, chain = client.chain, blobVersionedHashes, blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce: nonce_, nonceManager, to, type, value, ...rest } = parameters;
    const nonce = await (async () => {
      if (!account)
        return nonce_;
      if (!nonceManager)
        return nonce_;
      if (typeof nonce_ !== "undefined")
        return nonce_;
      const account_ = parseAccount(account);
      const chainId = chain ? chain.id : await getAction(client, getChainId, "getChainId")({});
      return await nonceManager.consume({
        address: account_.address,
        chainId,
        client
      });
    })();
    assertRequest(parameters);
    const chainFormat = chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      account: account ? parseAccount(account) : void 0,
      accessList,
      authorizationList,
      blobs,
      blobVersionedHashes,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      type,
      value
    }, "fillTransaction");
    try {
      const response = await client.request({
        method: "eth_fillTransaction",
        params: [request]
      });
      const format2 = chain?.formatters?.transaction?.format || formatTransaction;
      const transaction = format2(response.tx);
      delete transaction.blockHash;
      delete transaction.blockNumber;
      delete transaction.r;
      delete transaction.s;
      delete transaction.transactionIndex;
      delete transaction.v;
      delete transaction.yParity;
      transaction.data = transaction.input;
      if (transaction.gas)
        transaction.gas = parameters.gas ?? transaction.gas;
      if (transaction.gasPrice)
        transaction.gasPrice = parameters.gasPrice ?? transaction.gasPrice;
      if (transaction.maxFeePerBlobGas)
        transaction.maxFeePerBlobGas = parameters.maxFeePerBlobGas ?? transaction.maxFeePerBlobGas;
      if (transaction.maxFeePerGas)
        transaction.maxFeePerGas = parameters.maxFeePerGas ?? transaction.maxFeePerGas;
      if (transaction.maxPriorityFeePerGas)
        transaction.maxPriorityFeePerGas = parameters.maxPriorityFeePerGas ?? transaction.maxPriorityFeePerGas;
      if (transaction.nonce)
        transaction.nonce = parameters.nonce ?? transaction.nonce;
      const feeMultiplier = await (async () => {
        if (typeof chain?.fees?.baseFeeMultiplier === "function") {
          const block = await getAction(client, getBlock, "getBlock")({});
          return chain.fees.baseFeeMultiplier({
            block,
            client,
            request: parameters
          });
        }
        return chain?.fees?.baseFeeMultiplier ?? 1.2;
      })();
      if (feeMultiplier < 1)
        throw new BaseFeeScalarError();
      const decimals = feeMultiplier.toString().split(".")[1]?.length ?? 0;
      const denominator = 10 ** decimals;
      const multiplyFee = (base) => base * BigInt(Math.ceil(feeMultiplier * denominator)) / BigInt(denominator);
      if (transaction.maxFeePerGas && !parameters.maxFeePerGas)
        transaction.maxFeePerGas = multiplyFee(transaction.maxFeePerGas);
      if (transaction.gasPrice && !parameters.gasPrice)
        transaction.gasPrice = multiplyFee(transaction.gasPrice);
      return {
        raw: response.raw,
        transaction: {
          from: request.from,
          ...transaction
        }
      };
    } catch (err) {
      throw getTransactionError(err, {
        ...parameters,
        chain: client.chain
      });
    }
  }

  // node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
  var defaultParameters = [
    "blobVersionedHashes",
    "chainId",
    "fees",
    "gas",
    "nonce",
    "type"
  ];
  var eip1559NetworkCache = /* @__PURE__ */ new Map();
  var supportsFillTransaction = /* @__PURE__ */ new LruMap(128);
  async function prepareTransactionRequest(client, args) {
    let request = args;
    const { account: account_ = client.account, chain = client.chain, nonceManager, parameters = defaultParameters } = request;
    const prepareTransactionRequest2 = (() => {
      if (typeof chain?.prepareTransactionRequest === "function")
        return {
          fn: chain.prepareTransactionRequest,
          runAt: ["beforeFillTransaction"]
        };
      if (Array.isArray(chain?.prepareTransactionRequest))
        return {
          fn: chain.prepareTransactionRequest[0],
          runAt: chain.prepareTransactionRequest[1].runAt
        };
      return void 0;
    })();
    let chainId;
    async function getChainId2() {
      if (chainId)
        return chainId;
      if (typeof request.chainId !== "undefined")
        return request.chainId;
      if (chain)
        return chain.id;
      const chainId_ = await getAction(client, getChainId, "getChainId")({});
      chainId = chainId_;
      return chainId;
    }
    const account = account_ ? parseAccount(account_) : account_;
    let nonce = request.nonce;
    if (parameters.includes("nonce") && typeof nonce === "undefined" && account && nonceManager) {
      const chainId2 = await getChainId2();
      nonce = await nonceManager.consume({
        address: account.address,
        chainId: chainId2,
        client
      });
    }
    if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("beforeFillTransaction")) {
      request = await prepareTransactionRequest2.fn(request, {
        phase: "beforeFillTransaction"
      });
      nonce ??= request.nonce;
    }
    const attemptFill = (() => {
      if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && request.kzg && request.blobs)
        return false;
      if (supportsFillTransaction.get(client.uid) === false)
        return false;
      const shouldAttempt = ["fees", "gas"].some((parameter) => parameters.includes(parameter));
      if (!shouldAttempt)
        return false;
      if (parameters.includes("chainId") && typeof request.chainId !== "number")
        return true;
      if (parameters.includes("nonce") && typeof nonce !== "number")
        return true;
      if (parameters.includes("fees") && typeof request.gasPrice !== "bigint" && (typeof request.maxFeePerGas !== "bigint" || typeof request.maxPriorityFeePerGas !== "bigint"))
        return true;
      if (parameters.includes("gas") && typeof request.gas !== "bigint")
        return true;
      return false;
    })();
    const fillResult = attemptFill ? await getAction(client, fillTransaction, "fillTransaction")({ ...request, nonce }).then((result) => {
      const { chainId: chainId2, from: from14, gas: gas2, gasPrice, nonce: nonce2, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, type: type2, ...rest } = result.transaction;
      supportsFillTransaction.set(client.uid, true);
      return {
        ...request,
        ...from14 ? { from: from14 } : {},
        ...type2 ? { type: type2 } : {},
        ...typeof chainId2 !== "undefined" ? { chainId: chainId2 } : {},
        ...typeof gas2 !== "undefined" ? { gas: gas2 } : {},
        ...typeof gasPrice !== "undefined" ? { gasPrice } : {},
        ...typeof nonce2 !== "undefined" ? { nonce: nonce2 } : {},
        ...typeof maxFeePerBlobGas !== "undefined" ? { maxFeePerBlobGas } : {},
        ...typeof maxFeePerGas !== "undefined" ? { maxFeePerGas } : {},
        ...typeof maxPriorityFeePerGas !== "undefined" ? { maxPriorityFeePerGas } : {},
        ..."nonceKey" in rest && typeof rest.nonceKey !== "undefined" ? { nonceKey: rest.nonceKey } : {}
      };
    }).catch((e) => {
      const error = e;
      const unsupported = error.walk?.((e2) => {
        const error2 = e2;
        return error2.name === "MethodNotFoundRpcError" || error2.name === "MethodNotSupportedRpcError";
      });
      if (unsupported)
        supportsFillTransaction.set(client.uid, false);
      return request;
    }) : request;
    nonce ??= fillResult.nonce;
    request = {
      ...fillResult,
      ...account ? { from: account?.address } : {},
      ...nonce ? { nonce } : {}
    };
    const { blobs, gas, kzg, type } = request;
    if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("beforeFillParameters")) {
      request = await prepareTransactionRequest2.fn(request, {
        phase: "beforeFillParameters"
      });
    }
    let block;
    async function getBlock2() {
      if (block)
        return block;
      block = await getAction(client, getBlock, "getBlock")({ blockTag: "latest" });
      return block;
    }
    if (parameters.includes("nonce") && typeof nonce === "undefined" && account && !nonceManager)
      request.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
        address: account.address,
        blockTag: "pending"
      });
    if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
      const commitments = blobsToCommitments({ blobs, kzg });
      if (parameters.includes("blobVersionedHashes")) {
        const versionedHashes = commitmentsToVersionedHashes({
          commitments,
          to: "hex"
        });
        request.blobVersionedHashes = versionedHashes;
      }
      if (parameters.includes("sidecars")) {
        const proofs = blobsToProofs({ blobs, commitments, kzg });
        const sidecars = toBlobSidecars({
          blobs,
          commitments,
          proofs,
          to: "hex"
        });
        request.sidecars = sidecars;
      }
    }
    if (parameters.includes("chainId"))
      request.chainId = await getChainId2();
    if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") {
      try {
        request.type = getTransactionType(request);
      } catch {
        let isEip1559Network = eip1559NetworkCache.get(client.uid);
        if (typeof isEip1559Network === "undefined") {
          const block2 = await getBlock2();
          isEip1559Network = typeof block2?.baseFeePerGas === "bigint";
          eip1559NetworkCache.set(client.uid, isEip1559Network);
        }
        request.type = isEip1559Network ? "eip1559" : "legacy";
      }
    }
    if (parameters.includes("fees")) {
      if (request.type !== "legacy" && request.type !== "eip2930") {
        if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
          const block2 = await getBlock2();
          const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
            block: block2,
            chain,
            request
          });
          if (typeof request.maxPriorityFeePerGas === "undefined" && request.maxFeePerGas && request.maxFeePerGas < maxPriorityFeePerGas)
            throw new MaxFeePerGasTooLowError({
              maxPriorityFeePerGas
            });
          request.maxPriorityFeePerGas = maxPriorityFeePerGas;
          request.maxFeePerGas = maxFeePerGas;
        }
      } else {
        if (typeof request.maxFeePerGas !== "undefined" || typeof request.maxPriorityFeePerGas !== "undefined")
          throw new Eip1559FeesNotSupportedError();
        if (typeof request.gasPrice === "undefined") {
          const block2 = await getBlock2();
          const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
            block: block2,
            chain,
            request,
            type: "legacy"
          });
          request.gasPrice = gasPrice_;
        }
      }
    }
    if (parameters.includes("gas") && typeof gas === "undefined")
      request.gas = await getAction(client, estimateGas, "estimateGas")({
        ...request,
        account,
        prepare: account?.type === "local" ? [] : ["blobVersionedHashes"]
      });
    if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("afterFillParameters"))
      request = await prepareTransactionRequest2.fn(request, {
        phase: "afterFillParameters"
      });
    assertRequest(request);
    delete request.parameters;
    return request;
  }

  // node_modules/viem/_esm/actions/public/estimateGas.js
  async function estimateGas(client, args) {
    const { account: account_ = client.account, prepare = true } = args;
    const account = account_ ? parseAccount(account_) : void 0;
    const parameters = (() => {
      if (Array.isArray(prepare))
        return prepare;
      if (account?.type !== "local")
        return ["blobVersionedHashes"];
      return void 0;
    })();
    try {
      const to = await (async () => {
        if (args.to)
          return args.to;
        if (args.authorizationList && args.authorizationList.length > 0)
          return await recoverAuthorizationAddress({
            authorization: args.authorizationList[0]
          }).catch(() => {
            throw new BaseError2("`to` is required. Could not infer from `authorizationList`");
          });
        return void 0;
      })();
      const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride, ...rest } = prepare ? await prepareTransactionRequest(client, {
        ...args,
        parameters,
        to
      }) : args;
      if (gas && args.gas !== gas)
        return gas;
      const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const rpcStateOverride = serializeStateOverride(stateOverride);
      assertRequest(args);
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format({
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
        account,
        accessList,
        authorizationList,
        blobs,
        blobVersionedHashes,
        data,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value
      }, "estimateGas");
      return BigInt(await client.request({
        method: "eth_estimateGas",
        params: rpcStateOverride ? [
          request,
          block ?? client.experimental_blockTag ?? "latest",
          rpcStateOverride
        ] : block ? [request, block] : [request]
      }));
    } catch (err) {
      throw getEstimateGasError(err, {
        ...args,
        account,
        chain: client.chain
      });
    }
  }

  // node_modules/viem/_esm/actions/public/estimateContractGas.js
  async function estimateContractGas(client, parameters) {
    const { abi: abi2, address, args, functionName, dataSuffix, ...request } = parameters;
    const data = encodeFunctionData({
      abi: abi2,
      args,
      functionName
    });
    try {
      const gas = await getAction(client, estimateGas, "estimateGas")({
        data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
        to: address,
        ...request
      });
      return gas;
    } catch (error) {
      const account = request.account ? parseAccount(request.account) : void 0;
      throw getContractError(error, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/estimateContractGas",
        functionName,
        sender: account?.address
      });
    }
  }

  // node_modules/viem/_esm/actions/public/getContractEvents.js
  init_getAbiItem();

  // node_modules/viem/_esm/utils/abi/parseEventLogs.js
  init_abi();
  init_isAddressEqual();
  init_toBytes();
  init_keccak256();
  init_toEventSelector();

  // node_modules/viem/_esm/utils/abi/decodeEventLog.js
  init_abi();
  init_cursor();
  init_size();
  init_toEventSelector();
  init_decodeAbiParameters();
  init_formatAbiItem2();
  var docsPath3 = "/docs/contract/decodeEventLog";
  function decodeEventLog(parameters) {
    const { abi: abi2, data, strict: strict_, topics } = parameters;
    const strict = strict_ ?? true;
    const [signature, ...argTopics] = topics;
    if (!signature)
      throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath3 });
    const abiItem = abi2.find((x) => x.type === "event" && signature === toEventSelector(formatAbiItem2(x)));
    if (!(abiItem && "name" in abiItem) || abiItem.type !== "event")
      throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath3 });
    const { name, inputs } = abiItem;
    const isUnnamed = inputs?.some((x) => !("name" in x && x.name));
    const args = isUnnamed ? [] : {};
    const indexedInputs = inputs.map((x, i) => [x, i]).filter(([x]) => "indexed" in x && x.indexed);
    for (let i = 0; i < indexedInputs.length; i++) {
      const [param, argIndex] = indexedInputs[i];
      const topic = argTopics[i];
      if (!topic)
        throw new DecodeLogTopicsMismatch({
          abiItem,
          param
        });
      args[isUnnamed ? argIndex : param.name || argIndex] = decodeTopic({
        param,
        value: topic
      });
    }
    const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
    if (nonIndexedInputs.length > 0) {
      if (data && data !== "0x") {
        try {
          const decodedData = decodeAbiParameters(nonIndexedInputs, data);
          if (decodedData) {
            if (isUnnamed)
              for (let i = 0; i < inputs.length; i++)
                args[i] = args[i] ?? decodedData.shift();
            else
              for (let i = 0; i < nonIndexedInputs.length; i++)
                args[nonIndexedInputs[i].name] = decodedData[i];
          }
        } catch (err) {
          if (strict) {
            if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
              throw new DecodeLogDataMismatch({
                abiItem,
                data,
                params: nonIndexedInputs,
                size: size(data)
              });
            throw err;
          }
        }
      } else if (strict) {
        throw new DecodeLogDataMismatch({
          abiItem,
          data: "0x",
          params: nonIndexedInputs,
          size: 0
        });
      }
    }
    return {
      eventName: name,
      args: Object.values(args).length > 0 ? args : void 0
    };
  }
  function decodeTopic({ param, value }) {
    if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
      return value;
    const decodedArg = decodeAbiParameters([param], value) || [];
    return decodedArg[0];
  }

  // node_modules/viem/_esm/utils/abi/parseEventLogs.js
  function parseEventLogs(parameters) {
    const { abi: abi2, args, logs, strict = true } = parameters;
    const eventName = (() => {
      if (!parameters.eventName)
        return void 0;
      if (Array.isArray(parameters.eventName))
        return parameters.eventName;
      return [parameters.eventName];
    })();
    return logs.map((log) => {
      try {
        const abiItem = abi2.find((abiItem2) => abiItem2.type === "event" && log.topics[0] === toEventSelector(abiItem2));
        if (!abiItem)
          return null;
        const event = decodeEventLog({
          ...log,
          abi: [abiItem],
          strict
        });
        if (eventName && !eventName.includes(event.eventName))
          return null;
        if (!includesArgs({
          args: event.args,
          inputs: abiItem.inputs,
          matchArgs: args
        }))
          return null;
        return { ...event, ...log };
      } catch (err) {
        let eventName2;
        let isUnnamed;
        if (err instanceof AbiEventSignatureNotFoundError)
          return null;
        if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
          if (strict)
            return null;
          eventName2 = err.abiItem.name;
          isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
        }
        return { ...log, args: isUnnamed ? [] : {}, eventName: eventName2 };
      }
    }).filter(Boolean);
  }
  function includesArgs(parameters) {
    const { args, inputs, matchArgs } = parameters;
    if (!matchArgs)
      return true;
    if (!args)
      return false;
    function isEqual2(input, value, arg) {
      try {
        if (input.type === "address")
          return isAddressEqual(value, arg);
        if (input.type === "string" || input.type === "bytes")
          return keccak256(toBytes2(value)) === arg;
        return value === arg;
      } catch {
        return false;
      }
    }
    if (Array.isArray(args) && Array.isArray(matchArgs)) {
      return matchArgs.every((value, index2) => {
        if (value === null || value === void 0)
          return true;
        const input = inputs[index2];
        if (!input)
          return false;
        const value_ = Array.isArray(value) ? value : [value];
        return value_.some((value2) => isEqual2(input, value2, args[index2]));
      });
    }
    if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
      return Object.entries(matchArgs).every(([key, value]) => {
        if (value === null || value === void 0)
          return true;
        const input = inputs.find((input2) => input2.name === key);
        if (!input)
          return false;
        const value_ = Array.isArray(value) ? value : [value];
        return value_.some((value2) => isEqual2(input, value2, args[key]));
      });
    return false;
  }

  // node_modules/viem/_esm/actions/public/getLogs.js
  init_toHex();

  // node_modules/viem/_esm/utils/formatters/log.js
  function formatLog(log, { args, eventName } = {}) {
    return {
      ...log,
      blockHash: log.blockHash ? log.blockHash : null,
      blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
      logIndex: log.logIndex ? Number(log.logIndex) : null,
      transactionHash: log.transactionHash ? log.transactionHash : null,
      transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
      ...eventName ? { args, eventName } : {}
    };
  }

  // node_modules/viem/_esm/actions/public/getLogs.js
  async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
    const strict = strict_ ?? false;
    const events = events_ ?? (event ? [event] : void 0);
    let topics = [];
    if (events) {
      const encoded = events.flatMap((event2) => encodeEventTopics({
        abi: [event2],
        eventName: event2.name,
        args: events_ ? void 0 : args
      }));
      topics = [encoded];
      if (event)
        topics = topics[0];
    }
    let logs;
    if (blockHash) {
      logs = await client.request({
        method: "eth_getLogs",
        params: [{ address, topics, blockHash }]
      });
    } else {
      logs = await client.request({
        method: "eth_getLogs",
        params: [
          {
            address,
            topics,
            fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
            toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock
          }
        ]
      });
    }
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!events)
      return formattedLogs;
    return parseEventLogs({
      abi: events,
      args,
      logs: formattedLogs,
      strict
    });
  }

  // node_modules/viem/_esm/actions/public/getContractEvents.js
  async function getContractEvents(client, parameters) {
    const { abi: abi2, address, args, blockHash, eventName, fromBlock, toBlock, strict } = parameters;
    const event = eventName ? getAbiItem({ abi: abi2, name: eventName }) : void 0;
    const events = !event ? abi2.filter((x) => x.type === "event") : void 0;
    return getAction(client, getLogs, "getLogs")({
      address,
      args,
      blockHash,
      event,
      events,
      fromBlock,
      toBlock,
      strict
    });
  }

  // node_modules/viem/_esm/actions/public/readContract.js
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_call();
  async function readContract(client, parameters) {
    const { abi: abi2, address, args, functionName, ...rest } = parameters;
    const calldata = encodeFunctionData({
      abi: abi2,
      args,
      functionName
    });
    try {
      const { data } = await getAction(client, call, "call")({
        ...rest,
        data: calldata,
        to: address
      });
      return decodeFunctionResult({
        abi: abi2,
        args,
        functionName,
        data: data || "0x"
      });
    } catch (error) {
      throw getContractError(error, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/readContract",
        functionName
      });
    }
  }

  // node_modules/viem/_esm/actions/public/simulateContract.js
  init_parseAccount();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_call();
  async function simulateContract(client, parameters) {
    const { abi: abi2, address, args, dataSuffix, functionName, ...callRequest } = parameters;
    const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
    const calldata = encodeFunctionData({ abi: abi2, args, functionName });
    try {
      const { data } = await getAction(client, call, "call")({
        batch: false,
        data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
        to: address,
        ...callRequest,
        account
      });
      const result = decodeFunctionResult({
        abi: abi2,
        args,
        functionName,
        data: data || "0x"
      });
      const minimizedAbi = abi2.filter((abiItem) => "name" in abiItem && abiItem.name === parameters.functionName);
      return {
        result,
        request: {
          abi: minimizedAbi,
          address,
          args,
          dataSuffix,
          functionName,
          ...callRequest,
          account
        }
      };
    } catch (error) {
      throw getContractError(error, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/simulateContract",
        functionName,
        sender: account?.address
      });
    }
  }

  // node_modules/viem/_esm/actions/public/watchContractEvent.js
  init_abi();
  init_rpc();

  // node_modules/viem/_esm/utils/observe.js
  var listenersCache = /* @__PURE__ */ new Map();
  var cleanupCache = /* @__PURE__ */ new Map();
  var callbackCount = 0;
  function observe(observerId, callbacks, fn) {
    const callbackId = ++callbackCount;
    const getListeners = () => listenersCache.get(observerId) || [];
    const unsubscribe = () => {
      const listeners2 = getListeners();
      listenersCache.set(observerId, listeners2.filter((cb) => cb.id !== callbackId));
    };
    const unwatch = () => {
      const listeners2 = getListeners();
      if (!listeners2.some((cb) => cb.id === callbackId))
        return;
      const cleanup2 = cleanupCache.get(observerId);
      if (listeners2.length === 1 && cleanup2) {
        const p = cleanup2();
        if (p instanceof Promise)
          p.catch(() => {
          });
      }
      unsubscribe();
    };
    const listeners = getListeners();
    listenersCache.set(observerId, [
      ...listeners,
      { id: callbackId, fns: callbacks }
    ]);
    if (listeners && listeners.length > 0)
      return unwatch;
    const emit = {};
    for (const key in callbacks) {
      emit[key] = (...args) => {
        const listeners2 = getListeners();
        if (listeners2.length === 0)
          return;
        for (const listener of listeners2)
          listener.fns[key]?.(...args);
      };
    }
    const cleanup = fn(emit);
    if (typeof cleanup === "function")
      cleanupCache.set(observerId, cleanup);
    return unwatch;
  }

  // node_modules/viem/_esm/utils/wait.js
  async function wait(time) {
    return new Promise((res) => setTimeout(res, time));
  }

  // node_modules/viem/_esm/utils/poll.js
  function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
    let active = true;
    const unwatch = () => active = false;
    const watch = async () => {
      let data;
      if (emitOnBegin)
        data = await fn({ unpoll: unwatch });
      const initialWait = await initialWaitTime?.(data) ?? interval;
      await wait(initialWait);
      const poll2 = async () => {
        if (!active)
          return;
        await fn({ unpoll: unwatch });
        await wait(interval);
        poll2();
      };
      poll2();
    };
    watch();
    return unwatch;
  }

  // node_modules/viem/_esm/actions/public/watchContractEvent.js
  init_stringify();

  // node_modules/viem/_esm/utils/promise/withCache.js
  var promiseCache = /* @__PURE__ */ new Map();
  var responseCache = /* @__PURE__ */ new Map();
  function getCache(cacheKey2) {
    const buildCache = (cacheKey3, cache) => ({
      clear: () => cache.delete(cacheKey3),
      get: () => cache.get(cacheKey3),
      set: (data) => cache.set(cacheKey3, data)
    });
    const promise = buildCache(cacheKey2, promiseCache);
    const response = buildCache(cacheKey2, responseCache);
    return {
      clear: () => {
        promise.clear();
        response.clear();
      },
      promise,
      response
    };
  }
  async function withCache(fn, { cacheKey: cacheKey2, cacheTime = Number.POSITIVE_INFINITY }) {
    const cache = getCache(cacheKey2);
    const response = cache.response.get();
    if (response && cacheTime > 0) {
      const age = Date.now() - response.created.getTime();
      if (age < cacheTime)
        return response.data;
    }
    let promise = cache.promise.get();
    if (!promise) {
      promise = fn();
      cache.promise.set(promise);
    }
    try {
      const data = await promise;
      cache.response.set({ created: /* @__PURE__ */ new Date(), data });
      return data;
    } finally {
      cache.promise.clear();
    }
  }

  // node_modules/viem/_esm/actions/public/getBlockNumber.js
  var cacheKey = (id) => `blockNumber.${id}`;
  async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
    const blockNumberHex = await withCache(() => client.request({
      method: "eth_blockNumber"
    }), { cacheKey: cacheKey(client.uid), cacheTime });
    return BigInt(blockNumberHex);
  }

  // node_modules/viem/_esm/actions/public/getFilterChanges.js
  async function getFilterChanges(_client, { filter }) {
    const strict = "strict" in filter && filter.strict;
    const logs = await filter.request({
      method: "eth_getFilterChanges",
      params: [filter.id]
    });
    if (typeof logs[0] === "string")
      return logs;
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!("abi" in filter) || !filter.abi)
      return formattedLogs;
    return parseEventLogs({
      abi: filter.abi,
      logs: formattedLogs,
      strict
    });
  }

  // node_modules/viem/_esm/actions/public/uninstallFilter.js
  async function uninstallFilter(_client, { filter }) {
    return filter.request({
      method: "eth_uninstallFilter",
      params: [filter.id]
    });
  }

  // node_modules/viem/_esm/actions/public/watchContractEvent.js
  function watchContractEvent(client, parameters) {
    const { abi: abi2, address, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ } = parameters;
    const enablePolling = (() => {
      if (typeof poll_ !== "undefined")
        return poll_;
      if (typeof fromBlock === "bigint")
        return true;
      if (client.transport.type === "webSocket" || client.transport.type === "ipc")
        return false;
      if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
        return false;
      return true;
    })();
    const pollContractEvent = () => {
      const strict = strict_ ?? false;
      const observerId = stringify([
        "watchContractEvent",
        address,
        args,
        batch,
        client.uid,
        eventName,
        pollingInterval,
        strict,
        fromBlock
      ]);
      return observe(observerId, { onLogs, onError }, (emit) => {
        let previousBlockNumber;
        if (fromBlock !== void 0)
          previousBlockNumber = fromBlock - 1n;
        let filter;
        let initialized = false;
        const unwatch = poll(async () => {
          if (!initialized) {
            try {
              filter = await getAction(client, createContractEventFilter, "createContractEventFilter")({
                abi: abi2,
                address,
                args,
                eventName,
                strict,
                fromBlock
              });
            } catch {
            }
            initialized = true;
            return;
          }
          try {
            let logs;
            if (filter) {
              logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
            } else {
              const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
              if (previousBlockNumber && previousBlockNumber < blockNumber) {
                logs = await getAction(client, getContractEvents, "getContractEvents")({
                  abi: abi2,
                  address,
                  args,
                  eventName,
                  fromBlock: previousBlockNumber + 1n,
                  toBlock: blockNumber,
                  strict
                });
              } else {
                logs = [];
              }
              previousBlockNumber = blockNumber;
            }
            if (logs.length === 0)
              return;
            if (batch)
              emit.onLogs(logs);
            else
              for (const log of logs)
                emit.onLogs([log]);
          } catch (err) {
            if (filter && err instanceof InvalidInputRpcError)
              initialized = false;
            emit.onError?.(err);
          }
        }, {
          emitOnBegin: true,
          interval: pollingInterval
        });
        return async () => {
          if (filter)
            await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
          unwatch();
        };
      });
    };
    const subscribeContractEvent = () => {
      const strict = strict_ ?? false;
      const observerId = stringify([
        "watchContractEvent",
        address,
        args,
        batch,
        client.uid,
        eventName,
        pollingInterval,
        strict
      ]);
      let active = true;
      let unsubscribe = () => active = false;
      return observe(observerId, { onLogs, onError }, (emit) => {
        ;
        (async () => {
          try {
            const transport = (() => {
              if (client.transport.type === "fallback") {
                const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
                if (!transport2)
                  return client.transport;
                return transport2.value;
              }
              return client.transport;
            })();
            const topics = eventName ? encodeEventTopics({
              abi: abi2,
              eventName,
              args
            }) : [];
            const { unsubscribe: unsubscribe_ } = await transport.subscribe({
              params: ["logs", { address, topics }],
              onData(data) {
                if (!active)
                  return;
                const log = data.result;
                try {
                  const { eventName: eventName2, args: args2 } = decodeEventLog({
                    abi: abi2,
                    data: log.data,
                    topics: log.topics,
                    strict: strict_
                  });
                  const formatted = formatLog(log, {
                    args: args2,
                    eventName: eventName2
                  });
                  emit.onLogs([formatted]);
                } catch (err) {
                  let eventName2;
                  let isUnnamed;
                  if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                    if (strict_)
                      return;
                    eventName2 = err.abiItem.name;
                    isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
                  }
                  const formatted = formatLog(log, {
                    args: isUnnamed ? [] : {},
                    eventName: eventName2
                  });
                  emit.onLogs([formatted]);
                }
              },
              onError(error) {
                emit.onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return () => unsubscribe();
      });
    };
    return enablePolling ? pollContractEvent() : subscribeContractEvent();
  }

  // node_modules/viem/_esm/actions/wallet/sendRawTransaction.js
  async function sendRawTransaction(client, { serializedTransaction }) {
    return client.request({
      method: "eth_sendRawTransaction",
      params: [serializedTransaction]
    }, { retryCount: 0 });
  }

  // node_modules/viem/_esm/utils/promise/withRetry.js
  function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry: shouldRetry2 = () => true } = {}) {
    return new Promise((resolve, reject) => {
      const attemptRetry = async ({ count = 0 } = {}) => {
        const retry = async ({ error }) => {
          const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
          if (delay)
            await wait(delay);
          attemptRetry({ count: count + 1 });
        };
        try {
          const data = await fn();
          resolve(data);
        } catch (err) {
          if (count < retryCount && await shouldRetry2({ count, error: err }))
            return retry({ error: err });
          reject(err);
        }
      };
      attemptRetry();
    });
  }

  // node_modules/viem/_esm/utils/formatters/transactionReceipt.js
  init_fromHex();
  var receiptStatuses = {
    "0x0": "reverted",
    "0x1": "success"
  };
  function formatTransactionReceipt(transactionReceipt, _) {
    const receipt = {
      ...transactionReceipt,
      blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
      contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
      cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
      effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
      gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
      logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => formatLog(log)) : null,
      to: transactionReceipt.to ? transactionReceipt.to : null,
      transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
      status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
      type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
    };
    if (transactionReceipt.blobGasPrice)
      receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
    if (transactionReceipt.blobGasUsed)
      receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
    return receipt;
  }

  // node_modules/viem/_esm/clients/createClient.js
  init_parseAccount();

  // node_modules/viem/_esm/utils/uid.js
  var size4 = 256;
  var index = size4;
  var buffer;
  function uid(length = 11) {
    if (!buffer || index + length > size4 * 2) {
      buffer = "";
      index = 0;
      for (let i = 0; i < size4; i++) {
        buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
      }
    }
    return buffer.substring(index, index++ + length);
  }

  // node_modules/viem/_esm/clients/createClient.js
  function createClient(parameters) {
    const { batch, chain, ccipRead, key = "base", name = "Base Client", type = "base" } = parameters;
    const experimental_blockTag = parameters.experimental_blockTag ?? (typeof chain?.experimental_preconfirmationTime === "number" ? "pending" : void 0);
    const blockTime = chain?.blockTime ?? 12e3;
    const defaultPollingInterval = Math.min(Math.max(Math.floor(blockTime / 2), 500), 4e3);
    const pollingInterval = parameters.pollingInterval ?? defaultPollingInterval;
    const cacheTime = parameters.cacheTime ?? pollingInterval;
    const account = parameters.account ? parseAccount(parameters.account) : void 0;
    const { config, request, value } = parameters.transport({
      account,
      chain,
      pollingInterval
    });
    const transport = { ...config, ...value };
    const client = {
      account,
      batch,
      cacheTime,
      ccipRead,
      chain,
      key,
      name,
      pollingInterval,
      request,
      transport,
      type,
      uid: uid(),
      ...experimental_blockTag ? { experimental_blockTag } : {}
    };
    function extend(base) {
      return (extendFn) => {
        const extended = extendFn(base);
        for (const key2 in client)
          delete extended[key2];
        const combined = { ...base, ...extended };
        return Object.assign(combined, { extend: extend(combined) });
      };
    }
    return Object.assign(client, { extend: extend(client) });
  }

  // node_modules/viem/_esm/actions/ens/getEnsAddress.js
  init_abis();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_getChainContractAddress();
  init_trim();
  init_toHex();

  // node_modules/viem/_esm/utils/ens/errors.js
  init_base();
  init_contract();
  function isNullUniversalResolverError(err) {
    if (!(err instanceof BaseError2))
      return false;
    const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (!(cause instanceof ContractFunctionRevertedError))
      return false;
    if (cause.data?.errorName === "HttpError")
      return true;
    if (cause.data?.errorName === "ResolverError")
      return true;
    if (cause.data?.errorName === "ResolverNotContract")
      return true;
    if (cause.data?.errorName === "ResolverNotFound")
      return true;
    if (cause.data?.errorName === "ReverseAddressMismatch")
      return true;
    if (cause.data?.errorName === "UnsupportedResolverProfile")
      return true;
    return false;
  }

  // node_modules/viem/_esm/actions/ens/getEnsAddress.js
  init_localBatchGatewayRequest();

  // node_modules/viem/_esm/utils/ens/namehash.js
  init_concat();
  init_toBytes();
  init_toHex();
  init_keccak256();

  // node_modules/viem/_esm/utils/ens/encodedLabelToLabelhash.js
  init_isHex();
  function encodedLabelToLabelhash(label) {
    if (label.length !== 66)
      return null;
    if (label.indexOf("[") !== 0)
      return null;
    if (label.indexOf("]") !== 65)
      return null;
    const hash3 = `0x${label.slice(1, 65)}`;
    if (!isHex(hash3))
      return null;
    return hash3;
  }

  // node_modules/viem/_esm/utils/ens/namehash.js
  function namehash(name) {
    let result = new Uint8Array(32).fill(0);
    if (!name)
      return bytesToHex2(result);
    const labels = name.split(".");
    for (let i = labels.length - 1; i >= 0; i -= 1) {
      const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
      const hashed = hashFromEncodedLabel ? toBytes2(hashFromEncodedLabel) : keccak256(stringToBytes(labels[i]), "bytes");
      result = keccak256(concat([result, hashed]), "bytes");
    }
    return bytesToHex2(result);
  }

  // node_modules/viem/_esm/utils/ens/packetToBytes.js
  init_toBytes();

  // node_modules/viem/_esm/utils/ens/encodeLabelhash.js
  function encodeLabelhash(hash3) {
    return `[${hash3.slice(2)}]`;
  }

  // node_modules/viem/_esm/utils/ens/labelhash.js
  init_toBytes();
  init_toHex();
  init_keccak256();
  function labelhash(label) {
    const result = new Uint8Array(32).fill(0);
    if (!label)
      return bytesToHex2(result);
    return encodedLabelToLabelhash(label) || keccak256(stringToBytes(label));
  }

  // node_modules/viem/_esm/utils/ens/packetToBytes.js
  function packetToBytes(packet) {
    const value = packet.replace(/^\.|\.$/gm, "");
    if (value.length === 0)
      return new Uint8Array(1);
    const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);
    let offset = 0;
    const list = value.split(".");
    for (let i = 0; i < list.length; i++) {
      let encoded = stringToBytes(list[i]);
      if (encoded.byteLength > 255)
        encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
      bytes[offset] = encoded.length;
      bytes.set(encoded, offset + 1);
      offset += encoded.length + 1;
    }
    if (bytes.byteLength !== offset + 1)
      return bytes.slice(0, offset + 1);
    return bytes;
  }

  // node_modules/viem/_esm/actions/ens/getEnsAddress.js
  async function getEnsAddress(client, parameters) {
    const { blockNumber, blockTag, coinType, name, gatewayUrls, strict } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
      if (parameters.universalResolverAddress)
        return parameters.universalResolverAddress;
      if (!chain)
        throw new Error("client chain not configured. universalResolverAddress is required.");
      return getChainContractAddress({
        blockNumber,
        chain,
        contract: "ensUniversalResolver"
      });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld)))
      return null;
    const args = (() => {
      if (coinType != null)
        return [namehash(name), BigInt(coinType)];
      return [namehash(name)];
    })();
    try {
      const functionData = encodeFunctionData({
        abi: addressResolverAbi,
        functionName: "addr",
        args
      });
      const readContractParameters = {
        address: universalResolverAddress,
        abi: universalResolverResolveAbi,
        functionName: "resolveWithGateways",
        args: [
          toHex(packetToBytes(name)),
          functionData,
          gatewayUrls ?? [localBatchGatewayUrl]
        ],
        blockNumber,
        blockTag
      };
      const readContractAction = getAction(client, readContract, "readContract");
      const res = await readContractAction(readContractParameters);
      if (res[0] === "0x")
        return null;
      const address = decodeFunctionResult({
        abi: addressResolverAbi,
        args,
        functionName: "addr",
        data: res[0]
      });
      if (address === "0x")
        return null;
      if (trim(address) === "0x00")
        return null;
      return address;
    } catch (err) {
      if (strict)
        throw err;
      if (isNullUniversalResolverError(err))
        return null;
      throw err;
    }
  }

  // node_modules/viem/_esm/errors/ens.js
  init_base();
  var EnsAvatarInvalidMetadataError = class extends BaseError2 {
    constructor({ data }) {
      super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
        metaMessages: [
          "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
          "",
          `Provided data: ${JSON.stringify(data)}`
        ],
        name: "EnsAvatarInvalidMetadataError"
      });
    }
  };
  var EnsAvatarInvalidNftUriError = class extends BaseError2 {
    constructor({ reason }) {
      super(`ENS NFT avatar URI is invalid. ${reason}`, {
        name: "EnsAvatarInvalidNftUriError"
      });
    }
  };
  var EnsAvatarUriResolutionError = class extends BaseError2 {
    constructor({ uri }) {
      super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
    }
  };
  var EnsAvatarUnsupportedNamespaceError = class extends BaseError2 {
    constructor({ namespace }) {
      super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
    }
  };

  // node_modules/viem/_esm/utils/ens/avatar/utils.js
  var networkRegex = /(?<protocol>https?:\/\/[^/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
  var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
  var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
  var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
  async function isImageUri(uri) {
    try {
      const res = await fetch(uri, { method: "HEAD" });
      if (res.status === 200) {
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      }
      return false;
    } catch (error) {
      if (typeof error === "object" && typeof error.response !== "undefined") {
        return false;
      }
      if (!Object.hasOwn(globalThis, "Image"))
        return false;
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(true);
        };
        img.onerror = () => {
          resolve(false);
        };
        img.src = uri;
      });
    }
  }
  function getGateway(custom2, defaultGateway) {
    if (!custom2)
      return defaultGateway;
    if (custom2.endsWith("/"))
      return custom2.slice(0, -1);
    return custom2;
  }
  function resolveAvatarUri({ uri, gatewayUrls }) {
    const isEncoded = base64Regex.test(uri);
    if (isEncoded)
      return { uri, isOnChain: true, isEncoded };
    const ipfsGateway = getGateway(gatewayUrls?.ipfs, "https://ipfs.io");
    const arweaveGateway = getGateway(gatewayUrls?.arweave, "https://arweave.net");
    const networkRegexMatch = uri.match(networkRegex);
    const { protocol, subpath, target, subtarget = "" } = networkRegexMatch?.groups || {};
    const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
    const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
    if (uri.startsWith("http") && !isIPNS && !isIPFS) {
      let replacedUri = uri;
      if (gatewayUrls?.arweave)
        replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
      return { uri: replacedUri, isOnChain: false, isEncoded: false };
    }
    if ((isIPNS || isIPFS) && target) {
      return {
        uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
        isOnChain: false,
        isEncoded: false
      };
    }
    if (protocol === "ar:/" && target) {
      return {
        uri: `${arweaveGateway}/${target}${subtarget || ""}`,
        isOnChain: false,
        isEncoded: false
      };
    }
    let parsedUri = uri.replace(dataURIRegex, "");
    if (parsedUri.startsWith("<svg")) {
      parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
    }
    if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) {
      return {
        uri: parsedUri,
        isOnChain: true,
        isEncoded: false
      };
    }
    throw new EnsAvatarUriResolutionError({ uri });
  }
  function getJsonImage(data) {
    if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) {
      throw new EnsAvatarInvalidMetadataError({ data });
    }
    return data.image || data.image_url || data.image_data;
  }
  async function getMetadataAvatarUri({ gatewayUrls, uri }) {
    try {
      const res = await fetch(uri).then((res2) => res2.json());
      const image = await parseAvatarUri({
        gatewayUrls,
        uri: getJsonImage(res)
      });
      return image;
    } catch {
      throw new EnsAvatarUriResolutionError({ uri });
    }
  }
  async function parseAvatarUri({ gatewayUrls, uri }) {
    const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
    if (isOnChain)
      return resolvedURI;
    const isImage = await isImageUri(resolvedURI);
    if (isImage)
      return resolvedURI;
    throw new EnsAvatarUriResolutionError({ uri });
  }
  function parseNftUri(uri_) {
    let uri = uri_;
    if (uri.startsWith("did:nft:")) {
      uri = uri.replace("did:nft:", "").replace(/_/g, "/");
    }
    const [reference, asset_namespace, tokenID] = uri.split("/");
    const [eip_namespace, chainID] = reference.split(":");
    const [erc_namespace, contractAddress] = asset_namespace.split(":");
    if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155")
      throw new EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
    if (!chainID)
      throw new EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
    if (!contractAddress)
      throw new EnsAvatarInvalidNftUriError({
        reason: "Contract address not found"
      });
    if (!tokenID)
      throw new EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
    if (!erc_namespace)
      throw new EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
    return {
      chainID: Number.parseInt(chainID, 10),
      namespace: erc_namespace.toLowerCase(),
      contractAddress,
      tokenID
    };
  }
  async function getNftTokenUri(client, { nft }) {
    if (nft.namespace === "erc721") {
      return readContract(client, {
        address: nft.contractAddress,
        abi: [
          {
            name: "tokenURI",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "tokenId", type: "uint256" }],
            outputs: [{ name: "", type: "string" }]
          }
        ],
        functionName: "tokenURI",
        args: [BigInt(nft.tokenID)]
      });
    }
    if (nft.namespace === "erc1155") {
      return readContract(client, {
        address: nft.contractAddress,
        abi: [
          {
            name: "uri",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "_id", type: "uint256" }],
            outputs: [{ name: "", type: "string" }]
          }
        ],
        functionName: "uri",
        args: [BigInt(nft.tokenID)]
      });
    }
    throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
  }

  // node_modules/viem/_esm/utils/ens/avatar/parseAvatarRecord.js
  async function parseAvatarRecord(client, { gatewayUrls, record }) {
    if (/eip155:/i.test(record))
      return parseNftAvatarUri(client, { gatewayUrls, record });
    return parseAvatarUri({ uri: record, gatewayUrls });
  }
  async function parseNftAvatarUri(client, { gatewayUrls, record }) {
    const nft = parseNftUri(record);
    const nftUri = await getNftTokenUri(client, { nft });
    const { uri: resolvedNftUri, isOnChain, isEncoded } = resolveAvatarUri({ uri: nftUri, gatewayUrls });
    if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
      const encodedJson = isEncoded ? (
        // if it is encoded, decode it
        atob(resolvedNftUri.replace("data:application/json;base64,", ""))
      ) : (
        // if it isn't encoded assume it is a JSON string, but it could be anything (it will error if it is)
        resolvedNftUri
      );
      const decoded = JSON.parse(encodedJson);
      return parseAvatarUri({ uri: getJsonImage(decoded), gatewayUrls });
    }
    let uriTokenId = nft.tokenID;
    if (nft.namespace === "erc1155")
      uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
    return getMetadataAvatarUri({
      gatewayUrls,
      uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
    });
  }

  // node_modules/viem/_esm/actions/ens/getEnsText.js
  init_abis();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_getChainContractAddress();
  init_toHex();
  init_localBatchGatewayRequest();
  async function getEnsText(client, parameters) {
    const { blockNumber, blockTag, key, name, gatewayUrls, strict } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
      if (parameters.universalResolverAddress)
        return parameters.universalResolverAddress;
      if (!chain)
        throw new Error("client chain not configured. universalResolverAddress is required.");
      return getChainContractAddress({
        blockNumber,
        chain,
        contract: "ensUniversalResolver"
      });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld)))
      return null;
    try {
      const readContractParameters = {
        address: universalResolverAddress,
        abi: universalResolverResolveAbi,
        args: [
          toHex(packetToBytes(name)),
          encodeFunctionData({
            abi: textResolverAbi,
            functionName: "text",
            args: [namehash(name), key]
          }),
          gatewayUrls ?? [localBatchGatewayUrl]
        ],
        functionName: "resolveWithGateways",
        blockNumber,
        blockTag
      };
      const readContractAction = getAction(client, readContract, "readContract");
      const res = await readContractAction(readContractParameters);
      if (res[0] === "0x")
        return null;
      const record = decodeFunctionResult({
        abi: textResolverAbi,
        functionName: "text",
        data: res[0]
      });
      return record === "" ? null : record;
    } catch (err) {
      if (strict)
        throw err;
      if (isNullUniversalResolverError(err))
        return null;
      throw err;
    }
  }

  // node_modules/viem/_esm/actions/ens/getEnsAvatar.js
  async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress }) {
    const record = await getAction(client, getEnsText, "getEnsText")({
      blockNumber,
      blockTag,
      key: "avatar",
      name,
      universalResolverAddress,
      gatewayUrls,
      strict
    });
    if (!record)
      return null;
    try {
      return await parseAvatarRecord(client, {
        record,
        gatewayUrls: assetGatewayUrls
      });
    } catch {
      return null;
    }
  }

  // node_modules/viem/_esm/actions/ens/getEnsName.js
  init_abis();
  init_getChainContractAddress();
  init_localBatchGatewayRequest();
  async function getEnsName(client, parameters) {
    const { address, blockNumber, blockTag, coinType = 60n, gatewayUrls, strict } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
      if (parameters.universalResolverAddress)
        return parameters.universalResolverAddress;
      if (!chain)
        throw new Error("client chain not configured. universalResolverAddress is required.");
      return getChainContractAddress({
        blockNumber,
        chain,
        contract: "ensUniversalResolver"
      });
    })();
    try {
      const readContractParameters = {
        address: universalResolverAddress,
        abi: universalResolverReverseAbi,
        args: [address, coinType, gatewayUrls ?? [localBatchGatewayUrl]],
        functionName: "reverseWithGateways",
        blockNumber,
        blockTag
      };
      const readContractAction = getAction(client, readContract, "readContract");
      const [name] = await readContractAction(readContractParameters);
      return name || null;
    } catch (err) {
      if (strict)
        throw err;
      if (isNullUniversalResolverError(err))
        return null;
      throw err;
    }
  }

  // node_modules/viem/_esm/actions/ens/getEnsResolver.js
  init_getChainContractAddress();
  init_toHex();
  async function getEnsResolver(client, parameters) {
    const { blockNumber, blockTag, name } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
      if (parameters.universalResolverAddress)
        return parameters.universalResolverAddress;
      if (!chain)
        throw new Error("client chain not configured. universalResolverAddress is required.");
      return getChainContractAddress({
        blockNumber,
        chain,
        contract: "ensUniversalResolver"
      });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld)))
      throw new Error(`${name} is not a valid ENS TLD (${tlds?.join(", ")}) for chain "${chain.name}" (id: ${chain.id}).`);
    const [resolverAddress] = await getAction(client, readContract, "readContract")({
      address: universalResolverAddress,
      abi: [
        {
          inputs: [{ type: "bytes" }],
          name: "findResolver",
          outputs: [
            { type: "address" },
            { type: "bytes32" },
            { type: "uint256" }
          ],
          stateMutability: "view",
          type: "function"
        }
      ],
      functionName: "findResolver",
      args: [toHex(packetToBytes(name))],
      blockNumber,
      blockTag
    });
    return resolverAddress;
  }

  // node_modules/viem/_esm/clients/decorators/public.js
  init_call();

  // node_modules/viem/_esm/actions/public/createAccessList.js
  init_parseAccount();
  init_toHex();
  init_getCallError();
  init_extract();
  init_transactionRequest();
  init_assertRequest();
  async function createAccessList(client, args) {
    const { account: account_ = client.account, blockNumber, blockTag = "latest", blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, to, value, ...rest } = args;
    const account = account_ ? parseAccount(account_) : void 0;
    try {
      assertRequest(args);
      const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format({
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
        account,
        blobs,
        data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        to,
        value
      }, "createAccessList");
      const response = await client.request({
        method: "eth_createAccessList",
        params: [request, block]
      });
      return {
        accessList: response.accessList,
        gasUsed: BigInt(response.gasUsed)
      };
    } catch (err) {
      throw getCallError(err, {
        ...args,
        account,
        chain: client.chain
      });
    }
  }

  // node_modules/viem/_esm/actions/public/createBlockFilter.js
  async function createBlockFilter(client) {
    const getRequest = createFilterRequestScope(client, {
      method: "eth_newBlockFilter"
    });
    const id = await client.request({
      method: "eth_newBlockFilter"
    });
    return { id, request: getRequest(id), type: "block" };
  }

  // node_modules/viem/_esm/actions/public/createEventFilter.js
  init_toHex();
  async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock } = {}) {
    const events = events_ ?? (event ? [event] : void 0);
    const getRequest = createFilterRequestScope(client, {
      method: "eth_newFilter"
    });
    let topics = [];
    if (events) {
      const encoded = events.flatMap((event2) => encodeEventTopics({
        abi: [event2],
        eventName: event2.name,
        args
      }));
      topics = [encoded];
      if (event)
        topics = topics[0];
    }
    const id = await client.request({
      method: "eth_newFilter",
      params: [
        {
          address,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
          ...topics.length ? { topics } : {}
        }
      ]
    });
    return {
      abi: events,
      args,
      eventName: event ? event.name : void 0,
      fromBlock,
      id,
      request: getRequest(id),
      strict: Boolean(strict),
      toBlock,
      type: "event"
    };
  }

  // node_modules/viem/_esm/actions/public/createPendingTransactionFilter.js
  async function createPendingTransactionFilter(client) {
    const getRequest = createFilterRequestScope(client, {
      method: "eth_newPendingTransactionFilter"
    });
    const id = await client.request({
      method: "eth_newPendingTransactionFilter"
    });
    return { id, request: getRequest(id), type: "transaction" };
  }

  // node_modules/viem/_esm/actions/public/getBalance.js
  init_toHex();
  async function getBalance(client, { address, blockNumber, blockTag = client.experimental_blockTag ?? "latest" }) {
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const balance = await client.request({
      method: "eth_getBalance",
      params: [address, blockNumberHex || blockTag]
    });
    return BigInt(balance);
  }

  // node_modules/viem/_esm/actions/public/getBlobBaseFee.js
  async function getBlobBaseFee(client) {
    const baseFee = await client.request({
      method: "eth_blobBaseFee"
    });
    return BigInt(baseFee);
  }

  // node_modules/viem/_esm/actions/public/getBlockTransactionCount.js
  init_fromHex();
  init_toHex();
  async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    let count;
    if (blockHash) {
      count = await client.request({
        method: "eth_getBlockTransactionCountByHash",
        params: [blockHash]
      }, { dedupe: true });
    } else {
      count = await client.request({
        method: "eth_getBlockTransactionCountByNumber",
        params: [blockNumberHex || blockTag]
      }, { dedupe: Boolean(blockNumberHex) });
    }
    return hexToNumber(count);
  }

  // node_modules/viem/_esm/actions/public/getCode.js
  init_toHex();
  async function getCode(client, { address, blockNumber, blockTag = "latest" }) {
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    const hex = await client.request({
      method: "eth_getCode",
      params: [address, blockNumberHex || blockTag]
    }, { dedupe: Boolean(blockNumberHex) });
    if (hex === "0x")
      return void 0;
    return hex;
  }

  // node_modules/viem/_esm/errors/eip712.js
  init_base();
  var Eip712DomainNotFoundError = class extends BaseError2 {
    constructor({ address }) {
      super(`No EIP-712 domain found on contract "${address}".`, {
        metaMessages: [
          "Ensure that:",
          `- The contract is deployed at the address "${address}".`,
          "- `eip712Domain()` function exists on the contract.",
          "- `eip712Domain()` function matches signature to ERC-5267 specification."
        ],
        name: "Eip712DomainNotFoundError"
      });
    }
  };

  // node_modules/viem/_esm/actions/public/getEip712Domain.js
  async function getEip712Domain(client, parameters) {
    const { address, factory, factoryData } = parameters;
    try {
      const [fields, name, version4, chainId, verifyingContract, salt, extensions] = await getAction(client, readContract, "readContract")({
        abi,
        address,
        functionName: "eip712Domain",
        factory,
        factoryData
      });
      return {
        domain: {
          name,
          version: version4,
          chainId: Number(chainId),
          verifyingContract,
          salt
        },
        extensions,
        fields
      };
    } catch (e) {
      const error = e;
      if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") {
        throw new Eip712DomainNotFoundError({ address });
      }
      throw error;
    }
  }
  var abi = [
    {
      inputs: [],
      name: "eip712Domain",
      outputs: [
        { name: "fields", type: "bytes1" },
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32" },
        { name: "extensions", type: "uint256[]" }
      ],
      stateMutability: "view",
      type: "function"
    }
  ];

  // node_modules/viem/_esm/actions/public/getFeeHistory.js
  init_toHex();

  // node_modules/viem/_esm/utils/formatters/feeHistory.js
  function formatFeeHistory(feeHistory) {
    return {
      baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
      gasUsedRatio: feeHistory.gasUsedRatio,
      oldestBlock: BigInt(feeHistory.oldestBlock),
      reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value)))
    };
  }

  // node_modules/viem/_esm/actions/public/getFeeHistory.js
  async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const feeHistory = await client.request({
      method: "eth_feeHistory",
      params: [
        numberToHex(blockCount),
        blockNumberHex || blockTag,
        rewardPercentiles
      ]
    }, { dedupe: Boolean(blockNumberHex) });
    return formatFeeHistory(feeHistory);
  }

  // node_modules/viem/_esm/actions/public/getFilterLogs.js
  async function getFilterLogs(_client, { filter }) {
    const strict = filter.strict ?? false;
    const logs = await filter.request({
      method: "eth_getFilterLogs",
      params: [filter.id]
    });
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!filter.abi)
      return formattedLogs;
    return parseEventLogs({
      abi: filter.abi,
      logs: formattedLogs,
      strict
    });
  }

  // node_modules/viem/_esm/actions/public/getProof.js
  init_toHex();

  // node_modules/viem/_esm/utils/authorization/verifyAuthorization.js
  init_getAddress();
  init_isAddressEqual();
  async function verifyAuthorization({ address, authorization, signature }) {
    return isAddressEqual(getAddress(address), await recoverAuthorizationAddress({
      authorization,
      signature
    }));
  }

  // node_modules/viem/_esm/utils/buildRequest.js
  init_base();
  init_request();
  init_rpc();
  init_toHex();

  // node_modules/viem/_esm/utils/promise/withDedupe.js
  init_lru();
  var promiseCache2 = /* @__PURE__ */ new LruMap(8192);
  function withDedupe(fn, { enabled = true, id }) {
    if (!enabled || !id)
      return fn();
    if (promiseCache2.get(id))
      return promiseCache2.get(id);
    const promise = fn().finally(() => promiseCache2.delete(id));
    promiseCache2.set(id, promise);
    return promise;
  }

  // node_modules/viem/_esm/utils/buildRequest.js
  init_stringify();
  function buildRequest(request, options = {}) {
    return async (args, overrideOptions = {}) => {
      const { dedupe = false, methods, retryDelay = 150, retryCount = 3, uid: uid2 } = {
        ...options,
        ...overrideOptions
      };
      const { method } = args;
      if (methods?.exclude?.includes(method))
        throw new MethodNotSupportedRpcError(new Error("method not supported"), {
          method
        });
      if (methods?.include && !methods.include.includes(method))
        throw new MethodNotSupportedRpcError(new Error("method not supported"), {
          method
        });
      const requestId = dedupe ? stringToHex(`${uid2}.${stringify(args)}`) : void 0;
      return withDedupe(() => withRetry(async () => {
        try {
          return await request(args);
        } catch (err_) {
          const err = err_;
          switch (err.code) {
            // -32700
            case ParseRpcError.code:
              throw new ParseRpcError(err);
            // -32600
            case InvalidRequestRpcError.code:
              throw new InvalidRequestRpcError(err);
            // -32601
            case MethodNotFoundRpcError.code:
              throw new MethodNotFoundRpcError(err, { method: args.method });
            // -32602
            case InvalidParamsRpcError.code:
              throw new InvalidParamsRpcError(err);
            // -32603
            case InternalRpcError.code:
              throw new InternalRpcError(err);
            // -32000
            case InvalidInputRpcError.code:
              throw new InvalidInputRpcError(err);
            // -32001
            case ResourceNotFoundRpcError.code:
              throw new ResourceNotFoundRpcError(err);
            // -32002
            case ResourceUnavailableRpcError.code:
              throw new ResourceUnavailableRpcError(err);
            // -32003
            case TransactionRejectedRpcError.code:
              throw new TransactionRejectedRpcError(err);
            // -32004
            case MethodNotSupportedRpcError.code:
              throw new MethodNotSupportedRpcError(err, {
                method: args.method
              });
            // -32005
            case LimitExceededRpcError.code:
              throw new LimitExceededRpcError(err);
            // -32006
            case JsonRpcVersionUnsupportedError.code:
              throw new JsonRpcVersionUnsupportedError(err);
            // 4001
            case UserRejectedRequestError.code:
              throw new UserRejectedRequestError(err);
            // 4100
            case UnauthorizedProviderError.code:
              throw new UnauthorizedProviderError(err);
            // 4200
            case UnsupportedProviderMethodError.code:
              throw new UnsupportedProviderMethodError(err);
            // 4900
            case ProviderDisconnectedError.code:
              throw new ProviderDisconnectedError(err);
            // 4901
            case ChainDisconnectedError.code:
              throw new ChainDisconnectedError(err);
            // 4902
            case SwitchChainError.code:
              throw new SwitchChainError(err);
            // 5700
            case UnsupportedNonOptionalCapabilityError.code:
              throw new UnsupportedNonOptionalCapabilityError(err);
            // 5710
            case UnsupportedChainIdError.code:
              throw new UnsupportedChainIdError(err);
            // 5720
            case DuplicateIdError.code:
              throw new DuplicateIdError(err);
            // 5730
            case UnknownBundleIdError.code:
              throw new UnknownBundleIdError(err);
            // 5740
            case BundleTooLargeError.code:
              throw new BundleTooLargeError(err);
            // 5750
            case AtomicReadyWalletRejectedUpgradeError.code:
              throw new AtomicReadyWalletRejectedUpgradeError(err);
            // 5760
            case AtomicityNotSupportedError.code:
              throw new AtomicityNotSupportedError(err);
            // CAIP-25: User Rejected Error
            // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
            case 5e3:
              throw new UserRejectedRequestError(err);
            default:
              if (err_ instanceof BaseError2)
                throw err_;
              throw new UnknownRpcError(err);
          }
        }
      }, {
        delay: ({ count, error }) => {
          if (error && error instanceof HttpRequestError) {
            const retryAfter = error?.headers?.get("Retry-After");
            if (retryAfter?.match(/\d/))
              return Number.parseInt(retryAfter, 10) * 1e3;
          }
          return ~~(1 << count) * retryDelay;
        },
        retryCount,
        shouldRetry: ({ error }) => shouldRetry(error)
      }), { enabled: dedupe, id: requestId });
    };
  }
  function shouldRetry(error) {
    if ("code" in error && typeof error.code === "number") {
      if (error.code === -1)
        return true;
      if (error.code === LimitExceededRpcError.code)
        return true;
      if (error.code === InternalRpcError.code)
        return true;
      return false;
    }
    if (error instanceof HttpRequestError && error.status) {
      if (error.status === 403)
        return true;
      if (error.status === 408)
        return true;
      if (error.status === 413)
        return true;
      if (error.status === 429)
        return true;
      if (error.status === 500)
        return true;
      if (error.status === 502)
        return true;
      if (error.status === 503)
        return true;
      if (error.status === 504)
        return true;
      return false;
    }
    return true;
  }

  // node_modules/viem/_esm/utils/chain/defineChain.js
  function defineChain(chain) {
    return {
      formatters: void 0,
      fees: void 0,
      serializers: void 0,
      ...chain
    };
  }

  // node_modules/viem/_esm/utils/index.js
  init_fromHex();
  init_toHex();

  // node_modules/viem/_esm/utils/rpc/http.js
  init_request();

  // node_modules/viem/_esm/utils/promise/withTimeout.js
  function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
    return new Promise((resolve, reject) => {
      ;
      (async () => {
        let timeoutId;
        try {
          const controller = new AbortController();
          if (timeout > 0) {
            timeoutId = setTimeout(() => {
              if (signal) {
                controller.abort();
              } else {
                reject(errorInstance);
              }
            }, timeout);
          }
          resolve(await fn({ signal: controller?.signal || null }));
        } catch (err) {
          if (err?.name === "AbortError")
            reject(errorInstance);
          reject(err);
        } finally {
          clearTimeout(timeoutId);
        }
      })();
    });
  }

  // node_modules/viem/_esm/utils/rpc/http.js
  init_stringify();

  // node_modules/viem/_esm/utils/rpc/id.js
  function createIdStore() {
    return {
      current: 0,
      take() {
        return this.current++;
      },
      reset() {
        this.current = 0;
      }
    };
  }
  var idCache = /* @__PURE__ */ createIdStore();

  // node_modules/viem/_esm/utils/rpc/http.js
  function getHttpRpcClient(url, options = {}) {
    return {
      async request(params) {
        const { body, fetchFn = options.fetchFn ?? fetch, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
        const fetchOptions = {
          ...options.fetchOptions ?? {},
          ...params.fetchOptions ?? {}
        };
        const { headers, method, signal: signal_ } = fetchOptions;
        try {
          const response = await withTimeout(async ({ signal }) => {
            const init2 = {
              ...fetchOptions,
              body: Array.isArray(body) ? stringify(body.map((body2) => ({
                jsonrpc: "2.0",
                id: body2.id ?? idCache.take(),
                ...body2
              }))) : stringify({
                jsonrpc: "2.0",
                id: body.id ?? idCache.take(),
                ...body
              }),
              headers: {
                "Content-Type": "application/json",
                ...headers
              },
              method: method || "POST",
              signal: signal_ || (timeout > 0 ? signal : null)
            };
            const request = new Request(url, init2);
            const args = await onRequest?.(request, init2) ?? { ...init2, url };
            const response2 = await fetchFn(args.url ?? url, args);
            return response2;
          }, {
            errorInstance: new TimeoutError({ body, url }),
            timeout,
            signal: true
          });
          if (onResponse)
            await onResponse(response);
          let data;
          if (response.headers.get("Content-Type")?.startsWith("application/json"))
            data = await response.json();
          else {
            data = await response.text();
            try {
              data = JSON.parse(data || "{}");
            } catch (err) {
              if (response.ok)
                throw err;
              data = { error: data };
            }
          }
          if (!response.ok) {
            throw new HttpRequestError({
              body,
              details: stringify(data.error) || response.statusText,
              headers: response.headers,
              status: response.status,
              url
            });
          }
          return data;
        } catch (err) {
          if (err instanceof HttpRequestError)
            throw err;
          if (err instanceof TimeoutError)
            throw err;
          throw new HttpRequestError({
            body,
            cause: err,
            url
          });
        }
      }
    };
  }

  // node_modules/viem/_esm/utils/signature/hashMessage.js
  init_keccak256();

  // node_modules/viem/_esm/constants/strings.js
  var presignMessagePrefix = "Ethereum Signed Message:\n";

  // node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
  init_concat();
  init_size();
  init_toHex();
  function toPrefixedMessage(message_) {
    const message = (() => {
      if (typeof message_ === "string")
        return stringToHex(message_);
      if (typeof message_.raw === "string")
        return message_.raw;
      return bytesToHex2(message_.raw);
    })();
    const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
    return concat([prefix, message]);
  }

  // node_modules/viem/_esm/utils/signature/hashMessage.js
  function hashMessage(message, to_) {
    return keccak256(toPrefixedMessage(message), to_);
  }

  // node_modules/viem/_esm/utils/signature/hashTypedData.js
  init_encodeAbiParameters();
  init_concat();
  init_toHex();
  init_keccak256();

  // node_modules/viem/_esm/utils/typedData.js
  init_abi();
  init_address();

  // node_modules/viem/_esm/errors/typedData.js
  init_stringify();
  init_base();
  var InvalidDomainError = class extends BaseError2 {
    constructor({ domain }) {
      super(`Invalid domain "${stringify(domain)}".`, {
        metaMessages: ["Must be a valid EIP-712 domain."]
      });
    }
  };
  var InvalidPrimaryTypeError = class extends BaseError2 {
    constructor({ primaryType, types }) {
      super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
        docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
        metaMessages: ["Check that the primary type is a key in `types`."]
      });
    }
  };
  var InvalidStructTypeError = class extends BaseError2 {
    constructor({ type }) {
      super(`Struct type "${type}" is invalid.`, {
        metaMessages: ["Struct type must not be a Solidity type."],
        name: "InvalidStructTypeError"
      });
    }
  };

  // node_modules/viem/_esm/utils/typedData.js
  init_isAddress();
  init_size();
  init_toHex();
  init_regex2();
  function validateTypedData(parameters) {
    const { domain, message, primaryType, types } = parameters;
    const validateData = (struct, data) => {
      for (const param of struct) {
        const { name, type } = param;
        const value = data[name];
        const integerMatch = type.match(integerRegex2);
        if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
          const [_type, base, size_] = integerMatch;
          numberToHex(value, {
            signed: base === "int",
            size: Number.parseInt(size_, 10) / 8
          });
        }
        if (type === "address" && typeof value === "string" && !isAddress(value))
          throw new InvalidAddressError({ address: value });
        const bytesMatch = type.match(bytesRegex2);
        if (bytesMatch) {
          const [_type, size_] = bytesMatch;
          if (size_ && size(value) !== Number.parseInt(size_, 10))
            throw new BytesSizeMismatchError({
              expectedSize: Number.parseInt(size_, 10),
              givenSize: size(value)
            });
        }
        const struct2 = types[type];
        if (struct2) {
          validateReference(type);
          validateData(struct2, value);
        }
      }
    };
    if (types.EIP712Domain && domain) {
      if (typeof domain !== "object")
        throw new InvalidDomainError({ domain });
      validateData(types.EIP712Domain, domain);
    }
    if (primaryType !== "EIP712Domain") {
      if (types[primaryType])
        validateData(types[primaryType], message);
      else
        throw new InvalidPrimaryTypeError({ primaryType, types });
    }
  }
  function getTypesForEIP712Domain({ domain }) {
    return [
      typeof domain?.name === "string" && { name: "name", type: "string" },
      domain?.version && { name: "version", type: "string" },
      (typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
        name: "chainId",
        type: "uint256"
      },
      domain?.verifyingContract && {
        name: "verifyingContract",
        type: "address"
      },
      domain?.salt && { name: "salt", type: "bytes32" }
    ].filter(Boolean);
  }
  function validateReference(type) {
    if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
      throw new InvalidStructTypeError({ type });
  }

  // node_modules/viem/_esm/utils/signature/hashTypedData.js
  function hashTypedData(parameters) {
    const { domain = {}, message, primaryType } = parameters;
    const types = {
      EIP712Domain: getTypesForEIP712Domain({ domain }),
      ...parameters.types
    };
    validateTypedData({
      domain,
      message,
      primaryType,
      types
    });
    const parts = ["0x1901"];
    if (domain)
      parts.push(hashDomain({
        domain,
        types
      }));
    if (primaryType !== "EIP712Domain")
      parts.push(hashStruct({
        data: message,
        primaryType,
        types
      }));
    return keccak256(concat(parts));
  }
  function hashDomain({ domain, types }) {
    return hashStruct({
      data: domain,
      primaryType: "EIP712Domain",
      types
    });
  }
  function hashStruct({ data, primaryType, types }) {
    const encoded = encodeData({
      data,
      primaryType,
      types
    });
    return keccak256(encoded);
  }
  function encodeData({ data, primaryType, types }) {
    const encodedTypes = [{ type: "bytes32" }];
    const encodedValues = [hashType({ primaryType, types })];
    for (const field of types[primaryType]) {
      const [type, value] = encodeField({
        types,
        name: field.name,
        type: field.type,
        value: data[field.name]
      });
      encodedTypes.push(type);
      encodedValues.push(value);
    }
    return encodeAbiParameters(encodedTypes, encodedValues);
  }
  function hashType({ primaryType, types }) {
    const encodedHashType = toHex(encodeType({ primaryType, types }));
    return keccak256(encodedHashType);
  }
  function encodeType({ primaryType, types }) {
    let result = "";
    const unsortedDeps = findTypeDependencies({ primaryType, types });
    unsortedDeps.delete(primaryType);
    const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
    for (const type of deps) {
      result += `${type}(${types[type].map(({ name, type: t2 }) => `${t2} ${name}`).join(",")})`;
    }
    return result;
  }
  function findTypeDependencies({ primaryType: primaryType_, types }, results = /* @__PURE__ */ new Set()) {
    const match = primaryType_.match(/^\w*/u);
    const primaryType = match?.[0];
    if (results.has(primaryType) || types[primaryType] === void 0) {
      return results;
    }
    results.add(primaryType);
    for (const field of types[primaryType]) {
      findTypeDependencies({ primaryType: field.type, types }, results);
    }
    return results;
  }
  function encodeField({ types, name, type, value }) {
    if (types[type] !== void 0) {
      return [
        { type: "bytes32" },
        keccak256(encodeData({ data: value, primaryType: type, types }))
      ];
    }
    if (type === "bytes")
      return [{ type: "bytes32" }, keccak256(value)];
    if (type === "string")
      return [{ type: "bytes32" }, keccak256(toHex(value))];
    if (type.lastIndexOf("]") === type.length - 1) {
      const parsedType = type.slice(0, type.lastIndexOf("["));
      const typeValuePairs = value.map((item) => encodeField({
        name,
        type: parsedType,
        types,
        value: item
      }));
      return [
        { type: "bytes32" },
        keccak256(encodeAbiParameters(typeValuePairs.map(([t2]) => t2), typeValuePairs.map(([, v]) => v)))
      ];
    }
    return [{ type }, value];
  }

  // node_modules/ox/_esm/erc8010/SignatureErc8010.js
  var SignatureErc8010_exports = {};
  __export(SignatureErc8010_exports, {
    InvalidWrappedSignatureError: () => InvalidWrappedSignatureError,
    assert: () => assert6,
    from: () => from9,
    magicBytes: () => magicBytes,
    suffixParameters: () => suffixParameters,
    unwrap: () => unwrap,
    validate: () => validate4,
    wrap: () => wrap
  });

  // node_modules/ox/_esm/core/AbiParameters.js
  init_exports();

  // node_modules/ox/_esm/core/Address.js
  init_Bytes();

  // node_modules/ox/_esm/core/internal/lru.js
  var LruMap2 = class extends Map {
    constructor(size5) {
      super();
      Object.defineProperty(this, "maxSize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.maxSize = size5;
    }
    get(key) {
      const value = super.get(key);
      if (super.has(key) && value !== void 0) {
        this.delete(key);
        super.set(key, value);
      }
      return value;
    }
    set(key, value) {
      super.set(key, value);
      if (this.maxSize && this.size > this.maxSize) {
        const firstKey = this.keys().next().value;
        if (firstKey)
          this.delete(firstKey);
      }
      return this;
    }
  };

  // node_modules/ox/_esm/core/Caches.js
  var caches = {
    checksum: /* @__PURE__ */ new LruMap2(8192)
  };
  var checksum = caches.checksum;

  // node_modules/ox/_esm/core/Address.js
  init_Errors();

  // node_modules/ox/_esm/core/Hash.js
  init_sha3();
  init_Bytes();
  init_Hex();
  function keccak2562(value, options = {}) {
    const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
    const bytes = keccak_256(from(value));
    if (as === "Bytes")
      return bytes;
    return fromBytes(bytes);
  }

  // node_modules/ox/_esm/core/PublicKey.js
  init_Bytes();
  init_Errors();
  init_Hex();
  init_Json();
  function assert3(publicKey, options = {}) {
    const { compressed } = options;
    const { prefix, x, y } = publicKey;
    if (compressed === false || typeof x === "bigint" && typeof y === "bigint") {
      if (prefix !== 4)
        throw new InvalidPrefixError({
          prefix,
          cause: new InvalidUncompressedPrefixError()
        });
      return;
    }
    if (compressed === true || typeof x === "bigint" && typeof y === "undefined") {
      if (prefix !== 3 && prefix !== 2)
        throw new InvalidPrefixError({
          prefix,
          cause: new InvalidCompressedPrefixError()
        });
      return;
    }
    throw new InvalidError({ publicKey });
  }
  function from3(value) {
    const publicKey = (() => {
      if (validate2(value))
        return fromHex2(value);
      if (validate(value))
        return fromBytes2(value);
      const { prefix, x, y } = value;
      if (typeof x === "bigint" && typeof y === "bigint")
        return { prefix: prefix ?? 4, x, y };
      return { prefix, x };
    })();
    assert3(publicKey);
    return publicKey;
  }
  function fromBytes2(publicKey) {
    return fromHex2(fromBytes(publicKey));
  }
  function fromHex2(publicKey) {
    if (publicKey.length !== 132 && publicKey.length !== 130 && publicKey.length !== 68)
      throw new InvalidSerializedSizeError({ publicKey });
    if (publicKey.length === 130) {
      const x2 = BigInt(slice3(publicKey, 0, 32));
      const y = BigInt(slice3(publicKey, 32, 64));
      return {
        prefix: 4,
        x: x2,
        y
      };
    }
    if (publicKey.length === 132) {
      const prefix2 = Number(slice3(publicKey, 0, 1));
      const x2 = BigInt(slice3(publicKey, 1, 33));
      const y = BigInt(slice3(publicKey, 33, 65));
      return {
        prefix: prefix2,
        x: x2,
        y
      };
    }
    const prefix = Number(slice3(publicKey, 0, 1));
    const x = BigInt(slice3(publicKey, 1, 33));
    return {
      prefix,
      x
    };
  }
  function toHex2(publicKey, options = {}) {
    assert3(publicKey);
    const { prefix, x, y } = publicKey;
    const { includePrefix = true } = options;
    const publicKey_ = concat2(
      includePrefix ? fromNumber(prefix, { size: 1 }) : "0x",
      fromNumber(x, { size: 32 }),
      // If the public key is not compressed, add the y coordinate.
      typeof y === "bigint" ? fromNumber(y, { size: 32 }) : "0x"
    );
    return publicKey_;
  }
  var InvalidError = class extends BaseError3 {
    constructor({ publicKey }) {
      super(`Value \`${stringify2(publicKey)}\` is not a valid public key.`, {
        metaMessages: [
          "Public key must contain:",
          "- an `x` and `prefix` value (compressed)",
          "- an `x`, `y`, and `prefix` value (uncompressed)"
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidError"
      });
    }
  };
  var InvalidPrefixError = class extends BaseError3 {
    constructor({ prefix, cause }) {
      super(`Prefix "${prefix}" is invalid.`, {
        cause
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidPrefixError"
      });
    }
  };
  var InvalidCompressedPrefixError = class extends BaseError3 {
    constructor() {
      super("Prefix must be 2 or 3 for compressed public keys.");
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidCompressedPrefixError"
      });
    }
  };
  var InvalidUncompressedPrefixError = class extends BaseError3 {
    constructor() {
      super("Prefix must be 4 for uncompressed public keys.");
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidUncompressedPrefixError"
      });
    }
  };
  var InvalidSerializedSizeError = class extends BaseError3 {
    constructor({ publicKey }) {
      super(`Value \`${publicKey}\` is an invalid public key size.`, {
        metaMessages: [
          "Expected: 33 bytes (compressed + prefix), 64 bytes (uncompressed) or 65 bytes (uncompressed + prefix).",
          `Received ${size3(from2(publicKey))} bytes.`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidSerializedSizeError"
      });
    }
  };

  // node_modules/ox/_esm/core/Address.js
  var addressRegex2 = /^0x[a-fA-F0-9]{40}$/;
  function assert4(value, options = {}) {
    const { strict = true } = options;
    if (!addressRegex2.test(value))
      throw new InvalidAddressError2({
        address: value,
        cause: new InvalidInputError()
      });
    if (strict) {
      if (value.toLowerCase() === value)
        return;
      if (checksum2(value) !== value)
        throw new InvalidAddressError2({
          address: value,
          cause: new InvalidChecksumError()
        });
    }
  }
  function checksum2(address) {
    if (checksum.has(address))
      return checksum.get(address);
    assert4(address, { strict: false });
    const hexAddress = address.substring(2).toLowerCase();
    const hash3 = keccak2562(fromString(hexAddress), { as: "Bytes" });
    const characters = hexAddress.split("");
    for (let i = 0; i < 40; i += 2) {
      if (hash3[i >> 1] >> 4 >= 8 && characters[i]) {
        characters[i] = characters[i].toUpperCase();
      }
      if ((hash3[i >> 1] & 15) >= 8 && characters[i + 1]) {
        characters[i + 1] = characters[i + 1].toUpperCase();
      }
    }
    const result = `0x${characters.join("")}`;
    checksum.set(address, result);
    return result;
  }
  function from4(address, options = {}) {
    const { checksum: checksumVal = false } = options;
    assert4(address);
    if (checksumVal)
      return checksum2(address);
    return address;
  }
  function fromPublicKey(publicKey, options = {}) {
    const address = keccak2562(`0x${toHex2(publicKey).slice(4)}`).substring(26);
    return from4(`0x${address}`, options);
  }
  function validate3(address, options = {}) {
    const { strict = true } = options ?? {};
    try {
      assert4(address, { strict });
      return true;
    } catch {
      return false;
    }
  }
  var InvalidAddressError2 = class extends BaseError3 {
    constructor({ address, cause }) {
      super(`Address "${address}" is invalid.`, {
        cause
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Address.InvalidAddressError"
      });
    }
  };
  var InvalidInputError = class extends BaseError3 {
    constructor() {
      super("Address is not a 20 byte (40 hexadecimal character) value.");
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Address.InvalidInputError"
      });
    }
  };
  var InvalidChecksumError = class extends BaseError3 {
    constructor() {
      super("Address does not match its checksum counterpart.");
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Address.InvalidChecksumError"
      });
    }
  };

  // node_modules/ox/_esm/core/AbiParameters.js
  init_Bytes();
  init_Errors();
  init_Hex();

  // node_modules/ox/_esm/core/internal/abiParameters.js
  init_Bytes();
  init_Errors();
  init_Hex();

  // node_modules/ox/_esm/core/Solidity.js
  var arrayRegex = /^(.*)\[([0-9]*)\]$/;
  var bytesRegex3 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
  var integerRegex3 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  var maxInt82 = 2n ** (8n - 1n) - 1n;
  var maxInt162 = 2n ** (16n - 1n) - 1n;
  var maxInt242 = 2n ** (24n - 1n) - 1n;
  var maxInt322 = 2n ** (32n - 1n) - 1n;
  var maxInt402 = 2n ** (40n - 1n) - 1n;
  var maxInt482 = 2n ** (48n - 1n) - 1n;
  var maxInt562 = 2n ** (56n - 1n) - 1n;
  var maxInt642 = 2n ** (64n - 1n) - 1n;
  var maxInt722 = 2n ** (72n - 1n) - 1n;
  var maxInt802 = 2n ** (80n - 1n) - 1n;
  var maxInt882 = 2n ** (88n - 1n) - 1n;
  var maxInt962 = 2n ** (96n - 1n) - 1n;
  var maxInt1042 = 2n ** (104n - 1n) - 1n;
  var maxInt1122 = 2n ** (112n - 1n) - 1n;
  var maxInt1202 = 2n ** (120n - 1n) - 1n;
  var maxInt1282 = 2n ** (128n - 1n) - 1n;
  var maxInt1362 = 2n ** (136n - 1n) - 1n;
  var maxInt1442 = 2n ** (144n - 1n) - 1n;
  var maxInt1522 = 2n ** (152n - 1n) - 1n;
  var maxInt1602 = 2n ** (160n - 1n) - 1n;
  var maxInt1682 = 2n ** (168n - 1n) - 1n;
  var maxInt1762 = 2n ** (176n - 1n) - 1n;
  var maxInt1842 = 2n ** (184n - 1n) - 1n;
  var maxInt1922 = 2n ** (192n - 1n) - 1n;
  var maxInt2002 = 2n ** (200n - 1n) - 1n;
  var maxInt2082 = 2n ** (208n - 1n) - 1n;
  var maxInt2162 = 2n ** (216n - 1n) - 1n;
  var maxInt2242 = 2n ** (224n - 1n) - 1n;
  var maxInt2322 = 2n ** (232n - 1n) - 1n;
  var maxInt2402 = 2n ** (240n - 1n) - 1n;
  var maxInt2482 = 2n ** (248n - 1n) - 1n;
  var maxInt2562 = 2n ** (256n - 1n) - 1n;
  var minInt82 = -(2n ** (8n - 1n));
  var minInt162 = -(2n ** (16n - 1n));
  var minInt242 = -(2n ** (24n - 1n));
  var minInt322 = -(2n ** (32n - 1n));
  var minInt402 = -(2n ** (40n - 1n));
  var minInt482 = -(2n ** (48n - 1n));
  var minInt562 = -(2n ** (56n - 1n));
  var minInt642 = -(2n ** (64n - 1n));
  var minInt722 = -(2n ** (72n - 1n));
  var minInt802 = -(2n ** (80n - 1n));
  var minInt882 = -(2n ** (88n - 1n));
  var minInt962 = -(2n ** (96n - 1n));
  var minInt1042 = -(2n ** (104n - 1n));
  var minInt1122 = -(2n ** (112n - 1n));
  var minInt1202 = -(2n ** (120n - 1n));
  var minInt1282 = -(2n ** (128n - 1n));
  var minInt1362 = -(2n ** (136n - 1n));
  var minInt1442 = -(2n ** (144n - 1n));
  var minInt1522 = -(2n ** (152n - 1n));
  var minInt1602 = -(2n ** (160n - 1n));
  var minInt1682 = -(2n ** (168n - 1n));
  var minInt1762 = -(2n ** (176n - 1n));
  var minInt1842 = -(2n ** (184n - 1n));
  var minInt1922 = -(2n ** (192n - 1n));
  var minInt2002 = -(2n ** (200n - 1n));
  var minInt2082 = -(2n ** (208n - 1n));
  var minInt2162 = -(2n ** (216n - 1n));
  var minInt2242 = -(2n ** (224n - 1n));
  var minInt2322 = -(2n ** (232n - 1n));
  var minInt2402 = -(2n ** (240n - 1n));
  var minInt2482 = -(2n ** (248n - 1n));
  var minInt2562 = -(2n ** (256n - 1n));
  var maxUint82 = 2n ** 8n - 1n;
  var maxUint162 = 2n ** 16n - 1n;
  var maxUint242 = 2n ** 24n - 1n;
  var maxUint322 = 2n ** 32n - 1n;
  var maxUint402 = 2n ** 40n - 1n;
  var maxUint482 = 2n ** 48n - 1n;
  var maxUint562 = 2n ** 56n - 1n;
  var maxUint642 = 2n ** 64n - 1n;
  var maxUint722 = 2n ** 72n - 1n;
  var maxUint802 = 2n ** 80n - 1n;
  var maxUint882 = 2n ** 88n - 1n;
  var maxUint962 = 2n ** 96n - 1n;
  var maxUint1042 = 2n ** 104n - 1n;
  var maxUint1122 = 2n ** 112n - 1n;
  var maxUint1202 = 2n ** 120n - 1n;
  var maxUint1282 = 2n ** 128n - 1n;
  var maxUint1362 = 2n ** 136n - 1n;
  var maxUint1442 = 2n ** 144n - 1n;
  var maxUint1522 = 2n ** 152n - 1n;
  var maxUint1602 = 2n ** 160n - 1n;
  var maxUint1682 = 2n ** 168n - 1n;
  var maxUint1762 = 2n ** 176n - 1n;
  var maxUint1842 = 2n ** 184n - 1n;
  var maxUint1922 = 2n ** 192n - 1n;
  var maxUint2002 = 2n ** 200n - 1n;
  var maxUint2082 = 2n ** 208n - 1n;
  var maxUint2162 = 2n ** 216n - 1n;
  var maxUint2242 = 2n ** 224n - 1n;
  var maxUint2322 = 2n ** 232n - 1n;
  var maxUint2402 = 2n ** 240n - 1n;
  var maxUint2482 = 2n ** 248n - 1n;
  var maxUint2562 = 2n ** 256n - 1n;

  // node_modules/ox/_esm/core/internal/abiParameters.js
  function decodeParameter2(cursor, param, options) {
    const { checksumAddress: checksumAddress2, staticPosition } = options;
    const arrayComponents = getArrayComponents2(param.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return decodeArray2(cursor, { ...param, type }, { checksumAddress: checksumAddress2, length, staticPosition });
    }
    if (param.type === "tuple")
      return decodeTuple2(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition
      });
    if (param.type === "address")
      return decodeAddress2(cursor, { checksum: checksumAddress2 });
    if (param.type === "bool")
      return decodeBool2(cursor);
    if (param.type.startsWith("bytes"))
      return decodeBytes2(cursor, param, { staticPosition });
    if (param.type.startsWith("uint") || param.type.startsWith("int"))
      return decodeNumber2(cursor, param);
    if (param.type === "string")
      return decodeString2(cursor, { staticPosition });
    throw new InvalidTypeError(param.type);
  }
  var sizeOfLength2 = 32;
  var sizeOfOffset2 = 32;
  function decodeAddress2(cursor, options = {}) {
    const { checksum: checksum3 = false } = options;
    const value = cursor.readBytes(32);
    const wrap3 = (address) => checksum3 ? checksum2(address) : address;
    return [wrap3(fromBytes(slice2(value, -20))), 32];
  }
  function decodeArray2(cursor, param, options) {
    const { checksumAddress: checksumAddress2, length, staticPosition } = options;
    if (!length) {
      const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
      const start = staticPosition + offset;
      const startOfData = start + sizeOfLength2;
      cursor.setPosition(start);
      const length2 = toNumber2(cursor.readBytes(sizeOfLength2));
      const dynamicChild = hasDynamicChild2(param);
      let consumed2 = 0;
      const value2 = [];
      for (let i = 0; i < length2; ++i) {
        cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
        const [data, consumed_] = decodeParameter2(cursor, param, {
          checksumAddress: checksumAddress2,
          staticPosition: startOfData
        });
        consumed2 += consumed_;
        value2.push(data);
      }
      cursor.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    if (hasDynamicChild2(param)) {
      const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
      const start = staticPosition + offset;
      const value2 = [];
      for (let i = 0; i < length; ++i) {
        cursor.setPosition(start + i * 32);
        const [data] = decodeParameter2(cursor, param, {
          checksumAddress: checksumAddress2,
          staticPosition: start
        });
        value2.push(data);
      }
      cursor.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    let consumed = 0;
    const value = [];
    for (let i = 0; i < length; ++i) {
      const [data, consumed_] = decodeParameter2(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition: staticPosition + consumed
      });
      consumed += consumed_;
      value.push(data);
    }
    return [value, consumed];
  }
  function decodeBool2(cursor) {
    return [toBoolean(cursor.readBytes(32), { size: 32 }), 32];
  }
  function decodeBytes2(cursor, param, { staticPosition }) {
    const [_, size5] = param.type.split("bytes");
    if (!size5) {
      const offset = toNumber2(cursor.readBytes(32));
      cursor.setPosition(staticPosition + offset);
      const length = toNumber2(cursor.readBytes(32));
      if (length === 0) {
        cursor.setPosition(staticPosition + 32);
        return ["0x", 32];
      }
      const data = cursor.readBytes(length);
      cursor.setPosition(staticPosition + 32);
      return [fromBytes(data), 32];
    }
    const value = fromBytes(cursor.readBytes(Number.parseInt(size5, 10), 32));
    return [value, 32];
  }
  function decodeNumber2(cursor, param) {
    const signed = param.type.startsWith("int");
    const size5 = Number.parseInt(param.type.split("int")[1] || "256", 10);
    const value = cursor.readBytes(32);
    return [
      size5 > 48 ? toBigInt2(value, { signed }) : toNumber2(value, { signed }),
      32
    ];
  }
  function decodeTuple2(cursor, param, options) {
    const { checksumAddress: checksumAddress2, staticPosition } = options;
    const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
    const value = hasUnnamedChild ? [] : {};
    let consumed = 0;
    if (hasDynamicChild2(param)) {
      const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
      const start = staticPosition + offset;
      for (let i = 0; i < param.components.length; ++i) {
        const component = param.components[i];
        cursor.setPosition(start + consumed);
        const [data, consumed_] = decodeParameter2(cursor, component, {
          checksumAddress: checksumAddress2,
          staticPosition: start
        });
        consumed += consumed_;
        value[hasUnnamedChild ? i : component?.name] = data;
      }
      cursor.setPosition(staticPosition + 32);
      return [value, 32];
    }
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      const [data, consumed_] = decodeParameter2(cursor, component, {
        checksumAddress: checksumAddress2,
        staticPosition
      });
      value[hasUnnamedChild ? i : component?.name] = data;
      consumed += consumed_;
    }
    return [value, consumed];
  }
  function decodeString2(cursor, { staticPosition }) {
    const offset = toNumber2(cursor.readBytes(32));
    const start = staticPosition + offset;
    cursor.setPosition(start);
    const length = toNumber2(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["", 32];
    }
    const data = cursor.readBytes(length, 32);
    const value = toString(trimLeft(data));
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  function prepareParameters({ checksumAddress: checksumAddress2, parameters, values }) {
    const preparedParameters = [];
    for (let i = 0; i < parameters.length; i++) {
      preparedParameters.push(prepareParameter({
        checksumAddress: checksumAddress2,
        parameter: parameters[i],
        value: values[i]
      }));
    }
    return preparedParameters;
  }
  function prepareParameter({ checksumAddress: checksumAddress2 = false, parameter: parameter_, value }) {
    const parameter = parameter_;
    const arrayComponents = getArrayComponents2(parameter.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return encodeArray2(value, {
        checksumAddress: checksumAddress2,
        length,
        parameter: {
          ...parameter,
          type
        }
      });
    }
    if (parameter.type === "tuple") {
      return encodeTuple2(value, {
        checksumAddress: checksumAddress2,
        parameter
      });
    }
    if (parameter.type === "address") {
      return encodeAddress2(value, {
        checksum: checksumAddress2
      });
    }
    if (parameter.type === "bool") {
      return encodeBoolean(value);
    }
    if (parameter.type.startsWith("uint") || parameter.type.startsWith("int")) {
      const signed = parameter.type.startsWith("int");
      const [, , size5 = "256"] = integerRegex3.exec(parameter.type) ?? [];
      return encodeNumber2(value, {
        signed,
        size: Number(size5)
      });
    }
    if (parameter.type.startsWith("bytes")) {
      return encodeBytes2(value, { type: parameter.type });
    }
    if (parameter.type === "string") {
      return encodeString2(value);
    }
    throw new InvalidTypeError(parameter.type);
  }
  function encode(preparedParameters) {
    let staticSize = 0;
    for (let i = 0; i < preparedParameters.length; i++) {
      const { dynamic, encoded } = preparedParameters[i];
      if (dynamic)
        staticSize += 32;
      else
        staticSize += size3(encoded);
    }
    const staticParameters = [];
    const dynamicParameters = [];
    let dynamicSize = 0;
    for (let i = 0; i < preparedParameters.length; i++) {
      const { dynamic, encoded } = preparedParameters[i];
      if (dynamic) {
        staticParameters.push(fromNumber(staticSize + dynamicSize, { size: 32 }));
        dynamicParameters.push(encoded);
        dynamicSize += size3(encoded);
      } else {
        staticParameters.push(encoded);
      }
    }
    return concat2(...staticParameters, ...dynamicParameters);
  }
  function encodeAddress2(value, options) {
    const { checksum: checksum3 = false } = options;
    assert4(value, { strict: checksum3 });
    return {
      dynamic: false,
      encoded: padLeft(value.toLowerCase())
    };
  }
  function encodeArray2(value, options) {
    const { checksumAddress: checksumAddress2, length, parameter } = options;
    const dynamic = length === null;
    if (!Array.isArray(value))
      throw new InvalidArrayError2(value);
    if (!dynamic && value.length !== length)
      throw new ArrayLengthMismatchError({
        expectedLength: length,
        givenLength: value.length,
        type: `${parameter.type}[${length}]`
      });
    let dynamicChild = false;
    const preparedParameters = [];
    for (let i = 0; i < value.length; i++) {
      const preparedParam = prepareParameter({
        checksumAddress: checksumAddress2,
        parameter,
        value: value[i]
      });
      if (preparedParam.dynamic)
        dynamicChild = true;
      preparedParameters.push(preparedParam);
    }
    if (dynamic || dynamicChild) {
      const data = encode(preparedParameters);
      if (dynamic) {
        const length2 = fromNumber(preparedParameters.length, { size: 32 });
        return {
          dynamic: true,
          encoded: preparedParameters.length > 0 ? concat2(length2, data) : length2
        };
      }
      if (dynamicChild)
        return { dynamic: true, encoded: data };
    }
    return {
      dynamic: false,
      encoded: concat2(...preparedParameters.map(({ encoded }) => encoded))
    };
  }
  function encodeBytes2(value, { type }) {
    const [, parametersize] = type.split("bytes");
    const bytesSize = size3(value);
    if (!parametersize) {
      let value_ = value;
      if (bytesSize % 32 !== 0)
        value_ = padRight(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
      return {
        dynamic: true,
        encoded: concat2(padLeft(fromNumber(bytesSize, { size: 32 })), value_)
      };
    }
    if (bytesSize !== Number.parseInt(parametersize, 10))
      throw new BytesSizeMismatchError2({
        expectedSize: Number.parseInt(parametersize, 10),
        value
      });
    return { dynamic: false, encoded: padRight(value) };
  }
  function encodeBoolean(value) {
    if (typeof value !== "boolean")
      throw new BaseError3(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
    return { dynamic: false, encoded: padLeft(fromBoolean(value)) };
  }
  function encodeNumber2(value, { signed, size: size5 }) {
    if (typeof size5 === "number") {
      const max = 2n ** (BigInt(size5) - (signed ? 1n : 0n)) - 1n;
      const min = signed ? -max - 1n : 0n;
      if (value > max || value < min)
        throw new IntegerOutOfRangeError2({
          max: max.toString(),
          min: min.toString(),
          signed,
          size: size5 / 8,
          value: value.toString()
        });
    }
    return {
      dynamic: false,
      encoded: fromNumber(value, {
        size: 32,
        signed
      })
    };
  }
  function encodeString2(value) {
    const hexValue = fromString2(value);
    const partsLength = Math.ceil(size3(hexValue) / 32);
    const parts = [];
    for (let i = 0; i < partsLength; i++) {
      parts.push(padRight(slice3(hexValue, i * 32, (i + 1) * 32)));
    }
    return {
      dynamic: true,
      encoded: concat2(padRight(fromNumber(size3(hexValue), { size: 32 })), ...parts)
    };
  }
  function encodeTuple2(value, options) {
    const { checksumAddress: checksumAddress2, parameter } = options;
    let dynamic = false;
    const preparedParameters = [];
    for (let i = 0; i < parameter.components.length; i++) {
      const param_ = parameter.components[i];
      const index2 = Array.isArray(value) ? i : param_.name;
      const preparedParam = prepareParameter({
        checksumAddress: checksumAddress2,
        parameter: param_,
        value: value[index2]
      });
      preparedParameters.push(preparedParam);
      if (preparedParam.dynamic)
        dynamic = true;
    }
    return {
      dynamic,
      encoded: dynamic ? encode(preparedParameters) : concat2(...preparedParameters.map(({ encoded }) => encoded))
    };
  }
  function getArrayComponents2(type) {
    const matches = type.match(/^(.*)\[(\d+)?\]$/);
    return matches ? (
      // Return `null` if the array is dynamic.
      [matches[2] ? Number(matches[2]) : null, matches[1]]
    ) : void 0;
  }
  function hasDynamicChild2(param) {
    const { type } = param;
    if (type === "string")
      return true;
    if (type === "bytes")
      return true;
    if (type.endsWith("[]"))
      return true;
    if (type === "tuple")
      return param.components?.some(hasDynamicChild2);
    const arrayComponents = getArrayComponents2(param.type);
    if (arrayComponents && hasDynamicChild2({
      ...param,
      type: arrayComponents[1]
    }))
      return true;
    return false;
  }

  // node_modules/ox/_esm/core/internal/cursor.js
  init_Errors();
  var staticCursor2 = {
    bytes: new Uint8Array(),
    dataView: new DataView(new ArrayBuffer(0)),
    position: 0,
    positionReadCount: /* @__PURE__ */ new Map(),
    recursiveReadCount: 0,
    recursiveReadLimit: Number.POSITIVE_INFINITY,
    assertReadLimit() {
      if (this.recursiveReadCount >= this.recursiveReadLimit)
        throw new RecursiveReadLimitExceededError2({
          count: this.recursiveReadCount + 1,
          limit: this.recursiveReadLimit
        });
    },
    assertPosition(position) {
      if (position < 0 || position > this.bytes.length - 1)
        throw new PositionOutOfBoundsError2({
          length: this.bytes.length,
          position
        });
    },
    decrementPosition(offset) {
      if (offset < 0)
        throw new NegativeOffsetError2({ offset });
      const position = this.position - offset;
      this.assertPosition(position);
      this.position = position;
    },
    getReadCount(position) {
      return this.positionReadCount.get(position || this.position) || 0;
    },
    incrementPosition(offset) {
      if (offset < 0)
        throw new NegativeOffsetError2({ offset });
      const position = this.position + offset;
      this.assertPosition(position);
      this.position = position;
    },
    inspectByte(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position);
      return this.bytes[position];
    },
    inspectBytes(length, position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + length - 1);
      return this.bytes.subarray(position, position + length);
    },
    inspectUint8(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position);
      return this.bytes[position];
    },
    inspectUint16(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 1);
      return this.dataView.getUint16(position);
    },
    inspectUint24(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 2);
      return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
    },
    inspectUint32(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 3);
      return this.dataView.getUint32(position);
    },
    pushByte(byte) {
      this.assertPosition(this.position);
      this.bytes[this.position] = byte;
      this.position++;
    },
    pushBytes(bytes) {
      this.assertPosition(this.position + bytes.length - 1);
      this.bytes.set(bytes, this.position);
      this.position += bytes.length;
    },
    pushUint8(value) {
      this.assertPosition(this.position);
      this.bytes[this.position] = value;
      this.position++;
    },
    pushUint16(value) {
      this.assertPosition(this.position + 1);
      this.dataView.setUint16(this.position, value);
      this.position += 2;
    },
    pushUint24(value) {
      this.assertPosition(this.position + 2);
      this.dataView.setUint16(this.position, value >> 8);
      this.dataView.setUint8(this.position + 2, value & ~4294967040);
      this.position += 3;
    },
    pushUint32(value) {
      this.assertPosition(this.position + 3);
      this.dataView.setUint32(this.position, value);
      this.position += 4;
    },
    readByte() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectByte();
      this.position++;
      return value;
    },
    readBytes(length, size5) {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectBytes(length);
      this.position += size5 ?? length;
      return value;
    },
    readUint8() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint8();
      this.position += 1;
      return value;
    },
    readUint16() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint16();
      this.position += 2;
      return value;
    },
    readUint24() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint24();
      this.position += 3;
      return value;
    },
    readUint32() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint32();
      this.position += 4;
      return value;
    },
    get remaining() {
      return this.bytes.length - this.position;
    },
    setPosition(position) {
      const oldPosition = this.position;
      this.assertPosition(position);
      this.position = position;
      return () => this.position = oldPosition;
    },
    _touch() {
      if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
        return;
      const count = this.getReadCount();
      this.positionReadCount.set(this.position, count + 1);
      if (count > 0)
        this.recursiveReadCount++;
    }
  };
  function create(bytes, { recursiveReadLimit = 8192 } = {}) {
    const cursor = Object.create(staticCursor2);
    cursor.bytes = bytes;
    cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    cursor.positionReadCount = /* @__PURE__ */ new Map();
    cursor.recursiveReadLimit = recursiveReadLimit;
    return cursor;
  }
  var NegativeOffsetError2 = class extends BaseError3 {
    constructor({ offset }) {
      super(`Offset \`${offset}\` cannot be negative.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Cursor.NegativeOffsetError"
      });
    }
  };
  var PositionOutOfBoundsError2 = class extends BaseError3 {
    constructor({ length, position }) {
      super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Cursor.PositionOutOfBoundsError"
      });
    }
  };
  var RecursiveReadLimitExceededError2 = class extends BaseError3 {
    constructor({ count, limit }) {
      super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Cursor.RecursiveReadLimitExceededError"
      });
    }
  };

  // node_modules/ox/_esm/core/AbiParameters.js
  function decode(parameters, data, options = {}) {
    const { as = "Array", checksumAddress: checksumAddress2 = false } = options;
    const bytes = typeof data === "string" ? fromHex(data) : data;
    const cursor = create(bytes);
    if (size2(bytes) === 0 && parameters.length > 0)
      throw new ZeroDataError();
    if (size2(bytes) && size2(bytes) < 32)
      throw new DataSizeTooSmallError({
        data: typeof data === "string" ? data : fromBytes(data),
        parameters,
        size: size2(bytes)
      });
    let consumed = 0;
    const values = as === "Array" ? [] : {};
    for (let i = 0; i < parameters.length; ++i) {
      const param = parameters[i];
      cursor.setPosition(consumed);
      const [data2, consumed_] = decodeParameter2(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition: 0
      });
      consumed += consumed_;
      if (as === "Array")
        values.push(data2);
      else
        values[param.name ?? i] = data2;
    }
    return values;
  }
  function encode2(parameters, values, options) {
    const { checksumAddress: checksumAddress2 = false } = options ?? {};
    if (parameters.length !== values.length)
      throw new LengthMismatchError({
        expectedLength: parameters.length,
        givenLength: values.length
      });
    const preparedParameters = prepareParameters({
      checksumAddress: checksumAddress2,
      parameters,
      values
    });
    const data = encode(preparedParameters);
    if (data.length === 0)
      return "0x";
    return data;
  }
  function encodePacked(types, values) {
    if (types.length !== values.length)
      throw new LengthMismatchError({
        expectedLength: types.length,
        givenLength: values.length
      });
    const data = [];
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const value = values[i];
      data.push(encodePacked.encode(type, value));
    }
    return concat2(...data);
  }
  (function(encodePacked2) {
    function encode4(type, value, isArray = false) {
      if (type === "address") {
        const address = value;
        assert4(address);
        return padLeft(address.toLowerCase(), isArray ? 32 : 0);
      }
      if (type === "string")
        return fromString2(value);
      if (type === "bytes")
        return value;
      if (type === "bool")
        return padLeft(fromBoolean(value), isArray ? 32 : 1);
      const intMatch = type.match(integerRegex3);
      if (intMatch) {
        const [_type, baseType, bits = "256"] = intMatch;
        const size5 = Number.parseInt(bits, 10) / 8;
        return fromNumber(value, {
          size: isArray ? 32 : size5,
          signed: baseType === "int"
        });
      }
      const bytesMatch = type.match(bytesRegex3);
      if (bytesMatch) {
        const [_type, size5] = bytesMatch;
        if (Number.parseInt(size5, 10) !== (value.length - 2) / 2)
          throw new BytesSizeMismatchError2({
            expectedSize: Number.parseInt(size5, 10),
            value
          });
        return padRight(value, isArray ? 32 : 0);
      }
      const arrayMatch = type.match(arrayRegex);
      if (arrayMatch && Array.isArray(value)) {
        const [_type, childType] = arrayMatch;
        const data = [];
        for (let i = 0; i < value.length; i++) {
          data.push(encode4(childType, value[i], true));
        }
        if (data.length === 0)
          return "0x";
        return concat2(...data);
      }
      throw new InvalidTypeError(type);
    }
    encodePacked2.encode = encode4;
  })(encodePacked || (encodePacked = {}));
  function from5(parameters) {
    if (Array.isArray(parameters) && typeof parameters[0] === "string")
      return parseAbiParameters(parameters);
    if (typeof parameters === "string")
      return parseAbiParameters(parameters);
    return parameters;
  }
  var DataSizeTooSmallError = class extends BaseError3 {
    constructor({ data, parameters, size: size5 }) {
      super(`Data size of ${size5} bytes is too small for given parameters.`, {
        metaMessages: [
          `Params: (${formatAbiParameters(parameters)})`,
          `Data:   ${data} (${size5} bytes)`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.DataSizeTooSmallError"
      });
    }
  };
  var ZeroDataError = class extends BaseError3 {
    constructor() {
      super('Cannot decode zero data ("0x") with ABI parameters.');
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.ZeroDataError"
      });
    }
  };
  var ArrayLengthMismatchError = class extends BaseError3 {
    constructor({ expectedLength, givenLength, type }) {
      super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.ArrayLengthMismatchError"
      });
    }
  };
  var BytesSizeMismatchError2 = class extends BaseError3 {
    constructor({ expectedSize, value }) {
      super(`Size of bytes "${value}" (bytes${size3(value)}) does not match expected size (bytes${expectedSize}).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.BytesSizeMismatchError"
      });
    }
  };
  var LengthMismatchError = class extends BaseError3 {
    constructor({ expectedLength, givenLength }) {
      super([
        "ABI encoding parameters/values length mismatch.",
        `Expected length (parameters): ${expectedLength}`,
        `Given length (values): ${givenLength}`
      ].join("\n"));
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.LengthMismatchError"
      });
    }
  };
  var InvalidArrayError2 = class extends BaseError3 {
    constructor(value) {
      super(`Value \`${value}\` is not a valid array.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.InvalidArrayError"
      });
    }
  };
  var InvalidTypeError = class extends BaseError3 {
    constructor(type) {
      super(`Type \`${type}\` is not a valid ABI Type.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.InvalidTypeError"
      });
    }
  };

  // node_modules/ox/_esm/core/Authorization.js
  init_Hex();

  // node_modules/ox/_esm/core/Rlp.js
  init_Bytes();
  init_Errors();
  init_Hex();
  function from6(value, options) {
    const { as } = options;
    const encodable = getEncodable2(value);
    const cursor = create(new Uint8Array(encodable.length));
    encodable.encode(cursor);
    if (as === "Hex")
      return fromBytes(cursor.bytes);
    return cursor.bytes;
  }
  function fromHex3(hex, options = {}) {
    const { as = "Hex" } = options;
    return from6(hex, { as });
  }
  function getEncodable2(bytes) {
    if (Array.isArray(bytes))
      return getEncodableList2(bytes.map((x) => getEncodable2(x)));
    return getEncodableBytes2(bytes);
  }
  function getEncodableList2(list) {
    const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
    const sizeOfBodyLength = getSizeOfLength2(bodyLength);
    const length = (() => {
      if (bodyLength <= 55)
        return 1 + bodyLength;
      return 1 + sizeOfBodyLength + bodyLength;
    })();
    return {
      length,
      encode(cursor) {
        if (bodyLength <= 55) {
          cursor.pushByte(192 + bodyLength);
        } else {
          cursor.pushByte(192 + 55 + sizeOfBodyLength);
          if (sizeOfBodyLength === 1)
            cursor.pushUint8(bodyLength);
          else if (sizeOfBodyLength === 2)
            cursor.pushUint16(bodyLength);
          else if (sizeOfBodyLength === 3)
            cursor.pushUint24(bodyLength);
          else
            cursor.pushUint32(bodyLength);
        }
        for (const { encode: encode4 } of list) {
          encode4(cursor);
        }
      }
    };
  }
  function getEncodableBytes2(bytesOrHex) {
    const bytes = typeof bytesOrHex === "string" ? fromHex(bytesOrHex) : bytesOrHex;
    const sizeOfBytesLength = getSizeOfLength2(bytes.length);
    const length = (() => {
      if (bytes.length === 1 && bytes[0] < 128)
        return 1;
      if (bytes.length <= 55)
        return 1 + bytes.length;
      return 1 + sizeOfBytesLength + bytes.length;
    })();
    return {
      length,
      encode(cursor) {
        if (bytes.length === 1 && bytes[0] < 128) {
          cursor.pushBytes(bytes);
        } else if (bytes.length <= 55) {
          cursor.pushByte(128 + bytes.length);
          cursor.pushBytes(bytes);
        } else {
          cursor.pushByte(128 + 55 + sizeOfBytesLength);
          if (sizeOfBytesLength === 1)
            cursor.pushUint8(bytes.length);
          else if (sizeOfBytesLength === 2)
            cursor.pushUint16(bytes.length);
          else if (sizeOfBytesLength === 3)
            cursor.pushUint24(bytes.length);
          else
            cursor.pushUint32(bytes.length);
          cursor.pushBytes(bytes);
        }
      }
    };
  }
  function getSizeOfLength2(length) {
    if (length < 2 ** 8)
      return 1;
    if (length < 2 ** 16)
      return 2;
    if (length < 2 ** 24)
      return 3;
    if (length < 2 ** 32)
      return 4;
    throw new BaseError3("Length is too large.");
  }

  // node_modules/ox/_esm/core/Signature.js
  init_Errors();
  init_Hex();
  init_Json();
  function assert5(signature, options = {}) {
    const { recovered } = options;
    if (typeof signature.r === "undefined")
      throw new MissingPropertiesError({ signature });
    if (typeof signature.s === "undefined")
      throw new MissingPropertiesError({ signature });
    if (recovered && typeof signature.yParity === "undefined")
      throw new MissingPropertiesError({ signature });
    if (signature.r < 0n || signature.r > maxUint2562)
      throw new InvalidRError({ value: signature.r });
    if (signature.s < 0n || signature.s > maxUint2562)
      throw new InvalidSError({ value: signature.s });
    if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1)
      throw new InvalidYParityError({ value: signature.yParity });
  }
  function fromBytes3(signature) {
    return fromHex4(fromBytes(signature));
  }
  function fromHex4(signature) {
    if (signature.length !== 130 && signature.length !== 132)
      throw new InvalidSerializedSizeError2({ signature });
    const r = BigInt(slice3(signature, 0, 32));
    const s = BigInt(slice3(signature, 32, 64));
    const yParity = (() => {
      const yParity2 = Number(`0x${signature.slice(130)}`);
      if (Number.isNaN(yParity2))
        return void 0;
      try {
        return vToYParity(yParity2);
      } catch {
        throw new InvalidYParityError({ value: yParity2 });
      }
    })();
    if (typeof yParity === "undefined")
      return {
        r,
        s
      };
    return {
      r,
      s,
      yParity
    };
  }
  function extract2(value) {
    if (typeof value.r === "undefined")
      return void 0;
    if (typeof value.s === "undefined")
      return void 0;
    return from7(value);
  }
  function from7(signature) {
    const signature_ = (() => {
      if (typeof signature === "string")
        return fromHex4(signature);
      if (signature instanceof Uint8Array)
        return fromBytes3(signature);
      if (typeof signature.r === "string")
        return fromRpc2(signature);
      if (signature.v)
        return fromLegacy(signature);
      return {
        r: signature.r,
        s: signature.s,
        ...typeof signature.yParity !== "undefined" ? { yParity: signature.yParity } : {}
      };
    })();
    assert5(signature_);
    return signature_;
  }
  function fromLegacy(signature) {
    return {
      r: signature.r,
      s: signature.s,
      yParity: vToYParity(signature.v)
    };
  }
  function fromRpc2(signature) {
    const yParity = (() => {
      const v = signature.v ? Number(signature.v) : void 0;
      let yParity2 = signature.yParity ? Number(signature.yParity) : void 0;
      if (typeof v === "number" && typeof yParity2 !== "number")
        yParity2 = vToYParity(v);
      if (typeof yParity2 !== "number")
        throw new InvalidYParityError({ value: signature.yParity });
      return yParity2;
    })();
    return {
      r: BigInt(signature.r),
      s: BigInt(signature.s),
      yParity
    };
  }
  function toTuple(signature) {
    const { r, s, yParity } = signature;
    return [
      yParity ? "0x01" : "0x",
      r === 0n ? "0x" : trimLeft2(fromNumber(r)),
      s === 0n ? "0x" : trimLeft2(fromNumber(s))
    ];
  }
  function vToYParity(v) {
    if (v === 0 || v === 27)
      return 0;
    if (v === 1 || v === 28)
      return 1;
    if (v >= 35)
      return v % 2 === 0 ? 1 : 0;
    throw new InvalidVError({ value: v });
  }
  var InvalidSerializedSizeError2 = class extends BaseError3 {
    constructor({ signature }) {
      super(`Value \`${signature}\` is an invalid signature size.`, {
        metaMessages: [
          "Expected: 64 bytes or 65 bytes.",
          `Received ${size3(from2(signature))} bytes.`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidSerializedSizeError"
      });
    }
  };
  var MissingPropertiesError = class extends BaseError3 {
    constructor({ signature }) {
      super(`Signature \`${stringify2(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.MissingPropertiesError"
      });
    }
  };
  var InvalidRError = class extends BaseError3 {
    constructor({ value }) {
      super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidRError"
      });
    }
  };
  var InvalidSError = class extends BaseError3 {
    constructor({ value }) {
      super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidSError"
      });
    }
  };
  var InvalidYParityError = class extends BaseError3 {
    constructor({ value }) {
      super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidYParityError"
      });
    }
  };
  var InvalidVError = class extends BaseError3 {
    constructor({ value }) {
      super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidVError"
      });
    }
  };

  // node_modules/ox/_esm/core/Authorization.js
  function from8(authorization, options = {}) {
    if (typeof authorization.chainId === "string")
      return fromRpc3(authorization);
    return { ...authorization, ...options.signature };
  }
  function fromRpc3(authorization) {
    const { address, chainId, nonce } = authorization;
    const signature = extract2(authorization);
    return {
      address,
      chainId: Number(chainId),
      nonce: BigInt(nonce),
      ...signature
    };
  }
  function getSignPayload(authorization) {
    return hash2(authorization, { presign: true });
  }
  function hash2(authorization, options = {}) {
    const { presign } = options;
    return keccak2562(concat2("0x05", fromHex3(toTuple2(presign ? {
      address: authorization.address,
      chainId: authorization.chainId,
      nonce: authorization.nonce
    } : authorization))));
  }
  function toTuple2(authorization) {
    const { address, chainId, nonce } = authorization;
    const signature = extract2(authorization);
    return [
      chainId ? fromNumber(chainId) : "0x",
      address,
      nonce ? fromNumber(nonce) : "0x",
      ...signature ? toTuple(signature) : []
    ];
  }

  // node_modules/ox/_esm/erc8010/SignatureErc8010.js
  init_Errors();
  init_Hex();

  // node_modules/ox/_esm/core/Secp256k1.js
  init_secp256k1();
  init_Hex();
  function recoverAddress2(options) {
    return fromPublicKey(recoverPublicKey2(options));
  }
  function recoverPublicKey2(options) {
    const { payload, signature } = options;
    const { r, s, yParity } = signature;
    const signature_ = new secp256k1.Signature(BigInt(r), BigInt(s)).addRecoveryBit(yParity);
    const point = signature_.recoverPublicKey(from2(payload).substring(2));
    return from3(point);
  }

  // node_modules/ox/_esm/erc8010/SignatureErc8010.js
  var magicBytes = "0x8010801080108010801080108010801080108010801080108010801080108010";
  var suffixParameters = from5("(uint256 chainId, address delegation, uint256 nonce, uint8 yParity, uint256 r, uint256 s), address to, bytes data");
  function assert6(value) {
    if (typeof value === "string") {
      if (slice3(value, -32) !== magicBytes)
        throw new InvalidWrappedSignatureError(value);
    } else
      assert5(value.authorization);
  }
  function from9(value) {
    if (typeof value === "string")
      return unwrap(value);
    return value;
  }
  function unwrap(wrapped) {
    assert6(wrapped);
    const suffixLength = toNumber(slice3(wrapped, -64, -32));
    const suffix = slice3(wrapped, -suffixLength - 64, -64);
    const signature = slice3(wrapped, 0, -suffixLength - 64);
    const [auth, to, data] = decode(suffixParameters, suffix);
    const authorization = from8({
      address: auth.delegation,
      chainId: Number(auth.chainId),
      nonce: auth.nonce,
      yParity: auth.yParity,
      r: auth.r,
      s: auth.s
    });
    return {
      authorization,
      signature,
      ...data && data !== "0x" ? { data, to } : {}
    };
  }
  function wrap(value) {
    const { data, signature } = value;
    assert6(value);
    const self = recoverAddress2({
      payload: getSignPayload(value.authorization),
      signature: from7(value.authorization)
    });
    const suffix = encode2(suffixParameters, [
      {
        ...value.authorization,
        delegation: value.authorization.address,
        chainId: BigInt(value.authorization.chainId)
      },
      value.to ?? self,
      data ?? "0x"
    ]);
    const suffixLength = fromNumber(size3(suffix), { size: 32 });
    return concat2(signature, suffix, suffixLength, magicBytes);
  }
  function validate4(value) {
    try {
      assert6(value);
      return true;
    } catch {
      return false;
    }
  }
  var InvalidWrappedSignatureError = class extends BaseError3 {
    constructor(wrapped) {
      super(`Value \`${wrapped}\` is an invalid ERC-8010 wrapped signature.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "SignatureErc8010.InvalidWrappedSignatureError"
      });
    }
  };

  // node_modules/viem/_esm/utils/formatters/proof.js
  function formatStorageProof(storageProof) {
    return storageProof.map((proof) => ({
      ...proof,
      value: BigInt(proof.value)
    }));
  }
  function formatProof(proof) {
    return {
      ...proof,
      balance: proof.balance ? BigInt(proof.balance) : void 0,
      nonce: proof.nonce ? hexToNumber(proof.nonce) : void 0,
      storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : void 0
    };
  }

  // node_modules/viem/_esm/actions/public/getProof.js
  async function getProof(client, { address, blockNumber, blockTag: blockTag_, storageKeys }) {
    const blockTag = blockTag_ ?? "latest";
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    const proof = await client.request({
      method: "eth_getProof",
      params: [address, storageKeys, blockNumberHex || blockTag]
    });
    return formatProof(proof);
  }

  // node_modules/viem/_esm/actions/public/getStorageAt.js
  init_toHex();
  async function getStorageAt(client, { address, blockNumber, blockTag = "latest", slot }) {
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    const data = await client.request({
      method: "eth_getStorageAt",
      params: [address, slot, blockNumberHex || blockTag]
    });
    return data;
  }

  // node_modules/viem/_esm/actions/public/getTransaction.js
  init_transaction();
  init_toHex();
  async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash: hash3, index: index2, sender, nonce }) {
    const blockTag = blockTag_ || "latest";
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    let transaction = null;
    if (hash3) {
      transaction = await client.request({
        method: "eth_getTransactionByHash",
        params: [hash3]
      }, { dedupe: true });
    } else if (blockHash) {
      transaction = await client.request({
        method: "eth_getTransactionByBlockHashAndIndex",
        params: [blockHash, numberToHex(index2)]
      }, { dedupe: true });
    } else if ((blockNumberHex || blockTag) && typeof index2 === "number") {
      transaction = await client.request({
        method: "eth_getTransactionByBlockNumberAndIndex",
        params: [blockNumberHex || blockTag, numberToHex(index2)]
      }, { dedupe: Boolean(blockNumberHex) });
    } else if (sender && typeof nonce === "number") {
      transaction = await client.request({
        method: "eth_getTransactionBySenderAndNonce",
        params: [sender, numberToHex(nonce)]
      }, { dedupe: true });
    }
    if (!transaction)
      throw new TransactionNotFoundError({
        blockHash,
        blockNumber,
        blockTag,
        hash: hash3,
        index: index2
      });
    const format = client.chain?.formatters?.transaction?.format || formatTransaction;
    return format(transaction, "getTransaction");
  }

  // node_modules/viem/_esm/actions/public/getTransactionConfirmations.js
  async function getTransactionConfirmations(client, { hash: hash3, transactionReceipt }) {
    const [blockNumber, transaction] = await Promise.all([
      getAction(client, getBlockNumber, "getBlockNumber")({}),
      hash3 ? getAction(client, getTransaction, "getTransaction")({ hash: hash3 }) : void 0
    ]);
    const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
    if (!transactionBlockNumber)
      return 0n;
    return blockNumber - transactionBlockNumber + 1n;
  }

  // node_modules/viem/_esm/actions/public/getTransactionReceipt.js
  init_transaction();
  async function getTransactionReceipt(client, { hash: hash3 }) {
    const receipt = await client.request({
      method: "eth_getTransactionReceipt",
      params: [hash3]
    }, { dedupe: true });
    if (!receipt)
      throw new TransactionReceiptNotFoundError({ hash: hash3 });
    const format = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
    return format(receipt, "getTransactionReceipt");
  }

  // node_modules/viem/_esm/actions/public/multicall.js
  init_abis();
  init_contracts();
  init_abi();
  init_base();
  init_contract();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_getChainContractAddress();
  async function multicall(client, parameters) {
    const { account, authorizationList, allowFailure = true, blockNumber, blockOverrides, blockTag, stateOverride } = parameters;
    const contracts = parameters.contracts;
    const { batchSize = parameters.batchSize ?? 1024, deployless = parameters.deployless ?? false } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
    const multicallAddress = (() => {
      if (parameters.multicallAddress)
        return parameters.multicallAddress;
      if (deployless)
        return null;
      if (client.chain) {
        return getChainContractAddress({
          blockNumber,
          chain: client.chain,
          contract: "multicall3"
        });
      }
      throw new Error("client chain not configured. multicallAddress is required.");
    })();
    const chunkedCalls = [[]];
    let currentChunk = 0;
    let currentChunkSize = 0;
    for (let i = 0; i < contracts.length; i++) {
      const { abi: abi2, address, args, functionName } = contracts[i];
      try {
        const callData = encodeFunctionData({ abi: abi2, args, functionName });
        currentChunkSize += (callData.length - 2) / 2;
        if (
          // Check if batching is enabled.
          batchSize > 0 && // Check if the current size of the batch exceeds the size limit.
          currentChunkSize > batchSize && // Check if the current chunk is not already empty.
          chunkedCalls[currentChunk].length > 0
        ) {
          currentChunk++;
          currentChunkSize = (callData.length - 2) / 2;
          chunkedCalls[currentChunk] = [];
        }
        chunkedCalls[currentChunk] = [
          ...chunkedCalls[currentChunk],
          {
            allowFailure: true,
            callData,
            target: address
          }
        ];
      } catch (err) {
        const error = getContractError(err, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/multicall",
          functionName,
          sender: account
        });
        if (!allowFailure)
          throw error;
        chunkedCalls[currentChunk] = [
          ...chunkedCalls[currentChunk],
          {
            allowFailure: true,
            callData: "0x",
            target: address
          }
        ];
      }
    }
    const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => getAction(client, readContract, "readContract")({
      ...multicallAddress === null ? { code: multicall3Bytecode } : { address: multicallAddress },
      abi: multicall3Abi,
      account,
      args: [calls],
      authorizationList,
      blockNumber,
      blockOverrides,
      blockTag,
      functionName: "aggregate3",
      stateOverride
    })));
    const results = [];
    for (let i = 0; i < aggregate3Results.length; i++) {
      const result = aggregate3Results[i];
      if (result.status === "rejected") {
        if (!allowFailure)
          throw result.reason;
        for (let j = 0; j < chunkedCalls[i].length; j++) {
          results.push({
            status: "failure",
            error: result.reason,
            result: void 0
          });
        }
        continue;
      }
      const aggregate3Result = result.value;
      for (let j = 0; j < aggregate3Result.length; j++) {
        const { returnData, success } = aggregate3Result[j];
        const { callData } = chunkedCalls[i][j];
        const { abi: abi2, address, functionName, args } = contracts[results.length];
        try {
          if (callData === "0x")
            throw new AbiDecodingZeroDataError();
          if (!success)
            throw new RawContractError({ data: returnData });
          const result2 = decodeFunctionResult({
            abi: abi2,
            args,
            data: returnData,
            functionName
          });
          results.push(allowFailure ? { result: result2, status: "success" } : result2);
        } catch (err) {
          const error = getContractError(err, {
            abi: abi2,
            address,
            args,
            docsPath: "/docs/contract/multicall",
            functionName
          });
          if (!allowFailure)
            throw error;
          results.push({ error, result: void 0, status: "failure" });
        }
      }
    }
    if (results.length !== contracts.length)
      throw new BaseError2("multicall results mismatch");
    return results;
  }

  // node_modules/viem/_esm/actions/public/simulateBlocks.js
  init_BlockOverrides();
  init_parseAccount();
  init_abi();
  init_contract();
  init_node();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_concat();
  init_toHex();
  init_getNodeError();
  init_transactionRequest();
  init_stateOverride2();
  init_assertRequest();
  async function simulateBlocks(client, parameters) {
    const { blockNumber, blockTag = client.experimental_blockTag ?? "latest", blocks, returnFullTransactions, traceTransfers, validation } = parameters;
    try {
      const blockStateCalls = [];
      for (const block2 of blocks) {
        const blockOverrides = block2.blockOverrides ? toRpc2(block2.blockOverrides) : void 0;
        const calls = block2.calls.map((call_) => {
          const call2 = call_;
          const account = call2.account ? parseAccount(call2.account) : void 0;
          const data = call2.abi ? encodeFunctionData(call2) : call2.data;
          const request = {
            ...call2,
            account,
            data: call2.dataSuffix ? concat([data || "0x", call2.dataSuffix]) : data,
            from: call2.from ?? account?.address
          };
          assertRequest(request);
          return formatTransactionRequest(request);
        });
        const stateOverrides = block2.stateOverrides ? serializeStateOverride(block2.stateOverrides) : void 0;
        blockStateCalls.push({
          blockOverrides,
          calls,
          stateOverrides
        });
      }
      const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const result = await client.request({
        method: "eth_simulateV1",
        params: [
          { blockStateCalls, returnFullTransactions, traceTransfers, validation },
          block
        ]
      });
      return result.map((block2, i) => ({
        ...formatBlock(block2),
        calls: block2.calls.map((call2, j) => {
          const { abi: abi2, args, functionName, to } = blocks[i].calls[j];
          const data = call2.error?.data ?? call2.returnData;
          const gasUsed = BigInt(call2.gasUsed);
          const logs = call2.logs?.map((log) => formatLog(log));
          const status = call2.status === "0x1" ? "success" : "failure";
          const result2 = abi2 && status === "success" && data !== "0x" ? decodeFunctionResult({
            abi: abi2,
            data,
            functionName
          }) : null;
          const error = (() => {
            if (status === "success")
              return void 0;
            let error2;
            if (call2.error?.data === "0x")
              error2 = new AbiDecodingZeroDataError();
            else if (call2.error)
              error2 = new RawContractError(call2.error);
            if (!error2)
              return void 0;
            return getContractError(error2, {
              abi: abi2 ?? [],
              address: to ?? "0x",
              args,
              functionName: functionName ?? "<unknown>"
            });
          })();
          return {
            data,
            gasUsed,
            logs,
            status,
            ...status === "success" ? {
              result: result2
            } : {
              error
            }
          };
        })
      }));
    } catch (e) {
      const cause = e;
      const error = getNodeError(cause, {});
      if (error instanceof UnknownNodeError)
        throw cause;
      throw error;
    }
  }

  // node_modules/ox/_esm/core/AbiItem.js
  init_exports();
  init_Errors();
  init_Hex();

  // node_modules/ox/_esm/core/internal/abiItem.js
  init_Errors();
  function normalizeSignature2(signature) {
    let active = true;
    let current = "";
    let level = 0;
    let result = "";
    let valid = false;
    for (let i = 0; i < signature.length; i++) {
      const char = signature[i];
      if (["(", ")", ","].includes(char))
        active = true;
      if (char === "(")
        level++;
      if (char === ")")
        level--;
      if (!active)
        continue;
      if (level === 0) {
        if (char === " " && ["event", "function", "error", ""].includes(result))
          result = "";
        else {
          result += char;
          if (char === ")") {
            valid = true;
            break;
          }
        }
        continue;
      }
      if (char === " ") {
        if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
          current = "";
          active = false;
        }
        continue;
      }
      result += char;
      current += char;
    }
    if (!valid)
      throw new BaseError3("Unable to normalize signature.");
    return result;
  }
  function isArgOfType2(arg, abiParameter) {
    const argType = typeof arg;
    const abiParameterType = abiParameter.type;
    switch (abiParameterType) {
      case "address":
        return validate3(arg, { strict: false });
      case "bool":
        return argType === "boolean";
      case "function":
        return argType === "string";
      case "string":
        return argType === "string";
      default: {
        if (abiParameterType === "tuple" && "components" in abiParameter)
          return Object.values(abiParameter.components).every((component, index2) => {
            return isArgOfType2(Object.values(arg)[index2], component);
          });
        if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
          return argType === "number" || argType === "bigint";
        if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
          return argType === "string" || arg instanceof Uint8Array;
        if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
          return Array.isArray(arg) && arg.every((x) => isArgOfType2(x, {
            ...abiParameter,
            // Pop off `[]` or `[M]` from end of type
            type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
          }));
        }
        return false;
      }
    }
  }
  function getAmbiguousTypes2(sourceParameters, targetParameters, args) {
    for (const parameterIndex in sourceParameters) {
      const sourceParameter = sourceParameters[parameterIndex];
      const targetParameter = targetParameters[parameterIndex];
      if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
        return getAmbiguousTypes2(sourceParameter.components, targetParameter.components, args[parameterIndex]);
      const types = [sourceParameter.type, targetParameter.type];
      const ambiguous = (() => {
        if (types.includes("address") && types.includes("bytes20"))
          return true;
        if (types.includes("address") && types.includes("string"))
          return validate3(args[parameterIndex], {
            strict: false
          });
        if (types.includes("address") && types.includes("bytes"))
          return validate3(args[parameterIndex], {
            strict: false
          });
        return false;
      })();
      if (ambiguous)
        return types;
    }
    return;
  }

  // node_modules/ox/_esm/core/AbiItem.js
  function from10(abiItem, options = {}) {
    const { prepare = true } = options;
    const item = (() => {
      if (Array.isArray(abiItem))
        return parseAbiItem(abiItem);
      if (typeof abiItem === "string")
        return parseAbiItem(abiItem);
      return abiItem;
    })();
    return {
      ...item,
      ...prepare ? { hash: getSignatureHash(item) } : {}
    };
  }
  function fromAbi(abi2, name, options) {
    const { args = [], prepare = true } = options ?? {};
    const isSelector = validate2(name, { strict: false });
    const abiItems = abi2.filter((abiItem2) => {
      if (isSelector) {
        if (abiItem2.type === "function" || abiItem2.type === "error")
          return getSelector(abiItem2) === slice3(name, 0, 4);
        if (abiItem2.type === "event")
          return getSignatureHash(abiItem2) === name;
        return false;
      }
      return "name" in abiItem2 && abiItem2.name === name;
    });
    if (abiItems.length === 0)
      throw new NotFoundError({ name });
    if (abiItems.length === 1)
      return {
        ...abiItems[0],
        ...prepare ? { hash: getSignatureHash(abiItems[0]) } : {}
      };
    let matchedAbiItem;
    for (const abiItem2 of abiItems) {
      if (!("inputs" in abiItem2))
        continue;
      if (!args || args.length === 0) {
        if (!abiItem2.inputs || abiItem2.inputs.length === 0)
          return {
            ...abiItem2,
            ...prepare ? { hash: getSignatureHash(abiItem2) } : {}
          };
        continue;
      }
      if (!abiItem2.inputs)
        continue;
      if (abiItem2.inputs.length === 0)
        continue;
      if (abiItem2.inputs.length !== args.length)
        continue;
      const matched = args.every((arg, index2) => {
        const abiParameter = "inputs" in abiItem2 && abiItem2.inputs[index2];
        if (!abiParameter)
          return false;
        return isArgOfType2(arg, abiParameter);
      });
      if (matched) {
        if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
          const ambiguousTypes = getAmbiguousTypes2(abiItem2.inputs, matchedAbiItem.inputs, args);
          if (ambiguousTypes)
            throw new AmbiguityError({
              abiItem: abiItem2,
              type: ambiguousTypes[0]
            }, {
              abiItem: matchedAbiItem,
              type: ambiguousTypes[1]
            });
        }
        matchedAbiItem = abiItem2;
      }
    }
    const abiItem = (() => {
      if (matchedAbiItem)
        return matchedAbiItem;
      const [abiItem2, ...overloads] = abiItems;
      return { ...abiItem2, overloads };
    })();
    if (!abiItem)
      throw new NotFoundError({ name });
    return {
      ...abiItem,
      ...prepare ? { hash: getSignatureHash(abiItem) } : {}
    };
  }
  function getSelector(...parameters) {
    const abiItem = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, name] = parameters;
        return fromAbi(abi2, name);
      }
      return parameters[0];
    })();
    return slice3(getSignatureHash(abiItem), 0, 4);
  }
  function getSignature(...parameters) {
    const abiItem = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, name] = parameters;
        return fromAbi(abi2, name);
      }
      return parameters[0];
    })();
    const signature = (() => {
      if (typeof abiItem === "string")
        return abiItem;
      return formatAbiItem(abiItem);
    })();
    return normalizeSignature2(signature);
  }
  function getSignatureHash(...parameters) {
    const abiItem = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, name] = parameters;
        return fromAbi(abi2, name);
      }
      return parameters[0];
    })();
    if (typeof abiItem !== "string" && "hash" in abiItem && abiItem.hash)
      return abiItem.hash;
    return keccak2562(fromString2(getSignature(abiItem)));
  }
  var AmbiguityError = class extends BaseError3 {
    constructor(x, y) {
      super("Found ambiguous types in overloaded ABI Items.", {
        metaMessages: [
          // TODO: abitype to add support for signature-formatted ABI items.
          `\`${x.type}\` in \`${normalizeSignature2(formatAbiItem(x.abiItem))}\`, and`,
          `\`${y.type}\` in \`${normalizeSignature2(formatAbiItem(y.abiItem))}\``,
          "",
          "These types encode differently and cannot be distinguished at runtime.",
          "Remove one of the ambiguous items in the ABI."
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiItem.AmbiguityError"
      });
    }
  };
  var NotFoundError = class extends BaseError3 {
    constructor({ name, data, type = "item" }) {
      const selector = (() => {
        if (name)
          return ` with name "${name}"`;
        if (data)
          return ` with data "${data}"`;
        return "";
      })();
      super(`ABI ${type}${selector} not found.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiItem.NotFoundError"
      });
    }
  };

  // node_modules/ox/_esm/core/AbiConstructor.js
  init_Hex();
  function encode3(...parameters) {
    const [abiConstructor, options] = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, options2] = parameters;
        return [fromAbi2(abi2), options2];
      }
      return parameters;
    })();
    const { bytecode, args } = options;
    return concat2(bytecode, abiConstructor.inputs?.length && args?.length ? encode2(abiConstructor.inputs, args) : "0x");
  }
  function from11(abiConstructor) {
    return from10(abiConstructor);
  }
  function fromAbi2(abi2) {
    const item = abi2.find((item2) => item2.type === "constructor");
    if (!item)
      throw new NotFoundError({ name: "constructor" });
    return item;
  }

  // node_modules/ox/_esm/core/AbiFunction.js
  init_Hex();
  function encodeData2(...parameters) {
    const [abiFunction, args = []] = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, name, args3] = parameters;
        return [fromAbi3(abi2, name, { args: args3 }), args3];
      }
      const [abiFunction2, args2] = parameters;
      return [abiFunction2, args2];
    })();
    const { overloads } = abiFunction;
    const item = overloads ? fromAbi3([abiFunction, ...overloads], abiFunction.name, {
      args
    }) : abiFunction;
    const selector = getSelector2(item);
    const data = args.length > 0 ? encode2(item.inputs, args) : void 0;
    return data ? concat2(selector, data) : selector;
  }
  function from12(abiFunction, options = {}) {
    return from10(abiFunction, options);
  }
  function fromAbi3(abi2, name, options) {
    const item = fromAbi(abi2, name, options);
    if (item.type !== "function")
      throw new NotFoundError({ name, type: "function" });
    return item;
  }
  function getSelector2(abiItem) {
    return getSelector(abiItem);
  }

  // node_modules/viem/_esm/actions/public/simulateCalls.js
  init_parseAccount();

  // node_modules/viem/_esm/constants/address.js
  var ethAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  var zeroAddress = "0x0000000000000000000000000000000000000000";

  // node_modules/viem/_esm/actions/public/simulateCalls.js
  init_contracts();
  init_base();
  init_encodeFunctionData();
  var getBalanceCode = "0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033";
  async function simulateCalls(client, parameters) {
    const { blockNumber, blockTag, calls, stateOverrides, traceAssetChanges, traceTransfers, validation } = parameters;
    const account = parameters.account ? parseAccount(parameters.account) : void 0;
    if (traceAssetChanges && !account)
      throw new BaseError2("`account` is required when `traceAssetChanges` is true");
    const getBalanceData = account ? encode3(from11("constructor(bytes, bytes)"), {
      bytecode: deploylessCallViaBytecodeBytecode,
      args: [
        getBalanceCode,
        encodeData2(from12("function getBalance(address)"), [account.address])
      ]
    }) : void 0;
    const assetAddresses = traceAssetChanges ? await Promise.all(parameters.calls.map(async (call2) => {
      if (!call2.data && !call2.abi)
        return;
      const { accessList } = await createAccessList(client, {
        account: account.address,
        ...call2,
        data: call2.abi ? encodeFunctionData(call2) : call2.data
      });
      return accessList.map(({ address, storageKeys }) => storageKeys.length > 0 ? address : null);
    })).then((x) => x.flat().filter(Boolean)) : [];
    const blocks = await simulateBlocks(client, {
      blockNumber,
      blockTag,
      blocks: [
        ...traceAssetChanges ? [
          // ETH pre balances
          {
            calls: [{ data: getBalanceData }],
            stateOverrides
          },
          // Asset pre balances
          {
            calls: assetAddresses.map((address, i) => ({
              abi: [
                from12("function balanceOf(address) returns (uint256)")
              ],
              functionName: "balanceOf",
              args: [account.address],
              to: address,
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          }
        ] : [],
        {
          calls: [...calls, {}].map((call2) => ({
            ...call2,
            from: account?.address
          })),
          stateOverrides
        },
        ...traceAssetChanges ? [
          // ETH post balances
          {
            calls: [{ data: getBalanceData }]
          },
          // Asset post balances
          {
            calls: assetAddresses.map((address, i) => ({
              abi: [
                from12("function balanceOf(address) returns (uint256)")
              ],
              functionName: "balanceOf",
              args: [account.address],
              to: address,
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          },
          // Decimals
          {
            calls: assetAddresses.map((address, i) => ({
              to: address,
              abi: [
                from12("function decimals() returns (uint256)")
              ],
              functionName: "decimals",
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          },
          // Token URI
          {
            calls: assetAddresses.map((address, i) => ({
              to: address,
              abi: [
                from12("function tokenURI(uint256) returns (string)")
              ],
              functionName: "tokenURI",
              args: [0n],
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          },
          // Symbols
          {
            calls: assetAddresses.map((address, i) => ({
              to: address,
              abi: [from12("function symbol() returns (string)")],
              functionName: "symbol",
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          }
        ] : []
      ],
      traceTransfers,
      validation
    });
    const block_results = traceAssetChanges ? blocks[2] : blocks[0];
    const [block_ethPre, block_assetsPre, , block_ethPost, block_assetsPost, block_decimals, block_tokenURI, block_symbols] = traceAssetChanges ? blocks : [];
    const { calls: block_calls, ...block } = block_results;
    const results = block_calls.slice(0, -1) ?? [];
    const ethPre = block_ethPre?.calls ?? [];
    const assetsPre = block_assetsPre?.calls ?? [];
    const balancesPre = [...ethPre, ...assetsPre].map((call2) => call2.status === "success" ? hexToBigInt(call2.data) : null);
    const ethPost = block_ethPost?.calls ?? [];
    const assetsPost = block_assetsPost?.calls ?? [];
    const balancesPost = [...ethPost, ...assetsPost].map((call2) => call2.status === "success" ? hexToBigInt(call2.data) : null);
    const decimals = (block_decimals?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
    const symbols = (block_symbols?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
    const tokenURI = (block_tokenURI?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
    const changes = [];
    for (const [i, balancePost] of balancesPost.entries()) {
      const balancePre = balancesPre[i];
      if (typeof balancePost !== "bigint")
        continue;
      if (typeof balancePre !== "bigint")
        continue;
      const decimals_ = decimals[i - 1];
      const symbol_ = symbols[i - 1];
      const tokenURI_ = tokenURI[i - 1];
      const token = (() => {
        if (i === 0)
          return {
            address: ethAddress,
            decimals: 18,
            symbol: "ETH"
          };
        return {
          address: assetAddresses[i - 1],
          decimals: tokenURI_ || decimals_ ? Number(decimals_ ?? 1) : void 0,
          symbol: symbol_ ?? void 0
        };
      })();
      if (changes.some((change) => change.token.address === token.address))
        continue;
      changes.push({
        token,
        value: {
          pre: balancePre,
          post: balancePost,
          diff: balancePost - balancePre
        }
      });
    }
    return {
      assetChanges: changes,
      block,
      results
    };
  }

  // node_modules/ox/_esm/erc6492/SignatureErc6492.js
  var SignatureErc6492_exports = {};
  __export(SignatureErc6492_exports, {
    InvalidWrappedSignatureError: () => InvalidWrappedSignatureError2,
    assert: () => assert7,
    from: () => from13,
    magicBytes: () => magicBytes2,
    universalSignatureValidatorAbi: () => universalSignatureValidatorAbi,
    universalSignatureValidatorBytecode: () => universalSignatureValidatorBytecode,
    unwrap: () => unwrap2,
    validate: () => validate5,
    wrap: () => wrap2
  });
  init_Errors();
  init_Hex();
  var magicBytes2 = "0x6492649264926492649264926492649264926492649264926492649264926492";
  var universalSignatureValidatorBytecode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
  var universalSignatureValidatorAbi = [
    {
      inputs: [
        {
          name: "_signer",
          type: "address"
        },
        {
          name: "_hash",
          type: "bytes32"
        },
        {
          name: "_signature",
          type: "bytes"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [
        {
          name: "_signer",
          type: "address"
        },
        {
          name: "_hash",
          type: "bytes32"
        },
        {
          name: "_signature",
          type: "bytes"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function",
      name: "isValidSig"
    }
  ];
  function assert7(wrapped) {
    if (slice3(wrapped, -32) !== magicBytes2)
      throw new InvalidWrappedSignatureError2(wrapped);
  }
  function from13(wrapped) {
    if (typeof wrapped === "string")
      return unwrap2(wrapped);
    return wrapped;
  }
  function unwrap2(wrapped) {
    assert7(wrapped);
    const [to, data, signature] = decode(from5("address, bytes, bytes"), wrapped);
    return { data, signature, to };
  }
  function wrap2(value) {
    const { data, signature, to } = value;
    return concat2(encode2(from5("address, bytes, bytes"), [
      to,
      data,
      signature
    ]), magicBytes2);
  }
  function validate5(wrapped) {
    try {
      assert7(wrapped);
      return true;
    } catch {
      return false;
    }
  }
  var InvalidWrappedSignatureError2 = class extends BaseError3 {
    constructor(wrapped) {
      super(`Value \`${wrapped}\` is an invalid ERC-6492 wrapped signature.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "SignatureErc6492.InvalidWrappedSignatureError"
      });
    }
  };

  // node_modules/viem/_esm/actions/public/verifyHash.js
  init_abis();
  init_contracts();
  init_contract();
  init_encodeDeployData();
  init_encodeFunctionData();
  init_getAddress();
  init_isAddressEqual();
  init_concat();
  init_isHex();
  init_fromHex();
  init_toHex();

  // node_modules/viem/_esm/utils/signature/serializeSignature.js
  init_secp256k1();
  init_fromHex();
  init_toBytes();
  function serializeSignature({ r, s, to = "hex", v, yParity }) {
    const yParity_ = (() => {
      if (yParity === 0 || yParity === 1)
        return yParity;
      if (v && (v === 27n || v === 28n || v >= 35n))
        return v % 2n === 0n ? 1 : 0;
      throw new Error("Invalid `v` or `yParity` value");
    })();
    const signature = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
    if (to === "hex")
      return signature;
    return hexToBytes(signature);
  }

  // node_modules/viem/_esm/actions/public/verifyHash.js
  init_call();
  async function verifyHash(client, parameters) {
    const { address, hash: hash3, erc6492VerifierAddress: verifierAddress = parameters.universalSignatureVerifierAddress ?? client.chain?.contracts?.erc6492Verifier?.address, multicallAddress = parameters.multicallAddress ?? client.chain?.contracts?.multicall3?.address } = parameters;
    const signature = (() => {
      const signature2 = parameters.signature;
      if (isHex(signature2))
        return signature2;
      if (typeof signature2 === "object" && "r" in signature2 && "s" in signature2)
        return serializeSignature(signature2);
      return bytesToHex2(signature2);
    })();
    try {
      if (SignatureErc8010_exports.validate(signature))
        return await verifyErc8010(client, {
          ...parameters,
          multicallAddress,
          signature
        });
      return await verifyErc6492(client, {
        ...parameters,
        verifierAddress,
        signature
      });
    } catch (error) {
      try {
        const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash: hash3, signature }));
        if (verified)
          return true;
      } catch {
      }
      if (error instanceof VerificationError) {
        return false;
      }
      throw error;
    }
  }
  async function verifyErc8010(client, parameters) {
    const { address, blockNumber, blockTag, hash: hash3, multicallAddress } = parameters;
    const { authorization: authorization_ox, data: initData, signature, to } = SignatureErc8010_exports.unwrap(parameters.signature);
    const code = await getCode(client, {
      address,
      blockNumber,
      blockTag
    });
    if (code === concatHex(["0xef0100", authorization_ox.address]))
      return await verifyErc1271(client, {
        address,
        blockNumber,
        blockTag,
        hash: hash3,
        signature
      });
    const authorization = {
      address: authorization_ox.address,
      chainId: Number(authorization_ox.chainId),
      nonce: Number(authorization_ox.nonce),
      r: numberToHex(authorization_ox.r, { size: 32 }),
      s: numberToHex(authorization_ox.s, { size: 32 }),
      yParity: authorization_ox.yParity
    };
    const valid = await verifyAuthorization({
      address,
      authorization
    });
    if (!valid)
      throw new VerificationError();
    const results = await getAction(client, readContract, "readContract")({
      ...multicallAddress ? { address: multicallAddress } : { code: multicall3Bytecode },
      authorizationList: [authorization],
      abi: multicall3Abi,
      blockNumber,
      blockTag: "pending",
      functionName: "aggregate3",
      args: [
        [
          ...initData ? [
            {
              allowFailure: true,
              target: to ?? address,
              callData: initData
            }
          ] : [],
          {
            allowFailure: true,
            target: address,
            callData: encodeFunctionData({
              abi: erc1271Abi,
              functionName: "isValidSignature",
              args: [hash3, signature]
            })
          }
        ]
      ]
    });
    const data = results[results.length - 1]?.returnData;
    if (data?.startsWith("0x1626ba7e"))
      return true;
    throw new VerificationError();
  }
  async function verifyErc6492(client, parameters) {
    const { address, factory, factoryData, hash: hash3, signature, verifierAddress, ...rest } = parameters;
    const wrappedSignature = await (async () => {
      if (!factory && !factoryData)
        return signature;
      if (SignatureErc6492_exports.validate(signature))
        return signature;
      return SignatureErc6492_exports.wrap({
        data: factoryData,
        signature,
        to: factory
      });
    })();
    const args = verifierAddress ? {
      to: verifierAddress,
      data: encodeFunctionData({
        abi: erc6492SignatureValidatorAbi,
        functionName: "isValidSig",
        args: [address, hash3, wrappedSignature]
      }),
      ...rest
    } : {
      data: encodeDeployData({
        abi: erc6492SignatureValidatorAbi,
        args: [address, hash3, wrappedSignature],
        bytecode: erc6492SignatureValidatorByteCode
      }),
      ...rest
    };
    const { data } = await getAction(client, call, "call")(args).catch((error) => {
      if (error instanceof CallExecutionError)
        throw new VerificationError();
      throw error;
    });
    if (hexToBool(data ?? "0x0"))
      return true;
    throw new VerificationError();
  }
  async function verifyErc1271(client, parameters) {
    const { address, blockNumber, blockTag, hash: hash3, signature } = parameters;
    const result = await getAction(client, readContract, "readContract")({
      address,
      abi: erc1271Abi,
      args: [hash3, signature],
      blockNumber,
      blockTag,
      functionName: "isValidSignature"
    }).catch((error) => {
      if (error instanceof ContractFunctionExecutionError)
        throw new VerificationError();
      throw error;
    });
    if (result.startsWith("0x1626ba7e"))
      return true;
    throw new VerificationError();
  }
  var VerificationError = class extends Error {
  };

  // node_modules/viem/_esm/actions/public/verifyMessage.js
  async function verifyMessage(client, { address, message, factory, factoryData, signature, ...callRequest }) {
    const hash3 = hashMessage(message);
    return getAction(client, verifyHash, "verifyHash")({
      address,
      factory,
      factoryData,
      hash: hash3,
      signature,
      ...callRequest
    });
  }

  // node_modules/viem/_esm/actions/public/verifyTypedData.js
  async function verifyTypedData(client, parameters) {
    const { address, factory, factoryData, signature, message, primaryType, types, domain, ...callRequest } = parameters;
    const hash3 = hashTypedData({ message, primaryType, types, domain });
    return getAction(client, verifyHash, "verifyHash")({
      address,
      factory,
      factoryData,
      hash: hash3,
      signature,
      ...callRequest
    });
  }

  // node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
  init_transaction();
  init_withResolvers();
  init_stringify();

  // node_modules/viem/_esm/actions/public/watchBlockNumber.js
  init_fromHex();
  init_stringify();
  function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval }) {
    const enablePolling = (() => {
      if (typeof poll_ !== "undefined")
        return poll_;
      if (client.transport.type === "webSocket" || client.transport.type === "ipc")
        return false;
      if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
        return false;
      return true;
    })();
    let prevBlockNumber;
    const pollBlockNumber = () => {
      const observerId = stringify([
        "watchBlockNumber",
        client.uid,
        emitOnBegin,
        emitMissed,
        pollingInterval
      ]);
      return observe(observerId, { onBlockNumber, onError }, (emit) => poll(async () => {
        try {
          const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({ cacheTime: 0 });
          if (prevBlockNumber !== void 0) {
            if (blockNumber === prevBlockNumber)
              return;
            if (blockNumber - prevBlockNumber > 1 && emitMissed) {
              for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
                emit.onBlockNumber(i, prevBlockNumber);
                prevBlockNumber = i;
              }
            }
          }
          if (prevBlockNumber === void 0 || blockNumber > prevBlockNumber) {
            emit.onBlockNumber(blockNumber, prevBlockNumber);
            prevBlockNumber = blockNumber;
          }
        } catch (err) {
          emit.onError?.(err);
        }
      }, {
        emitOnBegin,
        interval: pollingInterval
      }));
    };
    const subscribeBlockNumber = () => {
      const observerId = stringify([
        "watchBlockNumber",
        client.uid,
        emitOnBegin,
        emitMissed
      ]);
      return observe(observerId, { onBlockNumber, onError }, (emit) => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const transport = (() => {
              if (client.transport.type === "fallback") {
                const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
                if (!transport2)
                  return client.transport;
                return transport2.value;
              }
              return client.transport;
            })();
            const { unsubscribe: unsubscribe_ } = await transport.subscribe({
              params: ["newHeads"],
              onData(data) {
                if (!active)
                  return;
                const blockNumber = hexToBigInt(data.result?.number);
                emit.onBlockNumber(blockNumber, prevBlockNumber);
                prevBlockNumber = blockNumber;
              },
              onError(error) {
                emit.onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active)
              unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return () => unsubscribe();
      });
    };
    return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
  }

  // node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
  async function waitForTransactionReceipt(client, parameters) {
    const {
      checkReplacement = true,
      confirmations = 1,
      hash: hash3,
      onReplaced,
      retryCount = 6,
      retryDelay = ({ count }) => ~~(1 << count) * 200,
      // exponential backoff
      timeout = 18e4
    } = parameters;
    const observerId = stringify(["waitForTransactionReceipt", client.uid, hash3]);
    const pollingInterval = (() => {
      if (parameters.pollingInterval)
        return parameters.pollingInterval;
      if (client.chain?.experimental_preconfirmationTime)
        return client.chain.experimental_preconfirmationTime;
      return client.pollingInterval;
    })();
    let transaction;
    let replacedTransaction;
    let receipt;
    let retrying = false;
    let _unobserve;
    let _unwatch;
    const { promise, resolve, reject } = withResolvers();
    const timer = timeout ? setTimeout(() => {
      _unwatch?.();
      _unobserve?.();
      reject(new WaitForTransactionReceiptTimeoutError({ hash: hash3 }));
    }, timeout) : void 0;
    _unobserve = observe(observerId, { onReplaced, resolve, reject }, async (emit) => {
      receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash3 }).catch(() => void 0);
      if (receipt && confirmations <= 1) {
        clearTimeout(timer);
        emit.resolve(receipt);
        _unobserve?.();
        return;
      }
      _unwatch = getAction(client, watchBlockNumber, "watchBlockNumber")({
        emitMissed: true,
        emitOnBegin: true,
        poll: true,
        pollingInterval,
        async onBlockNumber(blockNumber_) {
          const done = (fn) => {
            clearTimeout(timer);
            _unwatch?.();
            fn();
            _unobserve?.();
          };
          let blockNumber = blockNumber_;
          if (retrying)
            return;
          try {
            if (receipt) {
              if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                return;
              done(() => emit.resolve(receipt));
              return;
            }
            if (checkReplacement && !transaction) {
              retrying = true;
              await withRetry(async () => {
                transaction = await getAction(client, getTransaction, "getTransaction")({ hash: hash3 });
                if (transaction.blockNumber)
                  blockNumber = transaction.blockNumber;
              }, {
                delay: retryDelay,
                retryCount
              });
              retrying = false;
            }
            receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash3 });
            if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
              return;
            done(() => emit.resolve(receipt));
          } catch (err) {
            if (err instanceof TransactionNotFoundError || err instanceof TransactionReceiptNotFoundError) {
              if (!transaction) {
                retrying = false;
                return;
              }
              try {
                replacedTransaction = transaction;
                retrying = true;
                const block = await withRetry(() => getAction(client, getBlock, "getBlock")({
                  blockNumber,
                  includeTransactions: true
                }), {
                  delay: retryDelay,
                  retryCount,
                  shouldRetry: ({ error }) => error instanceof BlockNotFoundError
                });
                retrying = false;
                const replacementTransaction = block.transactions.find(({ from: from14, nonce }) => from14 === replacedTransaction.from && nonce === replacedTransaction.nonce);
                if (!replacementTransaction)
                  return;
                receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({
                  hash: replacementTransaction.hash
                });
                if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                  return;
                let reason = "replaced";
                if (replacementTransaction.to === replacedTransaction.to && replacementTransaction.value === replacedTransaction.value && replacementTransaction.input === replacedTransaction.input) {
                  reason = "repriced";
                } else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) {
                  reason = "cancelled";
                }
                done(() => {
                  emit.onReplaced?.({
                    reason,
                    replacedTransaction,
                    transaction: replacementTransaction,
                    transactionReceipt: receipt
                  });
                  emit.resolve(receipt);
                });
              } catch (err_) {
                done(() => emit.reject(err_));
              }
            } else {
              done(() => emit.reject(err));
            }
          }
        }
      });
    });
    return promise;
  }

  // node_modules/viem/_esm/actions/public/watchBlocks.js
  init_stringify();
  function watchBlocks(client, { blockTag = client.experimental_blockTag ?? "latest", emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval }) {
    const enablePolling = (() => {
      if (typeof poll_ !== "undefined")
        return poll_;
      if (client.transport.type === "webSocket" || client.transport.type === "ipc")
        return false;
      if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
        return false;
      return true;
    })();
    const includeTransactions = includeTransactions_ ?? false;
    let prevBlock;
    const pollBlocks = () => {
      const observerId = stringify([
        "watchBlocks",
        client.uid,
        blockTag,
        emitMissed,
        emitOnBegin,
        includeTransactions,
        pollingInterval
      ]);
      return observe(observerId, { onBlock, onError }, (emit) => poll(async () => {
        try {
          const block = await getAction(client, getBlock, "getBlock")({
            blockTag,
            includeTransactions
          });
          if (block.number !== null && prevBlock?.number != null) {
            if (block.number === prevBlock.number)
              return;
            if (block.number - prevBlock.number > 1 && emitMissed) {
              for (let i = prevBlock?.number + 1n; i < block.number; i++) {
                const block2 = await getAction(client, getBlock, "getBlock")({
                  blockNumber: i,
                  includeTransactions
                });
                emit.onBlock(block2, prevBlock);
                prevBlock = block2;
              }
            }
          }
          if (
            // If no previous block exists, emit.
            prevBlock?.number == null || // If the block tag is "pending" with no block number, emit.
            blockTag === "pending" && block?.number == null || // If the next block number is greater than the previous block number, emit.
            // We don't want to emit blocks in the past.
            block.number !== null && block.number > prevBlock.number
          ) {
            emit.onBlock(block, prevBlock);
            prevBlock = block;
          }
        } catch (err) {
          emit.onError?.(err);
        }
      }, {
        emitOnBegin,
        interval: pollingInterval
      }));
    };
    const subscribeBlocks = () => {
      let active = true;
      let emitFetched = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          if (emitOnBegin) {
            getAction(client, getBlock, "getBlock")({
              blockTag,
              includeTransactions
            }).then((block) => {
              if (!active)
                return;
              if (!emitFetched)
                return;
              onBlock(block, void 0);
              emitFetched = false;
            }).catch(onError);
          }
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["newHeads"],
            async onData(data) {
              if (!active)
                return;
              const block = await getAction(client, getBlock, "getBlock")({
                blockNumber: data.result?.number,
                includeTransactions
              }).catch(() => {
              });
              if (!active)
                return;
              onBlock(block, prevBlock);
              emitFetched = false;
              prevBlock = block;
            },
            onError(error) {
              onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    };
    return enablePolling ? pollBlocks() : subscribeBlocks();
  }

  // node_modules/viem/_esm/actions/public/watchEvent.js
  init_abi();
  init_rpc();
  init_stringify();
  function watchEvent(client, { address, args, batch = true, event, events, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
    const enablePolling = (() => {
      if (typeof poll_ !== "undefined")
        return poll_;
      if (typeof fromBlock === "bigint")
        return true;
      if (client.transport.type === "webSocket" || client.transport.type === "ipc")
        return false;
      if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
        return false;
      return true;
    })();
    const strict = strict_ ?? false;
    const pollEvent = () => {
      const observerId = stringify([
        "watchEvent",
        address,
        args,
        batch,
        client.uid,
        event,
        pollingInterval,
        fromBlock
      ]);
      return observe(observerId, { onLogs, onError }, (emit) => {
        let previousBlockNumber;
        if (fromBlock !== void 0)
          previousBlockNumber = fromBlock - 1n;
        let filter;
        let initialized = false;
        const unwatch = poll(async () => {
          if (!initialized) {
            try {
              filter = await getAction(client, createEventFilter, "createEventFilter")({
                address,
                args,
                event,
                events,
                strict,
                fromBlock
              });
            } catch {
            }
            initialized = true;
            return;
          }
          try {
            let logs;
            if (filter) {
              logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
            } else {
              const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
              if (previousBlockNumber && previousBlockNumber !== blockNumber) {
                logs = await getAction(client, getLogs, "getLogs")({
                  address,
                  args,
                  event,
                  events,
                  fromBlock: previousBlockNumber + 1n,
                  toBlock: blockNumber
                });
              } else {
                logs = [];
              }
              previousBlockNumber = blockNumber;
            }
            if (logs.length === 0)
              return;
            if (batch)
              emit.onLogs(logs);
            else
              for (const log of logs)
                emit.onLogs([log]);
          } catch (err) {
            if (filter && err instanceof InvalidInputRpcError)
              initialized = false;
            emit.onError?.(err);
          }
        }, {
          emitOnBegin: true,
          interval: pollingInterval
        });
        return async () => {
          if (filter)
            await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
          unwatch();
        };
      });
    };
    const subscribeEvent = () => {
      let active = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const events_ = events ?? (event ? [event] : void 0);
          let topics = [];
          if (events_) {
            const encoded = events_.flatMap((event2) => encodeEventTopics({
              abi: [event2],
              eventName: event2.name,
              args
            }));
            topics = [encoded];
            if (event)
              topics = topics[0];
          }
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["logs", { address, topics }],
            onData(data) {
              if (!active)
                return;
              const log = data.result;
              try {
                const { eventName, args: args2 } = decodeEventLog({
                  abi: events_ ?? [],
                  data: log.data,
                  topics: log.topics,
                  strict
                });
                const formatted = formatLog(log, { args: args2, eventName });
                onLogs([formatted]);
              } catch (err) {
                let eventName;
                let isUnnamed;
                if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                  if (strict_)
                    return;
                  eventName = err.abiItem.name;
                  isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
                }
                const formatted = formatLog(log, {
                  args: isUnnamed ? [] : {},
                  eventName
                });
                onLogs([formatted]);
              }
            },
            onError(error) {
              onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    };
    return enablePolling ? pollEvent() : subscribeEvent();
  }

  // node_modules/viem/_esm/actions/public/watchPendingTransactions.js
  init_stringify();
  function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
    const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket" && client.transport.type !== "ipc";
    const pollPendingTransactions = () => {
      const observerId = stringify([
        "watchPendingTransactions",
        client.uid,
        batch,
        pollingInterval
      ]);
      return observe(observerId, { onTransactions, onError }, (emit) => {
        let filter;
        const unwatch = poll(async () => {
          try {
            if (!filter) {
              try {
                filter = await getAction(client, createPendingTransactionFilter, "createPendingTransactionFilter")({});
                return;
              } catch (err) {
                unwatch();
                throw err;
              }
            }
            const hashes = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
            if (hashes.length === 0)
              return;
            if (batch)
              emit.onTransactions(hashes);
            else
              for (const hash3 of hashes)
                emit.onTransactions([hash3]);
          } catch (err) {
            emit.onError?.(err);
          }
        }, {
          emitOnBegin: true,
          interval: pollingInterval
        });
        return async () => {
          if (filter)
            await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
          unwatch();
        };
      });
    };
    const subscribePendingTransactions = () => {
      let active = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
            params: ["newPendingTransactions"],
            onData(data) {
              if (!active)
                return;
              const transaction = data.result;
              onTransactions([transaction]);
            },
            onError(error) {
              onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    };
    return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
  }

  // node_modules/viem/_esm/utils/siwe/parseSiweMessage.js
  function parseSiweMessage(message) {
    const { scheme, statement, ...prefix } = message.match(prefixRegex)?.groups ?? {};
    const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = message.match(suffixRegex)?.groups ?? {};
    const resources = message.split("Resources:")[1]?.split("\n- ").slice(1);
    return {
      ...prefix,
      ...suffix,
      ...chainId ? { chainId: Number(chainId) } : {},
      ...expirationTime ? { expirationTime: new Date(expirationTime) } : {},
      ...issuedAt ? { issuedAt: new Date(issuedAt) } : {},
      ...notBefore ? { notBefore: new Date(notBefore) } : {},
      ...requestId ? { requestId } : {},
      ...resources ? { resources } : {},
      ...scheme ? { scheme } : {},
      ...statement ? { statement } : {}
    };
  }
  var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
  var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;

  // node_modules/viem/_esm/utils/siwe/validateSiweMessage.js
  init_isAddress();
  init_isAddressEqual();
  function validateSiweMessage(parameters) {
    const { address, domain, message, nonce, scheme, time = /* @__PURE__ */ new Date() } = parameters;
    if (domain && message.domain !== domain)
      return false;
    if (nonce && message.nonce !== nonce)
      return false;
    if (scheme && message.scheme !== scheme)
      return false;
    if (message.expirationTime && time >= message.expirationTime)
      return false;
    if (message.notBefore && time < message.notBefore)
      return false;
    try {
      if (!message.address)
        return false;
      if (!isAddress(message.address, { strict: false }))
        return false;
      if (address && !isAddressEqual(message.address, address))
        return false;
    } catch {
      return false;
    }
    return true;
  }

  // node_modules/viem/_esm/actions/siwe/verifySiweMessage.js
  async function verifySiweMessage(client, parameters) {
    const { address, domain, message, nonce, scheme, signature, time = /* @__PURE__ */ new Date(), ...callRequest } = parameters;
    const parsed = parseSiweMessage(message);
    if (!parsed.address)
      return false;
    const isValid = validateSiweMessage({
      address,
      domain,
      message: parsed,
      nonce,
      scheme,
      time
    });
    if (!isValid)
      return false;
    const hash3 = hashMessage(message);
    return verifyHash(client, {
      address: parsed.address,
      hash: hash3,
      signature,
      ...callRequest
    });
  }

  // node_modules/viem/_esm/actions/wallet/sendRawTransactionSync.js
  init_transaction();
  async function sendRawTransactionSync(client, { serializedTransaction, throwOnReceiptRevert, timeout }) {
    const receipt = await client.request({
      method: "eth_sendRawTransactionSync",
      params: timeout ? [serializedTransaction, numberToHex(timeout)] : [serializedTransaction]
    }, { retryCount: 0 });
    const format = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
    const formatted = format(receipt);
    if (formatted.status === "reverted" && throwOnReceiptRevert)
      throw new TransactionReceiptRevertedError({ receipt: formatted });
    return formatted;
  }

  // node_modules/viem/_esm/clients/decorators/public.js
  function publicActions(client) {
    return {
      call: (args) => call(client, args),
      createAccessList: (args) => createAccessList(client, args),
      createBlockFilter: () => createBlockFilter(client),
      createContractEventFilter: (args) => createContractEventFilter(client, args),
      createEventFilter: (args) => createEventFilter(client, args),
      createPendingTransactionFilter: () => createPendingTransactionFilter(client),
      estimateContractGas: (args) => estimateContractGas(client, args),
      estimateGas: (args) => estimateGas(client, args),
      getBalance: (args) => getBalance(client, args),
      getBlobBaseFee: () => getBlobBaseFee(client),
      getBlock: (args) => getBlock(client, args),
      getBlockNumber: (args) => getBlockNumber(client, args),
      getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
      getBytecode: (args) => getCode(client, args),
      getChainId: () => getChainId(client),
      getCode: (args) => getCode(client, args),
      getContractEvents: (args) => getContractEvents(client, args),
      getEip712Domain: (args) => getEip712Domain(client, args),
      getEnsAddress: (args) => getEnsAddress(client, args),
      getEnsAvatar: (args) => getEnsAvatar(client, args),
      getEnsName: (args) => getEnsName(client, args),
      getEnsResolver: (args) => getEnsResolver(client, args),
      getEnsText: (args) => getEnsText(client, args),
      getFeeHistory: (args) => getFeeHistory(client, args),
      estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
      getFilterChanges: (args) => getFilterChanges(client, args),
      getFilterLogs: (args) => getFilterLogs(client, args),
      getGasPrice: () => getGasPrice(client),
      getLogs: (args) => getLogs(client, args),
      getProof: (args) => getProof(client, args),
      estimateMaxPriorityFeePerGas: (args) => estimateMaxPriorityFeePerGas(client, args),
      fillTransaction: (args) => fillTransaction(client, args),
      getStorageAt: (args) => getStorageAt(client, args),
      getTransaction: (args) => getTransaction(client, args),
      getTransactionConfirmations: (args) => getTransactionConfirmations(client, args),
      getTransactionCount: (args) => getTransactionCount(client, args),
      getTransactionReceipt: (args) => getTransactionReceipt(client, args),
      multicall: (args) => multicall(client, args),
      prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
      readContract: (args) => readContract(client, args),
      sendRawTransaction: (args) => sendRawTransaction(client, args),
      sendRawTransactionSync: (args) => sendRawTransactionSync(client, args),
      simulate: (args) => simulateBlocks(client, args),
      simulateBlocks: (args) => simulateBlocks(client, args),
      simulateCalls: (args) => simulateCalls(client, args),
      simulateContract: (args) => simulateContract(client, args),
      verifyHash: (args) => verifyHash(client, args),
      verifyMessage: (args) => verifyMessage(client, args),
      verifySiweMessage: (args) => verifySiweMessage(client, args),
      verifyTypedData: (args) => verifyTypedData(client, args),
      uninstallFilter: (args) => uninstallFilter(client, args),
      waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
      watchBlocks: (args) => watchBlocks(client, args),
      watchBlockNumber: (args) => watchBlockNumber(client, args),
      watchContractEvent: (args) => watchContractEvent(client, args),
      watchEvent: (args) => watchEvent(client, args),
      watchPendingTransactions: (args) => watchPendingTransactions(client, args)
    };
  }

  // node_modules/viem/_esm/clients/createPublicClient.js
  function createPublicClient(parameters) {
    const { key = "public", name = "Public Client" } = parameters;
    const client = createClient({
      ...parameters,
      key,
      name,
      type: "publicClient"
    });
    return client.extend(publicActions);
  }

  // node_modules/viem/_esm/clients/transports/createTransport.js
  function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
    const uid2 = uid();
    return {
      config: {
        key,
        methods,
        name,
        request,
        retryCount,
        retryDelay,
        timeout,
        type
      },
      request: buildRequest(request, { methods, retryCount, retryDelay, uid: uid2 }),
      value
    };
  }

  // node_modules/viem/_esm/clients/transports/custom.js
  function custom(provider, config = {}) {
    const { key = "custom", methods, name = "Custom Provider", retryDelay } = config;
    return ({ retryCount: defaultRetryCount }) => createTransport({
      key,
      methods,
      name,
      request: provider.request.bind(provider),
      retryCount: config.retryCount ?? defaultRetryCount,
      retryDelay,
      type: "custom"
    });
  }

  // node_modules/viem/_esm/clients/transports/fallback.js
  init_node();
  init_rpc();
  function fallback(transports_, config = {}) {
    const { key = "fallback", name = "Fallback", rank = false, shouldThrow: shouldThrow_ = shouldThrow, retryCount, retryDelay } = config;
    return ({ chain, pollingInterval = 4e3, timeout, ...rest }) => {
      let transports = transports_;
      let onResponse = () => {
      };
      const transport = createTransport({
        key,
        name,
        async request({ method, params }) {
          let includes;
          const fetch2 = async (i = 0) => {
            const transport2 = transports[i]({
              ...rest,
              chain,
              retryCount: 0,
              timeout
            });
            try {
              const response = await transport2.request({
                method,
                params
              });
              onResponse({
                method,
                params,
                response,
                transport: transport2,
                status: "success"
              });
              return response;
            } catch (err) {
              onResponse({
                error: err,
                method,
                params,
                transport: transport2,
                status: "error"
              });
              if (shouldThrow_(err))
                throw err;
              if (i === transports.length - 1)
                throw err;
              includes ??= transports.slice(i + 1).some((transport3) => {
                const { include, exclude } = transport3({ chain }).config.methods || {};
                if (include)
                  return include.includes(method);
                if (exclude)
                  return !exclude.includes(method);
                return true;
              });
              if (!includes)
                throw err;
              return fetch2(i + 1);
            }
          };
          return fetch2();
        },
        retryCount,
        retryDelay,
        type: "fallback"
      }, {
        onResponse: (fn) => onResponse = fn,
        transports: transports.map((fn) => fn({ chain, retryCount: 0 }))
      });
      if (rank) {
        const rankOptions = typeof rank === "object" ? rank : {};
        rankTransports({
          chain,
          interval: rankOptions.interval ?? pollingInterval,
          onTransports: (transports_2) => transports = transports_2,
          ping: rankOptions.ping,
          sampleCount: rankOptions.sampleCount,
          timeout: rankOptions.timeout,
          transports,
          weights: rankOptions.weights
        });
      }
      return transport;
    };
  }
  function shouldThrow(error) {
    if ("code" in error && typeof error.code === "number") {
      if (error.code === TransactionRejectedRpcError.code || error.code === UserRejectedRequestError.code || ExecutionRevertedError.nodeMessage.test(error.message) || error.code === 5e3)
        return true;
    }
    return false;
  }
  function rankTransports({ chain, interval = 4e3, onTransports, ping, sampleCount = 10, timeout = 1e3, transports, weights = {} }) {
    const { stability: stabilityWeight = 0.7, latency: latencyWeight = 0.3 } = weights;
    const samples = [];
    const rankTransports_ = async () => {
      const sample = await Promise.all(transports.map(async (transport) => {
        const transport_ = transport({ chain, retryCount: 0, timeout });
        const start = Date.now();
        let end;
        let success;
        try {
          await (ping ? ping({ transport: transport_ }) : transport_.request({ method: "net_listening" }));
          success = 1;
        } catch {
          success = 0;
        } finally {
          end = Date.now();
        }
        const latency = end - start;
        return { latency, success };
      }));
      samples.push(sample);
      if (samples.length > sampleCount)
        samples.shift();
      const maxLatency = Math.max(...samples.map((sample2) => Math.max(...sample2.map(({ latency }) => latency))));
      const scores = transports.map((_, i) => {
        const latencies = samples.map((sample2) => sample2[i].latency);
        const meanLatency = latencies.reduce((acc, latency) => acc + latency, 0) / latencies.length;
        const latencyScore = 1 - meanLatency / maxLatency;
        const successes = samples.map((sample2) => sample2[i].success);
        const stabilityScore = successes.reduce((acc, success) => acc + success, 0) / successes.length;
        if (stabilityScore === 0)
          return [0, i];
        return [
          latencyWeight * latencyScore + stabilityWeight * stabilityScore,
          i
        ];
      }).sort((a, b) => b[0] - a[0]);
      onTransports(scores.map(([, i]) => transports[i]));
      await wait(interval);
      rankTransports_();
    };
    rankTransports_();
  }

  // node_modules/viem/_esm/clients/transports/http.js
  init_request();

  // node_modules/viem/_esm/errors/transport.js
  init_base();
  var UrlRequiredError = class extends BaseError2 {
    constructor() {
      super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
        docsPath: "/docs/clients/intro",
        name: "UrlRequiredError"
      });
    }
  };

  // node_modules/viem/_esm/clients/transports/http.js
  init_createBatchScheduler();
  function http(url, config = {}) {
    const { batch, fetchFn, fetchOptions, key = "http", methods, name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay, raw } = config;
    return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
      const { batchSize = 1e3, wait: wait2 = 0 } = typeof batch === "object" ? batch : {};
      const retryCount = config.retryCount ?? retryCount_;
      const timeout = timeout_ ?? config.timeout ?? 1e4;
      const url_ = url || chain?.rpcUrls.default.http[0];
      if (!url_)
        throw new UrlRequiredError();
      const rpcClient = getHttpRpcClient(url_, {
        fetchFn,
        fetchOptions,
        onRequest: onFetchRequest,
        onResponse: onFetchResponse,
        timeout
      });
      return createTransport({
        key,
        methods,
        name,
        async request({ method, params }) {
          const body = { method, params };
          const { schedule } = createBatchScheduler({
            id: url_,
            wait: wait2,
            shouldSplitBatch(requests) {
              return requests.length > batchSize;
            },
            fn: (body2) => rpcClient.request({
              body: body2
            }),
            sort: (a, b) => a.id - b.id
          });
          const fn = async (body2) => batch ? schedule(body2) : [
            await rpcClient.request({
              body: body2
            })
          ];
          const [{ error, result }] = await fn(body);
          if (raw)
            return { error, result };
          if (error)
            throw new RpcRequestError({
              body,
              error,
              url: url_
            });
          return result;
        },
        retryCount,
        retryDelay,
        timeout,
        type: "http"
      }, {
        fetchOptions,
        url: url_
      });
    };
  }

  // node_modules/viem/_esm/chains/definitions/mainnet.js
  var mainnet = /* @__PURE__ */ defineChain({
    id: 1,
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockTime: 12e3,
    rpcUrls: {
      default: {
        http: ["https://eth.merkle.io"]
      }
    },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://etherscan.io",
        apiUrl: "https://api.etherscan.io/api"
      }
    },
    contracts: {
      ensUniversalResolver: {
        address: "0xeeeeeeee14d718c2b47d9923deab1335e144eeee",
        blockCreated: 23085558
      },
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 14353601
      }
    }
  });

  // vendor/workers/game_workers/lib/timeline-check.js
  var TIMELINE_NO_GAME_CAUSES = Object.freeze([
    "chain_unreadable",
    "env_chain_mismatch",
    "grouping_anchor_unreadable",
    "previous_block_not_ready",
    "previous_block_anchor_pending"
  ]);

  // vendor/workers/game_workers/lib/char-counter.js
  var DEFAULT_CHAT_CAPS = Object.freeze({
    maxChars: 1e4,
    maxMessages: 100,
    maxMsgChars: 1e3
  });
  var GUEST_PINNED_RULES = Object.freeze({
    minChars: 500,
    minMessages: 20,
    maxChars: 1e4,
    maxMessages: 100,
    maxMsgChars: 1e3
  });
  var GUEST_PINNED_ENV_NAMES = Object.freeze({
    minChars: "GAME_MIN_CHARS",
    minMessages: "GAME_MIN_MESSAGES",
    maxChars: "GAME_MAX_CHARS",
    maxMessages: "GAME_MAX_MESSAGES",
    maxMsgChars: "GAME_MAX_MSG_CHARS"
  });

  // vendor/workers/game_workers/lib/protocol-v2.js
  var ECIES_ENVELOPE_BYTES = 97;
  var ACTION_PLAINTEXT_BYTES = 128;
  var ACTION_CIPHERTEXT_HEX_LEN = 2 * (ECIES_ENVELOPE_BYTES + ACTION_PLAINTEXT_BYTES);
  var RECEIPT_FRESH_WINDOW_MS = 10 * 60 * 1e3;
  var SECP256K1_N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
  var SECP256K1_HALF_N = SECP256K1_N >> 1n;

  // src/common/chain.js
  var LEGACY_HASH_STORAGE_ALLOWLIST = Object.freeze([
    ["0xd2c8a3be50d9a158bd57", "9a26a346f54cfb93426d"].join("")
  ]);
  var HASH_STORAGE_ABI = [
    {
      type: "function",
      name: "getOtherHash",
      stateMutability: "view",
      inputs: [{ name: "key", type: "bytes32" }],
      outputs: [{ name: "hash", type: "bytes32" }, { name: "updated", type: "uint256" }]
    },
    {
      type: "function",
      name: "otherRegistrationCount",
      stateMutability: "view",
      inputs: [{ name: "key", type: "bytes32" }],
      outputs: [{ type: "uint256" }]
    },
    {
      type: "function",
      name: "otherRegistrationAt",
      stateMutability: "view",
      inputs: [{ name: "key", type: "bytes32" }, { name: "index", type: "uint256" }],
      outputs: [{ name: "hash", type: "bytes32" }, { name: "registeredBlock", type: "uint256" }, { name: "registeredAt", type: "uint256" }]
    },
    {
      type: "function",
      name: "getApplicantHash",
      stateMutability: "view",
      inputs: [{ name: "blockNumber", type: "uint256" }],
      outputs: [{ name: "hash", type: "bytes32" }, { name: "updated", type: "uint256" }, { name: "signer", type: "address" }]
    },
    {
      type: "function",
      name: "getResultHash",
      stateMutability: "view",
      inputs: [{ name: "blockNumber", type: "uint256" }],
      outputs: [{ name: "hash", type: "bytes32" }, { name: "updated", type: "uint256" }, { name: "signer", type: "address" }]
    },
    {
      type: "function",
      name: "resultRegistrationCount",
      stateMutability: "view",
      inputs: [{ name: "blockNumber", type: "uint256" }],
      outputs: [{ type: "uint256" }]
    },
    {
      type: "function",
      name: "resultRegistrationAt",
      stateMutability: "view",
      inputs: [{ name: "blockNumber", type: "uint256" }, { name: "index", type: "uint256" }],
      outputs: [
        { name: "hash", type: "bytes32" },
        { name: "registeredBlock", type: "uint256" },
        { name: "registeredAt", type: "uint256" },
        { name: "signer", type: "address" }
      ]
    },
    {
      type: "function",
      name: "registrationCount",
      stateMutability: "view",
      inputs: [{ type: "uint256" }],
      outputs: [{ type: "uint256" }]
    },
    {
      type: "function",
      name: "applicantRegistrationAt",
      stateMutability: "view",
      inputs: [{ name: "blockNumber", type: "uint256" }, { name: "index", type: "uint256" }],
      outputs: [
        { name: "hash", type: "bytes32" },
        { name: "registeredBlock", type: "uint256" },
        { name: "signer", type: "address" }
      ]
    },
    {
      type: "function",
      name: "isApplicantRegistered",
      stateMutability: "view",
      inputs: [
        { name: "blockNumber", type: "uint256" },
        { name: "registeredBlock", type: "uint256" },
        { name: "hash", type: "bytes32" }
      ],
      outputs: [{ type: "bool" }]
    },
    { type: "function", name: "latestBuildVersion", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
    {
      type: "function",
      name: "getBuildHash",
      stateMutability: "view",
      inputs: [{ name: "buildVersion", type: "uint256" }],
      outputs: [{ name: "hash", type: "bytes32" }, { name: "updated", type: "uint256" }, { name: "signer", type: "address" }]
    },
    {
      type: "function",
      name: "buildRegistrationCount",
      stateMutability: "view",
      inputs: [{ type: "uint256" }],
      outputs: [{ type: "uint256" }]
    },
    {
      type: "function",
      name: "registerBuildHash",
      stateMutability: "nonpayable",
      inputs: [
        { name: "buildVersion", type: "uint256" },
        { name: "hash", type: "bytes32" },
        { name: "signer", type: "address" }
      ],
      outputs: []
    },
    {
      type: "event",
      name: "BuildHashRegistered",
      inputs: [
        { name: "buildVersion", type: "uint256", indexed: true },
        { name: "hash", type: "bytes32", indexed: false },
        { name: "signer", type: "address", indexed: false },
        { name: "isUpdate", type: "bool", indexed: false },
        { name: "updatedAt", type: "uint256", indexed: false },
        { name: "registrationCount", type: "uint256", indexed: false }
      ]
    }
  ];
  async function getWalletTransportIfMainnet(expectedChainId = 1, provider = null) {
    const eth = provider || (typeof window !== "undefined" ? window.ethereum : null);
    if (!eth) return null;
    try {
      const chainIdHex = await eth.request({ method: "eth_chainId" });
      if (parseInt(chainIdHex, 16) !== expectedChainId) return null;
      return custom(eth);
    } catch {
      return null;
    }
  }
  function chainFor(chainIdExpected, rpcUrls) {
    if (chainIdExpected === 1) return mainnet;
    return defineChain({
      id: chainIdExpected,
      name: `chain-${chainIdExpected}`,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: rpcUrls } }
    });
  }
  function makeLoaderClient({ rpcUrls, chainIdExpected = 1, walletTransport = null }) {
    const transports = [
      ...walletTransport ? [walletTransport] : [],
      ...rpcUrls.map((u) => http(u))
    ];
    return createPublicClient({ chain: chainFor(chainIdExpected, rpcUrls), transport: fallback(transports) });
  }
  async function readLatestBuildHash(client, hashStorageAddress) {
    const latest = await client.readContract({
      address: hashStorageAddress,
      abi: HASH_STORAGE_ABI,
      functionName: "latestBuildVersion"
    });
    if (latest === 0n) {
      try {
        const r = await readBuildHash(client, hashStorageAddress, 0n);
        return r;
      } catch {
        return null;
      }
    }
    return readBuildHash(client, hashStorageAddress, latest);
  }
  async function readBuildHash(client, hashStorageAddress, buildVersion) {
    const [hash3, updated, signer] = await client.readContract({
      address: hashStorageAddress,
      abi: HASH_STORAGE_ABI,
      functionName: "getBuildHash",
      args: [BigInt(buildVersion)]
    });
    const registrationCount = await client.readContract({
      address: hashStorageAddress,
      abi: HASH_STORAGE_ABI,
      functionName: "buildRegistrationCount",
      args: [BigInt(buildVersion)]
    });
    return {
      buildVersion: BigInt(buildVersion),
      hash: String(hash3).toLowerCase(),
      updatedBlock: updated,
      signer,
      registrationCount
    };
  }

  // src/common/bounded-fetch.js
  var EXTERNAL_READ_TIMEOUT_MS = 5e3;
  var ExternalReadUnavailableError = class extends Error {
    constructor(message, cause = null) {
      super(message, cause ? { cause } : void 0);
      this.name = "ExternalReadUnavailableError";
      this.code = "external_read_unavailable";
    }
  };
  async function withExternalReadTimeout(operation, { timeoutMs = EXTERNAL_READ_TIMEOUT_MS, signal: parentSignal = void 0, label = "external read" } = {}) {
    const limit = Number.isFinite(Number(timeoutMs)) && Number(timeoutMs) > 0 ? Number(timeoutMs) : EXTERNAL_READ_TIMEOUT_MS;
    const controller = new AbortController();
    const abortFromParent = () => controller.abort(parentSignal?.reason);
    if (parentSignal?.aborted) abortFromParent();
    else parentSignal?.addEventListener?.("abort", abortFromParent, { once: true });
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new ExternalReadUnavailableError(`${label} timed out after ${limit}ms`));
      }, limit);
    });
    try {
      return await Promise.race([operation(controller.signal), timeout]);
    } catch (error) {
      if (error?.code === "external_read_unavailable") throw error;
      if (controller.signal.aborted && !parentSignal?.aborted) {
        throw new ExternalReadUnavailableError(`${label} timed out after ${limit}ms`, error);
      }
      throw error;
    } finally {
      clearTimeout(timer);
      parentSignal?.removeEventListener?.("abort", abortFromParent);
    }
  }
  async function fetchBounded(url, options = {}, { timeoutMs = EXTERNAL_READ_TIMEOUT_MS, label = String(url), read = (response) => response } = {}) {
    const { signal: parentSignal, ...fetchOptions } = options;
    return withExternalReadTimeout(async (signal) => {
      const response = await fetch(url, { ...fetchOptions, signal });
      return read(response);
    }, { timeoutMs, signal: parentSignal, label });
  }

  // src/loader/loader.js
  async function defaultFetchBytes(bundleOrigin, manifestPath) {
    return fetchBounded(`${bundleOrigin}${manifestPath}`, { cache: "no-store", redirect: "error" }, {
      label: `bundle file ${manifestPath}`,
      read: async (res) => {
        if (!res.ok) return { ok: false, status: res.status };
        return { ok: true, status: 200, bytes: new Uint8Array(await res.arrayBuffer()) };
      }
    });
  }
  async function defaultFetchJson(url) {
    return fetchBounded(url, { cache: "no-store", redirect: "error" }, {
      label: `loader manifest ${url}`,
      read: (res) => {
        if (!res.ok) {
          const e = new Error(`http ${res.status}`);
          e.httpStatus = res.status;
          throw e;
        }
        return res.json();
      }
    });
  }
  async function runLoaderVerification(cfg2, {
    onStage = null,
    useWallet = true,
    makeClient = null,
    fetchJson = defaultFetchJson,
    fetchBytes = null
  } = {}) {
    const stage = (s, extra) => {
      if (onStage) onStage(s, extra);
    };
    stage("reading");
    let chainRead;
    try {
      const walletTransport = useWallet ? await getWalletTransportIfMainnet(cfg2.chainIdExpected) : null;
      const client = makeClient ? makeClient() : makeLoaderClient({ rpcUrls: resolveLoaderRpcs(cfg2), chainIdExpected: cfg2.chainIdExpected, walletTransport });
      chainRead = await readLatestBuildHash(client, cfg2.contracts.hashStorage);
    } catch (e) {
      return { status: LoaderStatus.RPC_FAIL, error: String(e?.message || e) };
    }
    if (!chainRead) return { status: LoaderStatus.NO_HASH_REGISTERED };
    stage("fetching");
    const manifestUrl = `${cfg2.bundleOrigin}${cfg2.manifestPath}`;
    let manifest;
    try {
      manifest = await fetchJson(manifestUrl);
    } catch (e) {
      const status = e.httpStatus === 503 ? LoaderStatus.MAINTENANCE : LoaderStatus.FETCH_FAIL;
      return { status, error: `manifest fetch: ${String(e?.message || e)}` };
    }
    const l1 = verifyManifestAgainstChain(manifest, chainRead);
    if (l1.status !== LoaderStatus.OK) return { ...l1, chainRead };
    const doFetchBytes = fetchBytes || ((p) => defaultFetchBytes(cfg2.bundleOrigin, p));
    const l2 = await verifyAllFiles(manifest, doFetchBytes, {
      onProgress: (done, total, path) => stage("verifying", { done, total, path })
    });
    if (l2.failures.length) {
      const mism = l2.failures.filter((f) => f.status === LoaderStatus.FILE_HASH_MISMATCH);
      if (mism.length) return { status: LoaderStatus.FILE_HASH_MISMATCH, count: mism.length, failures: mism, chainRead, buildVersion: l1.buildVersion };
      const rep = l2.failures[0];
      return { status: rep.status, failures: l2.failures, chainRead, buildVersion: l1.buildVersion };
    }
    return { status: LoaderStatus.OK, buildVersion: l1.buildVersion, warns: l1.warns, manifest, chainRead };
  }
  function resolveLoaderRpcs(cfg2) {
    if (Array.isArray(cfg2.rpcUrls) && cfg2.rpcUrls.length) return cfg2.rpcUrls;
    return cfg2.rpcPresets.map((p) => p.url);
  }
  async function launchVerifiedApp(cfg2, manifest, { swPath = "/sw.js", appEntry = "/", connectExtra = null } = {}) {
    if (!("serviceWorker" in navigator)) throw new Error("ServiceWorker unsupported in this browser");
    const reg = await navigator.serviceWorker.register(swPath, { scope: "/" });
    await navigator.serviceWorker.ready;
    const sw = reg.active || reg.waiting || reg.installing;
    if (!sw) throw new Error("service worker did not activate");
    const csp = buildCspHeader({
      connectExtra: connectExtra || defaultConnectExtra(cfg2),
      // K-S6-009: Turnstile 隔離フレーム（別オリジン）の埋め込みを許可する。
      // script-src は 'self' のまま＝外部スクリプトは実行させない（K-S6-001）。
      frameExtra: [cfg2.turnstileFrameOrigin].filter(Boolean)
    });
    await new Promise((resolve, reject) => {
      const ch = new MessageChannel();
      const timer = setTimeout(() => reject(new Error("SW did not confirm manifest install")), 5e3);
      navigator.serviceWorker.addEventListener("message", function onMsg(ev) {
        if (ev.data?.type === "MANIFEST_INSTALLED") {
          clearTimeout(timer);
          navigator.serviceWorker.removeEventListener("message", onMsg);
          resolve(ev.data);
        }
      });
      sw.postMessage({ type: "INSTALL_MANIFEST", manifest, bundleOrigin: cfg2.bundleOrigin, csp }, [ch.port2]);
    });
    window.location.assign(appEntry);
  }
  function defaultConnectExtra(cfg2) {
    const list = [];
    if (cfg2.r2Base) list.push(cfg2.r2Base);
    list.push("https://*.workers.dev", "wss://*", "https://*");
    return list;
  }

  // src/loader/app.js
  var $ = (id) => document.getElementById(id);
  var cfg = loadConfig();
  var lang = pickLang(cfg.lang);
  var tr = t(lang);
  function statusMessage(res) {
    switch (res.status) {
      case LoaderStatus.OK:
        return { kind: "ok", msg: tr("loader.ok", { buildVersion: res.buildVersion }) };
      case LoaderStatus.NO_HASH_REGISTERED:
        return { kind: "warn", msg: tr("loader.fail.no_hash") };
      case LoaderStatus.RPC_FAIL:
        return { kind: "fail", msg: tr("loader.fail.rpc") };
      case LoaderStatus.FETCH_FAIL:
        return { kind: "fail", msg: tr("loader.fail.fetch") };
      case LoaderStatus.MAINTENANCE:
        return { kind: "warn", msg: tr("loader.fail.maintenance") };
      case LoaderStatus.MANIFEST_INVALID:
        return { kind: "fail", msg: tr("loader.fail.manifest_invalid") };
      case LoaderStatus.MANIFEST_HASH_MISMATCH:
        return { kind: "fail", msg: tr("loader.fail.manifest_mismatch") };
      case LoaderStatus.FILE_HASH_MISMATCH:
        return { kind: "fail", msg: tr("loader.fail.file_mismatch", { count: res.count }) };
      default:
        return { kind: "fail", msg: `${res.status}: ${res.error || ""}` };
    }
  }
  function render() {
    tr = t(lang);
    $("title").textContent = tr("app.title");
    $("subtitle").textContent = tr("app.subtitle");
    $("h-loader").textContent = tr("entry.loader");
    $("desc-loader").textContent = tr("entry.loader.desc");
    $("rpc-label").textContent = tr("loader.rpc");
    $("verify-btn").textContent = tr("entry.loader");
    $("guarantee").textContent = tr("loader.guarantee");
    $("recovery-link").textContent = tr("entry.recovery");
  }
  function setStage(stage, extra) {
    const map = {
      reading: tr("loader.reading"),
      fetching: tr("loader.fetching"),
      verifying: tr("loader.verifying", { done: extra?.done ?? 0, total: extra?.total ?? 0 })
    };
    $("stage").textContent = map[stage] || "";
  }
  async function onVerify() {
    $("result").textContent = "";
    $("launch-area").innerHTML = "";
    const rpcSel = $("rpc-select").value;
    cfg.rpcUrls = rpcSel === "all" ? resolveRpcUrls(cfg) : [rpcSel];
    saveConfig({ rpcUrls: cfg.rpcUrls, lang });
    let res;
    try {
      res = await runLoaderVerification(cfg, { onStage: setStage });
    } catch (e) {
      res = { status: "RPC_FAIL", error: String(e?.message || e) };
    }
    $("stage").textContent = "";
    const { kind, msg } = statusMessage(res);
    const box = $("result");
    box.className = `result ${kind}`;
    box.textContent = msg;
    if (res.status === LoaderStatus.OK) {
      if (res.warns?.some((w) => w.code === "REREGISTERED")) {
        const w = res.warns.find((x) => x.code === "REREGISTERED");
        const warnEl = document.createElement("div");
        warnEl.className = "result warn";
        warnEl.textContent = tr("loader.warn.reregistered", { registrationCount: w.registrationCount });
        box.after(warnEl);
      }
      const btn = document.createElement("button");
      btn.textContent = tr("loader.launch");
      btn.onclick = () => launchVerifiedApp(cfg, res.manifest).catch((e) => {
        $("result").textContent = String(e?.message || e);
      });
      $("launch-area").appendChild(btn);
    } else {
      const link = document.createElement("a");
      link.href = "./recovery.html";
      link.textContent = tr("loader.togo_recovery");
      link.className = "togo";
      $("launch-area").appendChild(link);
    }
  }
  function init() {
    const langSel = $("lang-select");
    for (const l of SUPPORTED_LANGS) {
      const o = document.createElement("option");
      o.value = l;
      o.textContent = t(l)("lang.name");
      if (l === lang) o.selected = true;
      langSel.appendChild(o);
    }
    langSel.onchange = () => {
      lang = langSel.value;
      render();
    };
    const rpcSel = $("rpc-select");
    for (const p of cfg.rpcPresets) {
      const o = document.createElement("option");
      o.value = p.url;
      o.textContent = `${p.name} (${p.url})`;
      rpcSel.appendChild(o);
    }
    const all = document.createElement("option");
    all.value = "all";
    all.textContent = "all presets (fallback)";
    rpcSel.appendChild(all);
    $("verify-btn").onclick = onVerify;
    render();
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})();
