import * as React from "react";
import { Loader } from "semantic-ui-react";

interface IProps {
    children: React.ReactNode;
}

export function SuspenseWrapper(props: IProps) {
    return <React.Suspense fallback={<Loader active size="massive" />}>{props.children}</React.Suspense>;
}
