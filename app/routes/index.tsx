import { Form, Link } from "@remix-run/react";
import Navbar from "~/components/Navbar";

export default function Index() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col p-2 mt-6">
        <h1 className="font-bold text-xl text-dark leading-7">
          Acesse novamente a aplicação e veja o estado dos seus pedidos. 
        </h1>
        <Form method="post" className="mt-4 flex flex-col">
          <label className="flex flex-col">
            <span className="font-semibold text-gray">Numero de celular</span>
            <span className="grid grid-cols-3">
              <input className="p-3 bg-primary text-white rounded rounded-r-none border-gray border-2 border-r-0 focus:border-0 focus:outline-primary" name="countryCode" type="tel" inputMode="numeric" list="country-codes"  defaultValue={"+258"}/>
              <input className="col-span-2 p-3 rounded rounded-l-none border-l-0 border-2 border-gray focus:border-0 focus:outline-primary" type="tel" inputMode="numeric"/>
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
