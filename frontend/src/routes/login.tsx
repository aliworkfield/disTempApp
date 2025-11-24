import { Container, Image, Input, Text } from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiMail } from "react-icons/fi"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import Logo from "/assets/images/fastapi-logo.svg"
import { emailPattern } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Login() {
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "", // We'll keep this for API compatibility but won't show it in UI
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()

    try {
      // For Windows authentication, we still send a dummy password
      // since the backend API expects it, but LDAP will validate the credentials
      await loginMutation.mutateAsync({
        ...data,
        password: "dummy" // LDAP will validate actual credentials
      })
    } catch {
      // error is handled by useAuth hook
    }
  }

  return (
    <>
      <Container
        as="form"
        onSubmit={handleSubmit(onSubmit)}
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
        <Field
          invalid={!!errors.username}
          errorText={errors.username?.message || !!error}
        >
          <InputGroup w="100%" startElement={<FiMail />}>
            <Input
              id="username"
              {...register("username", {
                required: "Username is required",
                pattern: emailPattern,
              })}
              placeholder="Username or Email"
              type="text"
            />
          </InputGroup>
        </Field>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          You will be authenticated using your Windows domain credentials
        </Text>
        <Button variant="solid" type="submit" loading={isSubmitting} size="md">
          Log In with Windows Credentials
        </Button>
        <Text>
          Don't have an account?{" "}
          <RouterLink to="/signup" className="main-link">
            Contact Administrator
          </RouterLink>
        </Text>
      </Container>
    </>
  )
}