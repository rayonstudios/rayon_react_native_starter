import { getRootContextValues } from "@/lib/contexts/root.context";
import { globalErrorHandler } from "@/lib/utils/error.utils";
import React, { ReactNode, useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type Callback = () => void | Promise<any>;

function handleCb(cb: Callback) {
  if (typeof cb !== "function") return cb;
  return function () {
    const res = cb();
    if (res instanceof Promise) {
      return new Promise((_res) => {
        res.catch(globalErrorHandler).finally(() => _res(undefined));
      });
    }
    return res;
  };
}

export const AlertPopup = (props: AlertPopupDialogProps) =>
  getRootContextValues().showAlert(props);

export type AlertPopupDialogProps = {
  title: ReactNode;
  body?: ReactNode;
  message?: string;
  okText?: string | null;
  cancelText?: string | null;
  onOk?: Callback;
  onCancel?: Callback;
  variant?: "destructive" | "default";
};

const AlertPopupDialog: React.FC<
  AlertPopupDialogProps & {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  }
> = ({
  title,
  body,
  message,
  okText,
  cancelText,
  onOk = () => {},
  onCancel = () => {},
  variant = "default",
  visible,
  setVisible,
}) => {
  const [okLoading, setOkLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const hideDialog = () => setVisible(false);

  const handleOk = () => {
    setOkLoading(true);
    const res = handleCb(onOk)();
    if (res instanceof Promise)
      res.then(hideDialog).finally(() => setOkLoading(false));
    else {
      setOkLoading(false);
      hideDialog();
    }
  };

  const handleCancel = () => {
    setCancelLoading(true);
    const res = handleCb(onCancel)();
    if (res instanceof Promise)
      res.then(hideDialog).finally(() => setCancelLoading(false));
    else {
      setCancelLoading(false);
      hideDialog();
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          {body ? body : <Text variant="bodyMedium">{message}</Text>}
        </Dialog.Content>
        <Dialog.Actions>
          {cancelText !== null && (
            <Button onPress={handleCancel} loading={cancelLoading}>
              {cancelText || "Cancel"}
            </Button>
          )}
          {okText !== null && (
            <Button
              onPress={handleOk}
              loading={okLoading}
              textColor={variant === "destructive" ? "red" : undefined}
            >
              {okText || "Yes"}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AlertPopupDialog;
