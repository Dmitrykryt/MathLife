import { Metadata } from 'next'

export function makeCalculatorMetadata(name: string, description: string): Metadata {
 return {
 title: name + ' | MathLife',
 description,
 openGraph: { title: name + ' | MathLife', description },
 }
}
