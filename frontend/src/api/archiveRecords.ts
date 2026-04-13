export const getArchiveMeta = async () => {
  const res = await fetch("/api/archive-records/meta");
  return res.json();
};
