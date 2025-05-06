import { Button, ButtonProps } from "react-native-paper";

export function ButtonWithBorderRadius({ ...rest }: ButtonProps) {
  return <Button style={{ borderRadius: 8 }} {...rest} />;
}
