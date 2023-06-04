import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { useForm, Controller, type FieldValues } from 'react-hook-form'

import {
  gptModelOptions,
  aiModeOptions,
  imageSizeOptions,
  netModeOptions,
} from '../../config'

export function ConfigForm({
  value,
  onChange,
}: {
  value: FieldValues
  onChange: (v: FieldValues) => void
}) {
  const { control, watch } = useForm({
    values: value,
  })

  const aiMode = watch('aiMode')

  const handleChange = (fieldValues: FieldValues) => {
    onChange(fieldValues)
  }

  return (
    <form>
      <FormControl size="small" fullWidth margin="dense">
        <Controller
          name="netMode"
          control={control}
          render={({ field: { value } }) => (
            <ToggleButtonGroup
              size="small"
              fullWidth
              value={value}
              onChange={(e) => handleChange({ netMode: (e.target as any).value })}
            >
              {netModeOptions.map((item) => (
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
          name="aiMode"
          control={control}
          render={({ field: { value } }) => (
            <ToggleButtonGroup
              size="small"
              fullWidth
              value={value}
              onChange={(e) => handleChange({ aiMode: (e.target as any).value })}
            >
              {aiModeOptions.map((item) => (
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
      {aiMode === 'text' && (
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
      {aiMode === 'image' && (
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
                    <MenuItem key={item.value} value={item.value}>
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
