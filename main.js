// main.js — robust v5 version (use with ethers v5 CDN)
// --------------------------------------------------
const networkTag   = document.getElementById("networkTag");
const accountTag   = document.getElementById("accountTag");
const nftAddrLabel = document.getElementById("nftAddrLabel");
const marketAddrLabel = document.getElementById("marketAddrLabel");
const feeLabel = document.getElementById("feeLabel");

// CONFIG – GANTI ALAMAT MU
const NFT_ADDR = "0x4539dA97ddeF6142BCb3259C8a7de703C52cf76B";
const MARKET_ADDR = "0xb871eDc06E6FeE83e993e5801fFE5FD9d060697C";

// ABI minimal (NFT)
const ERC721_ENUM_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)"
];

// Marketplace ABI (full or partial) — keep what kamu punya. Script ini toleran.
const MARKET_ABI = [
  // minimal — jika kamu punya full ABI, replace array ini dengan full JSON ABI
  // contoh fallback fungsi: nextListingId, listings, list, buy, cancel
  "function nextListingId() view returns (uint256)",
  "function listings(uint256) view returns (address nft, uint256 tokenId, address seller, uint256 price, bool active)",
  "function list(address nftAddress, uint256 tokenId, uint256 price)",
  "function listNFT(address nftAddress, uint256 tokenId, uint256 price)",
  "function buy(uint256 listingId) payable",
  "function buyNFT(address nftAddress, uint256 tokenId) payable",
  "function cancel(uint256 listingId)",
  "function cancelListing(address nftAddress, uint256 tokenId)"
];

// Globals
let provider = null;
let signer = null;
let account = null;
let nft = null;
let market = null;

// helper
const $ = id => document.getElementById(id);
function ipfsToHttp(uri){ if(!uri) return uri; if(uri.startsWith("ipfs://")) return uri.replace("ipfs://","https://ipfs.io/ipfs/"); return uri; }
function fmt(bn){ try { const f = ethers.utils.formatEther(bn); return parseFloat(f).toFixed(4).replace(/\.?0+$/,""); } catch(e){ return String(bn); } }

// safe method caller (returns function or null)
function fnExists(obj, names){
  for(const n of names){
    if(obj && typeof obj[n] === 'function') return n;
  }
  return null;
}

// UI tab handler
function onTab(e){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  e.currentTarget.classList.add('active');
  const key = e.currentTarget.dataset.tab;
  $('#panel-my').hidden = key !== 'my';
  $('#panel-market').hidden = key !== 'market';
}

// Connect wallet (ethers v5) — minimal & safe
async function connectWallet(){
  if(typeof window.ethereum === "undefined"){ alert("Please install MetaMask!"); return; }
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    account = await signer.getAddress();

    // attempt to switch to Sepolia (safe)
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0xaa36a7" }] });
    } catch(switchErr){
      // user may reject or chain missing; we still continue but inform
      if(switchErr && switchErr.code === 4902){
        // try add
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0xaa36a7",
              chainName: "Sepolia Test Network",
              nativeCurrency:{ name:"SepoliaETH", symbol:"ETH", decimals:18 },
              rpcUrls:["https://rpc.sepolia.org/"], blockExplorerUrls:["https://sepolia.etherscan.io/"]
            }]
          });
        } catch(addErr){ console.warn("Add chain failed:", addErr); }
      } else {
        console.warn("Switch chain failed or cancelled:", switchErr);
      }
    }

    // re-init provider & signer after potential switch
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    account = await signer.getAddress();
    const network = await provider.getNetwork();

    // init contracts (using provided ABIs)
    nft = new ethers.Contract(NFT_ADDR, ERC721_ENUM_ABI, signer);
    market = new ethers.Contract(MARKET_ADDR, MARKET_ABI, signer);

    // update UI
    $('#accountTag').textContent = `Wallet: ${account}`;
    $('#networkTag').textContent = `Network: ${network.name} (${network.chainId})`;
    $('#connectBtn').style.display = "none";
    $('#disconnectBtn').style.display = "inline-block";
    $('#nftAddrLabel').textContent = NFT_ADDR;
    $('#marketAddrLabel').textContent = MARKET_ADDR;

    // only refresh approval (safe) — don't auto-load market if ABI mismatches
    try { await refreshApprovalBadge(); } catch(e){ console.warn(e); }

    console.log("✅ Connected:", account, "network:", network.chainId);
    return true;
  } catch(err){
    console.error("Connect failed:", err);
    alert("Connect failed — lihat console");
    return false;
  }
}

