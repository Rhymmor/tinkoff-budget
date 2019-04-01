import * as React from "react";
import { Segment, Button } from "semantic-ui-react";
import { StatefulInput } from "../inputs/StatefulInput";
import { ICredentials } from "../../../lib/types/api";
import { MutatorHelper } from "../../lib/types/utils";

interface IProps {
    signUp: (credentials: ICredentials) => Promise<void>;
    loading: boolean;
    changeCredentials: MutatorHelper<Partial<ICredentials>>;
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
            <Segment.Group compact className="full-width">
                <Segment>
                    <StatefulInput
                        fluid
                        className="dark"
                        placeholder="Username"
                        value={username}
                        onSubmit={this.changeName}
                    />
                </Segment>
                <Segment>
                    <StatefulInput
                        fluid
                        className="dark"
                        placeholder="Password"
                        value={password}
                        onSubmit={this.changePassword}
                    />
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
            </Segment.Group>
        );
    }
}
