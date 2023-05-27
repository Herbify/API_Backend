const { PrismaClient } = require("@prisma/client");
const { param } = require("../routes");
const { json } = require("express");
const prisma = new PrismaClient();

const getAllProduct = async (req, res) => {
    try {
        const data = await prisma.products.findMany();

        res.json({
            message: "Get All products",
            data,
        });
        console.error("Get All products");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unsuccessful get all products' });
    }

};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.products.findFirstOrThrow({
            where: {
                id: Number(id),
            },
        });

        res.json({
            message: `Success get products by id = ${id}`,
            data,
        });
        console.error('Success get products by id');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unsuccessful get products by id' });
    }

};

const createProduct = async (req, res) => {
    try {
        const { name, ingredient, price, rating, location, url, photo } = req.body;

        // Menyimpan product baru ke database menggunakan Prisma
        const data = await prisma.products.create({
            data: {
                name,
                ingredient,
                price,
                rating,
                location,
                url,
                photo
            },
        });

        res.json({
            message: `Success create product`,
            data,
        });
        console.error("success create product");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Create product was failure' });
    }
};
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, ingredient, price, rating, location, url, photo } = req.body;

        // Mengupdate product dengan Prisma berdasarkan ID
        const data = await prisma.products.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                ingredient,
                price,
                rating,
                location,
                url,
                photo,
            },
        });

        res.json({
            message: `Success edit product = ${id}`,
            data,
        });
        console.error("Success edit product");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Edit product was failure' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete product dengan Prisma berdasarkan ID
        const data = await prisma.products.delete({
            where: {
                id: Number(id),
            },
        });

        res.json({
            message: `Success delete product by id = ${id}`,
            data,
        });
        console.error("Success delete product");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Delete product was failure' });
    }
};

const getProductByIngredient = async (req, res) => {
    try {
        const { id } = req.query;

        const data = await prisma.products.findMany({
            where: {
                AND: [
                    {
                        ...(id[0] ? {
                            ingredient: {
                                path: '$[*].id',
                                array_contains: Number(id[0]),
                            },
                        } : {

                        }),
                    },
                    {
                        ...(id[1] ? {
                            ingredient: {
                                path: '$[*].id',
                                array_contains: Number(id[1]),
                            },
                        } : {

                        }),
                    },
                    {
                        ...(id[2] ? {
                            ingredient: {
                                path: '$[*].id',
                                array_contains: Number(id[2]),
                            },
                        } : {

                        }),
                    },
                    {
                        ...(id[3] ? {
                            ingredient: {
                                path: '$[*].id',
                                array_contains: Number(id[3]),
                            },
                        } : {

                        }),
                    },
                    {
                        ...(id[4] ? {
                            ingredient: {
                                path: '$[*].id',
                                array_contains: Number(id[4]),
                            },
                        } : {

                        }),
                    },
                ]
            },
        });

        res.json({
            message: `Success get products by ingredient`,
            data,
        });

        //const queryCount = Object.keys(req.query).length;
        //let filter = []

        // for (let i = 0; i < queryCount; i++) {
        //     filter.push({
        //         ingredient: {
        //             path: '$[*].id',
        //             array_contains: Number(id[i]),
        //         },
        //     })
        // }
        // const data = await prisma.products.findMany({
        //         where: {
        //             AND: filter,
        //         },
        //     });

        // res.json({
        //     message: `Success get products by ingredient`,
        //     data,
        // });
        // console.error(`Success get products by ingredient : ${data}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unsuccessful get products by ingredient' });
    }
}

module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct,
    getProductByIngredient
};
