import * as React from 'react';
import ParameterWidget from './ParameterWidget'
import { Alert, Intent, InputGroup, ControlGroup, Text, Colors, Tab, Tabs } from '@blueprintjs/core';
import { Parameter, Client, WebSocketClientTransporter, GroupParameter, TabsWidget } from 'rabbitcontrol';
import { SSL_INFO_TEXT, SSL_INFO_TEXT_FIREFOX } from './Globals';
import { ParameterTabsGroupC } from './ParameterTabsGroup';

type Props = {
};

type State = {
    isConnected: boolean;
    error?: string;
    client?: Client;
    host: string;
    port: number;
    parameters: Parameter[];
    serverVersion: string;
    serverApplicationId: string;
    rootWithTabs: boolean;
};

export default class ConnectionDialog extends React.Component<Props, State> {
    
    private addTimer?: number;
    private removeTimer?: number;
    private myParameters: Parameter[] = [];

    private rootParam = new GroupParameter(0);
    

    constructor(props: Props) {
        super(props);

        this.state = {
            isConnected: false,
            host: 'localhost',
            port: 10000,
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
            rootWithTabs: true,
        };

        Client.VERBOSE = true;

        this.rootParam.label = "root";
        this.rootParam.widget = new TabsWidget();
    }

    componentDidMount = () => {
        
        /**
         * If a hash is provided, try to connect right away
         */
        if (location.hash !== '') {
            const [host, port] = location.hash.replace('#', '').split(':');
            const portAsInt = parseInt(port, 10);        

            console.log("autoconnect: " + host + ":" + portAsInt);
            this.doConnect(host, portAsInt);
        }
    }

    updateClient = () => {
        if (this.state.client) {
            this.state.client.update();
        }
    }

    createParameterWidget(parameter: Parameter)
    {
        return <ParameterWidget key={parameter.id}
                                parameter={parameter} 
                                onSubmitCb={this.updateClient}/>;
    }

    createWidgets(parameter: Parameter[])
    {
        return parameter.filter(param => this.state.rootWithTabs === false || !(param instanceof GroupParameter))
        .sort((a: Parameter, b: Parameter): number => 
        {
            return ((a.order || 0) - (b.order || 0));
        })
        .map((param) => 
        { 
            return this.createParameterWidget(param); 
        });
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



    render() 
    {
        const host = this.state.host;
        const port = this.state.port;

        return <section>

            <div className="rootgroup-wrapper">

                {/* {this.createWidgets(this.state.parameters)} */}

                {this.state.rootWithTabs === true ? 
                    <ParameterWidget 
                        key={this.rootParam.id}
                        parameter={this.rootParam} 
                        onSubmitCb={this.updateClient}                        
                    />
                
                : this.createWidgets(this.state.parameters) }
            
                
                {this.state.rootWithTabs === true ?
                    this.createWidgets(this.rootParam.children)
                : ""}
            </div>


            <div className="serverid" style={{
                color: Colors.GRAY1, 
            }}>
                {this.state.serverApplicationId !== "" ? `connected to: ${this.state.serverApplicationId} - ` : ""}{this.state.serverVersion !== "" ? `rcp: ${this.state.serverVersion}` : ""}
            </div>

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

        this.doConnect(this.state.host, this.state.port);
    }

    private resetUI()
    {
        console.log("reset UI");

        this.stopTimers();

        this.myParameters = [];
        this.rootParam.children = [];

        this.setState({
            isConnected: false, 
            client: undefined, 
            parameters: this.myParameters,
            serverVersion: "",
            serverApplicationId: "",
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

    private doConnect = (host: string, port: number) => {

        if (host !== undefined &&
            host !== "" &&
            !isNaN(port))
        {
            // disconnect first
            this.doDisconnect();

            // set info
            this.setState({
                host: host,
                port: port,
                error: undefined
            });

            const client = new Client(new WebSocketClientTransporter())
    
            const { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo } = this;
            Object.assign(client, { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo });
    
            try {
                client.connect(host, port);

                this.setState({
                    client: client
                });

            } catch (e) {
                console.log(e);
            }
        }
    }

    /**
     * client callbacks - socket
     */
    private connected = () => 
    {
        this.setState({
            isConnected: true,
        });

        console.log("ConnectionDialog connected!");
    }

    private disconnected = (event: CloseEvent) => 
    {
        console.log("ConnectionDialog disconneted: " + JSON.stringify(event));

        this.setState({
            error: `disconnected${event.reason ? ": " + JSON.stringify(event.reason) : ""}`
        });

        this.resetUI();
    }

    private onError = (error: any) => {

        if (error instanceof Error) {
            console.error(error.message);
        } else {
            this.setState({
                error: error.toString(),
            });
            this.resetUI();
        }

    }

    /**
     * client callbacks info
     */
    private onServerInfo = (version: string, applicationId: string) => 
    {
        this.setState({
            serverVersion: version,
            serverApplicationId: applicationId
        });
    }

    private parameterChangeListener = (parameter: Parameter) => 
    {
        if (!parameter.onlyValueChanged())
        {
            //force redraw
            this.forceUpdate();
        }
    }

    /**
     * client callbacks parameter
     */
    private parameterAdded = (parameter: Parameter) => 
    {
        if (!parameter.parent)
        {
            if (this.state.rootWithTabs === true)
            {
                this.rootParam.addChild(parameter);
                this.myParameters = this.rootParam.children;
            }
            else
            {
                const params = this.myParameters.slice();
                params.push(parameter);
                this.myParameters = params;
            }
        }

        parameter.addChangeListener(this.parameterChangeListener);

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

    private parameterRemoved = (parameter: Parameter) =>
    {
        if (this.state.rootWithTabs === true)
        {
            this.rootParam.removeChild(parameter);
            this.myParameters = this.rootParam.children;
        }
        else
        {
            const index = this.myParameters.indexOf(parameter, 0);
    
            if (index > -1) {
                this.myParameters.splice(index, 1);
            }
        }


        parameter.removeChangedListener(this.parameterChangeListener);
        
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

    /**
     * 
     */
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
