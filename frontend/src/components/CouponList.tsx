import { VStack, Box, Text, Spinner } from "@chakra-ui/react";

export function CouponsList() {
  // Mock data since we don't have a real API
  const couponsQuery = {
    isLoading: false,
    isError: false,
    data: [
      {
        id: 1,
        title: "Welcome Coupon",
        description: "10% off your first purchase",
        expiration_date: "2025-12-31"
      },
      {
        id: 2,
        title: "Seasonal Sale",
        description: "15% off winter collection",
        expiration_date: "2025-02-28"
      }
    ]
  };

  if (couponsQuery.isLoading) {
    return <Spinner size="lg" />;
  }

  if (couponsQuery.isError) {
    return (
      <Box color="red.500">
        Failed to load coupons.
      </Box>
    );
  }

  const coupons = couponsQuery.data ?? [];

  return (
    <VStack gap={4} alignItems="stretch">
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