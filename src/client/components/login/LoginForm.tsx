import * as React from "react";
import { Card, Grid, Segment, Message } from "semantic-ui-react";
import { ApiLoginUtils } from "../../lib/api/login";
import { isOk } from "../../../lib/utils";
import { ICredentials } from "../../../lib/types/api";
import { AsyncStoreState } from "../../store/utils";
import { SignUpStage } from "./stages/SIgnUpStage";
import { ConfirmStage } from "./stages/ConfirmStage";
import { logger } from "../../lib/logger";
import { LoginLevel } from "../../lib/types/login";
import { StoreTypes, IStore } from "../../store/types";
import { lazyInject } from "../../store/inject";
import { observer } from "mobx-react";

interface IProps {}

interface IState {}

@observer
export class LoginForm extends React.Component<IProps, IState> {
    @lazyInject(StoreTypes.Session)
    private readonly session!: IStore[StoreTypes.Session];

    private signUp = async ({ username, password }: ICredentials) => {
        this.setState({ state: AsyncStoreState.Loading });

        // this.session.session.level = LoginLevel.Candidate;

        await this.session.init();
        this.session.credentials = { username, password };
        await this.session.signUp();
    };

    private confirmSignUp = (smsPin: string) => {
        const { operationalTicket } = this.session.ticket;
        if (!operationalTicket) {
            return this.setErrorState("No operational ticket. Try sign up again");
        }
        return ApiLoginUtils.confirm(smsPin, operationalTicket)
            .then(() => {
                this.setState({ state: AsyncStoreState.Success });
                this.session.session.level = LoginLevel.User;
            })
            .catch(e => this.setErrorState(e));
    };

    private setErrorState = (e: any) => {
        logger.error({ e });
        this.setState({ state: AsyncStoreState.Failed, error: String(e) });
    };

    private renderStage = (stage: LoginLevel) => {
        const { state } = this.session.ticket;
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
        const { level } = this.session.session;
        const { error, state } = this.session.ticket;
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
