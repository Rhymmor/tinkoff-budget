import * as React from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import { SuspenseWrapper } from "./components/layout/SuspenseWrapper";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const LazyLogin = React.lazy(() => import("./pages/login").then(x => ({ default: x.LoginPage })));

export function AppRouter() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Route
                    exact
                    path="/login"
                    render={() => (
                        <SuspenseWrapper>
                            <LazyLogin />
                        </SuspenseWrapper>
                    )}
                />
                <Route exact path="/" render={() => <Redirect to="/login" />} />
            </BrowserRouter>
        </Provider>
    );
}
