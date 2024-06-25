import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Typography } from "@mui/material";
import Center from "components/Center";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const [usersMap, setUsersMap] = useState({});

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user posts");
      }
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  // Fetch user details for each post
  const fetchUserDetails = async () => {
    const uniqueUserIds = new Set(posts.map((post) => post.userId));
    const userDetailPromises = Array.from(uniqueUserIds).map(async (userId) => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch user details for userId: ${userId}`);
        }
        const userData = await response.json();
        return { [userId]: userData };
      } catch (error) {
        console.error(error.message);
        return {};
      }
    });
    const userDetails = await Promise.all(userDetailPromises);
    const usersMap = Object.assign({}, ...userDetails);
    setUsersMap(usersMap);
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [userId, token, isProfile]);
  
  useEffect(() => {
    fetchUserDetails();
  }, [posts, token]);
  

  // Reverse the order of posts array
  const reversedPosts = posts.slice().reverse();

  return (
    <>
      {reversedPosts.length === 0 ? (
        <Center>
          <Typography variant="h3" color="textSecondary" mt={"2rem"}>
            No Posts Yet!
          </Typography>
        </Center>
      ) : (
        reversedPosts.map((post) => (
          <PostWidget
            key={post._id}
            postId={post._id}
            postUserId={post.userId}
            title={post.title}
            description={post.description}
            location={usersMap[post.userId]?.location}
            picturePath={post.picturePath}
            likes={post.likes} // Pass likes directly
            comments={post.comments} // Pass comments directly
            createdAt={post.createdAt} // Pass createdAt
            firstName={usersMap[post.userId]?.firstName} // Pass firstName from usersMap
            lastName={usersMap[post.userId]?.lastName} // Pass lastName from usersMap
            userPicturePath={usersMap[post.userId]?.picturePath} // Pass picturePath from usersMap
          />
        ))
      )}
    </>
  );
};

export default PostsWidget;
