import FileUpload from '../model/fileupload';
//import securityModel from '../model/security';
import fs from "fs";
import csvParser from "csv-parser";

const uploadFile = async (file) => {
    try {
        const newFileUpload = new FileUpload({
            filename: file.filename,
            filepath: file.path, // Store the full path
        });
        await newFileUpload.save();

        console.log(file.path);


        fs.createReadStream(file.path)
            .pipe(csvParser())
            .on('data', async (row) => {
                // Check for duplicates before importing
                const existingRecord = await securityModel.findOne({ name: row.Name });
                if (!existingRecord) {
                    // If record doesn't exist, insert it into MongoDB
                    const newRecord = new securityModel({
                        name: row.Name
                    });
                    await newRecord.save();
                    console.log(`Imported: ${row.Name}`);
                } else {
                    console.log(`Skipping duplicate: ${row.Name}`);
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
        throw error; // Re-throw for controller handling
    }
};



// Usage example


export { uploadFile };
