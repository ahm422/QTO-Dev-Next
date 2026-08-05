import { revalidatePath } from "next/cache";

export function revalidateStatPages() {
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/requirements");
}
