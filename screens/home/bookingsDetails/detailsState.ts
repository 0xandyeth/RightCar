import { createGlobalState } from "react-hooks-global-state";

export const { useGlobalState: useCarDetailState } = createGlobalState({ details: {} })
