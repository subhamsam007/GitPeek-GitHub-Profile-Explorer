const searchBtn = document.getElementById('searchBtn')
const usernameInput = document.getElementById('usernameInput');
const card = document.getElementById('card');


function getProfile(username){
    return fetch(`https://api.github.com/users/${username}`)
        .then(res =>{
            if(!res.ok){
                throw new Error('User not found')
            }
            return res.json()
        })
}
function getRepos(username){
    return fetch(`https://api.github.com/users/${username}/repos?sort=update`)
        .then(res =>{
            if(!res.ok){
                throw new Error('User not found')
            }
            return res.json()
        })
}
function styleData(user){
    let data= `<div class="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img 
            src="${user.avatar_url}" 
            alt="${user.login}" 
            class="w-28 h-28 rounded-full border-4 border-blue-500 shadow"
          />
          <div class="flex-1 text-white">
            <h2 class="text-2xl font-semibold">${user.name || "No Name"}</h2>
            <p class="text-blue-400">@${user.login}</p>
            <p class="mt-2 text-gray-300">${user.bio || "No bio provided."}</p>
            <div class="mt-4 flex flex-wrap gap-3 text-sm text-white">
              <span class="bg-slate-700 px-3 py-1 rounded-full">Followers: ${user.followers}</span>
              <span class="bg-slate-700 px-3 py-1 rounded-full">Following: ${user.following}</span>
              <span class="bg-slate-700 px-3 py-1 rounded-full">Repos: ${user.public_repos}</span>
              <span class="bg-slate-700 px-3 py-1 rounded-full">Location: ${user.location || "Unknown"}</span>
              <span class="bg-slate-700 px-3 py-1 rounded-full">company: ${user.company}</span>
              <span class="bg-slate-700 px-3 py-1 rounded-full">Email: ${user.email || "Not provided"}</span>
              
              

              <span class="bg-slate-700 px-3 py-1 rounded-full">Bio: ${user.bio || "No bio provided."}</span>
              <span class="bg-slate-700 px-3 py-1 rounded-full">Created at: ${new Date(user.created_at).toLocaleDateString()}</span>
              <span class="bg-slate-700 px-3 py-1 rounded-full">Updated at: ${new Date(user.updated_at).toLocaleDateString()}</span>
              </div>
          </div>
        </div>`
        card.innerHTML = data;
    // skeletonCard.innerHTML = data;
}






searchBtn.addEventListener('click', function(){
    let username = usernameInput.value.trim();
    if(username.length> 0){
        getProfile(username).then((data) => {
            styleData(data) 
        } )
    }else{
        alert('Please enter a username')
        return
    }
})
usernameInput.addEventListener('input', async () => {
    const query = usernameInput.value.trim();
    if (query.length === 0) {
      suggestionsList.classList.add('hidden');
      return;
    }

    try {
      const res = await fetch(`https://api.github.com/search/users?q=${query}&per_page=5`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        suggestionsList.innerHTML = '';
        data.items.forEach(user => {
          const li = document.createElement('li');
          li.textContent = user.login;
          li.className = 'px-4 py-2 text-white hover:bg-slate-700 cursor-pointer';
          li.addEventListener('click', () => {
            usernameInput.value = user.login;
            suggestionsList.classList.add('hidden');
          });
          suggestionsList.appendChild(li);
        });
        suggestionsList.classList.remove('hidden');
      } else {
        suggestionsList.classList.add('hidden');
      }
    } catch (err) {
      suggestionsList.classList.add('hidden');
    }
  });

  document.addEventListener('click', (e) => {
    if (!usernameInput.contains(e.target) && !suggestionsList.contains(e.target)) {
      suggestionsList.classList.add('hidden');
    }
  });