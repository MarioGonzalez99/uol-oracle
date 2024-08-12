import { UserProfile } from "@clerk/nextjs";

const ProfilePage = () => {
  return (
    <UserProfile path="/profile" />
  );
}

export default ProfilePage;
