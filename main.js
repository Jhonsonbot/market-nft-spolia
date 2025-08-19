// CONFIG – GANTI ALAMAT MU
const NFT_ADDR = "0x4539dA97ddeF6142BCb3259C8a7de703C52cf76B";
const MARKET_ADDR = "0xb871eDc06E6FeE83e993e5801fFE5FD9d060697C";

// ABI minimal (sesuaikan jika kontrakmu beda)
const ERC721_ENUM_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// ABI marketplace minimal — pastikan nama fungsi cocok dengan kontrakmu.
// Kalo kontrakmu pake nama lain (mis. listNFT / buyNFT), ubah ABI / pemanggilan.
const MARKET_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "oldFeeBps",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newFeeBps",
				"type": "uint256"
			}
		],
		"name": "FeeBpsUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FeesWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			}
		],
		"name": "NFTCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "NFTListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "royalty",
				"type": "uint256"
			}
		],
		"name": "NFTSold",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "MAX_FEE_BPS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "accruedFees",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "buyNFT",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "cancelListing",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeBps",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getListing",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"internalType": "struct NFTMarketplace.Listing",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "listNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "listings",
		"outputs": [
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFeeBps",
				"type": "uint256"
			}
		],
		"name": "setFeeBps",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

// Globals
let provider = null;
let signer = null;
let account = null;
let nft = null;
let market = null;

// Helper: safe selector
const $ = id => document.getElementById(id);

// Helper IPFS -> HTTP
function ipfsToHttp(uri){
  if(!uri) return uri;
  if(uri.startsWith("ipfs://")) return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  return uri;
}

// Helper format wei -> ETH string (4 desimal)
function fmt(bn){
  try {
    const f = ethers.utils.formatEther(bn);
    // trim trailing zeros
    return parseFloat(f).toFixed(4).replace(/\.?0+$/,"");
  } catch(e){
    return String(bn);
  }
}

// UI tab handler
function onTab(e){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  e.currentTarget.classList.add('active');
  const key = e.currentTarget.dataset.tab;
  $('#panel-my').hidden = key !== 'my';
  $('#panel-market').hidden = key !== 'market';
}

// Connect wallet (ethers v5) + switch to Sepolia
async function connectWallet(){
  if(typeof window.ethereum === "undefined"){
    alert("Please install MetaMask!");
    return;
  }

  try {
    // request accounts
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    // try switch to Sepolia (chainId 11155111 - hex 0xaa36a7)
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }]
      });
    } catch (switchError) {
      // 4902 = chain not found, ask to add
      if (switchError && switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0xaa36a7",
              chainName: "Sepolia Test Network",
              nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://rpc.sepolia.org/"],
              blockExplorerUrls: ["https://sepolia.etherscan.io/"]
            }]
          });
        } catch(addErr){
          console.warn("Failed to add Sepolia to MetaMask:", addErr);
        }
      } else {
        console.warn("Switch chain error:", switchError);
      }
    }

    // re-init provider & signer after possible switch
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    account = await signer.getAddress();

    const network = await provider.getNetwork();
    if(network.chainId !== 11155111){
      // still not Sepolia — inform user but continue (or return)
      alert("Please switch MetaMask to Sepolia Testnet.");
      // we continue but most contract calls will fail if wrong network
    }

    // update UI
    $('#accountTag').textContent = `Wallet: ${account}`;
    $('#networkTag').textContent = `Network: ${network.name} (${network.chainId})`;
    $('#connectBtn').style.display = "none";
    $('#disconnectBtn').style.display = "inline-block";

    // init contracts with signer
    nft = new ethers.Contract(NFT_ADDR, ERC721_ENUM_ABI, signer);
    market = new ethers.Contract(MARKET_ADDR, MARKET_ABI, signer);

    // update labels
    $('#nftAddrLabel').textContent = NFT_ADDR;
    $('#marketAddrLabel').textContent = MARKET_ADDR;

    // load UI data
    try { await refreshApprovalBadge(); } catch(e){ console.warn(e); }
    try { await loadMyNfts(); } catch(e){ console.warn(e); }
    try { await loadMarket(); } catch(e){ console.warn(e); }

    console.log("✅ Wallet connected:", account);
  } catch (err) {
    console.error("❌ Wallet connect failed:", err);
    alert("Failed to connect wallet. Check console for details.");
  }
}

function disconnectWallet(){
  provider = null;
  signer = null;
  account = null;
  nft = null;
  market = null;

  $('#accountTag').textContent = "Wallet: —";
  $('#networkTag').textContent = "Network: —";
  $('#connectBtn').style.display = "inline-block";
  $('#disconnectBtn').style.display = "none";
  $('#myList').innerHTML = "";
  $('#marketList').innerHTML = "";
  console.log("✅ Wallet disconnected");
}

