import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import indexStyle from "./styles/index.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl, as: "style" },
    { rel: "stylesheet", href: indexStyle, as: "style" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Balcao Digital | Standard Bank",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en" className="h-full w-full scroll-smooth text-base">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col font-body w-full min-h-full font-normal leading-7 bg-bg">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
