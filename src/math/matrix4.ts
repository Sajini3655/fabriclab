import {Vector3} from "./vector3";

export type Matrix4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
];

export function identity(): Matrix4 {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

export function translation(a: Vector3): Matrix4 {
    const mat = identity();
    mat[12] = a.x;
    mat[13] = a.y;
    mat[14] = a.z;
    return mat;
}

export function rotation(a: Vector3): Matrix4 {
    return rotateZMut(rotateYMut(rotateXMut(identity(), a.x), a.y), a.z);
}

export function rotateXMut(a: Matrix4, rad: number): Matrix4 {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    a[4] = a10 * c + a20 * s;
    a[5] = a11 * c + a21 * s;
    a[6] = a12 * c + a22 * s;
    a[7] = a13 * c + a23 * s;
    a[8] = a20 * c - a10 * s;
    a[9] = a21 * c - a11 * s;
    a[10] = a22 * c - a12 * s;
    a[11] = a23 * c - a13 * s;
    return a;
}

export function rotateYMut(a: Matrix4, rad: number): Matrix4 {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    a[0] = a00 * c - a20 * s;
    a[1] = a01 * c - a21 * s;
    a[2] = a02 * c - a22 * s;
    a[3] = a03 * c - a23 * s;
    a[8] = a00 * s + a20 * c;
    a[9] = a01 * s + a21 * c;
    a[10] = a02 * s + a22 * c;
    a[11] = a03 * s + a23 * c;
    return a;
}

export function rotateZMut(a: Matrix4, rad: number): Matrix4 {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    a[0] = a00 * c + a10 * s;
    a[1] = a01 * c + a11 * s;
    a[2] = a02 * c + a12 * s;
    a[3] = a03 * c + a13 * s;
    a[4] = a10 * c - a00 * s;
    a[5] = a11 * c - a01 * s;
    a[6] = a12 * c - a02 * s;
    a[7] = a13 * c - a03 * s;
    return a;
}

export function mul(a: Matrix4, b: Matrix4): Matrix4 {
    const out = identity();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            out[i * 4 + j] =
                a[0 * 4 + j] * b[i * 4 + 0] +
                a[1 * 4 + j] * b[i * 4 + 1] +
                a[2 * 4 + j] * b[i * 4 + 2] +
                a[3 * 4 + j] * b[i * 4 + 3];
        }
    }
    return out;
}

export function mulMut(a: Matrix4, b: Matrix4): Matrix4 {
    const res = mul(a, b);
    for (let i = 0; i < 16; i++) a[i] = res[i];
    return a;
}

export function perspective(fovy: number, near: number, far: number, aspect: number): Matrix4 {
    const f = 1.0 / Math.tan(fovy / 2);
    const nearFar = 1 / (near - far);
    const mat = identity();
    mat[0] = f / aspect;
    mat[5] = f;
    mat[10] = (far + near) * nearFar;
    mat[11] = -1;
    mat[14] = 2 * far * near * nearFar;
    return mat;
}

export function inverse(m: Matrix4): Matrix4 {
    const inv: Matrix4 = identity();
    const [
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33
    ] = m;

    const b00 = m00 * m11 - m01 * m10;
    const b01 = m00 * m12 - m02 * m10;
    const b02 = m00 * m13 - m03 * m10;
    const b03 = m01 * m12 - m02 * m11;
    const b04 = m01 * m13 - m03 * m11;
    const b05 = m02 * m13 - m03 * m12;
    const b06 = m20 * m31 - m21 * m30;
    const b07 = m20 * m32 - m22 * m30;
    const b08 = m20 * m33 - m23 * m30;
    const b09 = m21 * m32 - m22 * m31;
    const b10 = m21 * m33 - m23 * m31;
    const b11 = m22 * m33 - m23 * m32;

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (Math.abs(det) < 1e-12) return identity();
    det = 1.0 / det;

    inv[0] = (m11 * b11 - m12 * b10 + m13 * b09) * det;
    inv[1] = (-m01 * b11 + m02 * b10 - m03 * b09) * det;
    inv[2] = (m31 * b05 - m32 * b04 + m33 * b03) * det;
    inv[3] = (-m21 * b05 + m22 * b04 - m23 * b03) * det;
    inv[4] = (-m10 * b11 + m12 * b08 - m13 * b07) * det;
    inv[5] = (m00 * b11 - m02 * b08 + m03 * b07) * det;
    inv[6] = (-m30 * b05 + m32 * b02 - m33 * b01) * det;
    inv[7] = (m20 * b05 - m22 * b02 + m23 * b01) * det;
    inv[8] = (m10 * b10 - m11 * b08 + m13 * b06) * det;
    inv[9] = (-m00 * b10 + m01 * b08 - m03 * b06) * det;
    inv[10] = (m30 * b04 - m31 * b02 + m33 * b00) * det;
    inv[11] = (-m20 * b04 + m21 * b02 - m23 * b00) * det;
    inv[12] = (-m10 * b09 + m11 * b07 - m12 * b06) * det;
    inv[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det;
    inv[14] = (-m30 * b03 + m31 * b01 - m32 * b00) * det;
    inv[15] = (m20 * b03 - m21 * b01 + m22 * b00) * det;

    return inv;
}

export function transformVec4(m: Matrix4, v: [number, number, number, number]): [number, number, number, number] {
    return [
        m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
        m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
        m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
        m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3]
    ];
}
