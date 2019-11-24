import { FormikProps } from "formik";

export function canSubmit(state: FormikProps<any>) {
    return state.isValid && !state.isSubmitting;
}
