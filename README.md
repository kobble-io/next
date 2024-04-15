# Next SDK

A SDK to seamlessly integrate Kobble with your Next.js project.

## Installation

```bash
npm i @kobbleio/next

# or
pnpm i @kobbleio/next
```

## Working with the app router

This SDK only supports the app router which is available since Next.js 13 and is now considered to be Next's default router.

- `@kobbleio/next/server` => utilities to work on the server side (usable in server side components and route handlers)
- `@kobbleio/next/client` => utilities to work on the client side (browser)
- `@kobbleio/next` => utilities that can safely be used on both sides

## Getting started

### Setup the middleware

Create a `middleware.ts` file in your project and add the following code:

```ts
import { authMiddleware } from '@kobbleio/next/server'

export default authMiddleware({
	publicRoutes: ['/'],
});

export const config = {
  matcher: [
    // exclude internal Next.js routes
    "/((?!.+\\.[\\w]+$|_next).*)",
    // reinclude api routes
    "/(api|trpc)(.*)"
  ]
};
```

This will automatically expose the following routes to your app:

- `/api/kobble/login` => initiate a login flow to your Kobble portal
- `/api/kobble/logout` => disconnect the current user from your app
- `/api/kobble/token` => get the current user's access token, refreshing it if necessary
- `/api/kobble/user` => get the current user's profile
