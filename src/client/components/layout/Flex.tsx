import * as React from "react";
import classnames from "classnames";

interface IProps extends React.HTMLProps<HTMLDivElement> {
    align?: "center";
    direction?: "column" | "row";
}

export function Flex(props: IProps) {
    const { align, direction, children, className, ...etc } = props;
    return (
        <div
            {...etc}
            className={classnames(
                className,
                "flex",
                direction === "column" && "flex-column-flow",
                align === "center" && "flex-align-center"
            )}
        >
            {props.children}
        </div>
    );
}
