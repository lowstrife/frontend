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

export interface IXITJSONAction {
	type: "MTRA";
	name: "TransferAction";
	group: string;
	origin: string | "Configure on Execution";
	dest: string | "Configure on Execution";
}

export interface IXITJSONGlobal {
	name: string;
}

export interface IXITJSONGroup {
	type: "Manual";
	name: string;
	materials: Record<string, number>;
}

export interface IXITJSON {
	actions: IXITJSONAction[];
	global: IXITJSONGlobal;
	groups: IXITJSONGroup[];
}
