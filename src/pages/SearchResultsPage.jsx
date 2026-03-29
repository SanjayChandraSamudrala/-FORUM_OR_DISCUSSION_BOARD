import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Header from "../components/Header";
import { toast } from "@/components/ui/use-toast";
import { search as searchApi } from "../services/api";

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setLoading(false);
        setSearchResults({ posts: [], users: [], communities: [] });
        return;
      }

      setLoading(true);
      try {
        const response = await searchApi(searchQuery);
        setSearchResults(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to fetch search results.",
          variant: "destructive",
        });
        setSearchResults({ posts: [], users: [], communities: [] }); // Clear results on error
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <MainLayout>
      <Header title={`Search Results for "${searchQuery || ''}"`}>
        <p>Explore content, users, and communities across the forum.</p>
      </Header>

      <div className="container mx-auto p-4">
        {loading ? (
          <div className="text-center py-8">Loading search results...</div>
        ) : searchResults && (searchResults.posts.length > 0 || searchResults.users.length > 0 || searchResults.communities.length > 0) ? (
          <div className="space-y-8">
            {searchResults.posts.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Posts ({searchResults.posts.length})</h2>
                <div className="grid gap-4">
                  {searchResults.posts.map((post) => (
                    <Link to={`/posts/${post._id}`} key={post._id} className="block p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200">
                      <h3 className="text-xl font-medium text-white mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">by {post.author?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{post.content}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {searchResults.users.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Users ({searchResults.users.length})</h2>
                <div className="grid gap-4">
                  {searchResults.users.map((user) => (
                    <div key={user._id} className="p-4 bg-gray-800 rounded-lg shadow-md flex items-center space-x-4">
                      <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="text-lg font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {searchResults.communities.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Communities ({searchResults.communities.length})</h2>
                <div className="grid gap-4">
                  {searchResults.communities.map((community) => (
                    <Link to={`/community/${community._id}`} key={community._id} className="block p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200">
                      <h3 className="text-xl font-medium text-white mb-1">{community.name}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2">{community.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No results found for "{searchQuery}".
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchResultsPage; 