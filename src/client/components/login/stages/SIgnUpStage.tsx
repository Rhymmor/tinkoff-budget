import * as React from "react";
import { Segment, Button } from "semantic-ui-react";
import { ICredentials } from "../../../../lib/types/api";
import { Flex } from "../../layout/Flex";
import { Formik, FormikErrors } from "formik";
import { isOk } from "../../../../lib/utils";
import { Field } from "../../inputs/field";
import isEmpty from "lodash/isEmpty";
import { canSubmit } from "../../../lib/forms/submit";
// tslint:disable-next-line:no-var-requires
const { Form } = require("formik");

interface IProps {
    signUp: (credentials: ICredentials) => Promise<void>;
    loading: boolean;
}

interface IFormState {
    username: string;
    password: string;
}

export class SignUpStage extends React.Component<IProps> {
    private clickLogin = (values: IFormState) => {
        this.props.signUp(values);
    };

    private validate = (values: IFormState): FormikErrors<IFormState> => {
        const errors: FormikErrors<IFormState> = {};

        if (!isOk(values.username) || values.username === "") {
            errors.password = `Username shouldn't be empty`;
        }
        if (!isOk(values.password) || values.password === "") {
            errors.password = `Password shouldn't be empty`;
        }

        return errors;
    };

    public render() {
        const { loading } = this.props;
        return (
            <>
                <Formik<IFormState>
                    initialValues={{ username: "", password: "" }}
                    validate={this.validate}
                    onSubmit={this.clickLogin}
                >
                    {state => (
                        <Form>
                            <Segment>
                                <Flex align="center" direction="column" className="login-form__inputs">
                                    <Field
                                        fluid
                                        type="text"
                                        autoComplete="username"
                                        className="dark padding-bottom"
                                        placeholder="Username"
                                        name="username"
                                    />
                                    <Field
                                        fluid
                                        type="password"
                                        autoComplete="current-password"
                                        className="dark padding-top"
                                        placeholder="Password"
                                        name="password"
                                    />
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
                                    Login
                                </Button>
                            </Segment>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }
}
