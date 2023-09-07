export const networkCollections = {
  "0xa869": [
    //Add Your Collections here
    {
      image:
        "https://gateway.pinata.cloud/ipfs/QmYKhyd7SrPJQMgDu3jdKxbKFibrHqW9gBSL4uGtWETdv5",
      name: "The Buny Project: Avatars",
      addrs: "0x3d4aa2cb9c19f17fdeef78e0787941b6a1a97014",
    },
    {
      image: "https://buny.us-southeast-1.linodeobjects.com/bunyTv6.jpg",
      name: "TV Buny: Single Image 3d Collection",
      addrs: "0x4b95D68Eff934212f2529AcEFE37D71F6f3188d7",
    },
    {
      image:
        "https://gateway.pinata.cloud/ipfs/QmYKhyd7SrPJQMgDu3jdKxbKFibrHqW9gBSL4uGtWETdv5",
      name: "The Buny Project: Avatars",
      addrs: "0x3d4aa2cb9c19f17fdeef78e0787941b6a1a97014",
    },
  ],
  "0x4": [
    //Add Your Collections here
    {
      image:
        "https://buni.mypinata.cloud/ipfs/Qmb4PbQA3Z1xpcKCnoGdBEwnLZMhGbWQUrWe6TGeAcnLkT",
      name: "The Buny Project",
      addrs: "0xff6f9c17424fda52f1fb8094201f1a4325ccaa05",
    },
  ],

  "0x1": [
    {
      image:
        "https://lh3.googleusercontent.com/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE=s130",
      name: "Crypto Punks",
      addrs: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    },
    {
      image:
        "https://pbs.twimg.com/media/FRyaL9QVsAIOJAw?format=jpg&name=4096x4096",
      name: "DogeClub",
      addrs: "0xFa964aE80da97e4DBCb63bbcf3bB0fFe92a05Cbd",
    },
  ],
};

export const getCollectionsByChain = (chain) => networkCollections[chain];
