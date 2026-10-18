export const getPublicNews = async () => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
    method: "GET",
  });

  const result = await res.json();

  return result;
};
