import * as React from "react";
import { Card, Grid, Segment, Message } from "semantic-ui-react";
import { ApiLoginUtils } from "../../lib/api/login";
import { isOk } from "../../../lib/utils";
import { IStore } from "../../redux/models";
import { ICredentials } from "../../../lib/types/api";
import { AsyncStoreState } from "../../redux/models/utils";
import { connect } from "react-redux";
import { SignUpStage } from "./SIgnUpStage";
import { MutatorHelper } from "../../lib/types/utils";

interface IDispatchProps {
    changeCredentials: MutatorHelper<Partial<ICredentials>>;
    initSession: () => Promise<void>;
}

interface IStateToProps {}

interface IOwnProps {}

interface IProps extends IStateToProps, IOwnProps, IDispatchProps {}

interface IState {
    state: AsyncStoreState;
    error?: string;
}

function mapStateToProps(_store: IStore, _ownProps: IOwnProps): IStateToProps {
    return {};
}

function mapDispatch(store: IStore, _ownProps: IOwnProps): IDispatchProps {
    const {
        session: { modifyCredentials, initSession }
    } = store;
    return {
        changeCredentials: modifyCredentials,
        initSession: () => initSession()
    };
}

class LoginFormImpl extends React.Component<IProps, IState> {
    public readonly state: IState = {
        state: AsyncStoreState.Unknown
    };

    private signUp = ({ username, password }: ICredentials) => {
        this.setState({ state: AsyncStoreState.Loading });
        return this.props
            .initSession()
            .then(() => ApiLoginUtils.signUp(username, password))
            .then(() => {
                this.setState({ state: AsyncStoreState.Success });
                this.props.changeCredentials(x => {
                    x.username = username;
                    x.password = password;
                });
            })
            .catch(e => this.setState({ state: AsyncStoreState.Failed, error: String(e) }));
    };

    public render() {
        const { changeCredentials } = this.props;
        const { state, error } = this.state;
        const isLoading = state === AsyncStoreState.Loading;
        const hasError = state === AsyncStoreState.Failed && isOk(error);
        return (
            <Card centered fluid className="login-form">
                <Card.Content>
                    <Grid>
                        <Grid.Row centered>
                            {hasError && (
                                <Segment>
                                    <Message error>
                                        <Message.Header>Signing up failed</Message.Header>
                                        <p>{error}</p>
                                    </Message>
                                </Segment>
                            )}
                            <SignUpStage
                                loading={isLoading}
                                signUp={this.signUp}
                                changeCredentials={changeCredentials}
                            />
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
