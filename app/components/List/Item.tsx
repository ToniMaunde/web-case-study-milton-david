import { Link } from "@remix-run/react";
import { timeStamp } from "console";

export type ListItem = {
  belongsTo: "pending requests" | "services"
  key: string;
  title: string;
  timestamp?: string;
  description?: string;
  linkText: string;
  linkTo: string;
};

export function Item(props: ListItem) {
  const { belongsTo, key, title, description, timestamp, linkText, linkTo } = props;
  return (
    <li key={key} className="bg-white drop-shadow rounded p-4 flex flex-col">
      <p className="text-base font-semibold text-primary">{title}</p>
      { belongsTo === "pending requests"
        ? <time className="text-xs text-gray font-normal mt-1">{timestamp}</time>
        : <small className="text-xs text-gray font-normal mt-1">{description}</small>
      }
      <Link to={linkTo} className="mt-5 px-3 py-2 font-semibold text-white bg-primary rounded w-fit">{linkText}</Link>
    </li>
  )
}