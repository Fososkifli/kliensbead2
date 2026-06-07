import tablesJson from "./tables.json";

export type TableType = "foosball" | "snooker" | "air-hockey";

export type Category = "kids" | "normal" | "competition";

export interface Table {
    id: number;
    type: TableType;
    name: string;
    category: Category;
    color: string;
    status: number;
    position: { x: number; y: number };
    isLocked: boolean;
}

