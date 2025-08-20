export const POPIEffects = [
	"Safety",
	"Health",
	"Comfort",
	"Culture",
	"Education",
] as const;

export type POPIEffect = (typeof POPIEffects)[number];

export type MapPOPIEffect = Record<POPIEffect, number>;

export interface IPOPIData {
	qtyPerDay: number;
	effects: MapPOPIEffect;
}
