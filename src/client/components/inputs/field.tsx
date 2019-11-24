import * as React from "react";
import { FieldAttributes, useField } from "formik";
import { Input, InputProps } from "semantic-ui-react";

export const Field = <T extends object>(props: FieldAttributes<T> & Omit<InputProps, "tabIndex">) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and also replace ErrorMessage entirely.
    const [field] = useField<T>(props);
    return (
        <>
            <Input {...field} {...props} />
        </>
    );
};
