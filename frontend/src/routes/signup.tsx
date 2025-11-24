import { Container, Flex, Image, Text } from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { isLoggedIn } from "@/hooks/useAuth"
import Logo from "/assets/images/fastapi-logo.svg"

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function SignUp() {
  return (
    <>
      <Flex flexDir={{ base: "column", md: "row" }} justify="center" h="100vh">
        <Container
          h="100vh"
          maxW="sm"
          alignItems="stretch"
          justifyContent="center"
          gap={4}
          centerContent
        >
          <Image
            src={Logo}
            alt="FastAPI logo"
            height="auto"
            maxW="2xs"
            alignSelf="center"
            mb={4}
          />
          <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
            Account Registration
          </Text>
          <Text textAlign="center" mb={6}>
            New accounts must be created by an administrator. Please contact your system administrator to request access.
          </Text>
          <Button asChild>
            <RouterLink to="/login">
              Back to Login
            </RouterLink>
          </Button>
        </Container>
      </Flex>
    </>
  )
}

export default SignUp