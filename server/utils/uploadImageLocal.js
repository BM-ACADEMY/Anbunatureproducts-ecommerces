import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadImageLocal = async (imageFile, section = 'misc') => {
    try {
        if (!imageFile || !imageFile.buffer) {
            throw new Error('Invalid image file buffer.');
        }

        // Define the base upload directory
        const baseUploadDir = path.join(__dirname, '..', 'uploads');
        
        // Define the section-specific directory
        const sectionDir = path.join(baseUploadDir, section);

        // Ensure directories exist
        if (!fs.existsSync(baseUploadDir)) {
            fs.mkdirSync(baseUploadDir, { recursive: true });
        }
        if (!fs.existsSync(sectionDir)) {
            fs.mkdirSync(sectionDir, { recursive: true });
        }

        // Generate a unique filename with .webp extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}.webp`;
        const filePath = path.join(sectionDir, filename);

        // Convert buffer to webp using sharp and save to file
        await sharp(imageFile.buffer)
            .webp({ quality: 80 })
            .toFile(filePath);

        // Construct the URL to return to the client
        const baseUrl = (process.env.BACKEND_URL || "").replace(/\/$/, "");
        const imageUrl = `${baseUrl}/uploads/${section}/${filename}`;
        
        return {
            url: imageUrl,
            filename: filename,
            section: section
        };

    } catch (error) {
        console.error('Error in uploadImageLocal:', error);
        throw error;
    }
};

export default uploadImageLocal;
