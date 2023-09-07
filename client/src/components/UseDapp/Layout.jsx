import { Flex } from "@chakra-ui/react";
export default function Layout({ children }) {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="transparent"
    >
      {children}
    </Flex>
  );
}
