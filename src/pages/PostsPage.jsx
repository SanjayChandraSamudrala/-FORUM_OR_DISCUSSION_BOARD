import MainLayout from "../components/MainLayout";
import ThreadCard from "../components/ThreadCard";
import { MOCK_THREADS } from "../data/mockData";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";

const PostsPage = () => {
  return (
    <MainLayout initialIsLoggedIn={true}>
      <div>
        <Header title="Posts">
          <p>Browse all posts from the community</p>
        </Header>
        
        {/* Filter buttons */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <Button variant="outline" className="rounded-full px-4 py-1 text-sm">
            All
          </Button>
          <Button variant="outline" className="rounded-full px-4 py-1 text-sm">
            Popular
          </Button>
          <Button variant="outline" className="rounded-full px-4 py-1 text-sm">
            Latest
          </Button>
          <Button variant="outline" className="rounded-full px-4 py-1 text-sm">
            Trending
          </Button>
        </div>
        
        {/* Posts */}
        <div>
          {MOCK_THREADS.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default PostsPage; 