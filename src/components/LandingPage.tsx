// LandingPage.tsx
import React from "react";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm"; // import LoginForm

const LandingPage = () => {
  const registerDisclosure = useDisclosure();
  const loginDisclosure = useDisclosure(); // create a new disclosure for login

  return (
    <Box width="400px" margin="auto" marginTop="100px">
      <Heading marginBottom="1.5rem">Welcome to Game Hub</Heading>
      <VStack spacing="1.5rem">
        <Button
          rightIcon={<ArrowForwardIcon />}
          colorScheme="teal"
          variant="outline"
          width="full"
          onClick={registerDisclosure.onOpen}
        >
          Register
        </Button>
        <Text>
          Already have an account?{" "}
          <Button variant="link" onClick={loginDisclosure.onOpen}>
            Login
          </Button>
          {/* open login modal on click */}
        </Text>
      </VStack>
      <RegisterForm
        isOpen={registerDisclosure.isOpen}
        onClose={registerDisclosure.onClose}
      />
      <LoginForm
        isOpen={loginDisclosure.isOpen}
        onClose={loginDisclosure.onClose}
      />
    </Box>
  );
};

export default LandingPage;
