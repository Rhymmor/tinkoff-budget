import { FormikState } from "formik";
import isEmpty from "lodash/isEmpty";

export function canSubmit(state: FormikState<any>) {
    return state.isValidating && state.isSubmitting && isEmpty(state.errors);
}
