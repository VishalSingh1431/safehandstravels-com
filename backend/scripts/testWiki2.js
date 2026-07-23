async function test() {
  const keyword = "rajasthan";
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${keyword}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&format=json`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'SafeHandsTravelsBot/1.0 (info@safehandstravels.com)'
      }
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
    const pages = data.query.pages;
    for (const pageId in pages) {
       const imageInfo = pages[pageId].imageinfo;
       if (imageInfo && imageInfo.length > 0) {
         console.log(imageInfo[0].url);
       }
    }
  } catch(e) {
    console.error(e);
  }
}
test();
