const API_URL = process.env.NEXT_PUBLIC_API_URL;

  export const fetchPosts = async () => {
    const response = await fetch(`${API_URL}/posts`);
    
    if (!response.ok) {
      return null;
    }
    return response.json();
  };

  export const fetchPostById = async (id: number) => {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  };

  export const fetchPostBySlug = async (slug: string) => {
    
    const res = await fetch(`${API_URL}/posts/bySlug/${slug}`);
    const data = await res.json();
    return data.length > 0 ? data[0] : null;
  };

export const fetchCommentsByPostId = async (postId: number) => {
  const response = await fetch(`${API_URL}/comments/${postId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

export const createComment = async (postId: number, content: string, email: string) => {
  const response = await fetch(`${API_URL}/comments/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, email }),
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  return response.json();
};


export const fetchLabels = async () => {
  const response = await fetch(`${API_URL}/labels/`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch labels');
  }

  return response.json();
};

export async function fetchTech() {
  const NOT_API_URL = process.env.NEXT_PUBLIC_NOT_API_URL;
  
  try {
    const response = await fetch(`${NOT_API_URL}/tech`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error('Failed to fetch tech data');
    }
  const data = await response.json();

    // ! me sigue devolviendo una promesa :( 
    console.log(data);
    return data;
  } catch (error) {
    throw new Error('Failed to fetch tech data');
  }
}