function disconnectWallet(){
  provider = null; signer = null; account = null; nft = null; market = null;
  $('#accountTag').textContent = "Wallet: —";
  $('#networkTag').textContent = "Network: —";
  $('#connectBtn').style.display = "inline-block";
  $('#disconnectBtn').style.display = "none";
  $('#myList').innerHTML = "";
  $('#marketList').innerHTML = "";
  console.log("🔌 Disconnected");
}

// auto update when accounts/chain change
if(window.ethereum){
  window.ethereum.on("accountsChanged", (accounts) => {
    if(!accounts || accounts.length === 0) return disconnectWallet();
    account = accounts[0];
    $('#accountTag').textContent = `Wallet: ${account}`;
    // re-init signer/contracts (if provider exists)
    if(provider){
      signer = provider.getSigner();
      nft = new ethers.Contract(NFT_ADDR, ERC721_ENUM_ABI, signer);
      market = new ethers.Contract(MARKET_ADDR, MARKET_ABI, signer);
      refreshApprovalBadge().catch(e=>console.warn(e));
    }
  });
  window.ethereum.on("chainChanged", (c) => { console.log("chain changed", c); window.location.reload(); });
}

// ========== Approval ==========
async function refreshApprovalBadge(){
  if(!nft || !account) return;
  try {
    const ok = await nft.isApprovedForAll(account, MARKET_ADDR);
    const btn = $('#btnApprove');
    if(btn){ btn.textContent = ok ? 'Approved ✓' : 'Set ApprovalForAll'; btn.disabled = ok; }
  } catch(e){ console.warn("refreshApprovalBadge failed:", e); }
}

async function setApprovalAll(){
  if(!nft || !signer) return alert("Connect wallet dulu!");
  try {
    const tx = await nft.setApprovalForAll(MARKET_ADDR, true);
    await tx.wait();
    await refreshApprovalBadge();
    alert("Approval set!");
  } catch(e){ console.error(e); alert("Approval failed — lihat console"); }
}

// ========== Load My NFTs ==========
async function loadMyNfts(){
  if(!nft || !account){ $('#myList').innerHTML = '<p class="muted">Connect wallet dulu.</p>'; return; }
  $('#myList').innerHTML = '<p class="muted">Loading…</p>';
  try {
    const bal = await nft.balanceOf(account);
    const total = Number(bal.toString());
    if(total === 0){ $('#myList').innerHTML = '<p class="muted">Tidak ada NFT pada koleksi ini.</p>'; return; }
    const items = [];
    for(let i=0;i<total;i++){
      const tokenIdBn = await nft.tokenOfOwnerByIndex(account, i);
      items.push(Number(tokenIdBn.toString()));
    }
    const cards = await Promise.all(items.map(renderMyCard));
    $('#myList').innerHTML = cards.join('');
    items.forEach(id=>{ const btn = document.getElementById(`btnList-${id}`); if(btn) btn.addEventListener('click', ()=> listToken(id)); });
  } catch(e){
    console.error("loadMyNfts failed:", e);
    $('#myList').innerHTML = '<p class="err">Gagal load NFT. Lihat console.</p>';
  }
}

