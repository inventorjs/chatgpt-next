import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { THEME_DARK, netModeOptions, aiModeOptions, gptModelOptions, imageSizeOptions } from '../../config';
import { type RootState } from '..';

const initialState = {
  themeMode: THEME_DARK,
  netMode: netModeOptions[0].value,
  aiMode: aiModeOptions[0].value,
  gptModel: gptModelOptions[0].value,
  imageSize: imageSizeOptions[0].value,
  apiKey: '',
}
const name = 'config'
export const configSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateConfig(state, action: PayloadAction<Partial<typeof initialState>>) {
      Object.assign(state, action.payload)
    }
  },
})

export const selectState = (state: RootState) => state[name]

export const { updateConfig } = configSlice.actions
