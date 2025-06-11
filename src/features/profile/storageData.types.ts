import { TOptionalDate } from "@/stores/gameDataStore.types";

export interface IStorageDataTableElement {
	name: string;
	refreshed: TOptionalDate;
	elements: number;
	reset: () => void;
}
