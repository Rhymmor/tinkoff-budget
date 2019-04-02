import * as React from "react";
import { Card, Grid, Segment, Message } from "semantic-ui-react";
import { ApiLoginUtils } from "../../lib/api/login";
import { isOk } from "../../../lib/utils";
import { IStore } from "../../redux/models";
import { ICredentials } from "../../../lib/types/api";
import { AsyncStoreState } from "../../redux/models/utils";
import { connect } from "react-redux";
import { SignUpStage } from "./stages/SIgnUpStage";
import { MutatorHelper } from "../../lib/types/utils";
import { LoginStage } from "./constants";
import { ConfirmStage } from "./stages/ConfirmStage";
import { logger } from "../../lib/logger";

interface IDispatchProps {
    changeCredentials: MutatorHelper<Partial<ICredentials>>;
    initSession: (force?: boolean) => Promise<void>;
}

interface IStateToProps {}

interface IOwnProps {}

interface IProps extends IStateToProps, IOwnProps, IDispatchProps {}

interface IState {
    state: AsyncStoreState;
    error?: string;
    stage: LoginStage;
    operationalTicket?: string;
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
        initSession: (force = false) => initSession(force)
    };
}

class LoginFormImpl extends React.Component<IProps, IState> {
    public readonly state: IState = {
        state: AsyncStoreState.Unknown,
        stage: LoginStage.Signup
    };

    private signUp = ({ username, password }: ICredentials) => {
        this.setState({ state: AsyncStoreState.Loading });

        return this.props
            .initSession()
            .then(() => ApiLoginUtils.signUp(username, password))
            .then(({ data: { operationalTicket } }) => {
                this.setState({ operationalTicket, state: AsyncStoreState.Success, stage: LoginStage.Confirm });
                this.props.changeCredentials(x => {
                    x.username = username;
                    x.password = password;
                });
            })
            .catch(e => this.setErrorState(e));
    };

    private confirmSignUp = (smsPin: string) => {
        const { operationalTicket } = this.state;
        if (!operationalTicket) {
            return this.setErrorState("No operational ticket. Try sign up again");
        }
        this.setState({ state: AsyncStoreState.Loading });
        return ApiLoginUtils.confirm(smsPin, operationalTicket)
            .then(() => {
                this.setState({ state: AsyncStoreState.Success });
            })
            .catch(e => this.setErrorState(e));
    };

    private setErrorState = (e: any) => {
        logger.error({ e });
        this.setState({ state: AsyncStoreState.Failed, error: String(e) });
    };

    private renderStage = (stage: LoginStage) => {
        const { state } = this.state;
        const isLoading = state === AsyncStoreState.Loading;
        if (stage === LoginStage.Signup) {
            return <SignUpStage loading={isLoading} signUp={this.signUp} />;
        }
        if (stage === LoginStage.Confirm) {
            return <ConfirmStage loading={isLoading} confirmSignUp={this.confirmSignUp} />;
        }
        return null;
    };

    public render() {
        const { state, error, stage } = this.state;
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
                                {this.renderStage(stage)}
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
