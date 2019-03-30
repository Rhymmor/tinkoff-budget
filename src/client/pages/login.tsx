import * as React from "react";
import { Page } from "../components/layout";
import { LoginForm } from "../components/login/LoginForm";
import { Grid } from "semantic-ui-react";
import "./login.scss";

interface IProps {}

interface IState {}

export class LoginPage extends React.Component<IProps, IState> {
    public render() {
        return (
            <Page>
                <Grid verticalAlign="middle" centered className="full-height">
                    <Grid.Row centered>
                        <Grid.Column width={6}>
                            <LoginForm />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Page>
        );
    }
}
