import { createStore } from 'react-hooks-global-state';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { ImagePickerResponse } from 'react-native-image-picker';

export enum  FileTypeEnum {
    "passport" = "Passport",
    "driving_license" = "Driving License",
    "selfi" = "Selfi"
}

export enum Actions {
    "RESET" = "RESET"
}
type FileEntity = {
    file?: DocumentPickerResponse | ImagePickerResponse
    metadata?: {
        expDate?: string
        country?: string
    }
}
type InitialState = {
    dictionary: Map<FileTypeEnum, FileEntity>,
}
const initialState: InitialState = {
    dictionary: new Map(),
};
 
export const { 
    dispatch: dispatchFileState,
    useGlobalState: useDocumentState,
} = createStore<InitialState, { type: FileTypeEnum | Actions, state: FileEntity}>((state, action) => {
    switch (action.type) {
        case FileTypeEnum.passport: {
            const currentState = state.dictionary.get(action.type)
            state.dictionary.set(action.type, {...currentState, ...action.state})
            return { dictionary: new Map(state.dictionary) };
        }
        case FileTypeEnum.driving_license: {
            const currentState = state.dictionary.get(action.type)
            state.dictionary.set(action.type, {...currentState, ...action.state})
            return { dictionary: new Map(state.dictionary) };
        }
        case FileTypeEnum.selfi: {
            state.dictionary.set(action.type, action.state)
            return { dictionary: new Map(state.dictionary) };
        }
        case Actions.RESET: {
            return { dictionary: new Map() };
        }
        default: return state;
    }
}, initialState)