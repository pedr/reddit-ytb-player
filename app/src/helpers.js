
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
  if (!subName) {
    return []
  }
  const api = `https://www.reddit.com/r/${subName}.json`;

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
  if (!subName) {
    return []
  }
  const api = `https://www.reddit.com/r/${subName}/random.json`;

  return fetch(`${api}`)
    .then((res) => res.json())
    .then((res) => {
      const {
        data: { children },
      } = res[0];
      return children;
    });
};

const getRedditTopOfTheWeek = (subName) => {
  if (!subName) {
    return []
  }
  const api = `https://www.reddit.com/r/${subName}/top.json?t=week`;

  return fetch(`${api}`)
    .then((res) => res.json())
    .then((res) => {
      const {
        data: { children },
      } = res;
      return children;
    });
};

const getRedditTopOfTheMonth = (subName) => {
  if (!subName) {
    return []
  }
  const api = `https://www.reddit.com/r/${subName}/top.json?t=month`;

  return fetch(`${api}`)
    .then((res) => res.json())
    .then((res) => {
      const {
        data: { children },
      } = res;
      return children;
    });
};


export {
  getValidPosts,
  getRedditRandom,
  getRedditNewest,
  getRedditTopOfTheWeek,
  getRedditTopOfTheMonth,
}