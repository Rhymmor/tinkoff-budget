import * as React from "react";
import { Segment, Button } from "semantic-ui-react";
import { Flex } from "../../layout/Flex";
import { FormikErrors, Formik } from "formik";
import { canSubmit } from "../../../lib/forms/submit";
import { Field } from "../../inputs/field";
// tslint:disable-next-line:no-var-requires
const { Form } = require("formik");

interface IProps {
    confirmSignUp: (smsPin: string) => Promise<void> | void;
    loading: boolean;
}

interface IFormState {
    smsPin: string;
}

export class ConfirmStage extends React.Component<IProps> {
    private static readonly initialValues: IFormState = { smsPin: "" };

    private isPinValid = (smsPin: string) => !!smsPin && smsPin.length === 4;

    private validate = (values: IFormState): FormikErrors<IFormState> => {
        const errors: FormikErrors<IFormState> = {};

        if (!this.isPinValid(values.smsPin)) {
            errors.smsPin = "PIN should have 4 digits";
        }

        return errors;
    };

    private onSumbit = (values: IFormState) => {
        this.props.confirmSignUp(values.smsPin);
    };

    public render() {
        const { loading } = this.props;
        return (
            <>
                <Formik<IFormState>
                    initialValues={ConfirmStage.initialValues}
                    initialErrors={this.validate(ConfirmStage.initialValues)}
                    validate={this.validate}
                    onSubmit={this.onSumbit}
                >
                    {state => (
                        <Form>
                            <Segment>
                                <Flex align="center" direction="column" className="login-form__inputs">
                                    <Field fluid className="dark" placeholder="4-digit PIN" size="huge" name="smsPin" />
                                </Flex>
                            </Segment>
                            <Segment>
                                <Button
                                    type="submit"
                                    loading={loading}
                                    onClick={state.submitForm}
                                    disabled={!canSubmit(state) || loading}
                                    color="yellow"
                                    floated="right"
                                >
                                    Confirm
                                </Button>
                            </Segment>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }
}
