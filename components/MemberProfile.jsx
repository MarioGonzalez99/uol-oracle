import { fetchOrGenerateCredits, getExistingUserByEmail } from "@/utils/dbutils";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const MemberProfile = async () => {
	const user = await currentUser();
	const userDb = await getExistingUserByEmail(user.emailAddresses[0].emailAddress);
	if (userDb) {
		await fetchOrGenerateCredits(userDb.id);
	}

	return (
		<div className="px-4 flex items-center gap-2">
			<UserButton />
			<p>{user.emailAddresses[0].emailAddress}</p>
		</div>
	);
};

export default MemberProfile;
