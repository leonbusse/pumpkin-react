import { Text, TextProps, useTheme } from "@chakra-ui/react";
import { FC } from "react";

interface ExternalLinkProps extends TextProps {
  href: string;
}

export const ExternalLink: FC<ExternalLinkProps> = (props) => {
  const { href, ...otherProps } = props;
  const { accent } = useTheme().colors;
  return (
    <Text
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      _hover={{
        color: accent,
      }}
      {...otherProps}
    >
      {props.children}
    </Text>
  );
};
