export interface IProcessData<T> {
  addData(data: T): Promise<{ result: T }>;
  getData(): Promise<{ results: T[] }>;
  deleteData(id: string): Promise<{ message: string }>;
  updateData(id: string, data: Partial<T>): Promise<{ updatedResult: T }>;
}
