import * as React from 'react';
import ParameterWidget from './ParameterWidget'
import { Alert, Intent, InputGroup, ControlGroup, Text, Colors, Checkbox, Label } from '@blueprintjs/core';
import { Parameter, Client, WebSocketClientTransporter, GroupParameter, TabsWidget, StringParameter } from 'rabbitcontrol';
import { SSL_INFO_TEXT, SSL_INFO_TEXT_FIREFOX } from './Globals';
import { Classes } from '@blueprintjs/core';
import App from './App';


type Props = {
    public?: boolean;
    rcpkey?: string;
    embedded?: boolean;
    onDisconnect?: () => void;
};

type State = {
    isConnected: boolean;
    error?: string;
    client?: Client;
    protocol?: string[];
    parameters: Parameter[];
    serverVersion: string;
    serverApplicationId: string;
    rootWithTabs: boolean;
    public: boolean;
    connecting: boolean;
};

export default class ConnectionDialog extends React.Component<Props, State> {
    
    private addTimer?: number;

    private rcpKey = "";

    private readonly clientEnd = "/rcpclient/connect";
    private readonly publicClientEnd = "/public/rcpclient/connect";

    private host = "";

    constructor(props: Props) {
        super(props);

        this.state = {
            isConnected: true,                     
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
            rootWithTabs: false,   
            public: props.public !== undefined ? props.public : true,
            connecting: false
        };

        this.rcpKey = props.rcpkey !== undefined ? props.rcpkey : "";

        Client.VERBOSE = true;
    }

    componentDidMount = () =>
    {
        if (this.rcpKey !== undefined && this.rcpKey !== "")
        {
            console.log("direct autoconnect - public: " + (this.props.public === true));

            // set host
            if (this.props.public === true)
            {
                this.host = window.location.hostname + (window.location.port !== "" ? (":" + window.location.port) : "") + this.publicClientEnd;
            }
            else
            {
                this.host = window.location.hostname + (window.location.port !== "" ? (":" + window.location.port) : "") + this.clientEnd;
            }

            this.host += `?key=${this.rcpKey}`;

            this.doConnect();
            return;
        }

        let url = new URL(location.href);
        let mode = url.searchParams.get("mode");
        if (mode === "private")
        {
            console.log("switching to private");
            
            this.host = window.location.hostname + (window.location.port !== "" ? (":" + window.location.port) : "") + this.clientEnd;
                
            this.setState({
                public: false
            });

            console.log("switching to private: " + this.host);
        }
        else
        {
            this.host = window.location.hostname + (window.location.port !== "" ? (":" + window.location.port) : "") + this.publicClientEnd;
            console.log("public!");
        }

        /**
         * If a hash is provided, try to connect right away
         */
        if (location.hash !== '')
        {
            this.rcpKey = location.hash.replace('#', '');
            if (this.rcpKey != "")
            {
                this.host += `?key=${this.rcpKey}`;
                
                console.log("autoconnect");
                this.doConnect();
            }
        }
        else
        {
            // no hash - show dialog
            this.setState({
                isConnected: false
            });
        }
    }

    componentWillUnmount = () =>
    {
        console.log("will unmount!");
        this.disposeClient();
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
        return parameter
        .filter(param => this.state.rootWithTabs === false || !(param instanceof GroupParameter))
        .sort((a: Parameter, b: Parameter): number => 
        {
            return ((a.order || 0) - (b.order || 0));
        })
        .map((param) => 
        { 
            return this.createParameterWidget(param); 
        });
    }

    setRcpKey = (e: any) => {
        this.rcpKey = e.currentTarget.value as string;        
    }

    setTabsInRoot = (e: React.FormEvent<HTMLElement>) => {
        this.setState({
            rootWithTabs: (e.target as HTMLInputElement).checked,
        });
    }


