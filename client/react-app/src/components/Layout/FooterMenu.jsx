import { Button, Modal } from "antd";
import React, { useState } from "react";
import {
  Box,
  Container,
  Link,
  Center,
  chakra,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FiTwitter } from "@react-icons/all-files/fi/FiTwitter";
import { ReactNode } from "react";
import UseAnimations from "react-useanimations";
import twitter from "react-useanimations/lib/twitter";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode,
  label: string,
  href: string,
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha", "whiteAlpha")}
      rounded={"full"}
      w={16}
      h={16}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha", "whiteAlpha"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function FooterMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Box bg={"black"} 
    style={{
    backgroundImage:'url()'
    }}
    color={useColorModeValue("white", "gray")}>
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        mt={80}
        justify={"center"}
        align={"center"}
      >
        <Stack direction={"column"} spacing={6}>
          <Center></Center>
          <Box>
            <a
              href="https://twitter.com/TheBunyProject/"
              style={{ color: "white", fontSize: "12px" }}
            >
              The Buny Project 2023{" "}
            </a>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
