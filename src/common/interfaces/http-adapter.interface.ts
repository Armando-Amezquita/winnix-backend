export interface HttpAdapter {
  //Metodos obligatorios a implementar
  get<T>(url: string): Promise<T>;
}
