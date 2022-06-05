import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, Link, useSearchParams, useActionData } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import { Input } from "~/components/Input";
import type { TInput } from "~/components/Input";
import { signup, createCustomerSession } from "~/utils/session.server";

// TODO: solve the warning regarding the Input component

type ActionData = {
  formError?: "422" | "404" | "401" | "400";
  formErrorMessage?: string;
  fields?: {
    phoneNumber: string | FormDataEntryValue | null;
    intent: string | FormDataEntryValue | null;
  }
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400, })
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const intent = form.get("intent");
  const phoneNumber = form.get("phoneNumber");
  const one = form.get("one") as string;
  const two = form.get("two") as string;
  const three = form.get("three") as string;
  const four = form.get("four") as string;
  const five = form.get("five") as string;
  const six = form.get("six") as string;

  const verificationNumbers: String[] = [one, two, three, four, five, six];
  const undefinedChars = verificationNumbers.filter(char => char === undefined);
  const longChars = verificationNumbers.filter(char => char.length > 1);
  
  if (undefinedChars.length > 0) return badRequest({ formError: "400", formErrorMessage: "Codigo de confirmacao incompleto", fields: { intent, phoneNumber }});

  if (longChars.length > 0) return badRequest({ formError: "400", formErrorMessage: "Cada caracter do codigo de verificacao deve ter apenas um digito.", fields: { intent, phoneNumber }});

  // TODO: add refs to the Input components to move from one input to the other after one
  // char is inserted and to target the inputs with errors

  // TODO: hook the app to an OTP service. Currently any verification number is accepted.

  if (typeof phoneNumber !== "string") {
    return badRequest({ formError: "400", formErrorMessage: "Numero de celular invalido", fields: { intent, phoneNumber }});
  } else {
    if (intent === "sign up") {
      const customer = await signup(phoneNumber);
      if (!customer) {
        return badRequest({
          formError: "400",
          formErrorMessage: "Ocorreu um erro ao tentar criar o seu perfil.",
          fields: { intent, phoneNumber },
        });
      }
      return createCustomerSession(customer.id, "/pedidos-pendentes");
    }
  }
};

export default function Verificacao() {
  const [searchParams] = useSearchParams();
  const phoneNumber = searchParams.get("phoneNumber") as string;
  const intent = searchParams.get("intent") as string;

  const inputProps: TInput = {
    type: "number",
    inputMode: "numeric",
    maxLength: 1,
    min: 0,
    required: true,
    className: "p-3 rounded border-2 border-gray outline-none focus:border-primary",
  };

  const actionData = useActionData<ActionData>();

  return (
    <>
      <Navbar />
      <main className="flex flex-col p-2 mt-6">
        <p className="text-gray text-base leading-7">
          Introduza o codigo de verificacao enviado para o <span className="text-primary font-medium">+{phoneNumber || actionData?.fields?.phoneNumber}.</span>
        </p>
        <Form method="post" className="mt-4 flex flex-col">
          <input type="hidden" name="phoneNumber" value={phoneNumber || (actionData?.fields?.phoneNumber) as string} />
          <input type="hidden" name="intent" value={intent || (actionData?.fields?.intent) as string} />
          <label htmlFor="one" className="font-semibold text-gray">Codigo de verificacao</label>
          <div className="grid grid-cols-6 gap-1">
            <Input {...inputProps} name="one" id="one"/>
            <Input {...inputProps} name="two"/>
            <Input {...inputProps} name="three"/>
            <Input {...inputProps} name="four"/>
            <Input {...inputProps} name="five"/>
            <Input {...inputProps} name="six"/>
            { actionData?.formError === "400"
              ? (
                <small role="alert" className="col-span-6 text-red text-xs mt-1">{actionData.formErrorMessage}</small>
              )
              : null
            }
          </div>
          <button type="submit" className="mt-6 mx-auto px-6 py-3 bg-primary text-base font-semibold text-white rounded">Confirmar</button>
          <Link to="/" className="mt-6 mx-auto px-6 py-3 text-base font-semibold text-dark rounded">Trocar numbero de celular</Link>
        </Form>
      </main>
    </>
  )
}