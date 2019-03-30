import * as React from "react";
import "./layout.scss";

interface IProps extends React.HTMLProps<HTMLDivElement> {}

export function Page(props: IProps) {
    const { children, ...etc } = props;
    return (
        <div className="app-page" {...etc}>
            {props.children}
        </div>
    );
}
