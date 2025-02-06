export type Polygon = {
    id: string;
    color: string;
    area?: number | null;
    label?: string | null;
    isUpdating?: boolean;
    coordinates: number[][][];
  };