import { SpeechApiGateway } from "@/lib/speech/api-gateways/speech-api-gateway";
import React from "react";

const ApiGatewayContext = React.createContext<SpeechApiGateway | null>(null);

export function ApiGatewayProvider(props: { children: React.ReactNode; speechApiGateway: SpeechApiGateway }) {
	return <ApiGatewayContext.Provider value={props.speechApiGateway}>{props.children}</ApiGatewayContext.Provider>;
}

export function useSpeechApiGateway() {
	const apiGateway = React.useContext(ApiGatewayContext);

	if (!apiGateway) {
		throw new Error("SpeechApiGateway not found");
	}

	return apiGateway;
}
