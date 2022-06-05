import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";
import { Icon } from "~/components/Icon";
import type { TIcon } from "~/components/Icon";

import pendingIcon from "~/assets/icons/pending";
import newIcon from "~/assets/icons/new";
import editIcon from "~/assets/icons/edit";
import logoutIcon from "~/assets/icons/logout";

type Location = {
  pathName: string;
  name: string;
  icon: TIcon
};

export default function BottomNavbar() {
  const { pathname } = useLocation();

  function customClasses(pathName: string) {
    return clsx({"text-xs font-normal tracking-tighter flex flex-col items-center text-primary font-semibold fill-primary": pathName === pathname}, {"text-xs font-normal tracking-tighter flex flex-col items-center fill-gray text-gray": pathName !== pathname});
  };

  const locations: Location[] = [
    {
      pathName: "/pedidos-pendentes",
      name: "Pedidos",
      icon: pendingIcon,
    },
    {
      pathName: "/novo-pedido",
      name: "Novo pedido",
      icon: newIcon,
    },
    {
      pathName: "/editar-dados",
      name: "Editar dados",
      icon: editIcon,
    },
    {
      pathName: "/logout",
      name: "",
      icon: logoutIcon,
    }
  ];

  return (
    <ul className="bg-white fixed left-0 right-0 bottom-0 grid grid-cols-4 p-4 items-center gap-1">
      { locations.map(({ pathName, name, icon }) => (
        <li key={name} className={customClasses(pathName)}>
          <Icon {...icon} customClasses="w-5 h-5"/>
          <Link to={pathName}>{name}</Link>
        </li>
      ))}
    </ul>
  )
}