const makePortalUrl = (path: string) => new URL(path, process.env.NEXT_PUBLIC_KOBBLE_DOMAIN).toString()

export const getPricingUrl = () => makePortalUrl('/pricing')
export const getProfileUrl = () => makePortalUrl('/profile')
