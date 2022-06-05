import { Item } from "./Item";
import type { ListItem } from "./Item";

export default function List(prop: {list: ListItem[]}) {
  const { list } = prop;
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {
        list.map(item => (
          <Item {...item} key={item.key} />
        ))
      }
    </ul>
  )
}