async function test() {
  const keyword = "Varanasi";
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${keyword}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&format=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    for (const pageId in pages) {
       const url = pages[pageId].imageinfo[0].url;
       console.log(url);
    }
  } catch(e) {
    console.error(e);
  }
}
test();
