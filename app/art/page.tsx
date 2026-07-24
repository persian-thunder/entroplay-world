import { redirect } from "next/navigation";

// No index view — jump straight to the first piece.
export default function Page() {
  redirect("/art/experimental");
}
