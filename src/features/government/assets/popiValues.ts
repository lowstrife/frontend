import { IPOPIData } from "@/features/government/government.types";

export const popiBuildingMap: Record<string, Record<string, IPOPIData>> = {
	SST: {
		DW: {
			qtyPerDay: 10,
			effects: {
				Safety: 833.3,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		OFF: {
			qtyPerDay: 10,
			effects: {
				Safety: 833.3,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		SUN: {
			qtyPerDay: 2,
			effects: {
				Safety: 833.3,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
	},
	SDP: {
		POW: {
			qtyPerDay: 1,
			effects: {
				Safety: 1250,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		RAD: {
			qtyPerDay: 0.47,
			effects: {
				Safety: 1250,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		CCD: {
			qtyPerDay: 0.07,
			effects: {
				Safety: 1250,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		SUD: {
			qtyPerDay: 0.07,
			effects: {
				Safety: 1250,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
	},
	EMC: {
		PK: {
			qtyPerDay: 2,
			effects: {
				Safety: 200,
				Health: 200,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		POW: {
			qtyPerDay: 0.4,
			effects: {
				Safety: 200,
				Health: 200,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		BND: {
			qtyPerDay: 4,
			effects: {
				Safety: 200,
				Health: 200,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		RED: {
			qtyPerDay: 0.07,
			effects: {
				Safety: 200,
				Health: 200,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		BSC: {
			qtyPerDay: 0.07,
			effects: {
				Safety: 200,
				Health: 200,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
	},
	INF: {
		OFF: {
			qtyPerDay: 10,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		TUB: {
			qtyPerDay: 6.67,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		STR: {
			qtyPerDay: 0.67,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
	},
	HOS: {
		PK: {
			qtyPerDay: 2,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		SEQ: {
			qtyPerDay: 0.4,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		BND: {
			qtyPerDay: 4,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		SDR: {
			qtyPerDay: 0.07,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		RED: {
			qtyPerDay: 0.07,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
		BSC: {
			qtyPerDay: 0.13,
			effects: {
				Safety: 0,
				Health: 833.33,
				Comfort: 0,
				Culture: 0,
				Education: 0,
			},
		},
	},
	WCE: {
		KOM: {
			qtyPerDay: 4,
			effects: {
				Safety: 0,
				Health: 166.67,
				Comfort: 166.7,
				Culture: 0,
				Education: 0,
			},
		},
		OLF: {
			qtyPerDay: 2,
			effects: {
				Safety: 0,
				Health: 166.67,
				Comfort: 166.7,
				Culture: 0,
				Education: 0,
			},
		},
		DW: {
			qtyPerDay: 6,
			effects: {
				Safety: 0,
				Health: 166.67,
				Comfort: 166.7,
				Culture: 0,
				Education: 0,
			},
		},
		DEC: {
			qtyPerDay: 0.67,
			effects: {
				Safety: 0,
				Health: 166.67,
				Comfort: 166.7,
				Culture: 0,
				Education: 0,
			},
		},
		PFE: {
			qtyPerDay: 2.67,
			effects: {
				Safety: 0,
				Health: 166.67,
				Comfort: 166.7,
				Culture: 0,
				Education: 0,
			},
		},
		SOI: {
			qtyPerDay: 6.67,
			effects: {
				Safety: 0,
				Health: 166.67,
				Comfort: 166.7,
				Culture: 0,
				Education: 0,
			},
		},
	},
	PAR: {
		DW: {
			qtyPerDay: 10,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 500,
				Culture: 0,
				Education: 0,
			},
		},
		FOD: {
			qtyPerDay: 6,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 500,
				Culture: 0,
				Education: 0,
			},
		},
		PFE: {
			qtyPerDay: 2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 500,
				Culture: 0,
				Education: 0,
			},
		},
		SOI: {
			qtyPerDay: 3.33,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 500,
				Culture: 0,
				Education: 0,
			},
		},
		DEC: {
			qtyPerDay: 0.33,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 500,
				Culture: 0,
				Education: 0,
			},
		},
	},
	"4DA": {
		POW: {
			qtyPerDay: 2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 833.3,
				Culture: 0,
				Education: 0,
			},
		},
		MHP: {
			qtyPerDay: 2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 833.3,
				Culture: 0,
				Education: 0,
			},
		},
		OLF: {
			qtyPerDay: 4,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 833.3,
				Culture: 0,
				Education: 0,
			},
		},
		BID: {
			qtyPerDay: 0.2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 833.3,
				Culture: 0,
				Education: 0,
			},
		},
		HOG: {
			qtyPerDay: 0.2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 833.3,
				Culture: 0,
				Education: 0,
			},
		},
		EDC: {
			qtyPerDay: 0.2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 833.3,
				Culture: 0,
				Education: 0,
			},
		},
	},
	ACA: {
		COF: {
			qtyPerDay: 8,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 166.7,
				Culture: 166.7,
				Education: 0,
			},
		},
		OLF: {
			qtyPerDay: 2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 166.7,
				Culture: 166.7,
				Education: 0,
			},
		},
		VIT: {
			qtyPerDay: 8,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 166.7,
				Culture: 166.7,
				Education: 0,
			},
		},
		DW: {
			qtyPerDay: 10,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 166.7,
				Culture: 166.7,
				Education: 0,
			},
		},
		GL: {
			qtyPerDay: 6.67,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 166.7,
				Culture: 166.7,
				Education: 0,
			},
		},
		DEC: {
			qtyPerDay: 0.67,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 166.7,
				Culture: 166.7,
				Education: 0,
			},
		},
	},
	ART: {
		MHP: {
			qtyPerDay: 1,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 625,
				Education: 0,
			},
		},
		HOG: {
			qtyPerDay: 1,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 625,
				Education: 0,
			},
		},
		UTS: {
			qtyPerDay: 0.67,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 625,
				Education: 0,
			},
		},
		DEC: {
			qtyPerDay: 0.67,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 625,
				Education: 0,
			},
		},
	},
	VRT: {
		POW: {
			qtyPerDay: 1.4,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 833.3,
				Education: 0,
			},
		},
		MHP: {
			qtyPerDay: 2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 833.3,
				Education: 0,
			},
		},
		HOG: {
			qtyPerDay: 1.4,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 833.3,
				Education: 0,
			},
		},
		OLF: {
			qtyPerDay: 4,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 833.3,
				Education: 0,
			},
		},
		BID: {
			qtyPerDay: 0.33,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 833.3,
				Education: 0,
			},
		},
		DEC: {
			qtyPerDay: 0.67,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 833.3,
				Education: 0,
			},
		},
	},
	PBH: {
		OFF: {
			qtyPerDay: 10,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 166.7,
				Education: 166.7,
			},
		},
		MHP: {
			qtyPerDay: 1,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 166.7,
				Education: 166.7,
			},
		},
		SP: {
			qtyPerDay: 1.33,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 166.7,
				Education: 166.7,
			},
		},
		AAR: {
			qtyPerDay: 0.67,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 166.7,
				Education: 166.7,
			},
		},
		EDC: {
			qtyPerDay: 0.27,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 166.7,
				Education: 166.7,
			},
		},
		IDC: {
			qtyPerDay: 0.13,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 166.7,
				Education: 166.7,
			},
		},
	},
	LIB: {
		MHP: {
			qtyPerDay: 1,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 500,
			},
		},
		HOG: {
			qtyPerDay: 1,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 500,
			},
		},
		CD: {
			qtyPerDay: 0.33,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 500,
			},
		},
		DIS: {
			qtyPerDay: 0.33,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 500,
			},
		},
		BID: {
			qtyPerDay: 0.2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 500,
			},
		},
	},
	UNI: {
		COF: {
			qtyPerDay: 10,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 833.3,
			},
		},
		REA: {
			qtyPerDay: 10,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 833.3,
			},
		},
		TUB: {
			qtyPerDay: 10,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 833.3,
			},
		},
		BID: {
			qtyPerDay: 0.33,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 833.3,
			},
		},
		HD: {
			qtyPerDay: 0.67,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 833.3,
			},
		},
		IDC: {
			qtyPerDay: 0.2,
			effects: {
				Safety: 0,
				Health: 0,
				Comfort: 0,
				Culture: 0,
				Education: 833.3,
			},
		},
	},
};
