import { createSale } from "@/server/sale";
import { useMutation } from "@tanstack/react-query";

export function useAddSale() {
  return useMutation({
    mutationKey: ["sale"],
    mutationFn: createSale,
  });
}
