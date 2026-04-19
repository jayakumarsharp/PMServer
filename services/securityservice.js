
import {securityMaster} from '../model/SecurityMaster';

async function securities() {
    const docs = await securityMaster.find();
    return docs;
}

async function updateSecurity(newData) {
    try {
        // Find the security by id and update it
        const existingSecurity = await securityMaster.findOne({ symbol: newData.symbol });

        if (existingSecurity) {
            // If the security exists, update it
            const updatedSecurity = await securityMaster.findByIdAndUpdate(existingSecurity._id, newData, { new: true });
            
            if (!updatedSecurity) {
                throw new Error('Security not found after update attempt');
            }
    
            return updatedSecurity;
        } else {
            // If the security doesn't exist, create a new one
            console.log(newData);
            const newSecurity = new securityMaster(newData);
            await newSecurity.save();
    
            return newSecurity;
        }
    } catch (error) {
        throw error;
    }
}



async function deleteSecurityById(id) {
    try {
        const deleted = await securityMaster.findByIdAndDelete(id);
        if (!deleted) throw new Error(`Security not found: ${id}`);
        return deleted;
    } catch (err) {
        throw err;
    }
}


export { securities, updateSecurity, deleteSecurityById };