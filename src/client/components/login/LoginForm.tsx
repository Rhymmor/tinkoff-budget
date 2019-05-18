import * as React from "react";
import { Card, Grid, Segment, Message } from "semantic-ui-react";
import { ApiLoginUtils } from "../../lib/api/login";
import { isOk } from "../../../lib/utils";
import { ICredentials } from "../../../lib/types/api";
import { AsyncStoreState } from "../../redux/models/utils";
import { SignUpStage } from "./stages/SIgnUpStage";
import { ConfirmStage } from "./stages/ConfirmStage";
import { logger } from "../../lib/logger";
import { MutatorHelper } from "../../lib/types/utils";
import { LoginLevel } from "../../lib/types/login";

interface IProps {
    initSession: (force?: boolean) => Promise<void>;
    saveCredentials: MutatorHelper<Partial<ICredentials>>;
    level: LoginLevel;
    setLevel: (level: LoginLevel) => void;
}

interface IState {
    state: AsyncStoreState;
    error?: string;
    operationalTicket?: string;
}

export class LoginForm extends React.Component<IProps, IState> {
    public readonly state: IState = {
        state: AsyncStoreState.Unknown
    };

    private signUp = ({ username, password }: ICredentials) => {
        this.setState({ state: AsyncStoreState.Loading });

        return this.props
            .initSession()
            .then(() => ApiLoginUtils.signUp(username, password))
            .then(({ data: { operationalTicket } }) => {
                this.setState({ operationalTicket, state: AsyncStoreState.Success });
                this.props.setLevel(LoginLevel.Candidate);
                this.props.saveCredentials(x => {
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
                this.props.setLevel(LoginLevel.User);
            })
            .catch(e => this.setErrorState(e));
    };

    private setErrorState = (e: any) => {
        logger.error({ e });
        this.setState({ state: AsyncStoreState.Failed, error: String(e) });
    };

    private renderStage = (stage: LoginLevel) => {
        const { state } = this.state;
        const isLoading = state === AsyncStoreState.Loading;
        if (stage === LoginLevel.Anon) {
            return <SignUpStage loading={isLoading} signUp={this.signUp} />;
        }
        if (stage === LoginLevel.Candidate) {
            return <ConfirmStage loading={isLoading} confirmSignUp={this.confirmSignUp} />;
        }
        return null;
    };

    public render() {
        const { level } = this.props;
        const { error, state } = this.state;
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
                                {this.renderStage(level)}
                            </Segment.Group>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
        );
    }
}
