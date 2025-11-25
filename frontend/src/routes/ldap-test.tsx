import { Container, Flex, Heading, Text, Input, Button, Box, VStack, useToast } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { client } from "@/client"

export const Route = createFileRoute("/ldap-test")({
  component: LDAPTest,
})

function LDAPTest() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const testLDAPConnection = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      // This would call a backend endpoint to test LDAP connectivity
      // For now, we'll simulate the response
      const response = await client.api.utils.testLdapConnection({
        requestBody: {
          username,
          password
        }
      })
      
      setTestResult({
        success: true,
        message: "LDAP connection successful! User details retrieved."
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: "LDAP connection failed. Please check your credentials and LDAP configuration."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex justify="center" align="center" minH="100vh" p={4}>
      <Container maxW="md">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">
            LDAP Connection Test
          </Heading>
          
          <Text>
            Test your LDAP/Active Directory connection by entering your domain credentials below.
            This will verify that the application can authenticate against your LDAP server.
          </Text>
          
          <Box p={4} borderWidth="1px" borderRadius="md">
            <VStack spacing={4} align="stretch">
              <Input
                placeholder="Domain Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                colorScheme="blue"
                onClick={testLDAPConnection}
                isLoading={isLoading}
              >
                Test LDAP Connection
              </Button>
            </VStack>
          </Box>
          
          {testResult && (
            <Box 
              p={4} 
              borderRadius="md"
              bg={testResult.success ? "green.100" : "red.100"}
              color={testResult.success ? "green.800" : "red.800"}
            >
              <Text fontWeight="bold" mb={2}>
                {testResult.success ? "Success!" : "Error"}
              </Text>
              <Text>{testResult.message}</Text>
            </Box>
          )}
          
          <Box p={4} bg="gray.50" borderRadius="md">
            <Heading size="sm" mb={2}>LDAP Configuration</Heading>
            <Text fontSize="sm">
              To configure LDAP authentication, update the following environment variables in your .env file:
            </Text>
            <Text fontSize="sm" fontFamily="mono" mt={2}>
              LDAP_SERVER=ldap://your-domain-controller.company.com<br />
              LDAP_BASE_DN=DC=company,DC=com<br />
              LDAP_ADMIN_USER=CN=service-account,OU=Service Accounts,DC=company,DC=com<br />
              LDAP_ADMIN_PASSWORD=service-account-password
            </Text>
          </Box>
        </VStack>
      </Container>
    </Flex>
  )
}

export default LDAPTest