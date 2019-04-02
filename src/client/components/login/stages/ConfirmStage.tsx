import * as React from "react";
import { Segment, Button } from "semantic-ui-react";
import { StatefulInput } from "../../inputs/StatefulInput";
import { Flex } from "../../layout/Flex";

interface IProps {
    confirmSignUp: (smsPin: string) => Promise<void> | void;
    loading: boolean;
}

interface IState {
    smsPin: string;
}

export class ConfirmStage extends React.Component<IProps, IState> {
    public readonly state: IState = {
        smsPin: ""
    };

    private setPin = (smsPin: string) => this.setState({ smsPin });
    private isPinValid = (smsPin: string) => !!smsPin && smsPin.length === 4;

    private clickConfirm = () => {
        this.props.confirmSignUp(this.state.smsPin);
    };

    public render() {
        const { loading } = this.props;
        const { smsPin } = this.state;
        const isConfirmDisabled = loading || this.isPinValid(smsPin);
        return (
            <>
                <Segment>
                    <Flex align="center" direction="column" className="login-form__inputs">
                        <StatefulInput
                            fluid
                            className="dark"
                            placeholder="4-digit PIN"
                            validator={this.isPinValid}
                            value={smsPin}
                            onSubmit={this.setPin}
                            size="huge"
                        />
                    </Flex>
                </Segment>
                <Segment>
                    <Button
                        loading={loading}
                        onClick={this.clickConfirm}
                        disabled={isConfirmDisabled}
                        color="yellow"
                        floated="right"
                    >
                        Confirm
                    </Button>
                </Segment>
            </>
        );
    }
}
