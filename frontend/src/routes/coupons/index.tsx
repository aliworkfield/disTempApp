import { createFileRoute } from "@tanstack/react-router";
import { VStack, Heading } from "@chakra-ui/react";
import { CouponsList } from "../../components/CouponsList";

export const Route = createFileRoute("/coupons")({
  component: CouponsPage,
});

function CouponsPage() {
  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">My Coupons</Heading>
      <CouponsList />
    </VStack>
  );
}
