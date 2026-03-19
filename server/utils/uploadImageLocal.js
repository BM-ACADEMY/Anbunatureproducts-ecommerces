import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadImageLocal = async (imageFile, section = 'misc') => {
    return new Promise((resolve, reject) => {
        try {
            if (!imageFile || !imageFile.buffer) {
                return reject(new Error('Invalid image file buffer.'));
            }

            // Define the base upload directory
            const baseUploadDir = path.join(__dirname, '..', 'uploads');
            
            // Define the section-specific directory
            const sectionDir = path.join(baseUploadDir, section);

            // Ensure directories exist
            if (!fs.existsSync(baseUploadDir)) {
                fs.mkdirSync(baseUploadDir);
            }
            if (!fs.existsSync(sectionDir)) {
                fs.mkdirSync(sectionDir);
            }

            // Generate a unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const originalName = imageFile.originalname || 'image.png';
            const ext = path.extname(originalName);
            const filename = `${uniqueSuffix}${ext}`;
            const filePath = path.join(sectionDir, filename);

            // Write the buffer to the file system
            fs.writeFile(filePath, imageFile.buffer, (err) => {
                if (err) {
                    return reject(err);
                }
                
                // Construct the URL to return to the client
                const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 8080}`;
                const imageUrl = `${baseUrl}/uploads/${section}/${filename}`;
                
                resolve({
                    url: imageUrl,
                    filename: filename,
                    section: section
                });
            });

        } catch (error) {
            reject(error);
        }
    });
};

export default uploadImageLocal;
