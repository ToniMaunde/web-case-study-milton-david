import { createCookieSessionStorage } from "@remix-run/node";
import { redirect } from "@remix-run/server-runtime";
// import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

type SignUpForm = {
  phoneNumber: string;
  fullName: string;
};

export async function signup({phoneNumber, fullName} : SignUpForm) {
  let number = phoneNumber.trim();
  number = `+${number}`;
  console.log(number);
  const customer = await prisma.customer.create({ data: { phoneNumber: number, fullName, email: ""} });
  return { id: customer.id, phoneNumber: customer.phoneNumber };
};

export async function signin(phoneNumber: string) {
  const customer = await prisma.customer.findUnique({ where: { phoneNumber } });
  if (!customer) return null;
  return { id: customer.id, phoneNumber: customer.phoneNumber };
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
};

const customerSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "Customer_Session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
});

const agentSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "Agent_Session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1,
    httpOnly: true
  }
});

async function getCustomerSession(request: Request) {
  return customerSessionStorage.getSession(request.headers.get("Cookie"));
};

async function getAgentSession(request: Request) {
  return agentSessionStorage.getSession(request.headers.get("Cookie"));
};

export async function getCustomerId(request: Request) {
  const session = await getCustomerSession(request);
  const customerId = session.get("customerId");
  if (!customerId || typeof customerId !== "string") return null;
  return customerId;
};

export async function getAgentId(request: Request) {
  const session = await getAgentSession(request);
  const agentId = session.get("agentId");
  if (!agentId || typeof agentId !== "string") return null;
  return agentId;
};

export async function createCustomerSession(
  customerId: string,
  redirectTo: string,
  request: Request
) {
  const session = await getCustomerSession(request);
  session.set("customerId", customerId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await customerSessionStorage.commitSession(session)
    }
  });
};

export async function createAgentSession(
  agentId: string,
  redirectTo: string
) {
  const session = await agentSessionStorage.getSession();
  session.set("agentId", agentId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await agentSessionStorage.commitSession(session)
    }
  });
};

export async function signout(request: Request) {
  const session = await getCustomerSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await customerSessionStorage.destroySession(session),
    }
  })
};

export async function signoutAgent(request: Request) {
  const session = await getAgentSession(request);
  return redirect("/backoffice", {
    headers: {
      "Set-Cookie": await agentSessionStorage.destroySession(session),
    }
  })
};

export async function getCustomer(request: Request) {
  const customerId = await getCustomerId(request);
  if (typeof customerId!== "string") return null;

  try {
    const user = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, phoneNumber: true, email: true }
    });
    return user;
  } catch {
    throw signout(request);
  }
};

export async function requireCustomerId(
  request: Request, redirectTo: string = new URL(request.url).pathname
) {
  const session = await getCustomerSession(request);
  const customerId = session.get("customerId");
  if (!customerId || typeof customerId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ])
    throw redirect(`/?${searchParams}`);
  }
  return customerId;
};

export async function requireAgentId(
  request: Request, redirectTo: string = new URL(request.url).pathname
) {
  const session = await getAgentSession(request);
  const agentId = session.get("agentId");
  if (!agentId || typeof agentId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ])
    throw redirect(`/backoffice?${searchParams}`);
  }
  return agentId;
};