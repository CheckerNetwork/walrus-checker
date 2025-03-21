// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function A(e) {
    return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function V(e, r1) {
    return Array.isArray(r1) ? r1.length === 0 ? !0 : e ? r1.every((n)=>typeof n == "string") : r1.every((n)=>Number.isSafeInteger(n)) : !1;
}
function D(e) {
    if (typeof e != "function") throw new Error("function expected");
    return !0;
}
function v(e, r1) {
    if (typeof r1 != "string") throw new Error(`${e}: string expected`);
    return !0;
}
function E(e) {
    if (!Number.isSafeInteger(e)) throw new Error(`invalid integer: ${e}`);
}
function R(e) {
    if (!Array.isArray(e)) throw new Error("array expected");
}
function B(e, r1) {
    if (!V(!0, r1)) throw new Error(`${e}: array of strings expected`);
}
function M(e, r1) {
    if (!V(!1, r1)) throw new Error(`${e}: array of numbers expected`);
}
function f(...e) {
    let r1 = (o)=>o, n = (o, s)=>(i)=>o(s(i)), c = e.map((o)=>o.encode).reduceRight(n, r1), t = e.map((o)=>o.decode).reduce(n, r1);
    return {
        encode: c,
        decode: t
    };
}
function u(e) {
    let r1 = typeof e == "string" ? e.split("") : e, n = r1.length;
    B("alphabet", r1);
    let c = new Map(r1.map((t, o)=>[
            t,
            o
        ]));
    return {
        encode: (t)=>(R(t), t.map((o)=>{
                if (!Number.isSafeInteger(o) || o < 0 || o >= n) throw new Error(`alphabet.encode: digit index outside alphabet "${o}". Allowed: ${e}`);
                return r1[o];
            })),
        decode: (t)=>(R(t), t.map((o)=>{
                v("alphabet.decode", o);
                let s = c.get(o);
                if (s === void 0) throw new Error(`Unknown letter: "${o}". Allowed: ${e}`);
                return s;
            }))
    };
}
function h(e = "") {
    return v("join", e), {
        encode: (r1)=>(B("join.decode", r1), r1.join(e)),
        decode: (r1)=>(v("join.decode", r1), r1.split(e))
    };
}
function C(e, r1 = "=") {
    return E(e), v("padding", r1), {
        encode (n) {
            for(B("padding.encode", n); n.length * e % 8;)n.push(r1);
            return n;
        },
        decode (n) {
            B("padding.decode", n);
            let c = n.length;
            if (c * e % 8) throw new Error("padding: invalid, string should have whole number of bytes");
            for(; c > 0 && n[c - 1] === r1; c--)if ((c - 1) * e % 8 === 0) throw new Error("padding: invalid, string has too much padding");
            return n.slice(0, c);
        }
    };
}
function J(e) {
    return D(e), {
        encode: (r1)=>r1,
        decode: (r1)=>e(r1)
    };
}
function I(e, r1, n) {
    if (r1 < 2) throw new Error(`convertRadix: invalid from=${r1}, base cannot be less than 2`);
    if (n < 2) throw new Error(`convertRadix: invalid to=${n}, base cannot be less than 2`);
    if (R(e), !e.length) return [];
    let c = 0, t = [], o = Array.from(e, (i)=>{
        if (E(i), i < 0 || i >= r1) throw new Error(`invalid integer: ${i}`);
        return i;
    }), s = o.length;
    for(;;){
        let i = 0, g = !0;
        for(let p = c; p < s; p++){
            let y = o[p], a1 = r1 * i, d = a1 + y;
            if (!Number.isSafeInteger(d) || a1 / r1 !== i || d - y !== a1) throw new Error("convertRadix: carry overflow");
            let x = d / n;
            i = d % n;
            let l = Math.floor(x);
            if (o[p] = l, !Number.isSafeInteger(l) || l * n + i !== d) throw new Error("convertRadix: carry overflow");
            if (g) l ? g = !1 : c = p;
            else continue;
        }
        if (t.push(i), g) break;
    }
    for(let i = 0; i < e.length - 1 && e[i] === 0; i++)t.push(0);
    return t.reverse();
}
var Q = (e, r1)=>r1 === 0 ? e : Q(r1, e % r1), U = (e, r1)=>e + (r1 - Q(e, r1)), k = (()=>{
    let e = [];
    for(let r1 = 0; r1 < 40; r1++)e.push(2 ** r1);
    return e;
})();
function N(e, r1, n, c) {
    if (R(e), r1 <= 0 || r1 > 32) throw new Error(`convertRadix2: wrong from=${r1}`);
    if (n <= 0 || n > 32) throw new Error(`convertRadix2: wrong to=${n}`);
    if (U(r1, n) > 32) throw new Error(`convertRadix2: carry overflow from=${r1} to=${n} carryBits=${U(r1, n)}`);
    let t = 0, o = 0, s = k[r1], i = k[n] - 1, g = [];
    for (let p of e){
        if (E(p), p >= s) throw new Error(`convertRadix2: invalid data word=${p} from=${r1}`);
        if (t = t << r1 | p, o + r1 > 32) throw new Error(`convertRadix2: carry overflow pos=${o} from=${r1}`);
        for(o += r1; o >= n; o -= n)g.push((t >> o - n & i) >>> 0);
        let y = k[o];
        if (y === void 0) throw new Error("invalid carry");
        t &= y - 1;
    }
    if (t = t << n - o & i, !c && o >= r1) throw new Error("Excess padding");
    if (!c && t > 0) throw new Error(`Non-zero padding: ${t}`);
    return c && o > 0 && g.push(t >>> 0), g;
}
function X(e) {
    E(e);
    let r1 = 2 ** 8;
    return {
        encode: (n)=>{
            if (!A(n)) throw new Error("radix.encode input should be Uint8Array");
            return I(Array.from(n), r1, e);
        },
        decode: (n)=>(M("radix.decode", n), Uint8Array.from(I(n, e, r1)))
    };
}
function w(e, r1 = !1) {
    if (E(e), e <= 0 || e > 32) throw new Error("radix2: bits should be in (0..32]");
    if (U(8, e) > 32 || U(e, 8) > 32) throw new Error("radix2: carry overflow");
    return {
        encode: (n)=>{
            if (!A(n)) throw new Error("radix2.encode input should be Uint8Array");
            return N(Array.from(n), 8, e, !r1);
        },
        decode: (n)=>(M("radix2.decode", n), Uint8Array.from(N(n, e, 8, r1)))
    };
}
function F(e) {
    return D(e), function(...r1) {
        try {
            return e.apply(null, r1);
        } catch  {}
    };
}
var _ = f(w(4), u("0123456789ABCDEF"), h("")), q = f(w(5), u("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), C(5), h("")), fe = f(w(5), u("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), h("")), ue = f(w(5), u("0123456789ABCDEFGHIJKLMNOPQRSTUV"), C(5), h("")), he = f(w(5), u("0123456789ABCDEFGHIJKLMNOPQRSTUV"), h("")), le = f(w(5), u("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), h(""), J((e)=>e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1"))), ee = f(w(6), u("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), C(6), h("")), we = f(w(6), u("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), h("")), re = f(w(6), u("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), C(6), h("")), pe = f(w(6), u("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), h("")), P = (e)=>f(X(58), u(e), h("")), S = P("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), xe = P("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), ge = P("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"), O = f(u("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), h("")), H = [
    996825010,
    642813549,
    513874426,
    1027748829,
    705979059
];
function T(e) {
    let r1 = e >> 25, n = (e & 33554431) << 5;
    for(let c = 0; c < H.length; c++)(r1 >> c & 1) === 1 && (n ^= H[c]);
    return n;
}
function K(e, r1, n = 1) {
    let c = e.length, t = 1;
    for(let o = 0; o < c; o++){
        let s = e.charCodeAt(o);
        if (s < 33 || s > 126) throw new Error(`Invalid prefix (${e})`);
        t = T(t) ^ s >> 5;
    }
    t = T(t);
    for(let o = 0; o < c; o++)t = T(t) ^ e.charCodeAt(o) & 31;
    for (let o of r1)t = T(t) ^ o;
    for(let o = 0; o < 6; o++)t = T(t);
    return t ^= n, O.encode(N([
        t % k[30]
    ], 30, 5, !1));
}
function z(e) {
    let r1 = e === "bech32" ? 1 : 734539939, n = w(5), c = n.decode, t = n.encode, o = F(c);
    function s(a1, d, x = 90) {
        v("bech32.encode prefix", a1), A(d) && (d = Array.from(d)), M("bech32.encode", d);
        let l = a1.length;
        if (l === 0) throw new TypeError(`Invalid prefix length ${l}`);
        let b = l + 7 + d.length;
        if (x !== !1 && b > x) throw new TypeError(`Length ${b} exceeds limit ${x}`);
        let m = a1.toLowerCase(), $ = K(m, d, r1);
        return `${m}1${O.encode(d)}${$}`;
    }
    function i(a1, d = 90) {
        v("bech32.decode input", a1);
        let x = a1.length;
        if (x < 8 || d !== !1 && x > d) throw new TypeError(`invalid string length: ${x} (${a1}). Expected (8..${d})`);
        let l = a1.toLowerCase();
        if (a1 !== l && a1 !== a1.toUpperCase()) throw new Error("String must be lowercase or uppercase");
        let b = l.lastIndexOf("1");
        if (b === 0 || b === -1) throw new Error('Letter "1" must be present between prefix and data only');
        let m = l.slice(0, b), $ = l.slice(b + 1);
        if ($.length < 6) throw new Error("Data must be at least 6 characters long");
        let W = O.decode($).slice(0, -6), j = K(m, W, r1);
        if (!$.endsWith(j)) throw new Error(`Invalid checksum in ${a1}: expected "${j}"`);
        return {
            prefix: m,
            words: W
        };
    }
    let g = F(i);
    function p(a1) {
        let { prefix: d, words: x } = i(a1, !1);
        return {
            prefix: d,
            words: x,
            bytes: c(x)
        };
    }
    function y(a1, d) {
        return s(a1, t(d));
    }
    return {
        encode: s,
        decode: i,
        encodeFromBytes: y,
        decodeToBytes: p,
        decodeUnsafe: g,
        fromWords: c,
        fromWordsUnsafe: o,
        toWords: t
    };
}
z("bech32"), z("bech32m"), f(w(4), u("0123456789abcdef"), h(""), J((e)=>{
    if (typeof e != "string" || e.length % 2 !== 0) throw new TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
    return e.toLowerCase();
}));
var u1 = (r1)=>S.encode(r1), w1 = (r1)=>S.decode(r1);
function m(r1) {
    return Uint8Array.from(atob(r1), (e)=>e.charCodeAt(0));
}
var v1 = 8192;
function y(r1) {
    if (r1.length < v1) return btoa(String.fromCharCode(...r1));
    let e = "";
    for(var t = 0; t < r1.length; t += v1){
        let i = r1.slice(t, t + v1);
        e += String.fromCharCode(...i);
    }
    return btoa(e);
}
function p(r1) {
    let e = r1.startsWith("0x") ? r1.slice(2) : r1, t = e.length % 2 === 0 ? e : `0${e}`, i = t.match(/[0-9a-fA-F]{2}/g)?.map((n)=>parseInt(n, 16)) ?? [];
    if (i.length !== t.length / 2) throw new Error(`Invalid hex string ${r1}`);
    return Uint8Array.from(i);
}
function g(r1) {
    return r1.reduce((e, t)=>e + t.toString(16).padStart(2, "0"), "");
}
function c(r1) {
    let e = [], t = 0;
    if (r1 === 0) return [
        0
    ];
    for(; r1 > 0;)e[t] = r1 & 127, (r1 >>= 7) && (e[t] |= 128), t += 1;
    return e;
}
function _1(r1) {
    let e = 0, t = 0, i = 0;
    for(;;){
        let n = r1[i];
        if (i += 1, e |= (n & 127) << t, (n & 128) === 0) break;
        t += 7;
    }
    return {
        value: e,
        length: i
    };
}
var z1 = class {
    constructor(e){
        this.bytePosition = 0, this.dataView = new DataView(e.buffer);
    }
    shift(e) {
        return this.bytePosition += e, this;
    }
    read8() {
        let e = this.dataView.getUint8(this.bytePosition);
        return this.shift(1), e;
    }
    read16() {
        let e = this.dataView.getUint16(this.bytePosition, !0);
        return this.shift(2), e;
    }
    read32() {
        let e = this.dataView.getUint32(this.bytePosition, !0);
        return this.shift(4), e;
    }
    read64() {
        let e = this.read32(), i = this.read32().toString(16) + e.toString(16).padStart(8, "0");
        return BigInt("0x" + i).toString(10);
    }
    read128() {
        let e = BigInt(this.read64()), i = BigInt(this.read64()).toString(16) + e.toString(16).padStart(16, "0");
        return BigInt("0x" + i).toString(10);
    }
    read256() {
        let e = BigInt(this.read128()), i = BigInt(this.read128()).toString(16) + e.toString(16).padStart(32, "0");
        return BigInt("0x" + i).toString(10);
    }
    readBytes(e) {
        let t = this.bytePosition + this.dataView.byteOffset, i = new Uint8Array(this.dataView.buffer, t, e);
        return this.shift(e), i;
    }
    readULEB() {
        let e = this.bytePosition + this.dataView.byteOffset, t = new Uint8Array(this.dataView.buffer, e), { value: i, length: n } = _1(t);
        return this.shift(n), i;
    }
    readVec(e) {
        let t = this.readULEB(), i = [];
        for(let n = 0; n < t; n++)i.push(e(this, n, t));
        return i;
    }
};
function M1(r1, e) {
    switch(e){
        case "base58":
            return u1(r1);
        case "base64":
            return y(r1);
        case "hex":
            return g(r1);
        default:
            throw new Error("Unsupported encoding, supported values are: base64, hex");
    }
}
function Q1(r1, e = [
    "<",
    ">"
]) {
    let [t, i] = e, n = [], o = "", a1 = 0;
    for(let s = 0; s < r1.length; s++){
        let h = r1[s];
        if (h === t && a1++, h === i && a1--, a1 === 0 && h === ",") {
            n.push(o.trim()), o = "";
            continue;
        }
        o += h;
    }
    return n.push(o.trim()), n;
}
var E1 = class {
    constructor({ initialSize: e = 1024, maxSize: t = 1 / 0, allocateSize: i = 1024 } = {}){
        this.bytePosition = 0, this.size = e, this.maxSize = t, this.allocateSize = i, this.dataView = new DataView(new ArrayBuffer(e));
    }
    ensureSizeOrGrow(e) {
        let t = this.bytePosition + e;
        if (t > this.size) {
            let i = Math.min(this.maxSize, this.size + this.allocateSize);
            if (t > i) throw new Error(`Attempting to serialize to BCS, but buffer does not have enough size. Allocated size: ${this.size}, Max size: ${this.maxSize}, Required size: ${t}`);
            this.size = i;
            let n = new ArrayBuffer(this.size);
            new Uint8Array(n).set(new Uint8Array(this.dataView.buffer)), this.dataView = new DataView(n);
        }
    }
    shift(e) {
        return this.bytePosition += e, this;
    }
    write8(e) {
        return this.ensureSizeOrGrow(1), this.dataView.setUint8(this.bytePosition, Number(e)), this.shift(1);
    }
    write16(e) {
        return this.ensureSizeOrGrow(2), this.dataView.setUint16(this.bytePosition, Number(e), !0), this.shift(2);
    }
    write32(e) {
        return this.ensureSizeOrGrow(4), this.dataView.setUint32(this.bytePosition, Number(e), !0), this.shift(4);
    }
    write64(e) {
        return O1(BigInt(e), 8).forEach((t)=>this.write8(t)), this;
    }
    write128(e) {
        return O1(BigInt(e), 16).forEach((t)=>this.write8(t)), this;
    }
    write256(e) {
        return O1(BigInt(e), 32).forEach((t)=>this.write8(t)), this;
    }
    writeULEB(e) {
        return c(e).forEach((t)=>this.write8(t)), this;
    }
    writeVec(e, t) {
        return this.writeULEB(e.length), Array.from(e).forEach((i, n)=>t(this, i, n, e.length)), this;
    }
    *[Symbol.iterator]() {
        for(let e = 0; e < this.bytePosition; e++)yield this.dataView.getUint8(e);
        return this.toBytes();
    }
    toBytes() {
        return new Uint8Array(this.dataView.buffer.slice(0, this.bytePosition));
    }
    toString(e) {
        return M1(this.toBytes(), e);
    }
};
function O1(r1, e) {
    let t = new Uint8Array(e), i = 0;
    for(; r1 > 0;)t[i] = Number(r1 % BigInt(256)), r1 = r1 / BigInt(256), i += 1;
    return t;
}
var L = (r1)=>{
    throw TypeError(r1);
}, P1 = (r1, e, t)=>e.has(r1) || L("Cannot " + t), d = (r1, e, t)=>(P1(r1, e, "read from private field"), t ? t.call(r1) : e.get(r1)), $ = (r1, e, t)=>e.has(r1) ? L("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r1) : e.set(r1, t), T1 = (r1, e, t, i)=>(P1(r1, e, "write to private field"), i ? i.call(r1, t) : e.set(r1, t), t), B1, b, S1, f1, Y = class H {
    constructor(e){
        $(this, B1), $(this, b), this.name = e.name, this.read = e.read, this.serializedSize = e.serializedSize ?? (()=>null), T1(this, B1, e.write), T1(this, b, e.serialize ?? ((t, i)=>{
            let n = new E1({
                initialSize: this.serializedSize(t) ?? void 0,
                ...i
            });
            return d(this, B1).call(this, t, n), n.toBytes();
        })), this.validate = e.validate ?? (()=>{});
    }
    write(e, t) {
        this.validate(e), d(this, B1).call(this, e, t);
    }
    serialize(e, t) {
        return this.validate(e), new U1(this, d(this, b).call(this, e, t));
    }
    parse(e) {
        let t = new z1(e);
        return this.read(t);
    }
    fromHex(e) {
        return this.parse(p(e));
    }
    fromBase58(e) {
        return this.parse(w1(e));
    }
    fromBase64(e) {
        return this.parse(m(e));
    }
    transform({ name: e, input: t, output: i, validate: n }) {
        return new H({
            name: e ?? this.name,
            read: (o)=>i ? i(this.read(o)) : this.read(o),
            write: (o, a1)=>d(this, B1).call(this, t ? t(o) : o, a1),
            serializedSize: (o)=>this.serializedSize(t ? t(o) : o),
            serialize: (o, a1)=>d(this, b).call(this, t ? t(o) : o, a1),
            validate: (o)=>{
                n?.(o), this.validate(t ? t(o) : o);
            }
        });
    }
};
B1 = new WeakMap;
b = new WeakMap;
var l = Y, C1 = Symbol.for("@mysten/serialized-bcs");
function ee1(r1) {
    return !!r1 && typeof r1 == "object" && r1[C1] === !0;
}
var U1 = class {
    constructor(e, t){
        $(this, S1), $(this, f1), T1(this, S1, e), T1(this, f1, t);
    }
    get [C1]() {
        return !0;
    }
    toBytes() {
        return d(this, f1);
    }
    toHex() {
        return g(d(this, f1));
    }
    toBase64() {
        return y(d(this, f1));
    }
    toBase58() {
        return u1(d(this, f1));
    }
    parse() {
        return d(this, S1).parse(d(this, f1));
    }
};
S1 = new WeakMap;
f1 = new WeakMap;
function x({ size: r1, ...e }) {
    return new l({
        ...e,
        serializedSize: ()=>r1
    });
}
function V1({ readMethod: r1, writeMethod: e, ...t }) {
    return x({
        ...t,
        read: (i)=>i[r1](),
        write: (i, n)=>n[e](i),
        validate: (i)=>{
            if (i < 0 || i > t.maxValue) throw new TypeError(`Invalid ${t.name} value: ${i}. Expected value in range 0-${t.maxValue}`);
            t.validate?.(i);
        }
    });
}
function A1({ readMethod: r1, writeMethod: e, ...t }) {
    return x({
        ...t,
        read: (i)=>i[r1](),
        write: (i, n)=>n[e](BigInt(i)),
        validate: (i)=>{
            let n = BigInt(i);
            if (n < 0 || n > t.maxValue) throw new TypeError(`Invalid ${t.name} value: ${n}. Expected value in range 0-${t.maxValue}`);
            t.validate?.(n);
        }
    });
}
function j({ serialize: r1, ...e }) {
    let t = new l({
        ...e,
        serialize: r1,
        write: (i, n)=>{
            for (let o of t.serialize(i).toBytes())n.write8(o);
        }
    });
    return t;
}
function N1({ toBytes: r1, fromBytes: e, ...t }) {
    return new l({
        ...t,
        read: (i)=>{
            let n = i.readULEB(), o = i.readBytes(n);
            return e(o);
        },
        write: (i, n)=>{
            let o = r1(i);
            n.writeULEB(o.length);
            for(let a1 = 0; a1 < o.length; a1++)n.write8(o[a1]);
        },
        serialize: (i)=>{
            let n = r1(i), o = c(n.length), a1 = new Uint8Array(o.length + n.length);
            return a1.set(o, 0), a1.set(n, o.length), a1;
        },
        validate: (i)=>{
            if (typeof i != "string") throw new TypeError(`Invalid ${t.name} value: ${i}. Expected string`);
            t.validate?.(i);
        }
    });
}
function D1(r1) {
    let e = null;
    function t() {
        return e || (e = r1()), e;
    }
    return new l({
        name: "lazy",
        read: (i)=>t().read(i),
        serializedSize: (i)=>t().serializedSize(i),
        write: (i, n)=>t().write(i, n),
        serialize: (i, n)=>t().serialize(i, n).toBytes()
    });
}
var I1 = {
    u8 (r1) {
        return V1({
            name: "u8",
            readMethod: "read8",
            writeMethod: "write8",
            size: 1,
            maxValue: 2 ** 8 - 1,
            ...r1
        });
    },
    u16 (r1) {
        return V1({
            name: "u16",
            readMethod: "read16",
            writeMethod: "write16",
            size: 2,
            maxValue: 2 ** 16 - 1,
            ...r1
        });
    },
    u32 (r1) {
        return V1({
            name: "u32",
            readMethod: "read32",
            writeMethod: "write32",
            size: 4,
            maxValue: 2 ** 32 - 1,
            ...r1
        });
    },
    u64 (r1) {
        return A1({
            name: "u64",
            readMethod: "read64",
            writeMethod: "write64",
            size: 8,
            maxValue: 2n ** 64n - 1n,
            ...r1
        });
    },
    u128 (r1) {
        return A1({
            name: "u128",
            readMethod: "read128",
            writeMethod: "write128",
            size: 16,
            maxValue: 2n ** 128n - 1n,
            ...r1
        });
    },
    u256 (r1) {
        return A1({
            name: "u256",
            readMethod: "read256",
            writeMethod: "write256",
            size: 32,
            maxValue: 2n ** 256n - 1n,
            ...r1
        });
    },
    bool (r1) {
        return x({
            name: "bool",
            size: 1,
            read: (e)=>e.read8() === 1,
            write: (e, t)=>t.write8(e ? 1 : 0),
            ...r1,
            validate: (e)=>{
                if (r1?.validate?.(e), typeof e != "boolean") throw new TypeError(`Expected boolean, found ${typeof e}`);
            }
        });
    },
    uleb128 (r1) {
        return j({
            name: "uleb128",
            read: (e)=>e.readULEB(),
            serialize: (e)=>Uint8Array.from(c(e)),
            ...r1
        });
    },
    bytes (r1, e) {
        return x({
            name: `bytes[${r1}]`,
            size: r1,
            read: (t)=>t.readBytes(r1),
            write: (t, i)=>{
                let n = new Uint8Array(t);
                for(let o = 0; o < r1; o++)i.write8(n[o] ?? 0);
            },
            ...e,
            validate: (t)=>{
                if (e?.validate?.(t), !t || typeof t != "object" || !("length" in t)) throw new TypeError(`Expected array, found ${typeof t}`);
                if (t.length !== r1) throw new TypeError(`Expected array of length ${r1}, found ${t.length}`);
            }
        });
    },
    byteVector (r1) {
        return new l({
            name: "bytesVector",
            read: (e)=>{
                let t = e.readULEB();
                return e.readBytes(t);
            },
            write: (e, t)=>{
                let i = new Uint8Array(e);
                t.writeULEB(i.length);
                for(let n = 0; n < i.length; n++)t.write8(i[n] ?? 0);
            },
            ...r1,
            serializedSize: (e)=>{
                let t = "length" in e ? e.length : null;
                return t == null ? null : c(t).length + t;
            },
            validate: (e)=>{
                if (r1?.validate?.(e), !e || typeof e != "object" || !("length" in e)) throw new TypeError(`Expected array, found ${typeof e}`);
            }
        });
    },
    string (r1) {
        return N1({
            name: "string",
            toBytes: (e)=>new TextEncoder().encode(e),
            fromBytes: (e)=>new TextDecoder().decode(e),
            ...r1
        });
    },
    fixedArray (r1, e, t) {
        return new l({
            name: `${e.name}[${r1}]`,
            read: (i)=>{
                let n = new Array(r1);
                for(let o = 0; o < r1; o++)n[o] = e.read(i);
                return n;
            },
            write: (i, n)=>{
                for (let o of i)e.write(o, n);
            },
            ...t,
            validate: (i)=>{
                if (t?.validate?.(i), !i || typeof i != "object" || !("length" in i)) throw new TypeError(`Expected array, found ${typeof i}`);
                if (i.length !== r1) throw new TypeError(`Expected array of length ${r1}, found ${i.length}`);
            }
        });
    },
    option (r1) {
        return I1.enum(`Option<${r1.name}>`, {
            None: null,
            Some: r1
        }).transform({
            input: (e)=>e == null ? {
                    None: !0
                } : {
                    Some: e
                },
            output: (e)=>e.$kind === "Some" ? e.Some : null
        });
    },
    vector (r1, e) {
        return new l({
            name: `vector<${r1.name}>`,
            read: (t)=>{
                let i = t.readULEB(), n = new Array(i);
                for(let o = 0; o < i; o++)n[o] = r1.read(t);
                return n;
            },
            write: (t, i)=>{
                i.writeULEB(t.length);
                for (let n of t)r1.write(n, i);
            },
            ...e,
            validate: (t)=>{
                if (e?.validate?.(t), !t || typeof t != "object" || !("length" in t)) throw new TypeError(`Expected array, found ${typeof t}`);
            }
        });
    },
    tuple (r1, e) {
        return new l({
            name: `(${r1.map((t)=>t.name).join(", ")})`,
            serializedSize: (t)=>{
                let i = 0;
                for(let n = 0; n < r1.length; n++){
                    let o = r1[n].serializedSize(t[n]);
                    if (o == null) return null;
                    i += o;
                }
                return i;
            },
            read: (t)=>{
                let i = [];
                for (let n of r1)i.push(n.read(t));
                return i;
            },
            write: (t, i)=>{
                for(let n = 0; n < r1.length; n++)r1[n].write(t[n], i);
            },
            ...e,
            validate: (t)=>{
                if (e?.validate?.(t), !Array.isArray(t)) throw new TypeError(`Expected array, found ${typeof t}`);
                if (t.length !== r1.length) throw new TypeError(`Expected array of length ${r1.length}, found ${t.length}`);
            }
        });
    },
    struct (r1, e, t) {
        let i = Object.entries(e);
        return new l({
            name: r1,
            serializedSize: (n)=>{
                let o = 0;
                for (let [a1, s] of i){
                    let h = s.serializedSize(n[a1]);
                    if (h == null) return null;
                    o += h;
                }
                return o;
            },
            read: (n)=>{
                let o = {};
                for (let [a1, s] of i)o[a1] = s.read(n);
                return o;
            },
            write: (n, o)=>{
                for (let [a1, s] of i)s.write(n[a1], o);
            },
            ...t,
            validate: (n)=>{
                if (t?.validate?.(n), typeof n != "object" || n == null) throw new TypeError(`Expected object, found ${typeof n}`);
            }
        });
    },
    enum (r1, e, t) {
        let i = Object.entries(e);
        return new l({
            name: r1,
            read: (n)=>{
                let o = n.readULEB(), a1 = i[o];
                if (!a1) throw new TypeError(`Unknown value ${o} for enum ${r1}`);
                let [s, h] = a1;
                return {
                    [s]: h?.read(n) ?? !0,
                    $kind: s
                };
            },
            write: (n, o)=>{
                let [a1, s] = Object.entries(n).filter(([h])=>Object.hasOwn(e, h))[0];
                for(let h = 0; h < i.length; h++){
                    let [G, W] = i[h];
                    if (G === a1) {
                        o.writeULEB(h), W?.write(s, o);
                        return;
                    }
                }
            },
            ...t,
            validate: (n)=>{
                if (t?.validate?.(n), typeof n != "object" || n == null) throw new TypeError(`Expected object, found ${typeof n}`);
                let o = Object.keys(n).filter((s)=>n[s] !== void 0 && Object.hasOwn(e, s));
                if (o.length !== 1) throw new TypeError(`Expected object with one key, but found ${o.length} for type ${r1}}`);
                let [a1] = o;
                if (!Object.hasOwn(e, a1)) throw new TypeError(`Invalid enum variant ${a1}`);
            }
        });
    },
    map (r1, e) {
        return I1.vector(I1.tuple([
            r1,
            e
        ])).transform({
            name: `Map<${r1.name}, ${e.name}>`,
            input: (t)=>[
                    ...t.entries()
                ],
            output: (t)=>{
                let i = new Map;
                for (let [n, o] of t)i.set(n, o);
                return i;
            }
        });
    },
    lazy (r1) {
        return D1(r1);
    }
};
var l1 = 32;
function p1(t) {
    try {
        return w1(t).length === l1;
    } catch  {
        return !1;
    }
}
var c1 = 32;
function m1(t) {
    return h1(t) && x1(t) === c1;
}
function $1(t) {
    return m1(t);
}
function g1(t) {
    return t.includes("::") ? a1(t) : t;
}
function a1(t) {
    let [e, r1] = t.split("::"), n = t.slice(e.length + r1.length + 4), i = n.includes("<") ? n.slice(0, n.indexOf("<")) : n, o = n.includes("<") ? Q1(n.slice(n.indexOf("<") + 1, n.lastIndexOf(">"))).map((s)=>g1(s.trim())) : [];
    return {
        address: u2(e),
        module: r1,
        name: i,
        typeParams: o
    };
}
function S2(t) {
    let { address: e, module: r1, name: n, typeParams: i } = typeof t == "string" ? a1(t) : t, o = i?.length > 0 ? `<${i.map((s)=>typeof s == "string" ? s : S2(s)).join(",")}>` : "";
    return `${e}::${r1}::${n}${o}`;
}
function u2(t, e = !1) {
    let r1 = t.toLowerCase();
    return !e && r1.startsWith("0x") && (r1 = r1.slice(2)), `0x${r1.padStart(c1 * 2, "0")}`;
}
function I2(t, e = !1) {
    return u2(t, e);
}
function h1(t) {
    return /^(0x|0X)?[a-fA-F0-9]+$/.test(t) && t.length % 2 === 0;
}
function x1(t) {
    return /^(0x|0X)/.test(t) ? (t.length - 2) / 2 : t.length / 2;
}
var n = /^(?!.*(^(?!@)|[-.@])($|[-.@]))(?:[a-z0-9-]{0,63}(?:\.[a-z0-9-]{0,63})*)?@[a-z0-9-]{0,63}$/i, r1 = /^(?!.*(^|[-.])($|[-.]))(?:[a-z0-9-]{0,63}\.)+sui$/i;
function S3(t, o = "at") {
    let e = t.toLowerCase(), i;
    if (e.includes("@")) {
        if (!n.test(e)) throw new Error(`Invalid SuiNS name ${t}`);
        let [s, l] = e.split("@");
        i = [
            ...s ? s.split(".") : [],
            l
        ];
    } else {
        if (!r1.test(e)) throw new Error(`Invalid SuiNS name ${t}`);
        i = e.split(".").slice(0, -1);
    }
    return o === "dot" ? `${i.join(".")}.sui` : `${i.slice(0, -1).join(".")}@${i[i.length - 1]}`;
}
var l2 = /^vector<(.+)>$/, c2 = /^([^:]+)::([^:]+)::([^<]+)(<(.+)>)?/, i = class t {
    static parseFromStr(r1, e = !1) {
        if (r1 === "address") return {
            address: null
        };
        if (r1 === "bool") return {
            bool: null
        };
        if (r1 === "u8") return {
            u8: null
        };
        if (r1 === "u16") return {
            u16: null
        };
        if (r1 === "u32") return {
            u32: null
        };
        if (r1 === "u64") return {
            u64: null
        };
        if (r1 === "u128") return {
            u128: null
        };
        if (r1 === "u256") return {
            u256: null
        };
        if (r1 === "signer") return {
            signer: null
        };
        let n = r1.match(l2);
        if (n) return {
            vector: t.parseFromStr(n[1], e)
        };
        let u = r1.match(c2);
        if (u) return {
            struct: {
                address: e ? u2(u[1]) : u[1],
                module: u[2],
                name: u[3],
                typeParams: u[5] === void 0 ? [] : t.parseStructTypeArgs(u[5], e)
            }
        };
        throw new Error(`Encountered unexpected token when parsing type args for ${r1}`);
    }
    static parseStructTypeArgs(r1, e = !1) {
        return Q1(r1).map((n)=>t.parseFromStr(n, e));
    }
    static tagToString(r1) {
        if ("bool" in r1) return "bool";
        if ("u8" in r1) return "u8";
        if ("u16" in r1) return "u16";
        if ("u32" in r1) return "u32";
        if ("u64" in r1) return "u64";
        if ("u128" in r1) return "u128";
        if ("u256" in r1) return "u256";
        if ("address" in r1) return "address";
        if ("signer" in r1) return "signer";
        if ("vector" in r1) return `vector<${t.tagToString(r1.vector)}>`;
        if ("struct" in r1) {
            let e = r1.struct, n = e.typeParams.map(t.tagToString).join(", ");
            return `${e.address}::${e.module}::${e.name}${n ? `<${n}>` : ""}`;
        }
        throw new Error("Invalid TypeTag");
    }
};
function y1(e) {
    return I1.u64({
        name: "unsafe_u64",
        ...e
    }).transform({
        input: (o)=>o,
        output: (o)=>Number(o)
    });
}
function v2(e) {
    return I1.enum("Option", {
        None: null,
        Some: e
    });
}
var r2 = I1.bytes(c1).transform({
    validate: (e)=>{
        let o = typeof e == "string" ? e : g(e);
        if (!o || !m1(u2(o))) throw new Error(`Invalid Sui address ${o}`);
    },
    input: (e)=>typeof e == "string" ? p(u2(e)) : e,
    output: (e)=>u2(g(e))
}), A2 = I1.vector(I1.u8()).transform({
    name: "ObjectDigest",
    input: (e)=>w1(e),
    output: (e)=>u1(new Uint8Array(e)),
    validate: (e)=>{
        if (w1(e).length !== 32) throw new Error("ObjectDigest must be 32 bytes");
    }
}), i1 = I1.struct("SuiObjectRef", {
    objectId: r2,
    version: I1.u64(),
    digest: A2
}), T2 = I1.struct("SharedObjectRef", {
    objectId: r2,
    initialSharedVersion: I1.u64(),
    mutable: I1.bool()
}), M2 = I1.enum("ObjectArg", {
    ImmOrOwnedObject: i1,
    SharedObject: T2,
    Receiving: i1
}), h2 = I1.enum("CallArg", {
    Pure: I1.struct("Pure", {
        bytes: I1.vector(I1.u8()).transform({
            input: (e)=>typeof e == "string" ? m(e) : e,
            output: (e)=>y(new Uint8Array(e))
        })
    }),
    Object: M2
}), c3 = I1.enum("TypeTag", {
    bool: null,
    u8: null,
    u64: null,
    u128: null,
    address: null,
    signer: null,
    vector: I1.lazy(()=>c3),
    struct: I1.lazy(()=>k1),
    u16: null,
    u32: null,
    u256: null
}), g2 = c3.transform({
    input: (e)=>typeof e == "string" ? i.parseFromStr(e, !0) : e,
    output: (e)=>i.tagToString(e)
}), n1 = I1.enum("Argument", {
    GasCoin: null,
    Input: I1.u16(),
    Result: I1.u16(),
    NestedResult: I1.tuple([
        I1.u16(),
        I1.u16()
    ])
}), D2 = I1.struct("ProgrammableMoveCall", {
    package: r2,
    module: I1.string(),
    function: I1.string(),
    typeArguments: I1.vector(g2),
    arguments: I1.vector(n1)
}), P2 = I1.enum("Command", {
    MoveCall: D2,
    TransferObjects: I1.struct("TransferObjects", {
        objects: I1.vector(n1),
        address: n1
    }),
    SplitCoins: I1.struct("SplitCoins", {
        coin: n1,
        amounts: I1.vector(n1)
    }),
    MergeCoins: I1.struct("MergeCoins", {
        destination: n1,
        sources: I1.vector(n1)
    }),
    Publish: I1.struct("Publish", {
        modules: I1.vector(I1.vector(I1.u8()).transform({
            input: (e)=>typeof e == "string" ? m(e) : e,
            output: (e)=>y(new Uint8Array(e))
        })),
        dependencies: I1.vector(r2)
    }),
    MakeMoveVec: I1.struct("MakeMoveVec", {
        type: v2(g2).transform({
            input: (e)=>e === null ? {
                    None: !0
                } : {
                    Some: e
                },
            output: (e)=>e.Some ?? null
        }),
        elements: I1.vector(n1)
    }),
    Upgrade: I1.struct("Upgrade", {
        modules: I1.vector(I1.vector(I1.u8()).transform({
            input: (e)=>typeof e == "string" ? m(e) : e,
            output: (e)=>y(new Uint8Array(e))
        })),
        dependencies: I1.vector(r2),
        package: r2,
        ticket: n1
    })
}), C2 = I1.struct("ProgrammableTransaction", {
    inputs: I1.vector(h2),
    commands: I1.vector(P2)
}), I3 = I1.enum("TransactionKind", {
    ProgrammableTransaction: C2,
    ChangeEpoch: null,
    Genesis: null,
    ConsensusCommitPrologue: null
}), j1 = I1.enum("TransactionExpiration", {
    None: null,
    Epoch: y1()
}), k1 = I1.struct("StructTag", {
    address: r2,
    module: I1.string(),
    name: I1.string(),
    typeParams: I1.vector(c3)
}), O2 = I1.struct("GasData", {
    payment: I1.vector(i1),
    owner: r2,
    price: I1.u64(),
    budget: I1.u64()
}), x2 = I1.struct("TransactionDataV1", {
    kind: I3,
    sender: r2,
    gasData: O2,
    expiration: j1
}), w2 = I1.enum("TransactionData", {
    V1: x2
}), E2 = I1.enum("IntentScope", {
    TransactionData: null,
    TransactionEffects: null,
    CheckpointSummary: null,
    PersonalMessage: null
}), V2 = I1.enum("IntentVersion", {
    V0: null
}), R1 = I1.enum("AppId", {
    Sui: null
}), U2 = I1.struct("Intent", {
    scope: E2,
    version: V2,
    appId: R1
});
function K1(e) {
    return I1.struct(`IntentMessage<${e.name}>`, {
        intent: U2,
        value: e
    });
}
var N2 = I1.enum("CompressedSignature", {
    ED25519: I1.fixedArray(64, I1.u8()),
    Secp256k1: I1.fixedArray(64, I1.u8()),
    Secp256r1: I1.fixedArray(64, I1.u8()),
    ZkLogin: I1.vector(I1.u8())
}), _2 = I1.enum("PublicKey", {
    ED25519: I1.fixedArray(32, I1.u8()),
    Secp256k1: I1.fixedArray(33, I1.u8()),
    Secp256r1: I1.fixedArray(33, I1.u8()),
    ZkLogin: I1.vector(I1.u8())
}), G = I1.struct("MultiSigPkMap", {
    pubKey: _2,
    weight: I1.u8()
}), z2 = I1.struct("MultiSigPublicKey", {
    pk_map: I1.vector(G),
    threshold: I1.u16()
}), F1 = I1.struct("MultiSig", {
    sigs: I1.vector(N2),
    bitmap: I1.u16(),
    multisig_pk: z2
}), B2 = I1.vector(I1.u8()).transform({
    input: (e)=>typeof e == "string" ? m(e) : e,
    output: (e)=>y(new Uint8Array(e))
}), H1 = I1.struct("SenderSignedTransaction", {
    intentMessage: K1(w2),
    txSignatures: I1.vector(B2)
}), J1 = I1.vector(H1, {
    name: "SenderSignedData"
}), q1 = I1.struct("PasskeyAuthenticator", {
    authenticatorData: I1.vector(I1.u8()),
    clientDataJson: I1.string(),
    userSignature: I1.vector(I1.u8())
});
function n2(e) {
    switch(e){
        case "u8":
            return I1.u8();
        case "u16":
            return I1.u16();
        case "u32":
            return I1.u32();
        case "u64":
            return I1.u64();
        case "u128":
            return I1.u128();
        case "u256":
            return I1.u256();
        case "bool":
            return I1.bool();
        case "string":
            return I1.string();
        case "id":
        case "address":
            return r2;
    }
    let t = e.match(/^(vector|option)<(.+)>$/);
    if (t) {
        let [c, u] = t.slice(1);
        return c === "vector" ? I1.vector(n2(u)) : I1.option(n2(u));
    }
    throw new Error(`Invalid Pure type name: ${e}`);
}
var d1 = I1.enum("PackageUpgradeError", {
    UnableToFetchPackage: I1.struct("UnableToFetchPackage", {
        packageId: r2
    }),
    NotAPackage: I1.struct("NotAPackage", {
        objectId: r2
    }),
    IncompatibleUpgrade: null,
    DigestDoesNotMatch: I1.struct("DigestDoesNotMatch", {
        digest: I1.vector(I1.u8())
    }),
    UnknownUpgradePolicy: I1.struct("UnknownUpgradePolicy", {
        policy: I1.u8()
    }),
    PackageIDDoesNotMatch: I1.struct("PackageIDDoesNotMatch", {
        packageId: r2,
        ticketId: r2
    })
}), g3 = I1.struct("ModuleId", {
    address: r2,
    name: I1.string()
}), c4 = I1.struct("MoveLocation", {
    module: g3,
    function: I1.u16(),
    instruction: I1.u16(),
    functionName: I1.option(I1.string())
}), p2 = I1.enum("CommandArgumentError", {
    TypeMismatch: null,
    InvalidBCSBytes: null,
    InvalidUsageOfPureArg: null,
    InvalidArgumentToPrivateEntryFunction: null,
    IndexOutOfBounds: I1.struct("IndexOutOfBounds", {
        idx: I1.u16()
    }),
    SecondaryIndexOutOfBounds: I1.struct("SecondaryIndexOutOfBounds", {
        resultIdx: I1.u16(),
        secondaryIdx: I1.u16()
    }),
    InvalidResultArity: I1.struct("InvalidResultArity", {
        resultIdx: I1.u16()
    }),
    InvalidGasCoinUsage: null,
    InvalidValueUsage: null,
    InvalidObjectByValue: null,
    InvalidObjectByMutRef: null,
    SharedObjectOperationNotAllowed: null
}), m2 = I1.enum("TypeArgumentError", {
    TypeNotFound: null,
    ConstraintNotSatisfied: null
}), b1 = I1.enum("ExecutionFailureStatus", {
    InsufficientGas: null,
    InvalidGasObject: null,
    InvariantViolation: null,
    FeatureNotYetSupported: null,
    MoveObjectTooBig: I1.struct("MoveObjectTooBig", {
        objectSize: I1.u64(),
        maxObjectSize: I1.u64()
    }),
    MovePackageTooBig: I1.struct("MovePackageTooBig", {
        objectSize: I1.u64(),
        maxObjectSize: I1.u64()
    }),
    CircularObjectOwnership: I1.struct("CircularObjectOwnership", {
        object: r2
    }),
    InsufficientCoinBalance: null,
    CoinBalanceOverflow: null,
    PublishErrorNonZeroAddress: null,
    SuiMoveVerificationError: null,
    MovePrimitiveRuntimeError: I1.option(c4),
    MoveAbort: I1.tuple([
        c4,
        I1.u64()
    ]),
    VMVerificationOrDeserializationError: null,
    VMInvariantViolation: null,
    FunctionNotFound: null,
    ArityMismatch: null,
    TypeArityMismatch: null,
    NonEntryFunctionInvoked: null,
    CommandArgumentError: I1.struct("CommandArgumentError", {
        argIdx: I1.u16(),
        kind: p2
    }),
    TypeArgumentError: I1.struct("TypeArgumentError", {
        argumentIdx: I1.u16(),
        kind: m2
    }),
    UnusedValueWithoutDrop: I1.struct("UnusedValueWithoutDrop", {
        resultIdx: I1.u16(),
        secondaryIdx: I1.u16()
    }),
    InvalidPublicFunctionReturnType: I1.struct("InvalidPublicFunctionReturnType", {
        idx: I1.u16()
    }),
    InvalidTransferObject: null,
    EffectsTooLarge: I1.struct("EffectsTooLarge", {
        currentSize: I1.u64(),
        maxSize: I1.u64()
    }),
    PublishUpgradeMissingDependency: null,
    PublishUpgradeDependencyDowngrade: null,
    PackageUpgradeError: I1.struct("PackageUpgradeError", {
        upgradeError: d1
    }),
    WrittenObjectsTooLarge: I1.struct("WrittenObjectsTooLarge", {
        currentSize: I1.u64(),
        maxSize: I1.u64()
    }),
    CertificateDenied: null,
    SuiMoveVerificationTimedout: null,
    SharedObjectOperationNotAllowed: null,
    InputObjectDeleted: null,
    ExecutionCancelledDueToSharedObjectCongestion: I1.struct("ExecutionCancelledDueToSharedObjectCongestion", {
        congestedObjects: I1.vector(r2)
    }),
    AddressDeniedForCoin: I1.struct("AddressDeniedForCoin", {
        address: r2,
        coinType: I1.string()
    }),
    CoinTypeGlobalPause: I1.struct("CoinTypeGlobalPause", {
        coinType: I1.string()
    }),
    ExecutionCancelledDueToRandomnessUnavailable: null
}), i2 = I1.enum("ExecutionStatus", {
    Success: null,
    Failed: I1.struct("ExecutionFailed", {
        error: b1,
        command: I1.option(I1.u64())
    })
}), s = I1.struct("GasCostSummary", {
    computationCost: I1.u64(),
    storageCost: I1.u64(),
    storageRebate: I1.u64(),
    nonRefundableStorageFee: I1.u64()
}), a2 = I1.enum("Owner", {
    AddressOwner: r2,
    ObjectOwner: r2,
    Shared: I1.struct("Shared", {
        initialSharedVersion: I1.u64()
    }),
    Immutable: null
}), O3 = I1.struct("TransactionEffectsV1", {
    status: i2,
    executedEpoch: I1.u64(),
    gasUsed: s,
    modifiedAtVersions: I1.vector(I1.tuple([
        r2,
        I1.u64()
    ])),
    sharedObjects: I1.vector(i1),
    transactionDigest: A2,
    created: I1.vector(I1.tuple([
        i1,
        a2
    ])),
    mutated: I1.vector(I1.tuple([
        i1,
        a2
    ])),
    unwrapped: I1.vector(I1.tuple([
        i1,
        a2
    ])),
    deleted: I1.vector(i1),
    unwrappedThenDeleted: I1.vector(i1),
    wrapped: I1.vector(i1),
    gasObject: I1.tuple([
        i1,
        a2
    ]),
    eventsDigest: I1.option(A2),
    dependencies: I1.vector(A2)
}), u3 = I1.tuple([
    I1.u64(),
    A2
]), f2 = I1.enum("ObjectIn", {
    NotExist: null,
    Exist: I1.tuple([
        u3,
        a2
    ])
}), S4 = I1.enum("ObjectOut", {
    NotExist: null,
    ObjectWrite: I1.tuple([
        A2,
        a2
    ]),
    PackageWrite: u3
}), I4 = I1.enum("IDOperation", {
    None: null,
    Created: null,
    Deleted: null
}), T3 = I1.struct("EffectsObjectChange", {
    inputState: f2,
    outputState: S4,
    idOperation: I4
}), v3 = I1.enum("UnchangedSharedKind", {
    ReadOnlyRoot: u3,
    MutateDeleted: I1.u64(),
    ReadDeleted: I1.u64(),
    Cancelled: I1.u64(),
    PerEpochConfig: null
}), E3 = I1.struct("TransactionEffectsV2", {
    status: i2,
    executedEpoch: I1.u64(),
    gasUsed: s,
    transactionDigest: A2,
    gasObjectIndex: I1.option(I1.u32()),
    eventsDigest: I1.option(A2),
    dependencies: I1.vector(A2),
    lamportVersion: I1.u64(),
    changedObjects: I1.vector(I1.tuple([
        r2,
        T3
    ])),
    unchangedSharedObjects: I1.vector(I1.tuple([
        r2,
        v3
    ])),
    auxDataDigest: I1.option(A2)
}), l3 = I1.enum("TransactionEffects", {
    V1: O3,
    V2: E3
});
var se = {
    ...I1,
    U8: I1.u8(),
    U16: I1.u16(),
    U32: I1.u32(),
    U64: I1.u64(),
    U128: I1.u128(),
    U256: I1.u256(),
    ULEB128: I1.uleb128(),
    Bool: I1.bool(),
    String: I1.string(),
    Address: r2,
    AppId: R1,
    Argument: n1,
    CallArg: h2,
    CompressedSignature: N2,
    GasData: O2,
    Intent: U2,
    IntentMessage: K1,
    IntentScope: E2,
    IntentVersion: V2,
    MultiSig: F1,
    MultiSigPkMap: G,
    MultiSigPublicKey: z2,
    ObjectArg: M2,
    ObjectDigest: A2,
    ProgrammableMoveCall: D2,
    ProgrammableTransaction: C2,
    PublicKey: _2,
    SenderSignedData: J1,
    SenderSignedTransaction: H1,
    SharedObjectRef: T2,
    StructTag: k1,
    SuiObjectRef: i1,
    Command: P2,
    TransactionData: w2,
    TransactionDataV1: x2,
    TransactionExpiration: j1,
    TransactionKind: I3,
    TypeTag: g2,
    TransactionEffects: l3,
    PasskeyAuthenticator: q1
};
function n3(e) {
    if (!Number.isSafeInteger(e) || e < 0) throw new Error("positive integer expected, got " + e);
}
function o(e) {
    return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function i3(e, ...t) {
    if (!o(e)) throw new Error("Uint8Array expected");
    if (t.length > 0 && !t.includes(e.length)) throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function s1(e, t = !0) {
    if (e.destroyed) throw new Error("Hash instance has been destroyed");
    if (t && e.finished) throw new Error("Hash#digest() has already been called");
}
function u4(e, t) {
    i3(e);
    let r1 = t.outputLen;
    if (e.length < r1) throw new Error("digestInto() expects output buffer of length at least " + r1);
}
typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
function O4(t) {
    return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
var d2 = new Uint8Array(new Uint32Array([
    287454020
]).buffer)[0] === 68;
function l4(t) {
    return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
var T4 = d2 ? (t)=>t : (t)=>l4(t);
function _3(t) {
    for(let e = 0; e < t.length; e++)t[e] = l4(t[e]);
}
Array.from({
    length: 256
}, (t, e)=>e.toString(16).padStart(2, "0"));
function m3(t) {
    if (typeof t != "string") throw new Error("utf8ToBytes expected string, got " + typeof t);
    return new Uint8Array(new TextEncoder().encode(t));
}
function p3(t) {
    return typeof t == "string" && (t = m3(t)), i3(t), t;
}
var y2 = class {
    clone() {
        return this._cloneInto();
    }
};
function C3(t) {
    let e = (n, o)=>t(o).update(p3(n)).digest(), r1 = t({});
    return e.outputLen = r1.outputLen, e.blockLen = r1.blockLen, e.create = (n)=>t(n), e;
}
var A3 = new Uint8Array([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3,
    11,
    8,
    12,
    0,
    5,
    2,
    15,
    13,
    10,
    14,
    3,
    6,
    7,
    1,
    9,
    4,
    7,
    9,
    3,
    1,
    13,
    12,
    11,
    14,
    2,
    6,
    5,
    10,
    4,
    0,
    15,
    8,
    9,
    0,
    5,
    7,
    2,
    4,
    10,
    15,
    14,
    1,
    11,
    12,
    6,
    8,
    3,
    13,
    2,
    12,
    6,
    10,
    0,
    11,
    8,
    3,
    4,
    13,
    7,
    5,
    15,
    14,
    1,
    9,
    12,
    5,
    1,
    15,
    14,
    13,
    4,
    10,
    0,
    7,
    6,
    3,
    9,
    2,
    8,
    11,
    13,
    11,
    7,
    14,
    12,
    1,
    3,
    9,
    5,
    0,
    15,
    4,
    8,
    6,
    2,
    10,
    6,
    15,
    14,
    9,
    11,
    3,
    0,
    8,
    12,
    2,
    13,
    7,
    1,
    4,
    10,
    5,
    10,
    2,
    8,
    4,
    7,
    6,
    1,
    5,
    15,
    11,
    9,
    14,
    3,
    12,
    13,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3,
    11,
    8,
    12,
    0,
    5,
    2,
    15,
    13,
    10,
    14,
    3,
    6,
    7,
    1,
    9,
    4,
    7,
    9,
    3,
    1,
    13,
    12,
    11,
    14,
    2,
    6,
    5,
    10,
    4,
    0,
    15,
    8,
    9,
    0,
    5,
    7,
    2,
    4,
    10,
    15,
    14,
    1,
    11,
    12,
    6,
    8,
    3,
    13,
    2,
    12,
    6,
    10,
    0,
    11,
    8,
    3,
    4,
    13,
    7,
    5,
    15,
    14,
    1,
    9
]), y3 = class extends y2 {
    constructor(t, e, s = {}, i, r1, f){
        if (super(), this.blockLen = t, this.outputLen = e, this.length = 0, this.pos = 0, this.finished = !1, this.destroyed = !1, n3(t), n3(e), n3(i), e < 0 || e > i) throw new Error("outputLen bigger than keyLen");
        if (s.key !== void 0 && (s.key.length < 1 || s.key.length > i)) throw new Error("key length must be undefined or 1.." + i);
        if (s.salt !== void 0 && s.salt.length !== r1) throw new Error("salt must be undefined or " + r1);
        if (s.personalization !== void 0 && s.personalization.length !== f) throw new Error("personalization must be undefined or " + f);
        this.buffer = new Uint8Array(t), this.buffer32 = O4(this.buffer);
    }
    update(t) {
        s1(this);
        let { blockLen: e, buffer: s, buffer32: i } = this;
        t = p3(t);
        let r1 = t.length, f = t.byteOffset, l = t.buffer;
        for(let n = 0; n < r1;){
            this.pos === e && (d2 || _3(i), this.compress(i, 0, !1), d2 || _3(i), this.pos = 0);
            let h = Math.min(e - this.pos, r1 - n), c = f + n;
            if (h === e && !(c % 4) && n + h < r1) {
                let a1 = new Uint32Array(l, c, Math.floor((r1 - n) / 4));
                d2 || _3(a1);
                for(let b = 0; n + e < r1; b += i.length, n += e)this.length += e, this.compress(a1, b, !1);
                d2 || _3(a1);
                continue;
            }
            s.set(t.subarray(n, n + h), this.pos), this.pos += h, this.length += h, n += h;
        }
        return this;
    }
    digestInto(t) {
        s1(this), u4(t, this);
        let { pos: e, buffer32: s } = this;
        this.finished = !0, this.buffer.subarray(e).fill(0), d2 || _3(s), this.compress(s, 0, !0), d2 || _3(s);
        let i = O4(t);
        this.get().forEach((r1, f)=>i[f] = T4(r1));
    }
    digest() {
        let { buffer: t, outputLen: e } = this;
        this.digestInto(t);
        let s = t.slice(0, e);
        return this.destroy(), s;
    }
    _cloneInto(t) {
        let { buffer: e, length: s, finished: i, destroyed: r1, outputLen: f, pos: l } = this;
        return t || (t = new this.constructor({
            dkLen: f
        })), t.set(...this.get()), t.length = s, t.finished = i, t.destroyed = r1, t.outputLen = f, t.buffer.set(e), t.pos = l, t;
    }
};
var e = BigInt(4294967295), s2 = BigInt(32);
function d3(t, o = !1) {
    return o ? {
        h: Number(t & e),
        l: Number(t >> s2 & e)
    } : {
        h: Number(t >> s2 & e) | 0,
        l: Number(t & e) | 0
    };
}
function u5(t, o = !1) {
    let n = new Uint32Array(t.length), r1 = new Uint32Array(t.length);
    for(let c = 0; c < t.length; c++){
        let { h: l, l: i } = d3(t[c], o);
        [n[c], r1[c]] = [
            l,
            i
        ];
    }
    return [
        n,
        r1
    ];
}
var a3 = (t, o)=>BigInt(t >>> 0) << s2 | BigInt(o >>> 0), h3 = (t, o, n)=>t >>> n, B3 = (t, o, n)=>t << 32 - n | o >>> n, f3 = (t, o, n)=>t >>> n | o << 32 - n, g4 = (t, o, n)=>t << 32 - n | o >>> n, H2 = (t, o, n)=>t << 64 - n | o >>> n - 32, L1 = (t, o, n)=>t >>> n - 32 | o << 64 - n, S5 = (t, o)=>o, m4 = (t, o)=>t, A4 = (t, o, n)=>t << n | o >>> 32 - n, _4 = (t, o, n)=>o << n | t >>> 32 - n, b2 = (t, o, n)=>o << n - 32 | t >>> 64 - n, I5 = (t, o, n)=>t << n - 32 | o >>> 64 - n;
function N3(t, o, n, r1) {
    let c = (o >>> 0) + (r1 >>> 0);
    return {
        h: t + n + (c / 2 ** 32 | 0) | 0,
        l: c | 0
    };
}
var p4 = (t, o, n)=>(t >>> 0) + (o >>> 0) + (n >>> 0), U3 = (t, o, n, r1)=>o + n + r1 + (t / 2 ** 32 | 0) | 0, w3 = (t, o, n, r1)=>(t >>> 0) + (o >>> 0) + (n >>> 0) + (r1 >>> 0), x3 = (t, o, n, r1, c)=>o + n + r1 + c + (t / 2 ** 32 | 0) | 0, y4 = (t, o, n, r1, c)=>(t >>> 0) + (o >>> 0) + (n >>> 0) + (r1 >>> 0) + (c >>> 0), K2 = (t, o, n, r1, c, l)=>o + n + r1 + c + l + (t / 2 ** 32 | 0) | 0;
var M3 = {
    fromBig: d3,
    split: u5,
    toBig: a3,
    shrSH: h3,
    shrSL: B3,
    rotrSH: f3,
    rotrSL: g4,
    rotrBH: H2,
    rotrBL: L1,
    rotr32H: S5,
    rotr32L: m4,
    rotlSH: A4,
    rotlSL: _4,
    rotlBH: b2,
    rotlBL: I5,
    add: N3,
    add3L: p4,
    add3H: U3,
    add4L: w3,
    add4H: x3,
    add5H: K2,
    add5L: y4
}, j2 = M3;
var B4 = new Uint32Array([
    4089235720,
    1779033703,
    2227873595,
    3144134277,
    4271175723,
    1013904242,
    1595750129,
    2773480762,
    2917565137,
    1359893119,
    725511199,
    2600822924,
    4215389547,
    528734635,
    327033209,
    1541459225
]), h4 = new Uint32Array(32);
function A5(b, t, l, i, y, D) {
    let v = y[D], s = y[D + 1], d = h4[2 * b], c = h4[2 * b + 1], e = h4[2 * t], r1 = h4[2 * t + 1], x = h4[2 * l], u = h4[2 * l + 1], n = h4[2 * i], a1 = h4[2 * i + 1], L = j2.add3L(d, e, v);
    c = j2.add3H(L, c, r1, s), d = L | 0, ({ Dh: a1, Dl: n } = {
        Dh: a1 ^ c,
        Dl: n ^ d
    }), ({ Dh: a1, Dl: n } = {
        Dh: j2.rotr32H(a1, n),
        Dl: j2.rotr32L(a1, n)
    }), ({ h: u, l: x } = j2.add(u, x, a1, n)), ({ Bh: r1, Bl: e } = {
        Bh: r1 ^ u,
        Bl: e ^ x
    }), ({ Bh: r1, Bl: e } = {
        Bh: j2.rotrSH(r1, e, 24),
        Bl: j2.rotrSL(r1, e, 24)
    }), h4[2 * b] = d, h4[2 * b + 1] = c, h4[2 * t] = e, h4[2 * t + 1] = r1, h4[2 * l] = x, h4[2 * l + 1] = u, h4[2 * i] = n, h4[2 * i + 1] = a1;
}
function p5(b, t, l, i, y, D) {
    let v = y[D], s = y[D + 1], d = h4[2 * b], c = h4[2 * b + 1], e = h4[2 * t], r1 = h4[2 * t + 1], x = h4[2 * l], u = h4[2 * l + 1], n = h4[2 * i], a1 = h4[2 * i + 1], L = j2.add3L(d, e, v);
    c = j2.add3H(L, c, r1, s), d = L | 0, ({ Dh: a1, Dl: n } = {
        Dh: a1 ^ c,
        Dl: n ^ d
    }), ({ Dh: a1, Dl: n } = {
        Dh: j2.rotrSH(a1, n, 16),
        Dl: j2.rotrSL(a1, n, 16)
    }), ({ h: u, l: x } = j2.add(u, x, a1, n)), ({ Bh: r1, Bl: e } = {
        Bh: r1 ^ u,
        Bl: e ^ x
    }), ({ Bh: r1, Bl: e } = {
        Bh: j2.rotrBH(r1, e, 63),
        Bl: j2.rotrBL(r1, e, 63)
    }), h4[2 * b] = d, h4[2 * b + 1] = c, h4[2 * t] = e, h4[2 * t + 1] = r1, h4[2 * l] = x, h4[2 * l + 1] = u, h4[2 * i] = n, h4[2 * i + 1] = a1;
}
var H3 = class extends y3 {
    constructor(t = {}){
        super(128, t.dkLen === void 0 ? 64 : t.dkLen, t, 64, 16, 16), this.v0l = B4[0] | 0, this.v0h = B4[1] | 0, this.v1l = B4[2] | 0, this.v1h = B4[3] | 0, this.v2l = B4[4] | 0, this.v2h = B4[5] | 0, this.v3l = B4[6] | 0, this.v3h = B4[7] | 0, this.v4l = B4[8] | 0, this.v4h = B4[9] | 0, this.v5l = B4[10] | 0, this.v5h = B4[11] | 0, this.v6l = B4[12] | 0, this.v6h = B4[13] | 0, this.v7l = B4[14] | 0, this.v7h = B4[15] | 0;
        let l = t.key ? t.key.length : 0;
        if (this.v0l ^= this.outputLen | l << 8 | 65536 | 1 << 24, t.salt) {
            let i = O4(p3(t.salt));
            this.v4l ^= T4(i[0]), this.v4h ^= T4(i[1]), this.v5l ^= T4(i[2]), this.v5h ^= T4(i[3]);
        }
        if (t.personalization) {
            let i = O4(p3(t.personalization));
            this.v6l ^= T4(i[0]), this.v6h ^= T4(i[1]), this.v7l ^= T4(i[2]), this.v7h ^= T4(i[3]);
        }
        if (t.key) {
            let i = new Uint8Array(this.blockLen);
            i.set(p3(t.key)), this.update(i);
        }
    }
    get() {
        let { v0l: t, v0h: l, v1l: i, v1h: y, v2l: D, v2h: v, v3l: s, v3h: d, v4l: c, v4h: e, v5l: r1, v5h: x, v6l: u, v6h: n, v7l: a1, v7h: L } = this;
        return [
            t,
            l,
            i,
            y,
            D,
            v,
            s,
            d,
            c,
            e,
            r1,
            x,
            u,
            n,
            a1,
            L
        ];
    }
    set(t, l, i, y, D, v, s, d, c, e, r1, x, u, n, a1, L) {
        this.v0l = t | 0, this.v0h = l | 0, this.v1l = i | 0, this.v1h = y | 0, this.v2l = D | 0, this.v2h = v | 0, this.v3l = s | 0, this.v3h = d | 0, this.v4l = c | 0, this.v4h = e | 0, this.v5l = r1 | 0, this.v5h = x | 0, this.v6l = u | 0, this.v6h = n | 0, this.v7l = a1 | 0, this.v7h = L | 0;
    }
    compress(t, l, i) {
        this.get().forEach((d, c)=>h4[c] = d), h4.set(B4, 16);
        let { h: y, l: D } = j2.fromBig(BigInt(this.length));
        h4[24] = B4[8] ^ D, h4[25] = B4[9] ^ y, i && (h4[28] = ~h4[28], h4[29] = ~h4[29]);
        let v = 0, s = A3;
        for(let d = 0; d < 12; d++)A5(0, 4, 8, 12, t, l + 2 * s[v++]), p5(0, 4, 8, 12, t, l + 2 * s[v++]), A5(1, 5, 9, 13, t, l + 2 * s[v++]), p5(1, 5, 9, 13, t, l + 2 * s[v++]), A5(2, 6, 10, 14, t, l + 2 * s[v++]), p5(2, 6, 10, 14, t, l + 2 * s[v++]), A5(3, 7, 11, 15, t, l + 2 * s[v++]), p5(3, 7, 11, 15, t, l + 2 * s[v++]), A5(0, 5, 10, 15, t, l + 2 * s[v++]), p5(0, 5, 10, 15, t, l + 2 * s[v++]), A5(1, 6, 11, 12, t, l + 2 * s[v++]), p5(1, 6, 11, 12, t, l + 2 * s[v++]), A5(2, 7, 8, 13, t, l + 2 * s[v++]), p5(2, 7, 8, 13, t, l + 2 * s[v++]), A5(3, 4, 9, 14, t, l + 2 * s[v++]), p5(3, 4, 9, 14, t, l + 2 * s[v++]);
        this.v0l ^= h4[0] ^ h4[16], this.v0h ^= h4[1] ^ h4[17], this.v1l ^= h4[2] ^ h4[18], this.v1h ^= h4[3] ^ h4[19], this.v2l ^= h4[4] ^ h4[20], this.v2h ^= h4[5] ^ h4[21], this.v3l ^= h4[6] ^ h4[22], this.v3h ^= h4[7] ^ h4[23], this.v4l ^= h4[8] ^ h4[24], this.v4h ^= h4[9] ^ h4[25], this.v5l ^= h4[10] ^ h4[26], this.v5h ^= h4[11] ^ h4[27], this.v6l ^= h4[12] ^ h4[28], this.v6h ^= h4[13] ^ h4[29], this.v7l ^= h4[14] ^ h4[30], this.v7h ^= h4[15] ^ h4[31], h4.fill(0);
    }
    destroy() {
        this.destroyed = !0, this.buffer32.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
}, E4 = C3((b)=>new H3(b));
var D3 = BigInt(1e9), T5 = "0x1", _5 = "0x2", f4 = I2("0x6"), l5 = `${_5}::sui::SUI`, p6 = I2("0x5");
var _6;
function w4(r1) {
    return {
        lang: r1?.lang ?? _6?.lang,
        message: r1?.message,
        abortEarly: r1?.abortEarly ?? _6?.abortEarly,
        abortPipeEarly: r1?.abortPipeEarly ?? _6?.abortPipeEarly
    };
}
var b3;
function fe1(r1) {
    return b3?.get(r1);
}
var x4;
function ce(r1) {
    return x4?.get(r1);
}
var m5;
function pe1(r1, n) {
    return m5?.get(r1)?.get(n);
}
function h5(r1) {
    let n = typeof r1;
    return n === "string" ? `"${r1}"` : n === "number" || n === "bigint" || n === "boolean" ? `${r1}` : n === "object" || n === "function" ? (r1 && Object.getPrototypeOf(r1)?.constructor?.name) ?? "null" : n;
}
function p7(r1, n, e, i, u) {
    let t = u && "input" in u ? u.input : e.value, l = u?.expected ?? r1.expects ?? null, f = u?.received ?? h5(t), s = {
        kind: r1.kind,
        type: r1.type,
        input: t,
        expected: l,
        received: f,
        message: `Invalid ${n}: ${l ? `Expected ${l} but r` : "R"}eceived ${f}`,
        requirement: r1.requirement,
        path: u?.path,
        issues: u?.issues,
        lang: i.lang,
        abortEarly: i.abortEarly,
        abortPipeEarly: i.abortPipeEarly
    }, c = r1.kind === "schema", o = u?.message ?? r1.message ?? pe1(r1.reference, s.lang) ?? (c ? ce(s.lang) : null) ?? i.message ?? fe1(s.lang);
    o && (s.message = typeof o == "function" ? o(s) : o), c && (e.typed = !1), e.issues ? e.issues.push(s) : e.issues = [
        s
    ];
}
function k2(r1, n) {
    return Object.hasOwn(r1, n) && n !== "__proto__" && n !== "prototype" && n !== "constructor";
}
var $2 = class extends Error {
    issues;
    constructor(r1){
        super(r1[0].message), this.name = "ValiError", this.issues = r1;
    }
};
function me(r1, n) {
    return {
        kind: "validation",
        type: "check",
        reference: me,
        async: !1,
        expects: null,
        requirement: r1,
        message: n,
        _run (e, i) {
            return e.typed && !this.requirement(e.value) && p7(this, "input", e, i), e;
        }
    };
}
function Ce(r1) {
    return {
        kind: "validation",
        type: "integer",
        reference: Ce,
        async: !1,
        expects: null,
        requirement: Number.isInteger,
        message: r1,
        _run (n, e) {
            return n.typed && !this.requirement(n.value) && p7(this, "integer", n, e), n;
        }
    };
}
function Gn(r1) {
    return {
        kind: "transformation",
        type: "transform",
        reference: Gn,
        async: !1,
        operation: r1,
        _run (n) {
            return n.value = this.operation(n.value), n;
        }
    };
}
function v4(r1, n, e) {
    return typeof r1.default == "function" ? r1.default(n, e) : r1.default;
}
function di(r1, n) {
    return !r1._run({
        typed: !1,
        value: n
    }, {
        abortEarly: !0
    }).issues;
}
function Fn(r1, n) {
    return {
        kind: "schema",
        type: "array",
        reference: Fn,
        expects: "Array",
        async: !1,
        item: r1,
        message: n,
        _run (e, i) {
            let u = e.value;
            if (Array.isArray(u)) {
                e.typed = !0, e.value = [];
                for(let t = 0; t < u.length; t++){
                    let l = u[t], f = this.item._run({
                        typed: !1,
                        value: l
                    }, i);
                    if (f.issues) {
                        let s = {
                            type: "array",
                            origin: "value",
                            input: u,
                            key: t,
                            value: l
                        };
                        for (let c of f.issues)c.path ? c.path.unshift(s) : c.path = [
                            s
                        ], e.issues?.push(c);
                        if (e.issues || (e.issues = f.issues), i.abortEarly) {
                            e.typed = !1;
                            break;
                        }
                    }
                    f.typed || (e.typed = !1), e.value.push(f.value);
                }
            } else p7(this, "type", e, i);
            return e;
        }
    };
}
function Hn(r1) {
    return {
        kind: "schema",
        type: "bigint",
        reference: Hn,
        expects: "bigint",
        async: !1,
        message: r1,
        _run (n, e) {
            return typeof n.value == "bigint" ? n.typed = !0 : p7(this, "type", n, e), n;
        }
    };
}
function Zn(r1) {
    return {
        kind: "schema",
        type: "boolean",
        reference: Zn,
        expects: "boolean",
        async: !1,
        message: r1,
        _run (n, e) {
            return typeof n.value == "boolean" ? n.typed = !0 : p7(this, "type", n, e), n;
        }
    };
}
function lr(r1) {
    return {
        kind: "schema",
        type: "lazy",
        reference: lr,
        expects: "unknown",
        async: !1,
        getter: r1,
        _run (n, e) {
            return this.getter(n.value)._run(n, e);
        }
    };
}
function cr(r1, n) {
    return {
        kind: "schema",
        type: "literal",
        reference: cr,
        expects: h5(r1),
        async: !1,
        literal: r1,
        message: n,
        _run (e, i) {
            return e.value === this.literal ? e.typed = !0 : p7(this, "type", e, i), e;
        }
    };
}
function wr(r1, ...n) {
    let e = {
        kind: "schema",
        type: "nullable",
        reference: wr,
        expects: `${r1.expects} | null`,
        async: !1,
        wrapped: r1,
        _run (i, u) {
            return i.value === null && ("default" in this && (i.value = v4(this, i, u)), i.value === null) ? (i.typed = !0, i) : this.wrapped._run(i, u);
        }
    };
    return 0 in n && (e.default = n[0]), e;
}
function $r(r1, ...n) {
    let e = {
        kind: "schema",
        type: "nullish",
        reference: $r,
        expects: `${r1.expects} | null | undefined`,
        async: !1,
        wrapped: r1,
        _run (i, u) {
            return (i.value === null || i.value === void 0) && ("default" in this && (i.value = v4(this, i, u)), i.value === null || i.value === void 0) ? (i.typed = !0, i) : this.wrapped._run(i, u);
        }
    };
    return 0 in n && (e.default = n[0]), e;
}
function Ir(r1) {
    return {
        kind: "schema",
        type: "number",
        reference: Ir,
        expects: "number",
        async: !1,
        message: r1,
        _run (n, e) {
            return typeof n.value == "number" && !isNaN(n.value) ? n.typed = !0 : p7(this, "type", n, e), n;
        }
    };
}
function jr(r1, n) {
    return {
        kind: "schema",
        type: "object",
        reference: jr,
        expects: "Object",
        async: !1,
        entries: r1,
        message: n,
        _run (e, i) {
            let u = e.value;
            if (u && typeof u == "object") {
                e.typed = !0, e.value = {};
                for(let t in this.entries){
                    let l = u[t], f = this.entries[t]._run({
                        typed: !1,
                        value: l
                    }, i);
                    if (f.issues) {
                        let s = {
                            type: "object",
                            origin: "value",
                            input: u,
                            key: t,
                            value: l
                        };
                        for (let c of f.issues)c.path ? c.path.unshift(s) : c.path = [
                            s
                        ], e.issues?.push(c);
                        if (e.issues || (e.issues = f.issues), i.abortEarly) {
                            e.typed = !1;
                            break;
                        }
                    }
                    f.typed || (e.typed = !1), (f.value !== void 0 || t in u) && (e.value[t] = f.value);
                }
            } else p7(this, "type", e, i);
            return e;
        }
    };
}
function M4(r1, ...n) {
    let e = {
        kind: "schema",
        type: "optional",
        reference: M4,
        expects: `${r1.expects} | undefined`,
        async: !1,
        wrapped: r1,
        _run (i, u) {
            return i.value === void 0 && ("default" in this && (i.value = v4(this, i, u)), i.value === void 0) ? (i.typed = !0, i) : this.wrapped._run(i, u);
        }
    };
    return 0 in n && (e.default = n[0]), e;
}
function Sr(r1, n, e) {
    return {
        kind: "schema",
        type: "record",
        reference: Sr,
        expects: "Object",
        async: !1,
        key: r1,
        value: n,
        message: e,
        _run (i, u) {
            let t = i.value;
            if (t && typeof t == "object") {
                i.typed = !0, i.value = {};
                for(let l in t)if (k2(t, l)) {
                    let f = t[l], s = this.key._run({
                        typed: !1,
                        value: l
                    }, u);
                    if (s.issues) {
                        let o = {
                            type: "object",
                            origin: "key",
                            input: t,
                            key: l,
                            value: f
                        };
                        for (let y of s.issues)y.path = [
                            o
                        ], i.issues?.push(y);
                        if (i.issues || (i.issues = s.issues), u.abortEarly) {
                            i.typed = !1;
                            break;
                        }
                    }
                    let c = this.value._run({
                        typed: !1,
                        value: f
                    }, u);
                    if (c.issues) {
                        let o = {
                            type: "object",
                            origin: "value",
                            input: t,
                            key: l,
                            value: f
                        };
                        for (let y of c.issues)y.path ? y.path.unshift(o) : y.path = [
                            o
                        ], i.issues?.push(y);
                        if (i.issues || (i.issues = c.issues), u.abortEarly) {
                            i.typed = !1;
                            break;
                        }
                    }
                    (!s.typed || !c.typed) && (i.typed = !1), s.typed && (i.value[s.value] = c.value);
                }
            } else p7(this, "type", i, u);
            return i;
        }
    };
}
function Xr(r1) {
    return {
        kind: "schema",
        type: "string",
        reference: Xr,
        expects: "string",
        async: !1,
        message: r1,
        _run (n, e) {
            return typeof n.value == "string" ? n.typed = !0 : p7(this, "type", n, e), n;
        }
    };
}
function Lr(r1, n) {
    return {
        kind: "schema",
        type: "tuple",
        reference: Lr,
        expects: "Array",
        async: !1,
        items: r1,
        message: n,
        _run (e, i) {
            let u = e.value;
            if (Array.isArray(u)) {
                e.typed = !0, e.value = [];
                for(let t = 0; t < this.items.length; t++){
                    let l = u[t], f = this.items[t]._run({
                        typed: !1,
                        value: l
                    }, i);
                    if (f.issues) {
                        let s = {
                            type: "array",
                            origin: "value",
                            input: u,
                            key: t,
                            value: l
                        };
                        for (let c of f.issues)c.path ? c.path.unshift(s) : c.path = [
                            s
                        ], e.issues?.push(c);
                        if (e.issues || (e.issues = f.issues), i.abortEarly) {
                            e.typed = !1;
                            break;
                        }
                    }
                    f.typed || (e.typed = !1), e.value.push(f.value);
                }
            } else p7(this, "type", e, i);
            return e;
        }
    };
}
function d4(r1) {
    let n;
    if (r1) for (let e of r1)n ? n.push(...e.issues) : n = e.issues;
    return n;
}
function Br(r1, n) {
    return {
        kind: "schema",
        type: "union",
        reference: Br,
        expects: [
            ...new Set(r1.map((e)=>e.expects))
        ].join(" | ") || "never",
        async: !1,
        options: r1,
        message: n,
        _run (e, i) {
            let u, t, l;
            for (let f of this.options){
                let s = f._run({
                    typed: !1,
                    value: e.value
                }, i);
                if (s.typed) if (s.issues) t ? t.push(s) : t = [
                    s
                ];
                else {
                    u = s;
                    break;
                }
                else l ? l.push(s) : l = [
                    s
                ];
            }
            if (u) return u;
            if (t) {
                if (t.length === 1) return t[0];
                p7(this, "type", e, i, {
                    issues: d4(t)
                }), e.typed = !0;
            } else {
                if (l?.length === 1) return l[0];
                p7(this, "type", e, i, {
                    issues: d4(l)
                });
            }
            return e;
        }
    };
}
function Kr() {
    return {
        kind: "schema",
        type: "unknown",
        reference: Kr,
        expects: "unknown",
        async: !1,
        _run (r1) {
            return r1.typed = !0, r1;
        }
    };
}
function ei(r1, n, e) {
    let i = r1._run({
        typed: !1,
        value: n
    }, w4(e));
    if (i.issues) throw new $2(i.issues);
    return i.value;
}
function qi(...r1) {
    return {
        ...r1[0],
        pipe: r1,
        _run (n, e) {
            for(let i = 0; i < r1.length; i++){
                if (n.issues && (r1[i].kind === "schema" || r1[i].kind === "transformation")) {
                    n.typed = !1;
                    break;
                }
                (!n.issues || !e.abortEarly && !e.abortPipeEarly) && (n = r1[i]._run(n, e));
            }
            return n;
        }
    };
}
var ws = "object", ys = "ID", vs = "ascii", Os = "String", js = "string", ks = "String", Cs = "option", Ms = "Option";
function on(n) {
    let e = typeof n.body == "object" && "datatype" in n.body ? n.body.datatype : null;
    return !!e && u2(e.package) === u2("0x2") && e.module === "tx_context" && e.type === "TxContext";
}
function Le(n) {
    if (typeof n == "string") switch(n){
        case "address":
            return se.Address;
        case "bool":
            return se.Bool;
        case "u8":
            return se.U8;
        case "u16":
            return se.U16;
        case "u32":
            return se.U32;
        case "u64":
            return se.U64;
        case "u128":
            return se.U128;
        case "u256":
            return se.U256;
        default:
            throw new Error(`Unknown type signature ${n}`);
    }
    if ("vector" in n) {
        if (n.vector === "u8") return se.vector(se.U8).transform({
            input: (t)=>typeof t == "string" ? new TextEncoder().encode(t) : t,
            output: (t)=>t
        });
        let e = Le(n.vector);
        return e ? se.vector(e) : null;
    }
    if ("datatype" in n) {
        let e = u2(n.datatype.package);
        if (e === u2(T5)) {
            if (n.datatype.module === vs && n.datatype.type === Os) return se.String;
            if (n.datatype.module === js && n.datatype.type === ks) return se.String;
            if (n.datatype.module === Cs && n.datatype.type === Ms) {
                let t = Le(n.datatype.typeParameters[0]);
                return t ? se.vector(t) : null;
            }
        }
        if (e === u2(_5) && n.datatype.module === ws && n.datatype.type === ys) return se.Address;
    }
    return null;
}
function It(n) {
    return typeof n == "object" && "Reference" in n ? {
        ref: "&",
        body: Fe(n.Reference)
    } : typeof n == "object" && "MutableReference" in n ? {
        ref: "&mut",
        body: Fe(n.MutableReference)
    } : {
        ref: null,
        body: Fe(n)
    };
}
function Fe(n) {
    if (typeof n == "string") switch(n){
        case "Address":
            return "address";
        case "Bool":
            return "bool";
        case "U8":
            return "u8";
        case "U16":
            return "u16";
        case "U32":
            return "u32";
        case "U64":
            return "u64";
        case "U128":
            return "u128";
        case "U256":
            return "u256";
        default:
            throw new Error(`Unexpected type ${n}`);
    }
    if ("Vector" in n) return {
        vector: Fe(n.Vector)
    };
    if ("Struct" in n) return {
        datatype: {
            package: n.Struct.address,
            module: n.Struct.module,
            type: n.Struct.name,
            typeParameters: n.Struct.typeArguments.map(Fe)
        }
    };
    if ("TypeParameter" in n) return {
        typeParameter: n.TypeParameter
    };
    throw new Error(`Unexpected type ${JSON.stringify(n)}`);
}
function Ts(n) {
    return {
        $kind: "Pure",
        Pure: {
            bytes: n instanceof Uint8Array ? y(n) : n.toBase64()
        }
    };
}
var A6 = {
    Pure: Ts,
    ObjectRef ({ objectId: n, digest: e, version: t }) {
        return {
            $kind: "Object",
            Object: {
                $kind: "ImmOrOwnedObject",
                ImmOrOwnedObject: {
                    digest: e,
                    version: t,
                    objectId: u2(n)
                }
            }
        };
    },
    SharedObjectRef ({ objectId: n, mutable: e, initialSharedVersion: t }) {
        return {
            $kind: "Object",
            Object: {
                $kind: "SharedObject",
                SharedObject: {
                    mutable: e,
                    initialSharedVersion: t,
                    objectId: u2(n)
                }
            }
        };
    },
    ReceivingRef ({ objectId: n, digest: e, version: t }) {
        return {
            $kind: "Object",
            Object: {
                $kind: "Receiving",
                Receiving: {
                    digest: e,
                    version: t,
                    objectId: u2(n)
                }
            }
        };
    }
};
function ue1(n) {
    let e = Object.entries(n).map(([t, s])=>jr({
            [t]: s
        }));
    return qi(Br(e), Gn((t)=>({
            ...t,
            $kind: Object.keys(t)[0]
        })));
}
var ye = qi(Xr(), Gn((n)=>u2(n)), me(m1)), x5 = ye, ce1 = Xr(), S6 = qi(Br([
    Xr(),
    qi(Ir(), Ce())
]), me((n)=>{
    try {
        return BigInt(n), BigInt(n) >= 0 && BigInt(n) <= 18446744073709551615n;
    } catch  {
        return !1;
    }
}, "Invalid u64")), F2 = jr({
    objectId: ye,
    version: S6,
    digest: Xr()
}), b4 = qi(Br([
    jr({
        GasCoin: cr(!0)
    }),
    jr({
        Input: qi(Ir(), Ce()),
        type: M4(cr("pure"))
    }),
    jr({
        Input: qi(Ir(), Ce()),
        type: M4(cr("object"))
    }),
    jr({
        Result: qi(Ir(), Ce())
    }),
    jr({
        NestedResult: Lr([
            qi(Ir(), Ce()),
            qi(Ir(), Ce())
        ])
    })
]), Gn((n)=>({
        ...n,
        $kind: Object.keys(n)[0]
    }))), As = jr({
    budget: wr(S6),
    price: wr(S6),
    owner: wr(ye),
    payment: wr(Fn(F2))
}), ui = jr({
    address: Xr(),
    module: Xr(),
    name: Xr(),
    typeParams: Fn(Xr())
}), St = Br([
    cr("address"),
    cr("bool"),
    cr("u8"),
    cr("u16"),
    cr("u32"),
    cr("u64"),
    cr("u128"),
    cr("u256"),
    jr({
        vector: lr(()=>St)
    }),
    jr({
        datatype: jr({
            package: Xr(),
            module: Xr(),
            type: Xr(),
            typeParameters: Fn(lr(()=>St))
        })
    }),
    jr({
        typeParameter: qi(Ir(), Ce())
    })
]), Rs = jr({
    ref: wr(Br([
        cr("&"),
        cr("&mut")
    ])),
    body: St
}), xs = jr({
    package: x5,
    module: Xr(),
    function: Xr(),
    typeArguments: Fn(Xr()),
    arguments: Fn(b4),
    _argumentTypes: M4(wr(Fn(Rs)))
}), Ps = jr({
    name: Xr(),
    inputs: Sr(Xr(), Br([
        b4,
        Fn(b4)
    ])),
    data: Sr(Xr(), Kr())
}), $s = ue1({
    MoveCall: xs,
    TransferObjects: jr({
        objects: Fn(b4),
        address: b4
    }),
    SplitCoins: jr({
        coin: b4,
        amounts: Fn(b4)
    }),
    MergeCoins: jr({
        destination: b4,
        sources: Fn(b4)
    }),
    Publish: jr({
        modules: Fn(ce1),
        dependencies: Fn(x5)
    }),
    MakeMoveVec: jr({
        type: wr(Xr()),
        elements: Fn(b4)
    }),
    Upgrade: jr({
        modules: Fn(ce1),
        dependencies: Fn(x5),
        package: x5,
        ticket: b4
    }),
    $Intent: Ps
}), fn = ue1({
    ImmOrOwnedObject: F2,
    SharedObject: jr({
        objectId: x5,
        initialSharedVersion: S6,
        mutable: Zn()
    }),
    Receiving: F2
}), Bs = ue1({
    Object: fn,
    Pure: jr({
        bytes: ce1
    }),
    UnresolvedPure: jr({
        value: Kr()
    }),
    UnresolvedObject: jr({
        objectId: x5,
        version: M4(wr(S6)),
        digest: M4(wr(Xr())),
        initialSharedVersion: M4(wr(S6))
    })
}), Et = ue1({
    Object: fn,
    Pure: jr({
        bytes: ce1
    })
}), Ut = ue1({
    None: cr(!0),
    Epoch: S6
}), Ee = jr({
    version: cr(2),
    sender: $r(ye),
    expiration: $r(Ut),
    gasData: As,
    inputs: Fn(Bs),
    commands: Fn($s)
});
var gn = ((n)=>(n[n.COMPATIBLE = 0] = "COMPATIBLE", n[n.ADDITIVE = 128] = "ADDITIVE", n[n.DEP_ONLY = 192] = "DEP_ONLY", n))(gn || {}), B5 = {
    MoveCall (n) {
        let [e, t = "", s = ""] = "target" in n ? n.target.split("::") : [
            n.package,
            n.module,
            n.function
        ];
        return {
            $kind: "MoveCall",
            MoveCall: {
                package: e,
                module: t,
                function: s,
                typeArguments: n.typeArguments ?? [],
                arguments: n.arguments ?? []
            }
        };
    },
    TransferObjects (n, e) {
        return {
            $kind: "TransferObjects",
            TransferObjects: {
                objects: n.map((t)=>ei(b4, t)),
                address: ei(b4, e)
            }
        };
    },
    SplitCoins (n, e) {
        return {
            $kind: "SplitCoins",
            SplitCoins: {
                coin: ei(b4, n),
                amounts: e.map((t)=>ei(b4, t))
            }
        };
    },
    MergeCoins (n, e) {
        return {
            $kind: "MergeCoins",
            MergeCoins: {
                destination: ei(b4, n),
                sources: e.map((t)=>ei(b4, t))
            }
        };
    },
    Publish ({ modules: n, dependencies: e }) {
        return {
            $kind: "Publish",
            Publish: {
                modules: n.map((t)=>typeof t == "string" ? t : y(new Uint8Array(t))),
                dependencies: e.map((t)=>I2(t))
            }
        };
    },
    Upgrade ({ modules: n, dependencies: e, package: t, ticket: s }) {
        return {
            $kind: "Upgrade",
            Upgrade: {
                modules: n.map((r1)=>typeof r1 == "string" ? r1 : y(new Uint8Array(r1))),
                dependencies: e.map((r1)=>I2(r1)),
                package: t,
                ticket: ei(b4, s)
            }
        };
    },
    MakeMoveVec ({ type: n, elements: e }) {
        return {
            $kind: "MakeMoveVec",
            MakeMoveVec: {
                type: n ?? null,
                elements: e.map((t)=>ei(b4, t))
            }
        };
    },
    Intent ({ name: n, inputs: e = {}, data: t = {} }) {
        return {
            $kind: "$Intent",
            $Intent: {
                name: n,
                inputs: Object.fromEntries(Object.entries(e).map(([s, r1])=>[
                        s,
                        Array.isArray(r1) ? r1.map((i)=>ei(b4, i)) : ei(b4, r1)
                    ])),
                data: t
            }
        };
    }
};
var xt = jr({
    digest: Xr(),
    objectId: Xr(),
    version: Br([
        qi(Ir(), Ce()),
        Xr(),
        Hn()
    ])
}), zs = ue1({
    ImmOrOwned: xt,
    Shared: jr({
        objectId: x5,
        initialSharedVersion: S6,
        mutable: Zn()
    }),
    Receiving: xt
}), vn = ue1({
    Object: zs,
    Pure: Fn(qi(Ir(), Ce()))
}), Mn = Br([
    jr({
        kind: cr("Input"),
        index: qi(Ir(), Ce()),
        value: Kr(),
        type: M4(cr("object"))
    }),
    jr({
        kind: cr("Input"),
        index: qi(Ir(), Ce()),
        value: Kr(),
        type: cr("pure")
    })
]), Ds = Br([
    jr({
        Epoch: qi(Ir(), Ce())
    }),
    jr({
        None: wr(cr(!0))
    })
]), On = qi(Br([
    Ir(),
    Xr(),
    Hn()
]), me((n)=>{
    if (![
        "string",
        "number",
        "bigint"
    ].includes(typeof n)) return !1;
    try {
        return BigInt(n), !0;
    } catch  {
        return !1;
    }
})), Pt = Br([
    jr({
        bool: wr(cr(!0))
    }),
    jr({
        u8: wr(cr(!0))
    }),
    jr({
        u64: wr(cr(!0))
    }),
    jr({
        u128: wr(cr(!0))
    }),
    jr({
        address: wr(cr(!0))
    }),
    jr({
        signer: wr(cr(!0))
    }),
    jr({
        vector: lr(()=>Pt)
    }),
    jr({
        struct: lr(()=>Gs)
    }),
    jr({
        u16: wr(cr(!0))
    }),
    jr({
        u32: wr(cr(!0))
    }),
    jr({
        u256: wr(cr(!0))
    })
]), Gs = jr({
    address: Xr(),
    module: Xr(),
    name: Xr(),
    typeParams: Fn(Pt)
}), Fs = jr({
    budget: M4(On),
    price: M4(On),
    payment: M4(Fn(xt)),
    owner: M4(Xr())
}), Ls = [
    Mn,
    jr({
        kind: cr("GasCoin")
    }),
    jr({
        kind: cr("Result"),
        index: qi(Ir(), Ce())
    }),
    jr({
        kind: cr("NestedResult"),
        index: qi(Ir(), Ce()),
        resultIndex: qi(Ir(), Ce())
    })
], ie = Br([
    ...Ls
]), Js = jr({
    kind: cr("MoveCall"),
    target: qi(Xr(), me((n)=>n.split("::").length === 3)),
    typeArguments: Fn(Xr()),
    arguments: Fn(ie)
}), qs = jr({
    kind: cr("TransferObjects"),
    objects: Fn(ie),
    address: ie
}), Ks = jr({
    kind: cr("SplitCoins"),
    coin: ie,
    amounts: Fn(ie)
}), Qs = jr({
    kind: cr("MergeCoins"),
    destination: ie,
    sources: Fn(ie)
}), Ys = jr({
    kind: cr("MakeMoveVec"),
    type: Br([
        jr({
            Some: Pt
        }),
        jr({
            None: wr(cr(!0))
        })
    ]),
    objects: Fn(ie)
}), Hs = jr({
    kind: cr("Publish"),
    modules: Fn(Fn(qi(Ir(), Ce()))),
    dependencies: Fn(Xr())
}), Xs = jr({
    kind: cr("Upgrade"),
    modules: Fn(Fn(qi(Ir(), Ce()))),
    dependencies: Fn(Xr()),
    packageId: Xr(),
    ticket: ie
}), Zs = [
    Js,
    qs,
    Ks,
    Qs,
    Hs,
    Xs,
    Ys
], er = Br([
    ...Zs
]), vi = jr({
    version: cr(1),
    sender: M4(Xr()),
    expiration: $r(Ds),
    gasConfig: Fs,
    inputs: Fn(Mn),
    transactions: Fn(er)
});
function $t(n) {
    let e = n.inputs.map((t, s)=>{
        if (t.Object) return {
            kind: "Input",
            index: s,
            value: {
                Object: t.Object.ImmOrOwnedObject ? {
                    ImmOrOwned: t.Object.ImmOrOwnedObject
                } : t.Object.Receiving ? {
                    Receiving: {
                        digest: t.Object.Receiving.digest,
                        version: t.Object.Receiving.version,
                        objectId: t.Object.Receiving.objectId
                    }
                } : {
                    Shared: {
                        mutable: t.Object.SharedObject.mutable,
                        initialSharedVersion: t.Object.SharedObject.initialSharedVersion,
                        objectId: t.Object.SharedObject.objectId
                    }
                }
            },
            type: "object"
        };
        if (t.Pure) return {
            kind: "Input",
            index: s,
            value: {
                Pure: Array.from(m(t.Pure.bytes))
            },
            type: "pure"
        };
        if (t.UnresolvedPure) return {
            kind: "Input",
            type: "pure",
            index: s,
            value: t.UnresolvedPure.value
        };
        if (t.UnresolvedObject) return {
            kind: "Input",
            type: "object",
            index: s,
            value: t.UnresolvedObject.objectId
        };
        throw new Error("Invalid input");
    });
    return {
        version: 1,
        sender: n.sender ?? void 0,
        expiration: n.expiration?.$kind === "Epoch" ? {
            Epoch: Number(n.expiration.Epoch)
        } : n.expiration ? {
            None: !0
        } : null,
        gasConfig: {
            owner: n.gasData.owner ?? void 0,
            budget: n.gasData.budget ?? void 0,
            price: n.gasData.price ?? void 0,
            payment: n.gasData.payment ?? void 0
        },
        inputs: e,
        transactions: n.commands.map((t)=>{
            if (t.MakeMoveVec) return {
                kind: "MakeMoveVec",
                type: t.MakeMoveVec.type === null ? {
                    None: !0
                } : {
                    Some: i.parseFromStr(t.MakeMoveVec.type)
                },
                objects: t.MakeMoveVec.elements.map((s)=>se1(s, e))
            };
            if (t.MergeCoins) return {
                kind: "MergeCoins",
                destination: se1(t.MergeCoins.destination, e),
                sources: t.MergeCoins.sources.map((s)=>se1(s, e))
            };
            if (t.MoveCall) return {
                kind: "MoveCall",
                target: `${t.MoveCall.package}::${t.MoveCall.module}::${t.MoveCall.function}`,
                typeArguments: t.MoveCall.typeArguments,
                arguments: t.MoveCall.arguments.map((s)=>se1(s, e))
            };
            if (t.Publish) return {
                kind: "Publish",
                modules: t.Publish.modules.map((s)=>Array.from(m(s))),
                dependencies: t.Publish.dependencies
            };
            if (t.SplitCoins) return {
                kind: "SplitCoins",
                coin: se1(t.SplitCoins.coin, e),
                amounts: t.SplitCoins.amounts.map((s)=>se1(s, e))
            };
            if (t.TransferObjects) return {
                kind: "TransferObjects",
                objects: t.TransferObjects.objects.map((s)=>se1(s, e)),
                address: se1(t.TransferObjects.address, e)
            };
            if (t.Upgrade) return {
                kind: "Upgrade",
                modules: t.Upgrade.modules.map((s)=>Array.from(m(s))),
                dependencies: t.Upgrade.dependencies,
                packageId: t.Upgrade.package,
                ticket: se1(t.Upgrade.ticket, e)
            };
            throw new Error(`Unknown transaction ${Object.keys(t)}`);
        })
    };
}
function se1(n, e) {
    if (n.$kind === "GasCoin") return {
        kind: "GasCoin"
    };
    if (n.$kind === "Result") return {
        kind: "Result",
        index: n.Result
    };
    if (n.$kind === "NestedResult") return {
        kind: "NestedResult",
        index: n.NestedResult[0],
        resultIndex: n.NestedResult[1]
    };
    if (n.$kind === "Input") return e[n.Input];
    throw new Error(`Invalid argument ${Object.keys(n)}`);
}
function In(n) {
    return ei(Ee, {
        version: 2,
        sender: n.sender ?? null,
        expiration: n.expiration ? "Epoch" in n.expiration ? {
            Epoch: n.expiration.Epoch
        } : {
            None: !0
        } : null,
        gasData: {
            owner: n.gasConfig.owner ?? null,
            budget: n.gasConfig.budget?.toString() ?? null,
            price: n.gasConfig.price?.toString() ?? null,
            payment: n.gasConfig.payment?.map((e)=>({
                    digest: e.digest,
                    objectId: e.objectId,
                    version: e.version.toString()
                })) ?? null
        },
        inputs: n.inputs.map((e)=>{
            if (e.kind === "Input") {
                if (di(vn, e.value)) {
                    let t = ei(vn, e.value);
                    if (t.Object) {
                        if (t.Object.ImmOrOwned) return {
                            Object: {
                                ImmOrOwnedObject: {
                                    objectId: t.Object.ImmOrOwned.objectId,
                                    version: String(t.Object.ImmOrOwned.version),
                                    digest: t.Object.ImmOrOwned.digest
                                }
                            }
                        };
                        if (t.Object.Shared) return {
                            Object: {
                                SharedObject: {
                                    mutable: t.Object.Shared.mutable ?? null,
                                    initialSharedVersion: t.Object.Shared.initialSharedVersion,
                                    objectId: t.Object.Shared.objectId
                                }
                            }
                        };
                        if (t.Object.Receiving) return {
                            Object: {
                                Receiving: {
                                    digest: t.Object.Receiving.digest,
                                    version: String(t.Object.Receiving.version),
                                    objectId: t.Object.Receiving.objectId
                                }
                            }
                        };
                        throw new Error("Invalid object input");
                    }
                    return {
                        Pure: {
                            bytes: y(new Uint8Array(t.Pure))
                        }
                    };
                }
                return e.type === "object" ? {
                    UnresolvedObject: {
                        objectId: e.value
                    }
                } : {
                    UnresolvedPure: {
                        value: e.value
                    }
                };
            }
            throw new Error("Invalid input");
        }),
        commands: n.transactions.map((e)=>{
            switch(e.kind){
                case "MakeMoveVec":
                    return {
                        MakeMoveVec: {
                            type: "Some" in e.type ? i.tagToString(e.type.Some) : null,
                            elements: e.objects.map((t)=>re1(t))
                        }
                    };
                case "MergeCoins":
                    return {
                        MergeCoins: {
                            destination: re1(e.destination),
                            sources: e.sources.map((t)=>re1(t))
                        }
                    };
                case "MoveCall":
                    {
                        let [t, s, r1] = e.target.split("::");
                        return {
                            MoveCall: {
                                package: t,
                                module: s,
                                function: r1,
                                typeArguments: e.typeArguments,
                                arguments: e.arguments.map((i)=>re1(i))
                            }
                        };
                    }
                case "Publish":
                    return {
                        Publish: {
                            modules: e.modules.map((t)=>y(Uint8Array.from(t))),
                            dependencies: e.dependencies
                        }
                    };
                case "SplitCoins":
                    return {
                        SplitCoins: {
                            coin: re1(e.coin),
                            amounts: e.amounts.map((t)=>re1(t))
                        }
                    };
                case "TransferObjects":
                    return {
                        TransferObjects: {
                            objects: e.objects.map((t)=>re1(t)),
                            address: re1(e.address)
                        }
                    };
                case "Upgrade":
                    return {
                        Upgrade: {
                            modules: e.modules.map((t)=>y(Uint8Array.from(t))),
                            dependencies: e.dependencies,
                            package: e.packageId,
                            ticket: re1(e.ticket)
                        }
                    };
            }
            throw new Error(`Unknown transaction ${Object.keys(e)}`);
        })
    });
}
function re1(n) {
    switch(n.kind){
        case "GasCoin":
            return {
                GasCoin: !0
            };
        case "Result":
            return {
                Result: n.index
            };
        case "NestedResult":
            return {
                NestedResult: [
                    n.index,
                    n.resultIndex
                ]
            };
        case "Input":
            return {
                Input: n.index
            };
    }
}
function Je(n) {
    return Br(Object.entries(n).map(([e, t])=>jr({
            [e]: t
        })));
}
var q2 = Je({
    GasCoin: cr(!0),
    Input: qi(Ir(), Ce()),
    Result: qi(Ir(), Ce()),
    NestedResult: Lr([
        qi(Ir(), Ce()),
        qi(Ir(), Ce())
    ])
}), sr = jr({
    budget: wr(S6),
    price: wr(S6),
    owner: wr(ye),
    payment: wr(Fn(F2))
}), rr = jr({
    package: x5,
    module: Xr(),
    function: Xr(),
    typeArguments: Fn(Xr()),
    arguments: Fn(q2)
}), ir = jr({
    name: Xr(),
    inputs: Sr(Xr(), Br([
        q2,
        Fn(q2)
    ])),
    data: Sr(Xr(), Kr())
}), ar = Je({
    MoveCall: rr,
    TransferObjects: jr({
        objects: Fn(q2),
        address: q2
    }),
    SplitCoins: jr({
        coin: q2,
        amounts: Fn(q2)
    }),
    MergeCoins: jr({
        destination: q2,
        sources: Fn(q2)
    }),
    Publish: jr({
        modules: Fn(ce1),
        dependencies: Fn(x5)
    }),
    MakeMoveVec: jr({
        type: wr(Xr()),
        elements: Fn(q2)
    }),
    Upgrade: jr({
        modules: Fn(ce1),
        dependencies: Fn(x5),
        package: x5,
        ticket: q2
    }),
    $Intent: ir
}), or = Je({
    ImmOrOwnedObject: F2,
    SharedObject: jr({
        objectId: x5,
        initialSharedVersion: S6,
        mutable: Zn()
    }),
    Receiving: F2
}), cr1 = Je({
    Object: or,
    Pure: jr({
        bytes: ce1
    }),
    UnresolvedPure: jr({
        value: Kr()
    }),
    UnresolvedObject: jr({
        objectId: x5,
        version: M4(wr(S6)),
        digest: M4(wr(Xr())),
        initialSharedVersion: M4(wr(S6))
    })
}), ur = Je({
    None: cr(!0),
    Epoch: S6
}), Un = jr({
    version: cr(2),
    sender: $r(ye),
    expiration: $r(ur),
    gasData: sr,
    inputs: Fn(cr1),
    commands: Fn(ar)
});
var hr = 50, mr = 1000n, gr = 5e10;
async function xn(n, e, t) {
    return await Or(n, e), await vr(n, e), e.onlyTransactionKind || (await br(n, e), await wr1(n, e), await yr(n, e)), await jr1(n), await t();
}
async function br(n, e) {
    n.gasConfig.price || (n.gasConfig.price = String(await ve(e).getReferenceGasPrice()));
}
async function wr1(n, e) {
    if (n.gasConfig.budget) return;
    let t = await ve(e).dryRunTransactionBlock({
        transactionBlock: n.build({
            overrides: {
                gasData: {
                    budget: String(gr),
                    payment: []
                }
            }
        })
    });
    if (t.effects.status.status !== "success") throw new Error(`Dry run failed, could not automatically determine a budget: ${t.effects.status.error}`, {
        cause: t
    });
    let s = mr * BigInt(n.gasConfig.price || 1n), r1 = BigInt(t.effects.gasUsed.computationCost) + s, i = r1 + BigInt(t.effects.gasUsed.storageCost) - BigInt(t.effects.gasUsed.storageRebate);
    n.gasConfig.budget = String(i > r1 ? i : r1);
}
async function yr(n, e) {
    if (!n.gasConfig.payment) {
        let s = (await ve(e).getCoins({
            owner: n.gasConfig.owner || n.sender,
            coinType: l5
        })).data.filter((r1)=>!n.inputs.find((c)=>c.Object?.ImmOrOwnedObject ? r1.coinObjectId === c.Object.ImmOrOwnedObject.objectId : !1)).map((r1)=>({
                objectId: r1.coinObjectId,
                digest: r1.digest,
                version: r1.version
            }));
        if (!s.length) throw new Error("No valid gas coins found for the transaction.");
        n.gasConfig.payment = s.map((r1)=>ei(F2, r1));
    }
}
async function vr(n, e) {
    let t = n.inputs.filter((o)=>o.UnresolvedObject && !(o.UnresolvedObject.version || o.UnresolvedObject?.initialSharedVersion)), s = [
        ...new Set(t.map((o)=>I2(o.UnresolvedObject.objectId)))
    ], r1 = s.length ? Ir1(s, hr) : [], i = (await Promise.all(r1.map((o)=>ve(e).multiGetObjects({
            ids: o,
            options: {
                showOwner: !0
            }
        })))).flat(), c = new Map(s.map((o, p)=>[
            o,
            i[p]
        ])), a1 = Array.from(c).filter(([o, p])=>p.error).map(([o, p])=>JSON.stringify(p.error));
    if (a1.length) throw new Error(`The following input objects are invalid: ${a1.join(", ")}`);
    let l = i.map((o)=>{
        if (o.error || !o.data) throw new Error(`Failed to fetch object: ${o.error}`);
        let p = o.data.owner, g = p && typeof p == "object" && "Shared" in p ? p.Shared.initial_shared_version : null;
        return {
            objectId: o.data.objectId,
            digest: o.data.digest,
            version: o.data.version,
            initialSharedVersion: g
        };
    }), u = new Map(s.map((o, p)=>[
            o,
            l[p]
        ]));
    for (let [o, p] of n.inputs.entries()){
        if (!p.UnresolvedObject) continue;
        let g, y = u2(p.UnresolvedObject.objectId), O = u.get(y);
        p.UnresolvedObject.initialSharedVersion ?? O?.initialSharedVersion ? g = A6.SharedObjectRef({
            objectId: y,
            initialSharedVersion: p.UnresolvedObject.initialSharedVersion || O?.initialSharedVersion,
            mutable: kr(n, o)
        }) : Cr(n, o) && (g = A6.ReceivingRef({
            objectId: y,
            digest: p.UnresolvedObject.digest ?? O?.digest,
            version: p.UnresolvedObject.version ?? O?.version
        })), n.inputs[n.inputs.indexOf(p)] = g ?? A6.ObjectRef({
            objectId: y,
            digest: p.UnresolvedObject.digest ?? O?.digest,
            version: p.UnresolvedObject.version ?? O?.version
        });
    }
}
async function Or(n, e) {
    let { inputs: t, commands: s } = n, r1 = [], i = new Set;
    s.forEach((a1)=>{
        if (a1.MoveCall) {
            if (a1.MoveCall._argumentTypes) return;
            if (a1.MoveCall.arguments.map((o)=>o.$kind === "Input" ? n.inputs[o.Input] : null).some((o)=>o?.UnresolvedPure || o?.UnresolvedObject)) {
                let o = `${a1.MoveCall.package}::${a1.MoveCall.module}::${a1.MoveCall.function}`;
                i.add(o), r1.push(a1.MoveCall);
            }
        }
        switch(a1.$kind){
            case "SplitCoins":
                a1.SplitCoins.amounts.forEach((l)=>{
                    Rn(l, se.U64, n);
                });
                break;
            case "TransferObjects":
                Rn(a1.TransferObjects.address, se.Address, n);
                break;
        }
    });
    let c = new Map;
    if (i.size > 0) {
        let a1 = ve(e);
        await Promise.all([
            ...i
        ].map(async (l)=>{
            let [u, o, p] = l.split("::"), g = await a1.getNormalizedMoveFunction({
                package: u,
                module: o,
                function: p
            });
            c.set(l, g.parameters.map((y)=>It(y)));
        }));
    }
    r1.length && await Promise.all(r1.map(async (a1)=>{
        let l = c.get(`${a1.package}::${a1.module}::${a1.function}`);
        if (!l) return;
        let o = l.length > 0 && on(l.at(-1)) ? l.slice(0, l.length - 1) : l;
        a1._argumentTypes = o;
    })), s.forEach((a1)=>{
        if (!a1.MoveCall) return;
        let l = a1.MoveCall, u = `${l.package}::${l.module}::${l.function}`, o = l._argumentTypes;
        if (o) {
            if (o.length !== a1.MoveCall.arguments.length) throw new Error(`Incorrect number of arguments for ${u}`);
            o.forEach((p, g)=>{
                let y = l.arguments[g];
                if (y.$kind !== "Input") return;
                let O = t[y.Input];
                if (!O.UnresolvedPure && !O.UnresolvedObject) return;
                let ge = O.UnresolvedPure?.value ?? O.UnresolvedObject?.objectId, Te = Le(p.body);
                if (Te) {
                    y.type = "pure", t[t.indexOf(O)] = A6.Pure(Te.serialize(ge));
                    return;
                }
                if (typeof ge != "string") throw new Error(`Expect the argument to be an object id string, got ${JSON.stringify(ge, null, 2)}`);
                y.type = "object";
                let ms = O.UnresolvedPure ? {
                    $kind: "UnresolvedObject",
                    UnresolvedObject: {
                        objectId: ge
                    }
                } : O;
                t[y.Input] = ms;
            });
        }
    });
}
function jr1(n) {
    n.inputs.forEach((e, t)=>{
        if (e.$kind !== "Object" && e.$kind !== "Pure") throw new Error(`Input at index ${t} has not been resolved.  Expected a Pure or Object input, but found ${JSON.stringify(e)}`);
    });
}
function Rn(n, e, t) {
    if (n.$kind !== "Input") return;
    let s = t.inputs[n.Input];
    s.$kind === "UnresolvedPure" && (t.inputs[n.Input] = A6.Pure(e.serialize(s.UnresolvedPure.value)));
}
function kr(n, e) {
    let t = !1;
    return n.getInputUses(e, (s, r1)=>{
        if (r1.MoveCall && r1.MoveCall._argumentTypes) {
            let i = r1.MoveCall.arguments.indexOf(s);
            t = r1.MoveCall._argumentTypes[i].ref !== "&" || t;
        }
        (r1.$kind === "MakeMoveVec" || r1.$kind === "MergeCoins" || r1.$kind === "SplitCoins") && (t = !0);
    }), t;
}
function Cr(n, e) {
    let t = !1;
    return n.getInputUses(e, (s, r1)=>{
        if (r1.MoveCall && r1.MoveCall._argumentTypes) {
            let i = r1.MoveCall.arguments.indexOf(s);
            t = Mr(r1.MoveCall._argumentTypes[i]) || t;
        }
    }), t;
}
function Mr(n) {
    return typeof n.body != "object" || !("datatype" in n.body) ? !1 : n.body.datatype.package === "0x2" && n.body.datatype.module === "transfer" && n.body.datatype.type === "Receiving";
}
function ve(n) {
    if (!n.client) throw new Error("No sui client passed to Transaction#build, but transaction data was not sufficient to build offline.");
    return n.client;
}
function Ir1(n, e) {
    return Array.from({
        length: Math.ceil(n.length / e)
    }, (t, s)=>n.slice(s * e, s * e + e));
}
function dt(n) {
    function e(t) {
        return n(t);
    }
    return e.system = ()=>e("0x5"), e.clock = ()=>e("0x6"), e.random = ()=>e("0x8"), e.denyList = ()=>e("0x403"), e.option = ({ type: t, value: s })=>(r1)=>r1.moveCall({
                typeArguments: [
                    t
                ],
                target: `0x1::option::${s === null ? "none" : "some"}`,
                arguments: s === null ? [] : [
                    r1.object(s)
                ]
            }), e;
}
function pt(n) {
    function e(t, s) {
        if (typeof t == "string") return n(n2(t).serialize(s));
        if (t instanceof Uint8Array || ee1(t)) return n(t);
        throw new Error("tx.pure must be called either a bcs type name, or a serialized bcs value");
    }
    return e.u8 = (t)=>n(se.U8.serialize(t)), e.u16 = (t)=>n(se.U16.serialize(t)), e.u32 = (t)=>n(se.U32.serialize(t)), e.u64 = (t)=>n(se.U64.serialize(t)), e.u128 = (t)=>n(se.U128.serialize(t)), e.u256 = (t)=>n(se.U256.serialize(t)), e.bool = (t)=>n(se.Bool.serialize(t)), e.string = (t)=>n(se.String.serialize(t)), e.address = (t)=>n(se.Address.serialize(t)), e.id = e.address, e.vector = (t, s)=>n(se.vector(n2(t)).serialize(s)), e.option = (t, s)=>n(se.option(n2(t)).serialize(s)), e;
}
function Pn(n, e) {
    let t = Array.from(`${n}::`).map((r1)=>r1.charCodeAt(0)), s = new Uint8Array(t.length + e.length);
    return s.set(t), s.set(e, t.length), E4(s, {
        dkLen: 32
    });
}
function $n(n) {
    return u2(n).replace("0x", "");
}
var Q2 = class n {
    constructor(e){
        this.version = 2, this.sender = e?.sender ?? null, this.expiration = e?.expiration ?? null, this.inputs = e?.inputs ?? [], this.commands = e?.commands ?? [], this.gasData = e?.gasData ?? {
            budget: null,
            price: null,
            owner: null,
            payment: null
        };
    }
    static fromKindBytes(e) {
        let s = se.TransactionKind.parse(e).ProgrammableTransaction;
        if (!s) throw new Error("Unable to deserialize from bytes.");
        return n.restore({
            version: 2,
            sender: null,
            expiration: null,
            gasData: {
                budget: null,
                owner: null,
                payment: null,
                price: null
            },
            inputs: s.inputs,
            commands: s.commands
        });
    }
    static fromBytes(e) {
        let s = se.TransactionData.parse(e)?.V1, r1 = s.kind.ProgrammableTransaction;
        if (!s || !r1) throw new Error("Unable to deserialize from bytes.");
        return n.restore({
            version: 2,
            sender: s.sender,
            expiration: s.expiration,
            gasData: s.gasData,
            inputs: r1.inputs,
            commands: r1.commands
        });
    }
    static restore(e) {
        return e.version === 2 ? new n(ei(Ee, e)) : new n(ei(Ee, In(e)));
    }
    static getDigestFromBytes(e) {
        let t = Pn("TransactionData", e);
        return u1(t);
    }
    get gasConfig() {
        return this.gasData;
    }
    set gasConfig(e) {
        this.gasData = e;
    }
    build({ maxSizeBytes: e = 1 / 0, overrides: t, onlyTransactionKind: s } = {}) {
        let r1 = this.inputs, i = this.commands, c = {
            ProgrammableTransaction: {
                inputs: r1,
                commands: i
            }
        };
        if (s) return se.TransactionKind.serialize(c, {
            maxSize: e
        }).toBytes();
        let a1 = t?.expiration ?? this.expiration, l = t?.sender ?? this.sender, u = {
            ...this.gasData,
            ...t?.gasConfig,
            ...t?.gasData
        };
        if (!l) throw new Error("Missing transaction sender");
        if (!u.budget) throw new Error("Missing gas budget");
        if (!u.payment) throw new Error("Missing gas payment");
        if (!u.price) throw new Error("Missing gas price");
        let o = {
            sender: $n(l),
            expiration: a1 || {
                None: !0
            },
            gasData: {
                payment: u.payment,
                owner: $n(this.gasData.owner ?? l),
                price: BigInt(u.price),
                budget: BigInt(u.budget)
            },
            kind: {
                ProgrammableTransaction: {
                    inputs: r1,
                    commands: i
                }
            }
        };
        return se.TransactionData.serialize({
            V1: o
        }, {
            maxSize: e
        }).toBytes();
    }
    addInput(e, t) {
        let s = this.inputs.length;
        return this.inputs.push(t), {
            Input: s,
            type: e,
            $kind: "Input"
        };
    }
    getInputUses(e, t) {
        this.mapArguments((s, r1)=>(s.$kind === "Input" && s.Input === e && t(s, r1), s));
    }
    mapArguments(e) {
        for (let t of this.commands)switch(t.$kind){
            case "MoveCall":
                t.MoveCall.arguments = t.MoveCall.arguments.map((r1)=>e(r1, t));
                break;
            case "TransferObjects":
                t.TransferObjects.objects = t.TransferObjects.objects.map((r1)=>e(r1, t)), t.TransferObjects.address = e(t.TransferObjects.address, t);
                break;
            case "SplitCoins":
                t.SplitCoins.coin = e(t.SplitCoins.coin, t), t.SplitCoins.amounts = t.SplitCoins.amounts.map((r1)=>e(r1, t));
                break;
            case "MergeCoins":
                t.MergeCoins.destination = e(t.MergeCoins.destination, t), t.MergeCoins.sources = t.MergeCoins.sources.map((r1)=>e(r1, t));
                break;
            case "MakeMoveVec":
                t.MakeMoveVec.elements = t.MakeMoveVec.elements.map((r1)=>e(r1, t));
                break;
            case "Upgrade":
                t.Upgrade.ticket = e(t.Upgrade.ticket, t);
                break;
            case "$Intent":
                let s = t.$Intent.inputs;
                t.$Intent.inputs = {};
                for (let [r1, i] of Object.entries(s))t.$Intent.inputs[r1] = Array.isArray(i) ? i.map((c)=>e(c, t)) : e(i, t);
                break;
            case "Publish":
                break;
            default:
                throw new Error(`Unexpected transaction kind: ${t.$kind}`);
        }
    }
    replaceCommand(e, t) {
        if (!Array.isArray(t)) {
            this.commands[e] = t;
            return;
        }
        let s = t.length - 1;
        this.commands.splice(e, 1, ...t), s !== 0 && this.mapArguments((r1)=>{
            switch(r1.$kind){
                case "Result":
                    r1.Result > e && (r1.Result += s);
                    break;
                case "NestedResult":
                    r1.NestedResult[0] > e && (r1.NestedResult[0] += s);
                    break;
            }
            return r1;
        });
    }
    getDigest() {
        let e = this.build({
            onlyTransactionKind: !1
        });
        return n.getDigestFromBytes(e);
    }
    snapshot() {
        return ei(Ee, this);
    }
};
function zt(n) {
    if (typeof n == "string") return u2(n);
    if (n.Object) return n.Object.ImmOrOwnedObject ? u2(n.Object.ImmOrOwnedObject.objectId) : n.Object.Receiving ? u2(n.Object.Receiving.objectId) : u2(n.Object.SharedObject.objectId);
    if (n.UnresolvedObject) return u2(n.UnresolvedObject.objectId);
}
var zn = (n)=>{
    throw TypeError(n);
}, Lt = (n, e, t)=>e.has(n) || zn("Cannot " + t), f5 = (n, e, t)=>(Lt(n, e, "read from private field"), t ? t.call(n) : e.get(n)), Ke = (n, e, t)=>e.has(n) ? zn("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), Oe = (n, e, t, s)=>(Lt(n, e, "write to private field"), s ? s.call(n, t) : e.set(n, t), t), ae = (n, e, t)=>(Lt(n, e, "access private method"), t), Ye, He, je, h6, Y1, ht, Jt, Gt, qt;
function Vn(n, e = 1 / 0) {
    let t = {
        $kind: "Result",
        Result: n
    }, s = [], r1 = (i)=>s[i] ?? (s[i] = {
            $kind: "NestedResult",
            NestedResult: [
                n,
                i
            ]
        });
    return new Proxy(t, {
        set () {
            throw new Error("The transaction result is a proxy, and does not support setting properties directly");
        },
        get (i, c) {
            if (c in i) return Reflect.get(i, c);
            if (c === Symbol.iterator) return function*() {
                let l = 0;
                for(; l < e;)yield r1(l), l++;
            };
            if (typeof c == "symbol") return;
            let a1 = parseInt(c, 10);
            if (!(Number.isNaN(a1) || a1 < 0)) return r1(a1);
        }
    });
}
var Gn1 = Symbol.for("@mysten/transaction");
function Re(n) {
    return !!n && typeof n == "object" && n[Gn1] === !0;
}
var Wn = {
    buildPlugins: new Map,
    serializationPlugins: new Map
}, Dt = Symbol.for("@mysten/transaction/registry");
function Qe() {
    try {
        let n = globalThis;
        return n[Dt] || (n[Dt] = Wn), n[Dt];
    } catch  {
        return Wn;
    }
}
var xr = class Ft {
    constructor(){
        Ke(this, Y1), Ke(this, Ye), Ke(this, He), Ke(this, je, new Map), Ke(this, h6), this.object = dt((t)=>{
            if (typeof t == "function") return this.object(t(this));
            if (typeof t == "object" && di(b4, t)) return t;
            let s = zt(t), r1 = f5(this, h6).inputs.find((i)=>s === zt(i));
            return r1?.Object?.SharedObject && typeof t == "object" && t.Object?.SharedObject && (r1.Object.SharedObject.mutable = r1.Object.SharedObject.mutable || t.Object.SharedObject.mutable), r1 ? {
                $kind: "Input",
                Input: f5(this, h6).inputs.indexOf(r1),
                type: "object"
            } : f5(this, h6).addInput("object", typeof t == "string" ? {
                $kind: "UnresolvedObject",
                UnresolvedObject: {
                    objectId: u2(t)
                }
            } : t);
        });
        let e = Qe();
        Oe(this, h6, new Q2), Oe(this, He, [
            ...e.buildPlugins.values()
        ]), Oe(this, Ye, [
            ...e.serializationPlugins.values()
        ]);
    }
    static fromKind(e) {
        let t = new Ft;
        return Oe(t, h6, Q2.fromKindBytes(typeof e == "string" ? m(e) : e)), t;
    }
    static from(e) {
        let t = new Ft;
        return Re(e) ? Oe(t, h6, new Q2(e.getData())) : typeof e != "string" || !e.startsWith("{") ? Oe(t, h6, Q2.fromBytes(typeof e == "string" ? m(e) : e)) : Oe(t, h6, Q2.restore(JSON.parse(e))), t;
    }
    static registerGlobalSerializationPlugin(e, t) {
        Qe().serializationPlugins.set(e, t ?? e);
    }
    static unregisterGlobalSerializationPlugin(e) {
        Qe().serializationPlugins.delete(e);
    }
    static registerGlobalBuildPlugin(e, t) {
        Qe().buildPlugins.set(e, t ?? e);
    }
    static unregisterGlobalBuildPlugin(e) {
        Qe().buildPlugins.delete(e);
    }
    addSerializationPlugin(e) {
        f5(this, Ye).push(e);
    }
    addBuildPlugin(e) {
        f5(this, He).push(e);
    }
    addIntentResolver(e, t) {
        if (f5(this, je).has(e) && f5(this, je).get(e) !== t) throw new Error(`Intent resolver for ${e} already exists`);
        f5(this, je).set(e, t);
    }
    setSender(e) {
        f5(this, h6).sender = e;
    }
    setSenderIfNotSet(e) {
        f5(this, h6).sender || (f5(this, h6).sender = e);
    }
    setExpiration(e) {
        f5(this, h6).expiration = e ? ei(Ut, e) : null;
    }
    setGasPrice(e) {
        f5(this, h6).gasConfig.price = String(e);
    }
    setGasBudget(e) {
        f5(this, h6).gasConfig.budget = String(e);
    }
    setGasBudgetIfNotSet(e) {
        f5(this, h6).gasData.budget == null && (f5(this, h6).gasConfig.budget = String(e));
    }
    setGasOwner(e) {
        f5(this, h6).gasConfig.owner = e;
    }
    setGasPayment(e) {
        f5(this, h6).gasConfig.payment = e.map((t)=>ei(F2, t));
    }
    get blockData() {
        return $t(f5(this, h6).snapshot());
    }
    getData() {
        return f5(this, h6).snapshot();
    }
    get [Gn1]() {
        return !0;
    }
    get pure() {
        return Object.defineProperty(this, "pure", {
            enumerable: !1,
            value: pt((e)=>ee1(e) ? f5(this, h6).addInput("pure", {
                    $kind: "Pure",
                    Pure: {
                        bytes: e.toBase64()
                    }
                }) : f5(this, h6).addInput("pure", di(Et, e) ? ei(Et, e) : e instanceof Uint8Array ? A6.Pure(e) : {
                    $kind: "UnresolvedPure",
                    UnresolvedPure: {
                        value: e
                    }
                }))
        }), this.pure;
    }
    get gas() {
        return {
            $kind: "GasCoin",
            GasCoin: !0
        };
    }
    objectRef(...e) {
        return this.object(A6.ObjectRef(...e));
    }
    receivingRef(...e) {
        return this.object(A6.ReceivingRef(...e));
    }
    sharedObjectRef(...e) {
        return this.object(A6.SharedObjectRef(...e));
    }
    add(e) {
        if (typeof e == "function") return e(this);
        let t = f5(this, h6).commands.push(e);
        return Vn(t - 1);
    }
    splitCoins(e, t) {
        let s = B5.SplitCoins(typeof e == "string" ? this.object(e) : ae(this, Y1, Jt).call(this, e), t.map((i)=>typeof i == "number" || typeof i == "bigint" || typeof i == "string" ? this.pure.u64(i) : ae(this, Y1, ht).call(this, i))), r1 = f5(this, h6).commands.push(s);
        return Vn(r1 - 1, t.length);
    }
    mergeCoins(e, t) {
        return this.add(B5.MergeCoins(this.object(e), t.map((s)=>this.object(s))));
    }
    publish({ modules: e, dependencies: t }) {
        return this.add(B5.Publish({
            modules: e,
            dependencies: t
        }));
    }
    upgrade({ modules: e, dependencies: t, package: s, ticket: r1 }) {
        return this.add(B5.Upgrade({
            modules: e,
            dependencies: t,
            package: s,
            ticket: this.object(r1)
        }));
    }
    moveCall({ arguments: e, ...t }) {
        return this.add(B5.MoveCall({
            ...t,
            arguments: e?.map((s)=>ae(this, Y1, ht).call(this, s))
        }));
    }
    transferObjects(e, t) {
        return this.add(B5.TransferObjects(e.map((s)=>this.object(s)), typeof t == "string" ? this.pure.address(t) : ae(this, Y1, ht).call(this, t)));
    }
    makeMoveVec({ type: e, elements: t }) {
        return this.add(B5.MakeMoveVec({
            type: e,
            elements: t.map((s)=>this.object(s))
        }));
    }
    serialize() {
        return JSON.stringify($t(f5(this, h6).snapshot()));
    }
    async toJSON(e = {}) {
        return await this.prepareForSerialization(e), JSON.stringify(ei(Un, f5(this, h6).snapshot()), (t, s)=>typeof s == "bigint" ? s.toString() : s, 2);
    }
    async sign(e) {
        let { signer: t, ...s } = e, r1 = await this.build(s);
        return t.signTransaction(r1);
    }
    async build(e = {}) {
        return await this.prepareForSerialization(e), await ae(this, Y1, Gt).call(this, e), f5(this, h6).build({
            onlyTransactionKind: e.onlyTransactionKind
        });
    }
    async getDigest(e = {}) {
        return await ae(this, Y1, Gt).call(this, e), f5(this, h6).getDigest();
    }
    async prepareForSerialization(e) {
        let t = new Set;
        for (let r1 of f5(this, h6).commands)r1.$Intent && t.add(r1.$Intent.name);
        let s = [
            ...f5(this, Ye)
        ];
        for (let r1 of t)if (!e.supportedIntents?.includes(r1)) {
            if (!f5(this, je).has(r1)) throw new Error(`Missing intent resolver for ${r1}`);
            s.push(f5(this, je).get(r1));
        }
        await ae(this, Y1, qt).call(this, s, e);
    }
};
Ye = new WeakMap;
He = new WeakMap;
je = new WeakMap;
h6 = new WeakMap;
Y1 = new WeakSet;
ht = function(n) {
    return ee1(n) ? this.pure(n) : ae(this, Y1, Jt).call(this, n);
};
Jt = function(n) {
    return typeof n == "function" ? ei(b4, n(this)) : ei(b4, n);
};
Gt = async function(n) {
    if (!n.onlyTransactionKind && !f5(this, h6).sender) throw new Error("Missing transaction sender");
    await ae(this, Y1, qt).call(this, [
        ...f5(this, He),
        xn
    ], n);
};
qt = async function(n, e) {
    let t = (s)=>{
        if (s >= n.length) return ()=>{};
        let r1 = n[s];
        return async ()=>{
            let i = t(s + 1), c = !1, a1 = !1;
            if (await r1(f5(this, h6), e, async ()=>{
                if (c) throw new Error(`next() was call multiple times in TransactionPlugin ${s}`);
                c = !0, await i(), a1 = !0;
            }), !c) throw new Error(`next() was not called in TransactionPlugin ${s}`);
            if (!a1) throw new Error(`next() was not awaited in TransactionPlugin ${s}`);
        };
    };
    await t(0)();
};
var Xe = xr;
var ke, _7, mt;
ke = new WeakMap;
_7 = new WeakMap;
mt = new WeakMap;
var xe1, Pe;
xe1 = new WeakMap;
Pe = new WeakMap;
var fe2, Ce1;
fe2 = new WeakMap;
Ce1 = new WeakMap;
var wt, tt, X1, yt, Zt, vt;
wt = new WeakMap;
tt = new WeakMap;
X1 = new WeakMap;
yt = new WeakMap;
Zt = new WeakMap;
vt = new WeakMap;
function Ot(n) {
    if (!n.V2) throw new Error("Unexpected effects version");
    let e = n.V2.changedObjects[n.V2.gasObjectIndex];
    if (!e) throw new Error("Gas object not found in effects");
    let [t, { outputState: s }] = e;
    if (!s.ObjectWrite) throw new Error("Unexpected gas object state");
    let [r1, i] = s.ObjectWrite;
    return {
        ref: {
            objectId: t,
            digest: r1,
            version: n.V2.lamportVersion
        },
        owner: i.AddressOwner || i.ObjectOwner
    };
}
var ts = (n)=>{
    throw TypeError(n);
}, sn = (n, e, t)=>e.has(n) || ts("Cannot " + t), d5 = (n, e, t)=>(sn(n, e, "read from private field"), t ? t.call(n) : e.get(n)), j3 = (n, e, t, s)=>(sn(n, e, "write to private field"), s ? s.call(n, t) : e.set(n, t), t), D4 = (n, e, t)=>(sn(n, e, "access private method"), t), es = (n, e, t, s)=>({
        set _ (r){
            j3(n, e, r, t);
        },
        get _ () {
            return d5(n, e, s);
        }
    }), he1, ne, kt, rt, st, it, Ct, We, $3, me1, Ie, Me, rn, jt, at, Ve, ze, oe, W, ot, an, rs, tn, is;
he1 = new WeakMap;
ne = new WeakMap;
kt = new WeakMap;
rt = new WeakMap;
st = new WeakMap;
it = new WeakMap;
Ct = new WeakMap;
We = new WeakMap;
$3 = new WeakMap;
me1 = new WeakMap;
Ie = new WeakMap;
Me = new WeakMap;
rn = new WeakMap;
jt = new WeakMap;
at = new WeakMap;
Ve = new WeakMap;
ze = new WeakMap;
oe = new WeakMap;
W = new WeakSet;
(async function(n) {
    let e = new Set, t = !1;
    return n.addSerializationPlugin(async (s, r1, i)=>{
        await i(), !t && (t = !0, s.inputs.forEach((c)=>{
            c.Object?.ImmOrOwnedObject?.objectId ? e.add(c.Object.ImmOrOwnedObject.objectId) : c.Object?.Receiving?.objectId ? e.add(c.Object.Receiving.objectId) : c.UnresolvedObject?.objectId && !c.UnresolvedObject.initialSharedVersion && e.add(c.UnresolvedObject.objectId);
        }));
    }), await n.prepareForSerialization({
        client: d5(this, ne)
    }), e;
});
(async function(n, e, t) {
    let s;
    try {
        n.setSenderIfNotSet(d5(this, he1).toSuiAddress()), await d5(this, rn).runTask(async ()=>{
            n.getData().gasData.price || n.setGasPrice(await D4(this, W, tn).call(this)), n.setGasBudgetIfNotSet(d5(this, Ct)), await D4(this, W, ot).call(this), s = await D4(this, W, rs).call(this), es(this, ze)._++, n.setGasPayment([
                {
                    objectId: s.id,
                    version: s.version,
                    digest: s.digest
                }
            ]), await d5(this, Ie).buildTransaction({
                transaction: n,
                onlyTransactionKind: !0
            });
        });
        let r1 = await n.build({
            client: d5(this, ne)
        }), { signature: i } = await d5(this, he1).signTransaction(r1), c = await d5(this, Ie).executeTransaction({
            transaction: r1,
            signature: i,
            options: {
                ...t,
                showEffects: !0
            }
        }), a1 = Uint8Array.from(c.rawEffects), l = se.TransactionEffects.parse(a1), u = Ot(l), o = l.V2?.gasUsed;
        if (s && o && u.owner === d5(this, he1).toSuiAddress()) {
            let p = BigInt(o.computationCost) + BigInt(o.storageCost) + BigInt(o.storageCost) - BigInt(o.storageRebate), g = !1;
            new Q2(n.getData()).mapArguments((y)=>(y.$kind === "GasCoin" && (g = !0), y)), !g && s.balance >= d5(this, st) ? d5(this, me1).push({
                id: u.ref.objectId,
                version: u.ref.version,
                digest: u.ref.digest,
                balance: s.balance - p
            }) : (d5(this, $3) || j3(this, $3, new Map), d5(this, $3).set(u.ref.objectId, u.ref));
        }
        return j3(this, at, c.digest), {
            digest: c.digest,
            effects: y(a1),
            data: c
        };
    } catch (r1) {
        throw s && (d5(this, $3) || j3(this, $3, new Map), d5(this, $3).set(s.id, null)), await D4(this, W, ot).call(this, async ()=>{
            await Promise.all([
                d5(this, Ie).cache.deleteObjects([
                    ...e
                ]),
                D4(this, W, an).call(this)
            ]);
        }), r1;
    } finally{
        e.forEach((r1)=>{
            let i = d5(this, Me).get(r1);
            i && i.length > 0 ? i.shift()() : i && d5(this, Me).delete(r1);
        }), es(this, ze)._--;
    }
});
ot = async function(n) {
    d5(this, Ve) && await d5(this, Ve), j3(this, Ve, n?.().then(()=>{
        j3(this, Ve, null);
    }, ()=>{}) ?? null);
};
an = async function() {
    let n = d5(this, at);
    n && (j3(this, at, null), await d5(this, ne).waitForTransaction({
        digest: n
    }));
};
rs = async function() {
    if (d5(this, me1).length === 0 && d5(this, ze) <= d5(this, We) && await D4(this, W, is).call(this), d5(this, me1).length === 0) throw new Error("No coins available");
    return d5(this, me1).shift();
};
tn = async function() {
    if ((d5(this, oe) ? d5(this, oe).expiration - d5(this, it) - Date.now() : 0) > 0) return d5(this, oe).price;
    if (d5(this, oe)) {
        let t = Math.max(d5(this, oe).expiration + d5(this, it) - Date.now(), 1e3);
        await new Promise((s)=>setTimeout(s, t));
    }
    let e = await d5(this, ne).getLatestSuiSystemState();
    return j3(this, oe, {
        price: BigInt(e.referenceGasPrice),
        expiration: Number.parseInt(e.epochStartTimestampMs, 10) + Number.parseInt(e.epochDurationMs, 10)
    }), D4(this, W, tn).call(this);
};
is = async function() {
    let n = Math.min(d5(this, kt), d5(this, We) - (d5(this, me1).length + d5(this, ze)) + 1);
    if (n === 0) return;
    let e = new Xe, t = d5(this, he1).toSuiAddress();
    if (e.setSender(t), d5(this, $3)) {
        let u = [], o = [];
        for (let [p, g] of d5(this, $3))g ? u.push(g) : o.push(p);
        if (o.length > 0) {
            let p = await d5(this, ne).multiGetObjects({
                ids: o
            });
            u.push(...p.filter((g)=>g.data !== null).map(({ data: g })=>({
                    objectId: g.objectId,
                    version: g.version,
                    digest: g.digest
                })));
        }
        e.setGasPayment(u), j3(this, $3, new Map);
    }
    let s = new Array(n).fill(d5(this, rt)), r1 = e.splitCoins(e.gas, s), i = [];
    for(let u = 0; u < s.length; u++)i.push(r1[u]);
    e.transferObjects(i, t), await this.waitForLastTransaction();
    let c = await d5(this, ne).signAndExecuteTransaction({
        transaction: e,
        signer: d5(this, he1),
        options: {
            showRawEffects: !0
        }
    }), a1 = se.TransactionEffects.parse(Uint8Array.from(c.rawEffects));
    a1.V2?.changedObjects.forEach(([u, { outputState: o }], p)=>{
        p === a1.V2?.gasObjectIndex || !o.ObjectWrite || d5(this, me1).push({
            id: u,
            version: a1.V2.lamportVersion,
            digest: o.ObjectWrite[0],
            balance: BigInt(d5(this, rt))
        });
    }), d5(this, $3) || j3(this, $3, new Map);
    let l = Ot(a1).ref;
    d5(this, $3).set(l.objectId, l), await d5(this, ne).waitForTransaction({
        digest: c.digest
    });
};
S2("0x2::sui::SUI");
jr({
    type: Xr(),
    balance: Hn()
});
({
    pure: pt((n)=>(e)=>e.pure(n)),
    object: dt((n)=>(e)=>e.object(n)),
    sharedObjectRef: (...n)=>(e)=>e.sharedObjectRef(...n),
    objectRef: (...n)=>(e)=>e.objectRef(...n),
    receivingRef: (...n)=>(e)=>e.receivingRef(...n)
});
var D5 = "1.24.0", z3 = "1.45.0";
var Y2 = {
    "-32700": "ParseError",
    "-32701": "OversizedRequest",
    "-32702": "OversizedResponse",
    "-32600": "InvalidRequest",
    "-32601": "MethodNotFound",
    "-32602": "InvalidParams",
    "-32603": "InternalError",
    "-32604": "ServerBusy",
    "-32000": "CallExecutionFailed",
    "-32001": "UnknownError",
    "-32003": "SubscriptionClosed",
    "-32004": "SubscriptionClosedWithError",
    "-32005": "BatchesNotSupported",
    "-32006": "TooManySubscriptions",
    "-32050": "TransientError",
    "-32002": "TransactionExecutionClientError"
}, _8 = class extends Error {
}, h7 = class extends _8 {
    constructor(t, e){
        super(t), this.code = e, this.type = Y2[e] ?? "ServerError";
    }
}, S7 = class extends _8 {
    constructor(t, e, r1){
        super(t), this.status = e, this.statusText = r1;
    }
};
var G1 = (s)=>{
    throw TypeError(s);
}, O5 = (s, t, e)=>t.has(s) || G1("Cannot " + e), o1 = (s, t, e)=>(O5(s, t, "read from private field"), e ? e.call(s) : t.get(s)), l6 = (s, t, e)=>t.has(s) ? G1("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), w5 = (s, t, e, r1)=>(O5(s, t, "write to private field"), r1 ? r1.call(s, e) : t.set(s, e), e), L2 = (s, t, e)=>(O5(s, t, "access private method"), e), Q3 = (s, t, e, r1)=>({
        set _ (a){
            w5(s, t, a, e);
        },
        get _ () {
            return o1(s, t, r1);
        }
    }), p8, k3, u6, m6, b5, g5, q3, U4, V3;
function X2(s) {
    let t = new URL(s);
    return t.protocol = t.protocol.replace("http", "ws"), t.toString();
}
var Z = {
    WebSocketConstructor: typeof WebSocket < "u" ? WebSocket : void 0,
    callTimeout: 3e4,
    reconnectTimeout: 3e3,
    maxReconnects: 5
}, x6 = class {
    constructor(t, e = {}){
        if (l6(this, q3), l6(this, p8, 0), l6(this, k3, 0), l6(this, u6, null), l6(this, m6, null), l6(this, b5, new Set), l6(this, g5, new Map), this.endpoint = t, this.options = {
            ...Z,
            ...e
        }, !this.options.WebSocketConstructor) throw new Error("Missing WebSocket constructor");
        this.endpoint.startsWith("http") && (this.endpoint = X2(this.endpoint));
    }
    async makeRequest(t, e) {
        let r1 = await L2(this, q3, U4).call(this);
        return new Promise((a1, i)=>{
            w5(this, p8, o1(this, p8) + 1), o1(this, g5).set(o1(this, p8), {
                resolve: a1,
                reject: i,
                timeout: setTimeout(()=>{
                    o1(this, g5).delete(o1(this, p8)), i(new Error(`Request timeout: ${t}`));
                }, this.options.callTimeout)
            }), r1.send(JSON.stringify({
                jsonrpc: "2.0",
                id: o1(this, p8),
                method: t,
                params: e
            }));
        }).then(({ error: a1, result: i })=>{
            if (a1) throw new h7(a1.message, a1.code);
            return i;
        });
    }
    async subscribe(t) {
        let e = new N4(t);
        return o1(this, b5).add(e), await e.subscribe(this), ()=>e.unsubscribe(this);
    }
};
p8 = new WeakMap;
k3 = new WeakMap;
u6 = new WeakMap;
m6 = new WeakMap;
b5 = new WeakMap;
g5 = new WeakMap;
q3 = new WeakSet;
U4 = function() {
    return o1(this, m6) ? o1(this, m6) : (w5(this, m6, new Promise((s)=>{
        o1(this, u6)?.close(), w5(this, u6, new this.options.WebSocketConstructor(this.endpoint)), o1(this, u6).addEventListener("open", ()=>{
            w5(this, k3, 0), s(o1(this, u6));
        }), o1(this, u6).addEventListener("close", ()=>{
            Q3(this, k3)._++, o1(this, k3) <= this.options.maxReconnects && setTimeout(()=>{
                L2(this, q3, V3).call(this);
            }, this.options.reconnectTimeout);
        }), o1(this, u6).addEventListener("message", ({ data: t })=>{
            let e;
            try {
                e = JSON.parse(t);
            } catch (r1) {
                console.error(new Error(`Failed to parse RPC message: ${t}`, {
                    cause: r1
                }));
                return;
            }
            if ("id" in e && e.id != null && o1(this, g5).has(e.id)) {
                let { resolve: r1, timeout: a1 } = o1(this, g5).get(e.id);
                clearTimeout(a1), r1(e);
            } else if ("params" in e) {
                let { params: r1 } = e;
                o1(this, b5).forEach((a1)=>{
                    a1.subscriptionId === r1.subscription && r1.subscription === a1.subscriptionId && a1.onMessage(r1.result);
                });
            }
        });
    })), o1(this, m6));
};
V3 = async function() {
    return o1(this, u6)?.close(), w5(this, m6, null), Promise.allSettled([
        ...o1(this, b5)
    ].map((s)=>s.subscribe(this)));
};
var N4 = class {
    constructor(t){
        this.subscriptionId = null, this.subscribed = !1, this.input = t;
    }
    onMessage(t) {
        this.subscribed && this.input.onMessage(t);
    }
    async unsubscribe(t) {
        let { subscriptionId: e } = this;
        return this.subscribed = !1, e == null ? !1 : (this.subscriptionId = null, t.makeRequest(this.input.unsubscribe, [
            e
        ]));
    }
    async subscribe(t) {
        this.subscriptionId = null, this.subscribed = !0;
        let e = await t.makeRequest(this.input.method, this.input.params);
        this.subscribed && (this.subscriptionId = e);
    }
};
var $4 = (s)=>{
    throw TypeError(s);
}, R2 = (s, t, e)=>t.has(s) || $4("Cannot " + e), n4 = (s, t, e)=>(R2(s, t, "read from private field"), e ? e.call(s) : t.get(s)), C4 = (s, t, e)=>t.has(s) ? $4("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), P3 = (s, t, e, r1)=>(R2(s, t, "write to private field"), r1 ? r1.call(s, e) : t.set(s, e), e), tt1 = (s, t, e)=>(R2(s, t, "access private method"), e), v5, c5, T6, W1, j4, E5 = class {
    constructor(t){
        C4(this, W1), C4(this, v5, 0), C4(this, c5), C4(this, T6), P3(this, c5, t);
    }
    fetch(t, e) {
        let r1 = n4(this, c5).fetch ?? fetch;
        if (!r1) throw new Error("The current environment does not support fetch, you can provide a fetch implementation in the options for SuiHTTPTransport.");
        return r1(t, e);
    }
    async request(t) {
        P3(this, v5, n4(this, v5) + 1);
        let e = await this.fetch(n4(this, c5).rpc?.url ?? n4(this, c5).url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Client-Sdk-Type": "typescript",
                "Client-Sdk-Version": D5,
                "Client-Target-Api-Version": z3,
                "Client-Request-Method": t.method,
                ...n4(this, c5).rpc?.headers
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: n4(this, v5),
                method: t.method,
                params: t.params
            })
        });
        if (!e.ok) throw new S7(`Unexpected status code: ${e.status}`, e.status, e.statusText);
        let r1 = await e.json();
        if ("error" in r1 && r1.error != null) throw new h7(r1.error.message, r1.error.code);
        return r1.result;
    }
    async subscribe(t) {
        let e = await tt1(this, W1, j4).call(this).subscribe(t);
        return async ()=>!!await e();
    }
};
v5 = new WeakMap;
c5 = new WeakMap;
T6 = new WeakMap;
W1 = new WeakSet;
j4 = function() {
    if (!n4(this, T6)) {
        let s = n4(this, c5).WebSocketConstructor ?? WebSocket;
        if (!s) throw new Error("The current environment does not support WebSocket, you can provide a WebSocketConstructor in the options for SuiHTTPTransport.");
        P3(this, T6, new x6(n4(this, c5).websocket?.url ?? n4(this, c5).url, {
            WebSocketConstructor: s,
            ...n4(this, c5).websocket
        }));
    }
    return n4(this, T6);
};
function et(s) {
    switch(s){
        case "mainnet":
            return "https://fullnode.mainnet.sui.io:443";
        case "testnet":
            return "https://fullnode.testnet.sui.io:443";
        case "devnet":
            return "https://fullnode.devnet.sui.io:443";
        case "localnet":
            return "http://127.0.0.1:9000";
        default:
            throw new Error(`Unknown network: ${s}`);
    }
}
var J2 = Symbol.for("@mysten/SuiClient");
var F3 = class {
    get [J2]() {
        return !0;
    }
    constructor(t){
        this.transport = t.transport ?? new E5({
            url: t.url
        });
    }
    async getRpcApiVersion() {
        return (await this.transport.request({
            method: "rpc.discover",
            params: []
        })).info.version;
    }
    async getCoins(t) {
        if (!t.owner || !m1(u2(t.owner))) throw new Error("Invalid Sui address");
        return await this.transport.request({
            method: "suix_getCoins",
            params: [
                t.owner,
                t.coinType,
                t.cursor,
                t.limit
            ]
        });
    }
    async getAllCoins(t) {
        if (!t.owner || !m1(u2(t.owner))) throw new Error("Invalid Sui address");
        return await this.transport.request({
            method: "suix_getAllCoins",
            params: [
                t.owner,
                t.cursor,
                t.limit
            ]
        });
    }
    async getBalance(t) {
        if (!t.owner || !m1(u2(t.owner))) throw new Error("Invalid Sui address");
        return await this.transport.request({
            method: "suix_getBalance",
            params: [
                t.owner,
                t.coinType
            ]
        });
    }
    async getAllBalances(t) {
        if (!t.owner || !m1(u2(t.owner))) throw new Error("Invalid Sui address");
        return await this.transport.request({
            method: "suix_getAllBalances",
            params: [
                t.owner
            ]
        });
    }
    async getCoinMetadata(t) {
        return await this.transport.request({
            method: "suix_getCoinMetadata",
            params: [
                t.coinType
            ]
        });
    }
    async getTotalSupply(t) {
        return await this.transport.request({
            method: "suix_getTotalSupply",
            params: [
                t.coinType
            ]
        });
    }
    async call(t, e) {
        return await this.transport.request({
            method: t,
            params: e
        });
    }
    async getMoveFunctionArgTypes(t) {
        return await this.transport.request({
            method: "sui_getMoveFunctionArgTypes",
            params: [
                t.package,
                t.module,
                t.function
            ]
        });
    }
    async getNormalizedMoveModulesByPackage(t) {
        return await this.transport.request({
            method: "sui_getNormalizedMoveModulesByPackage",
            params: [
                t.package
            ]
        });
    }
    async getNormalizedMoveModule(t) {
        return await this.transport.request({
            method: "sui_getNormalizedMoveModule",
            params: [
                t.package,
                t.module
            ]
        });
    }
    async getNormalizedMoveFunction(t) {
        return await this.transport.request({
            method: "sui_getNormalizedMoveFunction",
            params: [
                t.package,
                t.module,
                t.function
            ]
        });
    }
    async getNormalizedMoveStruct(t) {
        return await this.transport.request({
            method: "sui_getNormalizedMoveStruct",
            params: [
                t.package,
                t.module,
                t.struct
            ]
        });
    }
    async getOwnedObjects(t) {
        if (!t.owner || !m1(u2(t.owner))) throw new Error("Invalid Sui address");
        return await this.transport.request({
            method: "suix_getOwnedObjects",
            params: [
                t.owner,
                {
                    filter: t.filter,
                    options: t.options
                },
                t.cursor,
                t.limit
            ]
        });
    }
    async getObject(t) {
        if (!t.id || !$1(I2(t.id))) throw new Error("Invalid Sui Object id");
        return await this.transport.request({
            method: "sui_getObject",
            params: [
                t.id,
                t.options
            ]
        });
    }
    async tryGetPastObject(t) {
        return await this.transport.request({
            method: "sui_tryGetPastObject",
            params: [
                t.id,
                t.version,
                t.options
            ]
        });
    }
    async multiGetObjects(t) {
        if (t.ids.forEach((r1)=>{
            if (!r1 || !$1(I2(r1))) throw new Error(`Invalid Sui Object id ${r1}`);
        }), t.ids.length !== new Set(t.ids).size) throw new Error(`Duplicate object ids in batch call ${t.ids}`);
        return await this.transport.request({
            method: "sui_multiGetObjects",
            params: [
                t.ids,
                t.options
            ]
        });
    }
    async queryTransactionBlocks(t) {
        return await this.transport.request({
            method: "suix_queryTransactionBlocks",
            params: [
                {
                    filter: t.filter,
                    options: t.options
                },
                t.cursor,
                t.limit,
                (t.order || "descending") === "descending"
            ]
        });
    }
    async getTransactionBlock(t) {
        if (!p1(t.digest)) throw new Error("Invalid Transaction digest");
        return await this.transport.request({
            method: "sui_getTransactionBlock",
            params: [
                t.digest,
                t.options
            ]
        });
    }
    async multiGetTransactionBlocks(t) {
        if (t.digests.forEach((r1)=>{
            if (!p1(r1)) throw new Error(`Invalid Transaction digest ${r1}`);
        }), t.digests.length !== new Set(t.digests).size) throw new Error(`Duplicate digests in batch call ${t.digests}`);
        return await this.transport.request({
            method: "sui_multiGetTransactionBlocks",
            params: [
                t.digests,
                t.options
            ]
        });
    }
    async executeTransactionBlock({ transactionBlock: t, signature: e, options: r1, requestType: a1 }) {
        let i = await this.transport.request({
            method: "sui_executeTransactionBlock",
            params: [
                typeof t == "string" ? t : y(t),
                Array.isArray(e) ? e : [
                    e
                ],
                r1
            ]
        });
        if (a1 === "WaitForLocalExecution") try {
            await this.waitForTransaction({
                digest: i.digest
            });
        } catch  {}
        return i;
    }
    async signAndExecuteTransaction({ transaction: t, signer: e, ...r1 }) {
        let a1;
        t instanceof Uint8Array ? a1 = t : (t.setSenderIfNotSet(e.toSuiAddress()), a1 = await t.build({
            client: this
        }));
        let { signature: i, bytes: d } = await e.signTransaction(a1);
        return this.executeTransactionBlock({
            transactionBlock: d,
            signature: i,
            ...r1
        });
    }
    async getTotalTransactionBlocks() {
        let t = await this.transport.request({
            method: "sui_getTotalTransactionBlocks",
            params: []
        });
        return BigInt(t);
    }
    async getReferenceGasPrice() {
        let t = await this.transport.request({
            method: "suix_getReferenceGasPrice",
            params: []
        });
        return BigInt(t);
    }
    async getStakes(t) {
        if (!t.owner || !m1(u2(t.owner))) throw new Error("Invalid Sui address");
        return await this.transport.request({
            method: "suix_getStakes",
            params: [
                t.owner
            ]
        });
    }
    async getStakesByIds(t) {
        return t.stakedSuiIds.forEach((e)=>{
            if (!e || !$1(I2(e))) throw new Error(`Invalid Sui Stake id ${e}`);
        }), await this.transport.request({
            method: "suix_getStakesByIds",
            params: [
                t.stakedSuiIds
            ]
        });
    }
    async getLatestSuiSystemState() {
        return await this.transport.request({
            method: "suix_getLatestSuiSystemState",
            params: []
        });
    }
    async queryEvents(t) {
        return await this.transport.request({
            method: "suix_queryEvents",
            params: [
                t.query,
                t.cursor,
                t.limit,
                (t.order || "descending") === "descending"
            ]
        });
    }
    async subscribeEvent(t) {
        return this.transport.subscribe({
            method: "suix_subscribeEvent",
            unsubscribe: "suix_unsubscribeEvent",
            params: [
                t.filter
            ],
            onMessage: t.onMessage
        });
    }
    async subscribeTransaction(t) {
        return this.transport.subscribe({
            method: "suix_subscribeTransaction",
            unsubscribe: "suix_unsubscribeTransaction",
            params: [
                t.filter
            ],
            onMessage: t.onMessage
        });
    }
    async devInspectTransactionBlock(t) {
        let e;
        if (Re(t.transactionBlock)) t.transactionBlock.setSenderIfNotSet(t.sender), e = y(await t.transactionBlock.build({
            client: this,
            onlyTransactionKind: !0
        }));
        else if (typeof t.transactionBlock == "string") e = t.transactionBlock;
        else if (t.transactionBlock instanceof Uint8Array) e = y(t.transactionBlock);
        else throw new Error("Unknown transaction block format.");
        return await this.transport.request({
            method: "sui_devInspectTransactionBlock",
            params: [
                t.sender,
                e,
                t.gasPrice?.toString(),
                t.epoch
            ]
        });
    }
    async dryRunTransactionBlock(t) {
        return await this.transport.request({
            method: "sui_dryRunTransactionBlock",
            params: [
                typeof t.transactionBlock == "string" ? t.transactionBlock : y(t.transactionBlock)
            ]
        });
    }
    async getDynamicFields(t) {
        if (!t.parentId || !$1(I2(t.parentId))) throw new Error("Invalid Sui Object id");
        return await this.transport.request({
            method: "suix_getDynamicFields",
            params: [
                t.parentId,
                t.cursor,
                t.limit
            ]
        });
    }
    async getDynamicFieldObject(t) {
        return await this.transport.request({
            method: "suix_getDynamicFieldObject",
            params: [
                t.parentId,
                t.name
            ]
        });
    }
    async getLatestCheckpointSequenceNumber() {
        let t = await this.transport.request({
            method: "sui_getLatestCheckpointSequenceNumber",
            params: []
        });
        return String(t);
    }
    async getCheckpoint(t) {
        return await this.transport.request({
            method: "sui_getCheckpoint",
            params: [
                t.id
            ]
        });
    }
    async getCheckpoints(t) {
        return await this.transport.request({
            method: "sui_getCheckpoints",
            params: [
                t.cursor,
                t?.limit,
                t.descendingOrder
            ]
        });
    }
    async getCommitteeInfo(t) {
        return await this.transport.request({
            method: "suix_getCommitteeInfo",
            params: [
                t?.epoch
            ]
        });
    }
    async getNetworkMetrics() {
        return await this.transport.request({
            method: "suix_getNetworkMetrics",
            params: []
        });
    }
    async getAddressMetrics() {
        return await this.transport.request({
            method: "suix_getLatestAddressMetrics",
            params: []
        });
    }
    async getEpochMetrics(t) {
        return await this.transport.request({
            method: "suix_getEpochMetrics",
            params: [
                t?.cursor,
                t?.limit,
                t?.descendingOrder
            ]
        });
    }
    async getAllEpochAddressMetrics(t) {
        return await this.transport.request({
            method: "suix_getAllEpochAddressMetrics",
            params: [
                t?.descendingOrder
            ]
        });
    }
    async getEpochs(t) {
        return await this.transport.request({
            method: "suix_getEpochs",
            params: [
                t?.cursor,
                t?.limit,
                t?.descendingOrder
            ]
        });
    }
    async getMoveCallMetrics() {
        return await this.transport.request({
            method: "suix_getMoveCallMetrics",
            params: []
        });
    }
    async getCurrentEpoch() {
        return await this.transport.request({
            method: "suix_getCurrentEpoch",
            params: []
        });
    }
    async getValidatorsApy() {
        return await this.transport.request({
            method: "suix_getValidatorsApy",
            params: []
        });
    }
    async getChainIdentifier() {
        let t = await this.getCheckpoint({
            id: "0"
        }), e = w1(t.digest);
        return g(e.slice(0, 4));
    }
    async resolveNameServiceAddress(t) {
        return await this.transport.request({
            method: "suix_resolveNameServiceAddress",
            params: [
                t.name
            ]
        });
    }
    async resolveNameServiceNames({ format: t = "dot", ...e }) {
        let { nextCursor: r1, hasNextPage: a1, data: i } = await this.transport.request({
            method: "suix_resolveNameServiceNames",
            params: [
                e.address,
                e.cursor,
                e.limit
            ]
        });
        return {
            hasNextPage: a1,
            nextCursor: r1,
            data: i.map((d)=>S3(d, t))
        };
    }
    async getProtocolConfig(t) {
        return await this.transport.request({
            method: "sui_getProtocolConfig",
            params: [
                t?.version
            ]
        });
    }
    async waitForTransaction({ signal: t, timeout: e = 60 * 1e3, pollInterval: r1 = 2 * 1e3, ...a1 }) {
        let i = AbortSignal.timeout(e), d = new Promise((K, A)=>{
            i.addEventListener("abort", ()=>A(i.reason));
        });
        for(d.catch(()=>{}); !i.aborted;){
            t?.throwIfAborted();
            try {
                return await this.getTransactionBlock(a1);
            } catch  {
                await Promise.race([
                    new Promise((A)=>setTimeout(A, r1)),
                    d
                ]);
            }
        }
        throw i.throwIfAborted(), new Error("Unexpected error while waiting for transaction block.");
    }
};
export { et as getFullnodeUrl, F3 as SuiClient };
