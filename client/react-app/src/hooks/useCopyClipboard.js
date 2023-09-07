import { useClipboard } from "@chakra-ui/react";

export const useCopyClipboard = (params) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard([]);

  return (
    <>
      <p>Copied!</p>
    </>
  );
};
