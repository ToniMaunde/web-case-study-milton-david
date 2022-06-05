import { Link } from "@remix-run/react";
import logo from "~/assets/img/stb_logo.png";

export default function Navbar(prop: { route?: string}) {
  const { route } = prop;
  return (
    <nav className="flex items-center p-2">
      <p className="flex text-primary font-semibold text-xl w-fit">
        <img src={logo} alt="Standard Bank logo" className="mr-2 w-5 h-fit"/>
        <Link to="/">Standard Bank</Link>
      </p>
      { route === "/"
        ? <Link to="/entrar" className="ml-auto p-2 bg-primary text-sm font-semibold text-white rounded">Entrar</Link>
        : route === "/entrar"
          ? <Link to="/" className="ml-auto p-2 bg-primary text-sm font-semibold text-white rounded">Registar-se</Link>
          : null
      }
    </nav>
  )
}