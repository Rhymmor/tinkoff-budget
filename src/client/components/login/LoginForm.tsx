import * as React from "react";
import { Card, Grid, Segment, Button } from "semantic-ui-react";
import { StatefulInput } from "../inputs/StatefulInput";

interface IProps {}

interface IState {
    username: string;
    password: string;
}

export class LoginForm extends React.Component<IProps, IState> {
    public readonly state: IState = {
        username: "",
        password: ""
    };

    public setName = (username: string) => this.setState({ username });
    public setPassword = (password: string) => this.setState({ password });

    public render() {
        const { username, password } = this.state;
        return (
            <Card centered fluid className="login-form">
                <Card.Content>
                    <Grid>
                        <Grid.Row centered>
                            <Segment.Group compact className="full-width">
                                <Segment>
                                    <StatefulInput
                                        fluid
                                        className="dark"
                                        placeholder="Username"
                                        value={username}
                                        onSubmit={this.setName}
                                    />
                                </Segment>
                                <Segment>
                                    <StatefulInput
                                        fluid
                                        className="dark"
                                        placeholder="Password"
                                        value={password}
                                        onSubmit={this.setPassword}
                                    />
                                </Segment>
                                <Segment>
                                    <Button color="yellow" floated="right">
                                        Login
                                    </Button>
                                </Segment>
                            </Segment.Group>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
        );
    }
}
