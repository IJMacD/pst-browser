import React from "react";
import { Component } from "react";

export class ErrorBoundary extends Component {
    constructor (props) {
        super(props);

        this.state = {
            /** @type {Error?} */
            error: null,
            /** @type {import("react").ErrorInfo?} */
            errorInfo: null,
            showDebug: false,
        };
    }

    /**
     * @param {Error} error
     * @param {import("react").ErrorInfo} errorInfo
     */
    componentDidCatch (error, errorInfo) {
        this.setState({ error, errorInfo });
    }

    render () {
        if (this.state.error) {
            return (
                <div style={{padding:"2em"}}>
                    <h2>Error</h2>
                    <p>There was an error viewing the PST file. There may be more details below.</p>
                    <p style={{fontFamily:"monospace",marginBottom:0}}>{this.state.error.message}</p>
                    {
                        this.state.showDebug ?
                        <div>
                            <pre style={{margin:0}}>{this.state.errorInfo?.componentStack.replace(/\([^)]*\)/g, "")}</pre>
                        </div> :
                        <button style={{marginTop: "1em"}} onClick={() => this.setState({ showDebug: true })}>More Details</button>
                    }
                </div>
            )
        }

        return this.props.children;
    }
}