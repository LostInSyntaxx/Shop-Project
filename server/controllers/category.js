

exports.create = async (req, res) => {
    try {
        const { name } = req.body;


        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }


        const category = await prisma.category.create({
            data: { name }
        });


        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.list = async (req, res) => {
    try {

        const categories = await prisma.category.findMany();


        res.status(200).json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate input
        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        // Delete category
        await prisma.category.delete({
            where: { id: parseInt(id) }
        });

        // Send response
        res.status(204).send();
    } catch (err) {
        console.error(err);

        // Handle case where category does not exist
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(500).json({ message: "Server error" });
    }
};