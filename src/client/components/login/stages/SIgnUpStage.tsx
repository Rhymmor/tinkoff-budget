import * as React from "react";
import { Segment, Button } from "semantic-ui-react";
import { ICredentials } from "../../../../lib/types/api";
import { Flex } from "../../layout/Flex";
import { Formik, FormikErrors } from "formik";
import { isOk } from "../../../../lib/utils";
import { Field } from "../../inputs/field";
import { getSubmitButtonProps } from "../../../lib/forms/submit";
// tslint:disable-next-line:no-var-requires
const { Form } = require("formik");

interface IProps {
    signUp: (credentials: ICredentials) => Promise<void>;
}

interface IFormState {
    username: string;
    password: string;
}

export class SignUpStage extends React.Component<IProps> {
    private static readonly initialValues: IFormState = { username: "", password: "" };

    private onSubmit = (values: IFormState): Promise<any> => {
        return this.props.signUp(values);
    };

    private validate = (values: IFormState): FormikErrors<IFormState> => {
        const errors: FormikErrors<IFormState> = {};

        if (!isOk(values.username) || values.username === "") {
            errors.username = `Username shouldn't be empty`;
        }
        if (!isOk(values.password) || values.password === "") {
            errors.password = `Password shouldn't be empty`;
        }

        return errors;
    };

    public render() {
        return (
            <>
                <Formik<IFormState>
                    initialValues={SignUpStage.initialValues}
                    initialErrors={this.validate(SignUpStage.initialValues)}
                    validate={this.validate}
                    onSubmit={this.onSubmit}
                >
                    {state => (
                        <Form autoComplete="off">
                            <Segment>
                                <Flex align="center" direction="column" className="login-form__inputs">
                                    <Field
                                        fluid
                                        type="text"
                                        autoComplete="off"
                                        className="dark padding-bottom"
                                        placeholder="Username"
                                        name="username"
                                    />
                                    <Field
                                        fluid
                                        type="password"
                                        autoComplete="off"
                                        className="dark padding-top"
                                        placeholder="Password"
                                        name="password"
                                    />
                                </Flex>
                            </Segment>
                            <Segment>
                                <Button {...getSubmitButtonProps(state)} type="submit" color="yellow" floated="right">
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
