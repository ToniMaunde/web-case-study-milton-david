import { Link } from "@remix-run/react";
import logo from "~/assets/img/stb_logo.png";

export default function Navbar() {
  return (
    <nav className="flex items-center p-2">
      <p className="flex text-primary font-semibold text-xl w-fit">
        <img src={logo} alt="Standard Bank logo" className="mr-2 w-5 h-fit"/>
        <Link to="/">Standard Bank</Link>
      </p>
      <Link to="/entrar" className="ml-auto p-2 bg-primary text-sm font-semibold text-white rounded">Entrar</Link>
    </nav>
  )
}