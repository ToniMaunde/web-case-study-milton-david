import { useSearchParams } from "@remix-run/react";
import Navbar from "~/components/Navbar";

export default function Verificacao() {
  const [searchParams] = useSearchParams()
  return (
    <>
      <Navbar />
      <main className="flex flex-col p-2 mt-6">
        <p className="text-gray">
          {`Introduza o codigo de verificacao enviado para o ${searchParams.get("phoneNumber")}`}
        </p>
      </main>
    </>
  )
}