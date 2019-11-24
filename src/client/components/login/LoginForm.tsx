import * as React from "react";
import { Card, Grid, Segment, Message } from "semantic-ui-react";
import { ICredentials } from "../../../lib/types/api";
import { AsyncStoreState } from "../../store/utils";
import { SignUpStage } from "./stages/SIgnUpStage";
import { ConfirmStage } from "./stages/ConfirmStage";
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
        await this.session.init();
        this.session.credentials = { username, password };
        await this.session.signUp();
    };

    private renderStage = (stage: LoginLevel) => {
        if (stage === LoginLevel.Anon) {
            return <SignUpStage signUp={this.signUp} />;
        }
        if (stage === LoginLevel.Candidate) {
            return <ConfirmStage confirmSignUp={this.session.confirmSignUp} />;
        }
        return null;
    };

    public render() {
        const { level, asyncStore } = this.session;
        return (
            <Card centered fluid className="login-form">
                <Card.Content>
                    <Grid>
                        <Grid.Row centered>
                            <Segment.Group compact className="full-width">
                                {asyncStore.hasError && (
                                    <Segment>
                                        <Message error>
                                            <Message.Header>Signing up failed</Message.Header>
                                            <p>{asyncStore.error}</p>
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
