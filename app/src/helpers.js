
const getValidPosts = (posts) => {
  const valids = [];
  for (const post of posts) {
    const { success, value } = getYoutubeId(post.url);

    if (!success) continue;

    valids.push({
      ...post,
      videoId: value,
    });
  }
  return valids;
};

const getYoutubeId = (url) => {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[^&\s\?]+(?!\S))\/)|(?:\S*v=|v\/)))([^&\s\?]+)/;
  const matches = youtubeRegex.exec(url);

  if (matches) {
    return { success: true, value: matches[1] };
  }
  return { success: false, value: undefined };
};

const getRedditNewest = (subName) => {
  const api = `https://www.reddit.com/r/${subName ? subName : 'musicanova'}.json`;

  // @ts-ignore
  return fetch(`${api}`)
    .then((res) => res.json())
    .then((res) => {
      const {
        data: { children },
      } = res;
      return children;
    });
};

const getRedditRandom = (subName) => {
  const api = `https://www.reddit.com/r/${subName ? subName : 'musicanova'}/random.json`;

  return fetch(`${api}`)
    .then((res) => res.json())
    .then((res) => {
      const {
        data: { children },
      } = res[0];
      return children;
    });
};

export {
  getValidPosts,
  getRedditRandom,
  getRedditNewest

}