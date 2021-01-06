import { Flex } from "@chakra-ui/react";
import * as React from "react";
import "./style.css";

const LoadingSpinner: React.FC<{}> = (props) => {
  return (
    <Flex justifyContent="center">
      <span className="LoadingSpinner" />
    </Flex>
  );
};

export default React.memo(LoadingSpinner);
