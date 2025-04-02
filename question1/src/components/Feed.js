// question1/src/components/Feed.js
import { useState, useEffect } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://20.244.56.144/evaluation-service/posts');
        const data = await res.json();
        // Sort by newest first (assuming posts have timestamp or ID-based order)
        const sortedPosts = data.posts.sort((a, b) => b.id - a.id);
        setPosts(sortedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    // Poll every 30 seconds for new posts
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="feed">
      <h2>Latest Posts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post">
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
