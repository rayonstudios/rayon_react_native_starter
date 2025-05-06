// nativewind-paper.ts
import { cssInterop } from "nativewind";
import { Button, Card, Text, TextInput } from "react-native-paper";
import type {
  ButtonProps,
  CardProps,
  CardContentProps,
  CardActionsProps,
  CardCoverProps,
  CardTitleProps,
  TextProps,
  TextInputProps,
} from "react-native-paper";

// ——————————————————————————————
// 1) Map @react-native-paper/Card + its static sub-components
// ——————————————————————————————

cssInterop<CardProps>(Card, {
  className: { target: "style" },
});

cssInterop<CardContentProps>(Card.Content, {
  className: { target: "style" },
});

cssInterop<CardActionsProps>(Card.Actions, {
  className: { target: "style" },
});

cssInterop<CardCoverProps>(Card.Cover, {
  className: { target: "style" },
});

cssInterop<CardTitleProps>(Card.Title, {
  className: { target: "style" },
  titleClassName: { target: "titleStyle" },
  subtitleClassName: { target: "subtitleStyle" },
});

// ——————————————————————————————
// 2) Map @react-native-paper/Button (all style props)
// ——————————————————————————————

cssInterop<ButtonProps>(Button, {
  className: { target: "style" },
  contentClassName: { target: "contentStyle" },
  labelClassName: { target: "labelStyle" },
});

// ——————————————————————————————
// 3) Map @react-native-paper/Text
// ——————————————————————————————

cssInterop<TextProps>(Text, {
  className: { target: "style" },
});

// ——————————————————————————————
// 4) Map @react-native-paper/TextInput
// ——————————————————————————————

cssInterop<TextInputProps>(TextInput, {
  className: { target: "style" },
  labelClassName: { target: "labelStyle" },
  underlineColorAndroidClassName: { target: "underlineColorAndroid" },
  selectionColorClassName: { target: "selectionColor" },
});
cssInterop<TextInputIconProps>(TextInput.Icon, {
  className: { target: "style" },
});
cssInterop<TextInputAffixProps>(TextInput.Affix, {
  className: { target: "style" },
});
cssInterop<TextInputIconProps>(TextInput.Icon, {
  className: { target: "style" },
});
cssInterop<TextInputAffixProps>(TextInput.Affix, {
  className: { target: "style" },
});
cssInterop<TextInputIconProps>(TextInput.Icon, {
  className: { target: "style" },
});
cssInterop<TextInputAffixProps>(TextInput.Affix, {
  className: { target: "style" },
});
