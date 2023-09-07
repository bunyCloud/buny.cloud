const [nfts, setNfts] = useState([]);
const [loadingState, setLoadingState] = useState("not-loaded");
useEffect(() => {
  generateNft();
}, [setNfts]);

async function refreshPage() {
  window.location.reload();
}
async function generateNft() {
  const provider = new ethers.providers.JsonRpcProvider(mainnet);
  const wallet = new ethers.Wallet(key, provider);
  const contract = new ethers.Contract(nftContract, NFTCollection, wallet);
  const itemArray = [];
  contract.totalSupply().then((result) => {
    let totalSup = parseInt(result, 16);

    for (let i = 0; i < displayAmount; i++) {
      var token = i + 1;
      const owner = contract.ownerOf(token);
      const rawUri = contract.tokenURI(token);
      const Uri = Promise.resolve(rawUri);
      const getUri = Uri.then((value) => {
        let str = value;
        let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
        let metadata = axios.get(cleanUri).catch(function (error) {
          console.log(error.toJSON());
        });
        return metadata;
      });
      getUri.then((value) => {
        let rawImg = value.data.image;
        var name = value.data.name;
        var desc = value.data.description;
        let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
        Promise.resolve(owner).then((value) => {
          let ownerW = value;
          let meta = {
            name: name,
            img: image,
            tokenId: token,
            wallet: ownerW,
            desc,
          };
          console.log(meta);
          itemArray.push(meta);
        });
      });
    }
  });
  await new Promise((r) => setTimeout(r, 5000));
  setNfts(itemArray);
  setLoadingState("loaded");
}
