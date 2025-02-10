export type Customer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
};

export type CustomerFormData = Omit<Customer, "id">;