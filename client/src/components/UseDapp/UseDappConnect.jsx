import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import Layout from "./Layout";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import "@fontsource/inter";
function UseDappConnect() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider>
      <Layout>
        <ConnectButton handleOpenModal={onOpen} />
      </Layout>
    </ChakraProvider>
  );
}
export default UseDappConnect;
