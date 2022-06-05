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
  const fullName = form.get("fullName");
  const completePhoneNumber = `${countryCode}${phoneNumber}`;
  const intent = "sign up";

  // TODO: check whether the number is registered or not before redirecting in order to alert
  // the user that he could had simply clicked on the "Entrar" button to log in.

  return redirect(`/verificacao?phoneNumber=${completePhoneNumber}&fullName=${fullName}&intent=${intent}`, { status: 302 });
};

export default function Index() {
  const [searchParams] = useSearchParams();

  return (
    <>
      <Navbar />
      <main className="flex flex-col p-2 mt-6">
        <h1 className="font-bold text-4xl text-primary">Balcao Digital</h1>
        <h2 className="mt-4 font-semibold text-xl text-gray leading-7">
          Todos servicos do seu banco a distancia de um clique.
        </h2>
        <p className="mt-6 text-black font-bold text-lg">Registe-se, hoje!</p>
        <Form method="post" className="mt-2 flex flex-col">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? "/verificacao"
            }
          />
          <label className="flex flex-col">
            <span className="font-semibold text-gray">Nome completo</span>
            <input name="fullName" type="text" inputMode="text" className="p-3 rounded border-2 border-gray outline-primary focus:border-none" required autoFocus/>
          </label>
          <label className="flex flex-col mt-4">
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
