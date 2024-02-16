import * as z from "zod";

export const FaucetSchema = z.object({
  address: z
    .string({ required_error: "Address is required" })
    .min(1, "Address is required"),
});

export type FaucetSchema = z.infer<typeof FaucetSchema>;
