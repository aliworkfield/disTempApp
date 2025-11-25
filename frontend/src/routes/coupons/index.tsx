import { createFileRoute } from "@tanstack/react-router";
import { VStack, Heading } from "@chakra-ui/react";
import { CouponsList } from "../../components/CouponList";

export const Route = createFileRoute("/coupons/")({
  component: CouponsPage,
});

function CouponsPage() {
  return (
    <VStack gap={6} alignItems="stretch">
      <Heading size="lg">My Coupons</Heading>
      <CouponsList />
    </VStack>
  );
}