    render() 
    {
        return <section>

            <div style={{
                display: this.state.connecting ? "block" : "none",
                position: "fixed",
                zIndex: 100,
                width: "100%",
                textAlign: "center",
                minHeight: "50px"
            }}>
                <br></br><br></br>
                waiting for rcp-server to connect...<br></br>
                 {/* <img src="/hole.png" width="200" height="200"></img> */}
            </div>

            <div className="rootgroup-wrapper">
                {
                    this.state.client ?

                        this.state.rootWithTabs === true ?

                            <ParameterWidget
                                key={0}
                                parameter={this.state.client.getRootGroup()}
                                onSubmitCb={this.updateClient}
                            />
                        :
                            this.createWidgets(this.state.parameters)

                    :
                        ""
                }
            </div>


            <div className="serverid" style={{
                color: Colors.GRAY1, 
            }}>
                {this.state.serverApplicationId !== "" ? `connected to: ${this.state.serverApplicationId} - ` : ""}{this.state.serverVersion !== "" ? `rcp: ${this.state.serverVersion}` : ""}
            </div>

            <Alert
                style={{
                    maxWidth: '800px',
                    width: '100%'
                }}
                className={"bp3-dark"}
                confirmButtonText="Connect"
                icon="offline"
                intent={Intent.NONE}
                isOpen={this.state.isConnected !== true && this.state.connecting !== true && this.props.embedded !== true}
                onConfirm={this.handleAlertConfirm}
            >
                <Text><strong>Connect to a RCP Tunnel</strong></Text>
                <br/>
                <br/>
                <ControlGroup style={{alignItems: "center"}} fill={true}>
                    <Text className={Classes.FIXED}>Tunnel Name:&nbsp;</Text>
                    <InputGroup
                        type="text"
                        fill={true}
                        onChange={this.setRcpKey}
                    />
                </ControlGroup>
                <br />

                <div>
                    <Label style={{color: Colors.GRAY2}}>
                    { this.state.public ? "Using public tunnels may cause mixups. Use unique tunnel with at least 4 characters" : "" }
                    </Label>
                </div>

                <br></br>
                <Checkbox
                    checked={this.state.rootWithTabs}
                    onChange={this.setTabsInRoot}
                >
                    Tabs in Root
                </Checkbox>


            </Alert>
        
        </section>;
    }

    private returnSSLInfo() {
        const isSSL = window.location ? window.location.toString().startsWith("https") : false;
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

    private handleAlertConfirm = () =>
    {
        if (this.rcpKey !== "")
        {
            this.doConnect();
        }
        else
        {
            console.error("no rcp-key");
        }
    }

    private resetUI()
    {
        if (Client.VERBOSE) console.log("reset UI");

        this.stopTimers();

        this.setState({
            isConnected: false, 
            client: undefined, 
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
            connecting: false
        });
    }

    private disposeClient = () => {
        
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
    }

    private doConnect = () =>
    {
        if (this.host !== undefined &&
            this.host !== "")
        {
            this.disposeClient();

            // set info
            this.setState({
                error: undefined                
            });

            console.log("using rcp-key/tunnel-name: " + this.rcpKey);

            const transporter = new WebSocketClientTransporter();
            transporter.doSSL = document.location ? document.location.protocol.startsWith("https") : false;
            const client = new Client(transporter);

            // NOTE: needed??
            client.setRootWidget(new TabsWidget());
    
            const { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo } = this;
            Object.assign(client, { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo });
    
            try {
                client.connect(this.host);

                this.setState({
                    client: client,                
                    connecting: true
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
            isConnected: true
        });

        if (Client.VERBOSE) console.log("ConnectionDialog connected!");
    }

    private disconnected = (event: CloseEvent) => 
    {
        if (Client.VERBOSE) console.log("ConnectionDialog disconneted: " + JSON.stringify(event));

        this.setState({
            error: `disconnected${event.reason ? ": " + JSON.stringify(event.reason) : ""}`
        });

        if (this.props.onDisconnect)
        {
            this.props.onDisconnect();
        }

        this.resetUI();
    }

    private onError = (error: any) =>
    {
        if (this.props.onDisconnect)
        {
            this.props.onDisconnect();
        }
        
        if (error instanceof Error)
        {
            console.error(error.message);
        }
        else
        {
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
            if (parameter.parent !== undefined)
            {
                if (Client.VERBOSE) console.log("parameter changed: " +  parameter.parent.label);
            }
            else if (parameter.parentChanged())
            {
                if (this.state.client)
                {
                    this.setState({
                        parameters: this.state.client.getRootGroup().children,
                    });
                }
            }
            else
            {
                if (Client.VERBOSE) console.log("paraemter changed: no parent");                
            }
            
            //force redraw
            this.forceUpdate();
        }
    }

    /**
     * client callbacks parameter
     */
    private parameterAdded = (parameter: Parameter) => 
    {
        parameter.addChangeListener(this.parameterChangeListener);

        // delay setting parameter
        // more paramater might arrive in quick succession
        if (this.addTimer !== undefined) {
            window.clearTimeout(this.addTimer);
            this.addTimer = undefined;
        }

        this.addTimer = window.setTimeout(() => {
            if (this.state.client)
            {
                this.setState({
                    parameters: this.state.client.getRootGroup().children,
                });
            }
        }, 100);

        this.setState({
            connecting: false
        });
    }

    private parameterRemoved = (parameter: Parameter) =>
    {
        // this.rootParam.removeChild(parameter);
        parameter.removeFromParent();

        parameter.removeChangedListener(this.parameterChangeListener);
        
        if (this.state.client)
        {
            this.setState({
                parameters: this.state.client.getRootGroup().children,
            });
        }
    }

    /**
     * 
     */
    private stopTimers() {

        if (this.addTimer !== undefined) {
            window.clearTimeout(this.addTimer);
            this.addTimer = undefined;
        }

    }

} 
