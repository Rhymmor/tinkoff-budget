import { FormikProps } from "formik";

export function getSubmitButtonProps(state: FormikProps<any>) {
    return {
        loading: state.isSubmitting,
        onClick: state.submitForm,
        disabled: !canSubmit(state)
    };
}

function canSubmit(state: FormikProps<any>) {
    return state.isValid && !state.isSubmitting;
}
