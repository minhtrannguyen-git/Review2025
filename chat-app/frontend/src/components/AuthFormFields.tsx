import { AuthFormFieldProps, LoginFormData, LoginValidFieldNames, SignupFormData, SignupValidFieldName } from "../types/authForm.type";

export const LoginAuthFormField: React.FC<AuthFormFieldProps<LoginFormData, LoginValidFieldNames> & { className?: string }> = ({
    type,
    placeholder,
    name,
    register,
    error,
    valueAsNumber,
    className
}) => (
    <>
        <input
            type={type}
            placeholder={placeholder}
            className={className || ""}
            {...register(name, { valueAsNumber })}
        />
    </>
);
export const SignupAuthFormField: React.FC<AuthFormFieldProps<SignupFormData, SignupValidFieldName> & { className?: string }> = ({
    type,
    placeholder,
    name,
    register,
    error,
    valueAsNumber,
    className
}) => (
    <>
        <input
            type={type}
            placeholder={placeholder}
            className={className||""}
            {...register(name, { valueAsNumber })}
        />
    </>
);