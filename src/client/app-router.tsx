import * as React from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import { SuspenseWrapper } from "./components/layout/SuspenseWrapper";

const LazyLogin = React.lazy(() => import("./pages/login").then(x => ({ default: x.LoginPage })));

export function AppRouter() {
    return (
        <BrowserRouter>
            <div>
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
            </div>
        </BrowserRouter>
    );
}
