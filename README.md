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

This middleware will automatically expose various routes to handle authentication.

### Setup client side provider

To leverage kobble utilities inside client side components, you need to wrap your app with the `KobbleProvider` component.
This is commonly done in the top level `layout.tsx` file as shown below:

```ts
import { KobbleProvider } from "@kobbleio/next/server";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
	  	<KobbleProvider>
	  		{children}
		</KobbleProvider>
	  </body>
    </html>
  );
}
```

Note that `KobbleProvider` itself is a server side component, and as such should not be rendered by a client component directly.
