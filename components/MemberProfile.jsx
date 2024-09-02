import { getExistingUserByEmail } from "@/utils/dbutils";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { fetchOrGenerateCredits } from "@/utils/dbutils";

const MemberProfile = async () => {
	try {
		const user = await currentUser();

		if (!user) {
			// Handle the case where there is no current user
			return (
				<div className="px-4 flex items-center gap-2">
					<p>No user logged in</p>
				</div>
			);
		}

		const userEmail = user.emailAddresses[0]?.emailAddress;

		if (!userEmail) {
			// Handle the case where the user doesn't have an email address
			return (
				<div className="px-4 flex items-center gap-2">
					<UserButton />
					<p>No email address available</p>
				</div>
			);
		}

		const userDb = await getExistingUserByEmail(userEmail);

		if (userDb) {
			await fetchOrGenerateCredits(userDb.id);
		}

		return (
			<div className="px-4 flex items-center gap-2">
				<UserButton />
				<p>{userEmail}</p>
			</div>
		);
	} catch (error) {
		console.error("Error in MemberProfile:", error);
		// Handle the error gracefully
		return (
			<div className="px-4 flex items-center gap-2">
				<p>Error loading profile</p>
			</div>
		);
	}
};

export default MemberProfile;
