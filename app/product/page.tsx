import { redirect } from "next/navigation";
import { design } from "./data";

// No index view — jump straight to the first piece.
export default function Page() {
  redirect(`/product/${Object.keys(design)[0]}`);
}
