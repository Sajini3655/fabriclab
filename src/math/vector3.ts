export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export function create(x: number, y: number, z: number): Vector3 {
    return { x, y, z };
}

export function zero(): Vector3 {
    return { x: 0, y: 0, z: 0 };
}

export function distance(a: Vector3, b: Vector3): number {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    return Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by) + (az - bz) * (az - bz));
}

export function length(a: Vector3): number {
    return Math.sqrt(squaredLength(a));
}

export function squaredLength(a: Vector3): number {
    return a.x * a.x + a.y * a.y + a.z * a.z;
}

export function dot(a: Vector3, b: Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function clone(a: Vector3): Vector3 {
    return { x: a.x, y: a.y, z: a.z };
}

export function negate(a: Vector3): Vector3 {
    return { x: -a.x, y: -a.y, z: -a.z };
}

export function negateMut(a: Vector3): Vector3 {
    a.x *= -1; a.y *= -1; a.z *= -1;
    return a;
}

export function addMut(a: Vector3, b: Vector3): Vector3 {
    a.x += b.x; a.y += b.y; a.z += b.z;
    return a;
}

export function add(a: Vector3, b: Vector3): Vector3 {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function subMut(a: Vector3, b: Vector3): Vector3 {
    a.x -= b.x; a.y -= b.y; a.z -= b.z;
    return a;
}

export function sub(a: Vector3, b: Vector3): Vector3 {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function multiplyByScalar(a: Vector3, scalar: number): Vector3 {
    return { x: a.x * scalar, y: a.y * scalar, z: a.z * scalar };
}

export function multiplyByScalarMut(a: Vector3, scalar: number): Vector3 {
    a.x *= scalar; a.y *= scalar; a.z *= scalar;
    return a;
}

export function divideByScalar(a: Vector3, scalar: number): Vector3 {
    if (!scalar) throw new Error("divideByScalar: division by 0");
    return { x: a.x / scalar, y: a.y / scalar, z: a.z / scalar };
}

export function divideByScalarMut(a: Vector3, scalar: number): Vector3 {
    if (!scalar) throw new Error("divideByScalar: division by 0");
    a.x /= scalar; a.y /= scalar; a.z /= scalar;
    return a;
}

export function cross(a: Vector3, b: Vector3): Vector3 {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    };
}

export function crossMut(a: Vector3, b: Vector3): Vector3 {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    a.x = ay * bz - az * by;
    a.y = az * bx - ax * bz;
    a.z = ax * by - ay * bx;
    return a;
}

export function normalize(a: Vector3): Vector3 {
    const l = length(a);
    return l > 0 ? divideByScalar(a, l) : zero();
}

export const scale = multiplyByScalar;
export const scaleMut = multiplyByScalarMut;
