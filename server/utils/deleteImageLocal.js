import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageLocal = async (imageUrl) => {
    return new Promise((resolve, reject) => {
        try {
            if (!imageUrl) {
                return resolve(true); // Nothing to delete
            }

            // We want to handle both full URLs (http://localhost:8080/uploads/xxx) and relative paths
            let relativePath = imageUrl;
            try {
                const parsedUrl = new URL(imageUrl);
                relativePath = parsedUrl.pathname;
            } catch (e) {
                // Not a valid absolute URL, assume it's already a path
            }
            
            relativePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
            
            // Construct the absolute path
            // The __dirname here is 'server/utils'
            // We need to point to 'server/' + relativePath
            const absolutePath = path.join(__dirname, '..', relativePath);

            // Check if file exists before trying to delete
            if (fs.existsSync(absolutePath)) {
                fs.unlink(absolutePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file at ${absolutePath}:`, err);
                        // We resolve anyway to not break the application flow, but log the error
                        return resolve(false);
                    }
                    console.log(`Successfully deleted file at ${absolutePath}`);
                    resolve(true);
                });
            } else {
                resolve(true); // File didn't exist, treat as success
            }
        } catch (error) {
            console.error('Error in deleteImageLocal:', error);
            resolve(false); // Resolve instead of reject to prevent crashing main flows
        }
    });
};

export default deleteImageLocal;
