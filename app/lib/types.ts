export type Customer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
};

export type CustomerFormData = Omit<Customer, "id">;

export type Item = {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
  status: string;
};

export type ItemFormData = Omit<Item, "id">;

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    mobile?: string[];
    address?: string[];
  };
  message?: string | null;
};

export type ItemState = {
  errors?: {
    name?: string[];
    price?: string[];
    size?: string[];
    qty?: string[];
    status?: string[];
  };
  message?: string | null;
};