// ========== Render card ==========
async function renderMyCard(tokenId){
  try{
    const uri = await nft.tokenURI(tokenId);
    const metaUrl = ipfsToHttp(uri);
    let name = `#${tokenId}`, img='', desc='';
    try{ const res = await fetch(metaUrl); const j = await res.json(); name = j.name || name; img = ipfsToHttp(j.image||''); desc = j.description || ''; }catch(e){}
    return `<div class="card"><img src="${img||''}" alt="NFT ${tokenId}" onerror="this.style.display='none'"/><div class="body"><div class="row-between"><strong>${name}</strong><span class="muted">ID ${tokenId}</span></div><p class="muted" style="min-height:2.2em">${desc}</p><label>Price (ETH)</label><input id="price-${tokenId}" placeholder="0.01" /><div style="height:8px"></div><button id="btnList-${tokenId}">List for Sale</button></div></div>`;
  }catch(e){ return `<div class="card"><div class="body">Token ${tokenId}</div></div>`; }
}

// ========== List Token (with fallback names) ==========
async function listToken(tokenId){
  const priceStr = (document.getElementById(`price-${tokenId}`)?.value || '').trim();
  if(!priceStr) return alert("Isi harga dalam ETH, mis. 0.01");
  if(!market || !signer) return alert("Connect wallet dulu!");
  const wei = ethers.utils.parseEther(priceStr);
  try {
    const fn = fnExists(market, ['list', 'listNFT', 'listToken']);
    if(!fn){ alert("Marketplace tidak punya fungsi `list` yang dikenal. Perbarui ABI."); return; }
    const tx = await market[fn](NFT_ADDR, tokenId, wei);
    await tx.wait();
    alert("Listed!");
    await loadMarket();
  } catch(e){ console.error("listToken failed:", e); alert("List gagal. Lihat console."); }
}

// ========== Load Market (safe) ==========
async function loadMarket(){
  if(!market){ $('#marketList').innerHTML = '<p class="muted">Connect wallet dulu.</p>'; return; }

  // prefer nextListingId if available
  if(typeof market.nextListingId === 'function'){
    $('#marketList').innerHTML = '<p class="muted">Loading…</p>';
    try{
      const nextIdBn = await market.nextListingId();
      const max = Number(nextIdBn.toString());
      const active = [];
      for(let id=1; id<=max; id++){
        try {
          const L = await market.listings(id);
          const activeFlag = L.active ?? L[4] ?? false;
          const nftAddr = L.nft ?? L[0];
          const tokenIdBn = L.tokenId ?? L[1];
          const seller = L.seller ?? L[2];
          const price = L.price ?? L[3];
          if(activeFlag && String(nftAddr).toLowerCase() === NFT_ADDR.toLowerCase()){
            active.push({ id, seller, tokenId: Number(tokenIdBn.toString()), price });
          }
        } catch(e){ /* ignore non-existing */ }
      }
      if(active.length===0){ $('#marketList').innerHTML = '<p class="muted">Belum ada listing aktif.</p>'; return; }
      const cards = await Promise.all(active.map(renderMarketCard));
      $('#marketList').innerHTML = cards.join('');
      active.forEach(({id})=>{ const b = document.getElementById(`btnBuy-${id}`); if(b) b.addEventListener('click', ()=> buyListing(id)); const c = document.getElementById(`btnCancel-${id}`); if(c) c.addEventListener('click', ()=> cancelListing(id)); });
      return;
    } catch(e){
      console.warn("loadMarket with nextListingId failed:", e);
      $('#marketList').innerHTML = '<p class="err">Gagal load listing. Lihat console.</p>';
      return;
    }
  }

  // fallback: if contract exposes getListing or listings by nft/token, you must adapt.
  $('#marketList').innerHTML = '<p class="muted">Marketplace contract tidak memiliki fungsi `nextListingId`. Jika kamu punya ABI lengkap, ganti MARKET_ABI. Untuk sekarang, gunakan fungsi RefreshMarket setelah menambah ABI.</p>';
}

