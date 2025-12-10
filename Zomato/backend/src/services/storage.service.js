import ImageKit from "imagekit";

// Lazy initialization - only create ImageKit when first needed
let imagekit = null;


function getImageKit() {
    if (!imagekit) {
        
        imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY, 
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
    }
    return imagekit;
}

// receives a file (base64 or buffer), receives a filename, uploads it to ImageKit, returns the uploaded file details 

async function uploadFile(file, fileName) {
    const kit = getImageKit(); // Get instance when needed
    const result = await kit.upload({
        file: file, 
        fileName: fileName 
    });
    return result;
}

export default uploadFile;

/*
A file upload service that uploads files to ImageKit, a cloud storage + CDN provider. 
This file is a "service layer". Service layer means we write a reusable code here, 
controllers can call this service, keeps controllers clean, centralizes all upload logic in one place. 
This is good because if tomorrow if we switch from ImageKit -> AWS S3 -> Cloudinary, 
we only change this ONE file, not your entire app. This is professional best practice.
*/