var account;
const myTokenURI = [];
var NFTaddress = "NFT_contract_address";
const pdfFilePath = "pdf_filepath";

async function onclick_download() {
    console.log(myTokenURI.length)
    if(myTokenURI.length == 0) {
        alert("You have not any NFT!!!");
        return;
    }

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        
        a.href = pdfFilePath;
        a.download = "imag.pdf";
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(pdfFilePath);
            document.body.removeChild(a);
        }, 0)
    }
}

$(document).ready(function(){
    web3js = new Web3(web3.currentProvider);
    web3js.eth.getAccounts(async function(err, accounts) {
        if (err != null) {
            alert("Error retrieving accounts.");
            return;
        }
        if (accounts.length == 0) {
            $("#p_walletAddress").css("color", "red")
            $("#p_walletAddress").text("please click Connect button.");
            return;
        }
        else {
            account = accounts[0];
            $("#p_walletAddress").css("color", "#00ffff")
            $("#p_walletAddress").text(account);

            getNFTfromWallet();
        }
    });
});


function onclick_connect() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        console.log('MetaMask Here!');
    }
    if (account == undefined && window.ethereum) {
        const web3 = new Web3(window.ethereum);
        ethereum.enable().then((accounts) => {
            account = accounts[0];
            $("#p_walletAddress").css("color", "#00ffff")
            $("#p_walletAddress").text(account);

            getNFTfromWallet();
        });
    }
}


async function getNFTfromWallet() {
    web3js = new Web3(web3.currentProvider);
    const contract = new web3js.eth.Contract(ABI, NFTaddress);

    const totalSupply = await contract.methods.totalSupply().call();
    const myNFT = await contract.methods.tokensOfOwnerIn(account, 0, totalSupply).call();

    var html = "";

    for(var i = 0; i < myNFT.length; i++) {
        myTokenURI[i] = await contract.methods.tokenURI(myNFT[i]).call();
        myTokenURI[i] = "https://ipfs.io/ipfs/" + myTokenURI[i].split("//")[1];

        html += "<tr id='"+ i +"' onclick='getNFTimage(id)'><td>" + myNFT[i] + "</td><td>" + myTokenURI[i] + "</td></tr>";
    }

    $("#tbody").html(html);
}


function getNFTimage(id) {
    var url = myTokenURI[id]; 

    $.ajax({
        type: "GET",
        url: url,
        success: function(response) {
            const data = response;
            const url = "https://ipfs.io/ipfs/" + data.image.split("//")[1];
            download(url);
        }
    });
}


function download(source){
    const fileName = source.split('/').pop();
    var el = document.createElement("a");
    el.setAttribute("href", source);
    el.setAttribute("download", fileName);
    document.body.appendChild(el);
        el.click();
    el.remove();
}