import {
  addBulkProduct,
  addProduct,
  getOverviews,
  getProducts,
} from "@/server/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useGetOverview() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: getOverviews,
  });
}

export function useGetProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["addProduct"],
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
      router.push("/");
    },
  });
}

export function useBulkAddProducts() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["bulkAddProducts"],
    mutationFn: addBulkProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
      router.push("/");
    },
  });
}