// Auto-update when account / chain change
if(window.ethereum){
  window.ethereum.on("accountsChanged", async (accounts) => {
    if(!accounts || accounts.length === 0) {
      disconnectWallet();
    } else {
      account = accounts[0];
      $('#accountTag').textContent = `Wallet: ${account}`;
      // re-create signer & contracts
      if(provider){
        signer = provider.getSigner();
        nft = new ethers.Contract(NFT_ADDR, ERC721_ENUM_ABI, signer);
        market = new ethers.Contract(MARKET_ADDR, MARKET_ABI, signer);
        try { await refreshApprovalBadge(); } catch(e){ console.warn(e); }
        try { await loadMyNfts(); } catch(e){ console.warn(e); }
      }
    }
  });

  window.ethereum.on("chainChanged", (chainId) => {
    // reload to simplify re-init on chain change
    console.log("chainChanged -> reload", chainId);
    window.location.reload();
  });
}

// ======================
// APPROVAL
// ======================
async function refreshApprovalBadge(){
  if(!nft || !account) return;
  try {
    const ok = await nft.isApprovedForAll(account, MARKET_ADDR);
    const btn = $('#btnApprove');
    if(btn){
      btn.textContent = ok ? 'Approved ✓' : 'Set ApprovalForAll';
      btn.disabled = ok;
    }
  } catch(e){
    console.warn("refreshApprovalBadge failed:", e);
  }
}

async function setApprovalAll(){
  if(!nft || !signer) return alert('Connect wallet dulu!');
  try {
    const tx = await nft.setApprovalForAll(MARKET_ADDR, true);
    await tx.wait();
    await refreshApprovalBadge();
    alert('Approval set!');
  } catch(e){
    console.error(e);
    alert('Approval failed. See console.');
  }
}

// ======================
// LOAD MY NFTS
// ======================
async function loadMyNfts(){
  if(!nft || !account){
    $('#myList').innerHTML = '<p class="muted">Connect wallet dulu.</p>';
    return;
  }
  $('#myList').innerHTML = '<p class="muted">Loading…</p>';
  try {
    const bal = await nft.balanceOf(account);
    const total = Number(bal.toString());
    if(total === 0){
      $('#myList').innerHTML = '<p class="muted">Tidak ada NFT pada koleksi ini.</p>';
      return;
    }

    const items = [];
    for(let i=0;i<total;i++){
      const tokenIdBn = await nft.tokenOfOwnerByIndex(account, i);
      items.push(Number(tokenIdBn.toString()));
    }

    const cards = await Promise.all(items.map(renderMyCard));
    $('#myList').innerHTML = cards.join('');

    // attach handlers
    items.forEach(id => {
      const btn = document.getElementById(`btnList-${id}`);
      if(btn){ btn.addEventListener('click', ()=> listToken(id)); }
    });
  } catch(e){
    console.error(e);
    $('#myList').innerHTML = '<p class="err">Gagal load NFT. Pastikan kontrak ERC721Enumerable dan jaringan benar.</p>';
  }
}

async function renderMyCard(tokenId){
  try{
    const uri = await nft.tokenURI(tokenId);
    const metaUrl = ipfsToHttp(uri);
    let name = `#${tokenId}`; let img=''; let desc='';
    try{
      const res = await fetch(metaUrl);
      const j = await res.json();
      name = j.name || name;
      img = ipfsToHttp(j.image || '');
      desc = j.description || '';
    }catch(e){ /* ignore metadata errors */ }

    return `
      <div class="card">
        <img src="${img||''}" alt="NFT ${tokenId}" onerror="this.style.display='none'"/>
        <div class="body">
          <div class="row-between"><strong>${name}</strong><span class="muted">ID ${tokenId}</span></div>
          <p class="muted" style="min-height:2.2em">${desc}</p>
          <label>Price (ETH)</label>
          <input id="price-${tokenId}" placeholder="0.01" />
          <div style="height:8px"></div>
          <button id="btnList-${tokenId}">List for Sale</button>
        </div>
      </div>`;
  }catch(e){
    return `<div class="card"><div class="body">Token ${tokenId}</div></div>`;
  }
}

// ======================
// LIST TOKEN
// ======================
async function listToken(tokenId){
  const priceStr = (document.getElementById(`price-${tokenId}`)?.value || '').trim();
  if(!priceStr){ alert('Isi harga dalam ETH, mis. 0.01'); return; }
  if(!market || !signer) return alert('Connect wallet dulu!');
  try{
    const wei = ethers.utils.parseEther(priceStr);
    const tx = await market.list(NFT_ADDR, tokenId, wei);
    await tx.wait();
    alert('Listed!');
    await loadMarket();
  }catch(e){
    console.error(e);
    alert('List gagal. Pastikan sudah ApprovalForAll dan jaringan benar.');
  }
}

