// import { configureStore } from "@reduxjs/toolkit";
// import customizationReducer from "./customizationReducer";
// import Data from "./Data";

// export const store = configureStore({
//   reducer: {
//     Data: Data,
//     customization: customizationReducer,
//   },
// });

import { configureStore } from "@reduxjs/toolkit";
import customizationReducer from "./customizationReducer";
import Data from "./Data";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";


const persistConfig = {
  key: 'DataPersisted',
  storage
}

// Create the Redux store
const store = configureStore({
  reducer: {
    Data: persistReducer(persistConfig, Data),
    customization: customizationReducer,
  },
});

// Create the persisted store
const persistor = persistStore(store);


// Export the store and persistor
export { store, persistor };
