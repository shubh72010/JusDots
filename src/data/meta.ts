export const stars: Record<string, number> = {
  jusplayer: 18,
  jusnotes: 11,
  jusbrowse: 5,
  juscalc: 4,
};

export const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);
