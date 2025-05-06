import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useRootContextValues } from "../contexts/root.context";
import { profileActions } from "../redux/slices/profile.slice";
import { ThunkStatus } from "../types/misc";

export const useSaveDocument = (docId: string) => {
  const dispatch = useAppDispatch();
  const { showAlert } = useRootContextValues();
  const savedDocumentsList = useAppSelector(
    (state) => state.profile.savedDocumentsList
  );
  const saveLoading = useAppSelector(
    (state) => state.profile.documentSaveStatus
  );
  const [saved, setSaved] = useState(savedDocumentsList.includes(docId));

  useEffect(() => {
    setSaved(savedDocumentsList.includes(docId));
  }, [savedDocumentsList, docId]);

  const toggleSaveDoc = async () => {
    if (saved) {
      showAlert({
        title: "Unsave Document",
        message: "Are you sure you want to unsave this document?",
        onOk: async () => {
          await dispatch(profileActions.unsaveDocument(docId)).unwrap();
          dispatch(
            profileActions.setSavedDocumentsList(
              savedDocumentsList.filter((id) => id !== docId)
            )
          );
          setSaved(false);
        },
      });
    } else {
      try {
        setSaved(true);
        await dispatch(profileActions.saveDocument(docId)).unwrap();
        dispatch(
          profileActions.setSavedDocumentsList([...savedDocumentsList, docId])
        );
      } catch (error) {
        setSaved(false);
      }
    }
  };

  return {
    saved,
    saveLoading: saveLoading === ThunkStatus.LOADING,
    toggleSaveDoc,
  };
};
