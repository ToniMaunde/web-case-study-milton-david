import { Form, Link, useSearchParams } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

import { prisma } from "~/db.server";
import { signup, createUserSession } from "~/utils/session.server";

/*
  422 = Unprocessable Entity
  404 = Not Found
  401 = Unauthorized
  400 = Bad Request
*/
type ActionData = {
  formError?: "422" | "404" | "401" | "400";
  formErrorMessage?: string;
  fields?: {
    intent: string | FormDataEntryValue | null;
    redirectTo: string | FormDataEntryValue | null;
    username: string | FormDataEntryValue | null;
    password: string | FormDataEntryValue | null;
  }
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 })
};

export const action: ActionFunction = async ({
  request
}) => {
  const form = await request.formData();
  const redirectTo = form.get("redirectTo");
  const countryCode = form.get("countryCode");
  const phoneNumber = form.get("phoneNumber");

  const userExists = await prisma.user.findFirst({
    where: { username },
  });

  if (userExists) return badRequest({
    fields,
    formError: "422",
    formErrorMessage: `The username ${username} is taken, choose a different one.`,
  });
  
  const user = await signup({ username, password });
  if (!user) {
    return badRequest({
      fields,
      formError: "400",
      formErrorMessage: "Something went wrong trying to sign you up.",
    });
  }
  return createUserSession(user.id, redirectTo);
};

export default function Index() {
  const [searchParams] = useSearchParams();

  return (
    <>
      <Navbar />
      <main className="flex flex-col p-2 mt-6">
        <h1 className="font-bold text-xl text-dark leading-7">
          Acesse novamente a aplicação e veja o estado dos seus pedidos. 
        </h1>
        <Form method="post" className="mt-4 flex flex-col">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? "/codigo-de-verificacao"
            }
          />
          <label className="flex flex-col">
            <span className="font-semibold text-gray">Numero de celular</span>
            <span className="grid grid-cols-3">
              <input className="p-3 bg-primary text-white rounded rounded-r-none border-gray border-2 border-r-0 focus:border-0 focus:outline-primary" name="countryCode" type="tel" inputMode="numeric" list="country-codes"  defaultValue="+258" required/>
              <input className="col-span-2 p-3 rounded rounded-l-none border-l-0 border-2 border-gray focus:border-0 focus:outline-primary" name="phoneNumber" type="tel" inputMode="numeric" min={9} required/>
            </span>
            <small className="text-xs text-gray">Uma SMS sera enviada com um codigo de verificacao</small>
          </label>
          <datalist id="country-codes">
            <option value="+258" />
            <option value="+1" />
            <option value="+254" />
          </datalist>
          <button type="submit" className="mt-6 mx-auto px-6 py-3 bg-primary text-base font-semibold text-white rounded">Seguinte</button>
        </Form>
        <p className="mt-6 text-center">Tem perfil? <Link to="/entrar" className="text-primary text-base font-semibold">Entrar</Link></p>
      </main>
    </>
  );
}
