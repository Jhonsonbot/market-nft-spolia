
// =========================
const NFT_ADDR = "0x4539dA97ddeF6142BCb3259C8a7de703C52cf76B";          // ERC-721 (disarankan ERC721Enumerable)
const MARKET_ADDR = "0xb871eDc06E6FeE83e993e5801fFE5FD9d060697C";       // Marketplace yang kamu deploy

// ABI minimal yang diperlukan
const ERC721_ENUM_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

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

 let currentAccount = null;
 let provider, signer, account;
 let nft, market;

async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask tidak ditemukan!");
      return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    account = await signer.getAddress();

    // 👉 Paksa pindah ke Sepolia
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // 11155111 hex
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0xaa36a7",
            chainName: "Sepolia Test Network",
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://rpc.sepolia.org/"],
            blockExplorerUrls: ["https://sepolia.etherscan.io/"]
          }],
        });
      } else {
        throw switchError;
      }
    }

    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) {
      alert("⚠️ Harus di jaringan Sepolia!");
      return;
    }

    // ✅ Update UI (cek dulu apakah element ada)
    const accTag = document.getElementById("accountTag");
    const netTag = document.getElementById("networkTag");
    if (accTag) accTag.textContent = `Wallet: ${account}`;
    if (netTag) netTag.textContent = `Network: ${network.name} (${network.chainId})`;

    const connectBtn = document.getElementById("connectBtn");
    const disconnectBtn = document.getElementById("disconnectBtn");
    if (connectBtn) connectBtn.style.display = "none";
    if (disconnectBtn) disconnectBtn.style.display = "inline-block";

    // ✅ Inisialisasi kontrak NFT & Market
    nft = new ethers.Contract(NFT_ADDR, ERC721_ENUM_ABI, signer);
    market = new ethers.Contract(MARKET_ADDR, MARKET_ABI, signer);

    console.log("✅ Wallet connected:", account);

    // 👉 Deteksi jumlah NFT user
    let balance = await nft.balanceOf(account);
    console.log(`📦 Kamu punya ${balance.toString()} NFT`);

    if (balance.gt(0)) {
      for (let i = 0; i < balance; i++) {
        let tokenId = await nft.tokenOfOwnerByIndex(account, i);
        console.log(`🎨 NFT ID: ${tokenId.toString()}`);
      }
    } else {
      console.log("❌ Tidak ada NFT di wallet ini.");
    }

  } catch (err) {
    console.error("❌ Wallet connect failed:", err);
    alert("Failed to connect wallet. Check console for details.");
  }
}

function disconnectWallet() {
  // Reset UI
  document.getElementById("accountTag").textContent = "Wallet: —";
  document.getElementById("networkTag").textContent = "Network: —";

  document.getElementById("connectBtn").style.display = "inline-block";
  document.getElementById("disconnectBtn").style.display = "none";

  console.log("✅ Wallet disconnected");
}


  // auto update jika user ganti account di MetaMask
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        document.getElementById("walletButton").innerText =
          "Connected: " + currentAccount.substring(0, 6) + "..." + currentAccount.slice(-4);
      } else {
        document.getElementById("walletButton").innerText = "Connect Wallet";
      }
    });
  }
	
function onTab(e){
  $$('.tab').forEach(t=>t.classList.remove('active'));
  e.currentTarget.classList.add('active');
  const key = e.currentTarget.dataset.tab;
  $('#panel-my').hidden = key !== 'my';
  $('#panel-market').hidden = key !== 'market';
}

// ======================
// APPROVAL
// ======================
async function refreshApprovalBadge(){
  if(!nft || !account) return;
  try {
    const ok = await nft.isApprovedForAll(account, MARKET_ADDR);
    $('#btnApprove').textContent = ok ? 'Approved ✓' : 'Set ApprovalForAll';
    $('#btnApprove').disabled = ok;
  } catch(e){ console.warn(e); }
}

async function setApprovalAll(){
  if(!nft) return;
  try{
    const tx = await nft.setApprovalForAll(MARKET_ADDR, true);
    await tx.wait();
    await refreshApprovalBadge();
    alert('Approval set!');
  }catch(e){ alert('Approval failed'); console.error(e); }
}

// ======================
// LOAD MY NFTS
// ======================
async function loadMyNfts(){
  if(!nft || !account){ $('#myList').innerHTML = '<p class="muted">Connect wallet dulu.</p>'; return; }
  $('#myList').innerHTML = '<p class="muted">Loading…</p>';
  try{
    const bal = await nft.balanceOf(account);
    const total = Number(bal);
    if(total===0){ $('#myList').innerHTML = '<p class="muted">Tidak ada NFT pada koleksi ini.</p>'; return; }

    const items = [];
    for(let i=0;i<total;i++){
      const tokenId = await nft.tokenOfOwnerByIndex(account, i);
      items.push(Number(tokenId));
    }

    const cards = await Promise.all(items.map(renderMyCard));
    $('#myList').innerHTML = cards.join('');

    // attach handlers
    items.forEach(id => {
      const btn = document.getElementById(`btnList-${id}`);
      if(btn){ btn.addEventListener('click', ()=> listToken(id)); }
    });
  }catch(e){
    console.error(e);
    $('#myList').innerHTML = '<p class="err">Gagal load NFT. Pastikan kontrak ERC721Enumerable.</p>';
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
    }catch{}

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
  }catch{
    return `<div class="card"><div class="body">Token ${tokenId}</div></div>`;
  }
}

// ======================
// LIST TOKEN
// ======================
async function listToken(tokenId){
  const priceStr = (document.getElementById(`price-${tokenId}`)?.value || '').trim();
  if(!priceStr){ alert('Isi harga dalam ETH, mis. 0.01'); return; }
  try{
    const wei = ethers.parseEther(priceStr);
    const tx = await market.list(NFT_ADDR, tokenId, wei);
    await tx.wait();
    alert('Listed!');
    await loadMarket();
  }catch(e){
    console.error(e);
    alert('List gagal. Pastikan sudah ApprovalForAll.');
  }
}

// ======================
// LOAD MARKET LISTINGS
// ======================
async function loadMarket(){
  if(!market){ $('#marketList').innerHTML = '<p class="muted">Connect wallet dulu.</p>'; return; }
  $('#marketList').innerHTML = '<p class="muted">Loading…</p>';
  try{
    const nextId = await market.nextListingId();
    const max = Number(nextId);
    const active = [];
    for(let id=1; id<=max; id++){
      const L = await market.listings(id);
      if(L.active && String(L.nft).toLowerCase() === NFT_ADDR.toLowerCase()){
        active.push({id, seller:L.seller, tokenId: Number(L.tokenId), price: L.price});
      }
    }
    if(active.length===0){ $('#marketList').innerHTML = '<p class="muted">Belum ada listing aktif.</p>'; return; }

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
    $('#marketList').innerHTML = '<p class="err">Gagal load listing.</p>';
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
  }catch{}
  const isSeller = account && seller && account.toLowerCase()===seller.toLowerCase();
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
  try{
    const L = await market.listings(id);
    if(!L.active){ alert('Listing tidak aktif'); return; }
    const tx = await market.buy(id, { value: L.price });
    await tx.wait();
    alert('Purchase success!');
    await loadMarket();
    await loadMyNfts();
  }catch(e){ console.error(e); alert('Buy failed'); }
}

async function cancelListing(id){
  try{
    const tx = await market.cancel(id);
    await tx.wait();
    alert('Canceled');
    await loadMarket();
  }catch(e){ console.error(e); alert('Cancel failed'); }
}

