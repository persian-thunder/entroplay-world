import { redirect } from "next/navigation";
import { research } from "./data";

// No index view — jump straight to the first piece.
export default function Page() {
  redirect(`/research/${Object.keys(research)[0]}`);
}
