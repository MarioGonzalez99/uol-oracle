import Chat from "@/components/Chat";
import { getUserMessages } from "@/utils/dbutils";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const ChatPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['userMessages'],
    queryFn: getUserMessages,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Chat />
    </HydrationBoundary>
  );
}

export default ChatPage;
