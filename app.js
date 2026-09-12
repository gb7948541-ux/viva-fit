const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const products=[
['Legging Sculpt','Leggings','R$ 169,90','assets/products/01-legging-sculpt.jpg','Alta compressão e cintura anatômica.'],
['Legging Motion','Leggings','R$ 159,90','assets/products/02-legging-motion.jpg','Toque macio e liberdade de movimento.'],
['Legging Contour','Leggings','R$ 179,90','assets/products/03-legging-contour.jpg','Recortes que acompanham a silhueta.'],
['Legging Essential','Leggings','R$ 149,90','assets/products/04-legging-essential.jpg','A base para todos os seus treinos.'],
['Top Aura','Tops','R$ 119,90','assets/products/05-top-aura.jpg','Sustentação com visual minimalista.'],
['Top Shape','Tops','R$ 109,90','assets/products/06-top-shape.jpg','Alças limpas e ajuste confortável.'],
['Top Flow','Tops','R$ 114,90','assets/products/07-top-flow.jpg','Leve, firme e pronto para o movimento.'],
['Top Balance','Tops','R$ 124,90','assets/products/08-top-balance.jpg','Equilíbrio entre suporte e estilo.'],
['Conjunto Aura','Conjuntos','R$ 269,90','assets/products/09-conjunto-aura.jpg','Conjunto essencial para performance.'],
['Conjunto Move','Conjuntos','R$ 289,90','assets/products/10-conjunto-move.jpg','Legging e top em composição monocromática.'],
['Conjunto Sculpt','Conjuntos','R$ 299,90','assets/products/11-conjunto-sculpt.jpg','Modelagem marcada e acabamento premium.'],
['Short Sprint','Shorts','R$ 119,90','assets/products/12-short-sprint.jpg','Cintura alta para treinos intensos.'],
['Short Flow','Shorts','R$ 109,90','assets/products/13-short-flow.jpg','Leveza para correr, treinar e viver.'],
['Cropped Soft','Croppeds','R$ 129,90','assets/products/14-cropped-soft.jpg','Camada leve para antes e depois do treino.'],
['Cropped Daily','Croppeds','R$ 139,90','assets/products/15-cropped-daily.jpg','Visual clean para a rotina.']
].map((p,i)=>({id:i+1,name:p[0],cat:p[1],price:p[2],img:p[3],desc:p[4]}));
let filter='Todos', search='', selected=null, qty=1, size='M';
let cart=[]; try{cart=JSON.parse(localStorage.getItem('vivaFitCartV4')||'[]');if(!Array.isArray(cart))cart=[]}catch{cart=[]}
const money=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);
const num=v=>Number(v.replace('R$','').replace('.','').replace(',','.').trim());
function save(){try{localStorage.setItem('vivaFitCartV4',JSON.stringify(cart))}catch{}}
function renderProducts(){const grid=$('#productGrid');if(!grid)return;const list=products.filter(p=>(filter==='Todos'||p.cat===filter)&&p.name.toLowerCase().includes(search.toLowerCase()));grid.innerHTML=list.map(p=>`<article class="product-card" data-id="${p.id}"><div class="product-image"><span class="product-tag">${p.cat}</span><img src="${p.img}" alt="${p.name}"></div><div class="product-meta"><h3>${p.name}</h3><span class="cat">VIVA FIT</span><strong>${p.price}</strong></div></article>`).join('')||'<div class="empty" style="grid-column:1/-1">Nenhuma peça encontrada.</div>';$$('.product-card').forEach(c=>c.onclick=()=>openModal(Number(c.dataset.id)))}
function renderCart(){const box=$('#cartItems');if(!box)return;$('#cartCount').textContent=cart.reduce((a,c)=>a+c.qty,0);if(!cart.length){box.innerHTML='<div class="empty">Sua bag está vazia.<br>Escolha uma peça para começar.</div>'}else box.innerHTML=cart.map((c,i)=>`<div class="cart-row"><img src="${c.img}" alt=""><div><h3>${c.name}</h3><p>${c.size} · ${c.qty} × ${c.price}</p></div><button data-remove="${i}">×</button></div>`).join('');box.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(Number(b.dataset.remove),1);save();renderCart()});const total=cart.reduce((a,c)=>a+num(c.price)*c.qty,0);$('#cartTotal').textContent=money(total)}
function openModal(id){selected=products.find(p=>p.id===id);if(!selected)return;qty=1;size='M';$('#modalImg').src=selected.img;$('#modalImg').alt=selected.name;$('#modalCat').textContent=selected.cat;$('#modalName').textContent=selected.name;$('#modalPrice').textContent=selected.price;$('#modalDesc').textContent=selected.desc;$('#qtyValue').textContent=qty;$('#modalSizes').innerHTML=['P','M','G','GG'].map(s=>`<button class="size ${s===size?'active':''}" data-size="${s}">${s}</button>`).join('');$$('.size').forEach(b=>b.onclick=()=>{size=b.dataset.size;$$('.size').forEach(x=>x.classList.toggle('active',x===b))});$('#productModal').classList.add('open');document.body.style.overflow='hidden'}
function closeModal(){ $('#productModal').classList.remove('open');document.body.style.overflow=''}
function addSelected(){if(!selected)return;const old=cart.find(c=>c.id===selected.id&&c.size===size);if(old)old.qty+=qty;else cart.push({id:selected.id,name:selected.name,size,qty,price:selected.price,img:selected.img});save();renderCart();closeModal();openCart()}
function openCart(){$('#cart').classList.add('open');$('#cartBackdrop').classList.add('open')}
function closeCart(){$('#cart').classList.remove('open');$('#cartBackdrop').classList.remove('open')}
$('#filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;filter=b.dataset.filter;$$('#filters button').forEach(x=>x.classList.toggle('active',x===b));renderProducts()});
$('#search').addEventListener('input',e=>{search=e.target.value;renderProducts()});
$$('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>{filter=a.dataset.filterLink;$$('#filters button').forEach(x=>x.classList.toggle('active',x.dataset.filter===filter));renderProducts()}));
$('#cartBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#cartBackdrop').onclick=closeCart;$('#modalClose').onclick=closeModal;$('#productModal').addEventListener('click',e=>{if(e.target.id==='productModal')closeModal()});$('#addBtn').onclick=addSelected;$('#qtyMinus').onclick=()=>{qty=Math.max(1,qty-1);$('#qtyValue').textContent=qty};$('#qtyPlus').onclick=()=>{qty++;$('#qtyValue').textContent=qty};
$('#menuBtn').onclick=()=>$('#mobileNav').classList.toggle('open');$$('.mobile-nav a').forEach(a=>a.onclick=()=>$('#mobileNav').classList.remove('open'));
$('#whatsBtn').onclick=()=>{if(!cart.length)return alert('Adicione uma peça à bag primeiro.');let msg='Olá! Vim pelo site demonstrativo da VIVA FIT e gostaria de finalizar meu pedido:%0A%0A'+cart.map(c=>`• ${c.name} — ${c.size} — ${c.qty}x — ${c.price}`).join('%0A');msg+=`%0A%0ASubtotal: ${encodeURIComponent($('#cartTotal').textContent)}`;window.open('https://wa.me/5500000000000?text='+msg,'_blank')};
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});$$('.reveal').forEach(el=>io.observe(el));
window.addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',scrollY>50),{passive:true});
$$('img[data-media]').forEach(img=>img.addEventListener('error',()=>{img.style.opacity='0';img.parentElement.classList.add('media-missing')}));
function boot(){renderProducts();renderCart();$('#header').classList.toggle('scrolled',scrollY>50);setTimeout(()=>$('#loader').style.opacity='0',650);setTimeout(()=>$('#loader')?.remove(),1350)}
window.addEventListener('load',boot);setTimeout(()=>{if($('#loader')){$('#loader').style.opacity='0';setTimeout(()=>$('#loader')?.remove(),700)}},3000);
