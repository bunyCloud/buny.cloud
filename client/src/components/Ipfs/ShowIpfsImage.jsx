function showIPFSImage() {
  // Create the IPFS node instance
  const node = new Ipfs();

  // prepare the node
  node.on("ready", () => {
    // cat to get the image from IPFS, beware it will take a few seconds
    // And you may need to keep that image ready on a small droplet server that will serve as a sort of CDN to your IPFS content
    // if no other node in the IPFS network has it
    node.files.cat(
      "Put the hash of your IPFS image here",
      function (err, file) {
        if (err) {
          throw err;
        }

        // converting the received data into an "image"
        var bytes = new Uint8Array(file);

        var image = document.getElementById("IdOfImage"); // IdOfImage is the id attribute of the img tag in your html page
        image.src = "data:image/png;base64," + encode(bytes);
      },
    );

    // You may need to stop your node if it became unnecessary
    //node.stop(() => {
    // node is now 'offline'
    //})
  });
}

// public method for encoding an Uint8Array to base64
// Shamelessly stolen off some stackoverflow response
function encode(input) {
  var keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
}
