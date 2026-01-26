var b=(c,x,t)=>new Promise((p,m)=>{var g=a=>{try{i(t.next(a))}catch(n){m(n)}},h=a=>{try{i(t.throw(a))}catch(n){m(n)}},i=a=>a.done?p(a.value):Promise.resolve(a.value).then(g,h);i((t=t.apply(c,x)).next())});import{j as e}from"./ui-libs-BFSs07BO.js";import{f as v,b as w,r as u}from"./react-vendor-3BC6cITN.js";import{S as k}from"./SEO-BhsTXZbn.js";function I(){const{id:c}=v(),x=w(),[t,p]=u.useState(null),[m,g]=u.useState(!0);u.useEffect(()=>{c&&b(this,null,function*(){g(!0);const a={1:{id:1,title:"Exploring the Mystical Beauty of Ladakh",heroImage:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80",description:'Ladakh, often called the "Land of High Passes," is a region in the Indian state of Jammu and Kashmir that offers breathtaking landscapes, rich culture, and unforgettable adventures.',content:`
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              Nestled in the northernmost part of India, Ladakh is a destination that captivates travelers with its stark beauty, ancient monasteries, and warm-hearted people. This high-altitude desert region offers a unique blend of natural wonders and cultural experiences that make it a must-visit destination for adventure seekers and culture enthusiasts alike.
            </p>
            
            <div class="my-8">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" alt="Ladakh Landscape" class="w-full rounded-2xl shadow-xl" />
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Majestic Landscapes</h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              One of the most striking features of Ladakh is its dramatic landscapes. From the snow-capped peaks of the Himalayas to the vast expanses of the Nubra Valley, every turn reveals a new vista that takes your breath away. The region is home to some of the world's highest motorable passes, including Khardung La at 18,380 feet.
            </p>
            
            <div class="my-8">
              <img src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80" alt="Ladakh Mountains" class="w-full rounded-2xl shadow-xl" />
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Ancient Monasteries and Culture</h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              Ladakh is deeply rooted in Tibetan Buddhism, and this is evident in its numerous monasteries, or gompas, that dot the landscape. The Hemis Monastery, Thiksey Monastery, and Diskit Monastery are among the most famous, each offering a glimpse into the region's rich spiritual heritage. The monasteries are not just places of worship but also centers of learning and art, housing ancient manuscripts, thangka paintings, and intricate sculptures.
            </p>
            
            <div class="my-8">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80" alt="Ladakh Monastery" class="w-full rounded-2xl shadow-xl" />
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Adventure Activities</h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              For adventure enthusiasts, Ladakh offers a plethora of activities. Trekking through the Markha Valley, white-water rafting on the Zanskar River, and mountain biking on challenging terrains are just a few of the thrilling experiences available. The region's unique geography also makes it perfect for photography, with stunning sunrises and sunsets painting the sky in vibrant colors.
            </p>
            
            <div class="my-8">
              <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80" alt="Ladakh Adventure" class="w-full rounded-2xl shadow-xl" />
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Local Cuisine and Hospitality</h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              The local cuisine of Ladakh is simple yet flavorful, with dishes like thukpa (noodle soup), momos (dumplings), and butter tea being staples. The people of Ladakh are known for their warm hospitality, and staying in a traditional homestay offers an authentic experience of their way of life.
            </p>
            
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              Whether you're seeking spiritual solace, adventure, or simply want to witness some of the most beautiful landscapes on Earth, Ladakh promises an experience that will stay with you forever. The region's unique combination of natural beauty, cultural richness, and adventure opportunities makes it a destination like no other.
            </p>
          `,tourPackage:{title:"Ladakh Adventure Tour",price:"₹24,999",duration:"7 Days",highlights:["Visit ancient monasteries","Explore Nubra Valley","Pangong Lake experience","Khardung La Pass","Local homestay experience","Traditional cuisine"]}},2:{id:2,title:"Spiritual Journey Through Kashi",heroImage:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80",description:"Kashi, also known as Varanasi, is one of the oldest continuously inhabited cities in the world and a spiritual hub for millions of pilgrims.",content:`
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              Varanasi, the spiritual capital of India, is a city that has been drawing pilgrims and travelers for thousands of years. Situated on the banks of the sacred Ganges River, this ancient city offers a profound spiritual experience that transcends time.
            </p>
          `,tourPackage:{title:"Kashi Spiritual Tour",price:"₹12,999",duration:"4 Days",highlights:["Ganga Aarti ceremony","Temple visits","Boat ride on Ganges","Sarnath exploration","Spiritual discourses","Traditional rituals"]}}},n=a[c]||a[1];p(n),g(!1)})},[c]);const h=u.useMemo(()=>{if(!(t!=null&&t.content))return[];try{const i=t.content,a=/<div[^>]*class="[^"]*my-8[^"]*"[^>]*>[\s\S]*?<\/div>/gi,n=[];let s=0;const l=[];let d;for(;(d=a.exec(i))!==null;)l.push({index:d.index,length:d[0].length,fullMatch:d[0]});l.forEach(r=>{const y=i.substring(s,r.index).trim();y&&n.push({type:"text",content:y});const f=r.fullMatch.match(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/i);f&&n.push({type:"image",src:f[1],alt:f[2]||""}),s=r.index+r.length});const o=i.substring(s).trim();return o&&n.push({type:"text",content:o}),n.length===0?[{type:"text",content:i}]:n}catch(i){return console.error("Error parsing content:",i),[{type:"text",content:t.content}]}},[t==null?void 0:t.content]);return m?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"w-16 h-16 border-4 border-[#017233] border-t-transparent rounded-full animate-spin mx-auto mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading blog..."})]})}):t?e.jsxs(e.Fragment,{children:[e.jsx(k,{title:`${t.title} | Safe Hands Travels`,description:t.description,keywords:`${t.title}, travel blog, India travel, Safe Hands Travels`,image:t.heroImage,url:`/blog/${c}`}),e.jsxs("div",{className:"min-h-screen bg-white text-gray-900 font-sans",children:[e.jsxs("section",{className:"relative w-full h-[60vh] md:h-[70vh]",children:[e.jsx("div",{className:"absolute inset-0 bg-cover bg-center bg-no-repeat",style:{backgroundImage:`url(${t.heroImage})`},children:e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"})}),e.jsx("div",{className:"relative z-10 h-full flex items-end",children:e.jsx("div",{className:"w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12",children:e.jsx("h1",{className:"text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl max-w-4xl",children:t.title})})})]}),e.jsx("section",{className:"py-8 md:py-16",children:e.jsxs("div",{className:"mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",children:[e.jsx("div",{className:"mb-12 text-center",children:e.jsx("p",{className:"text-xl md:text-2xl text-gray-700 leading-relaxed font-medium max-w-3xl mx-auto",children:t.description})}),(()=>{if(!h||h.length===0)return e.jsx("div",{className:"blog-content text-gray-700 prose prose-lg max-w-4xl mx-auto",children:e.jsx("div",{dangerouslySetInnerHTML:{__html:t.content},style:{lineHeight:"1.75"}})});const i=[];let a="",n=0;return h.forEach(s=>{s.type==="text"?a+=s.content:s.type==="image"&&(a.trim()?(i.push({text:a.trim(),image:s,index:n++}),a=""):i.push({text:"",image:s,index:n++}))}),a.trim()&&i.push({text:a.trim(),image:null,index:n++}),i.map((s,l)=>{const d=l%2===0,o=s.image!==null,r=s.text!=="";return!o&&r?e.jsx("div",{className:"mb-12 md:mb-16",children:e.jsx("div",{className:"blog-content text-gray-700 prose prose-lg max-w-4xl mx-auto",dangerouslySetInnerHTML:{__html:s.text},style:{lineHeight:"1.75"}})},l):o&&!r?e.jsx("div",{className:"mb-12 md:mb-16",children:e.jsx("img",{src:s.image.src,alt:s.image.alt,className:"w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl shadow-2xl object-cover"})},l):e.jsx("div",{className:"mb-12 md:mb-20",children:e.jsxs("div",{className:`flex flex-col ${d?"lg:flex-row":"lg:flex-row-reverse"} gap-8 lg:gap-12 items-start`,children:[o&&e.jsx("div",{className:"w-full lg:w-1/2",children:e.jsx("img",{src:s.image.src,alt:s.image.alt,className:"w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl shadow-2xl object-cover"})}),r&&e.jsx("div",{className:`w-full ${o?"lg:w-1/2":"lg:w-full"}`,children:e.jsx("div",{className:"blog-content text-gray-700 prose prose-lg max-w-none",dangerouslySetInnerHTML:{__html:s.text},style:{lineHeight:"1.75"}})})]})},l)})})()]})})]}),e.jsx("style",{children:`
        .blog-content h2 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
          font-weight: 700;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
          color: #374151;
        }
        .blog-content img {
          margin: 2rem 0;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `})]}):e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900 mb-4",children:"Blog not found"}),e.jsx("button",{onClick:()=>x("/experiences"),className:"px-6 py-2 bg-[#017233] text-white rounded-lg hover:bg-[#01994d] transition-colors",children:"Back to Blogs"})]})})}export{I as default};
