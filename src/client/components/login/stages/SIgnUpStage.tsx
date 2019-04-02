import * as React from "react";
import { Segment, Button } from "semantic-ui-react";
import { StatefulInput } from "../../inputs/StatefulInput";
import { ICredentials } from "../../../../lib/types/api";
import { Flex } from "../../layout/Flex";

interface IProps {
    signUp: (credentials: ICredentials) => Promise<void>;
    loading: boolean;
}

interface IState {
    username: string;
    password: string;
}

export class SignUpStage extends React.Component<IProps, IState> {
    public readonly state: IState = {
        username: "",
        password: ""
    };

    private changeName = (username: string) => {
        this.setState({ username });
    };

    private changePassword = (password: string) => {
        this.setState({ password });
    };

    private clickLogin = () => {
        const { username, password } = this.state;
        this.props.signUp({ username, password });
    };

    public render() {
        const { loading } = this.props;
        const { username, password } = this.state;
        return (
            <>
                <Segment>
                    <Flex align="center" direction="column" className="login-form__inputs">
                        <StatefulInput
                            fluid
                            className="dark padding-bottom"
                            placeholder="Username"
                            value={username}
                            onSubmit={this.changeName}
                        />
                        <StatefulInput
                            fluid
                            className="dark padding-top"
                            placeholder="Password"
                            value={password}
                            onSubmit={this.changePassword}
                        />
                    </Flex>
                </Segment>
                <Segment>
                    <Button
                        loading={loading}
                        onClick={this.clickLogin}
                        disabled={loading}
                        color="yellow"
                        floated="right"
                    >
                        Login
                    </Button>
                </Segment>
            </>
        );
    }
}
