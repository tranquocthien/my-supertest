export const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'connect'] as const

export const kHooksBeforeSend = Symbol('hooksBeforeSend')
