import {
  IconButton,
  Divider,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

import {
  gptModelOptions,
  modeOptions,
  imageSizeOptions,
  netTypeOptions,
} from '../../config'

const drawerWith = 250

export function ConfigForm({ value, onChange }) {
  const { control, getValues, watch, setValue } = useForm({
    values: value,
  })

  const mode = watch('mode')

  const handleChange = (fieldValues) => {
    onChange(fieldValues)
  }

  return (
    <form>
      <FormControl size="small" fullWidth margin="dense">
        <Controller
          name="netType"
          control={control}
          render={({ field: { value } }) => (
            <ToggleButtonGroup
              size="small"
              fullWidth
              value={value}
              onChange={(e) => handleChange({ netType: e.target.value })}
            >
              {netTypeOptions.map((item) => (
                <ToggleButton
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />
      </FormControl>
      <FormControl size="small" fullWidth margin="dense">
        <Controller
          name="mode"
          control={control}
          render={({ field: { value } }) => (
            <ToggleButtonGroup
              size="small"
              fullWidth
              value={value}
              onChange={(e) => handleChange({ mode: e.target.value })}
            >
              {modeOptions.map((item) => (
                <ToggleButton
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />
      </FormControl>
      {mode === 'text' && (
        <FormControl size="small" fullWidth margin="dense">
          <InputLabel>模型</InputLabel>
          <Controller
            name="gptModel"
            control={control}
            render={({ field: { value } }) => {
              return (
                <Select
                  value={value}
                  onChange={(e) => handleChange({ gptModel: e.target.value })}
                >
                  {gptModelOptions.map((item) => (
                    <MenuItem
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              )
            }}
          />
        </FormControl>
      )}
      {mode === 'image' && (
        <FormControl size="small" fullWidth margin="dense">
          <InputLabel>尺寸</InputLabel>
          <Controller
            name="imageSize"
            control={control}
            render={({ field: { value } }) => {
              return (
                <Select
                  value={value}
                  onChange={(e) => handleChange({ imageSize: e.target.value })}
                >
                  {imageSizeOptions.map((item) => (
                    <MenuItem
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              )
            }}
          />
        </FormControl>
      )}
      <FormControl fullWidth margin="dense">
        <Controller
          name="apiKey"
          control={control}
          render={({ field: { value } }) => {
            return (
              <TextField
                label="Key"
                type="password"
                fullWidth
                size="small"
                value={value}
                onChange={(e) => handleChange({ apiKey: e.target.value })}
              />
            )
          }}
        />
      </FormControl>
    </form>
  )
}
