export const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
export const toNumber = (v: string) => {
 const n = Number(v)
 if (!Number.isFinite(n)) throw new Error('Invalid number')
 return n
}
