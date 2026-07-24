import { redirect } from "next/navigation";
import { exhibitions } from "./data";

// No index view — jump straight to the first piece.
export default function Page() {
  redirect(`/exhibitions/${Object.keys(exhibitions)[0]}`);
}
