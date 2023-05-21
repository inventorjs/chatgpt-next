export const gptModelOptions = [
  { value: 'gpt-3.5', label: 'AI聊天(3.5)' },
  { value: 'gpt-4.0', label: 'AI聊天(4.0)', disabled: true },
]

export const modeOptions = [
  { value: 'text', label: '文本' },
  { value: 'image', label: '图片' },
  { value: 'audio', label: '音频', disabled: true },
]

export const imageSizeOptions = [
  { value: '1024x1024', label: '1024x1024' },
  { value: '512x512', label: '512x512' },
  { value: '256x256', label: '256x256' },
]

export const netTypeOptions = [
  { value: 'proxy', label: '代理模式' },
  { value: 'direct', label: '直通模式' },
]
