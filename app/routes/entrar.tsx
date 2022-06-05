import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { redirect, json } from "@remix-run/server-runtime";
import type { ActionFunction } from "@remix-run/server-runtime";
import Navbar from "~/components/Navbar";
import { prisma } from "~/db.server";
import { getCustomerId, signin} from "~/utils/session.server";

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

export const action: ActionFunction = async ({
  request
}) => {
  const form = await request.formData();
  const countryCode = form.get("countryCode");
  const phoneNumber = form.get("phoneNumber");
  const completePhoneNumber = `${countryCode}${phoneNumber}`;
  const intent = "sign in";

  console.log(completePhoneNumber);

  const customer = await signin(completePhoneNumber);

  if (!customer) {
    return badRequest({ formError: "404", formErrorMessage: "O número de celular não está registado.", fields: { intent, phoneNumber: completePhoneNumber }});
  }

  const customerId = await getCustomerId(request);

  if (!customerId) return redirect(`/verificacao?phoneNumber=${completePhoneNumber}&intent=${intent}`);
  // TODO: investigate why customerId is always null
  return redirect("/pedidos-pendentes");
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();

  return (
    <>
      <Navbar route="/entrar" />
      <main className="flex flex-col p-2 mt-6">
        <h1 className="font-bold text-xl text-dark leading-7">
          Acesse novamente a aplicação e veja o estado dos seus pedidos. 
        </h1>
        <Form method="post" className="mt-4 flex flex-col">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? "/verificacao"
            }
          />
          <label className="flex flex-col">
            <span className="font-semibold text-gray">Numero de celular</span>
            <span className="grid grid-cols-3">
              <input className="p-3 bg-primary text-white rounded rounded-r-none border-gray border-2 border-r-0 focus:border-0 focus:outline-primary" name="countryCode" type="tel" inputMode="numeric" list="country-codes" defaultValue="+258" maxLength={3} required/>
              <input className="col-span-2 p-3 rounded rounded-l-none border-l-0 border-2 border-gray focus:border-0 focus:outline-primary" name="phoneNumber" type="tel" inputMode="numeric" minLength={9} required/>
            </span>
            {
              actionData?.formError === "404"
                ? <small role="alert" className="col-span-6 text-red text-xs mt-1">{actionData.formErrorMessage}</small>
                : <small className="text-xs text-gray">Uma SMS sera enviada com um codigo de verificacao</small>
            }
          </label>
          <datalist id="country-codes">
            <option value="+258" />
            <option value="+1" />
            <option value="+254" />
          </datalist>
          <button type="submit" className="mt-6 mx-auto px-6 py-3 bg-primary text-base font-semibold text-white rounded">Seguinte</button>
        </Form>
        <p className="mt-6 text-center">Nao tem perfil? <Link to="/" className="text-primary text-base font-semibold">Registar-se</Link></p>
      </main>
    </>
  );
}
