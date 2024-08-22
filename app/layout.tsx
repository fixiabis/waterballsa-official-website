"use client";

import { ApiGatewayProvider } from "@/components/api-gateway-context";
import { FakeSpeechApiGateway } from "@/lib/speech/api-gateways/fake-speech-api-gateway";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	// const speechApiGateway = new DefaultSpeechApiGateway(process.env.NEXT_PUBLIC_API_BASE_URL!);
	const speechApiGateway = new FakeSpeechApiGateway();

	return (
		<ApiGatewayProvider speechApiGateway={speechApiGateway}>
			<ClerkProvider afterSignOutUrl="/">
				<html lang="en">
					<body>{children}</body>
				</html>
			</ClerkProvider>
		</ApiGatewayProvider>
	);
}
