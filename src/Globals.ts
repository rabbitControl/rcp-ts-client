import { Colors } from "@blueprintjs/core";

export const parameterLabelStyle:React.CSSProperties = {
    whiteSpace: "nowrap", 
    color: Colors.GRAY1,
    fontSize: 16,
};

export const SSL_INFO_TEXT = "Connecting to unsecure websocket from secure context. You may need to adjust your browser settings.";
export const SSL_INFO_TEXT_FIREFOX = "To allow this please set: 'network.websocket.allowInsecureFromHTTPS' in 'about:config' to 'true'.";