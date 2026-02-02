// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.


export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: "pending" | "paid";
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};

// App

import * as z from "zod";

export const SigninFormSchema = z.object({
  // email: z.email({ error: "Please enter a valid email." }).trim(),

  // password: z
  //   .string()
  //   .min(8, { error: "Be at least 8 characters long" })
  //   .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
  //   .regex(/[0-9]/, { error: "Contain at least one number." })
  //   .regex(/[^a-zA-Z0-9]/, {
  //     error: "Contain at least one special character.",
  //   })
  //   .trim(),

  email: z.string(),
  password: z.string(),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type transactionsType = {
  id: string;
  amount: string;
  transaction_type: "income" | "expense";
  category:
    | "groceries"
    | "transport"
    | "entertainment"
    | "bills"
    | "shopping"
    | "dining"
    | "salary"
    | "other";
  description: string | null;
  merchant: string | null;
  date: Date;
  createdAt: Date;
}[];

export type TransactionType = {
  id: string;
  amount: string;
  transaction_type: "income" | "expense";
  category:
    | "groceries"
    | "transport"
    | "entertainment"
    | "bills"
    | "shopping"
    | "dining"
    | "salary"
    | "other";
  description: string | null;
  merchant: string | null;
  date: Date;
  createdAt: Date;
};


// types/user.ts
export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
};
