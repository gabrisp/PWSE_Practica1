
const uploadToPinata = async (blob, fileName) => {

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append('file', blob, fileName);
    const metadata = JSON.stringify({
        name: fileName
    });
    data.append('pinataMetadata', metadata);
    const options = JSON.stringify({
        cidVersion: 0,
    })
    data.append('pinataOptions', options)
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
            }
        });
        if (!response.ok){
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }
        const responseData = await response.json();
        
        return {
            success: true,
            url: `${process.env.PINATA_GATEWAY}${responseData.IpfsHash}`,
            ipfsHash: responseData.IpfsHash
        };
    }catch (error) {
        console.error(`Error al subir el archivo a Pinata: ${error}`);
        throw error;
    }
}

const getFilePinata = async (fileName) => {
    const url = `https://api.pinata.cloud/data/pinList?metadata[name]=${fileName}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
        }
    });
    if (!response.ok) {
        throw new Error(`Error fetching file from Pinata: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("data", data);

    if (data.rows.length === 0) {
        return {
            success: false,
            error: 'File not found in Pinata'
        };
    }

    const ipfsHash = data.rows[0].ipfs_pin_hash;

    return {
        success: true,
        url: `${process.env.PINATA_GATEWAY}${ipfsHash}`,
        ipfsHash: ipfsHash
    };
}

const handlePinata = {
    uploadFile: uploadToPinata,
    getFile: getFilePinata
}
module.exports = handlePinata;