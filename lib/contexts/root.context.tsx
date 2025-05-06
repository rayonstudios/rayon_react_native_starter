import AlertPopupDialog, {
  AlertPopupDialogProps,
} from "@/lib/components/alert-popup-dialog";
import { useColorScheme } from "@/lib/hooks/useColorScheme.web";
import { store } from "@/lib/redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import { PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import CustomModal from "../components/CustomModal";

type ShowModalProps = {
  children: React.ReactNode;
};

type RootContextType = {
  showAlert: (props: AlertPopupDialogProps) => void;
  hideAlert: () => void;
  showModal: ({ children }: ShowModalProps) => void;
  hideModal: () => void;
  setHeaderOptions: (options: {
    title: string;
    showBackButton: boolean;
  }) => void;
  headerOptions: { title: string; showBackButton: boolean };
};

const initialValues: RootContextType = {
  showAlert: () => {},
  hideAlert: () => {},
  showModal: () => {},
  hideModal: () => {},
  setHeaderOptions: () => {},
  headerOptions: { title: "", showBackButton: false },
};

export const RootContext = createContext<RootContextType>(initialValues);
export const useRootContextValues = () => useContext(RootContext);

const RootContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [alertVisible, setAlertVisible] = useState(false);
  const alertPopupDialogProps = useRef<AlertPopupDialogProps | null>(null);
  const [headerOptionsState, setHeaderOptionsState] = useState({
    title: "",
    showBackButton: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ShowModalProps | null>(null);

  const showAlert = (props: AlertPopupDialogProps) => {
    alertPopupDialogProps.current = props;
    setAlertVisible(true);
  };

  const hideAlert = () => {
    alertPopupDialogProps.current = null;
    setAlertVisible(false);
  };

  const showModal = ({ children }: ShowModalProps) => {
    setModalContent({ children });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  const setHeaderOptions = (options: {
    title: string;
    showBackButton: boolean;
  }) => {
    setHeaderOptionsState(options);
  };

  return (
    <RootContext.Provider
      value={{
        showAlert,
        hideAlert,
        showModal,
        hideModal,
        setHeaderOptions,
        headerOptions: headerOptionsState,
      }}
    >
      <StoreProvider store={store}>
        <PaperProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            {children}
          </ThemeProvider>
          {alertPopupDialogProps.current && (
            <AlertPopupDialog
              {...alertPopupDialogProps.current}
              visible={alertVisible}
              setVisible={setAlertVisible}
            />
          )}

          <CustomModal visible={modalVisible} onDismiss={hideModal}>
            {modalContent?.children}
          </CustomModal>
        </PaperProvider>
      </StoreProvider>
    </RootContext.Provider>
  );
};

export default RootContextProvider;
