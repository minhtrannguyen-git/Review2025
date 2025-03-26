import { FieldError, FieldValues, UseFormRegister } from "react-hook-form";

export type LoginFormData = {
  email: string;
  password: string;
};

export type SignupFormData = LoginFormData & {
    fullname:string
}

export type AuthFormFieldProps<T extends FieldValues, V> = {
  type: string;
  placeholder: string;
  name: V;
  register: UseFormRegister<T>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type LoginValidFieldNames =
  | "email"
  | "password";

export type SignupValidFieldName = LoginValidFieldNames | "fullname";