import * as React from "react";

interface IProps {
    children: React.ReactNode;
}

export function SuspenseWrapper(props: IProps) {
    return <React.Suspense fallback={<div>Loading... </div>}>{props.children}</React.Suspense>;
}
