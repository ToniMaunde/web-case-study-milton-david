export type TInput = {
  id?: string;
  className: string;
  name?: string;
  type: string;
  inputMode: "search" | "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal" | undefined;
  max?: number;
  min?: number;
  minLength?: number;
  maxLength?: number;
  required: boolean;
}

export function Input(props: TInput) {
  return (
    <input {...props} value={undefined}/>
  )
}