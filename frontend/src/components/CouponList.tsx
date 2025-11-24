import { useQuery } from "@tanstack/react-query";
import { VStack, Box, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { client } from "../client"; // generated OpenAPI client

export function CouponsList() {
  const couponsQuery = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      return client.api.coupons.getUserCoupons(); 
      // ⚠️ call name depends on your OpenAPI schema!
    },
  });

  if (couponsQuery.isLoading) {
    return <Spinner size="lg" />;
  }

  if (couponsQuery.isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load coupons.
      </Alert>
    );
  }

  const coupons = couponsQuery.data ?? [];

  return (
    <VStack spacing={4} align="stretch">
      {coupons.length === 0 ? (
        <Text>No coupons assigned to you.</Text>
      ) : (
        coupons.map((coupon: any) => (
          <Box
            key={coupon.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            shadow="md"
          >
            <Text fontWeight="bold">{coupon.title}</Text>
            <Text color="gray.600">{coupon.description}</Text>
            <Text mt={2}>Expires: {coupon.expiration_date}</Text>
          </Box>
        ))
      )}
    </VStack>
  );
}
