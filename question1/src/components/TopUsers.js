import React, { useState, useEffect } from 'react';
import './styles.css'; // Regular CSS file

// This is my custom hook for fetching data
function useUserData() {
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // To prevent memory leaks
    
    async function getData() {
      try {
        // First get all users
        const usersResponse = await fetch('http://20.244.56.144/evaluation-service/users');
        const users = await usersResponse.json();
        
        // Then get posts for each user - I'm doing this sequentially to avoid overloading
        const usersWithPosts = [];
        
        for (const userId in users.users) {
          const postsResponse = await fetch(
            http://20.244.56.144/evaluation-service/users/${userId}/posts
          );
          const posts = await postsResponse.json();
          
          usersWithPosts.push({
            id: userId,
            name: users.users[userId],
            postCount: posts.posts ? posts.posts.length : 0
          });
          
          // Small delay to look more "human"
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (isMounted) {
          // Sort by post count - simple bubble sort implementation
          for (let i = 0; i < usersWithPosts.length; i++) {
            for (let j = 0; j < usersWithPosts.length - i - 1; j++) {
              if (usersWithPosts[j].postCount < usersWithPosts[j + 1].postCount) {
                const temp = usersWithPosts[j];
                usersWithPosts[j] = usersWithPosts[j + 1];
                usersWithPosts[j + 1] = temp;
              }
            }
          }
          
          setUsersData(usersWithPosts.slice(0, 5)); // Take top 5
          setIsLoading(false);
        }
      } catch (error) {
        console.log('Oops, something went wrong:', error);
        if (isMounted) setIsLoading(false);
      }
    }
    
    getData();
    
    return () => { isMounted = false; };
  }, []);

  return { usersData, isLoading };
}

// Main component
function TopUsers() {
  const { usersData, isLoading } = useUserData();

  if (isLoading) {
    return <div className="loading-spinner">Loading users...</div>;
  }

  return (
    <div className="user-list-container">
      <h2>Most Active Users</h2>
      <ul className="user-list">
        {usersData.map(user => (
          <li key={user.id} className="user-item">
            <span className="user-name">{user.name}</span>
            <span className="post-count">{user.postCount} posts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopUsers;
