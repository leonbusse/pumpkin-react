import { Flex, Heading, Text, Box } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { BasePage } from "../../components/BasePage";
import { GlobalStateContext } from "../../state";
import { Button } from "../../components/Button";

function LinkCreatedPage() {
  const shareLink = useContext(GlobalStateContext).pumpkin.shareLink;
  const [copied, setCopied] = useState(false);

  if (!shareLink) {
    return (
      <>
        <Redirect to="/" />
      </>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
  };

  return (
    <BasePage>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        as="section"
      >
        <Heading
          size="xl"
          borderBottom="3px solid #000"
          paddingBottom="4px"
          marginBottom="1.5em"
        >
          Your link has been created
        </Heading>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Text
            background="black"
            color="white"
            padding=".7em .85em .7em .85em"
            borderRadius="0.375rem;"
          >
            {shareLink}
          </Text>
          <Box width="1em" height="1em" />
          <Button onClick={copyLink} width="8em" height="2.6em">
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </Flex>
      </Flex>
    </BasePage>
  );
}

export { LinkCreatedPage };