// ========== Render Market card ==========
async function renderMarketCard(item){
  const {id, tokenId, price, seller} = item;
  let name = `#${tokenId}`, img='', desc='';
  try{ const uri = await nft.tokenURI(tokenId); const metaUrl = ipfsToHttp(uri); const j = await (await fetch(metaUrl)).json(); name = j.name || name; img = ipfsToHttp(j.image||''); desc = j.description || ''; }catch(e){}
  const isSeller = account && seller && account.toLowerCase()===String(seller).toLowerCase();
  return `<div class="card"><img src="${img||''}" alt="NFT ${tokenId}" onerror="this.style.display='none'"/><div class="body"><div class="row-between"><strong>${name}</strong><span class="muted">#${tokenId}</span></div><p class="muted" style="min-height:2.2em">${desc}</p><div class="row-between"><div><div class="muted small">Listing ID</div><div class="code">${id}</div></div><div style="text-align:right"><div class="muted small">Price</div><div><b>${fmt(price)} ETH</b></div></div></div><div style="height:8px"></div>${isSeller ? `<button id="btnCancel-${id}" style="background:#ff8080">Cancel</button>` : `<button id="btnBuy-${id}">Buy</button>`}</div></div>`;
}

// ========== Buy/Cancel with fallback ==========
async function buyListing(id){
  if(!market || !signer) return alert("Connect wallet dulu!");
  try {
    // prefer buy(listingId) then buyNFT(nft,token) (we have listingId so try buy)
    const fn = fnExists(market, ['buy','buyNFT']);
    if(!fn){ alert("Marketplace tidak punya fungsi `buy` yang dikenal. Update ABI."); return; }
    let tx;
    if(fn === 'buy') {
      const L = await market.listings(id);
      const price = L.price ?? L[3];
      if(!price) return alert("Listing price not found");
      tx = await market.buy(id, { value: price });
    } else {
      // buyNFT(nftAddr, tokenId) — need tokenId from listing
      const L = await market.listings(id);
      const tokenId = L.tokenId ?? L[1];
      const price = L.price ?? L[3];
      tx = await market.buyNFT(NFT_ADDR, Number(tokenId.toString()), { value: price });
    }
    await tx.wait();
    alert("Purchase success!");
    await loadMarket(); await loadMyNfts();
  } catch(e){ console.error("buyListing failed:", e); alert("Buy failed — lihat console"); }
}

async function cancelListing(id){
  if(!market || !signer) return alert("Connect wallet dulu!");
  try {
    const fn = fnExists(market, ['cancel','cancelListing']);
    if(!fn){ alert("Marketplace tidak punya fungsi cancel yang dikenal. Update ABI."); return; }
    let tx;
    if(fn === 'cancel'){
      tx = await market.cancel(id);
    } else {
      const L = await market.listings(id);
      const tokenId = L.tokenId ?? L[1];
      tx = await market.cancelListing(NFT_ADDR, Number(tokenId.toString()));
    }
    await tx.wait(); alert("Canceled"); await loadMarket();
  } catch(e){ console.error("cancelListing failed:", e); alert("Cancel failed — lihat console"); }
}

// ========== Wire UI after DOM ready ==========
window.addEventListener('DOMContentLoaded', () => {
  $('#nftAddrLabel').textContent = NFT_ADDR;
  $('#marketAddrLabel').textContent = MARKET_ADDR;
  $('#connectBtn').addEventListener('click', connectWallet);
  $('#disconnectBtn').addEventListener('click', disconnectWallet);
  $('#btnRefreshMy').addEventListener('click', loadMyNfts);
  $('#btnApprove').addEventListener('click', setApprovalAll);
  $('#btnRefreshMarket').addEventListener('click', loadMarket);
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', onTab));
  $('#accountTag').textContent = "Wallet: —";
  $('#networkTag').textContent = "Network: —";
});
