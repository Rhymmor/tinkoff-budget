import * as React from "react";
import { Card, Grid, Segment, Button, Message } from "semantic-ui-react";
import { StatefulInput } from "../inputs/StatefulInput";
import { ApiLoginUtils } from "../../lib/api/login";
import { isOk } from "../../../lib/utils";
import { IStore } from "../../redux/models";
import { ISessionCredentials } from "../../redux/models/session";
import { ICredentials } from "../../../lib/types/api";
import { AsyncStoreState } from "../../redux/models/utils";
import { connect } from "react-redux";

interface IDispatchProps {
    changeName: (username: string) => void;
    changePassword: (password: string) => void;
}

interface IStateToProps {
    credentials: ISessionCredentials & ICredentials;
}

interface IOwnProps {}

interface IProps extends IStateToProps, IOwnProps, IDispatchProps {}

interface IState {
    state: AsyncStoreState;
    error?: string;
}

function mapStateToProps({ session: { credentials } }: IStore, _ownProps: IOwnProps): IStateToProps {
    return {
        credentials: {
            ...credentials,
            username: credentials.username || "",
            password: credentials.password || ""
        }
    };
}

function mapDispatch(store: IStore, _ownProps: IOwnProps): IDispatchProps {
    const {
        session: { modifyCredentials }
    } = store;
    return {
        changeName: value => modifyCredentials(x => (x.username = value)),
        changePassword: value => modifyCredentials(x => (x.password = value))
    };
}

class LoginFormImpl extends React.Component<IProps, IState> {
    public readonly state: IState = {
        state: AsyncStoreState.Unknown
    };

    private signUp = () => {
        const {
            credentials: { username, password }
        } = this.props;
        this.setState({ state: AsyncStoreState.Loading });
        return ApiLoginUtils.signUp(username, password)
            .then(() => this.setState({ state: AsyncStoreState.Success }))
            .catch(e => this.setState({ state: AsyncStoreState.Failed, error: String(e) }));
    };

    public render() {
        const {
            credentials: { username, password }
        } = this.props;
        const { state, error } = this.state;
        const isLoading = state === AsyncStoreState.Loading;
        const hasError = state === AsyncStoreState.Failed && isOk(error);
        return (
            <Card centered fluid className="login-form">
                <Card.Content>
                    <Grid>
                        <Grid.Row centered>
                            <Segment.Group compact className="full-width">
                                {hasError && (
                                    <Segment>
                                        <Message error>
                                            <Message.Header>Signing up failed</Message.Header>
                                            <p>{error}</p>
                                        </Message>
                                    </Segment>
                                )}
                                <Segment>
                                    <StatefulInput
                                        fluid
                                        className="dark"
                                        placeholder="Username"
                                        value={username}
                                        onSubmit={this.props.changeName}
                                    />
                                </Segment>
                                <Segment>
                                    <StatefulInput
                                        fluid
                                        className="dark"
                                        placeholder="Password"
                                        value={password}
                                        onSubmit={this.props.changePassword}
                                    />
                                </Segment>
                                <Segment>
                                    <Button
                                        loading={isLoading}
                                        onClick={this.signUp}
                                        disabled={isLoading}
                                        color="yellow"
                                        floated="right"
                                    >
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

export const LoginForm = connect<IStateToProps, IDispatchProps, IOwnProps, IStore>(
    mapStateToProps,
    mapDispatch as any
)(LoginFormImpl);
