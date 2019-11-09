import "regenerator-runtime/runtime";

import * as React from "react";
import { render } from "react-dom";
import { AppRouter } from "./app-router";

import "semantic-ui-css/semantic.min.css";
import "./index.scss";

render(<AppRouter />, document.getElementById("root"));
