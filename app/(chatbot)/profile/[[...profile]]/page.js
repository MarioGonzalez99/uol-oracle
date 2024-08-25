import { fetchCreditsByUserId, getExistingUserByEmail } from "@/utils/dbutils";
import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const ProfilePage = async () => {
  const user = await currentUser();
  const email = user.emailAddresses[0].emailAddress;
  const userDb = await getExistingUserByEmail(email);
  const credits = await fetchCreditsByUserId(userDb.id) > 0 ? await fetchCreditsByUserId(userDb.id) : 0;

  return (
    <div>
      <h2 className="mb-8 ml-8 text-xl font-extrabold">Credit Amount: {credits}</h2>
      <UserProfile path="/profile" />
    </div>
  );
}

export default ProfilePage;
