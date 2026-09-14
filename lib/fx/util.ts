export const $ = <T extends Element = Element>(sel: string, ctx: ParentNode = document): T | null => ctx.querySelector<T>(sel);
export const $$ = <T extends Element = Element>(sel: string, ctx: ParentNode = document): T[] => Array.from(ctx.querySelectorAll<T>(sel));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const isReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isFine = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export type Cleanup = () => void;
export const noop: Cleanup = () => {};
