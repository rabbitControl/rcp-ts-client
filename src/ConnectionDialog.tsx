import * as React from 'react';
import ParameterWidget from './ParameterWidget'
import { Alert, Intent, InputGroup, ControlGroup, Text } from '@blueprintjs/core';
import { Parameter, Client, WebSocketClientTransporter } from 'rabbitcontrol';
import { SSL_INFO_TEXT, SSL_INFO_TEXT_FIREFOX } from './Globals';

type Props = {
};

type State = {
    isConnected: boolean;
    error?: string;
    client?: Client;
    host: string;
    port: number;
    parameters: Parameter[];
};

export default class ConnectionDialog extends React.Component<Props, State> {
    
    private addTimer?: number;
    private removeTimer?: number;
    private myParameters: Parameter[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            isConnected: false,
            host: 'localhost',
            port: 10000,
            parameters: [],
        };
    }

    updateClient = () => {
        if (this.state.client) {
            this.state.client.update();
        }
    }

    createParameterWidget(parameter: Parameter) {
        return <ParameterWidget key={parameter.id}
                                parameter={parameter} 
                                onSubmitCb={this.updateClient}/>;
    }

    createWidgets(parameter: Parameter[]) {
        return parameter.map( (param) => { return this.createParameterWidget(param); });
    }

    setHost = (e: any) => {
        this.setState({
            host: e.currentTarget.value as string,
        });
    }

    setPort = (e: any) => {
        this.setState({
            port: parseInt(e.currentTarget.value, 10),
        });
    }

    render() {

        const host = this.state.host;
        const port = this.state.port;

        return <section>

            {this.createWidgets(this.state.parameters)}

            <Alert
                className={"bp3-dark"}
                confirmButtonText="Connect"
                icon="offline"
                intent={Intent.NONE}
                isOpen={this.state.isConnected !== true }
                onConfirm={this.handleAlertConfirm}
            >
                <Text><strong>Connect to a RabbitControl server</strong></Text>
                <br/>
                <br/>
                <ControlGroup style={{alignItems: "center"}}>
                    <Text>Host:&nbsp;</Text>
                    <InputGroup
                        value={host}
                        type="text"
                        onChange={this.setHost}
                    />
                </ControlGroup>
                <br/>
                <ControlGroup style={{alignItems: "center"}}>
                    <Text>Port:&nbsp;</Text>                    
                    <InputGroup
                        value={port.toFixed(0)}
                        min={1024}
                        max={65535}
                        type="number"
                        onChange={this.setPort}
                    />
                </ControlGroup>
                <br/>
                <div>
                    {this.state.error ? this.state.error : undefined}
                    {this.returnSSLInfo()}
                </div>

            </Alert>
        
        </section>;
    }

    private returnSSLInfo() {
        const isSSL = document.location ? document.location.toString().startsWith("https") : false;
        const isFirefox = navigator.userAgent.indexOf("Firefox") != -1;

        if (isSSL && isFirefox) {
            return (
                <div>
                    <br/>
                    {SSL_INFO_TEXT}
                    <br/><br/>
                    {SSL_INFO_TEXT_FIREFOX}
                </div>
            );
        } else if (isSSL) {
            return (
                <div>
                    <br/>
                    {SSL_INFO_TEXT}
                </div>
            );
        }
    }

    private handleAlertConfirm = () => {

        this.setState({
            error: undefined
        });

        if (this.state.host !== undefined && 
            this.state.host !== "" &&
            !isNaN(this.state.port))
        {
            this.doConnect();
        }
    }

    private resetUI() {

        this.stopTimers();

        this.myParameters = [];

        this.setState({
            isConnected: false, 
            client: undefined, 
            parameters: this.myParameters,
        });
    }

    private doDisconnect = () => {
        
        const client = this.state.client;

        if (client) {
            // clear callbacks
            // TODO: do this in client
            client.connected = undefined;
            client.disconnected = undefined;            
            client.onError = undefined;
            client.parameterAdded = undefined;
            client.parameterRemoved = undefined;

            // dispose client
            client.dispose();
        }

        this.resetUI();
    }

    private doConnect = () => {
        Client.VERBOSE = true
        const client = new Client(new WebSocketClientTransporter())

        const { connected, disconnected, parameterAdded, parameterRemoved, onError } = this;
        Object.assign(client, { connected, disconnected, parameterAdded, parameterRemoved, onError });

        const host = this.state.host;
        const port = this.state.port;

        this.setState({
            client, error: undefined
        });

        client.connect(host, port);
    }

    private connected = () => {
        this.setState({
            isConnected: true,
        })
        console.log("ConnectionDialog connected!");
    }

    private disconnected = (event: CloseEvent) => {
        console.log("ConnectionDialog disconneted: " + JSON.stringify(event));
        this.setState({
            error: `disconnected${event.reason ? ": " + JSON.stringify(event.reason) : ""}`
        });
        this.resetUI();
    }

    private onError = () => {
        console.log("error on socket!")
        this.setState({
            error: "error on socket!",
        });
        this.resetUI();
    }

    /**
     * 
     */
    private parameterAdded = (parameter: Parameter) => {

        if (!parameter.parent) {    
            const params = this.myParameters.slice();
            params.push(parameter);
            this.myParameters = params;
        }

        // deferer setstate
        if (this.addTimer !== undefined) {
            window.clearTimeout(this.addTimer);
            this.addTimer = undefined;
        }

        this.addTimer = window.setTimeout(() => {
            this.setState({
                parameters: this.myParameters,
            });
        }, 100);
    }

    private parameterRemoved = (parameter: Parameter) => {

        const index = this.myParameters.indexOf(parameter, 0);

        if (index > -1) {
            this.myParameters.splice(index, 1);
        }
        
        if (this.removeTimer!== undefined) {
            window.clearTimeout(this.removeTimer);
            this.removeTimer = undefined;
        }

        this.removeTimer = window.setTimeout(() => {
            this.setState({
                parameters: this.myParameters,
            });
        }, 100);
    }

    private stopTimers() {

        if (this.addTimer !== undefined) {
            window.clearTimeout(this.addTimer);
            this.addTimer = undefined;
        }

        if (this.removeTimer!== undefined) {
            window.clearTimeout(this.removeTimer);
            this.removeTimer = undefined;
        }

    }

} 
