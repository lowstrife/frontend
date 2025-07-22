export interface IXITActionElement {
	ticker: string;
	stock: number;
	delta: number;
}

export interface IXITActionMaterialElement {
	active: boolean;
	ticker: string;
	stock: number;
	delta: number;
	burn: number;
	total: number;
}

interface IXITJSONAction {
	type: "MTRA";
	name: "TransferAction";
	group: string;
	origin: string | "Configure on Execution";
	dest: string | "Configure on Execution";
}

interface IXITJSONGlobal {
	name: string;
}

interface IXITJSONGroup {
	type: "Manual";
	name: string;
	materials: Record<string, number>;
}

export interface IXITJSON {
	actions: IXITJSONAction[];
	global: IXITJSONGlobal;
	groups: IXITJSONGroup[];
}

export interface IXITTransferMaterial {
	ticker: string;
	value: number;
}
