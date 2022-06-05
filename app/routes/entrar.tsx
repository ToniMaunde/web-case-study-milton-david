import { Form, Link, useSearchParams } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import type { ActionFunction } from "@remix-run/server-runtime";
import Navbar from "~/components/Navbar";

export const action: ActionFunction = async ({
  request
}) => {
  const form = await request.formData();
  const countryCode = form.get("countryCode");
  const phoneNumber = form.get("phoneNumber");
  const completePhoneNumber = `${countryCode}${phoneNumber}`;
  const intent = "sign in";

  // TODO: check whether the number is registered or not before redirecting in order to alert
  // the user that he might need to sign up before loggin in.

  return redirect(`/verificacao?phoneNumber=${completePhoneNumber}&intent=${intent}`, { status: 302 });
};

export default function Index() {
  const [searchParams] = useSearchParams();

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
              <input className="p-3 bg-primary text-white rounded rounded-r-none border-gray border-2 border-r-0 focus:border-0 focus:outline-primary" name="countryCode" type="tel" inputMode="numeric" list="country-codes"  defaultValue="+258" maxLength={3} required/>
              <input className="col-span-2 p-3 rounded rounded-l-none border-l-0 border-2 border-gray focus:border-0 focus:outline-primary" name="phoneNumber" type="tel" inputMode="numeric" minLength={9} required/>
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
