import { THEME_CONFIG } from 'configs/AppConfig';

const initialState = { ...THEME_CONFIG };

export const themeSlice = {
  name: 'theme',
  initialState,
  reducer: {},
};
