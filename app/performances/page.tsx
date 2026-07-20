import { redirect } from "next/navigation";
import { performances } from "./data";

// No index view — jump straight to the first piece.
export default function Page() {
  redirect(`/performances/${Object.keys(performances)[0]}`);
}
