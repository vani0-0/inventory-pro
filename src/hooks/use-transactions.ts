import { getTransactions } from "@/server/transactions";
import { useQuery } from "@tanstack/react-query";

export function useGetTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
}
