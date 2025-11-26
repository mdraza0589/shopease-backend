import Address from "../../models/Address.js";

/* -------------------- 🏠 ADD ADDRESS -------------------- */
const addAddress = async (req, res) => {
    try {
        const { userId, address, city, pincode, phone, notes } = req.body;

        if (!userId || !address || !city || !pincode || !phone) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }

        const newAddress = new Address({
            userId,
            address,
            city,
            pincode,
            phone,
            notes: notes || "",
        });

        await newAddress.save();

        res.status(201).json({
            success: true,
            message: "Address added successfully!",
            data: newAddress,
        });
    } catch (error) {
        console.error("❌ Error in addAddress:", error);
        res.status(500).json({
            success: false,
            message: "Error adding address!",
        });
    }
};

/* -------------------- 📦 FETCH ALL ADDRESSES -------------------- */
const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required!",
            });
        }

        const addresses = await Address.find({ userId });

        res.status(200).json({
            success: true,
            message: "Addresses fetched successfully!",
            data: addresses,
        });
    } catch (error) {
        console.error("❌ Error in fetchAllAddress:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching addresses!",
        });
    }
};

/* -------------------- ❌ DELETE ADDRESS -------------------- */
const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Address ID are required!",
            });
        }

        const deleted = await Address.findOneAndDelete({
            _id: addressId,
            userId,
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Address not found!",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully!",
        });
    } catch (error) {
        console.error("❌ Error in deleteAddress:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting address!",
        });
    }
};

/* -------------------- ✏️ EDIT ADDRESS -------------------- */
const editAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const { address, city, pincode, phone, notes } = req.body;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Address ID are required!",
            });
        }

        const updated = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            { address, city, pincode, phone, notes },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Address not found!",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address updated successfully!",
            data: updated,
        });
    } catch (error) {
        console.error("❌ Error in editAddress:", error);
        res.status(500).json({
            success: false,
            message: "Error updating address!",
        });
    }
};

export {
    addAddress,
    editAddress,
    fetchAllAddress,
    deleteAddress,
};
