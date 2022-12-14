import * as React from 'react';
import ParameterWidget from './ParameterWidget'
import { InputGroup, ControlGroup, Text, Colors, Checkbox, Button, Dialog, Classes } from '@blueprintjs/core';
import { Parameter, Client, WebSocketClientTransporter, GroupParameter, TabsWidget } from 'rabbitcontrol';
import { SSL_INFO_TEXT, SSL_INFO_TEXT_FIREFOX } from './Globals';
import App from './App';
import CreateBookmarkDialog from './CreateBookmarkDialog';
import { BookmarkProvider } from './BookmarkProvider';
import BookmarkList from './BookmarkList';

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
    showBookmarkDialog: boolean;
    connectionBookmarked: boolean;
};

export default class ConnectionDialog extends React.Component<Props, State> {
    
    private addTimer?: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            isConnected: false,
            host: 'localhost',
            port: 10000,
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
            rootWithTabs: false,
            showBookmarkDialog: false,
            connectionBookmarked: false,
        };
    }

    componentDidMount = () => {
        
        // paarse parameters
        if (window.location.search !== "") {
            const params = new URLSearchParams(window.location.search);

            // t: tabs in roots
            if (params.has("t")) {
                this.setState({rootWithTabs: (parseInt(params.get("t") || "0") || 0) > 0});
            }

            // d: debug
            if (params.has("d")) {
                Client.VERBOSE = (parseInt(params.get("d") || "0") || 0) > 0 || false;
                App.VERBOSE_LOG = Client.VERBOSE;
            }
        }

         // autoconnect
         if (window.location.hash !== '') {
            const [host, port] = window.location.hash.replace('#', '').split(':');
            const portAsInt = parseInt(port, 10);

            if (Client.VERBOSE) console.log("autoconnect: " + host + ":" + portAsInt);
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

    setTabsInRoot = (e: React.FormEvent<HTMLElement>) => {
        this.setState({
            rootWithTabs: (e.target as HTMLInputElement).checked,
        });
    }


    render() 
    {
        return <section>

            { this.state.isConnected ? 
                <div className="toolbar" >
                    <Button rightIcon='upload' 
                            text="Share" 
                            small={true} 
                            onClick={ () => { this.doDisconnect() } } />
                    <Button rightIcon="bookmark" 
                            text="Bookmark"
                            small={true} 
                            onClick={ () => { this.setState({ showBookmarkDialog: true }) } } 
                            disabled={ this.state.connectionBookmarked } />
                    <CreateBookmarkDialog show={ this.state.showBookmarkDialog } 
                                        onCancel={ () => { this.setState({ showBookmarkDialog: false }) } }
                                        onSuccess={ () => { this.setState({ showBookmarkDialog: false, connectionBookmarked: true }) } }
                                        host={ this.state.host }
                                        port={ this.state.port } 
                                        serverName={ this.state.serverApplicationId } />
                    <Button rightIcon='log-out' 
                            text="Disconnect" 
                            small={true} 
                            onClick={ () => { this.doDisconnect() } } />
                </div>
            : "" }

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

            <Dialog isOpen={this.state.isConnected !== true }
                    className={"bp3-dark"}
                    icon="offline">
                
                <section className={ Classes.DIALOG_BODY }>
                    
                    <h3>Connect to a RabbitControl server</h3>
                    
                    <ControlGroup style={{alignItems: "center"}}>
                        <Text>Host:&nbsp;</Text>
                        <InputGroup
                            value={this.state.host}
                            type="text"
                            onChange={this.setHost}
                        />
                    </ControlGroup>
                    <br/>
                    <ControlGroup style={{alignItems: "center"}}>
                        <Text>Port:&nbsp;</Text>                    
                        <InputGroup
                            value={this.state.port.toFixed(0)}
                            min={1024}
                            max={65535}
                            type="number"
                            onChange={this.setPort}
                        />
                    </ControlGroup>
                    <br/>

                    <Checkbox
                        checked={this.state.rootWithTabs}
                        onChange={this.setTabsInRoot}
                    >
                        Tabs in Root
                    </Checkbox>

                    <div>
                        {this.state.error ? this.state.error : undefined}
                        {this.returnSSLInfo()}
                    </div>

                    <section style={ { textAlign: 'right' }}>
                        <Button text="Connect" onClick={ this.handleAlertConfirm } />
                    </section>

                    <BookmarkList onConnectFromBookmark={ this.connectFromBookmark } />
                </section>
            </Dialog>
        
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

    private handleAlertConfirm = () => {
        this.setState({
            error: undefined
        });

        this.doConnect(this.state.host, this.state.port);
    }

    private connectFromBookmark = (bookmark: BookmarkProvider.Bookmark): void => {
        this.setState({
            error: undefined
        });

        this.doConnect(bookmark.address, bookmark.port);
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
            connectionBookmarked: false,
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

            // NOTE: needed??
            client.setRootWidget(new TabsWidget());
    
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

        if (Client.VERBOSE) console.log("ConnectionDialog connected!");
    }

    private disconnected = (event: CloseEvent) => 
    {
        if (Client.VERBOSE) console.log("ConnectionDialog disconneted: " + JSON.stringify(event));

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
