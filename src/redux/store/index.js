import { configureStore } from '@reduxjs/toolkit';

import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers';

const persistConfig = {
  key: 'root-eskademia',
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(persistedReducer, applyMiddleware(thunk));
const store = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});

export const persistor = persistStore(store);

export default store;
