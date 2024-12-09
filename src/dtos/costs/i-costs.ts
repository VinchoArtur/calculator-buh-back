export interface CostRequest {
  id?: string;
  name: string;
  price: number;
  hourlyRate: number;
  hours: number;
  costWithoutProfit: number;
  costWithProfit: number;
}
