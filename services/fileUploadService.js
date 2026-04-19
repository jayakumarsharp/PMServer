import FileUpload from '../model/Fileupload';
import { securityMaster } from '../model/SecurityMaster';
import fs from "fs";
import csvParser from "csv-parser";

const uploadFile = async (file) => {
    try {
        const newFileUpload = new FileUpload({
            filename: file.filename,
            filepath: file.path,
        });
        await newFileUpload.save();

        fs.createReadStream(file.path)
            .pipe(csvParser())
            .on('data', async (row) => {
                // Check for duplicates by symbol before importing
                const existingRecord = await securityMaster.findOne({ symbol: row.Symbol || row.symbol });
                if (!existingRecord) {
                    const newRecord = new securityMaster({ symbol: row.Symbol || row.symbol });
                    await newRecord.save();
                    console.log(`Imported: ${row.Symbol || row.symbol}`);
                } else {
                    console.log(`Skipping duplicate: ${row.Symbol || row.symbol}`);
                }
            })
            .on('end', () => {
                console.log('Import complete');
            })
            .on('error', (error) => {
                console.error('Error importing data:', error);
            });

        return newFileUpload;
    } catch (error) {
        throw error;
    }
};



// Usage example


export { uploadFile };
