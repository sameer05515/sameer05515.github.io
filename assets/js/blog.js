// blog.js — simple static blog engine (no backend)
(async function(){
  const listEl = document.getElementById('list');
  const postView = document.getElementById('postView');
  const postContent = document.getElementById('postContent');
  const backBtn = document.getElementById('backToList');
  const searchBox = document.getElementById('searchBox');

  let posts = [];

  async function loadIndex(){
    const res = await fetch('/posts/posts.json');
    posts = await res.json();
    renderList(posts);
  }

  function renderList(items){
    listEl.innerHTML = items.map(p => `
      <article class="glass-card p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-indigo-300 text-lg font-semibold">${p.title}</h3>
            <div class="text-sm text-slate-400">${p.date} • ${p.summary}</div>
          </div>
          <div>
            <button class="btn-primary-sm view-btn" data-file="${p.file}">Read</button>
          </div>
        </div>
      </article>
    `).join('');
    attachListeners();
  }

  function attachListeners(){
    document.querySelectorAll('.view-btn').forEach(b=>{
      b.addEventListener('click', async (e)=>{
        const file = b.getAttribute('data-file');
        await showPost(file);
      });
    });
  }

  async function showPost(file){
    const res = await fetch('/posts/' + file);
    const md = await res.text();
    // using marked (loaded by CDN)
    postContent.innerHTML = marked.parse(md);
    postView.classList.remove('hidden');
    listEl.classList.add('hidden');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  backBtn.addEventListener('click', ()=>{
    postView.classList.add('hidden');
    listEl.classList.remove('hidden');
  });

  searchBox && searchBox.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase().trim();
    if(!q) return renderList(posts);
    const out = posts.filter(p => (p.title + ' ' + p.summary).toLowerCase().includes(q));
    renderList(out);
  });

  // init
  loadIndex();
})();
