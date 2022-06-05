import BottomNavbar from "~/components/BottomNavbar";
import List from "~/components/List/List";
import type { ListItem } from "~/components/List/Item";

export default function PendingRequests() {
  const dummyData: ListItem[] = [
    {
      belongsTo: "pending requests",
      key: "1",
      timestamp: "03/06/2022 as 12:41PM",
      linkText: "Ver estado",
      linkTo: "#",
      title: "Pedido de criacao de Conta individual"
    },
    {
      belongsTo: "pending requests",
      key: "2",
      timestamp: "03/06/2022 as 12:41PM",
      linkText: "Ver estado",
      linkTo: "#",
      title: "Pedido de criacao de Conta individual"
    },
  ];

  return (
    <>
      <main className="flex flex-col p-2 mt-6">
        <h1 className="font-bold text-lg text-dark leading-7">Veja o estado dos seus pedidos anteriores</h1>
        <List list={dummyData}/>
      </main>
      <BottomNavbar />
    </>
  )
}