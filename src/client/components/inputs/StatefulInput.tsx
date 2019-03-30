import { safeGet, isOk } from "../../../lib/utils";
import * as React from "react";
import { Input } from "semantic-ui-react";

type ReactEvent = React.FormEvent;

export interface IStatefulInputProps<T> {
    className?: string;
    type?: "text" | "number";
    value: T; // type/number
    title?: string;
    placeholder?: string; // showed instead of ''
    controlId?: string; // required for validator
    onChange?: (e: React.FormEvent) => void;
    onSubmit(value: T): boolean | void; // type/number
    onClick?(e: ReactEvent): void;
    formatter?(value: T): string;
    parser?(text: string): T;
    validator?(text: string): boolean;
    autoFocus?: boolean;
    tabIndex?: number;
    fluid?: boolean;
}

interface IState {
    text: string;
}

function toText<T>(props: IStatefulInputProps<T>): string {
    const formatter = props.formatter || (x => String(x));
    return safeGet(props, x => formatter(x.value), "") || "";
}

export class StatefulInput<T> extends React.Component<IStatefulInputProps<T>, IState> {
    constructor(props: IStatefulInputProps<T>) {
        super(props);
        this.state = {
            text: toText(props)
        };
    }

    public componentWillReceiveProps(nextProps: IStatefulInputProps<T>) {
        if (nextProps.value !== this.props.value) {
            this.setState({ text: toText(nextProps) });
        }
    }

    private onChange = (e: React.ChangeEvent<any>) => {
        if (this.props.onChange) {
            this.props.onChange(e);
        }

        this.setState({ text: e.currentTarget.value });
    };

    private onSubmit = () => {
        const parser = this.props.parser || (x => (x as any) as T);
        const formatter = this.props.formatter || (x => String(x));
        try {
            const pval = parser(this.state.text);
            if (this.props.onSubmit(pval)) {
                this.setState({ text: formatter(pval) });
            } else {
                this.setState({ text: formatter(this.props.value) });
            }
        } catch (e) {
            this.setState({ text: toText(this.props) });
        }
    };

    private handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            this.onSubmit();
        }
    };

    public render() {
        const { type, className, validator, placeholder, onClick, title, autoFocus, tabIndex, fluid } = this.props;
        const { text } = this.state;

        let error = false;
        if (validator) {
            try {
                error = validator(text);
            } catch (e) {
                console.error(e);
            }
        }

        return (
            <Input
                error={error}
                autoFocus={autoFocus}
                type={type}
                className={className || ""}
                value={isOk(text) ? text : ""}
                placeholder={placeholder}
                onChange={this.onChange}
                onKeyPress={this.handleKeyPress}
                onBlur={this.onSubmit}
                title={title || ""}
                onClick={onClick}
                tabIndex={tabIndex}
                fluid={fluid}
            />
        );
    }
}
