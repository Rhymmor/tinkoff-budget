import * as React from "react";
import { Page } from "../components/layout";
import { LoginForm } from "../components/login/LoginForm";
import { Grid } from "semantic-ui-react";
import "./login.scss";
import { MutatorHelper } from "../lib/types/utils";
import { ICredentials } from "../../lib/types/api";
import { IStore } from "../redux/store";
import { connect } from "react-redux";
import { LoginLevel } from "../lib/types/login";

interface IStateToProps {
    level: LoginLevel;
}

interface IDispatchProps {
    modifyCredentials: MutatorHelper<Partial<ICredentials>>;
    initSession: (force?: boolean) => Promise<any>;
    setLevel: (level: LoginLevel) => void;
}

interface IOwnProps {}

interface IProps extends IDispatchProps, IOwnProps, IStateToProps {}

interface IState {}

function mapStateToProps(store: IStore, _ownProps: IOwnProps): IStateToProps {
    return {
        level: store.session.session.level
    };
}

function mapDispatch(store: IStore, _ownProps: IOwnProps): IDispatchProps {
    const {
        session: { modifyCredentials, initSession, modifySession }
    } = store;
    return {
        modifyCredentials,
        initSession: (force = false) => initSession(force),
        setLevel: (level: LoginLevel) => modifySession(session => (session.level = level))
    };
}

class LoginPageImpl extends React.Component<IProps, IState> {
    public render() {
        const { initSession, modifyCredentials, setLevel, level } = this.props;
        return (
            <Page>
                <Grid verticalAlign="middle" centered className="full-height">
                    <Grid.Row centered>
                        <Grid.Column width={6}>
                            <LoginForm
                                initSession={initSession}
                                saveCredentials={modifyCredentials}
                                level={level}
                                setLevel={setLevel}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Page>
        );
    }
}

export const LoginPage = connect<IStateToProps, IDispatchProps, IOwnProps, IStore>(
    mapStateToProps,
    mapDispatch as any
)(LoginPageImpl);
