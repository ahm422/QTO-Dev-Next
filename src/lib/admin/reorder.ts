export type ReorderItem = { id: string; order: number };

export async function persistOrderUpdates(
  items: ReorderItem[],
  update: (id: string, order: number) => Promise<unknown>
) {
  await Promise.all(items.map((item) => update(item.id, item.order)));
}