// ======================
// LOAD MARKET LISTINGS
// ======================
async function loadMarket(){
  if(!market){
    $('#marketList').innerHTML = '<p class="muted">Connect wallet dulu.</p>';
    return;
  }
  $('#marketList').innerHTML = '<p class="muted">Loading…</p>';
  try{
    const nextIdBn = await market.nextListingId();
    const max = Number(nextIdBn.toString());
    const active = [];

    for(let id=1; id<=max; id++){
      try {
        const L = await market.listings(id);
        // L may be an object or array. Access properties defensively
        const activeFlag = L.active ?? L[4] ?? false;
        const nftAddr = L.nft ?? L[0];
        const tokenIdBn = L.tokenId ?? L[1];
        const seller = L.seller ?? L[2];
        const price = L.price ?? L[3];

        if(activeFlag && String(nftAddr).toLowerCase() === NFT_ADDR.toLowerCase()){
          active.push({ id, seller, tokenId: Number(tokenIdBn.toString()), price });
        }
      } catch(e){
        // if some listing id doesn't exist, ignore
      }
    }

    if(active.length===0){
      $('#marketList').innerHTML = '<p class="muted">Belum ada listing aktif.</p>';
      return;
    }

    const cards = await Promise.all(active.map(renderMarketCard));
    $('#marketList').innerHTML = cards.join('');

    active.forEach(({id})=>{
      const b = document.getElementById(`btnBuy-${id}`);
      if(b){ b.addEventListener('click', ()=> buyListing(id)); }
      const c = document.getElementById(`btnCancel-${id}`);
      if(c){ c.addEventListener('click', ()=> cancelListing(id)); }
    });
  }catch(e){
    console.error(e);
    $('#marketList').innerHTML = '<p class="err">Gagal load listing. Lihat console.</p>';
  }
}

async function renderMarketCard(item){
  const {id, tokenId, price, seller} = item;
  let name = `#${tokenId}`; let img=''; let desc='';
  try{
    const uri = await nft.tokenURI(tokenId);
    const metaUrl = ipfsToHttp(uri);
    const j = await (await fetch(metaUrl)).json();
    name = j.name || name; img = ipfsToHttp(j.image||''); desc = j.description || '';
  }catch(e){}
  const isSeller = account && seller && account.toLowerCase()===String(seller).toLowerCase();
  return `
    <div class="card">
      <img src="${img||''}" alt="NFT ${tokenId}" onerror="this.style.display='none'"/>
      <div class="body">
        <div class="row-between"><strong>${name}</strong><span class="muted">#${tokenId}</span></div>
        <p class="muted" style="min-height:2.2em">${desc}</p>
        <div class="row-between">
          <div>
            <div class="muted small">Listing ID</div>
            <div class="code">${id}</div>
          </div>
          <div style="text-align:right">
            <div class="muted small">Price</div>
            <div><b>${fmt(price)} ETH</b></div>
          </div>
        </div>
        <div style="height:8px"></div>
        ${isSeller
          ? `<button id="btnCancel-${id}" style="background:#ff8080">Cancel</button>`
          : `<button id="btnBuy-${id}">Buy</button>`}
      </div>
    </div>`;
}

// ======================
// BUY / CANCEL
// ======================
async function buyListing(id){
  if(!market || !signer) return alert('Connect wallet dulu!');
  try{
    const L = await market.listings(id);
    const price = L.price ?? L[3];
    if(!price){ alert('Listing price not found'); return; }
    const tx = await market.buy(id, { value: price });
    await tx.wait();
    alert('Purchase success!');
    await loadMarket();
    await loadMyNfts();
  }catch(e){ console.error(e); alert('Buy failed. See console.'); }
}

async function cancelListing(id){
  if(!market || !signer) return alert('Connect wallet dulu!');
  try{
    const tx = await market.cancel(id);
    await tx.wait();
    alert('Canceled');
    await loadMarket();
  }catch(e){ console.error(e); alert('Cancel failed. See console.'); }
}

// ======================
// Bind UI after DOM ready
// ======================
window.addEventListener('DOMContentLoaded', () => {
  // fill contract labels
  $('#nftAddrLabel').textContent = NFT_ADDR;
  $('#marketAddrLabel').textContent = MARKET_ADDR;

  // wire buttons
  $('#btnRefreshMy').addEventListener('click', loadMyNfts);
  $('#btnApprove').addEventListener('click', setApprovalAll);
  $('#btnRefreshMarket').addEventListener('click', loadMarket);
  $('#connectBtn').addEventListener('click', connectWallet);
  $('#disconnectBtn').addEventListener('click', disconnectWallet);

  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', onTab));

  // initial UI
  $('#accountTag').textContent = "Wallet: —";
  $('#networkTag').textContent = "Network: —";
});
