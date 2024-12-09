export interface CostRequest {
  id?: number;
  name: string;
  price: number;
  hourlyRate: number;
  hours: number;
  costWithoutProfit: number;
  costWithProfit: number;
}
