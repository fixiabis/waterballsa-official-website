import { Speaker } from "@/lib/speech/models/speech";
import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";

export function useSpeechSpeaker(): { isLoaded: boolean; speaker: Speaker | null } {
	const { isLoaded, user } = useUser();

	const speaker = useMemo<Speaker | null>(() => {
		if (!isLoaded || !user) {
			return null;
		}

		const discordAccount = user!.externalAccounts.find((account) => account.provider === "discord")!;

		return {
			username: discordAccount.username || "",
			email: discordAccount.emailAddress,
			discordId: discordAccount.providerUserId,
			imageUrl: discordAccount.imageUrl,
		};
	}, [isLoaded, user]);

	return { isLoaded, speaker };
}
